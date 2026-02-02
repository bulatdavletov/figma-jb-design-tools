import { showUI } from "@create-figma-plugin/utilities"

import { MAIN_TO_UI, UI_TO_MAIN, type UiToMainMessage } from "./messages"
import { inspectSelectionForVariableChainsByLayerV2 } from "./variable-chain"

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
    const results = await inspectSelectionForVariableChainsByLayerV2()
    figma.ui.postMessage({ type: MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2, results })
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

  const isWithinSelection = (node: BaseNode): boolean => {
    const selection = figma.currentPage.selection
    if (selection.length === 0) return false
    for (const root of selection) {
      let current: BaseNode | null = node
      while (current != null) {
        if (current.id === root.id) return true
        current = current.parent
      }
    }
    return false
  }

  const isSceneNode = (node: unknown): node is SceneNode => {
    // `RemovedNode` can show up in `documentchange`, and it doesn't have `parent`.
    return (
      node != null &&
      typeof node === "object" &&
      "id" in node &&
      "type" in node &&
      "parent" in node
    )
  }

  const handleDocumentChange = (event: DocumentChangeEvent) => {
    // Unlike `selectionchange`, `documentchange` fires when the user edits fills/strokes/etc.
    // We only refresh when the change affects the current selection (or its descendants),
    // and we reuse the existing debounced `scheduleUpdate` to avoid spamming.
    if (figma.currentPage.selection.length === 0) return

    for (const change of event.documentChanges) {
      const node = "node" in change ? change.node : null
      if (!isSceneNode(node)) continue
      if (isWithinSelection(node)) {
        scheduleUpdate()
        return
      }
    }
  }

  figma.on("selectionchange", scheduleUpdate)
  // In Figma “incremental mode”, registering `documentchange` requires loading all pages first:
  // otherwise Figma throws: “Cannot register documentchange handler in incremental mode without calling figma.loadAllPagesAsync first.”
  if (command === "color-chain-tool") {
    ;(async () => {
      try {
        await figma.loadAllPagesAsync()
        figma.on("documentchange", handleDocumentChange)
      } catch {
        // If this fails, we silently fall back to `selectionchange`-only updates.
      }
    })()
  }

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

