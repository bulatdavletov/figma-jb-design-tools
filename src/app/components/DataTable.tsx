import { h, ComponentChildren } from "preact"
import { Text } from "@create-figma-plugin/ui"

export type DataTableColumn = {
  label: string
  width?: string | number
}

export type DataTableProps = {
  /** Column definitions. */
  columns: DataTableColumn[]
  /** <tr> elements as children. */
  children: ComponentChildren
  /** Small label above the table. */
  header?: string
  /** Summary line below header. */
  summary?: string | ComponentChildren
}

/**
 * A shared table container for columnar data (Variables tools).
 *
 * Shares the same outer styling as DataList (border, radius) but renders
 * a `<table>` with a sticky header row.
 *
 * Intended to be adopted by Replace Usages, Batch Rename, Export/Import
 * in follow-up work.
 */
export function DataTable(props: DataTableProps) {
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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              {props.columns.map((col, i) => (
                <th
                  key={i}
                  style={{
                    borderBottom: "1px solid var(--figma-color-border)",
                    textAlign: "left",
                    padding: "6px 8px",
                    position: "sticky",
                    top: 0,
                    background: "var(--figma-color-bg-secondary)",
                    fontWeight: 500,
                    fontSize: 11,
                    color: "var(--figma-color-text-secondary)",
                    ...(col.width != null ? { width: col.width } : {}),
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{props.children}</tbody>
        </table>
      </div>
    </div>
  )
}
