import type { ActionHandler, ActionResult } from "../context"
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
      message: `Variable "$${sourceVar}" not found`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Variable "$${sourceVar}" not found`,
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
    message: `Split $${sourceVar} → ${parts.length} item(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return { context, output: parts }
}
