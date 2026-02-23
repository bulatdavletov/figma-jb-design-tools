import type { Automation, AutomationStep, AutomationExportFormat, AutomationExportStepFormat, ActionType } from "./types"
import { generateAutomationId, generateStepId } from "./types"

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

export function createNewAutomation(name?: string): Automation {
  const now = Date.now()
  return {
    id: generateAutomationId(),
    name: name ?? "New automation",
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
  if (s.children && s.children.length > 0) {
    out.children = s.children.map(stepToExportStep)
  }
  return out
}

export function automationToExportJson(automation: Automation): string {
  const exportData: AutomationExportFormat = {
    version: 1,
    automation: {
      name: automation.name,
      steps: automation.steps.map(stepToExportStep),
    },
  }
  return JSON.stringify(exportData, null, 2)
}

export function parseImportJson(jsonText: string): Automation | null {
  try {
    const data = JSON.parse(jsonText)
    if (!data || typeof data !== "object") return null
    if (data.version !== 1) return null
    if (!data.automation || typeof data.automation !== "object") return null
    const { name, steps } = data.automation
    if (typeof name !== "string" || !Array.isArray(steps)) return null

    const now = Date.now()
    return {
      id: generateAutomationId(),
      name,
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
    actionType: migrateActionType(s.actionType),
    params: migrateParams(migrateActionType(s.actionType), s.params ?? {}),
    enabled: s.enabled !== false,
  }
  if (typeof s.outputName === "string" && s.outputName) {
    step.outputName = s.outputName
  }
  if (Array.isArray(s.children) && s.children.length > 0) {
    step.children = s.children
      .filter((c: any) => c && typeof c === "object" && typeof c.actionType === "string")
      .map((c: any) => importStep(c))
  }
  return step
}

const ACTION_TYPE_MIGRATIONS: Record<string, ActionType> = {
  selectByType: "filterByType",
  findByType: "filterByType",
  selectByName: "filterByName",
}

function migrateAutomation(automation: Automation): Automation {
  let changed = false
  const steps = automation.steps.map((step) => {
    const newType = ACTION_TYPE_MIGRATIONS[step.actionType]
    if (newType) {
      changed = true
      return {
        ...step,
        actionType: newType,
        params: migrateParams(newType, step.params),
      }
    }
    return step
  })
  return changed ? { ...automation, steps } : automation
}

function migrateActionType(actionType: string): ActionType {
  return (ACTION_TYPE_MIGRATIONS[actionType] ?? actionType) as ActionType
}

function migrateParams(
  _actionType: ActionType,
  params: Record<string, unknown>,
): Record<string, unknown> {
  return params
}

function isValidAutomation(value: unknown): value is Automation {
  if (!value || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.steps) &&
    typeof obj.createdAt === "number" &&
    typeof obj.updatedAt === "number"
  )
}
