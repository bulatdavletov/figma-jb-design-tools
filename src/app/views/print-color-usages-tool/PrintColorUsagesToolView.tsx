import { Button, Checkbox, Container, Divider, IconHome16, IconButton, RadioButtons, Stack, Text, TextboxNumeric, VerticalSpace, IconSpacingHorizontalSmall24 } from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  type MainToUiMessage,
  type PrintColorUsagesStatus,
  type PrintColorUsagesUpdatePreviewPayload,
  type PrintColorUsagesPrintPreviewPayload,
  type PrintColorUsagesUiSettings,
  UI_TO_MAIN,
} from "../../messages"
import { CopyIconButton } from "../../components/CopyIconButton"
import { DataList } from "../../components/DataList"
import { DataRow } from "../../components/DataRow"
import { renderInlineDiff } from "../../components/InlineTextDiff"
import { Page } from "../../components/Page"
import { ScopeControl, type ScopeValue } from "../../components/ScopeControl"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"
import { ToolTabs } from "../../components/ToolTabs"

const DEFAULT_SETTINGS: PrintColorUsagesUiSettings = {
  textPosition: "right",
  showLinkedColors: true,
  showFolderNames: true,
  textTheme: "dark",
  checkByContent: false,
  checkNested: true,
  printDistance: 16,
  applyTextColor: true,
  applyTextStyle: true,
}

export function PrintColorUsagesToolView(props: { onBack: () => void }) {
  const [settings, setSettings] = useState<PrintColorUsagesUiSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<"Print" | "Update" | "Settings">("Print")
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<PrintColorUsagesStatus>({ status: "idle" })
  const [selectionSize, setSelectionSize] = useState<number>(0)
  const [scope, setScope] = useState<ScopeValue>("page")
  const [preview, setPreview] = useState<PrintColorUsagesUpdatePreviewPayload | null>(null)
  const [selectedPreviewNodeIds, setSelectedPreviewNodeIds] = useState<string[]>([])
  const [printPreview, setPrintPreview] = useState<PrintColorUsagesPrintPreviewPayload | null>(null)

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

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW) {
        setPrintPreview(msg.payload)
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
    setPrintPreview(null)
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
            setActiveTab(value === "Update" ? "Update" : value === "Settings" ? "Settings" : "Print")
          }
          options={[
            { value: "Print" },
            { value: "Update" },
            { value: "Settings" },
          ]}
        />

        <ToolBody mode="content">
          {/* ============================================================ */}
          {/* Print tab                                                     */}
          {/* ============================================================ */}
          {activeTab === "Print" ? (
            <Stack space="medium">
              {/* Live preview */}
              {printPreview && printPreview.entries.length > 0 ? (
                <DataList header="Will be printed">
                  {printPreview.entries.map((entry, index) => (
                    <DataRow
                      key={`${entry.layerName}-${index}`}
                      primary={entry.label}
                      secondary={entry.layerName}
                      trailing={<CopyIconButton text={entry.layerName} title="Copy layer name" />}
                    />
                  ))}
                </DataList>
              ) : null}

              {!printPreview && selectionSize > 0 ? (
                <Text style={{ color: "var(--figma-color-text-tertiary)" }}>
                  Loading{"\u2026"}
                </Text>
              ) : null}

              {printPreview && printPreview.entries.length === 0 && selectionSize > 0 ? (
                <Text style={{ color: "var(--figma-color-text-tertiary)" }}>
                  No colors found in selection.
                </Text>
              ) : null}
            </Stack>
          ) : null}

          {/* ============================================================ */}
          {/* Update tab                                                    */}
          {/* ============================================================ */}
          {activeTab === "Update" ? (
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
              <Button
                secondary
                loading={isWorking}
                onClick={() => {
                  setStatus({ status: "working", message: "Checking changes\u2026" })
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
                }}
              >
                Check changes
              </Button>

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
                          onClick={() => setSelectedPreviewNodeIds(preview.entries.map((entry) => entry.nodeId))}
                        >
                          Select all
                        </Button>
                        <Button secondary onClick={() => setSelectedPreviewNodeIds([])}>
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
                            // Remove reset entries from preview and selection.
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
                            {/* Checkbox + node name */}
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

                            {/* Diff content -- clickable to focus node */}
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

                            {/* Content mismatch alert (informational) */}
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

                            {/* Resolved by */}
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
          ) : null}

          {/* ============================================================ */}
          {/* Settings tab                                                    */}
          {/* ============================================================ */}
          {activeTab === "Settings" ? (
            <Stack space="small">

              {/* Position */}
              <Stack space="extraSmall">
                <Text>Position</Text>
                <div style={{ height: 24, display: "flex", alignItems: "center" }}>
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
                </div>
              </Stack>

              {/* Distance */}
              <Stack space="extraSmall" style={{ marginBottom: 20 }}>
                <Text>Distance</Text>
                <div style={{ width: 80 }}>
                  <TextboxNumeric icon={<IconSpacingHorizontalSmall24 />}
                    value={String(settings.printDistance)}
                    onNumericValueInput={(value) =>
                      setSettings((s) => ({ ...s, printDistance: value ?? 16 }))
                    }
                    minimum={0}
                    integer
                    suffix=" px"
                  />
                </div>
              </Stack>

              {/* Checkboxes */}
              <Stack space="small">

                <Checkbox
                  value={settings.showLinkedColors}
                  onValueChange={(value) => setSettings((s) => ({ ...s, showLinkedColors: value }))}
                >
                  <Text>Show linked colors</Text>
                </Checkbox>

                <Checkbox
                  value={settings.showFolderNames}
                  onValueChange={(value) => setSettings((s) => ({ ...s, showFolderNames: value }))}
                >
                  <Text>Show folder name (before slash)</Text>
                </Checkbox>

                <Checkbox
                  value={settings.checkNested}
                  onValueChange={(value) => setSettings((s) => ({ ...s, checkNested: value }))}
                >
                  <Text>Check colors of nested items</Text>
                </Checkbox>

                <Checkbox
                  value={settings.applyTextColor}
                  onValueChange={(value) => setSettings((s) => ({ ...s, applyTextColor: value }))}
                >
                  <Text>Apply text color from Mockup Markup</Text>
                </Checkbox>

                <Checkbox
                  value={settings.applyTextStyle}
                  onValueChange={(value) => setSettings((s) => ({ ...s, applyTextStyle: value }))}
                >
                  <Text>Apply text style from Mockup Markup</Text>
                </Checkbox>

              </Stack>

            </Stack>
          ) : null}

        </ToolBody>

        {/* Fixed bottom actions (hidden on Settings tab) */}
        {activeTab !== "Settings" && (
          <>
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
          </>
        )}
      </div>
    </Page>
  )
}
