import "@create-figma-plugin/ui/css/base.css"
import "@create-figma-plugin/ui/css/fonts.css"
import "@create-figma-plugin/ui/css/theme.css"

import { h, render } from "preact"

import { IsolatedToolView } from "./IsolatedToolView"
import { PreviewApp } from "./preview-app"

const params = new URLSearchParams(window.location.search)
const isIsolated = params.get("isolated") === "1"

render(
  isIsolated ? <IsolatedToolView /> : <PreviewApp />,
  document.getElementById("root")!
)

