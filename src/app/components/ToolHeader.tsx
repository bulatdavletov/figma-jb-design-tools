import { Button, Container, Divider, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useMemo, useState } from "preact/hooks"

import { TOOL_INSTRUCTIONS_BY_ID } from "../tool-instructions"
import { TOOLS_REGISTRY } from "../tools-registry"

const BUG_REPORT_URL = "https://app.slack.com/client"

async function handleReportBugClick() {
  const now = new Date().toISOString()
  const template = [
    "Bug report",
    `Time: ${now}`,
    "Tool:",
    "Steps to reproduce:",
    "Expected result:",
    "Actual result:",
  ].join("\n")

  try {
    await navigator.clipboard.writeText(template)
  } catch {
    // Clipboard API may fail in some hosts; opening Slack is still useful.
  }

  window.open(BUG_REPORT_URL, "_blank", "noopener,noreferrer")
}

function InstructionsDisclosure(props: { title: string }) {
  const tool = useMemo(() => TOOLS_REGISTRY.find((entry) => entry.title === props.title), [props.title])
  const [isOpen, setIsOpen] = useState(false)

  if (!tool) {
    return null
  }

  const instructions = TOOL_INSTRUCTIONS_BY_ID[tool.id]
  if (!instructions) {
    return null
  }

  return (
    <details open={isOpen} onToggle={(event) => setIsOpen((event.currentTarget as HTMLDetailsElement).open)}>
      <summary
        style={{
          cursor: "pointer",
          color: "var(--figma-color-text-secondary)",
          fontSize: 11,
          lineHeight: "16px",
          userSelect: "none",
        }}
      >
        Instructions
      </summary>
      <div style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 11, lineHeight: "16px" }}>
          <strong>When to use:</strong> {instructions.whenToUse}
        </Text>
        <VerticalSpace space="extraSmall" />
        <Text style={{ fontSize: 11, lineHeight: "16px" }}>
          <strong>How to use:</strong>
        </Text>
        <ol style={{ margin: "4px 0 0", paddingInlineStart: 16, fontSize: 11, lineHeight: "16px" }}>
          {instructions.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <VerticalSpace space="extraSmall" />
        <Text style={{ fontSize: 11, lineHeight: "16px" }}>
          <strong>Output:</strong> {instructions.output}
        </Text>
        {instructions.notes && instructions.notes.length > 0 ? (
          <div>
            <VerticalSpace space="extraSmall" />
            <Text style={{ fontSize: 11, lineHeight: "16px" }}>
              <strong>Notes:</strong> {instructions.notes.join(" ")}
            </Text>
          </div>
        ) : null}
      </div>
    </details>
  )
}

export function ToolHeader(props: { title: string; left?: preact.ComponentChildren }) {
  return (
    <div>
      {/* Use native Container inset for header content */}
      <Container space="small">
        <VerticalSpace space="extraSmall" />
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {props.left ? <div style={{ display: "flex", alignItems: "center" }}>{props.left}</div> : null}
            <Text style={{ fontWeight: 600 }}>{props.title}</Text>
          </div>
          <Button secondary onClick={handleReportBugClick}>
            Report bug
          </Button>
        </div>
        <VerticalSpace space="extraSmall" />
        <InstructionsDisclosure title={props.title} />
        <VerticalSpace space="extraSmall" />
      </Container>
      {/* Divider is full-width (outside container inset) */}
      <Divider />
    </div>
  )
}
