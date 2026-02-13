import { MAIN_TO_UI, UI_TO_MAIN, type ActiveTool, type PrintColorUsagesUiSettings, type PrintColorUsagesPrintPreviewEntry, type UiToMainMessage } from "../../messages"
import { loadPrintColorUsagesSettings, savePrintColorUsagesSettings } from "./settings"
import { printColorUsagesFromSelection } from "./print"
import { previewUpdateSelectedTextNodesByVariableId, updateSelectedTextNodesByVariableId } from "./update"
import { analyzeNodeColors } from "./analyze"
import type { ColorUsage } from "./shared"

/** Yield one tick so Figma delivers queued postMessage calls to the UI. */
const yieldToUI = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

async function postSettings(): Promise<void> {
  const settings = await loadPrintColorUsagesSettings()
  // Theme is not exposed in the combined plugin UI; keep a stable fallback.
  figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS, settings: { ...settings, textTheme: "dark" } })
}

export function registerPrintColorUsagesTool(getActiveTool: () => ActiveTool) {
  let printPreviewTimer: ReturnType<typeof setTimeout> | null = null
  let cachedSettings: PrintColorUsagesUiSettings | null = null

  const postSelection = () => {
    if (getActiveTool() !== "print-color-usages-tool") return
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION, selectionSize: figma.currentPage.selection.length })
  }

  const sendPrintPreview = async () => {
    if (getActiveTool() !== "print-color-usages-tool") return
    const selection = figma.currentPage.selection
    if (selection.length === 0) {
      figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW, payload: { entries: [] } })
      return
    }

    const settings = cachedSettings ?? await loadPrintColorUsagesSettings()
    const showLinkedColors = settings.showLinkedColors
    const hideFolderNames = settings.hideFolderNames
    const checkNested = settings.checkNested !== false

    const merged: Array<ColorUsage> = []
    for (const n of selection) {
      const colors = await analyzeNodeColors(n, showLinkedColors, hideFolderNames, checkNested)
      merged.push(...colors)
    }
    const uniqueByKey = new Map<string, ColorUsage>()
    for (const item of merged) {
      if (!uniqueByKey.has(item.uniqueKey)) uniqueByKey.set(item.uniqueKey, item)
    }
    const colorInfo = Array.from(uniqueByKey.values()).sort((a, b) => {
      const aIsHex = a.label.startsWith("#")
      const bIsHex = b.label.startsWith("#")
      if (aIsHex && !bIsHex) return 1
      if (!aIsHex && bIsHex) return -1
      return a.label.localeCompare(b.label)
    })

    const entries: PrintColorUsagesPrintPreviewEntry[] = colorInfo.map((c) => ({
      label: c.label,
      layerName: c.variableContext
        ? (c.variableContext.isNonDefaultMode && c.variableContext.variableModeName
            ? `${c.variableContext.variableId} (${c.variableContext.variableModeName})`
            : c.variableContext.variableId)
        : c.layerName,
      variableId: c.variableContext?.variableId,
      linkedColorName: c.styledVariableParts?.secondaryText || undefined,
    }))

    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW, payload: { entries } })
  }

  const debouncedPrintPreview = () => {
    if (printPreviewTimer) clearTimeout(printPreviewTimer)
    printPreviewTimer = setTimeout(() => { sendPrintPreview() }, 300)
  }

  figma.on("selectionchange", () => {
    postSelection()
    debouncedPrintPreview()
  })

  const onActivate = async () => {
    postSelection()
    await postSettings()
    figma.ui.postMessage({ type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS, status: { status: "idle" } })
    debouncedPrintPreview()
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
        const s = { ...msg.settings, textTheme: "dark" as const }
        cachedSettings = s
        await savePrintColorUsagesSettings(s)
        // Re-compute print preview with updated settings.
        debouncedPrintPreview()
        return true
      }

      if (msg.type === UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT) {
        const settings: PrintColorUsagesUiSettings = { ...msg.settings, textTheme: "dark" }
        figma.ui.postMessage({
          type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
          status: { status: "working", message: "Printing…" },
        })
        await yieldToUI()
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
        await yieldToUI()
        let lastProgressTs = 0
        const progressCallback = async (current: number, total: number) => {
          const now = Date.now()
          if (now - lastProgressTs > 200) {
            lastProgressTs = now
            figma.ui.postMessage({
              type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
              status: { status: "working", message: `Checking… ${current}/${total} layers` },
            })
          }
          await yieldToUI()
        }
        const preview = await previewUpdateSelectedTextNodesByVariableId(settings, msg.scope, progressCallback)
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
        await yieldToUI()
        let lastUpdateProgressTs = 0
        const progressCallback = async (current: number, total: number) => {
          const now = Date.now()
          if (now - lastUpdateProgressTs > 200) {
            lastUpdateProgressTs = now
            figma.ui.postMessage({
              type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS,
              status: { status: "working", message: `Updating… ${current}/${total} layers` },
            })
          }
          await yieldToUI()
        }
        await updateSelectedTextNodesByVariableId(settings, { targetNodeIds: msg.targetNodeIds }, progressCallback)
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

