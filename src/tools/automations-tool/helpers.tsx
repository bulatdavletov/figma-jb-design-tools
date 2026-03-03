import { h, Fragment } from "preact"
import { ACTION_DEFINITIONS } from "./types"
import { PROPERTY_REGISTRY } from "./properties"
import type { AutomationStepPayload } from "../../home/messages"
import type { AutomationsRunResult } from "../../home/messages"
import type { Suggestion } from "../../components/TokenInput"
import { TokenText } from "../../components/TokenPill"
import { stripTokenSyntax } from "../../components/TokenPill"
import { Text, VerticalSpace } from "@create-figma-plugin/ui"
import { plural } from "../../utils/pluralize"
import type { StepPath } from "./ui/types"
import { getStepAtPath, getParentStepAtPath } from "./ui/utils"

export function getParamSummary(step: AutomationStepPayload): string {
  const p = step.params
  switch (step.actionType) {
    case "sourceFromSelection":
    case "sourceFromPage":
    case "sourceFromAllPages":
      return ""
    case "sourceFromPageByName":
      return String(p.pageName ?? "")
    case "sourceFromLocalVariables": {
      const prefix = String(p.namePrefix ?? "").trim()
      const type = String(p.variableType ?? "COLOR")
      return prefix ? `prefix "${prefix}", ${type}` : type
    }
    case "filter":
    case "filterByType":
    case "filterByName": {
      const conditions = (p.conditions ?? []) as { field: string; operator: string; value: unknown }[]
      if (conditions.length === 0) {
        if (p.nodeType) return `type = ${p.nodeType}`
        if (p.pattern) return `name ~ "${p.pattern}"`
        return ""
      }
      const logic = String(p.logic ?? "and").toUpperCase()
      const parts = conditions.map((c) => {
        const opSymbol = c.operator === "contains" ? "~" : c.operator === "startsWith" ? "^" : c.operator === "endsWith" ? "$" : c.operator === "regex" ? "≈" : c.operator === "greaterThan" ? ">" : c.operator === "lessThan" ? "<" : c.operator === "is" || c.operator === "equals" ? "=" : c.operator === "isNot" || c.operator === "notEquals" ? "≠" : c.operator
        return `${c.field} ${opSymbol} ${String(c.value)}`
      })
      return conditions.length > 1 ? `${logic}: ${parts.join(", ")}` : parts[0]
    }
    case "expandToChildren":
      return ""
    case "renameLayers":
      return `"${p.find ?? ""}" → "${p.replace ?? ""}"`
    case "setName":
      return String(p.name ?? "")
    case "setFillColor":
    case "setStrokeColor":
      return String(p.hex ?? "")
    case "setFillVariable":
      return String(p.variableName ?? "")
    case "union":
      return ""
    case "removeFills":
    case "removeStrokes":
      return ""
    case "setOpacity":
      return `${p.opacity ?? 100}%`
    case "setVisibility":
      return p.visible === false ? "hidden" : "visible"
    case "setLocked":
      return p.locked === false ? "unlocked" : "locked"
    case "setRotation":
      return `${p.degrees ?? "0"}°`
    case "removeNode":
      return ""
    case "cloneNode":
      return ""
    case "notify":
    case "log":
      return String(p.message ?? "")
    case "count":
      return String(p.label ?? "Count")
    case "selectResults":
      return ""
    case "setPipelineVariable":
      return p.variableName ? `{$${p.variableName}} = ${p.value ?? ""}` : ""
    case "setPipelineVariableFromProperty":
      return p.variableName ? `{$${p.variableName}} ← ${p.property ?? "name"}` : ""
    case "goToParent":
    case "flattenDescendants":
      return ""
    case "setCharacters":
      return String(p.characters ?? "")
    case "setFontSize":
      return `${p.size ?? "16"}px`
    case "setFont":
      return `${p.family ?? "Inter"} ${p.style ?? "Regular"}`
    case "setTextAlignment":
      return String(p.align ?? "LEFT")
    case "setTextCase":
      return String(p.textCase ?? "ORIGINAL")
    case "setTextDecoration":
      return String(p.decoration ?? "NONE")
    case "setLineHeight": {
      const u = String(p.unit ?? "AUTO")
      if (u === "AUTO") return "AUTO"
      return `${p.value ?? ""}${u === "PERCENT" ? "%" : "px"}`
    }
    case "resize": {
      const parts: string[] = []
      if (p.width) parts.push(`W: ${p.width}`)
      if (p.height) parts.push(`H: ${p.height}`)
      return parts.join(", ")
    }
    case "setPosition": {
      const posParts: string[] = []
      if (p.x) posParts.push(`X: ${p.x}`)
      if (p.y) posParts.push(`Y: ${p.y}`)
      return posParts.join(", ")
    }
    case "createRectangle": {
      const w = p.width != null ? Number(p.width) : 24
      const h = p.height != null ? Number(p.height) : 24
      return `${w}×${h}`
    }
    case "createText":
      return String(p.characters ?? "")
    case "wrapInFrame": {
      const al = String(p.autoLayout ?? "")
      return al ? `+ auto layout (${al})` : ""
    }
    case "wrapAllInFrame": {
      const al = String(p.autoLayout ?? "")
      const name = String(p.frameName ?? "Group")
      return al ? `${name}, auto layout (${al})` : name
    }
    case "addAutoLayout": {
      const dir = String(p.direction ?? "VERTICAL")
      const sp = p.itemSpacing ? `, spacing: ${p.itemSpacing}` : ""
      return `${dir}${sp}`
    }
    case "editAutoLayout": {
      const edits: string[] = []
      if (p.direction) edits.push(String(p.direction))
      if (p.itemSpacing) edits.push(`gap: ${p.itemSpacing}`)
      if (p.paddingTop || p.paddingRight || p.paddingBottom || p.paddingLeft) edits.push("padding")
      return edits.join(", ") || "no changes"
    }
    case "removeAutoLayout":
      return ""
    case "detachInstance":
      return ""
    case "swapComponent":
      return String(p.componentName ?? "")
    case "swapComponentByKey":
      return String(p.componentKey ?? "")
    case "setInstanceProperties":
      return String(p.properties ?? "").split("\n").filter(Boolean).length + " properties"
    case "resetInstanceOverrides":
      return ""
    case "pasteComponentById":
      return String(p.componentId ?? "")
    case "askForInput":
      return String(p.label ?? "Enter text")
    case "splitText":
      return p.sourceVar ? `{$${p.sourceVar}}` : ""
    case "math": {
      const sym: Record<string, string> = { add: "+", subtract: "−", multiply: "×", divide: "÷" }
      const op = String(p.operation ?? "add")
      return `${p.x ?? "?"} ${sym[op] ?? "?"} ${p.y ?? "?"}`
    }
    case "repeatWithEach": {
      const src = String(p.source ?? "nodes")
      if (src === "nodes") return "nodes"
      return `{$${src}} → {$${p.itemVar ?? "item"}}`
    }
    case "ifCondition": {
      const left = String(p.left ?? "")
      const op: Record<string, string> = {
        equals: "=", notEquals: "≠", greaterThan: ">", lessThan: "<",
        greaterOrEqual: "≥", lessOrEqual: "≤", contains: "~", notContains: "!~",
        isEmpty: "is empty", isNotEmpty: "is not empty",
      }
      const operator = String(p.operator ?? "equals")
      if (operator === "isEmpty" || operator === "isNotEmpty") {
        return `${left} ${op[operator] ?? operator}`
      }
      return `${left} ${op[operator] ?? operator} ${p.right ?? ""}`
    }
    case "chooseFromList": {
      const sv = String(p.sourceVar ?? "")
      if (sv) return `from {$${sv}}`
      const opts = String(p.options ?? "")
      if (opts) {
        const items = opts.split(",").map((s: string) => s.trim()).filter(Boolean)
        return `${items.length} options`
      }
      return ""
    }
    case "mapList": {
      const src = String(p.source ?? "")
      return src ? `{$${src}} → {$${p.itemVar ?? "item"}}` : ""
    }
    case "reduceList": {
      const src = String(p.source ?? "")
      return src ? `{$${src}} → {$${p.accumulatorVar ?? "result"}}` : ""
    }
    case "stopAndOutput":
      return String(p.message ?? "")
    default:
      return ""
  }
}

/** Collect step outputs that appear before the step at path in DFS order. */
function collectPrecedingOutputs(
  steps: AutomationStepPayload[],
  path: StepPath,
): { step: AutomationStepPayload; isData: boolean }[] {
  const out: { step: AutomationStepPayload; isData: boolean }[] = []
  if (path.length === 0) return out
  const first = path[0] as { rootIndex?: number; childIndex?: number; childBranch?: string }
  if (!("rootIndex" in first) || first.rootIndex == null) return out
  const rootIdx = first.rootIndex

  for (let i = 0; i < rootIdx && i < steps.length; i++) {
    const step = steps[i]
    if (!step.outputName) continue
    const def = ACTION_DEFINITIONS.find((d) => d.type === step.actionType)
    out.push({ step, isData: def?.producesData === true })
  }

  if (path.length === 1) return out
  let current: AutomationStepPayload | undefined = steps[rootIdx]
  for (let segIdx = 1; segIdx < path.length; segIdx++) {
    const seg = path[segIdx] as { childIndex?: number; childBranch?: string }
    if (!current || !("childIndex" in seg)) break
    const branch = (seg.childBranch ?? "then") as "then" | "else"
    const arr: AutomationStepPayload[] = branch === "else" ? (current.elseChildren ?? []) : (current.children ?? [])
    for (let j = 0; j < seg.childIndex! && j < arr.length; j++) {
      const child = arr[j]
      if (!child.outputName) continue
      const def = ACTION_DEFINITIONS.find((d) => d.type === child.actionType)
      out.push({ step: child, isData: def?.producesData === true })
    }
    current = arr[seg.childIndex!]
  }
  return out
}

export function buildSuggestions(
  steps: AutomationStepPayload[],
  path: StepPath | null,
): Suggestion[] {
  const suggestions: Suggestion[] = []

  suggestions.push(
    { token: "count", label: "Working set size", category: "Context" },
    { token: "index", label: "Position in set", category: "Context" },
  )

  for (const prop of PROPERTY_REGISTRY) {
    suggestions.push({
      token: prop.key,
      label: prop.label,
      category: "Properties",
    })
  }

  if (path && path.length > 0) {
    const preceding = collectPrecedingOutputs(steps, path)
    for (const { step, isData } of preceding) {
      if (!step.outputName) continue
      const def = ACTION_DEFINITIONS.find((d) => d.type === step.actionType)
      suggestions.push({
        token: isData ? `$${step.outputName}` : `#${step.outputName}`,
        label: `${def?.label ?? step.actionType} output`,
        category: "Step outputs",
      })
      if (!isData) {
        for (const prop of PROPERTY_REGISTRY) {
          suggestions.push({
            token: `#${step.outputName}.${prop.key}`,
            label: `${prop.label} from "${step.outputName}"`,
            category: step.outputName,
          })
        }
      }
    }
  }

  const parentStep = path && path.length > 0 ? getParentStepAtPath(steps, path) : undefined
  const hasLoop =
    parentStep?.actionType === "repeatWithEach" ||
    parentStep?.actionType === "mapList" ||
    parentStep?.actionType === "reduceList"

  if (hasLoop && parentStep) {
    const itemVar = String(parentStep.params.itemVar ?? "item")
    suggestions.push(
      { token: `$${itemVar}`, label: "Current loop item", category: "Loop" },
      { token: "$repeatIndex", label: "Current iteration index", category: "Loop" },
    )

    if (parentStep.actionType === "repeatWithEach") {
      for (const prop of PROPERTY_REGISTRY) {
        suggestions.push({
          token: `$${itemVar}.${prop.key}`,
          label: `${prop.label} of current item`,
          category: "Loop item properties",
        })
      }
      suggestions.push({
        token: `$${itemVar}.text`,
        label: "Text content (alias for characters)",
        category: "Loop item properties",
      })
    }

    if (parentStep.actionType === "reduceList") {
      const accVar = String(parentStep.params.accumulatorVar ?? "result")
      suggestions.push({
        token: `$${accVar}`,
        label: "Current accumulator value",
        category: "Loop",
      })
    }
  }

  return suggestions
}

export function formatLogAsText(result: AutomationsRunResult): string {
  const lines: string[] = []
  lines.push(result.success ? "Completed successfully" : "Completed with errors")
  lines.push(`${result.stepsCompleted} of ${plural(result.totalSteps, "step")} completed`)
  lines.push("")
  if (result.log) {
    for (const entry of result.log) {
      const status = entry.status === "success" ? "OK" : entry.status === "error" ? "ERR" : "SKIP"
      lines.push(`[${status}] ${entry.stepIndex + 1}. ${entry.stepName}  (${entry.itemsIn} → ${entry.itemsOut})`)
      if (entry.message) lines.push(`     ${stripTokenSyntax(entry.message)}`)
    }
  }
  if (result.errors.length > 0) {
    lines.push("")
    lines.push("Errors:")
    for (const e of result.errors) lines.push(`  - ${e}`)
  }
  return lines.join("\n")
}

export function buildInputSourceOptions(
  steps: AutomationStepPayload[],
  currentStepIndex: number,
  dataOnly: boolean,
): { value: string; text: string }[] {
  const options: { value: string; text: string }[] = []
  for (let i = 0; i < currentStepIndex && i < steps.length; i++) {
    const s = steps[i]
    if (!s.outputName) continue
    const def = ACTION_DEFINITIONS.find((d) => d.type === s.actionType)
    const isData = def?.producesData === true
    if (dataOnly && !isData) continue
    options.push({
      value: s.outputName,
      text: `${s.outputName} (${def?.label ?? s.actionType})`,
    })
  }
  return options
}

export function buildValueSourceOptions(
  steps: AutomationStepPayload[],
  currentStepIndex: number,
  propertyKey: string,
): { value: string; text: string }[] {
  const options: { value: string; text: string }[] = [
    { value: "", text: "Custom value" },
  ]
  const prop = PROPERTY_REGISTRY.find((p) => p.key === propertyKey)
  if (!prop || prop.valueType !== "number") return options

  for (let i = 0; i < currentStepIndex && i < steps.length; i++) {
    const s = steps[i]
    if (!s.outputName) continue
    const def = ACTION_DEFINITIONS.find((d) => d.type === s.actionType)
    if (def?.producesData) continue
    options.push({
      value: `{#${s.outputName}.${propertyKey}}`,
      text: `${prop.label} from ${s.outputName}`,
    })
  }
  return options
}

export function renderInputContext(
  allSteps: AutomationStepPayload[],
  stepIndex: number,
  parentStep?: AutomationStepPayload,
  opts: { showTokens?: boolean; nodesLabel?: string } = {},
): h.JSX.Element | null {
  const { showTokens, nodesLabel = "Nodes from" } = opts
  const lines: h.JSX.Element[] = []

  if (stepIndex > 0) {
    const prev = allSteps[stepIndex - 1]
    if (prev) {
      const def = ACTION_DEFINITIONS.find((d) => d.type === prev.actionType)
      lines.push(
        <div key="prev">{nodesLabel}: <b>{def?.label ?? prev.actionType}</b></div>,
      )
    }
  }

  const isInRepeat = parentStep?.actionType === "repeatWithEach"
  const isInMap = parentStep?.actionType === "mapList"
  const isInReduce = parentStep?.actionType === "reduceList"
  const isInIf = parentStep?.actionType === "ifCondition"
  const isInLoop = isInRepeat || isInMap || isInReduce

  if (isInLoop && parentStep) {
    const itemVar = String(parentStep.params.itemVar ?? "item")
    const parentLabel = isInRepeat ? "Repeat with each" : isInMap ? "Map list" : "Reduce list"
    lines.push(
      <div key="repeat">
        Inside <b>{parentLabel}</b>
        {" — use "}<TokenText text={`{$${itemVar}}`} />{" for current item"}
        {isInReduce && (
          <Fragment>
            {", "}<TokenText text={`{$${String(parentStep.params.accumulatorVar ?? "result")}}`} />{" for accumulator"}
          </Fragment>
        )}
      </div>,
    )
  }

  if (isInIf) {
    lines.push(
      <div key="if">Inside <b>If</b> condition block</div>,
    )
  }

  if (showTokens) {
    const tokenElements: h.JSX.Element[] = []
    for (let i = 0; i < stepIndex; i++) {
      const s = allSteps[i]
      if (!s.outputName) continue
      const def = ACTION_DEFINITIONS.find((d) => d.type === s.actionType)
      const raw = def?.producesData ? `{$${s.outputName}}` : `{#${s.outputName}}`
      tokenElements.push(<TokenText key={`t-${i}`} text={raw} />)
    }
    if (isInLoop && parentStep) {
      const itemVar = String(parentStep.params.itemVar ?? "item")
      tokenElements.push(<TokenText key="t-item" text={`{$${itemVar}}`} />)
      tokenElements.push(<TokenText key="t-idx" text="{$repeatIndex}" />)
      if (isInReduce) {
        const accVar = String(parentStep.params.accumulatorVar ?? "result")
        tokenElements.push(<TokenText key="t-acc" text={`{$${accVar}}`} />)
      }
    }
    if (tokenElements.length > 0) {
      lines.push(
        <div key="tokens" style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
          Available: {tokenElements.reduce<(h.JSX.Element | string)[]>((acc, el, idx) => idx === 0 ? [el] : [...acc, " ", el], [])}
        </div>,
      )
    }
  }

  if (lines.length === 0) return null
  return (
    <Fragment>
      <Text style={{ fontSize: 11 }}>Input</Text>
      <VerticalSpace space="extraSmall" />
      <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
        {lines}
      </Text>
      <VerticalSpace space="small" />
    </Fragment>
  )
}
