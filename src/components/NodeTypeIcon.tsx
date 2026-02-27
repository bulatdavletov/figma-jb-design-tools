import { h } from "preact"

/**
 * Visual indicator for Figma object types.
 *
 * Matches Figma's native iconography:
 * - Color style (fill): solid filled circle
 * - Color style (stroke): outlined circle
 *
 * Extensible — add "variable", "text", "frame", etc. as needed.
 */

export type NodeTypeIconType = "colorStyleFill" | "colorStyleStroke"

export function NodeTypeIcon(props: {
  type: NodeTypeIconType
  color?: string
  size?: number
}) {
  const size = props.size ?? 12
  const color = props.color ?? "var(--figma-color-text-secondary)"

  if (props.type === "colorStyleFill") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6" cy="6" r="5" fill={color} />
      </svg>
    )
  }

  if (props.type === "colorStyleStroke") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="6" cy="6" r="4.25" stroke={color} stroke-width="3" />
      </svg>
    )
  }

  return null
}
