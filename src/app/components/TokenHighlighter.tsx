import { h, Fragment } from "preact"

type TokenStyle = {
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
  // border: "1px solidrgb(66, 102, 244)",
  color: "#4338ca",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap",
}

const pipelineVarStyle: TokenStyle = {
  background: "#ecfdf3",
  // border: "1px solidrgb(84, 220, 127)",
  color: "#067647",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap",
}

const snapshotRefStyle: TokenStyle = {
  background: "#fff7ed",
  // border: "1px solidrgb(231, 161, 82)",
  color: "#9a3412",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap",
}

function classifyToken(raw: string): { style: TokenStyle; label: string } {
  if (raw.startsWith("$")) {
    return { style: pipelineVarStyle, label: raw.slice(1) }
  }
  if (raw.startsWith("#")) {
    const dotIdx = raw.indexOf(".")
    if (dotIdx > 0) {
      return {
        style: snapshotRefStyle,
        label: `${raw.slice(1, dotIdx)} › ${raw.slice(dotIdx + 1)}`,
      }
    }
    return { style: snapshotRefStyle, label: raw.slice(1) }
  }
  return { style: propertyTokenStyle, label: raw }
}

const TOKEN_REGEX = /(\{[^}]+\})/g

export function TokenHighlighter(props: { text: string }) {
  const { text } = props
  if (!text) return null

  const parts = text.split(TOKEN_REGEX)
  if (parts.length === 1) return <span>{text}</span>

  return (
    <span style={{ wordBreak: "break-word" }}>
      {parts.map((part, i) => {
        if (part.startsWith("{") && part.endsWith("}")) {
          const inner = part.slice(1, -1)
          const { style, label } = classifyToken(inner)
          return (
            <span key={i} style={style}>
              {label}
            </span>
          )
        }
        return part ? <span key={i}>{part}</span> : null
      })}
    </span>
  )
}

export function highlightTokens(text: string): h.JSX.Element {
  return <TokenHighlighter text={text} />
}

export function stripTokenSyntax(text: string): string {
  return text.replace(TOKEN_REGEX, (match) => {
    const inner = match.slice(1, -1)
    return classifyToken(inner).label
  })
}
