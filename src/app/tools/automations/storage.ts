import type { Automation, AutomationExportFormat, ActionType } from "./types"
import { generateAutomationId } from "./types"

const STORAGE_KEY = "automations_v1"

export async function loadAutomations(): Promise<Automation[]> {
  const raw = await figma.clientStorage.getAsync(STORAGE_KEY)
  if (!Array.isArray(raw)) return []
  return raw.filter(isValidAutomation)
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

export function automationToExportJson(automation: Automation): string {
  const exportData: AutomationExportFormat = {
    version: 1,
    automation: {
      name: automation.name,
      steps: automation.steps.map((s) => ({
        actionType: s.actionType,
        params: s.params,
        enabled: s.enabled,
      })),
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
        .map((s: any, i: number) => ({
          id: `step_${now}_${i}`,
          actionType: s.actionType as ActionType,
          params: s.params ?? {},
          enabled: s.enabled !== false,
        })),
      createdAt: now,
      updatedAt: now,
    }
  } catch {
    return null
  }
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
