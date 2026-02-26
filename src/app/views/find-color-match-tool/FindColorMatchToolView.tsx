import {
  Button,
  Container,
  Divider,
  Dropdown,
  type DropdownOption,
  IconButton,
  IconHome16,
  IconInteractionClickSmall24,
  Stack,
  Text,
  TextboxColor,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useState, useMemo, useCallback } from "preact/hooks"

import { MAIN_TO_UI, UI_TO_MAIN, type MainToUiMessage } from "../../messages"
import type {
  FindColorMatchCollectionInfo,
  FindColorMatchResultEntry,
  FindColorMatchVariableEntry,
  LibraryCacheStatusPayload,
} from "../../messages"
import { Page } from "../../components/Page"
import { ToolHeader } from "../../components/ToolHeader"
import { ToolBody } from "../../components/ToolBody"
import { State } from "../../components/State"
import { ColorSwatch } from "../../components/ColorSwatch"
import { LibraryCacheStatusBar } from "../../components/LibraryCacheStatusBar"

type Props = {
  onBack: () => void
  initialSelectionEmpty?: boolean
}

export function FindColorMatchToolView({ onBack, initialSelectionEmpty }: Props) {
  const [collections, setCollections] = useState<FindColorMatchCollectionInfo[]>([])
  const [selectedCollectionKey, setSelectedCollectionKey] = useState<string | null>(null)
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null)
  const [entries, setEntries] = useState<FindColorMatchResultEntry[]>([])
  const [cacheStatus, setCacheStatus] = useState<LibraryCacheStatusPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [appliedKeys, setAppliedKeys] = useState<Set<string>>(new Set())
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [selectionEmpty, setSelectionEmpty] = useState(initialSelectionEmpty ?? true)

  const [groupsByCollection, setGroupsByCollection] = useState<Record<string, string[]>>({})
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const [hexInput, setHexInput] = useState("")
  const [hexOpacity, setHexOpacity] = useState("100")
  const [hexMatches, setHexMatches] = useState<FindColorMatchVariableEntry[]>([])
  const [hexResultFor, setHexResultFor] = useState<string | null>(null)
  const [hexSelectedIdx, setHexSelectedIdx] = useState(0)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_COLLECTIONS) {
        setCollections(msg.payload.collections)
        if (msg.payload.defaultCollectionKey) {
          setSelectedCollectionKey(msg.payload.defaultCollectionKey)
          const col = msg.payload.collections.find((c) => c.key === msg.payload.defaultCollectionKey)
          if (col && col.modes.length > 0) {
            setSelectedModeId(col.modes[0].modeId)
          }
        }
      }

      if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_RESULT) {
        setEntries(msg.payload.entries)
        setIsLoading(false)
        setSelectionEmpty(false)
        setAppliedKeys(new Set())
        setOverrides({})
      }

      if (msg.type === MAIN_TO_UI.LIBRARY_CACHE_STATUS) {
        setCacheStatus(msg.status)
      }

      if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_APPLY_RESULT) {
        if (msg.result.ok) {
          setEntries((prev) => {
            const matched = prev.find((e) => e.found.nodeId === msg.result.nodeId)
            if (matched) {
              const key = `${matched.found.nodeId}:${matched.found.colorType}:${matched.found.paintIndex}`
              setAppliedKeys((prevKeys) => {
                const next = new Set(Array.from(prevKeys))
                next.add(key)
                return next
              })
            }
            return prev
          })
        }
      }

      if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_HEX_RESULT) {
        setHexMatches(msg.payload.allMatches)
        setHexResultFor(msg.payload.hex)
        setHexSelectedIdx(0)
      }

      if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_GROUPS) {
        setGroupsByCollection(msg.groupsByCollection)
      }

      if (msg.type === MAIN_TO_UI.SELECTION_EMPTY) {
        setSelectionEmpty(true)
        setEntries([])
        setIsLoading(false)
      }
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  const entryKey = useCallback(
    (entry: FindColorMatchResultEntry) =>
      `${entry.found.nodeId}:${entry.found.colorType}:${entry.found.paintIndex}`,
    []
  )

  const selectedCollection = useMemo(
    () => collections.find((c) => c.key === selectedCollectionKey) ?? null,
    [collections, selectedCollectionKey]
  )

  const modeOptions: DropdownOption[] = useMemo(() => {
    if (!selectedCollection || selectedCollection.modes.length === 0) return []
    return selectedCollection.modes.map((m) => ({
      value: m.modeId,
      text: m.modeName,
    }))
  }, [selectedCollection])

  // Combined collection + group dropdown
  const combinedCollectionValue = useMemo(() => {
    const colKey = selectedCollectionKey ?? ""
    return selectedGroup ? `${colKey}::${selectedGroup}` : `${colKey}::__all__`
  }, [selectedCollectionKey, selectedGroup])

  const combinedCollectionOptions: DropdownOption[] = useMemo(() => {
    const opts: DropdownOption[] = []
    for (let ci = 0; ci < collections.length; ci++) {
      const col = collections[ci]
      if (ci > 0) opts.push("-" as DropdownOption)
      opts.push({ value: `${col.key}::__all__`, text: col.name })
      const colGroups = groupsByCollection[col.key] ?? []
      for (const g of colGroups) {
        opts.push({ value: `${col.key}::${g}`, text: g })
      }
    }
    return opts
  }, [collections, groupsByCollection])

  const handleCombinedCollectionChange = (value: string) => {
    const sepIdx = value.indexOf("::")
    if (sepIdx < 0) return
    const colKey = value.substring(0, sepIdx)
    const groupPart = value.substring(sepIdx + 2)
    const newGroup = groupPart === "__all__" ? null : groupPart

    const collectionChanged = colKey !== selectedCollectionKey
    if (collectionChanged) {
      setSelectedCollectionKey(colKey)
      setSelectedGroup(null)
      setEntries([])
      setAppliedKeys(new Set())
      setOverrides({})
      setIsLoading(true)
      setHexMatches([])
      setHexResultFor(null)

      const col = collections.find((c) => c.key === colKey)
      const firstModeId = col?.modes[0]?.modeId ?? null
      setSelectedModeId(firstModeId)

      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_SET_COLLECTION, collectionKey: colKey } },
        "*"
      )
    } else if (newGroup !== selectedGroup) {
      setSelectedGroup(newGroup)
      setEntries([])
      setAppliedKeys(new Set())
      setOverrides({})
      setIsLoading(true)
      setHexMatches([])
      setHexResultFor(null)
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_SET_GROUP, group: newGroup } },
        "*"
      )
    }
  }

  const handleModeChange = (value: string) => {
    setSelectedModeId(value)
    setSelectedGroup(null)
    setEntries([])
    setAppliedKeys(new Set())
    setOverrides({})
    setIsLoading(true)
    setHexMatches([])
    setHexResultFor(null)

    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_SET_MODE, modeId: value } },
      "*"
    )
  }

  const handleHexInput = (value: string) => {
    setHexInput(value)
    const clean = value.replace(/^#/, "")
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_HEX_LOOKUP, hex: `#${clean}` } },
        "*"
      )
    } else {
      setHexMatches([])
      setHexResultFor(null)
      setHexSelectedIdx(0)
    }
  }

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedName(name)
      setTimeout(() => setCopiedName(null), 1500)
    })
  }

  const handleApply = (entry: FindColorMatchResultEntry) => {
    const key = entryKey(entry)
    const overrideVarId = overrides[key]
    const variableId = overrideVarId ?? entry.bestMatch?.variableId
    if (!variableId) return

    const selectedMatch =
      overrideVarId != null
        ? entry.allMatches.find((m) => m.variableId === overrideVarId)
        : entry.bestMatch
    const variableKey = selectedMatch?.variableKey ?? undefined

    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.FIND_COLOR_MATCH_APPLY,
          request: {
            nodeId: entry.found.nodeId,
            variableId,
            variableKey: variableKey ?? undefined,
            colorType: entry.found.colorType,
            paintIndex: entry.found.paintIndex,
          },
        },
      },
      "*"
    )
  }

  const handleFocusNode = (nodeId: string) => {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_FOCUS_NODE, nodeId } },
      "*"
    )
  }

  const handleOverrideVariable = (entryKeyStr: string, variableId: string) => {
    setOverrides((prev) => ({ ...prev, [entryKeyStr]: variableId }))
  }

  const visibleEntries = useMemo(
    () => entries.filter((e) => !appliedKeys.has(entryKey(e))),
    [entries, appliedKeys, entryKey]
  )

  const showEmptySelection = !isLoading && selectionEmpty && entries.length === 0
  const showNoColors = !isLoading && !selectionEmpty && entries.length === 0 && visibleEntries.length === 0

  const hexSelectedMatch = hexMatches.length > 0 ? hexMatches[hexSelectedIdx] ?? hexMatches[0] : null
  const hexTop2 = hexMatches.slice(0, 2)

  return (
    <Page>
      <ToolHeader
        title="Find Color Match in Islands"
        left={
          <IconButton onClick={onBack}>
            <IconHome16 />
          </IconButton>
        }
      />

      {/* Filters: dropdowns on first row, color input on second row */}
      <div>
        <Container space="small">
          <VerticalSpace space="small" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              columnGap: 8,
              rowGap: 8,
            }}
          >
            {combinedCollectionOptions.length > 0 && (
              <div style={{ minWidth: 0 }}>
                <Dropdown
                  options={combinedCollectionOptions}
                  value={combinedCollectionValue}
                  onChange={(e: any) => handleCombinedCollectionChange(e.currentTarget.value)}
                />
              </div>
            )}
            {modeOptions.length > 0 && (
              <div style={{ minWidth: 0 }}>
                <Dropdown
                  options={modeOptions}
                  value={selectedModeId ?? null}
                  onChange={(e: any) => handleModeChange(e.currentTarget.value)}
                />
              </div>
            )}
            <div style={{ minWidth: 0, gridColumn: "1 / 2" }}>
              <TextboxColor
                fullWidth
                hexColor={hexInput}
                hexColorPlaceholder="Paste hex"
                opacity={hexOpacity}
                onHexColorValueInput={handleHexInput}
                onOpacityValueInput={setHexOpacity}
              />
            </div>
          </div>
          <VerticalSpace space="small" />
        </Container>
        <Divider />
      </div>

      {/* Hex lookup result */}
      {hexSelectedMatch && hexResultFor && (
        <div>
          <Container space="small">
            <VerticalSpace space="small" />
            <div
              style={{
                border: "1px solid var(--figma-color-border)",
                borderRadius: 6,
                padding: "8px 10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ColorSwatch hex={hexResultFor} opacityPercent={100} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>Hex lookup</div>
                  <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)" }}>
                    {hexResultFor}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 6 }}>
                {hexTop2.map((m, i) => (
                  <div
                    key={m.variableId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: 4,
                      background: i === hexSelectedIdx ? "var(--figma-color-bg-hover)" : "transparent",
                    }}
                    onClick={() => setHexSelectedIdx(i)}
                  >
                    <ColorSwatch hex={m.hex} opacityPercent={m.opacityPercent} />
                    <div style={{ flex: 1, minWidth: 0, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.variableName}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)", flexShrink: 0 }}>
                      {m.matchPercent}%
                    </div>
                  </div>
                ))}

                {hexMatches.length > 2 && (
                  <Dropdown
                    options={hexMatches.slice(2).map((m, i) => ({
                      value: String(i + 2),
                      text: `${m.variableName} (${m.matchPercent}%)`,
                    }))}
                    value={hexSelectedIdx >= 2 ? String(hexSelectedIdx) : null}
                    onChange={(e: any) => setHexSelectedIdx(Number(e.currentTarget.value))}
                    placeholder="More matches…"
                    style={{ marginBottom: 4 }}
                  />
                )}

                <Button
                  onClick={() => handleCopyName(hexSelectedMatch.variableName)}
                  secondary
                  style={{ width: "100%" }}
                >
                  {copiedName === hexSelectedMatch.variableName ? "Copied!" : "Copy name"}
                </Button>
              </div>
            </div>
            <VerticalSpace space="small" />
          </Container>
          <Divider />
        </div>
      )}

      {/* Empty: no selection */}
      {showEmptySelection && (
        <ToolBody mode="state">
          <State
            icon={<IconInteractionClickSmall24 />}
            title="Select layers to find color matches"
          />
        </ToolBody>
      )}

      {/* Empty: no colors */}
      {showNoColors && (
        <ToolBody mode="state">
          <State title="No colors found in selection" />
        </ToolBody>
      )}

      {/* Results */}
      {visibleEntries.length > 0 && (
        <ToolBody mode="content">
          <Text style={{ color: "var(--figma-color-text-secondary)" }}>
            {visibleEntries.length} color{visibleEntries.length !== 1 ? "s" : ""} found
          </Text>
          <VerticalSpace space="small" />

          <Stack space="extraSmall">
            {visibleEntries.map((entry) => {
              const key = entryKey(entry)
              const overrideVarId = overrides[key]
              const top2 = entry.allMatches.slice(0, 2)
              const selectedVarId = overrideVarId ?? entry.bestMatch?.variableId ?? ""

              return (
                <div
                  key={key}
                  style={{
                    border: "1px solid var(--figma-color-border)",
                    borderRadius: 6,
                    padding: "8px 10px",
                  }}
                >
                  {/* Found color info */}
                  <div style={{ display: "flex", alignItems: "start", gap: 8 }}>
                    <ColorSwatch hex={entry.found.hex} opacityPercent={entry.found.opacity} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/*Main text*/}
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 6 }}
                      >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                        onClick={() => handleFocusNode(entry.found.nodeId)}
                        title={`Click to focus: ${entry.found.nodeName}`}
                      >
                        {entry.found.sourceName ?? `${entry.found.hex} ${entry.found.opacity < 100 ? ` ${entry.found.opacity}%` : ""}`}
                      </div>
                      <div>
                      {entry.found.sourceName ? `${entry.found.hex} ${entry.found.opacity < 100 ? ` ${entry.found.opacity}%` : ""}` : ""}
                      </div>
                      </div>

                      {/*Secondary text*/}
                      <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)" }}>
                        {entry.found.nodeName} · {entry.found.colorType.toLowerCase()}
                      </div>
                    </div>
                  </div>

                  {/* Match suggestions — top 2 */}
                  {top2.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      {top2.map((m) => (
                        <div
                          key={m.variableId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 4,
                            cursor: "pointer",
                            padding: "4px 4px",
                            marginLeft: 14+8,
                            borderRadius: 4,
                            background: m.variableId === selectedVarId ? "var(--figma-color-bg-hover)" : "transparent",
                          }}
                          onClick={() => handleOverrideVariable(key, m.variableId)}
                        >
                          <ColorSwatch hex={m.hex} opacityPercent={m.opacityPercent} />
                          {/*Main text*/}
                          <div style={{ flex: 1, minWidth: 0, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {m.variableName}
                          </div>
                          {/*Percentage*/}
                          <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)", flexShrink: 0 }}>
                            {m.matchPercent}%
                          </div>
                        </div>
                      ))}

                      {entry.allMatches.length > 2 && (
                        <div style={{ marginLeft: 14+8+2 }}>
                          <Dropdown
                            options={entry.allMatches.slice(2).map((m) => ({
                              value: m.variableId,
                              text: `${m.variableName} (${m.matchPercent}%)`,
                            }))}
                            value={overrideVarId && !top2.find((m) => m.variableId === overrideVarId) ? overrideVarId : null}
                            onChange={(e: any) => handleOverrideVariable(key, e.currentTarget.value)}
                            placeholder="More matches…"
                            style={{ marginBottom: 8 }}
                          />
                          <Button onClick={() => handleApply(entry)} style={{ width: "100%" }}>
                            Apply
                          </Button>
                        </div>
                      )}

                    </div>
                  )}

                  {/* No match */}
                  {top2.length === 0 && (
                    <div style={{ marginTop: 6, fontSize: 11, color: "var(--figma-color-text-tertiary)" }}>
                      No matching variable found
                    </div>
                  )}
                </div>
              )
            })}
          </Stack>
        </ToolBody>
      )}

      <LibraryCacheStatusBar status={cacheStatus} />
    </Page>
  )
}
