import {
  IconButton,
  IconInteractionClickSmall24,
  IconHome16,
  IconTimeSmall24,
} from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  type LayerInspectionResult,
  type LayerInspectionResultV2,
  type MainToUiMessage,
  UI_TO_MAIN,
  type VariableChainResult,
  type VariableChainResultV2,
} from "../../messages"
import { ColorSwatch } from "../../components/ColorSwatch"
import { Tree, type TreeNode } from "../../components/Tree"
import { State } from "../../components/State"
import { ToolHeader } from "../../components/ToolHeader"
import { Page } from "../../components/Page"
import { ToolBody } from "../../components/ToolBody"

type ViewState = "error" | "inspecting" | "selectionEmpty" | "nothingFound" | "content"

function formatHexWithOpacity(hex: string, opacityPercent: number | null): string {
  if (opacityPercent == null) return hex
  if (opacityPercent >= 100) return hex
  return `${hex} ${opacityPercent}%`
}

function coerceResultsToV2(results: Array<LayerInspectionResult>): Array<LayerInspectionResultV2> {
  return results.map((layer) => ({
    layerId: layer.layerId,
    layerName: layer.layerName,
    layerType: layer.layerType,
    colors: layer.colors.map((c): VariableChainResultV2 => {
      const applied = c.appliedMode
      let chainToRender: VariableChainResult["chains"][number] | null = null
      if (applied.status === "single") {
        chainToRender = c.chains.find((ch) => ch.modeId === applied.modeId) ?? null
      }
      chainToRender = chainToRender ?? c.chains[0] ?? null
      return {
        variableId: c.variableId,
        variableName: c.variableName,
        collectionName: c.collectionName,
        appliedMode: c.appliedMode,
        chainToRender,
        hasOtherModes: c.chains.length > 1,
      }
    }),
  }))
}

export function ColorChainToolView(props: { onBack: () => void; initialSelectionEmpty: boolean }) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Array<LayerInspectionResultV2>>([])
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
        setResults(coerceResultsToV2(msg.results))
        // Expanded by default: reset state so Tree defaults to "open".
        setOpenById({})
        setSelectionEmpty(false)
        setError(null)
        return
      }

      if (msg.type === MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2) {
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
                      const chainToRender = c.chainToRender
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

