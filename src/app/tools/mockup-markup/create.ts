import type { MockupMarkupApplyRequest } from "../../messages"
import {
  resolveTextStyleIdForPreset,
  loadFontForTextStyleId,
  makeSolidPaintBoundToColorVariable,
  resolveColorVariableForPreset,
  setExplicitModeForColorVariableCollection,
} from "./resolve"

export async function createMockupMarkupText(request: MockupMarkupApplyRequest): Promise<TextNode> {
  const text = figma.createText()

  // Ensure the node has a loaded font so setting characters won't fail even if
  // applying the desired text style fails (e.g. style not available/importable).
  try {
    const fontName = text.fontName as FontName
    if (fontName) await figma.loadFontAsync(fontName)
  } catch {
    // ignore
  }

  // Place at viewport center.
  const center = figma.viewport.center
  text.x = center.x
  text.y = center.y

  const styleId = await resolveTextStyleIdForPreset(request.presetTypography)
  if (styleId) {
    await loadFontForTextStyleId(styleId)
    try {
      await text.setTextStyleIdAsync(styleId)
    } catch {
      // ignore; may still allow characters set
    }
  }

  // Must load a font before setting characters; style font load above should cover it.
  try {
    try {
      const fontName = text.fontName as FontName
      if (fontName) await figma.loadFontAsync(fontName)
    } catch {
      // ignore
    }
    text.characters = "Text"
  } catch {
    // ignore
  }

  if (request.width400) {
    try {
      // Fixed width with auto height.
      text.textAutoResize = "HEIGHT"
      text.resize(400, Math.max(1, text.height))
    } catch {
      // ignore
    }
  }

  const variableId = await resolveColorVariableForPreset(request.presetColor)
  if (variableId) {
    await setExplicitModeForColorVariableCollection(variableId, request.forceModeName)
    text.fills = [makeSolidPaintBoundToColorVariable(variableId)]
  } else {
    // eslint-disable-next-line no-console
    console.log("[Mockup Markup] Create text: color preset not applied", { presetColor: request.presetColor })
  }

  figma.currentPage.selection = [text]
  figma.viewport.scrollAndZoomIntoView([text])

  if (!styleId) {
    figma.notify(
      "Typography couldn’t be applied. Import Mockup markup text styles into this file (Assets → Libraries → Mockup markup)."
    )
  }
  return text
}

