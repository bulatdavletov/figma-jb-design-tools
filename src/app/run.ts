import { showUI } from "@create-figma-plugin/utilities"

import { MAIN_TO_UI, UI_TO_MAIN, type UiToMainMessage } from "./messages"
import type { ActiveTool } from "./messages"
import { registerColorChainTool } from "./tools/color-chain-tool/main-thread"
import { registerMockupMarkupTool } from "./tools/mockup-markup/main-thread"
import { registerPrintColorUsagesTool } from "./tools/print-color-usages/main-thread"

export function run(command: string) {
  showUI(
    {
      width: 360,
      height: 500,
      title:
        command === "color-chain-tool"
          ? "View Colors Chain"
          : command === "print-color-usages-tool"
            ? "Print Color Usages"
            : command === "mockup-markup-tool"
              ? "Mockup Markup Quick Apply"
            : "JetBrains Design Tools",
    },
    { command }
  )

  let activeTool: ActiveTool =
    command === "color-chain-tool" || command === "print-color-usages-tool" || command === "mockup-markup-tool" ? command : "home"

  const getActiveTool = () => activeTool

  const colorChain = registerColorChainTool(getActiveTool)
  const printColorUsages = registerPrintColorUsagesTool(getActiveTool)
  const mockupMarkup = registerMockupMarkupTool(getActiveTool)

  const activate = async (tool: ActiveTool) => {
    activeTool = tool
    if (tool === "color-chain-tool") {
      await colorChain.onActivate()
      return
    }
    if (tool === "print-color-usages-tool") {
      await printColorUsages.onActivate()
      return
    }
    if (tool === "mockup-markup-tool") {
      await mockupMarkup.onActivate()
      return
    }
  }

  figma.ui.onmessage = async (msg: UiToMainMessage) => {
    try {
      if (msg.type === UI_TO_MAIN.BOOT) {
        figma.ui.postMessage({
          type: MAIN_TO_UI.BOOTSTRAPPED,
          command,
          selectionSize: figma.currentPage.selection.length,
        })
        await activate(activeTool)
        return
      }

      if (msg.type === UI_TO_MAIN.SET_ACTIVE_TOOL) {
        await activate(msg.tool)
        return
      }

      // Route tool-specific messages.
      if (await mockupMarkup.onMessage(msg)) return
      if (await printColorUsages.onMessage(msg)) return
      if (await colorChain.onMessage(msg)) return
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("[run] Unhandled error in onmessage", e)
      try {
        figma.notify(e instanceof Error ? e.message : String(e))
      } catch {
        // ignore
      }
    }
  }
}

