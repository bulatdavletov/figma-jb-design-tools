import {
  Container,
  IconLibrary16,
  IconLink16,
  IconShapeText16,
  IconText16,
  IconVariableColor16,
  IconVariable16,
  IconAdjust16,
  IconFolder16,
  IconPrototype16,
  Stack,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h } from "preact"

import { Page } from "../../components/Page"
import { ToolCard } from "../../components/ToolCard"
import { IconTarget16 } from "../../../../custom-icons/generated"

type Route =
  | "home"
  | "color-chain-tool"
  | "print-color-usages-tool"
  | "mockup-markup-tool"
  | "variables-batch-rename-tool"
  | "variables-export-import-tool"
  | "variables-create-linked-colors-tool"
  | "variables-replace-usages-tool"
  | "library-swap-tool"
  | "find-color-match-tool"
  | "automations-tool"

const sectionTitleStyle = { fontWeight: 600 } as const

export function HomeView(props: { goTo: (route: Route) => void }) {
  return (
    <Page>
      <Container space="small">

        <VerticalSpace space="large" />
            <Text style={sectionTitleStyle}>General</Text>
            <VerticalSpace space="small" />

          <Stack space="extraSmall">
            <ToolCard
              title="Mockup Markup Quick Apply"
              description="Apply text styles and colors"
              icon={<IconShapeText16 />}
              onClick={() => props.goTo("mockup-markup-tool")}
            />
            <ToolCard
              title="View Colors Chain"
              description="Inspect selection to see full variable alias chains"
              icon={<IconVariableColor16 />}
              onClick={() => props.goTo("color-chain-tool")}
            />
            <ToolCard
              title="Find Color Match in Islands"
              description="Find the closest variable for unbound colors"
              icon={<IconTarget16 />}
              onClick={() => props.goTo("find-color-match-tool")}
            />
            <ToolCard
              title="Library Swap"
              description="Swap component instances from old libraries to new ones"
              icon={<IconLibrary16 />}
              onClick={() => props.goTo("library-swap-tool")}
            />
            <ToolCard
              title="Automations"
              description="Create and run sequential automation workflows"
              icon={<IconPrototype16 />}
              onClick={() => props.goTo("automations-tool")}
            />
          </Stack>
          
          <VerticalSpace space="large" />
            <Text style={sectionTitleStyle}>Variables Management</Text>
            <VerticalSpace space="small" />
          
          <Stack space="extraSmall">
            <ToolCard
              title="Print Color Usages"
              description="Print unique colors as text labels near selection"
              icon={<IconText16 />}
              onClick={() => props.goTo("print-color-usages-tool")}
            />
            <ToolCard
              title="Export / Import"
              description="Export variable collections to JSON, import from backup"
              icon={<IconFolder16 />}
              onClick={() => props.goTo("variables-export-import-tool")}
            />
            <ToolCard
              title="Rename via JSON"
              description="Rename multiple variables using a JSON file"
              icon={<IconVariable16 />}
              onClick={() => props.goTo("variables-batch-rename-tool")}
            />
            <ToolCard
              title="Create Linked Colors"
              description="Create new color variables or rename existing ones"
              icon={<IconLink16 />}
              onClick={() => props.goTo("variables-create-linked-colors-tool")}
            />
            <ToolCard
              title="Replace Usages"
              description="Replace variable bindings in selection with different variables"
              icon={<IconAdjust16 />}
              onClick={() => props.goTo("variables-replace-usages-tool")}
            />
          </Stack>
        <VerticalSpace space="small" />
      </Container>
    </Page>
  )
}

