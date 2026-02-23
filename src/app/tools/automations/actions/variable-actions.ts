import type { ActionHandler } from "../context"
import { resolveTokens } from "../tokens"
import { getNodeProperty } from "../properties"

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
    message: `$${varName} = ${String(stored)}`,
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
      message: `$${varName} = ${String(value)} (${property} of "${node.name}")`,
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
