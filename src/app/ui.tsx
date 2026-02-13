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

type Route =
  | "home"
  | "mockup-markup-tool"
  | "color-chain-tool"
  | "library-swap-tool"
  | "print-color-usages-tool"
  | "variables-export-import-tool"
  | "variables-batch-rename-tool"
  | "variables-create-linked-colors-tool"
  | "variables-replace-usages-tool"

export function App() {
  const [route, setRoute] = useState<Route>("home")
  const [selectionSize, setSelectionSize] = useState<number>(0)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return
      if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
        setSelectionSize(msg.selectionSize)
        const validRoutes: Route[] = [
          "mockup-markup-tool",
          "color-chain-tool",
          "library-swap-tool",
          "print-color-usages-tool",
          "variables-export-import-tool",
          "variables-batch-rename-tool",
          "variables-create-linked-colors-tool",
          "variables-replace-usages-tool",
        ]
        setRoute(
          validRoutes.includes(msg.command as Route) ? (msg.command as Route) : "home"
        )
      }
    }
    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.BOOT } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Inform main thread which tool is currently visible (so it can route selection updates).
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

  if (route === "mockup-markup-tool") {
    return <MockupMarkupToolView onBack={() => setRoute("home")} />
  }

  if (route === "color-chain-tool") {
    return <ColorChainToolView onBack={() => setRoute("home")} initialSelectionEmpty={selectionSize === 0} />
  }

  if (route === "library-swap-tool") {
    return (
      <LibrarySwapToolView
        onBack={() => setRoute("home")}
        initialSelectionEmpty={selectionSize === 0}
      />
    )
  }

  if (route === "print-color-usages-tool") {
    return <PrintColorUsagesToolView onBack={() => setRoute("home")} />
  }

  if (route === "variables-export-import-tool") {
    return <VariablesExportImportToolView onBack={() => setRoute("home")} />
  }

  if (route === "variables-batch-rename-tool") {
    return <VariablesBatchRenameToolView onBack={() => setRoute("home")} />
  }

  if (route === "variables-create-linked-colors-tool") {
    return <VariablesCreateLinkedColorsToolView onBack={() => setRoute("home")} />
  }

  if (route === "variables-replace-usages-tool") {
    return (
      <VariablesReplaceUsagesToolView
        onBack={() => setRoute("home")}
        initialSelectionEmpty={selectionSize === 0}
      />
    )
  }

  return <HomeView goTo={setRoute} />
}

export default render(App)

