import { LoadingIndicator, Text } from "@create-figma-plugin/ui"
import { h } from "preact"

import type { LibraryCacheStatusPayload } from "../home/messages"

type Props = {
  status: LibraryCacheStatusPayload | null
}

/**
 * Subtle fixed-bottom bar that shows library cache activity.
 * Renders nothing when idle/ready/null.
 */
export function LibraryCacheStatusBar({ status }: Props) {
  if (!status || status.state === "idle" || status.state === "ready") return null

  const message =
    status.state === "checking"
      ? "Checking library for updates…"
      : status.message || "Updating library…"

  return (
    <div
      style={{
        // position: "fixed",
        // bottom: 0,
        // left: 0,
        // right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "6px 12px",
        background: "var(--figma-color-bg)",
        //borderTop: "1px solid var(--figma-color-border)",
        //zIndex: 100,
      }}
    >
      <div style={{ flexShrink: 0, width: 16, height: 16 }}>
        <LoadingIndicator style={{ margin: 0 }} />
      </div>
      <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
        {message}
      </Text>
    </div>
  )
}
