import { render } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useState } from "preact/hooks"

import { MAIN_TO_UI, type MainToUiMessage, UI_TO_MAIN } from "./messages"
import { ColorChainToolView } from "./views/color-chain-tool/ColorChainToolView"
import { HomeView } from "./views/home/HomeView"
import { PrintColorUsagesToolView } from "./views/print-color-usages-tool/PrintColorUsagesToolView"

type Route = "home" | "color-chain-tool" | "print-color-usages-tool"

export function App() {
  const [route, setRoute] = useState<Route>("home")
  const [selectionSize, setSelectionSize] = useState<number>(0)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return
      if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
        setSelectionSize(msg.selectionSize)
        setRoute(
          msg.command === "color-chain-tool"
            ? "color-chain-tool"
            : msg.command === "print-color-usages-tool"
              ? "print-color-usages-tool"
              : "home"
        )
      }
    }
    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.BOOT } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  if (route === "home") {
    return <HomeView goTo={setRoute} />
  }

  if (route === "color-chain-tool") {
    return <ColorChainToolView onBack={() => setRoute("home")} initialSelectionEmpty={selectionSize === 0} />
  }

  return <PrintColorUsagesToolView onBack={() => setRoute("home")} />
}

export default render(App)

