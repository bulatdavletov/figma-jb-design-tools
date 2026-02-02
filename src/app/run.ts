import { showUI } from "@create-figma-plugin/utilities"

import { MAIN_TO_UI, UI_TO_MAIN, type UiToMainMessage } from "./messages"
import { startColorChainTool } from "./tools/color-chain-tool/main-thread"
import { startPrintColorUsagesTool } from "./tools/print-color-usages/main-thread"

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
            : "JetBrains Design Tools",
    },
    { command }
  )

  if (command === "color-chain-tool") {
    startColorChainTool(command)
    return
  }

  if (command === "print-color-usages-tool") {
    startPrintColorUsagesTool(command)
    return
  }

  // Home tool: bootstrapping only.
  figma.ui.onmessage = async (msg: UiToMainMessage) => {
    if (msg.type !== UI_TO_MAIN.BOOT) return
    figma.ui.postMessage({
      type: MAIN_TO_UI.BOOTSTRAPPED,
      command,
      selectionSize: figma.currentPage.selection.length,
    })
  }
}

