import { Container, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"

export function UtilityHeader(props: {
  title: string
  left?: preact.ComponentChildren
}) {
  return (
    <div>
      <Container space="small">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {props.left ? <div style={{ display: "flex", alignItems: "center" }}>{props.left}</div> : null}
          <Text style={{ fontWeight: 600 }}>{props.title}</Text>
        </div>
        <VerticalSpace space="small" />
      </Container>
    </div>
  )
}

