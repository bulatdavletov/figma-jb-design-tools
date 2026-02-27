/**
 * Main thread handler for Mockup Markup tool.
 */

import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type ActiveTool,
  type MockupMarkupState,
  type UiToMainMessage,
} from "../../home/messages"
import { applyMockupMarkupToSelection } from "./apply"
import { getMockupMarkupColorPreviews } from "./color-previews"
import { createMockupMarkupText } from "./create"
import { importMockupMarkupVariablesOnce } from "./import-once"
import { collectTextNodesFromSelection, logDebug, logWarn } from "./utils"

/**
 * Computes the current state based on selection.
 */
function getState(): MockupMarkupState {
  const selection = figma.currentPage.selection
  const textNodes = selection.length > 0 ? collectTextNodesFromSelection(selection) : []
  return {
    selectionSize: selection.length,
    textNodeCount: textNodes.length,
    hasSourceTextNode: textNodes.length > 0,
  }
}

/**
 * Registers the Mockup Markup tool handlers.
 */
export function registerMockupMarkupTool(getActiveTool: () => ActiveTool) {
  /**
   * Posts the current state to the UI if this tool is active.
   */
  const postState = () => {
    if (getActiveTool() !== "mockup-markup-tool") return
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATE, state: getState() })
  }

  // Update state when selection changes
  figma.on("selectionchange", postState)

  /**
   * Called when the tool is activated.
   */
  const onActivate = async () => {
    postState()

    // Show working status
    figma.ui.postMessage({
      type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
      status: { status: "working", message: "Preparing…" },
    })

    // Import variables (tracks success per variable, retries failed ones)
    const importStatus = await importMockupMarkupVariablesOnce()
    logDebug("main", "Import status", importStatus)

    // Get color previews for UI (default: dark mode)
    const previews = await getMockupMarkupColorPreviews("dark")
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews })

    // Ready
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } })
  }

  /**
   * Handles messages from the UI.
   */
  const onMessage = async (msg: UiToMainMessage): Promise<boolean> => {
    try {
      switch (msg.type) {
        case UI_TO_MAIN.MOCKUP_MARKUP_LOAD_STATE: {
          await onActivate()
          return true
        }

        case UI_TO_MAIN.MOCKUP_MARKUP_APPLY: {
          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "working", message: "Applying…" },
          })

          const result = await applyMockupMarkupToSelection(msg.request)
          logDebug("main", "Apply result", result)

          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "idle" },
          })
          postState()
          return true
        }

        case UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT: {
          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "working", message: "Creating text…" },
          })

          const result = await createMockupMarkupText(msg.request)
          logDebug("main", "Create result", result)

          figma.ui.postMessage({
            type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
            status: { status: "idle" },
          })
          postState()
          return true
        }

        case UI_TO_MAIN.MOCKUP_MARKUP_GET_COLOR_PREVIEWS: {
          const previews = await getMockupMarkupColorPreviews(msg.forceModeName)
          figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews })
          return true
        }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      logWarn("main", "Error handling message", { type: msg.type, error: errorMsg })

      try {
        figma.notify(errorMsg)
      } catch {
        // Notify can fail in some contexts
      }

      figma.ui.postMessage({
        type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
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
