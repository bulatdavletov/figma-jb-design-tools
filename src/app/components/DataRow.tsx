import { h, ComponentChildren } from "preact"
import { useState } from "preact/hooks"
import { Checkbox, IconButton } from "@create-figma-plugin/ui"

export type DataRowAction = {
  icon: ComponentChildren
  title: string
  onClick: () => void
}

export type DataRowProps = {
  /** Main content (bold or normal). */
  primary: string | ComponentChildren
  /** Below primary, grey/smaller text. */
  secondary?: string | ComponentChildren
  /** Below secondary, even lighter. */
  tertiary?: string | ComponentChildren
  /** Right-side icon buttons, visible on hover. */
  actions?: DataRowAction[]
  /** Always-visible content on the right side (e.g. CopyIconButton). */
  trailing?: ComponentChildren
  /** Optional left checkbox. */
  checkbox?: { checked: boolean; onChange: (v: boolean) => void }
  /** Clickable row body (cursor: pointer). */
  onClick?: () => void
  /** Warning/info block below content (for mismatch warnings). */
  alert?: string | ComponentChildren
}

/**
 * A single row inside a DataList.
 *
 * Supports primary/secondary/tertiary text, optional checkbox,
 * hover actions, click handler, and an alert block.
 */
export function DataRow(props: DataRowProps) {
  const [hovered, setHovered] = useState(false)
  const hasActions = props.actions && props.actions.length > 0

  const hasSecondary = props.secondary != null
  const hasTertiary = props.tertiary != null

  // Plain <div> elements are used instead of the library's `Text` component
  // because `Text` applies `::before { margin-top: -9px }` and
  // `transform: translateY(4px)` for font-metric alignment, which collapses
  // vertical spacing between items (gap, marginTop, etc become invisible).

  const content = (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Primary */}
      {typeof props.primary === "string" ? (
        <div
          style={{
            color: "var(--figma-color-text)",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            lineHeight: "20px",
          }}
        >
          {props.primary}
        </div>
      ) : (
        props.primary
      )}

      {/* Secondary */}
      {hasSecondary ? (
        typeof props.secondary === "string" ? (
          <div
            style={{
              color: "var(--figma-color-text-secondary)",
              fontSize: 11,
              lineHeight: "16px",
              wordBreak: "break-all",
            }}
          >
            {props.secondary}
          </div>
        ) : (
          props.secondary
        )
      ) : null}

      {/* Tertiary */}
      {hasTertiary ? (
        typeof props.tertiary === "string" ? (
          <div
            style={{
              color: "var(--figma-color-text-tertiary)",
              fontSize: 11,
              lineHeight: "16px",
              wordBreak: "break-word",
            }}
          >
            {props.tertiary}
          </div>
        ) : (
          props.tertiary
        )
      ) : null}

      {/* Alert */}
      {props.alert != null ? (
        <div
          style={{
            padding: "6px 8px",
            borderRadius: 4,
            background: "var(--figma-color-bg-warning-tertiary, #fff8e1)",
            border: "1px solid var(--figma-color-border-warning, #ffd54f)",
          }}
        >
          {typeof props.alert === "string" ? (
            <div
              style={{
                color: "var(--figma-color-text-warning)",
                fontSize: 11,
                lineHeight: "16px",
                wordBreak: "break-word",
              }}
            >
              {props.alert}
            </div>
          ) : (
            props.alert
          )}
        </div>
      ) : null}
    </div>
  )

  return (
    /* Wrapper div for the entire row*/
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={props.onClick}
      style={{
        padding: "4px 8px",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        cursor: props.onClick ? "pointer" : "default",
        background: hovered
          ? "color-mix(in srgb, var(--figma-color-bg-hover) 50%, transparent)"
          : "transparent",
        transition: "background-color 120ms ease",
      }}
    >
      {props.checkbox ? (
        <div style={{ flexShrink: 0, paddingTop: 2 }}>
          <Checkbox
            value={props.checkbox.checked}
            onValueChange={props.checkbox.onChange}
          >
            <span />
          </Checkbox>
        </div>
      ) : null}

      {content}

      {hasActions ? (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? "auto" : "none",
            transition: "opacity 120ms ease",
          }}
        >
          {props.actions!.map((action, i) => (
            <IconButton
              key={i}
              title={action.title}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                action.onClick()
              }}
            >
              {action.icon}
            </IconButton>
          ))}
        </div>
      ) : null}

      {props.trailing != null ? (
        <div style={{ flexShrink: 0, paddingTop: 2 }}>{props.trailing}</div>
      ) : null}
    </div>
  )
}
