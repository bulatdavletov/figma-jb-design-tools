import { h, Fragment } from "preact"

const propertyTokenStyle = {
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  color: "#4338ca",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap" as const,
} as const

const pipelineVarStyle = {
  background: "#ecfdf3",
  border: "1px solid #b7f0c9",
  color: "#067647",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap" as const,
} as const

const snapshotRefStyle = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#9a3412",
  borderRadius: 4,
  padding: "0 3px",
  fontFamily: "monospace",
  fontSize: "0.9em",
  whiteSpace: "nowrap" as const,
} as const

function getTokenStyle(token: string) {
  if (token.startsWith("$")) return pipelineVarStyle
  if (token.startsWith("#")) return snapshotRefStyle
  return propertyTokenStyle
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
          return (
            <span key={i} style={getTokenStyle(inner)}>
              {part}
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
