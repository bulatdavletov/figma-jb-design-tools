import { Container, IconLink16, IconText16, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"

import { Page } from "../../components/Page"
import { ToolCard } from "../../components/ToolCard"

type Route = "home" | "color-chain-tool" | "print-color-usages-tool"

export function HomeView(props: { goTo: (route: Route) => void }) {
  return (
    <Page>
      <Container space="small">
        <VerticalSpace space="small" />
        <Text>Colors</Text>
        <VerticalSpace space="small" />
        <ToolCard
          title="View Colors Chain"
          description="Inspect selection to see full variable alias chains."
          icon={<IconLink16 />}
          onClick={() => props.goTo("color-chain-tool")}
        />
        <VerticalSpace space="small" />
        <ToolCard
          title="Print Color Usages"
          description="Print unique colors as text labels near selection."
          icon={<IconText16 />}
          onClick={() => props.goTo("print-color-usages-tool")}
        />
      </Container>
    </Page>
  )
}

