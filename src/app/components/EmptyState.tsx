import { Container, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"

export function EmptyState(props: {
  icon?: preact.ComponentChildren
  title: string
  description?: string
  tone?: "muted" | "default"
}) {
  const tone = props.tone ?? "muted"
  const textColor = tone === "default" ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)"

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
        color: textColor,
        padding: "24px 12px",
      }}
    >
      {props.icon ? (
        <Fragment>
          <div
            style={{
              color: textColor,
              transform: "scale(2)",
              transformOrigin: "50% 50%",
              lineHeight: 0,
            }}
          >
            {props.icon}
          </div>
          <VerticalSpace space="medium" />
        </Fragment>
      ) : null}
      <Text style={{ color: textColor }}>{props.title}</Text>
      {props.description ? (
        <Fragment>
          <VerticalSpace space="extraSmall" />
          <Text style={{ color: textColor }}>{props.description}</Text>
        </Fragment>
      ) : null}
    </Container>
  )
}

