import {
  Button,
  Checkbox,
  Divider,
  FileUploadButton,
  IconButton,
  IconClose16,
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
  type LibrarySwapScope,
  type LibrarySwapAnalyzeResultPayload,
  type LibrarySwapApplyResultPayload,
  type LibrarySwapProgress,
  type ManualPair,
} from "../../messages"
import { DataList } from "../../components/DataList"
import { DataTable, type DataTableColumn } from "../../components/DataTable"
import { Page } from "../../components/Page"
import { ScopeControl } from "../../components/ScopeControl"
import { State } from "../../components/State"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"

type Props = {
  onBack: () => void
  initialSelectionEmpty: boolean
}

export function LibrarySwapToolView({ onBack, initialSelectionEmpty }: Props) {
  // -----------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------
  const [selectionSize, setSelectionSize] = useState(initialSelectionEmpty ? 0 : 1)
  const [scope, setScope] = useState<LibrarySwapScope>(
    initialSelectionEmpty ? "page" : "selection"
  )

  // Mappings
  const [useBuiltInIcons, setUseBuiltInIcons] = useState(true)
  const [useBuiltInUikit, setUseBuiltInUikit] = useState(true)
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

  // Manual pairs
  const [capturedOldName, setCapturedOldName] = useState<string | null>(null)
  const [capturedNewName, setCapturedNewName] = useState<string | null>(null)
  const [manualPairs, setManualPairs] = useState<ManualPair[]>([])

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
        setSelectionSize(msg.selectionSize)
        setScope(msg.selectionSize > 0 ? "selection" : "page")
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_SWAP_ANALYZE_RESULT) {
        setIsBusy(false)
        setStage("idle")
        setProgress(null)
        setErrorMessage(null)
        setAnalyzeResult(msg.payload)
        const p = msg.payload
        setSuccessMessage(
          `Found ${p.totalInstances} instances, ${p.mappableInstances} mappable (${p.uniqueOldKeys} unique components)`
        )
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
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "manual-mapping-export.json"
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
    // Also send to main thread so it can validate
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.LIBRARY_SWAP_SET_CUSTOM_MAPPING, jsonText: text } },
      "*"
    )
  }

  // -----------------------------------------------------------------------
  // Table constants
  // -----------------------------------------------------------------------
  const analyzeColumns: DataTableColumn[] = [
    { label: "Instance", width: "30%" },
    { label: "Old component", width: "35%" },
    { label: "New component", width: "35%" },
  ]

  const pairsColumns: DataTableColumn[] = [
    { label: "Old component", width: "42%" },
    { label: "New component", width: "42%" },
    { label: "", width: "16%" },
  ]

  const cellStyle: h.JSX.CSSProperties = {
    padding: "6px 8px",
    fontSize: 11,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
        title="Library Swap"
        left={
          <IconButton onClick={onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />

      <ToolBody mode="content">
        <Stack space="medium">
          {/* -- Mappings -------------------------------------------------- */}
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
            <FileUploadButton
              acceptedFileTypes={[".json", "application/json"]}
              onSelectedFiles={handleLoadFile}
            >
              {customFilename ? `Custom: ${customFilename}` : "Import mapping JSON..."}
            </FileUploadButton>
          </Stack>

          {/* -- Scope ----------------------------------------------------- */}
          <Stack space="small">
            <Text style={{ fontWeight: 600 }}>Scope</Text>
            <ScopeControl
              value={scope}
              hasSelection={selectionSize > 0}
              onValueChange={setScope}
              disabled={isBusy}
            />
          </Stack>

          {/* -- Actions --------------------------------------------------- */}
          <Inline space="extraSmall">
            <Button
              onClick={handleAnalyze}
              disabled={!canAct}
              secondary
            >
              {isBusy && stage === "analyze" ? "Analyzing..." : "Analyze"}
            </Button>
            <Button
              onClick={handlePreview}
              disabled={!canAct}
              secondary
            >
              {isBusy && stage === "preview" ? "Previewing..." : "Preview"}
            </Button>
            <Button
              onClick={handleApply}
              disabled={!canAct}
            >
              {applyLabel}
            </Button>
          </Inline>

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

          {/* -- Analyze result -------------------------------------------- */}
          {analyzeResult && !isBusy && (
            <DataTable
              header="Instances to swap"
              summary={`${analyzeResult.mappableInstances} mappable of ${analyzeResult.totalInstances} total (${analyzeResult.uniqueOldKeys} unique components)${analyzeResult.items.length < analyzeResult.mappableInstances ? ` — showing first ${analyzeResult.items.length}` : ""}`}
              columns={analyzeColumns}
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
          )}

          {/* -- Apply result ---------------------------------------------- */}
          {applyResult && !isBusy && (
            <Fragment>
              <DataList
                header="Swapped instances"
                summary={`${applyResult.swapped} swapped, ${applyResult.skipped} skipped`}
                emptyText="No instances were swapped"
              >
                {applyResult.swappedItems.map((item) => (
                  <div
                    key={item.nodeId}
                    style={{
                      padding: "6px 8px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleFocusNode(item.nodeId)}
                    title="Click to focus on canvas"
                  >
                    <Text style={{ fontSize: 11 }}>
                      {item.name}
                    </Text>
                    {item.pageName && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "var(--figma-color-text-secondary)",
                        }}
                      >
                        {item.pageName}
                      </Text>
                    )}
                  </div>
                ))}
              </DataList>
            </Fragment>
          )}

          {/* -- Manual pairs ---------------------------------------------- */}
          <Divider />
          <Stack space="small">
            <Text style={{ fontWeight: 600 }}>Manual pairs</Text>

            {/* Pending capture slots */}
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              <Text style={{ fontSize: 11, color: capturedOldName ? "var(--figma-color-text)" : "var(--figma-color-text-tertiary)" }}>
                Old: {capturedOldName ?? "—"}
              </Text>
              <Text style={{ fontSize: 11, color: capturedNewName ? "var(--figma-color-text)" : "var(--figma-color-text-tertiary)" }}>
                New: {capturedNewName ?? "—"}
              </Text>
            </div>

            <Inline space="extraSmall">
              <Button
                secondary
                onClick={handleCaptureOld}
                disabled={selectionSize === 0 || isBusy}
              >
                Capture Old
              </Button>
              <Button
                secondary
                onClick={handleCaptureNew}
                disabled={selectionSize === 0 || isBusy}
              >
                Capture New
              </Button>
            </Inline>

            {/* Pairs table or empty state */}
            {manualPairs.length > 0 ? (
              <DataTable
                header="Recorded pairs"
                summary={`${manualPairs.length} pair${manualPairs.length !== 1 ? "s" : ""}`}
                columns={pairsColumns}
              >
                {manualPairs.map((pair) => (
                  <tr key={pair.oldKey}>
                    <td style={cellStyle}>{pair.oldName}</td>
                    <td style={cellStyle}>{pair.newName}</td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      <IconButton onClick={() => handleRemovePair(pair.oldKey)} title="Remove pair">
                        <IconClose16 />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </DataTable>
            ) : (
              <Text style={{ fontSize: 11, color: "var(--figma-color-text-tertiary)" }}>
                No pairs recorded yet
              </Text>
            )}

            {/* Export button */}
            <Button
              secondary
              onClick={handleExportMapping}
              disabled={manualPairs.length === 0}
            >
              Export mapping
            </Button>
          </Stack>
        </Stack>
      </ToolBody>
    </Page>
  )
}
