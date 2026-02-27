import {
  Container,
  Stack,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h } from "preact"

import { Page } from "../components/Page"
import { ToolCard } from "../components/ToolCard"
import { TOOL_ICONS } from "../tools-registry/tools-registry-icons-import"
import { TOOLS_REGISTRY, type ActiveTool, type ToolCategory } from "../tools-registry/tools-registry"

const sectionTitleStyle = { fontWeight: 600 } as const

const CATEGORY_ORDER: ToolCategory[] = ["General", "Variables Management"]

export function HomeView(props: { goTo: (route: ActiveTool) => void }) {
  return (
    <Page>
      <Container space="small">
        <VerticalSpace space="large" />
        {CATEGORY_ORDER.map((category) => {
          const categoryTools = TOOLS_REGISTRY.filter(
            (tool) => tool.category === category
          )

          return (
            <div key={category}>
              <Text style={sectionTitleStyle}>{category}</Text>
              <VerticalSpace space="small" />
              <Stack space="extraSmall">
                {categoryTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    title={tool.cardTitle}
                    //description={tool.description} // Decided to try without description for cleaner look
                    icon={TOOL_ICONS[tool.icon]}
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
