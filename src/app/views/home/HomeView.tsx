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
  Stack,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h } from "preact"

import { IconTarget16 } from "../../../../custom-icons/generated"
import { Page } from "../../components/Page"
import { ToolCard } from "../../components/ToolCard"
import { TOOLS_REGISTRY, type ActiveTool, type ToolCategory, type ToolRegistryEntry } from "../../tools-registry"

const sectionTitleStyle = { fontWeight: 600 } as const

const CATEGORY_ORDER: ToolCategory[] = ["General", "Variables Management"]

const ICON_BY_NAME: Record<ToolRegistryEntry["icon"], preact.ComponentChildren> = {
  "shape-text": <IconShapeText16 />,
  "variable-color": <IconVariableColor16 />,
  target: <IconTarget16 />,
  library: <IconLibrary16 />,
  text: <IconText16 />,
  folder: <IconFolder16 />,
  variable: <IconVariable16 />,
  link: <IconLink16 />,
  adjust: <IconAdjust16 />,
}

export function HomeView(props: { goTo: (route: ActiveTool) => void }) {
  return (
    <Page>
      <Container space="small">
        <VerticalSpace space="large" />
        {CATEGORY_ORDER.map((category) => {
          const categoryTools = TOOLS_REGISTRY
            .filter((tool) => tool.category === category)
            .sort((a, b) => a.order - b.order)

          return (
            <div key={category}>
              <Text style={sectionTitleStyle}>{category}</Text>
              <VerticalSpace space="small" />
              <Stack space="extraSmall">
                {categoryTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    title={tool.cardTitle}
                    description={tool.description}
                    icon={ICON_BY_NAME[tool.icon]}
                    onClick={() => props.goTo(tool.id)}
                  />
                ))}
              </Stack>
              <VerticalSpace space="large" />
            </div>
          )
        })}
      </Container>
    </Page>
  )
}
