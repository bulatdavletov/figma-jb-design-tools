import type { ActionType, AutomationStep } from "../types"
import type { AutomationStepPayload } from "../../../home/messages"
import type { StepPath } from "./types"

export function postMessage(msg: object) {
  parent.postMessage({ pluginMessage: msg }, "*")
}

export function safeDropdownValue(value: string, options: { value: string }[]): string {
  return options.some((o) => o.value === value) ? value : options[0]?.value ?? ""
}

export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function stepToPayload(s: AutomationStep): AutomationStepPayload {
  const payload: AutomationStepPayload = {
    id: s.id,
    actionType: s.actionType,
    params: s.params,
    enabled: s.enabled,
  }
  if (s.outputName) payload.outputName = s.outputName
  if (s.target) payload.target = s.target
  if (s.children && s.children.length > 0) {
    payload.children = s.children.map(stepToPayload)
  }
  return payload
}

export function payloadToStep(s: AutomationStepPayload): AutomationStep {
  const step: AutomationStep = {
    id: s.id,
    actionType: s.actionType as ActionType,
    params: s.params,
    enabled: s.enabled,
  }
  if (s.outputName) step.outputName = s.outputName
  if (s.target) step.target = s.target
  if (s.children && s.children.length > 0) {
    step.children = s.children.map(payloadToStep)
  }
  return step
}

export function stepsPathEqual(a: StepPath | null, b: StepPath | null): boolean {
  if (!a || !b) return a === b
  return a.index === b.index && a.childIndex === b.childIndex && (a.childBranch ?? "then") === (b.childBranch ?? "then")
}
