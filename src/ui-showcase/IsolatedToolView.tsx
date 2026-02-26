import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import type { ComponentType } from "preact"

import { patchParentPostMessage, dispatchSequence } from "./mock-message-bus"
import { tools, type ToolViewProps } from "./tool-registry"
import { HomeView } from "../home/HomeView"

type Theme = "figma-light" | "figma-dark"

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove("figma-light", "figma-dark")
  document.body.classList.remove("figma-light", "figma-dark")
  document.documentElement.classList.add(theme)
  document.body.classList.add(theme)
}

/**
 * Renders a single tool view in a specific scenario state.
 * Designed to run inside an iframe — reads params from URL search string:
 *   ?isolated=1&tool=<toolId>&scenario=<scenarioId>&theme=<figma-light|figma-dark>
 *   ?isolated=1&tool=home&theme=<theme>   (special case for home page)
 */
export function IsolatedToolView() {
  const params = new URLSearchParams(window.location.search)
  const toolId = params.get("tool")
  const scenarioId = params.get("scenario")
  const theme = (params.get("theme") as Theme) || "figma-light"

  const [View, setView] = useState<ComponentType<ToolViewProps> | null>(null)

  const isHome = toolId === "home"
  const tool = isHome ? null : tools.find((t) => t.id === toolId)
  const scenario = tool?.scenarios.find((s) => s.id === scenarioId)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Listen for theme changes from parent frame
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.__preview_theme) {
        applyTheme(e.data.__preview_theme as Theme)
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  // Home page — render directly, no mock messages needed
  if (isHome) {
    return <HomeView goTo={(route) => alert(`Navigate to: ${route}`)} />
  }

  useEffect(() => {
    if (!tool) return
    patchParentPostMessage()
    tool.loadView().then((m) => setView(() => m.default))
  }, [tool])

  // Dispatch scenario messages after the view has mounted and registered its listeners
  useEffect(() => {
    if (!View || !scenario) return
    const timer = setTimeout(() => {
      dispatchSequence(scenario.messages, 20)
    }, 60)
    return () => clearTimeout(timer)
  }, [View, scenario])

  if (!tool || !scenario) {
    return <div style={{ padding: 16, color: "red" }}>Tool or scenario not found: {toolId}/{scenarioId}</div>
  }

  if (!View) {
    return <div style={{ padding: 16, color: "var(--figma-color-text-secondary)" }}>Loading…</div>
  }

  return (
    <View
      onBack={() => {}}
      initialSelectionEmpty={scenario.props?.initialSelectionEmpty}
      initialTab={scenario.props?.initialTab}
    />
  )
}
