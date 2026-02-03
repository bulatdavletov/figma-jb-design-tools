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

  // Place at viewport center.
  const center = figma.viewport.center
  text.x = center.x
  text.y = center.y

  const styleId = await resolveTextStyleIdForPreset(request.presetTypography)
  await loadFontForTextStyleId(styleId)
  try {
    await text.setTextStyleIdAsync(styleId)
  } catch {
    // ignore; may still allow characters set
  }

  // Must load a font before setting characters; style font load above should cover it.
  try {
    text.characters = "Text"
    const len = (text.characters ?? "").length
    if (len > 0) {
      try {
        await text.setRangeTextStyleIdAsync(0, len, styleId)
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  if (request.width400) {
    try {
      // Fixed width with auto height.
      ;(text as any).textAutoResize = "HEIGHT"
      text.resize(400, text.height)
    } catch {
      // ignore
    }
  }

  const variableId = await resolveColorVariableForPreset(request.presetColor)
  if (variableId) {
    if (request.forceModeName === "dark") {
      await setExplicitModeForColorVariableCollection(variableId, "dark")
    }
    text.fills = [makeSolidPaintBoundToColorVariable(variableId)]
  } else {
    // eslint-disable-next-line no-console
    console.log("[Mockup Markup] Create text: color preset not applied", { presetColor: request.presetColor })
  }

  figma.currentPage.selection = [text]
  figma.viewport.scrollAndZoomIntoView([text])
  return text
}

