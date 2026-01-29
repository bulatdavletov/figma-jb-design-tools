import { h } from "preact"

export function Page(props: { children: preact.ComponentChildren }) {
  return (
    <div
      style={{
        // In some builds the iframe/body may not set an explicit height,
        // so `height: 100%` can collapse to 0 and render an "empty" UI.
        // `100vh` is stable inside the plugin iframe.
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {props.children}
    </div>
  )
}

