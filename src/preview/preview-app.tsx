import {
  Button,
  Container,
  Divider,
  IconButton,
  IconHome16,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import { ButtonWithIcon } from "../app/components/ButtonWithIcon"
import { ColorRow } from "../app/components/ColorRow"
import { ColorSwatch } from "../app/components/ColorSwatch"
import { DataList } from "../app/components/DataList"
import { DataRow } from "../app/components/DataRow"
import { DataTable } from "../app/components/DataTable"
import { IconArrowDown16, IconArrowRight16, IconChevronDown16 } from "../app/components/AppIcons"
import { ScopeControl, type ScopeValue } from "../app/components/ScopeControl"
import { State } from "../app/components/State"
import { Tree, type TreeNode } from "../app/components/Tree"
import { ToolCard } from "../app/components/ToolCard"
import { ToolHeader } from "../app/components/ToolHeader"
import { ToolTabs } from "../app/components/ToolTabs"
import { HomeView } from "../app/views/home/HomeView"

type Theme = "figma-light" | "figma-dark"
type PreviewMode = "showcase" | "home"

function setTheme(theme: Theme) {
  document.documentElement.classList.remove("figma-light", "figma-dark")
  document.body.classList.remove("figma-light", "figma-dark")
  document.documentElement.classList.add(theme)
  document.body.classList.add(theme)
}

const PLUGIN_WIDTH = 360
const PLUGIN_HEIGHT = 500

function ShowcaseSection(props: {
  title: string
  description: string
  options?: string
  children: preact.ComponentChildren
}) {
  return (
    <Fragment>
      <Text style={{ fontWeight: 600 }}>{props.title}</Text>
      <VerticalSpace space="extraSmall" />
      <Text style={{ color: "var(--figma-color-text-secondary)" }}>{props.description}</Text>
      {props.options ? (
        <Fragment>
          <VerticalSpace space="extraSmall" />
          <Text style={{ color: "var(--figma-color-text-tertiary)", fontSize: 11 }}>
            {props.options}
          </Text>
        </Fragment>
      ) : null}
      <VerticalSpace space="small" />
      {props.children}
      <VerticalSpace space="medium" />
      <Divider />
      <VerticalSpace space="medium" />
    </Fragment>
  )
}

function PluginFrame(props: { children: preact.ComponentChildren; theme: Theme }) {
  return (
    <div
      style={{
        width: PLUGIN_WIDTH,
        height: PLUGIN_HEIGHT,
        border: "1px solid var(--figma-color-border)",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        margin: "0 auto",
      }}
    >
      {props.children}
    </div>
  )
}

function HomePreview(props: { theme: Theme }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "24px 0",
        minHeight: "100vh",
        background: props.theme === "figma-dark" ? "#1e1e1e" : "#f0f0f0",
      }}
    >
      <Text style={{ fontWeight: 600, fontSize: 13 }}>
        Plugin Home — {PLUGIN_WIDTH}×{PLUGIN_HEIGHT}
      </Text>
      <PluginFrame theme={props.theme}>
        <HomeView goTo={(route) => alert(`Navigate to: ${route}`)} />
      </PluginFrame>
    </div>
  )
}

export function PreviewApp() {
  const [theme, setThemeState] = useState<Theme>("figma-light")
  const [mode, setMode] = useState<PreviewMode>("home")
  const [scope, setScope] = useState<ScopeValue>("selection")
  const [hasSelection, setHasSelection] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [openById, setOpenById] = useState<Record<string, boolean>>({ "group:1": true })

  useEffect(() => {
    setTheme(theme)
  }, [theme])

  const sampleTree = useMemo<Array<TreeNode>>(
    () => [
      {
        id: "group:1",
        title: "Buttons",
        icon: <IconChevronDown16 />,
        children: [
          {
            id: "row:1",
            title: "Primary action",
            description: "Used for main CTA",
            icon: <IconArrowRight16 />,
          },
          {
            id: "row:2",
            title: "Secondary action",
            titleStrong: true,
          },
        ],
      },
      { kind: "spacer", id: "spacer:1", height: 10 },
      { id: "flat:1", title: "Standalone row" },
    ],
    []
  )

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ToolHeader
        title={mode === "home" ? "Plugin Home Preview" : "UI Elements Showcase"}
        left={
          <IconButton
            title="Toggle theme"
            onClick={() => setThemeState((t) => (t === "figma-light" ? "figma-dark" : "figma-light"))}
          >
            <IconHome16 />
          </IconButton>
        }
      />

      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--figma-color-border)" }}>
        {(["home", "showcase"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "6px 0",
              fontSize: 11,
              fontWeight: mode === m ? 600 : 400,
              color: mode === m ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
              background: "none",
              border: "none",
              borderBottom: mode === m ? "2px solid var(--figma-color-border-selected)" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            {m === "home" ? "Home Page" : "Components"}
          </button>
        ))}
      </div>

      {mode === "home" ? (
        <div style={{ flex: 1, overflow: "auto" }}>
          <HomePreview theme={theme} />
        </div>
      ) : (
        <div style={{ flex: 1, overflow: "auto" }}>
          <Container space="small">
            <ShowcaseSection
              title="Theme"
              description="Quickly test all components in light/dark Figma themes."
              options={`Current: ${theme}`}
            >
              <Button onClick={() => setThemeState("figma-light")}>Light</Button>
              <VerticalSpace space="extraSmall" />
              <Button onClick={() => setThemeState("figma-dark")}>Dark</Button>
            </ShowcaseSection>

            <ShowcaseSection
              title="ToolCard"
              description="Home-screen card for launching a tool with name and explanation."
              options="Props: title, description, icon, onClick"
            >
              <ToolCard
                title="View Colors Chain"
                description="Inspect selection to see full variable alias chains."
                icon={<IconChevronDown16 />}
                onClick={() => alert("ToolCard clicked")}
              />
            </ShowcaseSection>

            <ShowcaseSection
              title="Actions"
              description="Primary action styles with icons and labels."
              options="Components: ButtonWithIcon, Button"
            >
              <ButtonWithIcon icon={<IconArrowDown16 />} onClick={() => alert("ButtonWithIcon clicked")}>
                Apply selected changes
              </ButtonWithIcon>
              <VerticalSpace space="extraSmall" />
              <Button disabled>Disabled action</Button>
            </ShowcaseSection>

            <ShowcaseSection
              title="ToolTabs"
              description="Top-level tab navigation used inside larger tool views."
              options="Props: value, options, onValueChange"
            >
              <ToolTabs
                value={activeTab}
                onValueChange={setActiveTab}
                options={[
                  { value: "overview", children: "Overview" },
                  { value: "preview", children: "Preview" },
                  { value: "history", children: "History" },
                ]}
              />
            </ShowcaseSection>

            <ShowcaseSection
              title="ScopeControl"
              description="Reusable scope selector with selection-aware disabling."
              options={`State: value=${scope}, hasSelection=${String(hasSelection)}`}
            >
              <ScopeControl value={scope} hasSelection={hasSelection} onValueChange={setScope} />
              <VerticalSpace space="extraSmall" />
              <Button onClick={() => setHasSelection((v) => !v)}>
                Toggle hasSelection ({hasSelection ? "true" : "false"})
              </Button>
            </ShowcaseSection>

            <ShowcaseSection
              title="Tree"
              description="Collapsible hierarchy for grouped content and rows."
              options="Props: nodes, openById, onToggle"
            >
              <Tree
                nodes={sampleTree}
                openById={openById}
                onToggle={(id) => setOpenById((prev) => ({ ...prev, [id]: !prev[id] }))}
              />
            </ShowcaseSection>

            <ShowcaseSection
              title="DataList + DataRow"
              description="Card-like list rows for previews, warnings, and inline actions."
              options="Supports secondary/tertiary text, alert block, checkbox, trailing content"
            >
              <DataList header="Changes preview" summary="Candidates: 2 | Will update: 1" emptyText="Nothing to show">
                <DataRow
                  primary="button/background"
                  secondary="#0086FF → #005BD3"
                  tertiary="Collection: Int UI Kit"
                  alert="Opacity mismatch detected"
                  trailing={<ColorSwatch hex="#005BD3" />}
                />
                <DataRow primary="text/primary" secondary="#0B0F14 (kept)" tertiary="No change required" />
              </DataList>
            </ShowcaseSection>

            <ShowcaseSection
              title="DataTable"
              description="Structured table for rename/import workflows with fixed headers."
              options="Props: columns, header, summary, table rows"
            >
              <DataTable
                header="Rename plan"
                summary="Rows: 2"
                columns={[
                  { label: "Variable", width: "44%" },
                  { label: "Old", width: "28%" },
                  { label: "New", width: "28%" },
                ]}
              >
                <tr>
                  <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--figma-color-border-secondary)" }}>
                    color/button/primary
                  </td>
                  <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--figma-color-border-secondary)" }}>
                    #0086FF
                  </td>
                  <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--figma-color-border-secondary)" }}>
                    #005BD3
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "6px 8px" }}>color/text/primary</td>
                  <td style={{ padding: "6px 8px" }}>#0B0F14</td>
                  <td style={{ padding: "6px 8px" }}>#111827</td>
                </tr>
              </DataTable>
            </ShowcaseSection>

            <ShowcaseSection
              title="ColorRow + ColorSwatch"
              description="Compact row for color chains with contextual actions on hover."
              options="ColorSwatch shows checkerboard + split alpha preview"
            >
              <div style={{ border: "1px solid var(--figma-color-border)", borderRadius: 6, overflow: "hidden" }}>
                <ColorRow
                  title="got-it-control-border"
                  description="#FFFFFF 24%"
                  icon={<ColorSwatch hex="#FFFFFF" opacityPercent={24} />}
                  actions={[
                    {
                      id: "copy",
                      label: "Copy",
                      kind: "button",
                      onClick: () => alert("Copied"),
                    },
                  ]}
                />
              </div>
            </ShowcaseSection>

            <Text style={{ fontWeight: 600 }}>State</Text>
            <VerticalSpace space="extraSmall" />
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>
              Empty/loading/error surface for each tool.
            </Text>
            <VerticalSpace space="small" />
            <div style={{ border: "1px solid var(--figma-color-border)", borderRadius: 8 }}>
              <State icon={<IconChevronDown16 />} title="Nothing here yet" description="This is a preview state." />
            </div>

            <VerticalSpace space="extraLarge" />
            <Text style={{ color: "var(--figma-color-text-tertiary)", fontSize: 11 }}>
              This page is the single source of truth for reusable UI building blocks before Figma library + Code
              Connect work.
            </Text>
            <VerticalSpace space="small" />
          </Container>
        </div>
      )}
    </div>
  )
}
