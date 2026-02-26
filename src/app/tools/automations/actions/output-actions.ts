import type { ActionHandler, ActionResult } from "../context"
import { resolveTokens } from "../tokens"
import { plural } from "../../../utils/pluralize"

export const selectResults: ActionHandler = async (context, params) => {
  figma.currentPage.selection = context.nodes
  const scrollTo = params.scrollTo !== false

  if (scrollTo && context.nodes.length > 0) {
    figma.viewport.scrollAndZoomIntoView(context.nodes)
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Select results",
    message: `Selected ${plural(context.nodes.length, "node")}`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const logAction: ActionHandler = async (context, params) => {
  const rawMessage = String(params.message ?? "")
  const resolvedMessage = resolveTokens(rawMessage, { context })

  context.log.push({
    stepIndex: -1,
    stepName: "Log",
    message: resolvedMessage || `Working set: ${plural(context.nodes.length, "node")}`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const countAction: ActionHandler = async (context, params): Promise<ActionResult> => {
  const label = String(params.label ?? "Count")
  const count = context.nodes.length

  context.log.push({
    stepIndex: -1,
    stepName: label,
    message: `${label}: ${plural(count, "node")}`,
    itemsIn: count,
    itemsOut: count,
    status: "success",
  })

  return { context, output: count }
}
