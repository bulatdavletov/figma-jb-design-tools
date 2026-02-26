import { MAIN_TO_UI, UI_TO_MAIN, type ActiveTool, type UiToMainMessage } from "../../home/messages"
import { inspectSelectionForVariableChainsByLayerV2, replaceVariableUsagesInSelection } from "./variable-chain"

export function registerColorChainTool(getActiveTool: () => ActiveTool) {
  let pendingTimer: number | null = null

  const sendUpdate = async () => {
    if (getActiveTool() !== "color-chain-tool") return
    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({ type: MAIN_TO_UI.SELECTION_EMPTY })
      return
    }
    const results = await inspectSelectionForVariableChainsByLayerV2()
    figma.ui.postMessage({ type: MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2, results })
  }

  const scheduleUpdate = () => {
    if (getActiveTool() !== "color-chain-tool") return
    if (pendingTimer != null) clearTimeout(pendingTimer)
    pendingTimer = setTimeout(() => {
      pendingTimer = null
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
    return node != null && typeof node === "object" && "id" in node && "type" in node && "parent" in node
  }

  const handleDocumentChange = (event: DocumentChangeEvent) => {
    if (getActiveTool() !== "color-chain-tool") return
    if (figma.currentPage.selection.length === 0) return
    for (const change of event.documentChanges) {
      const node = "node" in change ? (change as any).node : null
      if (!isSceneNode(node)) continue
      if (isWithinSelection(node)) {
        scheduleUpdate()
        return
      }
    }
  }

  figma.on("selectionchange", scheduleUpdate)
  ;(async () => {
    try {
      await figma.loadAllPagesAsync()
      figma.on("documentchange", handleDocumentChange)
    } catch {
      // fall back to selectionchange-only updates
    }
  })()

  const onMessage = async (msg: UiToMainMessage) => {
    try {
      if (msg.type === UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS) {
        await sendUpdate()
        return true
      }

      if (msg.type === UI_TO_MAIN.COLOR_CHAIN_REPLACE_MAIN_COLOR) {
        const { targetName } = await replaceVariableUsagesInSelection(
          msg.request.sourceVariableId,
          msg.request.targetVariableId
        )
        figma.notify(
          `Applied ${targetName}`
        )
        await sendUpdate()
        return true
      }

      if (msg.type === UI_TO_MAIN.COLOR_CHAIN_NOTIFY) {
        const message = String(msg.message ?? "").trim()
        if (message.length > 0) {
          figma.notify(message)
        }
        return true
      }
    } catch (e) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.ERROR,
        message: e instanceof Error ? e.message : String(e),
      })
    }
    return false
  }

  return {
    onActivate: () => {
      scheduleUpdate()
    },
    onMessage,
  }
}

