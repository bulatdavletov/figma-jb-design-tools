import {
  Button,
  Container,
  Divider,
  Dropdown,
  IconInteractionClickSmall24,
  IconButton,
  IconHome16,
  Stack,
  Text,
  Textbox,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type MainToUiMessage,
  type VariableCollectionInfo,
  type LinkedColorsSelectionPayload,
  type LinkedColorsVariableUsage,
  type LinkedColorsVariableMatch,
} from "../../home/messages"
import { Page } from "../../components/Page"
import { State } from "../../components/State"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"

type Props = {
  onBack: () => void
}

function computeNameForGroupRestriction(currentName: string, groupFilterValue: string): string {
  const raw = String(currentName || "").trim()
  if (!raw) return ""

  const targetGroup = String(groupFilterValue || "").trim()
  if (!targetGroup) return raw

  const parts = raw
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean)
  if (!parts.length) return ""

  const oldGroup = parts.length >= 2 ? parts[0] : ""

  const lastIndex = parts.length - 1
  const last = parts[lastIndex] || ""

  let nextLast = last
  if (oldGroup && last.startsWith(oldGroup + "-")) {
    if (targetGroup === "Ungrouped") {
      nextLast = last.slice((oldGroup + "-").length)
    } else {
      nextLast = `${targetGroup}-${last.slice((oldGroup + "-").length)}`
    }
  }

  if (targetGroup === "Ungrouped") {
    const rest = parts.length >= 2 ? parts.slice(1) : parts
    const adjustedLastIndex = lastIndex - (parts.length >= 2 ? 1 : 0)
    rest[adjustedLastIndex] = nextLast
    return rest.join("/")
  }

  if (parts.length >= 2) {
    parts[0] = targetGroup
    parts[lastIndex] = nextLast
    return parts.join("/")
  }

  return nextLast
}

export function VariablesCreateLinkedColorsToolView({ onBack }: Props) {
  const [collections, setCollections] = useState<VariableCollectionInfo[]>([])
  const [selection, setSelection] = useState<LinkedColorsSelectionPayload | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isWorking, setIsWorking] = useState(false)

  // Selected variable
  const [selectedVariableId, setSelectedVariableId] = useState<string | null>(null)
  const [restrictGroup, setRestrictGroup] = useState<string | null>(null)

  // Create form
  const [createName, setCreateName] = useState("")
  const [createNameTouched, setCreateNameTouched] = useState(false)

  // Apply existing form
  const [applyTargetVariableId, setApplyTargetVariableId] = useState<string | null>(null)
  const [replaceSearch, setReplaceSearch] = useState("")

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.LINKED_COLORS_COLLECTIONS_LIST) {
        setCollections(msg.collections)
      }

      if (msg.type === MAIN_TO_UI.LINKED_COLORS_SELECTION) {
        setSelection(msg.payload)
        setErrorMessage(null)
        // Keep selected variable valid across selection changes
        setSelectedVariableId((prev) => {
          if (!msg.payload.variables.length) return null
          if (prev && msg.payload.variables.some((v) => v.id === prev)) return prev
          return msg.payload.variables[0].id
        })
      }

      if (msg.type === MAIN_TO_UI.LINKED_COLORS_CREATE_SUCCESS) {
        setIsWorking(false)
        if (msg.result.success) {
          setSuccessMessage(msg.result.message)
          setCreateName("")
          setCreateNameTouched(false)
        } else {
          setErrorMessage(msg.result.message)
        }
      }

      if (msg.type === MAIN_TO_UI.LINKED_COLORS_APPLY_SUCCESS) {
        setIsWorking(false)
        if (msg.result.success) {
          setSuccessMessage(msg.result.message)
          setApplyTargetVariableId(null)
        } else {
          setErrorMessage(msg.result.message)
        }
      }

      if (msg.type === MAIN_TO_UI.LINKED_COLORS_RENAME_SUCCESS) {
        setIsWorking(false)
        if (msg.result.success) {
          setSuccessMessage(msg.result.message)
        } else {
          setErrorMessage(msg.result.message)
        }
      }

      if (msg.type === MAIN_TO_UI.ERROR) {
        setErrorMessage(msg.message)
        setIsWorking(false)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Auto-hide success messages
  useEffect(() => {
    if (!successMessage) return
    const t = window.setTimeout(() => setSuccessMessage(null), 4500)
    return () => window.clearTimeout(t)
  }, [successMessage])

  const selectedUsage = useMemo(() => {
    if (!selection || !selectedVariableId) return null
    return selection.variables.find((v) => v.id === selectedVariableId) ?? null
  }, [selection, selectedVariableId])

  const variableOptions = useMemo(() => {
    if (!selectedUsage) return []
    const opts = selectedUsage.options.slice()
    if (restrictGroup && restrictGroup !== "All") {
      return opts
        .filter((v) => v.name.startsWith(restrictGroup + "/") || v.name === restrictGroup)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((v) => ({ value: v.id, text: `${v.collectionName} — ${v.name}` }))
    }
    return opts
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((v) => ({ value: v.id, text: `${v.collectionName} — ${v.name}` }))
  }, [selectedUsage, restrictGroup])

  const filteredOptions = useMemo(() => {
    if (!replaceSearch.trim()) return variableOptions
    const search = replaceSearch.toLowerCase()
    return variableOptions.filter((opt) => opt.text.toLowerCase().includes(search))
  }, [variableOptions, replaceSearch])

  const variableGroups = useMemo(() => {
    if (!selectedUsage) return []
    return [
      { value: "All", text: "All groups" },
      ...selectedUsage.groups.map((g) => ({ value: g || "Ungrouped", text: g || "Ungrouped" })),
    ]
  }, [selectedUsage])

  const selectedVariableOptions = useMemo(() => {
    const vars = selection?.variables ?? []
    return vars.map((v) => ({ value: v.id, text: `${v.collectionName} — ${v.name}` }))
  }, [selection])

  // Auto-suggest create name based on selected variable
  useEffect(() => {
    if (!selectedUsage) {
      setRestrictGroup(null)
      setApplyTargetVariableId(null)
      setCreateNameTouched(false)
      setCreateName("")
      return
    }
    if (!createNameTouched) {
      const suggested = restrictGroup && restrictGroup !== "All"
        ? computeNameForGroupRestriction(selectedUsage.name, restrictGroup)
        : selectedUsage.name
      setCreateName(suggested)
    }
  }, [selectedUsage, restrictGroup, createNameTouched])

  // Clear dependent controls when selected variable changes
  useEffect(() => {
    setApplyTargetVariableId(null)
    setReplaceSearch("")
  }, [selectedVariableId])

  const handleCreateLinkedVariable = () => {
    if (!selectedVariableId || !createName.trim()) return
    setIsWorking(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.LINKED_COLORS_CREATE,
          request: {
            variableId: selectedVariableId,
            targetVariableId: createName.trim(), // This is actually the new name
          },
        },
      },
      "*"
    )
  }

  const handleApplyExisting = () => {
    if (!selectedVariableId || !applyTargetVariableId) return
    setIsWorking(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.LINKED_COLORS_APPLY_EXISTING,
          request: {
            variableId: selectedVariableId,
            targetVariableId: applyTargetVariableId,
          },
        },
      },
      "*"
    )
  }

  const handleRename = (newName: string) => {
    if (!selectedVariableId || !newName.trim()) return
    setIsWorking(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.LINKED_COLORS_RENAME,
          request: {
            variableId: selectedVariableId,
            newName: newName.trim(),
          },
        },
      },
      "*"
    )
  }

  const isSelectionEmpty = selection?.selectionSize === 0

  return (
    <Page>
      <ToolHeader
        title="Create Linked Colors"
        left={
          <IconButton onClick={onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />
      {isSelectionEmpty ? (
        <ToolBody mode="state">
          <State
            icon={<IconInteractionClickSmall24 />}
            title="Select layers with color variables to manage them."
          />
        </ToolBody>
      ) : (
      <ToolBody mode="content">
      <Container space="medium">
        <VerticalSpace space="medium" />

        {errorMessage && (
          <Fragment>
            <div style={{ padding: 8, background: "#fff1f2", borderRadius: 4, marginBottom: 12 }}>
              <Text style={{ color: "#9f1239" }}>{errorMessage}</Text>
            </div>
          </Fragment>
        )}

        {successMessage && (
          <Fragment>
            <div style={{ padding: 8, background: "#ecfdf3", borderRadius: 4, marginBottom: 12 }}>
              <Text style={{ color: "#067647" }}>{successMessage}</Text>
            </div>
          </Fragment>
        )}

        {/* Selection Status */}
        <Stack space="small">
          <Text style={{ fontWeight: 600 }}>Selection</Text>
          {selection ? (
            <Text>
              {selection.selectionSize} nodes, {selection.variables.length} color variables
            </Text>
          ) : (
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>Loading...</Text>
          )}
        </Stack>

        {selection && selection.variables.length > 0 && (
          <Fragment>
            <VerticalSpace space="medium" />

            <Stack space="small">
              <Text style={{ fontWeight: 600 }}>Select Variable to Manage</Text>
              <Dropdown
                options={selectedVariableOptions}
                value={selectedVariableId}
                onChange={(e) => setSelectedVariableId(e.currentTarget.value || null)}
                disabled={isWorking}
              />
            </Stack>

            {selectedUsage && (
              <Fragment>
                <VerticalSpace space="medium" />

                {/* Variable Info */}
                <div
                  style={{
                    padding: 8,
                    background: "var(--figma-color-bg-secondary)",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 11 }}>
                    <strong>{selectedUsage.name}</strong>
                    <br />
                    Collection: {selectedUsage.collectionName}
                    <br />
                    Used in: {selectedUsage.nodes.length} nodes
                    <br />
                    Properties: {selectedUsage.properties.join(", ")}
                  </Text>
                </div>

                <VerticalSpace space="large" />
                <Divider />
                <VerticalSpace space="medium" />

                {/* Group Filter */}
                {selectedUsage.groups.length > 0 && (
                  <Stack space="small">
                    <Text style={{ fontWeight: 600 }}>Filter by Group</Text>
                    <Dropdown
                      options={variableGroups}
                      value={restrictGroup ?? "All"}
                      onChange={(e) => setRestrictGroup(e.currentTarget.value || null)}
                      disabled={isWorking}
                    />
                  </Stack>
                )}

                <VerticalSpace space="medium" />

                {/* Apply Existing Variable */}
                <Stack space="small">
                  <Text style={{ fontWeight: 600 }}>Replace with Existing Variable</Text>
                  <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
                    Select a variable to replace the current binding in selected layers.
                  </Text>
                  <Textbox
                    placeholder="Search variables..."
                    value={replaceSearch}
                    onValueInput={setReplaceSearch}
                    disabled={isWorking}
                  />
                  <div>
                    {filteredOptions.length === 0 ? (
                      <Text style={{ color: "var(--figma-color-text-secondary)", padding: 8 }}>
                        No matching variables found
                      </Text>
                    ) : (
                      filteredOptions.slice(0, 50).map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => !isWorking && setApplyTargetVariableId(opt.value)}
                          style={{
                            padding: "6px 8px",
                            cursor: isWorking ? "default" : "pointer",
                            background:
                              applyTargetVariableId === opt.value
                                ? "var(--figma-color-bg-brand)"
                                : "transparent",
                            color:
                              applyTargetVariableId === opt.value
                                ? "var(--figma-color-text-onbrand)"
                                : "inherit",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          {opt.text}
                        </div>
                      ))
                    )}
                  </div>
                  <Button
                    onClick={handleApplyExisting}
                    disabled={!applyTargetVariableId || isWorking}
                  >
                    Apply Selected Variable
                  </Button>
                </Stack>

                <VerticalSpace space="large" />
                <Divider />
                <VerticalSpace space="medium" />

                {/* Create Linked Variable */}
                <Stack space="small">
                  <Text style={{ fontWeight: 600 }}>Create Linked Variable (Alias)</Text>
                  <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
                    Create a new variable that aliases the selected variable, and rebind layers to
                    use the new variable.
                  </Text>
                  <Textbox
                    placeholder="New variable name"
                    value={createName}
                    onValueInput={(v) => {
                      setCreateName(v)
                      setCreateNameTouched(true)
                    }}
                    disabled={isWorking}
                  />
                  <Button onClick={handleCreateLinkedVariable} disabled={!createName.trim() || isWorking}>
                    Create & Apply
                  </Button>
                </Stack>

                <VerticalSpace space="large" />
                <Divider />
                <VerticalSpace space="medium" />

                {/* Rename Variable */}
                <Stack space="small">
                  <Text style={{ fontWeight: 600 }}>Rename Variable</Text>
                  <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
                    Rename the selected variable. Current name: {selectedUsage.name}
                  </Text>
                  <Textbox
                    placeholder="New name"
                    value={createName}
                    onValueInput={(v) => {
                      setCreateName(v)
                      setCreateNameTouched(true)
                    }}
                    disabled={isWorking}
                  />
                  <Button
                    onClick={() => handleRename(createName)}
                    disabled={!createName.trim() || createName === selectedUsage.name || isWorking}
                    secondary
                  >
                    Rename Variable
                  </Button>
                </Stack>
              </Fragment>
            )}
          </Fragment>
        )}

        <VerticalSpace space="large" />
      </Container>
      </ToolBody>
      )}
    </Page>
  )
}
