import {
  Button,
  Checkbox,
  Container,
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
import { MIXED_BOOLEAN } from "@create-figma-plugin/utilities"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type MainToUiMessage,
  type VariableCollectionInfo,
  type ExportImportSnapshotReadyPayload,
  type ExportImportPreviewPayload,
  type ExportImportPreviewEntry,
  type ExportImportPreviewEntryStatus,
  type ExportImportApplyResultPayload,
} from "../../messages"
import { DataTable, type DataTableColumn } from "../../components/DataTable"
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

function getStatusPillStyle(status: ExportImportPreviewEntryStatus): {
  background: string
  borderColor: string
  color: string
} {
  if (status === "conflict" || status === "missing_collection" || status === "invalid") {
    return { background: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" }
  }

  if (status === "create" || status === "update" || status === "rename") {
    return { background: "#ecfdf3", borderColor: "#b7f0c9", color: "#067647" }
  }

  return { background: "#fff7ed", borderColor: "#fed7aa", color: "#9a3412" }
}

const importPreviewColumns: DataTableColumn[] = [
  { label: "Status" },
  { label: "Collection" },
  { label: "Variable" },
  { label: "Note" },
]

export function VariablesExportImportToolView({ onBack }: Props) {
  const [collections, setCollections] = useState<VariableCollectionInfo[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Export state
  const [exportSelectedCollectionIds, setExportSelectedCollectionIds] = useState<string[]>([])
  const [didInitExportSelection, setDidInitExportSelection] = useState(false)
  const [snapshotFiles, setSnapshotFiles] = useState<
    Array<{ filename: string; jsonText: string }>
  >([])
  const [snapshotStatus, setSnapshotStatus] = useState<string | null>(null)
  const [exportBusy, setExportBusy] = useState(false)

  // Import state
  const [importFilename, setImportFilename] = useState<string | null>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importJsonText, setImportJsonText] = useState<string>("")
  const [importPreview, setImportPreview] = useState<ExportImportPreviewPayload | null>(null)
  const [importBusy, setImportBusy] = useState(false)
  const [importResult, setImportResult] = useState<ExportImportApplyResultPayload | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_COLLECTIONS_LIST) {
        setCollections(msg.collections)
        if (!didInitExportSelection) {
          setExportSelectedCollectionIds(msg.collections.map((collection) => collection.id))
          setDidInitExportSelection(true)
        }
      }

      if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_SNAPSHOT_READY) {
        const files = Array.isArray(msg.payload.files) ? msg.payload.files : []
        setSnapshotFiles(files)
        setExportBusy(false)

        if (files.length === 0) {
          setSnapshotStatus("No collections to export.")
          setSuccessMessage("Snapshot export: nothing to export")
          return
        }

        if (files.length === 1) {
          // Auto-download single file
          downloadTextFile(files[0].filename, files[0].jsonText)
          setSnapshotStatus(`Exported: ${files[0].filename}`)
          setSuccessMessage(`Snapshot exported "${files[0].filename}"`)
          return
        }

        setSnapshotStatus(
          `Snapshot ready: ${files.length} file(s). Use Download buttons below.`
        )
        setSuccessMessage(`Snapshot ready (${files.length} files)`)
      }

      if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_PREVIEW) {
        setImportPreview(msg.payload)
        setImportBusy(false)
        setImportResult(null)
        setErrorMessage(null)
        setSuccessMessage(
          `Snapshot preview: create ${msg.payload.totals.create}, update ${msg.payload.totals.update}, rename ${msg.payload.totals.rename}, conflicts ${msg.payload.totals.conflicts}`
        )
      }

      if (msg.type === MAIN_TO_UI.EXPORT_IMPORT_APPLY_RESULT) {
        setImportBusy(false)
        setImportResult(msg.payload)
        setSuccessMessage(
          `Snapshot imported: created ${msg.payload.totals.created}, updated ${msg.payload.totals.updated}, renamed ${msg.payload.totals.renamed}, failed ${msg.payload.totals.failed}`
        )
      }

      if (msg.type === MAIN_TO_UI.ERROR) {
        setErrorMessage(msg.message)
        setExportBusy(false)
        setImportBusy(false)
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
  const exportSelectedFilesCount = selectedCollectionIdsInOptions.length
  const exportButtonLabel = `Export ${exportSelectedFilesCount} file${exportSelectedFilesCount === 1 ? "" : "s"}`

  const importRows = useMemo(() => {
    const entries = importPreview?.entries ?? []
    const order = (status: ExportImportPreviewEntryStatus) => {
      switch (status) {
        case "conflict":
          return 0
        case "missing_collection":
          return 1
        case "invalid":
          return 2
        case "create":
          return 3
        case "rename":
          return 4
        case "update":
          return 5
        default:
          return 10
      }
    }
    return entries
      .slice()
      .sort(
        (a, b) =>
          order(a.status) - order(b.status) ||
          a.collectionName.localeCompare(b.collectionName) ||
          a.variableName.localeCompare(b.variableName)
      )
  }, [importPreview])

  const canApplyImport =
    importPreview !== null &&
    (importPreview.totals.create > 0 ||
      importPreview.totals.update > 0 ||
      importPreview.totals.rename > 0) &&
    importPreview.totals.conflicts === 0

  const handleExport = () => {
    if (selectedCollectionIdsInOptions.length === 0) {
      setSnapshotStatus("Select at least one collection to export.")
      return
    }
    setSnapshotStatus(null)
    setSuccessMessage(null)
    setSnapshotFiles([])
    setExportBusy(true)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.EXPORT_IMPORT_EXPORT_SNAPSHOT,
          request: {
            collectionIds: selectedCollectionIdsInOptions,
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
    setSuccessMessage(null)
    setImportFilename(file.name)
    setImportFile(file)
    const text = await file.text()
    setImportJsonText(text)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT,
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
    setSuccessMessage(null)

    if (importFile) {
      const text = await importFile.text()
      setImportJsonText(text)
      parent.postMessage(
        {
          pluginMessage: {
            type: UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT,
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
          type: UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT,
          request: { jsonText: importJsonText },
        },
      },
      "*"
    )
  }

  const handleApplyImport = () => {
    if (!importJsonText.trim()) return
    setImportBusy(true)
    setSuccessMessage(null)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.EXPORT_IMPORT_APPLY_SNAPSHOT,
          request: { jsonText: importJsonText },
        },
      },
      "*"
    )
  }

  return (
    <Page>
      <ToolHeader
        title="Variables Export/Import"
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
              Export variables as separate JSON files
            </Text>
          </Stack>

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
                  disabled={exportBusy}
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
                      disabled={exportBusy}
                      onValueChange={(next) => {
                        setExportSelectedCollectionIds((prev) => {
                          if (next) {
                            return prev.includes(c.id) ? prev : [...prev, c.id]
                          }
                          return prev.filter((id) => id !== c.id)
                        })
                      }}
                    >
                      <Text>{c.name} ({c.variableCount} vars, {c.modeCount} modes)</Text>
                    </Checkbox>
                  )
                })}
              </Stack>
            </div>
          </Stack>

          <Button onClick={handleExport} disabled={exportBusy || exportSelectedFilesCount === 0}>
            {exportBusy ? "Exporting..." : exportButtonLabel}
          </Button>

          {exportBusy && (
            <Inline space="extraSmall">
              <LoadingIndicator />
              <Text>Generating snapshot files...</Text>
            </Inline>
          )}

          {snapshotStatus && (
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>{snapshotStatus}</Text>
          )}

          {snapshotFiles.length > 1 && (
            <Stack space="small">
              <Text>Download individual files:</Text>
              <div>
                {snapshotFiles.map((f, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>
                    <Button
                      secondary
                      onClick={() => downloadTextFile(f.filename, f.jsonText)}
                    >
                      {f.filename}
                    </Button>
                  </div>
                ))}
              </div>
            </Stack>
          )}
        </Stack>

        <VerticalSpace space="large" />
        <Divider />
        <VerticalSpace space="large" />

        {/* Import Section */}
        <Stack space="medium">
          <Stack space="extraSmall">
            <Text style={{ fontWeight: 600 }}>Import Variables Snapshot</Text>
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>
              Import a snapshot JSON file. Variables will be created, updated, or renamed based
              on the snapshot content.
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
              <Text>Processing import...</Text>
            </Inline>
          )}

          {importPreview && (
            <Stack space="small">
              {importFilename && (
                <Text style={{ color: "var(--figma-color-text-secondary)" }}>
                  Loaded file: {importFilename}
                </Text>
              )}

              <Text>
                Rows: {importPreview.totals.considered} · create {importPreview.totals.create} ·
                update {importPreview.totals.update} · rename {importPreview.totals.rename} ·
                conflicts {importPreview.totals.conflicts} · missing collections{" "}
                {importPreview.totals.missingCollections} · invalid {importPreview.totals.invalid}
              </Text>

              <Button
                loading={importBusy}
                disabled={importBusy || !canApplyImport}
                onClick={handleApplyImport}
              >
                Apply Import
              </Button>

              {!canApplyImport && importPreview.totals.conflicts > 0 && (
                <Text style={{ color: "#9f1239" }}>
                  Resolve conflicts before applying.
                </Text>
              )}

              {importResult && (
                <Text style={{ color: "#067647" }}>
                  Created: {importResult.totals.created}, Updated: {importResult.totals.updated},
                  Renamed: {importResult.totals.renamed}, Skipped: {importResult.totals.skipped},
                  Failed: {importResult.totals.failed}
                </Text>
              )}

              <Divider />

              {/* Preview Table */}
              <DataTable columns={importPreviewColumns}>
                {importRows.map((entry: ExportImportPreviewEntry, i) => {
                  const pillStyle = getStatusPillStyle(entry.status)
                  return (
                    <tr key={i}>
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
                        {entry.collectionName}
                      </td>
                      <td style={{ padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                        {entry.variableName}
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          verticalAlign: "top",
                          color: "var(--figma-color-text-tertiary)",
                          wordBreak: "break-word",
                        }}
                      >
                        {entry.reason || ""}
                      </td>
                    </tr>
                  )
                })}
              </DataTable>
            </Stack>
          )}
        </Stack>
      </ToolBody>
    </Page>
  )
}
