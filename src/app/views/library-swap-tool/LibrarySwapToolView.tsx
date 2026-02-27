import {
  Button,
  Checkbox,
  Divider,
  FileUploadButton,
  IconButton,
  IconHome16,
  Inline,
  LoadingIndicator,
  Stack,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type MainToUiMessage,
  type LibrarySwapAnalyzeResultPayload,
  type LibrarySwapApplyResultPayload,
  type LibrarySwapProgress,
  type LibrarySwapScanLegacyResultPayload,
  type ManualPair,
} from "../../messages"
import { DataTable, type DataTableColumn } from "../../components/DataTable"
import { NodeTypeIcon } from "../../components/NodeTypeIcon"
import { Page } from "../../components/Page"
import { ScopeControl, useScope } from "../../components/ScopeControl"
import { ToolTabs } from "../../components/ToolTabs"
import { State } from "../../components/State"
import { ToolBody } from "../../components/ToolBody"
import { ToolFooter } from "../../components/ToolFooter"
import { ToolHeader } from "../../components/ToolHeader"
import { ManualPairsTab } from "./ManualPairsTab"

type TabValue = "Migrate" | "Pair"

type Props = {
  onBack: () => void
  initialSelectionEmpty: boolean
}

export function LibrarySwapToolView({ onBack, initialSelectionEmpty }: Props) {
  // -----------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------
  const { scope, setScope, selectionSize, hasSelection, updateSelectionSize } =
    useScope(initialSelectionEmpty)

  // Mappings
  const [useBuiltInIcons, setUseBuiltInIcons] = useState(true)
  const [useBuiltInUikit, setUseBuiltInUikit] = useState(true)
  const [includeHidden, setIncludeHidden] = useState(true)
  const [customFilename, setCustomFilename] = useState<string | null>(null)
  const [customJsonText, setCustomJsonText] = useState<string | null>(null)

  // Busy / progress
  const [isBusy, setIsBusy] = useState(false)
  const [stage, setStage] = useState<"idle" | "analyze" | "preview" | "apply">("idle")
  const [progress, setProgress] = useState<LibrarySwapProgress | null>(null)

  // Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Results
  const [analyzeResult, setAnalyzeResult] = useState<LibrarySwapAnalyzeResultPayload | null>(null)
  const [applyResult, setApplyResult] = useState<LibrarySwapApplyResultPayload | null>(null)

  // Scan Legacy
  const [scanLegacyResult, setScanLegacyResult] = useState<LibrarySwapScanLegacyResultPayload | null>(null)

  // Tabs
  const [activeTab, setActiveTab] = useState<TabValue>("Migrate")

  // Manual pairs
  const [capturedOldName, setCapturedOldName] = useState<string | null>(null)
  const [capturedNewName, setCapturedNewName] = useState<string | null>(null)
  const [manualPairs, setManualPairs] = useState<ManualPair[]>([])
  const [manualPairsExportTarget, setManualPairsExportTarget] = useState<"uikit" | "icons">("uikit")

  // -----------------------------------------------------------------------
  // Derived
  // -----------------------------------------------------------------------
  const hasMapping = useBuiltInIcons || useBuiltInUikit || !!customJsonText || manualPairs.length > 0
  const canAct = hasMapping && !isBusy

  // -----------------------------------------------------------------------
  // Message handling
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_SELECTION) {
        updateSelectionSize(msg.selectionSize)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_ANALYZE_RESULT) {
        setErrorMessage(null)
        setAnalyzeResult(msg.payload)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_PROGRESS) {
        setProgress(msg.progress)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_APPLY_RESULT) {
        setIsBusy(false)
        setStage("idle")
        setProgress(null)
        setErrorMessage(null)
        setApplyResult(msg.payload)
        setAnalyzeResult(null)
        setScanLegacyResult(null)
        setSuccessMessage(`${msg.payload.swapped} swapped, ${msg.payload.skipped} skipped`)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_PREVIEW_RESULT) {
        setIsBusy(false)
        setStage("idle")
        setProgress(null)
        setErrorMessage(null)
        setSuccessMessage(`Preview created with ${msg.previewed} samples`)
      }

      if (msg.type === MAIN_TO_UI.ERROR) {
        setErrorMessage(msg.message)
        setIsBusy(false)
        setStage("idle")
        setProgress(null)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT) {
        if (msg.side === "old") setCapturedOldName(msg.name)
        if (msg.side === "new") setCapturedNewName(msg.name)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_PAIRS_UPDATED) {
        setManualPairs(msg.pairs)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESULT) {
        setIsBusy(false)
        setStage("idle")
        setProgress(null)
        setErrorMessage(null)
        setSuccessMessage(null)
        setScanLegacyResult(msg.payload)
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT) {
        if (msg.ok && scanLegacyResult) {
          setScanLegacyResult({
            ...scanLegacyResult,
            styles: scanLegacyResult.styles.filter((s) => s.nodeId !== msg.nodeId),
          })
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------
  function buildRequest() {
    return {
      scope,
      includeHidden,
      useBuiltInIcons,
      useBuiltInUikit,
      customMappingJsonText: customJsonText ?? undefined,
    }
  }

  function handleAnalyze() {
    setIsBusy(true)
    setStage("analyze")
    setErrorMessage(null)
    setSuccessMessage(null)
    setApplyResult(null)
    setScanLegacyResult(null)
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_ANALYZE, request: buildRequest() } },
      "*"
    )
  }

  function handlePreview() {
    setIsBusy(true)
    setStage("preview")
    setErrorMessage(null)
    setSuccessMessage(null)
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_PREVIEW, request: { ...buildRequest(), sampleSize: 60 } } },
      "*"
    )
  }

  function handleApply() {
    setIsBusy(true)
    setStage("apply")
    setErrorMessage(null)
    setSuccessMessage(null)
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_APPLY, request: buildRequest() } },
      "*"
    )
  }

  function handleResetOverride(nodeId: string, property: "fill" | "stroke") {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_SCAN_LEGACY_RESET, nodeId, property } },
      "*"
    )
  }

  function handleClearPreviews() {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_CLEAR_PREVIEWS } },
      "*"
    )
  }

  function handleFocusNode(nodeId: string) {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_FOCUS_NODE, nodeId } },
      "*"
    )
  }

  function handleCaptureOld() {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_OLD } },
      "*"
    )
  }

  function handleCaptureNew() {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_NEW } },
      "*"
    )
  }

  function handleRemovePair(oldKey: string) {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_REMOVE_PAIR, oldKey } },
      "*"
    )
  }

  function handleExportMapping() {
    if (manualPairs.length === 0) return
    const matches: Record<string, string> = {}
    const matchMeta: Record<string, { oldFullName: string; newFullName: string }> = {}
    for (const p of manualPairs) {
      matches[p.oldKey] = p.newKey
      matchMeta[p.oldKey] = { oldFullName: p.oldName, newFullName: p.newName }
    }
    const exported = {
      schemaVersion: 2,
      createdAt: new Date().toISOString(),
      meta: { note: "Manual pairs exported from Library Swap" },
      matches,
      matchMeta,
    }
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" })
    // --- Begin filename logic for dynamic date and time ---
    const now = new Date()
    // Get UTC date/time components
    const day = String(now.getUTCDate()).padStart(2, "0")
    const month = String(now.getUTCMonth() + 1).padStart(2, "0")
    const year = String(now.getUTCFullYear())
    const hours = String(now.getUTCHours()).padStart(2, "0")
    const minutes = String(now.getUTCMinutes()).padStart(2, "0")
    const dateTime = `${day}.${month}.${year}-${hours}-${minutes}`
    const fileName = `${manualPairsExportTarget}-mapping-${dateTime}.json`
    // --- End filename logic ---
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleLoadFile(files: File[]) {
    const file = files[0]
    if (!file) return
    const text = await file.text()
    setCustomFilename(file.name)
    setCustomJsonText(text)
    setAnalyzeResult(null)
    setApplyResult(null)
    setErrorMessage(null)
    setSuccessMessage(`Loaded: ${file.name}`)
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_SET_CUSTOM_MAPPING, jsonText: text } },
      "*"
    )
  }

  // -----------------------------------------------------------------------
  // Table constants
  // -----------------------------------------------------------------------
  const swapColumns: DataTableColumn[] = [
    { label: "Layer name", width: "30%" },
    { label: "Old component", width: "35%" },
    { label: "New component", width: "35%" },
  ]

  const legacyStyleColumns: DataTableColumn[] = [
    { label: "", width: 24 },
    { label: "Layer", width: "25%" },
    { label: "Style", width: "40%" },
    { label: "", width: "35%" },
  ]

  const cellStyle: h.JSX.CSSProperties = {
    padding: "6px 8px",
    fontSize: 11,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }

  const iconCellStyle: h.JSX.CSSProperties = {
    padding: "6px 4px",
    textAlign: "center",
    verticalAlign: "middle",
  }

  // -----------------------------------------------------------------------
  // No mapping state
  // -----------------------------------------------------------------------
  if (!hasMapping) {
    return (
      <Page>
        <ToolHeader
          title="Library Swap"
          left={
            <IconButton onClick={onBack} title="Home">
              <IconHome16 />
            </IconButton>
          }
        />
        <ToolBody mode="state">
          <State
            title="No mapping loaded"
            description="Enable the built-in mapping or import a custom one"
          />
        </ToolBody>
      </Page>
    )
  }

  // -----------------------------------------------------------------------
  // Primary button label
  // -----------------------------------------------------------------------
  const analyzeLabel = isBusy && stage === "analyze" ? "Analyzing..." : "Analyze"
  const applyLabel = (() => {
    if (isBusy && stage === "apply") return "Applying..."
    if (analyzeResult) return `Apply swap (${analyzeResult.mappableInstances})`
    return "Apply swap"
  })()

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <Page>
      <ToolHeader
        title="Migrate to New UI Kit"
        left={
          <IconButton onClick={onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <ToolTabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          options={[
            { value: "Migrate" },
            { value: "Pair" },
          ]}
        />

        <ToolBody mode="content">
          {activeTab === "Migrate" ? (
        <Stack space="medium">

          {/* -- Scope ----------------------------------------------------- */}
          <Stack space="small">
            <Text style={{ fontWeight: 600 }}>Scope</Text>
            <ScopeControl
              value={scope}
              hasSelection={hasSelection}
              onValueChange={setScope}
              disabled={isBusy}
            />
            <Checkbox
              value={includeHidden}
              onValueChange={setIncludeHidden}
              disabled={isBusy}
            >
              <Text>Check Hidden Layers</Text>
            </Checkbox>
          </Stack>

          {/* -- Preview (only after analyze) ------------------------------ */}
          {analyzeResult && !isBusy && (
            <Inline space="extraSmall">
              <Button
                onClick={handlePreview}
                disabled={!canAct}
                secondary
              >
                {isBusy && stage === "preview" ? "Previewing..." : "Preview"}
              </Button>
              <Button
                onClick={handleClearPreviews}
                disabled={isBusy}
                secondary
              >
                Clear previews
              </Button>
            </Inline>
          )}

          {/* -- Status ---------------------------------------------------- */}
          {errorMessage && (
            <div style={{ padding: 8, background: "#fff1f2", borderRadius: 4 }}>
              <Text style={{ color: "#9f1239" }}>{errorMessage}</Text>
            </div>
          )}

          {successMessage && !errorMessage && (
            <div style={{ padding: 8, background: "#ecfdf3", borderRadius: 4 }}>
              <Text style={{ color: "#067647" }}>{successMessage}</Text>
            </div>
          )}

          {/* -- Analyze result -------------------------------------------- */}
          {analyzeResult && !isBusy && (
            analyzeResult.mappableInstances > 0 ? (
              <DataTable
                header="Instances to swap"
                summary={`${analyzeResult.mappableInstances} mappable of ${analyzeResult.totalInstances} total (${analyzeResult.uniqueOldKeys} unique components)${analyzeResult.items.length < analyzeResult.mappableInstances ? ` — showing first ${analyzeResult.items.length}` : ""}`}
                columns={swapColumns}
              >
                {analyzeResult.items.map((item) => (
                  <tr
                    key={item.nodeId}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleFocusNode(item.nodeId)}
                    title="Click to focus on canvas"
                  >
                    <td style={cellStyle}>{item.instanceName}</td>
                    <td style={cellStyle}>{item.oldComponentName}</td>
                    <td style={cellStyle}>{item.newComponentName}</td>
                  </tr>
                ))}
              </DataTable>
            ) : (
              <div style={{ padding: 8, background: "var(--figma-color-bg-secondary)", borderRadius: 4 }}>
                <Text style={{ color: "var(--figma-color-text-secondary)", fontSize: 11 }}>
                  No mappable instances found ({analyzeResult.totalInstances} total scanned)
                </Text>
              </div>
            )
          )}

          {/* -- Apply result ---------------------------------------------- */}
          {applyResult && !isBusy && (
            <DataTable
              header="Swapped instances"
              summary={`${applyResult.swapped} swapped, ${applyResult.skipped} skipped`}
              columns={swapColumns}
            >
              {applyResult.swappedItems.map((item) => (
                <tr
                  key={item.nodeId}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFocusNode(item.nodeId)}
                  title="Click to focus on canvas"
                >
                  <td style={cellStyle}>{item.name}</td>
                  <td style={cellStyle}>{item.oldComponentName}</td>
                  <td style={cellStyle}>{item.newComponentName}</td>
                </tr>
              ))}
            </DataTable>
          )}

          {/* -- Scan Legacy results --------------------------------------- */}
          {scanLegacyResult && !isBusy && (
            <Fragment>
              {scanLegacyResult.styles.length > 0 && (
                <Fragment>
                  <VerticalSpace space="small" />
                  <DataTable
                    header="Legacy color styles"
                    summary={`${scanLegacyResult.styles.length} style usage${scanLegacyResult.styles.length !== 1 ? "s" : ""} found`}
                    columns={legacyStyleColumns}
                  >
                    {scanLegacyResult.styles.map((item, idx) => (
                      <tr
                        key={`${item.nodeId}-${item.property}-${idx}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleFocusNode(item.nodeId)}
                        title={`${item.pageName} — click to focus`}
                      >
                        <td style={iconCellStyle}>
                          <NodeTypeIcon
                            type={item.property === "fill" ? "colorStyleFill" : "colorStyleStroke"}
                            color={item.colorHex ?? undefined}
                          />
                        </td>
                        <td style={cellStyle}>{item.nodeName}</td>
                        <td style={cellStyle}>{item.styleName}</td>
                        <td style={{ ...cellStyle, textAlign: "center" }}>
                          {item.isOverride && (
                            <Button
                              secondary
                              onClick={(e: MouseEvent) => {
                                e.stopPropagation()
                                handleResetOverride(item.nodeId, item.property)
                              }}
                              style={{ fontSize: 10, padding: "2px 6px" }}
                            >
                              Reset override
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </DataTable>
                </Fragment>
              )}

              {scanLegacyResult.styles.length === 0 && (
                <div style={{ padding: 8, background: "#ecfdf3", borderRadius: 4 }}>
                  <Text style={{ color: "#067647" }}>No legacy items found — clean!</Text>
                </div>
              )}
            </Fragment>
          )}

          {/* -- Mappings -------------------------------------------------- */}
          <Divider />
          <Stack space="small">
            <Text style={{ fontWeight: 600 }}>Mappings</Text>
            <Checkbox
              value={useBuiltInIcons}
              onValueChange={setUseBuiltInIcons}
            >
              <Text>Int UI Icons</Text>
            </Checkbox>
            <Checkbox
              value={useBuiltInUikit}
              onValueChange={setUseBuiltInUikit}
            >
              <Text>Int UI Kit Islands</Text>
            </Checkbox>
            {/* TODO: re-enable when custom mappings are needed
            <FileUploadButton
              acceptedFileTypes={[".json", "application/json"]}
              onSelectedFiles={handleLoadFile}
            >
              {customFilename ? `Custom: ${customFilename}` : "Import mapping JSON..."}
            </FileUploadButton>
            */}
          </Stack>
        </Stack>
          ) : (
            <ManualPairsTab
              capturedOldName={capturedOldName}
              capturedNewName={capturedNewName}
              manualPairs={manualPairs}
              manualPairsExportTarget={manualPairsExportTarget}
              onExportTargetChange={setManualPairsExportTarget}
              selectionSize={selectionSize}
              isBusy={isBusy}
              onCaptureOld={handleCaptureOld}
              onCaptureNew={handleCaptureNew}
              onRemovePair={handleRemovePair}
              onExportMapping={handleExportMapping}
            />
          )}
        </ToolBody>

      {activeTab === "Migrate" && (
      <>
      <ToolFooter direction="column">
        {isBusy && (
          <Inline space="extraSmall">
            <LoadingIndicator />
            <Text>
              {progress
                ? progress.message
                : stage === "analyze"
                  ? "Analyzing..."
                  : stage === "preview"
                    ? "Creating preview..."
                    : "Swapping..."}
            </Text>
          </Inline>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Button
              onClick={handleAnalyze}
              disabled={!canAct}
              fullWidth
              secondary
            >
              {analyzeLabel}
            </Button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Button
              onClick={handleApply}
              disabled={!canAct}
              fullWidth
            >
              {applyLabel}
            </Button>
          </div>
        </div>
      </ToolFooter>
      </>
      )}
      </div>
    </Page>
  )
}
