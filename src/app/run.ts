import { showUI } from "@create-figma-plugin/utilities"

import { MAIN_TO_UI, UI_TO_MAIN, type UiToMainMessage } from "./messages"
import { getToolById, isToolId, TOOLS_REGISTRY, type ActiveTool, type ToolId } from "./tools-registry"
import { registerMockupMarkupTool } from "./tools/mockup-markup-quick-apply-tool/main-thread"
import { registerColorChainTool } from "./tools/color-chain-tool/main-thread"
import { registerLibrarySwapTool } from "./tools/library-swap/main-thread"
import { registerPrintColorUsagesTool } from "./tools/print-color-usages/main-thread"
import { registerVariablesExportImportTool } from "./tools/variables-export-import/main-thread"
import { registerVariablesBatchRenameTool } from "./tools/variables-batch-rename/main-thread"
import { registerVariablesCreateLinkedColorsTool } from "./tools/variables-create-linked-colors/main-thread"
import { registerVariablesReplaceUsagesTool } from "./tools/variables-replace-usages/main-thread"
import { registerFindColorMatchTool } from "./tools/find-color-match/main-thread"

type ToolController = {
  onActivate: () => void | Promise<void>
  onMessage: (msg: UiToMainMessage) => Promise<boolean>
}

const REGISTER_TOOL_CONTROLLER: Record<
  ToolId,
  (getActiveTool: () => ActiveTool) => ToolController
> = {
  "mockup-markup-tool": registerMockupMarkupTool,
  "color-chain-tool": registerColorChainTool,
  "library-swap-tool": registerLibrarySwapTool,
  "print-color-usages-tool": registerPrintColorUsagesTool,
  "variables-export-import-tool": registerVariablesExportImportTool,
  "variables-batch-rename-tool": registerVariablesBatchRenameTool,
  "variables-create-linked-colors-tool": registerVariablesCreateLinkedColorsTool,
  "variables-replace-usages-tool": registerVariablesReplaceUsagesTool,
  "find-color-match-tool": registerFindColorMatchTool,
}

function getToolTitle(command: string): string {
  return isToolId(command) ? getToolById(command).title : "Int UI Design Tools"
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

  let activeTool: ActiveTool = isToolId(command) ? command : "home"
  const getActiveTool = () => activeTool

  const toolControllers = Object.fromEntries(
    TOOLS_REGISTRY.map((tool) => [tool.id, REGISTER_TOOL_CONTROLLER[tool.id](getActiveTool)])
  ) as Record<ToolId, ToolController>

  const activate = async (tool: ActiveTool) => {
    activeTool = tool
    if (tool === "home") return
    await toolControllers[tool].onActivate()
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

      for (const tool of TOOLS_REGISTRY) {
        if (await toolControllers[tool.id].onMessage(msg)) {
          return
        }
      }
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
