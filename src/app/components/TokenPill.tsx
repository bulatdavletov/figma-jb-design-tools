import { h } from "preact"
import type { JSX } from "preact"
import { TOKEN_REGEX, parseTokenSegments, classifyToken } from "./token-utils"

/** Single neutral token style for all token types (theme-aware, no color coding). */
export const neutralTokenStyle: JSX.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  verticalAlign: "middle",
  padding: "0 4px",
  borderRadius: "4px",
  fontSize: "11px",
  lineHeight: "16px",
  whiteSpace: "nowrap",
  backgroundColor: "var(--figma-color-bg-primary)",
  color: "var(--figma-color-text)",
  border: "1px solid var(--figma-color-border)",
}

/** Selected token: caret is touching this token — same pill, distinct blue border. */
export const selectedTokenStyle: JSX.CSSProperties = {
  ...neutralTokenStyle,
  border: "1px solid var(--figma-color-border-selected)",
  backgroundColor: "var(--figma-color-bg-selected)",
}

/**
 * Convert a camelCase JSX.CSSProperties object to a CSS string
 * for use with element.style.cssText (direct DOM manipulation).
 * Preact's <span style={obj}> handles this internally, but
 * document.createElement + Object.assign(el.style, obj) does NOT
 * reliably set all properties on CSSStyleDeclaration.
 */
function toCssText(style: JSX.CSSProperties): string {
  return Object.entries(style)
    .map(([key, val]) => {
      const prop = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
      return `${prop}:${val}`
    })
    .join(";")
}

export const neutralTokenCssText = toCssText(neutralTokenStyle)
export const selectedTokenCssText = toCssText(selectedTokenStyle)

export type TokenPillProps = {
  label: string
  selected?: boolean
}

export function TokenPill(props: TokenPillProps) {
  const { label, selected = false } = props
  const style = selected ? selectedTokenStyle : neutralTokenStyle
  return <span style={style}>{label}</span>
}

/**
 * Parse a string and render tokens as TokenPills inline with plain text.
 * Drop-in replacement for TokenHighlighter.
 */
export function TokenText(props: { text: string }) {
  const { text } = props
  if (!text) return null

  const segments = parseTokenSegments(text)
  if (segments.length === 0) return null
  if (segments.length === 1 && segments[0].type === "text") {
    return <span>{segments[0].raw}</span>
  }

  return (
    <span style={{ wordBreak: "break-word" }}>
      {segments.map((seg, i) =>
        seg.type === "token"
          ? <TokenPill key={i} label={seg.label} />
          : seg.raw ? <span key={i}>{seg.raw}</span> : null
      )}
    </span>
  )
}

export function stripTokenSyntax(text: string): string {
  return text.replace(TOKEN_REGEX, (match) => {
    const inner = match.slice(1, -1)
    return classifyToken(inner).label
  })
}
