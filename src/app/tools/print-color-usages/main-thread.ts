import { MAIN_TO_UI, UI_TO_MAIN, type ActiveTool, type PrintColorUsagesUiSettings, type UiToMainMessage } from "../../messages"
import { loadPrintColorUsagesSettings, savePrintColorUsagesSettings } from "./settings"
import { printColorUsagesFromSelection } from "./print"
import { previewUpdateSelectedTextNodesByVariableId, updateSelectedTextNodesByVariableId } from "./update"

async function postSettings(): Promise<void> {
  const settings = await loadPrintColorUsagesSettings()
  // Theme is not exposed in the combined plugin UI; keep a stable fallback.
  figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS, settings: { ...settings, textTheme: "dark" } })
}

export function registerPrintColorUsagesTool(getActiveTool: () => ActiveTool) {
  const postSelection = () => {
    if (getActiveTool() !== "print-color-usages-tool") return
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION, selectionSize: figma.currentPage.selection.length })
  }

  figma.on("selectionchange", postSelection)

  const onActivate = async () => {
    postSelection()
    await postSettings()
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } })
  }

  const onMessage = async (msg: UiToMainMessage) => {
    try {
      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS) {
        // The UI mounts *after* the initial BOOTSTRAPPED/SELECTION messages.
        // Re-post current selection so the view can render correct "Update…" label immediately.
        await onActivate()
        return true
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS) {
        await savePrintColorUsagesSettings({ ...msg.settings, textTheme: "dark" })
        return true
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT) {
        const settings: PrintColorUsagesUiSettings = { ...msg.settings, textTheme: "dark" }
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Printing…" },
        })
        await printColorUsagesFromSelection(settings)
        // Result is communicated via native `figma.notify` inside the action.
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } })
        return true
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_PREVIEW_UPDATE) {
        const settings: PrintColorUsagesUiSettings = { ...msg.settings, textTheme: "dark" }
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Checking changes…" },
        })
        const preview = await previewUpdateSelectedTextNodesByVariableId(settings, msg.scope)
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_UPDATE_PREVIEW,
          payload: {
            scope: preview.scope,
            totals: {
              candidates: preview.candidates,
              changed: preview.changed,
              unchanged: preview.unchanged,
              skipped: preview.skipped,
            },
            entries: preview.entries,
          },
        })
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } })
        return true
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE) {
        const settings: PrintColorUsagesUiSettings = { ...msg.settings, textTheme: "dark" }
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Updating…" },
        })
        await updateSelectedTextNodesByVariableId(settings, { targetNodeIds: msg.targetNodeIds })
        // Result is communicated via native `figma.notify` inside the action.
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } })
        return true
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_FOCUS_NODE) {
        const node = await figma.getNodeByIdAsync(msg.nodeId)
        if (!node || node.type !== "TEXT") {
          figma.notify("Layer not found")
          return true
        }
        figma.currentPage.selection = [node]
        try {
          figma.viewport.scrollAndZoomIntoView([node])
        } catch {
          // ignore
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_RESET_LAYER_NAME) {
        const node = await figma.getNodeByIdAsync(msg.nodeId)
        if (!node || node.type !== "TEXT") {
          figma.notify("Layer not found")
          return true
        }
        try {
          node.name = ""
          figma.notify("Layer name reset")
        } catch (error) {
          figma.notify(error instanceof Error ? error.message : "Failed to reset layer name")
        }
        return true
      }
    } catch (e) {
      // Prefer native Figma toast for errors.
      try {
        figma.notify(e instanceof Error ? e.message : String(e))
      } catch {
        // ignore
      }
      figma.ui.postMessage({
        type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
        status: { status: "idle" },
      })
    }
    return false
  }

  return {
    onActivate,
    onMessage,
  }
}

