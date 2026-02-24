import { MAIN_TO_UI } from "../../messages"

type PendingInput = {
  resolve: (value: string) => void
  reject: (reason: Error) => void
}

let pending: PendingInput | null = null

export function requestInput(
  label: string,
  placeholder: string,
  inputType: "text" | "textarea",
): Promise<string> {
  if (pending) {
    pending.reject(new Error("New input request superseded previous one"))
    pending = null
  }

  figma.ui.postMessage({
    type: MAIN_TO_UI.AUTOMATIONS_INPUT_REQUEST,
    request: { label, placeholder, inputType },
  })

  return new Promise<string>((resolve, reject) => {
    pending = { resolve, reject }
  })
}

export function resolveInput(value: string): void {
  if (pending) {
    pending.resolve(value)
    pending = null
  }
}

export class InputCancelledError extends Error {
  constructor() {
    super("Input cancelled by user")
    this.name = "InputCancelledError"
  }
}

export function cancelInput(): void {
  if (pending) {
    pending.reject(new InputCancelledError())
    pending = null
  }
}
