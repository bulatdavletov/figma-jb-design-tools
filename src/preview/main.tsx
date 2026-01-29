import "@create-figma-plugin/ui/css/base.css"
import "@create-figma-plugin/ui/css/fonts.css"
import "@create-figma-plugin/ui/css/theme.css"

import { h, render } from "preact"

import { PreviewApp } from "./preview-app"

render(<PreviewApp />, document.getElementById("root")!)

