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
  FindColorMatchProgressPayload,
} from "../../messages"
import { Page } from "../../components/Page"
import { ToolHeader } from "../../components/ToolHeader"
import { ToolBody } from "../../components/ToolBody"
import { State } from "../../components/State"
import { ColorSwatch } from "../../components/ColorSwatch"

type Props = {
  onBack: () => void
  initialSelectionEmpty?: boolean
}

export function FindColorMatchToolView({ onBack, initialSelectionEmpty }: Props) {
  const [collections, setCollections] = useState<FindColorMatchCollectionInfo[]>([])
  const [selectedCollectionKey, setSelectedCollectionKey] = useState<string | null>(null)
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null)
  const [entries, setEntries] = useState<FindColorMatchResultEntry[]>([])
  const [progress, setProgress] = useState<FindColorMatchProgressPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [appliedKeys, setAppliedKeys] = useState<Set<string>>(new Set())
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [selectionEmpty, setSelectionEmpty] = useState(initialSelectionEmpty ?? true)

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
        const hasEntries = msg.payload.entries.length > 0
        setEntries(msg.payload.entries)
        setProgress(null)
        setIsLoading(false)
        setSelectionEmpty(!hasEntries)
        setAppliedKeys(new Set())
        setOverrides({})
      }

      if (msg.type === MAIN_TO_UI.FIND_COLOR_MATCH_PROGRESS) {
        setProgress(msg.progress)
        setIsLoading(true)
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

      if (msg.type === MAIN_TO_UI.SELECTION_EMPTY) {
        setSelectionEmpty(true)
        setEntries([])
        setIsLoading(false)
        setProgress(null)
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

  const collectionOptions: DropdownOption[] = useMemo(() => {
    return collections.map((c) => ({ value: c.key, text: c.name }))
  }, [collections])

  const modeOptions: DropdownOption[] = useMemo(() => {
    if (!selectedCollection || selectedCollection.modes.length === 0) return []
    return selectedCollection.modes.map((m) => ({
      value: m.modeId,
      text: m.modeName,
    }))
  }, [selectedCollection])

  const handleCollectionChange = (value: string) => {
    setSelectedCollectionKey(value)
    setEntries([])
    setAppliedKeys(new Set())
    setOverrides({})
    setIsLoading(true)

    const col = collections.find((c) => c.key === value)
    const firstModeId = col?.modes[0]?.modeId ?? null
    setSelectedModeId(firstModeId)

    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.FIND_COLOR_MATCH_SET_COLLECTION, collectionKey: value } },
      "*"
    )
  }

  const handleModeChange = (value: string) => {
    setSelectedModeId(value)
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

    parent.postMessage(
      {
        pluginMessage: {
          type: UI_TO_MAIN.FIND_COLOR_MATCH_APPLY,
          request: {
            nodeId: entry.found.nodeId,
            variableId,
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
  const showNoUnbound = !isLoading && !selectionEmpty && entries.length === 0 && visibleEntries.length === 0
  const showLoading = isLoading && entries.length === 0

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

      {/* Filters: collection, mode, and hex input — horizontal */}
      <div>
        <Container space="small">
          <VerticalSpace space="small" />
          <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
            {collectionOptions.length > 1 && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Dropdown
                  options={collectionOptions}
                  value={selectedCollectionKey ?? null}
                  onChange={(e: any) => handleCollectionChange(e.currentTarget.value)}
                />
              </div>
            )}
            {modeOptions.length > 0 && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Dropdown
                  options={modeOptions}
                  value={selectedModeId ?? null}
                  onChange={(e: any) => handleModeChange(e.currentTarget.value)}
                />
              </div>
            )}
          </div>
          <VerticalSpace space="small" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <TextboxColor
              hexColor={hexInput}
              hexColorPlaceholder="Paste hex"
              opacity={hexOpacity}
              onHexColorValueInput={handleHexInput}
              onOpacityValueInput={setHexOpacity}
            />
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

      {/* Loading state */}
      {showLoading && (
        <ToolBody mode="state">
          <State title={progress ? progress.message : "Loading…"} />
        </ToolBody>
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

      {/* Empty: no unbound colors */}
      {showNoUnbound && (
        <ToolBody mode="state">
          <State title="No unbound colors found in selection" />
        </ToolBody>
      )}

      {/* Results */}
      {visibleEntries.length > 0 && (
        <ToolBody mode="content">
          <Text style={{ color: "var(--figma-color-text-secondary)" }}>
            {visibleEntries.length} unbound color{visibleEntries.length !== 1 ? "s" : ""} found
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
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ColorSwatch hex={entry.found.hex} opacityPercent={entry.found.opacity} />
                    <div style={{ flex: 1, minWidth: 0 }}>
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
                        {entry.found.nodeName}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)" }}>
                        {entry.found.hex} · {entry.found.colorType.toLowerCase()}
                        {entry.found.opacity < 100 ? ` · ${entry.found.opacity}%` : ""}
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
                            padding: "2px 4px",
                            borderRadius: 4,
                            background: m.variableId === selectedVarId ? "var(--figma-color-bg-hover)" : "transparent",
                          }}
                          onClick={() => handleOverrideVariable(key, m.variableId)}
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

                      {entry.allMatches.length > 2 && (
                        <Dropdown
                          options={entry.allMatches.slice(2).map((m) => ({
                            value: m.variableId,
                            text: `${m.variableName} (${m.matchPercent}%)`,
                          }))}
                          value={overrideVarId && !top2.find((m) => m.variableId === overrideVarId) ? overrideVarId : null}
                          onChange={(e: any) => handleOverrideVariable(key, e.currentTarget.value)}
                          placeholder="More matches…"
                          style={{ marginBottom: 4 }}
                        />
                      )}

                      <Button onClick={() => handleApply(entry)} secondary style={{ width: "100%" }}>
                        Apply
                      </Button>
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

      {/* Progress overlay when loading with existing results */}
      {isLoading && entries.length > 0 && progress && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "8px 12px",
          background: "var(--figma-color-bg)",
          borderTop: "1px solid var(--figma-color-border)",
          fontSize: 11,
          color: "var(--figma-color-text-secondary)",
        }}>
          {progress.message}
        </div>
      )}
    </Page>
  )
}
