import type { ActionResult } from "../context"
import type { ActionHandler } from "../context"
import { requestInput } from "../input-bridge"

export const askForInput: ActionHandler = async (context, params): Promise<ActionResult> => {
  const label = String(params.label ?? "Enter text")
  const placeholder = String(params.placeholder ?? "")
  const inputType = (params.inputType ?? "text") as "text" | "textarea"
  const defaultValue = String(params.defaultValue ?? "")

  const value = await requestInput(label, placeholder, inputType, defaultValue)

  const preview = value.length > 50 ? value.slice(0, 50) + "..." : value

  context.log.push({
    stepIndex: -1,
    stepName: "Ask for input",
    message: `Input received: "${preview}"`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return { context, output: value }
}
