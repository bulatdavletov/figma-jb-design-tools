import { h } from "preact"

const removedStyle = {
  background: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#9f1239",
  borderRadius: 4,
  padding: "0 2px",
  fontWeight: 700,
} as const

const addedStyle = {
  background: "#ecfdf3",
  border: "1px solid #b7f0c9",
  color: "#067647",
  borderRadius: 4,
  padding: "0 2px",
  fontWeight: 700,
} as const

function splitDiff(before: string, after: string): {
  prefix: string
  beforeMid: string
  afterMid: string
  suffix: string
} {
  const a = String(before ?? "")
  const b = String(after ?? "")
  const min = Math.min(a.length, b.length)

  let start = 0
  while (start < min && a[start] === b[start]) start += 1

  let endA = a.length - 1
  let endB = b.length - 1
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA -= 1
    endB -= 1
  }

  return {
    prefix: a.slice(0, start),
    beforeMid: a.slice(start, endA + 1),
    afterMid: b.slice(start, endB + 1),
    suffix: a.slice(endA + 1),
  }
}

export function renderInlineDiff(before: string, after: string): {
  beforeNode: h.JSX.Element
  afterNode: h.JSX.Element
} {
  const { prefix, beforeMid, afterMid, suffix } = splitDiff(before, after)

  return {
    beforeNode: (
      <span>
        {prefix ? <span>{prefix}</span> : null}
        {beforeMid ? <span style={removedStyle}>{beforeMid}</span> : null}
        {suffix ? <span>{suffix}</span> : null}
      </span>
    ),
    afterNode: (
      <span>
        {prefix ? <span>{prefix}</span> : null}
        {afterMid ? <span style={addedStyle}>{afterMid}</span> : null}
        {suffix ? <span>{suffix}</span> : null}
      </span>
    ),
  }
}

