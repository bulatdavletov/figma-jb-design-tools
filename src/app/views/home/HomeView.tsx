import { Container, IconLink16, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"

import { UtilityCard } from "../../components/UtilityCard"
import { Page } from "../../components/Page"

type Route = "home" | "chain-inspector"

export function HomeView(props: { goTo: (route: Route) => void }) {
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

