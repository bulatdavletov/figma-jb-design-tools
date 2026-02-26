import { Container, Divider, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"

export function ToolHeader(props: { title: string; left?: preact.ComponentChildren }) {
  return (
    <div>
      {/* Use native Container inset for header content */}
      <Container space="small">
        <VerticalSpace space="extraSmall" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {props.left ? <div style={{ display: "flex", alignItems: "center" }}>{props.left}</div> : null}
          <Text style={{ fontWeight: 600 }}>{props.title}</Text>
        </div>
        <VerticalSpace space="extraSmall" />
      </Container>
      {/* Divider is full-width (outside container inset) */}
      <Divider />
    </div>
  )
}

