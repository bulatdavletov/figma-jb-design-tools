import {
  Container,
  Divider,
  IconButton,
  IconInteractionClickSmall24,
  IconHome16,
  IconLink16,
  Text,
  VerticalSpace,
  render,
} from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import { MAIN_TO_UI, type LayerInspectionResult, type MainToUiMessage, UI_TO_MAIN, type VariableChainResult } from "./messages"
import { Tree, type TreeNode } from "./components/Tree"
import { EmptyState } from "./components/EmptyState"
import { UtilityHeader } from "./components/UtilityHeader"
import { UtilityCard } from "./components/UtilityCard"
import { IconArrowCurvedDownRight16 } from "./components/AppIcons"

type Route = "home" | "chain-inspector"

function Page(props: { children: preact.ComponentChildren }) {
  return (
    <div
      style={{
        // In some builds the iframe/body may not set an explicit height,
        // so `height: 100%` can collapse to 0 and render an "empty" UI.
        // `100vh` is stable inside the plugin iframe.
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {props.children}
    </div>
  )
}

function HomeView(props: { goTo: (route: Route) => void }) {
  return (
    <Page>
      <Container space="small">
      <VerticalSpace space="small" />
      <Text>Colors</Text>
      <VerticalSpace space="small" />
      <UtilityCard
        title="View Colors Chain"
        description="Inspect selection to see full variable alias chains."
        icon={<IconLink16 />}
        onClick={() => props.goTo("chain-inspector")}
      />
      </Container>
    </Page>
  )
}

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

function ChainInspectorView(props: { onBack: () => void; initialSelectionEmpty: boolean }) {
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
      <UtilityHeader
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
            <EmptyState
              title="No variable colors found in selection"
              tone="default"
            />
          ) : null}

          {sortedResults.length > 0 ? (
            <Fragment>
              <VerticalSpace space="small" />
              <Tree
                nodes={((): Array<TreeNode> => {
                  const nodes: Array<TreeNode> = []
                  const multiLayer = sortedResults.length > 1
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
                      
                      nodes.push({
                        id: `${layer.layerId}:${c.variableId}`,
                        title: c.variableName,
                        // Keep Chain View minimal: no collection name.
                        // (If we need disambiguation later for multi-selection, we can show layer name only.)
                        icon: <ColorSwatch hex={swatchHex} />,
                        titleStrong: true,
                      })

                      // Flat list: chain rows are siblings (no nesting / no indentation / no chevrons).
                      for (let idx = 0; idx < chainSteps.length; idx++) {
                        const step = chainSteps[idx]
                        nodes.push({
                          id: `${layer.layerId}:${c.variableId}:step:${idx}`,
                          title: step,
                          icon: (
                            <span
                              style={{
                                color: "var(--figma-color-text-secondary)",
                                opacity: 0.8,
                                display: "inline-flex",
                              }}
                            >
                              <IconArrowCurvedDownRight16 />
                            </span>
                          ),
                        })
                      }
                      nodes.push({
                        id: `${layer.layerId}:${c.variableId}:hex`,
                        title: chainToRender?.finalHex ?? "N/A",
                      })

                      // Bigger space between unique colors (cleaner than divider).
                      nodes.push({
                        kind: "spacer",
                        id: `${layer.layerId}:${c.variableId}:spacer`,
                        height: spaceHeight,
                      })
                    }
                  }

                  // Remove trailing spacer.
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

export function App() {
  const [route, setRoute] = useState<Route>("home")
  const [bootCommand, setBootCommand] = useState<string>("home")
  const [selectionSize, setSelectionSize] = useState<number>(0)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return
      if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
        setBootCommand(msg.command)
        setSelectionSize(msg.selectionSize)
        setRoute(msg.command === "chain-inspector" ? "chain-inspector" : "home")
      }
    }
    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.BOOT } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return route === "home" ? (
    <HomeView goTo={setRoute} />
  ) : (
    <ChainInspectorView
      onBack={() => setRoute("home")}
      initialSelectionEmpty={selectionSize === 0}
    />
  )
}

export default render(App)

