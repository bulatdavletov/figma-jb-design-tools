import { Button, Checkbox, Columns, Container, Divider, IconHome16, IconButton, RadioButtons, Stack, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  type MainToUiMessage,
  type PrintColorUsagesStatus,
  type PrintColorUsagesUpdatePreviewPayload,
  type PrintColorUsagesUiSettings,
  UI_TO_MAIN,
} from "../../messages"
import { renderInlineDiff } from "../../components/InlineTextDiff"
import { Page } from "../../components/Page"
import { ScopeControl, type ScopeValue } from "../../components/ScopeControl"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"
import { ToolTabs } from "../../components/ToolTabs"

const DEFAULT_SETTINGS: PrintColorUsagesUiSettings = {
  textPosition: "right",
  showLinkedColors: true,
  hideFolderNames: true,
  textTheme: "dark",
}

export function PrintColorUsagesToolView(props: { onBack: () => void }) {
  const [settings, setSettings] = useState<PrintColorUsagesUiSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<"Print" | "Update">("Print")
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<PrintColorUsagesStatus>({ status: "idle" })
  const [selectionSize, setSelectionSize] = useState<number>(0)
  const [scope, setScope] = useState<ScopeValue>("page")
  const [preview, setPreview] = useState<PrintColorUsagesUpdatePreviewPayload | null>(null)
  const [selectedPreviewNodeIds, setSelectedPreviewNodeIds] = useState<string[]>([])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
        setSelectionSize(msg.selectionSize)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS) {
        // Theme is not exposed in UI. We lock fallback to "dark" (white text) for consistency.
        setSettings({ ...msg.settings, textTheme: "dark" })
        setLoaded(true)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION) {
        setSelectionSize(msg.selectionSize)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS) {
        setStatus(msg.status)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_UPDATE_PREVIEW) {
        setPreview(msg.payload)
        setSelectedPreviewNodeIds(msg.payload.entries.map((entry) => entry.nodeId))
        return
      }
    }

    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Persist settings whenever they change after initial load.
  useEffect(() => {
    if (!loaded) return
    setPreview(null)
    setSelectedPreviewNodeIds([])
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS, settings } },
      "*"
    )
  }, [loaded, settings])

  const isWorking = status.status === "working"
  const selectedPreviewNodeIdSet = useMemo(() => new Set(selectedPreviewNodeIds), [selectedPreviewNodeIds])
  const selectedPreviewCount = selectedPreviewNodeIds.length
  const hasPreviewChanges = selectedPreviewCount > 0
  const hasSelection = selectionSize > 0

  // Auto-adjust scope when selection changes
  useEffect(() => {
    if (hasSelection) {
      setScope("selection")
    } else if (scope === "selection") {
      setScope("page")
    }
  }, [hasSelection])

  const applyLabel = useMemo(() => {
    const s = preview?.scope ?? scope
    if (s === "selection") return "Apply in Selection"
    if (s === "all_pages") return "Apply on All Pages"
    return "Apply on Page"
  }, [scope, preview])

  return (
    <Page>
      <ToolHeader
        title="Print Color Usages"
        left={
          <IconButton onClick={props.onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <ToolTabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value === "Update" ? "Update" : "Print")
          }
          options={[
            { value: "Print", children: null },
            { value: "Update", children: null },
          ]}
        />

        <ToolBody mode="content">
          <Stack space="medium">
            {activeTab === "Print" ? (
              <Stack space="extraSmall">
                <Text>Position</Text>
                <RadioButtons
                  direction="horizontal"
                  value={settings.textPosition}
                  onValueChange={(value) =>
                    setSettings((s) => ({
                      ...s,
                      textPosition: value === "left" || value === "right" ? value : "right",
                    }))
                  }
                  options={[
                    { value: "left", children: <Text>Left</Text> },
                    { value: "right", children: <Text>Right</Text> },
                  ]}
                />
              </Stack>
            ) : null}

            {activeTab === "Print" ? (
              <Stack space="extraSmall">
                <Checkbox
                  value={settings.showLinkedColors}
                  onValueChange={(value) => setSettings((s) => ({ ...s, showLinkedColors: value }))}
                >
                  <Text>Show linked colors</Text>
                </Checkbox>
                <Checkbox
                  value={settings.hideFolderNames}
                  onValueChange={(value) => setSettings((s) => ({ ...s, hideFolderNames: value }))}
                >
                  <Text>Hide folder prefixes (after “/”)</Text>
                </Checkbox>
              </Stack>
            ) : null}

            {activeTab === "Print" ? (
              <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                Text color is from Mockup markup
              </Text>
            ) : null}

            {activeTab === "Print" ? null : (
              <Stack space="small">
                <ScopeControl
                  value={scope}
                  hasSelection={hasSelection}
                  onValueChange={setScope}
                />
                <Button
                  secondary
                  loading={isWorking}
                  onClick={() =>
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: UI_TO_MAIN.PRINT_COLOR_USAGES_PREVIEW_UPDATE,
                          settings,
                          scope,
                        },
                      },
                      "*"
                    )
                  }
                >
                  Check changes
                </Button>

                {preview && (
                  <Stack space="extraSmall">
                    <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                      Candidates: {preview.totals.candidates} | Changes: {preview.totals.changed} | Unchanged: {preview.totals.unchanged} | Skipped: {preview.totals.skipped}
                    </Text>

                  {preview.entries.length === 0 ? (
                    <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                      No text changes found.
                    </Text>
                  ) : (
                    <Stack space="extraSmall">
                      <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                        Selected for apply: {selectedPreviewCount} / {preview.entries.length}
                      </Text>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button
                          secondary
                          onClick={() => setSelectedPreviewNodeIds(preview.entries.map((entry) => entry.nodeId))}
                        >
                          Select all
                        </Button>
                        <Button secondary onClick={() => setSelectedPreviewNodeIds([])}>
                          Clear
                        </Button>
                      </div>
                      <div
                        style={{
                          border: "1px solid var(--figma-color-border)",
                          borderRadius: 6,
                          overflow: "hidden",
                        }}
                      >
                        {preview.entries.map((entry, index) => {
                          const isChecked = selectedPreviewNodeIdSet.has(entry.nodeId)
                          const textDiff = renderInlineDiff(entry.oldText ?? "", entry.newText ?? "")
                          return (
                            <div
                              key={entry.nodeId}
                              style={{
                                borderTop:
                                  index === 0 ? "none" : "1px solid var(--figma-color-border-secondary)",
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
                              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                <Button
                                  secondary
                                  disabled={!isChecked}
                                  onClick={() =>
                                    parent.postMessage(
                                      {
                                        pluginMessage: {
                                          type: UI_TO_MAIN.PRINT_COLOR_USAGES_RESET_LAYER_NAME,
                                          nodeId: entry.nodeId,
                                        },
                                      },
                                      "*"
                                    )
                                  }
                                >
                                  Reset layer name
                                </Button>
                              </div>
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
                                  marginTop: 6,
                                  width: "100%",
                                  display: "block",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "left",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 6,
                                    marginBottom: 4,
                                  }}
                                >
                                  {entry.textChanged ? (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        lineHeight: "14px",
                                        padding: "1px 6px",
                                        borderRadius: 999,
                                        border: "1px solid var(--figma-color-border-brand-strong)",
                                        color: "var(--figma-color-text-brand)",
                                      }}
                                    >
                                      Text
                                    </span>
                                  ) : null}
                                  {entry.layerNameChanged ? (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        lineHeight: "14px",
                                        padding: "1px 6px",
                                        borderRadius: 999,
                                        border: "1px solid var(--figma-color-border-warning)",
                                        color: "var(--figma-color-text-warning)",
                                      }}
                                    >
                                      Layer name
                                    </span>
                                  ) : null}
                                  {entry.linkedColorChanged ? (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        lineHeight: "14px",
                                        padding: "1px 6px",
                                        borderRadius: 999,
                                        border: "1px solid #b7f0c9",
                                        color: "#067647",
                                        background: "#ecfdf3",
                                      }}
                                    >
                                      Linked color changed
                                    </span>
                                  ) : null}
                                </div>
                                <Text
                                  style={{
                                    marginTop: 2,
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
                                    Layer: {entry.oldLayerName || "(empty)"} {"->"} {entry.newLayerName || "(empty)"}
                                  </Text>
                                ) : null}
                                <Text
                                  style={{
                                    color: "var(--figma-color-text-tertiary)",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    lineHeight: "16px",
                                  }}
                                >
                                  Resolved by:{" "}
                                  {entry.resolvedBy === "plugin_data"
                                    ? "plugin data"
                                    : entry.resolvedBy === "layer_variable_id"
                                      ? "layer VariableID"
                                      : entry.resolvedBy === "layer_name"
                                        ? "layer name"
                                        : "text content fallback"}
                                </Text>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </Stack>
                  )}

                  </Stack>
                )}
              </Stack>
            )}

            <VerticalSpace space="small" />
          </Stack>
        </ToolBody>

        {/* Fixed bottom actions */}
        <Divider />
        <Container space="small">
          <VerticalSpace space="small" />
          {activeTab === "Print" ? (
            <Button
              fullWidth
              loading={isWorking}
              onClick={() =>
                parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT, settings } }, "*")
              }
            >
              Print
            </Button>
          ) : (
            <Button
              fullWidth
              loading={isWorking}
              disabled={!hasPreviewChanges}
              onClick={() =>
                parent.postMessage(
                  {
                    pluginMessage: {
                      type: UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE,
                      settings,
                      targetNodeIds: selectedPreviewNodeIds,
                    },
                  },
                  "*"
                )
              }
            >
              {applyLabel}
            </Button>
          )}
          <VerticalSpace space="small" />
        </Container>
      </div>
    </Page>
  )
}

