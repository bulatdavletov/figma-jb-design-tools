import { Button, LoadingIndicator, Text } from "@create-figma-plugin/ui"
import { h } from "preact"

import type { LibraryCacheStatusPayload } from "../home/messages"

type Props = {
  status: LibraryCacheStatusPayload | null
  onOpenIslandsUiKit?: (url: string) => void
  onOpenExportTool?: () => void
}

/**
 * Subtle fixed-bottom bar that shows library cache activity.
 * Renders nothing when idle/ready/null.
 */
export function LibraryCacheStatusBar({ status, onOpenIslandsUiKit, onOpenExportTool }: Props) {
  if (!status || status.state === "idle" || status.state === "ready") return null

  if (status.state === "outdated") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "8px 12px",
          background: "var(--figma-color-bg-warning-secondary)",
          borderTop: "1px solid var(--figma-color-border-warning)",
        }}
      >
        <Text style={{ fontSize: 11 }}>{status.message}</Text>
        <div style={{ display: "flex", gap: 6 }}>
          <Button secondary onClick={() => onOpenIslandsUiKit?.(status.islandsUiKitUrl)}>
            Islands UI Kit
          </Button>
          <Button onClick={onOpenExportTool}>Export JSON
          </Button>
        </div>
      </div>
    )
  }

  const message =
    status.state === "checking"
      ? "Checking library for updates…"
      : status.message || "Updating library…"

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "6px 12px",
        background: "var(--figma-color-bg)",
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
