import { showUI } from "@create-figma-plugin/utilities"

import { MAIN_TO_UI, UI_TO_MAIN, type UiToMainMessage } from "./messages"
import { inspectSelectionForVariableChainsByLayer } from "./variable-chain"

export function run(command: string) {
  showUI(
    {
      width: 360,
      height: 500,
      title: command === "color-chain-tool" ? "View Colors Chain" : "JetBrains Design Tools",
    },
    { command }
  )

  let pendingTimer: number | null = null
  const sendUpdate = async () => {
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({ type: MAIN_TO_UI.SELECTION_EMPTY })
      return
    }
    const results = await inspectSelectionForVariableChainsByLayer()
    figma.ui.postMessage({ type: MAIN_TO_UI.VARIABLE_CHAINS_RESULT, results })
  }

  const scheduleUpdate = () => {
    if (pendingTimer != null) {
      clearTimeout(pendingTimer)
    }
    pendingTimer = setTimeout(() => {
      pendingTimer = null
      // Fire and forget (errors handled by try/catch wrapper onmessage only)
      sendUpdate().catch((e) => {
        figma.ui.postMessage({
          type: MAIN_TO_UI.ERROR,
          message: e instanceof Error ? e.message : String(e),
        })
      })
    }, 50) as unknown as number
  }

  figma.on("selectionchange", scheduleUpdate)

  figma.ui.onmessage = async (msg: UiToMainMessage) => {
    try {
      if (msg.type === UI_TO_MAIN.BOOT) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.BOOTSTRAPPED,
          command,
          selectionSize: figma.currentPage.selection.length,
        })
        await sendUpdate()
        return
      }

      // Kept for compatibility, but UI now auto-updates on selection change.
      if (msg.type === UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS) {
        await sendUpdate()
        return
      }
    } catch (e) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.ERROR,
        message: e instanceof Error ? e.message : String(e),
      })
    }
  }
}

