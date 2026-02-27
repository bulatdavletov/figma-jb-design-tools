import { Text } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useRef } from "preact/hooks"

import type { ToolEntry } from "./tool-registry"
import type { Scenario } from "../test-fixtures/types"

const PLUGIN_WIDTH = 360
const PLUGIN_HEIGHT = 500

type Theme = "figma-light" | "figma-dark"

function ScenarioFrame(props: {
  toolId: string
  scenario: Scenario
  theme: Theme
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const width = props.scenario.size?.width ?? PLUGIN_WIDTH
  const height = props.scenario.size?.height ?? PLUGIN_HEIGHT

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    iframe.contentWindow.postMessage({ __preview_theme: props.theme }, "*")
  }, [props.theme])

  const src = `/?isolated=1&tool=${props.toolId}&scenario=${props.scenario.id}&theme=${props.theme}`

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
      <Text style={{ fontWeight: 600, fontSize: 11 }}>{props.scenario.label}</Text>
      <iframe
        ref={iframeRef}
        src={src}
        width={width}
        height={height}
        style={{
          border: "1px solid var(--figma-color-border)",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
          background: "var(--figma-color-bg)",
        }}
      />
    </div>
  )
}

export function ToolPreview(props: { tool: ToolEntry; theme: Theme }) {
  return (
    <div style={{ padding: "16px 24px" }}>
      <Text style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{props.tool.label}</Text>
      <Text style={{ color: "var(--figma-color-text-secondary)", fontSize: 11, marginBottom: 16 }}>
        {props.tool.scenarios.length} state{props.tool.scenarios.length !== 1 ? "s" : ""}
      </Text>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {props.tool.scenarios.map((scenario) => (
          <ScenarioFrame
            key={scenario.id}
            toolId={props.tool.id}
            scenario={scenario}
            theme={props.theme}
          />
        ))}
      </div>
    </div>
  )
}
