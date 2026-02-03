import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type ActiveTool,
  type MockupMarkupState,
  type UiToMainMessage,
} from "../../messages"
import { applyMockupMarkupToSelection } from "./apply"
import { getMockupMarkupColorPreviews } from "./color-previews"
import { createMockupMarkupText } from "./create"
import { importMockupMarkupVariablesOnce } from "./import-once"

function collectTextNodesRecursivelyFromSelection(selection: readonly SceneNode[]): TextNode[] {
  const result: TextNode[] = []
  const seen = new Set<string>()

  const add = (node: SceneNode) => {
    if (node.type !== "TEXT") return
    if (seen.has(node.id)) return
    seen.add(node.id)
    result.push(node as TextNode)
  }

  const walk = (node: SceneNode) => {
    add(node)
    if (!("children" in node)) return
    const children = (node as any).children as SceneNode[] | undefined
    if (!children || !Array.isArray(children)) return
    for (const child of children) {
      walk(child)
    }
  }

  for (const root of selection) {
    walk(root)
  }

  return result
}

function getState(): MockupMarkupState {
  const selection = figma.currentPage.selection
  const textNodes = selection.length > 0 ? collectTextNodesRecursivelyFromSelection(selection) : []
  return {
    selectionSize: selection.length,
    textNodeCount: textNodes.length,
    hasSourceTextNode: textNodes.length > 0,
  }
}

export function registerMockupMarkupTool(getActiveTool: () => ActiveTool) {
  const postState = () => {
    if (getActiveTool() !== "mockup-markup-tool") return
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATE, state: getState() })
  }

  figma.on("selectionchange", postState)

  const onActivate = async () => {
    postState()
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "working", message: "Preparing…" } })
    await importMockupMarkupVariablesOnce()
    // Prime swatches immediately (default is dark mode in UI).
    const previews = await getMockupMarkupColorPreviews("dark")
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews })
    figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } })
  }

  const onMessage = async (msg: UiToMainMessage) => {
    try {
      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_LOAD_STATE) {
        await onActivate()
        return true
      }

      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_APPLY) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
          status: { status: "working", message: "Applying…" },
        })
        await applyMockupMarkupToSelection(msg.request)
        figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } })
        postState()
        return true
      }

      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS,
          status: { status: "working", message: "Creating text…" },
        })
        await createMockupMarkupText(msg.request)
        figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } })
        postState()
        return true
      }

      if (msg.type === UI_TO_MAIN.MOCKUP_MARKUP_GET_COLOR_PREVIEWS) {
        const previews = await getMockupMarkupColorPreviews(msg.forceModeName)
        figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS, previews })
        return true
      }
    } catch (e) {
      try {
        figma.notify(e instanceof Error ? e.message : String(e))
      } catch {
        // ignore
      }
      figma.ui.postMessage({ type: MAIN_TO_UI.MOCKUP_MARKUP_STATUS, status: { status: "idle" } })
    }
    return false
  }

  return {
    onActivate,
    onMessage,
  }
}

