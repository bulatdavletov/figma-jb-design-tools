import type { Automation, AutomationStep, AutomationExportFormat, AutomationExportAllFormat, AutomationExportStepFormat, ActionType } from "./types"
import { generateAutomationId, generateStepId } from "./types"
import { AUTOMATION_EMOJIS } from "./emoji"

const STORAGE_KEY = "automations_v1"

export async function loadAutomations(): Promise<Automation[]> {
  const raw = await figma.clientStorage.getAsync(STORAGE_KEY)
  if (!Array.isArray(raw)) return []
  const automations = raw.filter(isValidAutomation)
  const migrated = automations.map(migrateAutomation)
  if (migrated.some((a, i) => a !== automations[i])) {
    await figma.clientStorage.setAsync(STORAGE_KEY, migrated)
  }
  return migrated
}

export async function saveAutomations(automations: Automation[]): Promise<void> {
  await figma.clientStorage.setAsync(STORAGE_KEY, automations)
}

export async function getAutomation(id: string): Promise<Automation | null> {
  const all = await loadAutomations()
  return all.find((a) => a.id === id) ?? null
}

export async function saveAutomation(automation: Automation): Promise<void> {
  const all = await loadAutomations()
  const idx = all.findIndex((a) => a.id === automation.id)
  if (idx >= 0) {
    all[idx] = automation
  } else {
    all.push(automation)
  }
  await saveAutomations(all)
}

export async function deleteAutomation(id: string): Promise<void> {
  const all = await loadAutomations()
  await saveAutomations(all.filter((a) => a.id !== id))
}

export async function duplicateAutomation(id: string): Promise<Automation | null> {
  const source = await getAutomation(id)
  if (!source) return null
  const now = Date.now()
  const clone: Automation = {
    id: generateAutomationId(),
    name: `${source.name} (copy)`,
    emoji: source.emoji,
    steps: JSON.parse(JSON.stringify(source.steps)),
    createdAt: now,
    updatedAt: now,
  }
  await saveAutomation(clone)
  return clone
}

export function createNewAutomation(name?: string): Automation {
  const now = Date.now()
  const defaultEmoji = AUTOMATION_EMOJIS[0] ?? "🤖"
  return {
    id: generateAutomationId(),
    name: name ?? "New automation",
    emoji: defaultEmoji,
    steps: [],
    createdAt: now,
    updatedAt: now,
  }
}

function stepToExportStep(s: AutomationStep): AutomationExportStepFormat {
  const out: AutomationExportStepFormat = {
    actionType: s.actionType,
    params: s.params,
    enabled: s.enabled,
  }
  if (s.outputName) out.outputName = s.outputName
  if (s.input) out.input = s.input
  if (s.children && s.children.length > 0) {
    out.children = s.children.map(stepToExportStep)
  }
  if (s.elseChildren && s.elseChildren.length > 0) {
    out.elseChildren = s.elseChildren.map(stepToExportStep)
  }
  return out
}

export function automationToExportJson(automation: Automation): string {
  const exportData: AutomationExportFormat = {
    version: 1,
    automation: {
      name: automation.name,
      ...(typeof automation.emoji === "string" ? { emoji: automation.emoji } : {}),
      steps: automation.steps.map(stepToExportStep),
    },
  }
  return JSON.stringify(exportData, null, 2)
}

export function allAutomationsToExportJson(automations: Automation[]): string {
  const exportData: AutomationExportAllFormat = {
    version: 1,
    automations: automations.map((a) => ({
      name: a.name,
      ...(typeof a.emoji === "string" ? { emoji: a.emoji } : {}),
      steps: a.steps.map(stepToExportStep),
    })),
  }
  return JSON.stringify(exportData, null, 2)
}

export function parseImportAllJson(jsonText: string): Automation[] | null {
  try {
    const data = JSON.parse(jsonText)
    if (!data || typeof data !== "object") return null
    if (data.version !== 1) return null
    if (!Array.isArray(data.automations)) return null

    return data.automations
      .filter((a: any) => a && typeof a === "object" && typeof a.name === "string" && Array.isArray(a.steps))
      .map((a: any) => {
        const now = Date.now()
        return {
          id: generateAutomationId(),
          name: a.name,
          ...(typeof a.emoji === "string" ? { emoji: a.emoji } : {}),
          steps: a.steps
            .filter((s: any) => s && typeof s === "object" && typeof s.actionType === "string" && typeof s.params === "object")
            .map((s: any) => importStep(s)),
          createdAt: now,
          updatedAt: now,
        } as Automation
      })
  } catch {
    return null
  }
}

export function parseImportJson(jsonText: string): Automation | null {
  try {
    const data = JSON.parse(jsonText)
    if (!data || typeof data !== "object") return null
    if (data.version !== 1) return null
    if (!data.automation || typeof data.automation !== "object") return null
    const { name, steps, emoji } = data.automation
    if (typeof name !== "string" || !Array.isArray(steps)) return null

    const now = Date.now()
    return {
      id: generateAutomationId(),
      name,
      ...(typeof emoji === "string" ? { emoji } : {}),
      steps: steps
        .filter(
          (s: any) =>
            s &&
            typeof s === "object" &&
            typeof s.actionType === "string" &&
            typeof s.params === "object"
        )
        .map((s: any) => importStep(s)),
      createdAt: now,
      updatedAt: now,
    }
  } catch {
    return null
  }
}

function importStep(s: any): AutomationStep {
  const step: AutomationStep = {
    id: generateStepId(),
    actionType: s.actionType as ActionType,
    params: typeof s.params === "object" && s.params !== null ? s.params : {},
    enabled: s.enabled !== false,
  }
  if (typeof s.outputName === "string" && s.outputName) {
    step.outputName = s.outputName
  }
  if (typeof s.input === "string" && s.input) {
    step.input = s.input
  } else if (typeof s.target === "string" && s.target) {
    step.input = s.target
  }
  if (Array.isArray(s.children) && s.children.length > 0) {
    step.children = s.children
      .filter((c: any) => c && typeof c === "object" && typeof c.actionType === "string")
      .map((c: any) => importStep(c))
  }
  if (Array.isArray(s.elseChildren) && s.elseChildren.length > 0) {
    step.elseChildren = s.elseChildren
      .filter((c: any) => c && typeof c === "object" && typeof c.actionType === "string")
      .map((c: any) => importStep(c))
  }
  return step
}

function migrateStep(step: AutomationStep): AutomationStep {
  let migrated = step
  if (migrated.children && migrated.children.length > 0) {
    const migratedChildren = migrated.children.map(migrateStep)
    if (migratedChildren.some((c, i) => c !== migrated.children![i])) {
      migrated = { ...migrated, children: migratedChildren }
    }
  }
  if (migrated.elseChildren && migrated.elseChildren.length > 0) {
    const migratedElse = migrated.elseChildren.map(migrateStep)
    if (migratedElse.some((c, i) => c !== migrated.elseChildren![i])) {
      migrated = { ...migrated, elseChildren: migratedElse }
    }
  }
  return migrated
}

function migrateAutomation(automation: Automation): Automation {
  let changed = false
  let emoji = automation.emoji
  if (typeof emoji !== "string") {
    emoji = AUTOMATION_EMOJIS[0] ?? "🤖"
    changed = true
  }
  const steps = automation.steps.map((step) => {
    const migrated = migrateStep(step)
    if (migrated !== step) changed = true
    return migrated
  })
  return changed ? { ...automation, emoji, steps } : automation
}

function isValidAutomation(value: unknown): value is Automation {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    (obj.emoji === undefined || typeof obj.emoji === "string") &&
    Array.isArray(obj.steps) &&
    typeof obj.createdAt === "number" &&
    typeof obj.updatedAt === "number"
  )
}
