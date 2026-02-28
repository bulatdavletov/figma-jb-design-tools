import { h } from "preact"

import { TokenText } from "../../../components/TokenPill"
import type { AutomationsStepLog } from "../../../home/messages"

export function StepLogRow(props: { entry: AutomationsStepLog }) {
  const { entry } = props
  const statusColor =
    entry.status === "success"
      ? "var(--figma-color-text-success)"
      : entry.status === "error"
        ? "var(--figma-color-text-danger)"
        : "var(--figma-color-text-secondary)"

  return (
    <div style={{ padding: "6px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: statusColor,
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: 11, color: "var(--figma-color-text)", flex: 1 }}>
          {entry.stepIndex + 1}. {entry.stepName}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            flexShrink: 0,
          }}
        >
          {entry.itemsIn} → {entry.itemsOut}
        </div>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--figma-color-text-secondary)",
          marginTop: 2,
          paddingLeft: 12,
        }}
      >
        {entry.message && <TokenText text={entry.message} />}
      </div>
    </div>
  )
}
