import { Container, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"

export type ToolBodyMode = "content" | "state"

/**
 * Standard tool body layout:
 * - fills the remaining page height under header
 * - scrollable for content, non-scrollable for states
 * - provides consistent padding via Container
 */
export function ToolBody(props: {
  /**
   * Preferred API. Use `mode="state"` for empty/loading/nothing-found screens.
   * (Legacy `scroll` prop is still supported for now.)
   */
  mode?: ToolBodyMode
  /** @deprecated Prefer `mode`. */
  scroll?: boolean
  children: preact.ComponentChildren
}) {
  const resolvedScroll =
    typeof props.mode !== "undefined" ? props.mode === "content" : (props.scroll ?? true)
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: resolvedScroll ? "auto" : "hidden",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container
        space="small"
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <VerticalSpace space="medium" />
        {props.children}
        <VerticalSpace space="medium" />
      </Container>
    </div>
  )
}

