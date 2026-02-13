import { h, ComponentChildren, toChildArray } from "preact"
import { Text } from "@create-figma-plugin/ui"

export type DataListProps = {
  /** Small label above the list (e.g. "Will be printed", "Changes found"). */
  header?: string
  /** Summary line below header (e.g. "Candidates: 5 | Changed: 3"). */
  summary?: string | ComponentChildren
  /** The rows (any JSX). */
  children: ComponentChildren
  /** Shown when there are no children. */
  emptyText?: string
}

/**
 * A shared container for card-style data lists.
 *
 * Provides consistent borders, radius, row separators, and optional
 * header / summary / empty state.
 */
export function DataList(props: DataListProps) {
  const children = toChildArray(props.children).filter(Boolean)
  const isEmpty = children.length === 0

  return (
    <div>
      {props.header ? (
        <Text
          style={{
            color: "var(--figma-color-text-secondary)",
            fontSize: 11,
            lineHeight: "16px",
            marginBottom: 6,
          }}
        >
          {props.header}
        </Text>
      ) : null}

      {props.summary ? (
        <div style={{ marginBottom: 6 }}>
          {typeof props.summary === "string" ? (
            <Text
              style={{
                color: "var(--figma-color-text-tertiary)",
                fontSize: 11,
                lineHeight: "16px",
              }}
            >
              {props.summary}
            </Text>
          ) : (
            props.summary
          )}
        </div>
      ) : null}

      <div
        style={{
          border: "1px solid var(--figma-color-border)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {isEmpty ? (
          <div style={{ padding: 10 }}>
            <Text style={{ color: "var(--figma-color-text-tertiary)" }}>
              {props.emptyText ?? "No items"}
            </Text>
          </div>
        ) : (
          children.map((child, index) => (
            <div
              key={index}
              style={{
                borderTop:
                  index === 0
                    ? "none"
                    : "1px solid var(--figma-color-border-secondary)",
              }}
            >
              {child}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
