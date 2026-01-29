import { Container, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"

export function EmptyState(props: {
  icon: preact.ComponentChildren
  title: string
  description?: string
}) {
  return (
    <Container
      space="small"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "var(--figma-color-text-secondary)",
        padding: "24px 12px",
      }}
    >
      <div
        style={{
          color: "var(--figma-color-text-secondary)",
          transform: "scale(2)",
          transformOrigin: "50% 50%",
          lineHeight: 0,
        }}
      >
        {props.icon}
      </div>
      <VerticalSpace space="small" />
      <Text style={{ color: "var(--figma-color-text-secondary)" }}>{props.title}</Text>
      {props.description ? (
        <Fragment>
          <VerticalSpace space="extraSmall" />
          <Text style={{ color: "var(--figma-color-text-secondary)" }}>{props.description}</Text>
        </Fragment>
      ) : null}
    </Container>
  )
}

