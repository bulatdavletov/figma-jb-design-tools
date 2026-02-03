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
  if (styleId) await loadFontForTextStyleId(styleId)

  const colorVariableId = await resolveColorVariableForPreset(request.presetColor)
  const fills = colorVariableId ? [makeSolidPaintBoundToColorVariable(colorVariableId)] : null
  if (colorVariableId) {
    await setExplicitModeForColorVariableCollection(colorVariableId, request.forceModeName)
  }
  if (!fills) {
    // eslint-disable-next-line no-console
    console.log("[Mockup Markup] Apply: color preset not applied", { presetColor: request.presetColor })
  }

  let applied = 0
  let skipped = 0
  const changed: TextNode[] = []
  let firstError: string | null = null
  let typographyMissing = styleId === null

  for (let idx = 0; idx < textNodes.length; idx++) {
    const text = textNodes[idx]
    let didChange = false

    if (styleId) {
      try {
        await text.setTextStyleIdAsync(styleId)
        didChange = true
      } catch (e) {
        if (!firstError) firstError = e instanceof Error ? e.message : String(e)
      }
    }

    try {
      if (request.width400) {
        try {
          text.textAutoResize = "HEIGHT"
          text.resize(400, Math.max(1, text.height))
          didChange = true
        } catch {
          // ignore
        }
      }

      if (fills) {
        try {
          text.fills = fills
          didChange = true
        } catch (e) {
          if (!firstError) firstError = e instanceof Error ? e.message : String(e)
        }
      }
    } catch (e) {
      if (!firstError) firstError = e instanceof Error ? e.message : String(e)
    }

    if (didChange) {
      applied++
      changed.push(text)
    } else {
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
      ? `Applied markup to ${applied} text layer(s)${typographyMissing ? " (typography unavailable)" : ""}${
          skipped ? `, skipped ${skipped}` : ""
        }`
      : skipped
        ? `Nothing applied (skipped ${skipped})${firstError ? `. ${firstError}` : ""}`
        : "Nothing applied"
  )

  if (typographyMissing) {
    figma.notify(
      "Typography presets require importing Mockup markup text styles into this file (Assets → Libraries → Mockup markup)."
    )
  }

  return { applied, skipped }
}

