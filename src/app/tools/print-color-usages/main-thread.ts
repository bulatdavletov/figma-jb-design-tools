import { MAIN_TO_UI, UI_TO_MAIN, type PrintColorUsagesUiSettings, type UiToMainMessage } from "../../messages"
import { loadPrintColorUsagesSettings, savePrintColorUsagesSettings } from "./settings"
import { printColorUsagesFromSelection } from "./print"
import { updateSelectedTextNodesByVariableId } from "./update"

async function postSettings(): Promise<void> {
  const settings = await loadPrintColorUsagesSettings()
  // Theme is not exposed in the combined plugin UI; keep a stable fallback.
  figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS, settings: { ...settings, textTheme: "dark" } })
}

export function startPrintColorUsagesTool(command: string): void {
  const postSelection = () => {
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION, selectionSize: figma.currentPage.selection.length })
  }

  figma.on("selectionchange", postSelection)

  figma.ui.onmessage = async (msg: UiToMainMessage) => {
    try {
      if (msg.type === UI_TO_MAIN.BOOT) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.BOOTSTRAPPED,
          command,
          selectionSize: figma.currentPage.selection.length,
        })
        postSelection()
        await postSettings()
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } })
        return
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS) {
        await postSettings()
        return
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS) {
        await savePrintColorUsagesSettings({ ...msg.settings, textTheme: "dark" })
        return
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
        return
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE) {
        const settings: PrintColorUsagesUiSettings = { ...msg.settings, textTheme: "dark" }
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Updating…" },
        })
        await updateSelectedTextNodesByVariableId(settings)
        // Result is communicated via native `figma.notify` inside the action.
        figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } })
        return
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
  }
}

