import {
  IconButton,
  IconInteractionClickSmall24,
  IconHome16,
  IconTimeSmall24,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  type LayerInspectionResult,
  type MainToUiMessage,
  UI_TO_MAIN,
  type VariableChainResult,
} from "../../messages"
import { Tree, type TreeNode } from "../../components/Tree"
import { State } from "../../components/State"
import { ToolHeader } from "../../components/ToolHeader"
import { Page } from "../../components/Page"
import { ToolBody } from "../../components/ToolBody"

type ViewState = "error" | "inspecting" | "selectionEmpty" | "nothingFound" | "content"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().toUpperCase()
  const m = /^#([0-9A-F]{6})$/.exec(normalized)
  if (!m) return null
  const v = m[1]
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return { r, g, b }
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

function formatHexWithOpacity(hex: string, opacityPercent: number | null): string {
  if (opacityPercent == null) return hex
  if (opacityPercent >= 100) return hex
  return `${hex} ${opacityPercent}%`
}

function ColorSwatch(props: { hex: string | null; opacityPercent?: number | null }) {
  const hex = props.hex
  const swatchSize = 16
  const opacityPercent = typeof props.opacityPercent === "number" ? props.opacityPercent : null
  const alpha = opacityPercent == null ? 1 : clamp01(opacityPercent / 100)
  const rgb = hex ? hexToRgb(hex) : null
  const rgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : "transparent"
  const showTransparency = alpha < 0.999
  return (
    <div
      style={{
        width: swatchSize,
        height: swatchSize,
        borderRadius: 4,
        border: "1px solid var(--figma-color-border)",
        position: "relative",
        overflow: "hidden",
        // If opaque: show solid color.
        // If transparent: show checkerboard behind RGBA overlay.
        backgroundColor: showTransparency ? "var(--figma-color-bg-secondary)" : (hex ?? "transparent"),
        backgroundImage: showTransparency
          ? "linear-gradient(45deg, rgba(0,0,0,0.12) 25%, transparent 25%)," +
            "linear-gradient(-45deg, rgba(0,0,0,0.12) 25%, transparent 25%)," +
            "linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.12) 75%)," +
            "linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.12) 75%)"
          : "none",
        backgroundSize: showTransparency ? "8px 8px" : undefined,
        backgroundPosition: showTransparency ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined,
        boxSizing: "border-box",
      }}
      title={
        hex
          ? typeof opacityPercent === "number"
            ? formatHexWithOpacity(hex, opacityPercent)
            : hex
          : "N/A"
      }
    >
      {showTransparency ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: rgba,
          }}
        />
      ) : null}
    </div>
  )
}

export function ColorChainToolView(props: { onBack: () => void; initialSelectionEmpty: boolean }) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Array<LayerInspectionResult>>([])
  const [error, setError] = useState<string | null>(null)
  const [openById, setOpenById] = useState<Record<string, boolean>>({})
  const [selectionEmpty, setSelectionEmpty] = useState(props.initialSelectionEmpty)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return
      if (msg.type === MAIN_TO_UI.ERROR) {
        setLoading(false)
        setError(msg.message)
        return
      }

      if (msg.type === MAIN_TO_UI.SELECTION_EMPTY) {
        setLoading(false)
        setResults([])
        setOpenById({})
        setSelectionEmpty(true)
        setError(null)
        return
      }

      if (msg.type === MAIN_TO_UI.VARIABLE_CHAINS_RESULT) {
        setLoading(false)
        setResults(msg.results)
        // Expanded by default: reset state so Tree defaults to "open".
        setOpenById({})
        setSelectionEmpty(false)
        setError(null)
        return
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Request a refresh on mount.
  // Reason: the main thread can send the initial update immediately after BOOT,
  // before this view subscribes to messages, which results in an "empty" page.
  useEffect(() => {
    setLoading(true)
    parent.postMessage(
      {
        pluginMessage: { type: UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS },
      },
      "*"
    )
  }, [])

  const sortedResults = useMemo(() => {
    return results.slice().sort((a, b) => a.layerName.localeCompare(b.layerName))
  }, [results])

  const totalColors = useMemo(() => {
    return results.reduce((sum, layer) => sum + (layer.colors?.length ?? 0), 0)
  }, [results])

  const viewState: ViewState = (() => {
    if (error) return "error"
    if (selectionEmpty) return "selectionEmpty"
    if (loading && sortedResults.length === 0) return "inspecting"
    if (sortedResults.length > 0 && totalColors === 0) return "nothingFound"
    return "content"
  })()

  return (
    <Page>
      <ToolHeader
        title="View Colors Chain"
        left={
          <IconButton onClick={props.onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />

      {viewState === "error" ? (
        <ToolBody mode="state">
          <State title={error ?? "Unknown error"} tone="default" />
        </ToolBody>
      ) : viewState === "inspecting" ? (
        <ToolBody mode="state">
          <State icon={<IconTimeSmall24 />} title="Inspecting selection…" />
        </ToolBody>
      ) : viewState === "selectionEmpty" ? (
        <ToolBody mode="state">
          <State
            icon={<IconInteractionClickSmall24 />}
            title="Select a layer to see variables color chain."
          />
        </ToolBody>
      ) : viewState === "nothingFound" ? (
        <ToolBody mode="state">
          <State title="No variable colors found in selection" />
        </ToolBody>
      ) : (
        <ToolBody mode="content">
          {sortedResults.length > 0 ? (
            <Fragment>
              <Tree
                nodes={((): Array<TreeNode> => {
                  const nodes: Array<TreeNode> = []
                  const groupSpacing = 16

                  for (const layer of sortedResults) {
                    const colors = layer.colors
                      .slice()
                      .sort((a, b) => a.variableName.localeCompare(b.variableName))

                    for (const c of colors) {
                      const applied = c.appliedMode
                      let currentModeChain: VariableChainResult["chains"][number] | null = null
                      if (applied.status === "single") {
                        currentModeChain = c.chains.find((ch) => ch.modeId === applied.modeId) ?? null
                      }
                      const chainToRender = currentModeChain ?? c.chains[0] ?? null
                      const swatchHex = chainToRender?.finalHex ?? null
                      const swatchOpacityPercent = chainToRender?.finalOpacityPercent ?? null

                      const chainSteps = chainToRender?.chain ? chainToRender.chain.slice(1) : []

                      nodes.push({
                        id: `${layer.layerId}:${c.variableId}`,
                        title: c.variableName,
                        icon: <ColorSwatch hex={swatchHex} opacityPercent={swatchOpacityPercent} />,
                        titleStrong: true,
                      })

                      for (let idx = 0; idx < chainSteps.length; idx++) {
                        const step = chainSteps[idx]
                        nodes.push({
                          id: `${layer.layerId}:${c.variableId}:step:${idx}`,
                          title: step,
                        })
                      }
                      nodes.push({
                        id: `${layer.layerId}:${c.variableId}:hex`,
                        title:
                          chainToRender?.finalHex && typeof chainToRender.finalOpacityPercent === "number"
                            ? formatHexWithOpacity(chainToRender.finalHex, chainToRender.finalOpacityPercent)
                            : (chainToRender?.finalHex ?? "N/A"),
                      })

                      // Add spacing between groups (but not within the group).
                      nodes.push({
                        kind: "spacer",
                        id: `${layer.layerId}:${c.variableId}:spacer`,
                        height: groupSpacing,
                      })
                    }
                  }

                  // Remove the trailing spacer so the list doesn't end with extra whitespace.
                  if (nodes.length > 0 && nodes[nodes.length - 1].kind === "spacer") {
                    nodes.pop()
                  }

                  return nodes
                })()}
                openById={openById}
                onToggle={(id) =>
                  setOpenById((prev) => {
                    const current = prev[id]
                    const isOpen = typeof current === "boolean" ? current : true
                    return { ...prev, [id]: !isOpen }
                  })
                }
              />
            </Fragment>
          ) : null}
        </ToolBody>
      )}
    </Page>
  )
}

