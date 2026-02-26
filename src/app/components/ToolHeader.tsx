import { Button, Container, Divider, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"

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
      </Container>
      {/* Divider is full-width (outside container inset) */}
      <Divider />
    </div>
  )
}
