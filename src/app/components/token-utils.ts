/**
 * Shared token parsing for TokenPill, TokenText, and TokenInput.
 * Tokens are {...} with optional prefix: $ (pipeline), # (snapshot), else property.
 */

export const TOKEN_REGEX = /(\{[^}]+\})/g

export type TokenCategory = "property" | "pipeline" | "snapshot"

export type TokenSegment =
  | { type: "text"; raw: string }
  | { type: "token"; raw: string; inner: string; category: TokenCategory; label: string }

export function classifyToken(inner: string): { label: string; category: TokenCategory } {
  if (inner.startsWith("$")) {
    return { label: inner.slice(1), category: "pipeline" }
  }
  if (inner.startsWith("#")) {
    const dotIdx = inner.indexOf(".")
    if (dotIdx > 0) {
      return {
        label: `${inner.slice(1, dotIdx)} › ${inner.slice(dotIdx + 1)}`,
        category: "snapshot",
      }
    }
    return { label: inner.slice(1), category: "snapshot" }
  }
  return { label: inner, category: "property" }
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
  return segments.map((s) => s.raw).join("")
}
