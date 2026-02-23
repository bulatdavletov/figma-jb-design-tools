import {
  Button,
  Container,
  Divider,
  IconButton,
  IconMoonSmall24,
  IconSunSmall24,
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
import { ToolTabs } from "../app/components/ToolTabs"
import { ToolPreview } from "./ToolPreview"
import { tools } from "./tool-registry"

type Theme = "figma-light" | "figma-dark"
type Page = "components" | "home" | `tool:${string}`

function setTheme(theme: Theme) {
  document.documentElement.classList.remove("figma-light", "figma-dark")
  document.body.classList.remove("figma-light", "figma-dark")
  document.documentElement.classList.add(theme)
  document.body.classList.add(theme)
}

const PLUGIN_WIDTH = 360
const PLUGIN_HEIGHT = 500

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function NavItem(props: {
  label: string
  active: boolean
  indent?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: props.indent ? "4px 12px 4px 24px" : "4px 12px",
        fontSize: 11,
        fontWeight: props.active ? 600 : 400,
        color: props.active ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
        background: props.active ? "var(--figma-color-bg-hover)" : "none",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {props.label}
    </button>
  )
}

function Sidebar(props: { page: Page; onNavigate: (p: Page) => void; theme: Theme; onToggleTheme: () => void }) {
  const generalTools = tools.filter((t) => t.section === "general")
  const variablesTools = tools.filter((t) => t.section === "variables")

  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        borderRight: "1px solid var(--figma-color-border)",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <div style={{ padding: "12px 12px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontWeight: 700, fontSize: 13 }}>UI Showcase</Text>
          <IconButton title="Toggle theme" onClick={props.onToggleTheme}>
            {props.theme === "figma-light" ? <IconSunSmall24 /> : <IconMoonSmall24 />}
          </IconButton>
        </div>
        <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
          {props.theme === "figma-dark" ? "Dark" : "Light"} theme
        </Text>
      </div>

      <div style={{ padding: "4px 8px" }}>
        <NavItem label="Components" active={props.page === "components"} onClick={() => props.onNavigate("components")} />
        <NavItem label="Home Page" active={props.page === "home"} onClick={() => props.onNavigate("home")} />
      </div>

      <div style={{ padding: "8px 12px 2px" }}>
        <Text style={{ fontSize: 10, fontWeight: 600, color: "var(--figma-color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          General Tools
        </Text>
      </div>
      <div style={{ padding: "2px 8px" }}>
        {generalTools.map((t) => (
          <NavItem
            key={t.id}
            label={t.label}
            active={props.page === `tool:${t.id}`}
            indent
            onClick={() => props.onNavigate(`tool:${t.id}`)}
          />
        ))}
      </div>

      <div style={{ padding: "8px 12px 2px" }}>
        <Text style={{ fontSize: 10, fontWeight: 600, color: "var(--figma-color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Variables Tools
        </Text>
      </div>
      <div style={{ padding: "2px 8px 12px" }}>
        {variablesTools.map((t) => (
          <NavItem
            key={t.id}
            label={t.label}
            active={props.page === `tool:${t.id}`}
            indent
            onClick={() => props.onNavigate(`tool:${t.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Content pages
// ---------------------------------------------------------------------------

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

function ComponentsPage(props: { theme: Theme; setTheme: (t: Theme) => void }) {
  const [scope, setScope] = useState<ScopeValue>("selection")
  const [hasSelection, setHasSelection] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [openById, setOpenById] = useState<Record<string, boolean>>({ "group:1": true })

  const sampleTree = useMemo<Array<TreeNode>>(
    () => [
      {
        id: "group:1",
        title: "Buttons",
        icon: <IconChevronDown16 />,
        children: [
          { id: "row:1", title: "Primary action", description: "Used for main CTA", icon: <IconArrowRight16 /> },
          { id: "row:2", title: "Secondary action", titleStrong: true },
        ],
      },
      { kind: "spacer", id: "spacer:1", height: 10 },
      { id: "flat:1", title: "Standalone row" },
    ],
    []
  )

  return (
    <Container space="small">
      <ShowcaseSection title="Theme" description="Quickly test all components in light/dark Figma themes." options={`Current: ${props.theme}`}>
        <Button onClick={() => props.setTheme("figma-light")}>Light</Button>
        <VerticalSpace space="extraSmall" />
        <Button onClick={() => props.setTheme("figma-dark")}>Dark</Button>
      </ShowcaseSection>

      <ShowcaseSection title="ToolCard" description="Home-screen card for launching a tool." options="Props: title, description, icon, onClick">
        <ToolCard title="View Colors Chain" description="Inspect selection to see full variable alias chains." icon={<IconChevronDown16 />} onClick={() => alert("ToolCard clicked")} />
      </ShowcaseSection>

      <ShowcaseSection title="Actions" description="Primary action styles with icons and labels." options="Components: ButtonWithIcon, Button">
        <ButtonWithIcon icon={<IconArrowDown16 />} onClick={() => alert("ButtonWithIcon clicked")}>
          Apply selected changes
        </ButtonWithIcon>
        <VerticalSpace space="extraSmall" />
        <Button disabled>Disabled action</Button>
      </ShowcaseSection>

      <ShowcaseSection title="ToolTabs" description="Top-level tab navigation used inside larger tool views." options="Props: value, options, onValueChange">
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

      <ShowcaseSection title="ScopeControl" description="Reusable scope selector with selection-aware disabling." options={`State: value=${scope}, hasSelection=${String(hasSelection)}`}>
        <ScopeControl value={scope} hasSelection={hasSelection} onValueChange={setScope} />
        <VerticalSpace space="extraSmall" />
        <Button onClick={() => setHasSelection((v) => !v)}>
          Toggle hasSelection ({hasSelection ? "true" : "false"})
        </Button>
      </ShowcaseSection>

      <ShowcaseSection title="Tree" description="Collapsible hierarchy for grouped content and rows." options="Props: nodes, openById, onToggle">
        <Tree nodes={sampleTree} openById={openById} onToggle={(id) => setOpenById((prev) => ({ ...prev, [id]: !prev[id] }))} />
      </ShowcaseSection>

      <ShowcaseSection title="DataList + DataRow" description="Card-like list rows for previews, warnings, and inline actions." options="Supports secondary/tertiary text, alert block, checkbox, trailing content">
        <DataList header="Changes preview" summary="Candidates: 2 | Will update: 1" emptyText="Nothing to show">
          <DataRow primary="button/background" secondary="#0086FF → #005BD3" tertiary="Collection: Int UI Kit" alert="Opacity mismatch detected" trailing={<ColorSwatch hex="#005BD3" />} />
          <DataRow primary="text/primary" secondary="#0B0F14 (kept)" tertiary="No change required" />
        </DataList>
      </ShowcaseSection>

      <ShowcaseSection title="DataTable" description="Structured table for rename/import workflows with fixed headers." options="Props: columns, header, summary, table rows">
        <DataTable header="Rename plan" summary="Rows: 2" columns={[{ label: "Variable", width: "44%" }, { label: "Old", width: "28%" }, { label: "New", width: "28%" }]}>
          <tr>
            <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--figma-color-border-secondary)" }}>color/button/primary</td>
            <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--figma-color-border-secondary)" }}>#0086FF</td>
            <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--figma-color-border-secondary)" }}>#005BD3</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 8px" }}>color/text/primary</td>
            <td style={{ padding: "6px 8px" }}>#0B0F14</td>
            <td style={{ padding: "6px 8px" }}>#111827</td>
          </tr>
        </DataTable>
      </ShowcaseSection>

      <ShowcaseSection title="ColorRow + ColorSwatch" description="Compact row for color chains with contextual actions on hover." options="ColorSwatch shows checkerboard + split alpha preview">
        <div style={{ border: "1px solid var(--figma-color-border)", borderRadius: 6, overflow: "hidden" }}>
          <ColorRow
            title="got-it-control-border"
            description="#FFFFFF 24%"
            icon={<ColorSwatch hex="#FFFFFF" opacityPercent={24} />}
            actions={[{ id: "copy", label: "Copy", kind: "button", onClick: () => alert("Copied") }]}
          />
        </div>
      </ShowcaseSection>

      <Text style={{ fontWeight: 600 }}>State</Text>
      <VerticalSpace space="extraSmall" />
      <Text style={{ color: "var(--figma-color-text-secondary)" }}>Empty/loading/error surface for each tool.</Text>
      <VerticalSpace space="small" />
      <div style={{ border: "1px solid var(--figma-color-border)", borderRadius: 8 }}>
        <State icon={<IconChevronDown16 />} title="Nothing here yet" description="This is a preview state." />
      </div>
      <VerticalSpace space="large" />
    </Container>
  )
}

function HomePreview(props: { theme: Theme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "24px 0" }}>
      <Text style={{ fontWeight: 600, fontSize: 13 }}>Plugin Home — {PLUGIN_WIDTH}x{PLUGIN_HEIGHT}</Text>
      <iframe
        src={`/?isolated=1&tool=home&theme=${props.theme}`}
        width={PLUGIN_WIDTH}
        height={PLUGIN_HEIGHT}
        style={{
          border: "1px solid var(--figma-color-border)",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------

export function PreviewApp() {
  const [theme, setThemeState] = useState<Theme>("figma-light")
  const [page, setPage] = useState<Page>("home")

  useEffect(() => {
    setTheme(theme)
  }, [theme])

  const toggleTheme = () => setThemeState((t) => (t === "figma-light" ? "figma-dark" : "figma-light"))

  const activeTool = page.startsWith("tool:") ? tools.find((t) => t.id === page.slice(5)) : null

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <Sidebar page={page} onNavigate={setPage} theme={theme} onToggleTheme={toggleTheme} />

      <div style={{ flex: 1, overflow: "auto" }}>
        {page === "components" && <ComponentsPage theme={theme} setTheme={setThemeState} />}
        {page === "home" && <HomePreview theme={theme} />}
        {activeTool && <ToolPreview tool={activeTool} theme={theme} />}
      </div>
    </div>
  )
}
