import { h } from "preact"
import type { JSX } from "preact"

/** Single neutral token style for all token types (theme-aware, no color coding). */
export const neutralTokenStyle: JSX.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  verticalAlign: "baseline",
  padding: "0 4px",
  borderRadius: "4px",
  whiteSpace: "nowrap",
  backgroundColor: "var(--figma-color-bg-primary)",
  color: "var(--figma-color-text)",
  border: "1px solid var(--figma-color-border)",
  marginTop: "2px",
}

/** Selected token: caret is touching this token — same pill, distinct blue border. */
export const selectedTokenStyle: JSX.CSSProperties = {
  ...neutralTokenStyle,
  border: "1px solid var(--figma-color-border-selected)",
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
