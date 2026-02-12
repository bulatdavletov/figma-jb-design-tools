import { IconChevronRight16 } from "./AppIcons"
import { h } from "preact"
import { useState } from "preact/hooks"

export function ToolCard(props: {
  title: string
  description: string
  icon: preact.ComponentChildren
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <button
      type="button"
      onClick={props.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px 4px 4px",
        borderRadius: 6,
        background: hovered ? "var(--figma-color-bg-hover)" : "var(--figma-color-bg)",
        cursor: "pointer",
        textAlign: "left",
        outline: focused ? "2px solid var(--figma-color-border-selected)" : "none",
        outlineOffset: 1,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "color-mix(in srgb, var(--figma-color-bg-tertiary) 80%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "var(--figma-color-icon-hover)" : "var(--figma-color-icon)",
          flex: "0 0 auto",
        }}
      >
        <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {props.icon}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--figma-color-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.title}
        </div>
        <div
          style={{
            marginTop: 1,
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.description}
        </div>
      </div>

      <div
        style={{
          width: 16,
          height: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "var(--figma-color-icon-tertiary-hover)" : "var(--figma-color-icon-tertiary)",
          flex: "0 0 auto",
        }}
        aria-hidden="true"
      >
        <IconChevronRight16 />
      </div>
    </button>
  )
}

