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
import { EmptyState } from "../app/components/EmptyState"
import { IconArrowDown16, IconChevronDown16 } from "../app/components/AppIcons"
import { Tree, type TreeNode } from "../app/components/Tree"
import { UtilityCard } from "../app/components/UtilityCard"
import { UtilityHeader } from "../app/components/UtilityHeader"

type Theme = "figma-light" | "figma-dark"

function setTheme(theme: Theme) {
  document.documentElement.classList.remove("figma-light", "figma-dark")
  document.body.classList.remove("figma-light", "figma-dark")
  document.documentElement.classList.add(theme)
  document.body.classList.add(theme)
}

export function PreviewApp() {
  const [theme, setThemeState] = useState<Theme>("figma-light")

  useEffect(() => {
    setTheme(theme)
  }, [theme])

  const sampleTree = useMemo<Array<TreeNode>>(
    () => [
      {
        id: "group:1",
        title: "Tree (collapsible)",
        icon: <IconChevronDown16 />,
        children: [
          {
            id: "row:1",
            title: "First row",
            description: "Description",
            icon: <IconArrowDown16 />,
          },
          {
            id: "row:2",
            title: "Second row (strong)",
            titleStrong: true,
          },
        ],
      },
      { kind: "spacer", id: "spacer:1", height: 12 },
      { id: "flat:1", title: "Flat row (no children)" },
    ],
    []
  )

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <UtilityHeader
        title="Local Component Preview"
        left={
          <IconButton
            title="Toggle theme"
            onClick={() => setThemeState((t) => (t === "figma-light" ? "figma-dark" : "figma-light"))}
          >
            <IconHome16 />
          </IconButton>
        }
      />

      <div style={{ flex: 1, overflow: "auto" }}>
        <Container space="small">
          <Text style={{ fontWeight: 600 }}>Theme</Text>
          <VerticalSpace space="extraSmall" />
          <Text>Current: {theme}</Text>
          <VerticalSpace space="small" />
          <Button onClick={() => setThemeState("figma-light")}>Light</Button>
          <VerticalSpace space="extraSmall" />
          <Button onClick={() => setThemeState("figma-dark")}>Dark</Button>

          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="medium" />

          <Text style={{ fontWeight: 600 }}>UtilityCard</Text>
          <VerticalSpace space="extraSmall" />
          <UtilityCard
            title="View Colors Chain"
            description="Inspect selection to see full variable alias chains."
            icon={<IconChevronDown16 />}
            onClick={() => alert("UtilityCard clicked")}
          />

          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="medium" />

          <Text style={{ fontWeight: 600 }}>ButtonWithIcon</Text>
          <VerticalSpace space="extraSmall" />
          <ButtonWithIcon icon={<IconArrowDown16 />} onClick={() => alert("ButtonWithIcon clicked")}>
            Click me
          </ButtonWithIcon>

          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="medium" />

          <Text style={{ fontWeight: 600 }}>Tree</Text>
          <VerticalSpace space="extraSmall" />
          <Tree
            nodes={sampleTree}
            openById={{}}
            onToggle={() => {
              // This preview intentionally keeps Tree "always open" to show structure quickly.
            }}
          />

          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="medium" />

          <Text style={{ fontWeight: 600 }}>EmptyState</Text>
          <VerticalSpace space="extraSmall" />
          <div style={{ border: "1px solid var(--figma-color-border)", borderRadius: 8 }}>
            <EmptyState icon={<IconChevronDown16 />} title="Nothing here yet" description="This is a preview state." />
          </div>

          <VerticalSpace space="extraLarge" />
          <Text style={{ color: "var(--figma-color-text-secondary)" }}>
            Tip: add more cases to `src/preview/preview-app.tsx`.
          </Text>
          <VerticalSpace space="small" />
        </Container>
      </div>
    </div>
  )
}

