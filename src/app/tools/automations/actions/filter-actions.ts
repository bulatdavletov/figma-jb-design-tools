import type { AutomationContext, ActionHandler } from "../context"
import type { FilterCondition, FilterLogic, FilterOperator } from "../types"
import { plural } from "../../../utils/pluralize"

export const filterAction: ActionHandler = async (context, params) => {
  const logic = (params.logic ?? "and") as FilterLogic
  let conditions = (params.conditions ?? []) as FilterCondition[]

  // Legacy compatibility: convert old filterByType/filterByName params
  if (conditions.length === 0 && params.nodeType) {
    conditions = [{ field: "type", operator: "equals", value: String(params.nodeType) }]
  }
  if (conditions.length === 0 && params.pattern) {
    const op = String(params.matchMode ?? "contains") as FilterOperator
    conditions = [{ field: "name", operator: op, value: String(params.pattern) }]
  }

  if (conditions.length === 0) {
    context.log.push({
      stepIndex: -1,
      stepName: "Filter",
      message: "No conditions — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const before = context.nodes.length
  const filtered = context.nodes.filter((node) => {
    const results = conditions.map((c) => evaluateCondition(node, c))
    return logic === "and" ? results.every(Boolean) : results.some(Boolean)
  })
  context.nodes = filtered

  const condSummary = conditions.map((c) => `${c.field} ${c.operator} ${String(c.value)}`).join(` ${logic.toUpperCase()} `)
  context.log.push({
    stepIndex: -1,
    stepName: "Filter",
    message: `Kept ${filtered.length} of ${plural(before, "node")} (${condSummary})`,
    itemsIn: before,
    itemsOut: filtered.length,
    status: "success",
  })

  return context
}

function evaluateCondition(node: SceneNode, condition: FilterCondition): boolean {
  const { field, operator, value } = condition

  switch (field) {
    case "type":
      return matchString(node.type, operator, String(value))

    case "name":
      return matchString(node.name, operator, String(value))

    case "visible":
      return matchBoolean(node.visible, operator, value)

    case "component": {
      if (node.type !== "INSTANCE") return operator === "isNot" || operator === "notEquals"
      const compName = (node as InstanceNode).mainComponent?.name ?? ""
      return matchString(compName, operator, String(value))
    }

    case "fillColor": {
      const hex = getFirstFillHex(node)
      if (!hex) return operator === "notEquals" || operator === "isNot"
      return matchString(hex.toUpperCase(), operator, String(value).toUpperCase().replace(/^#/, ""))
    }

    case "fillVariable": {
      const varName = getBoundFillVariableName(node)
      if (!varName) return operator === "notEquals" || operator === "isNot"
      return matchString(varName, operator, String(value))
    }

    case "hasFills": {
      const hasFills = "fills" in node && Array.isArray((node as GeometryMixin).fills) && ((node as GeometryMixin).fills as Paint[]).length > 0
      return matchBoolean(hasFills, operator, value)
    }

    case "hasStrokes": {
      const hasStrokes = "strokes" in node && Array.isArray((node as GeometryMixin).strokes) && ((node as GeometryMixin).strokes as Paint[]).length > 0
      return matchBoolean(hasStrokes, operator, value)
    }

    case "hasVariable": {
      const hasBound = "boundVariables" in node && node.boundVariables != null && Object.keys(node.boundVariables).length > 0
      return matchBoolean(hasBound, operator, value)
    }

    case "opacity": {
      if (!("opacity" in node)) return false
      return matchNumber((node as BlendMixin).opacity, operator, Number(value))
    }

    case "width":
      return matchNumber(node.width, operator, Number(value))

    case "height":
      return matchNumber(node.height, operator, Number(value))

    default:
      return true
  }
}

function matchString(actual: string, operator: string, expected: string): boolean {
  switch (operator) {
    case "equals": return actual === expected
    case "notEquals": return actual !== expected
    case "contains": return actual.toLowerCase().includes(expected.toLowerCase())
    case "startsWith": return actual.toLowerCase().startsWith(expected.toLowerCase())
    case "endsWith": return actual.toLowerCase().endsWith(expected.toLowerCase())
    case "regex":
      try { return new RegExp(expected, "i").test(actual) } catch { return false }
    default: return actual === expected
  }
}

function matchBoolean(actual: boolean, operator: string, expected: unknown): boolean {
  const expectedBool = expected === true || expected === "true"
  switch (operator) {
    case "is": return actual === expectedBool
    case "isNot": return actual !== expectedBool
    default: return actual === expectedBool
  }
}

function matchNumber(actual: number, operator: string, expected: number): boolean {
  if (isNaN(expected)) return false
  switch (operator) {
    case "equals": return actual === expected
    case "notEquals": return actual !== expected
    case "greaterThan": return actual > expected
    case "lessThan": return actual < expected
    default: return actual === expected
  }
}

function getFirstFillHex(node: SceneNode): string | null {
  if (!("fills" in node)) return null
  const fills = (node as GeometryMixin).fills
  if (!Array.isArray(fills) || fills.length === 0) return null
  const first = fills[0]
  if (first.type !== "SOLID") return null
  const { r, g, b } = first.color
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0")
  return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function getBoundFillVariableName(node: SceneNode): string | null {
  if (!("fills" in node)) return null
  const fills = (node as GeometryMixin).fills
  if (!Array.isArray(fills) || fills.length === 0) return null
  const first = fills[0]
  if (first.type !== "SOLID") return null
  const boundVars = first.boundVariables
  if (!boundVars || !boundVars.color) return null
  const alias = boundVars.color as { id: string }
  if (!alias.id) return null
  try {
    const variable = figma.variables.getVariableById(alias.id)
    return variable?.name ?? null
  } catch {
    return null
  }
}
