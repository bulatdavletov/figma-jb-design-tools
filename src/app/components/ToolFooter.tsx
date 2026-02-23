import { h, toChildArray } from "preact"

/**
 * Sticky footer for tool views.
 *
 * Sits below `ToolBody` (inside `Page`), never scrolls.
 * `direction="row"` (default) lays children side-by-side with equal width.
 * `direction="column"` stacks them full-width (useful when mixing status text + buttons).
 */
export function ToolFooter(props: {
  children: preact.ComponentChildren
  direction?: "row" | "column"
}) {
  const dir = props.direction ?? "row"
  return (
    <div
      style={{
        borderTop: "1px solid var(--figma-color-border)",
        padding: "8px 12px",
        display: "flex",
        flexDirection: dir,
        gap: 8,
        flexShrink: 0,
      }}
    >
      {toChildArray(props.children).map((child, i) => (
        <div key={i} style={{ flex: 1, minWidth: 0 }}>
          {child}
        </div>
      ))}
    </div>
  )
}
