import type { MockupMarkupApplyRequest } from "../../messages"
import {
  resolveTextStyleIdForPreset,
  loadFontForTextStyleId,
  makeSolidPaintBoundToColorVariable,
  resolveColorVariableForPreset,
  setExplicitModeForColorVariableCollection,
} from "./resolve"

function collectTextNodesRecursivelyFromSelection(selection: readonly SceneNode[]): TextNode[] {
  const result: TextNode[] = []
  const seen = new Set<string>()

  const add = (node: SceneNode) => {
    if (node.type !== "TEXT") return
    if (seen.has(node.id)) return
    seen.add(node.id)
    result.push(node as TextNode)
  }

  const walk = (node: SceneNode) => {
    add(node)
    if (!("children" in node)) return
    const children = (node as any).children as SceneNode[] | undefined
    if (!children || !Array.isArray(children)) return
    for (const child of children) {
      walk(child)
    }
  }

  for (const root of selection) {
    walk(root)
  }

  return result
}

export async function applyMockupMarkupToSelection(request: MockupMarkupApplyRequest): Promise<{
  applied: number
  skipped: number
}> {
  const selection = figma.currentPage.selection
  if (selection.length === 0) {
    figma.notify("Select a text layer (or a frame with text) first")
    return { applied: 0, skipped: 0 }
  }

  const textNodes = collectTextNodesRecursivelyFromSelection(selection)
  if (textNodes.length === 0) {
    figma.notify("No text layers found in selection")
    return { applied: 0, skipped: 0 }
  }

  const styleId = await resolveTextStyleIdForPreset(request.presetTypography)
  await loadFontForTextStyleId(styleId)

  const colorVariableId = await resolveColorVariableForPreset(request.presetColor)
  const fills = colorVariableId ? [makeSolidPaintBoundToColorVariable(colorVariableId)] : null
  if (request.forceModeName === "dark" && colorVariableId) {
    await setExplicitModeForColorVariableCollection(colorVariableId, "dark")
  }
  if (!fills) {
    // eslint-disable-next-line no-console
    console.log("[Mockup Markup] Apply: color preset not applied", { presetColor: request.presetColor })
  }

  let applied = 0
  let skipped = 0
  const changed: TextNode[] = []

  for (let idx = 0; idx < textNodes.length; idx++) {
    const text = textNodes[idx]
    try {
      await text.setTextStyleIdAsync(styleId)
      const len = (text.characters ?? "").length
      if (len > 0) await text.setRangeTextStyleIdAsync(0, len, styleId)

      if (request.width400) {
        try {
          ;(text as any).textAutoResize = "HEIGHT"
          text.resize(400, text.height)
        } catch {
          // ignore
        }
      }

      if (fills) text.fills = fills

      applied++
      changed.push(text)
    } catch {
      skipped++
    }
  }

  if (applied > 0) {
    figma.currentPage.selection = changed
    try {
      figma.viewport.scrollAndZoomIntoView([changed[0]])
    } catch {
      // ignore
    }
  }

  figma.notify(
    applied > 0
      ? `Applied markup to ${applied} text layer(s)${skipped ? `, skipped ${skipped}` : ""}`
      : skipped
        ? `Nothing applied (skipped ${skipped})`
        : "Nothing applied"
  )

  return { applied, skipped }
}

