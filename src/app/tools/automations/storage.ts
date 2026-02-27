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

export async function duplicateAutomation(id: string): Promise<Automation | null> {
  const source = await getAutomation(id)
  if (!source) return null
  const now = Date.now()
  const clone: Automation = {
    id: generateAutomationId(),
    name: `${source.name} (copy)`,
    steps: JSON.parse(JSON.stringify(source.steps)),
    createdAt: now,
    updatedAt: now,
  }
  await saveAutomation(clone)
  return clone
}

export function createNewAutomation(name?: string): Automation {
  const now = Date.now()
  return {
    id: generateAutomationId(),
    name: name ?? "New workflow",
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
  if (s.target) out.target = s.target
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
  if (typeof s.target === "string" && s.target) {
    step.target = s.target
  }
  if (Array.isArray(s.children) && s.children.length > 0) {
    step.children = s.children
      .filter((c: any) => c && typeof c === "object" && typeof c.actionType === "string")
      .map((c: any) => importStep(c))
  }
  return step
}

const ACTION_TYPE_MIGRATIONS: Record<string, ActionType> = {
  selectByType: "filter",
  findByType: "filter",
  selectByName: "filter",
  filterByType: "filter",
  filterByName: "filter",
}

const OUTPUT_NAME_MIGRATIONS: Record<string, string> = {
  sourceFromSelection: "selection",
  sourceFromPage: "page",
  filterByType: "filtered",
  filterByName: "filtered",
  expandToChildren: "children",
  goToParent: "parent",
  flattenDescendants: "descendants",
  restoreNodes: "restored",
  renameLayers: "renamed",
  setFillColor: "filled",
  setFillVariable: "filled",
  setOpacity: "nodes",
  setCharacters: "texts",
  resize: "resized",
  wrapInFrame: "frames",
  addAutoLayout: "layouts",
  editAutoLayout: "layouts",
  removeAutoLayout: "nodes",
  setPosition: "positioned",
  askForInput: "input",
  setPipelineVariable: "variable",
  setPipelineVariableFromProperty: "property",
  splitText: "parts",
  notify: "notification",
  selectResults: "selected",
  log: "log",
  count: "count",
}

function migrateStep(step: AutomationStep): AutomationStep {
  let migrated = step

  // Phase 1 legacy: setLayoutMode
  if (step.actionType === ("setLayoutMode" as ActionType)) {
    const mode = String(step.params.layoutMode ?? "VERTICAL")
    if (mode === "NONE") {
      migrated = { ...step, actionType: "removeAutoLayout" as ActionType, params: {} }
    } else {
      migrated = { ...step, actionType: "addAutoLayout" as ActionType, params: { direction: mode } }
    }
  }

  // Phase 3: convert filterByType/filterByName to unified filter
  if (step.actionType === ("filterByType" as ActionType) || step.actionType === ("selectByType" as ActionType) || step.actionType === ("findByType" as ActionType)) {
    migrated = {
      ...migrated,
      actionType: "filter",
      params: {
        logic: "and",
        conditions: [{ field: "type", operator: "equals", value: String(step.params.nodeType ?? "TEXT") }],
      },
    }
  }

  if (step.actionType === ("filterByName" as ActionType) || step.actionType === ("selectByName" as ActionType)) {
    const matchMode = String(step.params.matchMode ?? "contains")
    migrated = {
      ...migrated,
      actionType: "filter",
      params: {
        logic: "and",
        conditions: [{ field: "name", operator: matchMode, value: String(step.params.pattern ?? "") }],
      },
    }
  }

  // Phase 3: migrate output names from verb-style to noun-style
  if (migrated.outputName) {
    const baseMatch = migrated.outputName.match(/^([a-zA-Z]+?)(-\d+)?$/)
    if (baseMatch) {
      const baseName = baseMatch[1]
      const suffix = baseMatch[2] ?? ""
      if (OUTPUT_NAME_MIGRATIONS[baseName]) {
        migrated = { ...migrated, outputName: OUTPUT_NAME_MIGRATIONS[baseName] + suffix }
      }
    }
  }

  // Migrate children recursively
  if (migrated.children && migrated.children.length > 0) {
    const migratedChildren = migrated.children.map(migrateStep)
    if (migratedChildren.some((c, i) => c !== migrated.children![i])) {
      migrated = { ...migrated, children: migratedChildren }
    }
  }

  return migrated
}

const BARE_REF_PARAMS = new Set(["sourceVar", "source", "snapshotName"])

function migrateTokenReferences(step: AutomationStep, nameMap: Map<string, string>): AutomationStep {
  if (nameMap.size === 0) return step

  let changed = false
  const newParams: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(step.params)) {
    if (typeof value === "string") {
      let replaced = value

      if (BARE_REF_PARAMS.has(key) && nameMap.has(replaced)) {
        replaced = nameMap.get(replaced)!
      }

      nameMap.forEach((newName, oldName) => {
        replaced = replaced.split(`{#${oldName}.`).join(`{#${newName}.`)
        replaced = replaced.split(`{$${oldName}}`).join(`{$${newName}}`)
      })
      newParams[key] = replaced
      if (replaced !== value) changed = true
    } else {
      newParams[key] = value
    }
  }

  // Migrate target reference
  let newTarget = step.target
  if (step.target && nameMap.has(step.target)) {
    newTarget = nameMap.get(step.target)
    changed = true
  }

  if (!changed) return step
  return { ...step, params: newParams, target: newTarget }
}

function migrateAutomation(automation: Automation): Automation {
  let changed = false

  // First pass: migrate step types and output names
  const steps = automation.steps.map((step) => {
    const migrated = migrateStep(step)
    if (migrated !== step) changed = true
    return migrated
  })

  // Build name mapping from old to new output names
  const nameMap = new Map<string, string>()
  for (let i = 0; i < automation.steps.length; i++) {
    const oldName = automation.steps[i].outputName
    const newName = steps[i].outputName
    if (oldName && newName && oldName !== newName) {
      nameMap.set(oldName, newName)
    }
  }

  // Second pass: migrate token references
  if (nameMap.size > 0) {
    for (let i = 0; i < steps.length; i++) {
      const migrated = migrateTokenReferences(steps[i], nameMap)
      if (migrated !== steps[i]) {
        steps[i] = migrated
        changed = true
      }
    }
  }

  return changed ? { ...automation, steps } : automation
}

function migrateActionType(actionType: string): ActionType {
  if (actionType === "setLayoutMode") return "addAutoLayout"
  return (ACTION_TYPE_MIGRATIONS[actionType] ?? actionType) as ActionType
}

function migrateParams(
  actionType: ActionType,
  params: Record<string, unknown>,
): Record<string, unknown> {
  if (actionType === "filter" && params.nodeType) {
    return {
      logic: "and",
      conditions: [{ field: "type", operator: "equals", value: String(params.nodeType) }],
    }
  }
  if (actionType === "filter" && params.pattern) {
    return {
      logic: "and",
      conditions: [{ field: "name", operator: String(params.matchMode ?? "contains"), value: String(params.pattern) }],
    }
  }
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
