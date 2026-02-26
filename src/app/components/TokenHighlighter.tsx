import { h } from "preact"
import { TOKEN_REGEX, parseTokenSegments, classifyToken } from "./token-utils"

export function TokenHighlighter(props: { text: string }) {
  const { text } = props
  if (!text) return null

  const segments = parseTokenSegments(text)
  if (segments.length === 0) return null
  if (segments.length === 1 && segments[0].type === "text") {
    return <span>{segments[0].raw}</span>
  }

  return (
    <span style={{ wordBreak: "break-word" }}>
      {segments.map((seg, i) => {
        if (seg.type === "token") {
          const { style } = classifyToken(seg.inner)
          return (
            <span key={i} style={style}>
              {seg.label}
            </span>
          )
        }
        return seg.raw ? <span key={i}>{seg.raw}</span> : null
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
