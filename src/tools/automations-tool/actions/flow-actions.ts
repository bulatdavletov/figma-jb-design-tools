import type { ActionHandler, ActionResult, AutomationContext, PipelineListValue } from "../context"
import { requestInput } from "../input-bridge"
import { resolveTokens } from "../tokens"

export class StopExecutionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StopExecutionError"
  }
}

export const stopAndOutputAction: ActionHandler = async (context, params): Promise<AutomationContext> => {
  const message = params.message
    ? resolveTokens(String(params.message), { context })
    : "Workflow stopped"

  context.log.push({
    stepIndex: -1,
    stepName: "Stop",
    message,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  throw new StopExecutionError(message)
}

export const chooseFromListAction: ActionHandler = async (context, params): Promise<ActionResult> => {
  const sourceVar = String(params.sourceVar ?? "")
  const staticOptions = String(params.options ?? "")
  const label = String(params.label ?? "Choose an option")

  let options: string[] = []

  if (sourceVar) {
    const listValue = context.pipelineVars[sourceVar]
    if (Array.isArray(listValue)) {
      options = (listValue as PipelineListValue).map((v) => String(v))
    } else if (listValue !== undefined) {
      options = [String(listValue)]
    }
  }

  if (options.length === 0 && staticOptions) {
    options = staticOptions.split(",").map((s) => s.trim()).filter(Boolean)
  }

  if (options.length === 0) {
    context.log.push({
      stepIndex: -1,
      stepName: "Choose from list",
      message: "No options available",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: "No options available",
    })
    return { context, output: "" }
  }

  const value = await requestInput(label, "", "select", options[0], options)

  context.log.push({
    stepIndex: -1,
    stepName: "Choose from list",
    message: `Selected: "${value}"`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return { context, output: value }
}

export function evaluateCondition(
  left: string,
  operator: string,
  right: string,
): boolean {
  switch (operator) {
    case "isEmpty":
      return left === "" || left === "0"
    case "isNotEmpty":
      return left !== "" && left !== "0"
    case "equals":
      return left === right
    case "notEquals":
      return left !== right
    case "contains":
      return left.includes(right)
    case "notContains":
      return !left.includes(right)
    case "greaterThan": {
      const ln = Number(left), rn = Number(right)
      return !isNaN(ln) && !isNaN(rn) && ln > rn
    }
    case "lessThan": {
      const ln = Number(left), rn = Number(right)
      return !isNaN(ln) && !isNaN(rn) && ln < rn
    }
    case "greaterOrEqual": {
      const ln = Number(left), rn = Number(right)
      return !isNaN(ln) && !isNaN(rn) && ln >= rn
    }
    case "lessOrEqual": {
      const ln = Number(left), rn = Number(right)
      return !isNaN(ln) && !isNaN(rn) && ln <= rn
    }
    default:
      return left === right
  }
}
