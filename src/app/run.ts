import { showUI } from "@create-figma-plugin/utilities"

import { MAIN_TO_UI, UI_TO_MAIN, type UiToMainMessage } from "./messages"
import type { ActiveTool } from "./messages"
import { registerMockupMarkupTool } from "./tools/mockup-markup-quick-apply-tool/main-thread"
import { registerColorChainTool } from "./tools/color-chain-tool/main-thread"
import { registerLibrarySwapTool } from "./tools/library-swap/main-thread"
import { registerPrintColorUsagesTool } from "./tools/print-color-usages/main-thread"
import { registerVariablesExportImportTool } from "./tools/variables-export-import/main-thread"
import { registerVariablesBatchRenameTool } from "./tools/variables-batch-rename/main-thread"
import { registerVariablesCreateLinkedColorsTool } from "./tools/variables-create-linked-colors/main-thread"
import { registerVariablesReplaceUsagesTool } from "./tools/variables-replace-usages/main-thread"
import { registerFindColorMatchTool } from "./tools/find-color-match/main-thread"
import { registerAutomationsTool } from "./tools/automations/main-thread"

function getToolTitle(command: string): string {
  switch (command) {
    case "mockup-markup-tool":
      return "Mockup Markup Quick Apply"
    case "color-chain-tool":
      return "View Colors Chain"
    case "library-swap-tool":
      return "Library Swap"
    case "print-color-usages-tool":
      return "Print Color Usages"
    case "variables-export-import-tool":
      return "Variables Export Import"
    case "variables-batch-rename-tool":
      return "Rename Variables via JSON"
    case "variables-create-linked-colors-tool":
      return "Variables Create Linked Colors"
    case "variables-replace-usages-tool":
      return "Variables Replace Usages"
    case "find-color-match-tool":
      return "Find Color Match"
    case "automations-tool":
      return "Automations"
    default:
      return "Int UI Design Tools"
  }
}

export function run(command: string) {
  showUI(
    {
      width: 360,
      height: 500,
      title: getToolTitle(command),
    },
    { command }
  )

  const toolCommands: ActiveTool[] = [
    "mockup-markup-tool",
    "color-chain-tool",
    "library-swap-tool",
    "print-color-usages-tool",
    "variables-export-import-tool",
    "variables-batch-rename-tool",
    "variables-create-linked-colors-tool",
    "variables-replace-usages-tool",
    "find-color-match-tool",
    "automations-tool",
  ]

  let activeTool: ActiveTool = toolCommands.includes(command as ActiveTool)
    ? (command as ActiveTool)
    : "home"

  const getActiveTool = () => activeTool

  const mockupMarkup = registerMockupMarkupTool(getActiveTool)
  const colorChain = registerColorChainTool(getActiveTool)
  const librarySwap = registerLibrarySwapTool(getActiveTool)
  const printColorUsages = registerPrintColorUsagesTool(getActiveTool)
  const variablesExportImport = registerVariablesExportImportTool(getActiveTool)
  const variablesBatchRename = registerVariablesBatchRenameTool(getActiveTool)
  const variablesCreateLinkedColors = registerVariablesCreateLinkedColorsTool(getActiveTool)
  const variablesReplaceUsages = registerVariablesReplaceUsagesTool(getActiveTool)
  const findColorMatch = registerFindColorMatchTool(getActiveTool)
  const automations = registerAutomationsTool(getActiveTool)

  const activate = async (tool: ActiveTool) => {
    activeTool = tool
    if (tool === "mockup-markup-tool") {
      await mockupMarkup.onActivate()
      return
    }
    if (tool === "color-chain-tool") {
      await colorChain.onActivate()
      return
    }
    if (tool === "library-swap-tool") {
      await librarySwap.onActivate()
      return
    }
    if (tool === "print-color-usages-tool") {
      await printColorUsages.onActivate()
      return
    }
    if (tool === "variables-export-import-tool") {
      await variablesExportImport.onActivate()
      return
    }
    if (tool === "variables-batch-rename-tool") {
      await variablesBatchRename.onActivate()
      return
    }
    if (tool === "variables-create-linked-colors-tool") {
      await variablesCreateLinkedColors.onActivate()
      return
    }
    if (tool === "variables-replace-usages-tool") {
      await variablesReplaceUsages.onActivate()
      return
    }
    if (tool === "find-color-match-tool") {
      await findColorMatch.onActivate()
      return
    }
    if (tool === "automations-tool") {
      await automations.onActivate()
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
      if (await colorChain.onMessage(msg)) return
      if (await librarySwap.onMessage(msg)) return
      if (await printColorUsages.onMessage(msg)) return
      if (await variablesExportImport.onMessage(msg)) return
      if (await variablesBatchRename.onMessage(msg)) return
      if (await variablesCreateLinkedColors.onMessage(msg)) return
      if (await variablesReplaceUsages.onMessage(msg)) return
      if (await findColorMatch.onMessage(msg)) return
      if (await automations.onMessage(msg)) return
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

