import type { ActionHandler, ActionResult } from "../context"
import { resolveTokens } from "../tokens"
import { getNodeProperty } from "../properties"
import { plural } from "../../../utils/pluralize"

export const setPipelineVariable: ActionHandler = async (context, params) => {
  const varName = String(params.variableName ?? "").trim()
  const rawValue = String(params.value ?? "")

  if (!varName) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set variable",
      message: "No variable name specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const resolvedValue = resolveTokens(rawValue, { context })
  const numValue = Number(resolvedValue)
  const stored = resolvedValue === "true" ? true : resolvedValue === "false" ? false : isNaN(numValue) ? resolvedValue : numValue
  context.pipelineVars[varName] = stored

  context.log.push({
    stepIndex: -1,
    stepName: "Set variable",
    message: `{$${varName}} = ${String(stored)}`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setPipelineVariableFromProperty: ActionHandler = async (context, params) => {
  const varName = String(params.variableName ?? "").trim()
  const property = String(params.property ?? "name")

  if (!varName) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set variable from property",
      message: "No variable name specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  if (context.nodes.length === 0) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set variable from property",
      message: "No nodes in working set — skipped",
      itemsIn: 0,
      itemsOut: 0,
      status: "skipped",
    })
    return context
  }

  const node = context.nodes[0]
  const value = getNodeProperty(node, property)

  if (value !== null) {
    context.pipelineVars[varName] = value
    context.log.push({
      stepIndex: -1,
      stepName: "Set variable from property",
      message: `{$${varName}} = ${String(value)} (${property} of "${node.name}")`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "success",
    })
  } else {
    context.log.push({
      stepIndex: -1,
      stepName: "Set variable from property",
      message: `Property "${property}" not available on "${node.name}" (${node.type})`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Property "${property}" not available`,
    })
  }

  return context
}

const MATH_OPS: Record<string, (a: number, b: number) => number> = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
}

const MATH_SYMBOLS: Record<string, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
}

export const mathAction: ActionHandler = async (context, params): Promise<ActionResult> => {
  const rawX = String(params.x ?? "")
  const rawY = String(params.y ?? "")
  const operation = String(params.operation ?? "add")

  const xResolved = resolveTokens(rawX, { context })
  const yResolved = resolveTokens(rawY, { context })
  const x = Number(xResolved)
  const y = Number(yResolved)

  if (isNaN(x) || isNaN(y)) {
    context.log.push({
      stepIndex: -1,
      stepName: "Math",
      message: `Cannot compute: "${xResolved}" ${MATH_SYMBOLS[operation] ?? "?"} "${yResolved}" — not valid numbers`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: "Non-numeric input",
    })
    return { context }
  }

  if (operation === "divide" && y === 0) {
    context.log.push({
      stepIndex: -1,
      stepName: "Math",
      message: "Division by zero",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: "Division by zero",
    })
    return { context }
  }

  const fn = MATH_OPS[operation]
  if (!fn) {
    context.log.push({
      stepIndex: -1,
      stepName: "Math",
      message: `Unknown operation "${operation}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Unknown operation "${operation}"`,
    })
    return { context }
  }

  const result = fn(x, y)

  context.log.push({
    stepIndex: -1,
    stepName: "Math",
    message: `${x} ${MATH_SYMBOLS[operation]} ${y} = ${result}`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return { context, output: result }
}

export const splitText: ActionHandler = async (context, params): Promise<ActionResult> => {
  const sourceVar = String(params.sourceVar ?? "").trim()
  let delimiter = String(params.delimiter ?? "\\n")

  if (delimiter === "\\n") delimiter = "\n"
  else if (delimiter === "\\t") delimiter = "\t"

  if (!sourceVar) {
    context.log.push({
      stepIndex: -1,
      stepName: "Split text",
      message: "No source variable specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return { context }
  }

  const rawValue = context.pipelineVars[sourceVar]
  if (rawValue === undefined) {
    context.log.push({
      stepIndex: -1,
      stepName: "Split text",
      message: `Variable {$${sourceVar}} not found`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Variable {$${sourceVar}} not found`,
    })
    return { context }
  }

  const text = String(rawValue)
  let parts = text.split(delimiter)
  if (parts.length > 1 && parts[parts.length - 1] === "") {
    parts = parts.slice(0, -1)
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Split text",
    message: `Split {$${sourceVar}} → ${plural(parts.length, "item")}`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return { context, output: parts }
}
