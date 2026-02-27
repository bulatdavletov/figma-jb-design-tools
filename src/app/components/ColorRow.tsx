import { h } from "preact"
import { useState } from "preact/hooks"
import { IconButton } from "@create-figma-plugin/ui"

export type ColorRowAction = {
  id: string
  label: string
  onClick?: () => void | Promise<void>
  icon?: preact.ComponentChildren
  kind?: "iconButton" | "button" | "custom"
  component?: preact.ComponentChildren
  disabled?: boolean
}

export function ColorRow(props: {
  title: string
  icon?: preact.ComponentChildren
  description?: string
  titleStrong?: boolean
  actions?: Array<ColorRowAction>
}) {
  const [hovered, setHovered] = useState(false)
  const actions = Array.isArray(props.actions) ? props.actions : []
  const hasActions = actions.length > 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 28,
        paddingLeft: 4,
        paddingRight: 4,
        userSelect: "none",
        borderRadius: 4,
        backgroundColor: hovered ? "color-mix(in srgb, var(--figma-color-bg-hover) 50%, transparent)" : "transparent",
        transition: "background-color 120ms ease",
      }}
    >
      <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {props.icon ?? null}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--figma-color-text)",
            fontWeight: props.titleStrong ? 600 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.title}
        </div>
      </div>

      {props.description ? (
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.description}
        </div>
      ) : null}

      {hasActions ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            flexShrink: 0,
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? "auto" : "none",
            transition: "opacity 120ms ease",
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {actions.map((action) =>
            action.kind === "custom" ? (
              <span key={action.id}>{action.component}</span>
            ) : action.kind === "button" ? (
              <button
                key={action.id}
                type="button"
                disabled={action.disabled === true}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (action.disabled) return
                  void action.onClick?.()
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                title={action.label}
                style={{
                  height: 20,
                  padding: "0 6px",
                  whiteSpace: "nowrap",
                  border: "1px solid var(--figma-color-border)",
                  background: "var(--figma-color-bg)",
                  color: "var(--figma-color-text)",
                  borderRadius: 4,
                  fontSize: 10,
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: action.disabled ? "not-allowed" : "pointer",
                  opacity: action.disabled ? 0.5 : 1,
                }}
              >
                {action.label}
              </button>
            ) : (
              <IconButton
                key={action.id}
                disabled={action.disabled === true}
                title={action.label}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (action.disabled) return
                  void action.onClick?.()
                }}
              >
                {action.icon ?? action.label}
              </IconButton>
            )
          )}
        </div>
      ) : null}
    </div>
  )
}
