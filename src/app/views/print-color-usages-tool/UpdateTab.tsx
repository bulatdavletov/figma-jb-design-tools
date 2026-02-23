import { Button, Checkbox, Stack, Text } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  type PrintColorUsagesStatus,
  type PrintColorUsagesUpdatePreviewPayload,
  type PrintColorUsagesUiSettings,
  UI_TO_MAIN,
} from "../../messages"
import { DataList } from "../../components/DataList"
import { renderInlineDiff } from "../../components/InlineTextDiff"
import { ScopeControl, type ScopeValue } from "../../components/ScopeControl"

export function UpdateTab(props: {
  settings: PrintColorUsagesUiSettings
  setSettings: (fn: (s: PrintColorUsagesUiSettings) => PrintColorUsagesUiSettings) => void
  isWorking: boolean
  status: PrintColorUsagesStatus
  hasSelection: boolean
  preview: PrintColorUsagesUpdatePreviewPayload | null
  setPreview: (fn: (p: PrintColorUsagesUpdatePreviewPayload | null) => PrintColorUsagesUpdatePreviewPayload | null) => void
  selectedPreviewNodeIds: string[]
  setSelectedPreviewNodeIds: (fn: (ids: string[]) => string[]) => void
  scope: ScopeValue
  setScope: (v: ScopeValue) => void
}) {
  const {
    settings, setSettings, isWorking, status,
    hasSelection, preview, setPreview,
    selectedPreviewNodeIds, setSelectedPreviewNodeIds,
    scope, setScope,
  } = props

  const selectedPreviewNodeIdSet = useMemo(() => new Set(selectedPreviewNodeIds), [selectedPreviewNodeIds])
  const selectedPreviewCount = selectedPreviewNodeIds.length

  return (
    <Stack space="medium">
      <Checkbox
        value={settings.checkByContent}
        onValueChange={(value) => setSettings((s) => ({ ...s, checkByContent: value }))}
      >
        <Text>Check by content</Text>
      </Checkbox>
      <ScopeControl
        value={scope}
        hasSelection={hasSelection}
        onValueChange={setScope}
      />
      {isWorking && status.status === "working" && (status as any).message ? (
        <Text style={{ color: "var(--figma-color-text-secondary)" }}>
          {(status as any).message}
        </Text>
      ) : null}

      {preview ? (
        preview.entries.length === 0 ? (
          <DataList
            header="Changes found"
            summary={`Candidates: ${preview.totals.candidates} | Changes: ${preview.totals.changed} | Unchanged: ${preview.totals.unchanged} | Skipped: ${preview.totals.skipped}`}
            emptyText="No text changes found."
          >
            {null}
          </DataList>
        ) : (
          <Stack space="extraSmall">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                Selected: {selectedPreviewCount} / {preview.entries.length}
              </Text>
              <div style={{ display: "flex", gap: 6 }}>
                <Button
                  secondary
                  onClick={() => setSelectedPreviewNodeIds(() => preview.entries.map((entry) => entry.nodeId))}
                >
                  Select all
                </Button>
                <Button secondary onClick={() => setSelectedPreviewNodeIds(() => [])}>
                  Clear
                </Button>
                <Button
                  secondary
                  disabled={selectedPreviewCount === 0}
                  onClick={() => {
                    const idsToReset = [...selectedPreviewNodeIds]
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: UI_TO_MAIN.PRINT_COLOR_USAGES_RESET_LAYER_NAMES,
                          nodeIds: idsToReset,
                        },
                      },
                      "*"
                    )
                    const resetSet = new Set(idsToReset)
                    setPreview((prev) =>
                      prev
                        ? {
                          ...prev,
                          entries: prev.entries.filter((e) => !resetSet.has(e.nodeId)),
                        }
                        : prev
                    )
                    setSelectedPreviewNodeIds((prev) =>
                      prev.filter((id) => !resetSet.has(id))
                    )
                  }}
                >
                  Reset names
                </Button>
              </div>
            </div>

            <DataList
              header="Changes found"
              summary={`Candidates: ${preview.totals.candidates} | Changes: ${preview.totals.changed} | Unchanged: ${preview.totals.unchanged} | Skipped: ${preview.totals.skipped}`}
            >
              {preview.entries.map((entry) => {
                const isChecked = selectedPreviewNodeIdSet.has(entry.nodeId)
                const textDiff = renderInlineDiff(entry.oldText ?? "", entry.newText ?? "")
                return (
                  <div
                    key={entry.nodeId}
                    style={{
                      padding: 10,
                      background: isChecked
                        ? "var(--figma-color-bg-secondary)"
                        : "var(--figma-color-bg)",
                    }}
                  >
                    <Checkbox
                      value={isChecked}
                      onValueChange={(value) =>
                        setSelectedPreviewNodeIds((prev) =>
                          value
                            ? prev.includes(entry.nodeId)
                              ? prev
                              : [...prev, entry.nodeId]
                            : prev.filter((id) => id !== entry.nodeId)
                        )
                      }
                    >
                      <Text>{entry.nodeName}</Text>
                    </Checkbox>

                    <button
                      type="button"
                      onClick={() =>
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: UI_TO_MAIN.PRINT_COLOR_USAGES_FOCUS_NODE,
                              nodeId: entry.nodeId,
                            },
                          },
                          "*"
                        )
                      }
                      style={{
                        marginTop: 4,
                        width: "100%",
                        display: "block",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        padding: "0 0 0 24px",
                        cursor: "pointer",
                      }}
                    >
                      <Text
                        style={{
                          color: "var(--figma-color-text-secondary)",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          lineHeight: "20px",
                        }}
                      >
                        Old: {textDiff.beforeNode}
                      </Text>
                      <Text
                        style={{
                          color: "var(--figma-color-text)",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          lineHeight: "20px",
                        }}
                      >
                        New: {textDiff.afterNode}
                      </Text>
                      {entry.layerNameChanged ? (
                        <Text
                          style={{
                            color: "var(--figma-color-text-secondary)",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            lineHeight: "18px",
                          }}
                        >
                          Layer: {entry.oldLayerName || "(empty)"} {"->"}  {entry.newLayerName || "(empty)"}
                        </Text>
                      ) : null}
                    </button>

                    {entry.contentMismatch ? (
                      <div
                        style={{
                          marginTop: 4,
                          marginLeft: 24,
                          padding: "6px 8px",
                          borderRadius: 4,
                          background: "var(--figma-color-bg-warning-tertiary, #fff8e1)",
                          border: "1px solid var(--figma-color-border-warning, #ffd54f)",
                        }}
                      >
                        <Text
                          style={{
                            color: "var(--figma-color-text-warning)",
                            fontSize: 11,
                            lineHeight: "16px",
                            wordBreak: "break-word",
                          }}
                        >
                          Layer name points to "{entry.contentMismatch.layerVariableName}" but text content matches "{entry.contentMismatch.contentVariableName}"
                        </Text>
                      </div>
                    ) : null}

                    <div style={{ paddingLeft: 24, marginTop: 2 }}>
                      <Text
                        style={{
                          color: "var(--figma-color-text-tertiary)",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          lineHeight: "16px",
                          fontSize: 11,
                        }}
                      >
                        Resolved by:{" "}
                        {entry.resolvedBy === "layer_variable_id"
                          ? "layer VariableID"
                          : entry.resolvedBy === "layer_name"
                            ? "layer name"
                            : "text content fallback"}
                      </Text>
                    </div>
                  </div>
                )
              })}
            </DataList>
          </Stack>
        )
      ) : null}
    </Stack>
  )
}
