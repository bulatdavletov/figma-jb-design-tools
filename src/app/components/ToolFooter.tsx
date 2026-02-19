import { h, toChildArray } from "preact"

/**
 * Sticky footer for tool views.
 *
 * Sits below `ToolBody` (inside `Page`), never scrolls.
 * Every direct child is wrapped in a full-width container so buttons
 * (which use the library's `fullWidth` prop) stretch edge-to-edge.
 */
export function ToolFooter(props: { children: preact.ComponentChildren }) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--figma-color-border)",
        padding: "8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flexShrink: 0,
      }}
    >
      {toChildArray(props.children).map((child, i) => (
        <div key={i} style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: 1, minWidth: 0 }}>{child}</div>
        </div>
      ))}
    </div>
  )
}
