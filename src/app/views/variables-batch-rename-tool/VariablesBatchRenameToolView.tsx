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
  Textbox,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { MIXED_BOOLEAN } from "@create-figma-plugin/utilities"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type MainToUiMessage,
  type VariableCollectionInfo,
  type BatchRenamePreviewPayload,
  type BatchRenamePreviewEntry,
  type BatchRenamePreviewEntryStatus,
  type BatchRenameApplyResultPayload,
  type BatchRenameProgress,
} from "../../messages"
import { renderInlineDiff } from "../../components/InlineTextDiff"
import { Page } from "../../components/Page"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"

type Props = {
  onBack: () => void
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function copyTextToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      textarea.remove()
      return true
    } catch {
      return false
    }
  }
}

function getStatusPillStyle(status: BatchRenamePreviewEntryStatus): {
  background: string
  borderColor: string
  color: string
} {
  if (status === "conflict") {
    return { background: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" }
  }

  if (status === "rename" || status === "unchanged") {
    return { background: "#ecfdf3", borderColor: "#b7f0c9", color: "#067647" }
  }

  // warning-ish statuses
  return { background: "#fff7ed", borderColor: "#fed7aa", color: "#9a3412" }
}

export function VariablesBatchRenameToolView({ onBack }: Props) {
  const [collections, setCollections] = useState<VariableCollectionInfo[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Export state
  const [exportSetName, setExportSetName] = useState("current")
  const [exportIncludeCurrentName, setExportIncludeCurrentName] = useState(true)
  const [exportSelectedCollectionIds, setExportSelectedCollectionIds] = useState<string[]>([])
  const [didInitExportSelection, setDidInitExportSelection] = useState(false)
  const [exportStatus, setExportStatus] = useState<string | null>(null)
  const [lastExport, setLastExport] = useState<{ filename: string; jsonText: string } | null>(null)

  // Import state
  const [importFilename, setImportFilename] = useState<string | null>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importJsonText, setImportJsonText] = useState<string>("")
  const [importPreview, setImportPreview] = useState<BatchRenamePreviewPayload | null>(null)
  const [importBusy, setImportBusy] = useState(false)
  const [importStage, setImportStage] = useState<"idle" | "preview" | "apply">("idle")
  const [importApplyProgress, setImportApplyProgress] = useState<BatchRenameProgress | null>(null)
  const [importResult, setImportResult] = useState<BatchRenameApplyResultPayload | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.BATCH_RENAME_COLLECTIONS_LIST) {
        setCollections(msg.collections)
        if (!didInitExportSelection) {
          setExportSelectedCollectionIds(msg.collections.map((collection) => collection.id))
          setDidInitExportSelection(true)
        }
      }

      if (msg.type === MAIN_TO_UI.BATCH_RENAME_NAME_SET_READY) {
        downloadTextFile(msg.payload.filename, msg.payload.jsonText)
        setExportStatus(`Exported: ${msg.payload.filename}`)
        setSuccessMessage(`Exported "${msg.payload.filename}"`)
        setLastExport({ filename: msg.payload.filename, jsonText: msg.payload.jsonText })
      }

      if (msg.type === MAIN_TO_UI.BATCH_RENAME_IMPORT_PREVIEW) {
        setImportPreview(msg.payload)
        setImportBusy(false)
        setImportStage("idle")
        setImportResult(null)
        setErrorMessage(null)
        setSuccessMessage(
          `Import preview ready: rename ${msg.payload.totals.renames}, conflicts ${msg.payload.totals.conflicts}, missing ${msg.payload.totals.missing}`
        )
      }

      if (msg.type === MAIN_TO_UI.BATCH_RENAME_APPLY_PROGRESS) {
        setImportApplyProgress(msg.progress)
      }

      if (msg.type === MAIN_TO_UI.BATCH_RENAME_APPLY_RESULT) {
        setImportBusy(false)
        setImportStage("idle")
        setImportApplyProgress(null)
        setImportResult(msg.payload)
        setSuccessMessage(
          `Applied: renamed ${msg.payload.totals.renamed}, unchanged ${msg.payload.totals.unchanged}, skipped ${msg.payload.totals.skipped}, failed ${msg.payload.totals.failed}`
        )
      }

      if (msg.type === MAIN_TO_UI.ERROR) {
        setErrorMessage(msg.message)
        setImportBusy(false)
        setImportStage("idle")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [didInitExportSelection])

  // Auto-hide success messages
  useEffect(() => {
    if (!successMessage) return
    const t = window.setTimeout(() => setSuccessMessage(null), 4500)
    return () => window.clearTimeout(t)
  }, [successMessage])

  const exportCollectionsOptions = useMemo(
    () => collections,
    [collections]
  )

  const allCollectionIds = useMemo(
    () => exportCollectionsOptions.map((c) => c.id),
    [exportCollectionsOptions]
  )
  const selectedCollectionIdsInOptions = useMemo(
    () => exportSelectedCollectionIds.filter((id) => allCollectionIds.includes(id)),
    [allCollectionIds, exportSelectedCollectionIds]
  )
  const areAllCollectionsSelected =
    exportCollectionsOptions.length > 0 &&
    selectedCollectionIdsInOptions.length === exportCollectionsOptions.length
  const hasSomeCollectionsSelected =
    selectedCollectionIdsInOptions.length > 0 && !areAllCollectionsSelected

  const importRows = useMemo(() => {
    const entries = importPreview?.entries ?? []
    const order = (status: BatchRenamePreviewEntryStatus) => {
      switch (status) {
        case "conflict":
          return 0
        case "missing":
          return 1
        case "invalid":
          return 2
        case "out_of_scope":
          return 3
        case "stale":
          return 4
        case "rename":
          return 5
        case "unchanged":
          return 6
        default:
          return 10
      }
    }
    return entries
      .slice()
      .sort(
        (a, b) =>
          order(a.status) - order(b.status) ||
          (a.currentName ?? "").localeCompare(b.currentName ?? "")
      )
  }, [importPreview])

  const canApplyImportedRenames =
    importPreview !== null &&
    importPreview.totals.renames > 0 &&
    importPreview.totals.conflicts === 0

  const handleExport = () => {
    if (selectedCollectionIdsInOptions.length === 0) {
      setErrorMessage("Select at least one collection to export.")
      return
    }
    setExportStatus(null)
    setSuccessMessage(null)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.BATCH_RENAME_EXPORT_NAME_SET,
          request: {
            setName: exportSetName.trim(),
            description: "",
            collectionIds: selectedCollectionIdsInOptions,
            types: [],
            includeCurrentName: exportIncludeCurrentName,
          },
        },
      },
      "*"
    )
  }

  const handleImportFile = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setImportBusy(true)
    setImportStage("preview")
    setImportApplyProgress(null)
    setSuccessMessage(null)
    setImportFilename(file.name)
    setImportFile(file)
    const text = await file.text()
    setImportJsonText(text)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT,
          request: { jsonText: text },
        },
      },
      "*"
    )
  }

  const handlePreviewAgain = async () => {
    const cached = importJsonText.trim()
    if (!importFile && !cached) return
    setImportBusy(true)
    setImportStage("preview")
    setImportApplyProgress(null)
    setSuccessMessage(null)

    if (importFile) {
      const text = await importFile.text()
      setImportJsonText(text)
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT,
            request: { jsonText: text },
          },
        },
        "*"
      )
      return
    }

    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT,
          request: { jsonText: importJsonText },
        },
      },
      "*"
    )
  }

  const handleApplyRenames = () => {
    if (!importPreview) return
    setImportBusy(true)
    setImportStage("apply")
    setSuccessMessage(null)
    const entries = importPreview.entries
      .filter((e) => e.status === "rename" && e.newName)
      .map((e) => ({
        variableId: e.variableId,
        expectedOldName: e.expectedOldName,
        newName: e.newName as string,
      }))
    setImportApplyProgress({ current: 0, total: entries.length, message: "Starting..." })
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.BATCH_RENAME_APPLY_IMPORT,
          request: { entries },
        },
      },
      "*"
    )
  }

  return (
    <Page>
      <ToolHeader
        title="Variables Batch Rename"
        left={
          <IconButton onClick={onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />
      <ToolBody mode="content">
        <Stack space="medium">
          {errorMessage && (
            <Fragment>
              <div style={{ padding: 8, background: "#fff1f2", borderRadius: 4 }}>
                <Text style={{ color: "#9f1239" }}>{errorMessage}</Text>
              </div>
            </Fragment>
          )}

          {successMessage && (
            <Fragment>
              <div style={{ padding: 8, background: "#ecfdf3", borderRadius: 4 }}>
                <Text style={{ color: "#067647" }}>{successMessage}</Text>
              </div>
            </Fragment>
          )}

          <Stack space="extraSmall">
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>
              Export and import rename sets by variable ID.
            </Text>
          </Stack>

          <Textbox
            value={exportSetName}
            placeholder="Set name"
            onValueInput={(value: string) => setExportSetName(value)}
          />

          <Checkbox
            value={exportIncludeCurrentName}
            onValueChange={setExportIncludeCurrentName}
          >
            <Text>Include currentName (for review/editing)</Text>
          </Checkbox>

          <Divider />

          <Stack space="small">
            <Text>Collections</Text>
            <div>
              {exportCollectionsOptions.length === 0 ? (
                <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                  No collections loaded yet.
                </Text>
              ) : null}
              {exportCollectionsOptions.length > 0 ? (
                <Checkbox
                  value={hasSomeCollectionsSelected ? MIXED_BOOLEAN : areAllCollectionsSelected}
                  onValueChange={(next) =>
                    setExportSelectedCollectionIds(next ? allCollectionIds : [])
                  }
                >
                  <Text>Collections</Text>
                </Checkbox>
              ) : null}
              <VerticalSpace space="extraSmall" />
              <Stack space="extraSmall" style={{ marginLeft: 20 }}>
                {exportCollectionsOptions.map((c) => {
                  const checked = exportSelectedCollectionIds.includes(c.id)
                  return (
                    <Checkbox
                      key={c.id}
                      value={checked}
                      onValueChange={(next) => {
                        setExportSelectedCollectionIds((prev) => {
                          if (next) {
                            return prev.includes(c.id) ? prev : [...prev, c.id]
                          }
                          return prev.filter((id) => id !== c.id)
                        })
                      }}
                    >
                      <Text>{c.name}</Text>
                    </Checkbox>
                  )
                })}
              </Stack>
            </div>
          </Stack>

          <Inline space="extraSmall">
            <Button disabled={!exportSetName.trim() || selectedCollectionIdsInOptions.length === 0} onClick={handleExport}>
              Export name set
            </Button>
            <Button
              secondary
              disabled={!lastExport}
              onClick={async () => {
                if (!lastExport) return
                const ok = await copyTextToClipboard(lastExport.jsonText)
                setSuccessMessage(ok ? `Copied "${lastExport.filename}" JSON` : "Copy failed")
              }}
            >
              Copy last export
            </Button>
          </Inline>

          {exportStatus && (
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>{exportStatus}</Text>
          )}
        </Stack>

        <VerticalSpace space="large" />
        <Divider />
        <VerticalSpace space="large" />

        {/* Import Section */}
        <Stack space="medium">
          <Stack space="extraSmall">
            <Text style={{ fontWeight: 600 }}>Import name set (JSON) → Preview → Apply</Text>
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>
              Renames are applied by variable ID. If currentName doesn't match, you'll see a
              warning but it can still apply safely.
            </Text>
          </Stack>

          <Inline space="extraSmall">
            <FileUploadButton
              acceptedFileTypes={[".json", "application/json"]}
              onSelectedFiles={handleImportFile}
            >
              Choose JSON file…
            </FileUploadButton>
            <Button
              secondary
              disabled={(!importFile && !importJsonText.trim()) || importBusy}
              onClick={handlePreviewAgain}
            >
              Preview again
            </Button>
          </Inline>

          {importBusy && (
            <Inline space="extraSmall">
              <LoadingIndicator />
              <Text>
                {importStage === "apply"
                  ? `Applying renames… ${
                      importApplyProgress
                        ? `${importApplyProgress.current} / ${importApplyProgress.total}`
                        : ""
                    }`
                  : "Building import preview…"}
              </Text>
            </Inline>
          )}

          {importPreview && (
            <Stack space="small">
              {importPreview.meta.description && <Text>{importPreview.meta.description}</Text>}
              {importFilename && (
                <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                  Loaded file: {importFilename}
                </Text>
              )}

              <Text>
                Rows: {importPreview.totals.considered} · rename {importPreview.totals.renames} ·
                unchanged {importPreview.totals.unchanged} · conflicts{" "}
                {importPreview.totals.conflicts} · missing {importPreview.totals.missing} · invalid{" "}
                {importPreview.totals.invalid} · out_of_scope {importPreview.totals.outOfScope}
              </Text>

              <Button
                loading={importBusy}
                disabled={importBusy || !canApplyImportedRenames}
                onClick={handleApplyRenames}
              >
                Apply renames
              </Button>

              {!canApplyImportedRenames && importPreview.totals.conflicts > 0 && (
                <Text style={{ color: "#9f1239" }}>
                  Resolve conflicts in the JSON (duplicate newName) before applying.
                </Text>
              )}

              {importResult && (
                <Text style={{ color: "#067647" }}>
                  Renamed: {importResult.totals.renamed}, Unchanged: {importResult.totals.unchanged}
                  , Skipped: {importResult.totals.skipped}, Failed: {importResult.totals.failed}
                </Text>
              )}

              <Divider />

              {/* Preview Table */}
              <div
                style={{
                  border: "1px solid #e3e3e3",
                  borderRadius: 6,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                    tableLayout: "fixed",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: "1px solid #e3e3e3",
                          textAlign: "left",
                          padding: "6px 8px",
                          position: "sticky",
                          top: 0,
                          background: "#fafafa",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e3e3e3",
                          textAlign: "left",
                          padding: "6px 8px",
                          position: "sticky",
                          top: 0,
                          background: "#fafafa",
                        }}
                      >
                        Current
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e3e3e3",
                          textAlign: "left",
                          padding: "6px 8px",
                          position: "sticky",
                          top: 0,
                          background: "#fafafa",
                        }}
                      >
                        New
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #e3e3e3",
                          textAlign: "left",
                          padding: "6px 8px",
                          position: "sticky",
                          top: 0,
                          background: "#fafafa",
                        }}
                      >
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((entry: BatchRenamePreviewEntry) => {
                      const pillStyle = getStatusPillStyle(entry.status)
                      const { beforeNode, afterNode } = renderInlineDiff(
                        entry.currentName ?? "",
                        entry.newName ?? ""
                      )

                      return (
                        <tr key={entry.variableId}>
                          <td style={{ padding: "4px 8px", verticalAlign: "top" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 600,
                                background: pillStyle.background,
                                border: `1px solid ${pillStyle.borderColor}`,
                                color: pillStyle.color,
                              }}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td style={{ padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                            {entry.status === "rename" ? beforeNode : entry.currentName ?? "—"}
                          </td>
                          <td style={{ padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                            {entry.status === "rename" ? afterNode : entry.newName ?? "—"}
                          </td>
                          <td
                            style={{
                              padding: "4px 8px",
                              verticalAlign: "top",
                              color: "#666",
                              wordBreak: "break-word",
                            }}
                          >
                            {entry.reason || entry.warning || ""}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Stack>
          )}
        </Stack>
      </ToolBody>
    </Page>
  )
}
