import {
  Container,
  IconButton,
  IconInteractionClickSmall24,
  IconHome16,
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
import { EmptyState } from "../../components/EmptyState"
import { ToolHeader } from "../../components/ToolHeader"
import { IconArrowCurvedDownRight16 } from "../../components/AppIcons"
import { Page } from "../../components/Page"

function ColorSwatch(props: { hex: string | null }) {
  const hex = props.hex
  const swatchSize = 16
  return (
    <div
      style={{
        width: swatchSize,
        height: swatchSize,
        borderRadius: 4,
        border: "1px solid var(--figma-color-border)",
        backgroundColor: hex ?? "transparent",
        boxSizing: "border-box",
      }}
      title={hex ?? "N/A"}
    />
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

      {/* Content (scrollable) */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Container space="small">
          {error ? (
            <Fragment>
              <Text>{error}</Text>
              <VerticalSpace space="small" />
            </Fragment>
          ) : null}

          {loading && !error && !selectionEmpty && sortedResults.length === 0 ? (
            <Fragment>
              <Text>Inspecting selection…</Text>
              <VerticalSpace space="small" />
            </Fragment>
          ) : null}

          {selectionEmpty && !error ? (
            <EmptyState
              icon={<IconInteractionClickSmall24 />}
              title="Select a layer to see variables color chain."
            />
          ) : null}

          {!selectionEmpty && !error && sortedResults.length > 0 && totalColors === 0 ? (
            <EmptyState title="No variable colors found in selection" tone="default" />
          ) : null}

          {sortedResults.length > 0 ? (
            <Fragment>
              <VerticalSpace space="small" />
              <Tree
                nodes={((): Array<TreeNode> => {
                  const nodes: Array<TreeNode> = []
                  const spaceHeight = 12

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

                      const chainSteps = chainToRender?.chain ? chainToRender.chain.slice(1) : []
                      const chainRowIcon = (
                        <span
                          style={{
                            color: "var(--figma-color-text-secondary)",
                            opacity: 0.8,
                            display: "inline-flex",
                          }}
                        >
                          <IconArrowCurvedDownRight16 />
                        </span>
                      )

                      nodes.push({
                        id: `${layer.layerId}:${c.variableId}`,
                        title: c.variableName,
                        icon: <ColorSwatch hex={swatchHex} />,
                        titleStrong: true,
                      })

                      for (let idx = 0; idx < chainSteps.length; idx++) {
                        const step = chainSteps[idx]
                        nodes.push({
                          id: `${layer.layerId}:${c.variableId}:step:${idx}`,
                          title: step,
                          icon: chainRowIcon,
                        })
                      }
                      nodes.push({
                        id: `${layer.layerId}:${c.variableId}:hex`,
                        title: chainToRender?.finalHex ?? "N/A",
                        icon: chainRowIcon,
                      })

                      nodes.push({
                        kind: "spacer",
                        id: `${layer.layerId}:${c.variableId}:spacer`,
                        height: spaceHeight,
                      })
                    }
                  }

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
        </Container>
      </div>
    </Page>
  )
}

