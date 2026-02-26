/**
 * Shared token parsing for TokenHighlighter and TokenInput.
 * Tokens are {...} with optional prefix: $ (pipeline), # (snapshot), else property.
 */

export const TOKEN_REGEX = /(\{[^}]+\})/g

export type TokenCategory = "property" | "pipeline" | "snapshot"

export type TokenSegment =
  | { type: "text"; raw: string }
  | { type: "token"; raw: string; inner: string; category: TokenCategory; label: string }

export type TokenStyle = {
  background: string
  border?: string
  color: string
  borderRadius: number
  padding: string
  fontFamily: string
  fontSize: string
  whiteSpace: string
}

const propertyTokenStyle: TokenStyle = {
  background: "#eef2ff",
  color: "#4338ca",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap",
}

const pipelineVarStyle: TokenStyle = {
  background: "#ecfdf3",
  color: "#067647",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap",
}

const snapshotRefStyle: TokenStyle = {
  background: "#fff7ed",
  color: "#9a3412",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap",
}

export function classifyToken(inner: string): {
  style: TokenStyle
  label: string
  category: TokenCategory
} {
  if (inner.startsWith("$")) {
    return { style: pipelineVarStyle, label: inner.slice(1), category: "pipeline" }
  }
  if (inner.startsWith("#")) {
    const dotIdx = inner.indexOf(".")
    if (dotIdx > 0) {
      return {
        style: snapshotRefStyle,
        label: `${inner.slice(1, dotIdx)} › ${inner.slice(dotIdx + 1)}`,
        category: "snapshot",
      }
    }
    return { style: snapshotRefStyle, label: inner.slice(1), category: "snapshot" }
  }
  return { style: propertyTokenStyle, label: inner, category: "property" }
}

/**
 * Split a string into text and token segments. Token segments include
 * the full {inner} raw form plus classified label and category.
 */
export function parseTokenSegments(value: string): TokenSegment[] {
  if (!value) return []
  const parts = value.split(TOKEN_REGEX)
  const segments: TokenSegment[] = []
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith("{") && part.endsWith("}")) {
      const inner = part.slice(1, -1)
      const { label, category } = classifyToken(inner)
      segments.push({ type: "token", raw: part, inner, category, label })
    } else {
      segments.push({ type: "text", raw: part })
    }
  }
  return segments
}

/**
 * Rebuild string from segments (e.g. after DOM sync). Text segments
 * use their raw value; token segments use segment.raw.
 */
export function segmentsToValue(segments: TokenSegment[]): string {
  return segments.map((s) => (s.type === "text" ? s.raw : s.raw)).join("")
}
