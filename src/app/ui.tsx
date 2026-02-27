import { render } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useState } from "preact/hooks"

import { MAIN_TO_UI, type MainToUiMessage, UI_TO_MAIN } from "./messages"
import { HomeView } from "./views/home/HomeView"
import { MockupMarkupToolView } from "./views/mockup-markup-tool/MockupMarkupToolView"
import { ColorChainToolView } from "./views/color-chain-tool/ColorChainToolView"
import { LibrarySwapToolView } from "./views/library-swap-tool/LibrarySwapToolView"
import { PrintColorUsagesToolView } from "./views/print-color-usages-tool/PrintColorUsagesToolView"
import { VariablesExportImportToolView } from "./views/variables-export-import-tool/VariablesExportImportToolView"
import { VariablesBatchRenameToolView } from "./views/variables-batch-rename-tool/VariablesBatchRenameToolView"
import { VariablesCreateLinkedColorsToolView } from "./views/variables-create-linked-colors-tool/VariablesCreateLinkedColorsToolView"
import { VariablesReplaceUsagesToolView } from "./views/variables-replace-usages-tool/VariablesReplaceUsagesToolView"
import { FindColorMatchToolView } from "./views/find-color-match-tool/FindColorMatchToolView"
import { AutomationsToolView } from "./views/automations-tool/AutomationsToolView"
import { isToolId, TOOLS_REGISTRY, type ActiveTool, type ToolId } from "./tools-registry"

type ToolViewProps = {
  onBack: () => void
  initialSelectionEmpty: boolean
}

const TOOL_VIEW_BY_ID: Record<ToolId, (props: ToolViewProps) => preact.ComponentChildren> = {
  "mockup-markup-tool": ({ onBack }) => <MockupMarkupToolView onBack={onBack} />,
  "color-chain-tool": ({ onBack, initialSelectionEmpty }) => (
    <ColorChainToolView onBack={onBack} initialSelectionEmpty={initialSelectionEmpty} />
  ),
  "library-swap-tool": ({ onBack, initialSelectionEmpty }) => (
    <LibrarySwapToolView onBack={onBack} initialSelectionEmpty={initialSelectionEmpty} />
  ),
  "print-color-usages-tool": ({ onBack }) => <PrintColorUsagesToolView onBack={onBack} />,
  "variables-export-import-tool": ({ onBack }) => <VariablesExportImportToolView onBack={onBack} />,
  "variables-batch-rename-tool": ({ onBack }) => <VariablesBatchRenameToolView onBack={onBack} />,
  "variables-create-linked-colors-tool": ({ onBack }) => (
    <VariablesCreateLinkedColorsToolView onBack={onBack} />
  ),
  "variables-replace-usages-tool": ({ onBack, initialSelectionEmpty }) => (
    <VariablesReplaceUsagesToolView onBack={onBack} initialSelectionEmpty={initialSelectionEmpty} />
  ),
  "find-color-match-tool": ({ onBack, initialSelectionEmpty }) => (
    <FindColorMatchToolView onBack={onBack} initialSelectionEmpty={initialSelectionEmpty} />
  ),
  "automations-tool": ({ onBack }) => <AutomationsToolView onBack={onBack} />,
}

export function App() {
  const [route, setRoute] = useState<ActiveTool>("home")
  const [selectionSize, setSelectionSize] = useState<number>(0)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return
      if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
        setSelectionSize(msg.selectionSize)
        setRoute(isToolId(msg.command) ? msg.command : "home")
      }
    }
    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.BOOT } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.SET_ACTIVE_TOOL,
          tool: route,
        },
      },
      "*"
    )
  }, [route])

  if (route === "home") {
    return <HomeView goTo={setRoute} />
  }

  const entry = TOOLS_REGISTRY.find((tool) => tool.id === route)
  if (!entry) {
    return <HomeView goTo={setRoute} />
  }

  return TOOL_VIEW_BY_ID[entry.id]({
    onBack: () => setRoute("home"),
    initialSelectionEmpty: selectionSize === 0,
  })
}

export default render(App)
