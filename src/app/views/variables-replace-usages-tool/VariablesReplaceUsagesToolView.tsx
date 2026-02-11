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
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type MainToUiMessage,
  type ReplaceUsagesPreviewPayload,
  type ReplaceUsagesMappingRow,
  type ReplaceUsagesInvalidMappingRow,
  type ReplaceUsagesApplyResultPayload,
  type ReplaceUsagesScope,
  type ReplaceUsagesProgress,
} from "../../messages"
import { Page } from "../../components/Page"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"

type Props = {
  onBack: () => void
}

function getStatusPillStyle(status: string): {
  background: string
  borderColor: string
  color: string
} {
  if (status === "ok") {
    return { background: "#ecfdf3", borderColor: "#b7f0c9", color: "#067647" }
  }
  // Error statuses
  return { background: "#fff1f2", borderColor: "#fecdd3", color: "#9f1239" }
}

export function VariablesReplaceUsagesToolView({ onBack }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Scope/options
  const [scope, setScope] = useState<ReplaceUsagesScope>("selection")
  const [renamePrints, setRenamePrints] = useState(false)
  const [includeHidden, setIncludeHidden] = useState(false)

  // Mapping file
  const [mappingFilename, setMappingFilename] = useState<string | null>(null)
  const [mappingFile, setMappingFile] = useState<File | null>(null)
  const [mappingJsonText, setMappingJsonText] = useState("")

  // Preview/apply state
  const [preview, setPreview] = useState<ReplaceUsagesPreviewPayload | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [stage, setStage] = useState<"idle" | "preview" | "apply">("idle")
  const [applyProgress, setApplyProgress] = useState<ReplaceUsagesProgress | null>(null)
  const [applyResult, setApplyResult] = useState<ReplaceUsagesApplyResultPayload | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.REPLACE_USAGES_PREVIEW) {
        setPreview(msg.payload)
        setIsBusy(false)
        setStage("idle")
        setApplyResult(null)
        setErrorMessage(null)
        const t = msg.payload.totals
        setSuccessMessage(
          `Preview ready: ${t.mappings} valid mappings, ${t.bindingsWithChanges} bindings to change in ${t.nodesWithChanges} nodes`
        )
      }

      if (msg.type === MAIN_TO_UI.REPLACE_USAGES_APPLY_PROGRESS) {
        setApplyProgress(msg.progress)
      }

      if (msg.type === MAIN_TO_UI.REPLACE_USAGES_APPLY_RESULT) {
        setIsBusy(false)
        setStage("idle")
        setApplyProgress(null)
        setApplyResult(msg.payload)
        const t = msg.payload.totals
        setSuccessMessage(
          `Applied: ${t.bindingsChanged} bindings changed in ${t.nodesChanged} nodes, ${t.printsRenamed} prints renamed`
        )
      }

      if (msg.type === MAIN_TO_UI.ERROR) {
        setErrorMessage(msg.message)
        setIsBusy(false)
        setStage("idle")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Auto-hide success messages
  useEffect(() => {
    if (!successMessage) return
    const t = window.setTimeout(() => setSuccessMessage(null), 5000)
    return () => window.clearTimeout(t)
  }, [successMessage])

  const sortedMappings = useMemo(() => {
    if (!preview) return []
    return preview.mappings
      .slice()
      .sort((a, b) => b.bindingsTotal - a.bindingsTotal || a.sourceName.localeCompare(b.sourceName))
  }, [preview])

  const sortedInvalidRows = useMemo(() => {
    if (!preview) return []
    return preview.invalidMappingRows
      .slice()
      .filter((r) => r.status !== "ok")
      .sort((a, b) => a.from.localeCompare(b.from))
  }, [preview])

  const canApply =
    preview !== null &&
    preview.totals.mappings > 0 &&
    preview.totals.bindingsWithChanges > 0

  const handleLoadMappingFile = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setMappingFilename(file.name)
    setMappingFile(file)
    const text = await file.text()
    setMappingJsonText(text)
    setPreview(null)
    setApplyResult(null)
    setSuccessMessage(`Loaded mapping file: ${file.name}`)
  }

  const handlePreview = async () => {
    const json = mappingFile ? await mappingFile.text() : mappingJsonText.trim()
    if (!json) {
      setErrorMessage("Please load a mapping JSON file first.")
      return
    }
    setIsBusy(true)
    setStage("preview")
    setSuccessMessage(null)
    setMappingJsonText(json)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.REPLACE_USAGES_PREVIEW,
          request: {
            scope,
            renamePrints,
            includeHidden,
            mappingJsonText: json,
          },
        },
      },
      "*"
    )
  }

  const handleApply = () => {
    if (!canApply || !mappingJsonText.trim()) return
    setIsBusy(true)
    setStage("apply")
    setSuccessMessage(null)
    setApplyProgress({ current: 0, total: preview?.totals.nodesWithChanges ?? 0, message: "Starting..." })
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.REPLACE_USAGES_APPLY,
          request: {
            scope,
            renamePrints,
            includeHidden,
            mappingJsonText,
          },
        },
      },
      "*"
    )
  }

  return (
    <Page>
      <ToolHeader
        title="Replace Variable Usages"
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
            <Text style={{ fontWeight: 600 }}>Replace Variable Usages</Text>
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>
              Load a JSON mapping file to replace variable bindings in layers. The mapping file
              should specify "from → to" variable names within a collection.
            </Text>
          </Stack>

          <Stack space="small">
            <Text style={{ fontWeight: 600 }}>Scope</Text>
            <Inline space="medium">
              <Checkbox
                value={scope === "selection"}
                onValueChange={() => setScope("selection")}
              >
                <Text>Selection only</Text>
              </Checkbox>
              <Checkbox
                value={scope === "page"}
                onValueChange={() => setScope("page")}
              >
                <Text>Entire page</Text>
              </Checkbox>
            </Inline>
          </Stack>

          <Stack space="small">
            <Text style={{ fontWeight: 600 }}>Options</Text>
            <Stack space="extraSmall">
              <Checkbox value={renamePrints} onValueChange={setRenamePrints}>
                <Text>Rename "Prints" layers (layers prefixed with VariableID:...)</Text>
              </Checkbox>
              <Checkbox value={includeHidden} onValueChange={setIncludeHidden}>
                <Text>Include hidden layers</Text>
              </Checkbox>
            </Stack>
          </Stack>

          <Divider />

          {/* Load Mapping File */}
          <Stack space="small">
            <Text style={{ fontWeight: 600 }}>Mapping File</Text>
            <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
              JSON format: {"{"} version: 1, collectionName: "...", replacements: [{"{"} from: "OldName", to:
              "NewName" {"}"}] {"}"}
            </Text>
            <FileUploadButton
              acceptedFileTypes={[".json", "application/json"]}
              onSelectedFiles={handleLoadMappingFile}
            >
              {mappingFilename ? `Loaded: ${mappingFilename}` : "Choose mapping JSON file…"}
            </FileUploadButton>
          </Stack>

          <Inline space="extraSmall">
            <Button onClick={handlePreview} disabled={!mappingJsonText.trim() || isBusy}>
              {isBusy && stage === "preview" ? "Previewing..." : "Preview"}
            </Button>
            <Button onClick={handleApply} disabled={!canApply || isBusy}>
              {isBusy && stage === "apply" ? "Applying..." : "Apply Replacements"}
            </Button>
          </Inline>

          {isBusy && (
            <Inline space="extraSmall">
              <LoadingIndicator />
              <Text>
                {stage === "apply"
                  ? `Applying... ${
                      applyProgress
                        ? `${applyProgress.current} / ${applyProgress.total}`
                        : ""
                    }`
                  : "Building preview..."}
              </Text>
            </Inline>
          )}
        </Stack>

        <VerticalSpace space="large" />
        <Divider />
        <VerticalSpace space="medium" />

        {/* Preview Results */}
        {preview && (
          <Stack space="medium">
            <Text style={{ fontWeight: 600 }}>Preview Results</Text>

            {/* Totals */}
            <div
              style={{
                padding: 8,
                background: "var(--figma-color-bg-secondary)",
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 11 }}>
                <strong>Scope:</strong> {preview.scope}
                <br />
                <strong>Mappings:</strong> {preview.totals.mappings} valid,{" "}
                {sortedInvalidRows.length} invalid
                <br />
                <strong>Bindings to change:</strong> {preview.totals.bindingsWithChanges}
                <br />
                <strong>Nodes affected:</strong> {preview.totals.nodesWithChanges}
                <br />
                {renamePrints && (
                  <>
                    <strong>Prints rename candidates:</strong>{" "}
                    {preview.totals.printsRenameCandidates}
                  </>
                )}
              </Text>
            </div>

            {/* Phase Breakdown */}
            <div
              style={{
                padding: 8,
                background: "var(--figma-color-bg-secondary)",
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                Bindings by Phase
              </Text>
              <Text style={{ fontSize: 10 }}>
                Component: {preview.totals.bindingsWithChangesByPhase.component} bindings (
                {preview.totals.nodesWithChangesByPhase.component} nodes)
                <br />
                Instance in Component:{" "}
                {preview.totals.bindingsWithChangesByPhase.instance_in_component} bindings (
                {preview.totals.nodesWithChangesByPhase.instance_in_component} nodes)
                <br />
                Other: {preview.totals.bindingsWithChangesByPhase.other} bindings (
                {preview.totals.nodesWithChangesByPhase.other} nodes)
              </Text>
            </div>

            {/* Valid Mappings Table */}
            {sortedMappings.length > 0 && (
              <Stack space="small">
                <Text style={{ fontWeight: 600 }}>Mappings with Changes</Text>
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
                      fontSize: 11,
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
                          From
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
                          To
                        </th>
                        <th
                          style={{
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                            padding: "6px 8px",
                            position: "sticky",
                            top: 0,
                            background: "#fafafa",
                          }}
                        >
                          Bindings
                        </th>
                        <th
                          style={{
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                            padding: "6px 8px",
                            position: "sticky",
                            top: 0,
                            background: "#fafafa",
                          }}
                        >
                          Nodes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedMappings.map((row: ReplaceUsagesMappingRow) => (
                        <tr key={row.sourceId}>
                          <td style={{ padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                            {row.sourceName}
                          </td>
                          <td style={{ padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                            {row.targetName}
                          </td>
                          <td
                            style={{ padding: "4px 8px", verticalAlign: "top", textAlign: "right" }}
                          >
                            {row.bindingsTotal}
                          </td>
                          <td
                            style={{ padding: "4px 8px", verticalAlign: "top", textAlign: "right" }}
                          >
                            {row.nodesTotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Stack>
            )}

            {/* Invalid Mapping Rows */}
            {sortedInvalidRows.length > 0 && (
              <Stack space="small">
                <Text style={{ fontWeight: 600, color: "#9f1239" }}>
                  Invalid Mapping Rows ({sortedInvalidRows.length})
                </Text>
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
                      fontSize: 11,
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
                          From
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
                          To
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
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedInvalidRows.map((row: ReplaceUsagesInvalidMappingRow, i) => {
                        const pillStyle = getStatusPillStyle(row.status)
                        return (
                          <tr key={i}>
                            <td style={{ padding: "4px 8px", verticalAlign: "top" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  fontSize: 9,
                                  fontWeight: 600,
                                  background: pillStyle.background,
                                  border: `1px solid ${pillStyle.borderColor}`,
                                  color: pillStyle.color,
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td style={{ padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                              {row.from || "—"}
                            </td>
                            <td style={{ padding: "4px 8px", verticalAlign: "top", wordBreak: "break-word" }}>
                              {row.to || "—"}
                            </td>
                            <td
                              style={{
                                padding: "4px 8px",
                                verticalAlign: "top",
                                color: "#666",
                                wordBreak: "break-word",
                              }}
                            >
                              {row.reason || ""}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Stack>
            )}

            {/* Apply Result */}
            {applyResult && (
              <div
                style={{
                  padding: 8,
                  background: "#ecfdf3",
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#067647", fontWeight: 600 }}>Apply Result</Text>
                <Text style={{ fontSize: 11, marginTop: 4 }}>
                  Nodes visited: {applyResult.totals.nodesVisited}
                  <br />
                  Nodes changed: {applyResult.totals.nodesChanged}
                  <br />
                  Bindings changed: {applyResult.totals.bindingsChanged}
                  <br />
                  Nodes skipped (locked): {applyResult.totals.nodesSkippedLocked}
                  <br />
                  Bindings skipped (unsupported): {applyResult.totals.bindingsSkippedUnsupported}
                  <br />
                  Bindings failed: {applyResult.totals.bindingsFailed}
                  <br />
                  Prints renamed: {applyResult.totals.printsRenamed}
                </Text>
              </div>
            )}
          </Stack>
        )}
      </ToolBody>
    </Page>
  )
}
