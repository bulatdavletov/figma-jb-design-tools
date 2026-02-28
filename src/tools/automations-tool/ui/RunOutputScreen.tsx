import { Button, IconButton, Text } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useCallback, useState } from "preact/hooks"

import { IconChevronLeft16 } from "../../../../custom-icons/generated"
import { DataList } from "../../../components/DataList"
import { Page } from "../../../components/Page"
import { ToolBody } from "../../../components/ToolBody"
import { ToolHeader } from "../../../components/ToolHeader"
import { copyTextToClipboard } from "../../../utils/clipboard"
import { plural } from "../../../utils/pluralize"
import { formatLogAsText } from "../helpers"
import type { AutomationsRunResult } from "../../../home/messages"
import { StepLogRow } from "./StepLogRow"

export function RunOutputScreen(props: {
  result: AutomationsRunResult
  onBack: () => void
}) {
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
    <Page>
      <ToolHeader
        title="Run Output"
        left={
          <IconButton onClick={props.onBack}>
            <IconChevronLeft16/>
          </IconButton>
        }
      />
      <ToolBody mode="content">
        <div
          style={{
            padding: "8px 0 4px 0",
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
          <DataList header="Step log">
            {result.log.map((entry, i) => (
              <StepLogRow key={i} entry={entry} />
            ))}
          </DataList>
        )}
      </ToolBody>
      <div
        style={{
          borderTop: "1px solid var(--figma-color-border)",
          padding: "8px 12px",
          display: "flex",
          gap: 8,
        }}
      >
        <Button style={{ flex: 1 }} onClick={props.onBack}>
          Done
        </Button>
        <Button style={{ flex: 1 }} secondary onClick={handleCopyLog}>
          {copied ? "Copied!" : "Copy log"}
        </Button>
      </div>
    </Page>
  )
}
