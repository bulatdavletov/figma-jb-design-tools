import { Button, Text } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useCallback, useState } from "preact/hooks"

import { StepLogRow } from "./StepLogRow"
import { copyTextToClipboard } from "../../../utils/clipboard"
import { plural } from "../../../utils/pluralize"
import { formatLogAsText } from "../helpers"
import type { AutomationsRunProgress, AutomationsRunResult } from "../../../home/messages"

export function RunOutputPanel(props: {
  progress: AutomationsRunProgress | null
  result: AutomationsRunResult | null
}) {
  const { progress, result } = props

  if (progress) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            padding: "8px 12px",
            borderBottom: "1px solid var(--figma-color-border)",
            background: "var(--figma-color-bg-secondary)",
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 11 }}>Running…</Text>
        </div>
        <div style={{ padding: 12 }}>
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            Step {progress.currentStep}/{progress.totalSteps}: {progress.stepName}
          </Text>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: "var(--figma-color-text-tertiary)",
            textAlign: "center",
          }}
        >
          Click ▶ Run to execute this automation
        </Text>
      </div>
    )
  }

  return (
    <RunOutputPanelWithResult result={result} />
  )
}

function RunOutputPanelWithResult(props: { result: AutomationsRunResult }) {
  const { result } = props
  const [copied, setCopied] = useState(false)

  const handleCopyLog = useCallback(async () => {
    const text = formatLogAsText(result)
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg-secondary)",
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: 11 }}>Run Output</Text>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        <div
          style={{
            padding: "4px 0",
            fontSize: 11,
            fontWeight: 600,
            color: result.success
              ? "var(--figma-color-text-success)"
              : "var(--figma-color-text-danger)",
          }}
        >
          {result.success ? "Completed successfully" : "Completed with errors"}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            marginBottom: 8,
          }}
        >
          {result.stepsCompleted} of {plural(result.totalSteps, "step")} completed
        </div>
        {result.log && result.log.length > 0 && (
          <div>
            {result.log.map((entry, i) => (
              <StepLogRow key={i} entry={entry} />
            ))}
          </div>
        )}
        {result.errors.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {result.errors.map((e, i) => (
              <div
                key={i}
                style={{
                  fontSize: 10,
                  color: "var(--figma-color-text-danger)",
                  padding: "2px 0",
                }}
              >
                {e}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          borderTop: "1px solid var(--figma-color-border)",
          padding: "8px",
          flexShrink: 0,
        }}
      >
        <Button fullWidth secondary onClick={handleCopyLog}>
          {copied ? "Copied!" : "Copy log"}
        </Button>
      </div>
    </div>
  )
}
