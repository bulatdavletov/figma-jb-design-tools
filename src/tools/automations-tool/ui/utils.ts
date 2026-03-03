import type { ActionType, AutomationStep } from "../types"
import type { AutomationStepPayload } from "../../../home/messages"
import type { StepPath, StepPathSegment, ChildBranch } from "./types"

function isRootSegment(s: StepPathSegment): s is { rootIndex: number } {
  return "rootIndex" in s
}

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
  if (s.input) payload.input = s.input
  if (s.children && s.children.length > 0) {
    payload.children = s.children.map(stepToPayload)
  }
  if (s.elseChildren && s.elseChildren.length > 0) {
    payload.elseChildren = s.elseChildren.map(stepToPayload)
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
  if (s.input) step.input = s.input
  else if ((s as AutomationStepPayload & { target?: string }).target) step.input = (s as AutomationStepPayload & { target?: string }).target
  if (s.children && s.children.length > 0) {
    step.children = s.children.map(payloadToStep)
  }
  if (s.elseChildren && s.elseChildren.length > 0) {
    step.elseChildren = s.elseChildren.map(payloadToStep)
  }
  return step
}

export function stepsPathEqual(a: StepPath | null, b: StepPath | null): boolean {
  if (!a || !b) return a === b
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const x = a[i]
    const y = b[i]
    if (isRootSegment(x) && isRootSegment(y)) {
      if (x.rootIndex !== y.rootIndex) return false
    } else if (!isRootSegment(x) && !isRootSegment(y)) {
      if (x.childIndex !== y.childIndex || (x.childBranch ?? "then") !== (y.childBranch ?? "then")) return false
    } else {
      return false
    }
  }
  return true
}

export function getStepAtPath(
  steps: AutomationStepPayload[],
  path: StepPath,
): AutomationStepPayload | null {
  if (path.length === 0) return null
  const first = path[0]
  if (!isRootSegment(first)) return null
  let step: AutomationStepPayload | undefined = steps[first.rootIndex]
  if (!step) return null
  for (let i = 1; i < path.length; i++) {
    const seg = path[i]
    if (isRootSegment(seg)) return null
    const branch: ChildBranch = seg.childBranch ?? "then"
    const arr: AutomationStepPayload[] = branch === "else" ? (step.elseChildren ?? []) : (step.children ?? [])
    step = arr[seg.childIndex]
    if (!step) return null
  }
  return step
}

export function getParentStepAtPath(
  steps: AutomationStepPayload[],
  path: StepPath,
): AutomationStepPayload | null {
  if (path.length <= 1) return null
  return getStepAtPath(steps, path.slice(0, -1))
}

export function pathExtend(path: StepPath, childIndex: number, childBranch?: ChildBranch): StepPath {
  return [...path, { childIndex, childBranch }]
}

export function pathRoot(rootIndex: number): StepPath {
  return [{ rootIndex }]
}

export function pathParent(path: StepPath): StepPath | null {
  if (path.length <= 1) return null
  return path.slice(0, -1)
}

/** Top-level step index for run-to-step and similar. */
export function pathRootIndex(path: StepPath): number {
  if (path.length === 0) return -1
  const first = path[0]
  return isRootSegment(first) ? first.rootIndex : -1
}

export function getChildArray(step: AutomationStepPayload, branch: ChildBranch): AutomationStepPayload[] {
  return branch === "else" ? (step.elseChildren ?? []) : (step.children ?? [])
}

function setStepAtPathInStep(
  step: AutomationStepPayload,
  pathTail: { childIndex: number; childBranch?: ChildBranch }[],
  newStep: AutomationStepPayload,
): AutomationStepPayload {
  if (pathTail.length === 0) return step
  const seg = pathTail[0]
  const branch: ChildBranch = seg.childBranch ?? "then"
  const arr = getChildArray(step, branch)
  if (pathTail.length === 1) {
    const newArr = arr.map((s, i) => (i === seg.childIndex ? newStep : s))
    return branch === "else" ? { ...step, elseChildren: newArr } : { ...step, children: newArr }
  }
  const child = arr[seg.childIndex]
  const newChild = setStepAtPathInStep(child, pathTail.slice(1), newStep)
  const newArr = arr.map((s, i) => (i === seg.childIndex ? newChild : s))
  return branch === "else" ? { ...step, elseChildren: newArr } : { ...step, children: newArr }
}

/** Replace the step at path with the result of updater(currentStep). Returns new root steps array. */
export function updateStepAtPath(
  steps: AutomationStepPayload[],
  path: StepPath,
  updater: (step: AutomationStepPayload) => AutomationStepPayload,
): AutomationStepPayload[] {
  if (path.length === 0) return steps
  const first = path[0]
  if (!isRootSegment(first)) return steps
  const rootIdx = first.rootIndex
  const rootStep = steps[rootIdx]
  if (!rootStep) return steps
  const current = getStepAtPath(steps, path)
  if (!current) return steps
  const pathTail = path.slice(1) as { childIndex: number; childBranch?: ChildBranch }[]
  const newRoot =
    path.length === 1 ? updater(rootStep) : setStepAtPathInStep(rootStep, pathTail, updater(current))
  return steps.map((s, i) => (i === rootIdx ? newRoot : s))
}

/** Append newStep as a child of the step at parentPath, under branch. Returns new root steps array. */
export function insertChildAtPath(
  steps: AutomationStepPayload[],
  parentPath: StepPath,
  branch: ChildBranch,
  newStep: AutomationStepPayload,
): AutomationStepPayload[] {
  const parent = getStepAtPath(steps, parentPath)
  if (!parent) return steps
  const arr = [...getChildArray(parent, branch), newStep]
  const newParent = branch === "else" ? { ...parent, elseChildren: arr } : { ...parent, children: arr }
  return updateStepAtPath(steps, parentPath, () => newParent)
}

/** Remove the step at path. Returns new root steps array. */
export function removeStepAtPath(
  steps: AutomationStepPayload[],
  path: StepPath,
): AutomationStepPayload[] {
  if (path.length === 0) return steps
  const last = path[path.length - 1]
  if (isRootSegment(last)) {
    const idx = last.rootIndex
    return steps.filter((_, i) => i !== idx)
  }
  const parentPath = pathParent(path)
  if (!parentPath) return steps
  const parent = getStepAtPath(steps, parentPath)
  if (!parent) return steps
  const branch: ChildBranch = last.childBranch ?? "then"
  const arr = getChildArray(parent, branch)
  const newArr = arr.filter((_, i) => i !== last.childIndex)
  const newParent = branch === "else" ? { ...parent, elseChildren: newArr.length ? newArr : undefined } : { ...parent, children: newArr.length ? newArr : undefined }
  return updateStepAtPath(steps, parentPath, () => newParent)
}

/** Move the step at path by direction (-1 or 1) within its siblings. Returns new root steps array. */
export function moveStepAtPath(
  steps: AutomationStepPayload[],
  path: StepPath,
  direction: -1 | 1,
): AutomationStepPayload[] {
  if (path.length === 0) return steps
  const last = path[path.length - 1]
  if (isRootSegment(last)) {
    const idx = last.rootIndex
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= steps.length) return steps
    const next = [...steps]
    const t = next[idx]
    next[idx] = next[newIdx]
    next[newIdx] = t
    return next
  }
  const parentPath = pathParent(path)
  if (!parentPath) return steps
  const parent = getStepAtPath(steps, parentPath)
  if (!parent) return steps
  const branch: ChildBranch = last.childBranch ?? "then"
  const arr = getChildArray(parent, branch)
  const i = last.childIndex
  const newIdx = i + direction
  if (newIdx < 0 || newIdx >= arr.length) return steps
  const newArr = [...arr]
  const t = newArr[i]
  newArr[i] = newArr[newIdx]
  newArr[newIdx] = t
  const newParent = branch === "else" ? { ...parent, elseChildren: newArr } : { ...parent, children: newArr }
  return updateStepAtPath(steps, parentPath, () => newParent)
}
