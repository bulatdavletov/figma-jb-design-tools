import { Textbox } from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"
import { useState } from "preact/hooks"

import { ACTION_CATEGORIES, ACTION_DEFINITIONS, getActionsByCategory, getValueKindBgColor, getValueKindColor, getValueKindLabel } from "../types"
import type { ActionType, ActionDefinition } from "../types"

export function ActionPickerPanel(props: { onSelect: (type: ActionType) => void }) {
  const [search, setSearch] = useState("")
  const query = search.toLowerCase().trim()

  const filteredCategories = ACTION_CATEGORIES.map((cat) => {
    const actions = getActionsByCategory(cat.key).filter(
      (def) =>
        !query ||
        def.label.toLowerCase().includes(query) ||
        def.description.toLowerCase().includes(query) ||
        def.type.toLowerCase().includes(query),
    )
    return { ...cat, actions }
  }).filter((cat) => cat.actions.length > 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg-secondary)",
        }}
      >
        <Textbox
          value={search}
          onValueInput={setSearch}
          placeholder="Search actions..."
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredCategories.length === 0 && (
          <div
            style={{
              padding: "24px 12px",
              fontSize: 11,
              color: "var(--figma-color-text-tertiary)",
              textAlign: "center",
            }}
          >
            No actions matching "{search}"
          </div>
        )}
        {filteredCategories.map((cat) => (
          <Fragment key={cat.key}>
            <div
              style={{
                padding: "8px 12px 4px 12px",
                fontSize: 10,
                fontWeight: 600,
                color: "var(--figma-color-text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {cat.label}
            </div>
            {cat.actions.map((def) => (
              <ActionPickerRow
                key={def.type}
                def={def}
                onSelect={() => props.onSelect(def.type)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function ActionPickerRow(props: { def: ActionDefinition; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={props.onSelect}
      style={{
        padding: "6px 12px",
        cursor: "pointer",
        background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: "var(--figma-color-text)" }}>{props.def.label}</span>
        {props.def.inputType && (
          <span style={{
            fontSize: 8,
            color: getValueKindColor(props.def.inputType),
            opacity: 0.7,
          }}>
            {getValueKindLabel(props.def.inputType)} →
          </span>
        )}
        {props.def.outputType && (
          <span style={{
            fontSize: 8,
            color: getValueKindColor(props.def.outputType),
            background: getValueKindBgColor(props.def.outputType),
            padding: "0px 3px",
            borderRadius: 2,
          }}>
            {getValueKindLabel(props.def.outputType)}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--figma-color-text-secondary)",
          marginTop: 1,
        }}
      >
        {props.def.description}
      </div>
    </div>
  )
}

const _ensureTreeShaken = ACTION_DEFINITIONS
