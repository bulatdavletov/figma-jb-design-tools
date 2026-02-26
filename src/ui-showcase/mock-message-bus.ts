import type { MainToUiMessage } from "../home/messages"

export function dispatch(msg: MainToUiMessage) {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: { pluginMessage: msg },
    })
  )
}

export function dispatchSequence(msgs: MainToUiMessage[], delayMs = 30) {
  msgs.forEach((msg, i) => {
    setTimeout(() => dispatch(msg), delayMs * (i + 1))
  })
}

let patched = false

export function patchParentPostMessage() {
  if (patched) return
  patched = true

  try {
    // In a normal browser tab parent === window, so this is safe.
    // We replace it with a no-op so views don't throw when they try
    // to talk to the (non-existent) Figma main thread.
    window.parent.postMessage = (() => {}) as typeof window.parent.postMessage
  } catch {
    // Cross-origin restriction – ignore.
  }
}
