/**
 * Create new text with Mockup Markup styles.
 */

import type { MockupMarkupApplyRequest } from "../../messages"
import {
  resolveTextStyleIdForPreset,
  loadFontForTextStyle,
  createVariableBoundPaint,
  resolveColorVariableForPreset,
  setPageVariableMode,
} from "./resolve"
import { logDebug, logWarn, loadFont } from "./utils"

export type CreateResult = {
  node: TextNode | null
  typographyApplied: boolean
  colorApplied: boolean
  errors: string[]
}

/**
 * Creates a new text node with Mockup Markup styles.
 *
 * This function follows a specific order to ensure reliability:
 * 1. Create the text node
 * 2. Load and apply text style (if available)
 * 3. Load default font and set characters
 * 4. Apply color variable
 * 5. Apply width if requested
 */
export async function createMockupMarkupText(
  request: MockupMarkupApplyRequest
): Promise<CreateResult> {
  const result: CreateResult = {
    node: null,
    typographyApplied: false,
    colorApplied: false,
    errors: [],
  }

  // Create the text node
  const textNode = figma.createText()
  result.node = textNode

  // Position at viewport center
  const center = figma.viewport.center
  textNode.x = center.x
  textNode.y = center.y

  logDebug("create", "Created text node", { x: textNode.x, y: textNode.y })

  // Resolve and apply text style
  const styleId = await resolveTextStyleIdForPreset(request.presetTypography)

  if (styleId) {
    // Load the font for this style first
    const fontResult = await loadFontForTextStyle(styleId)
    if (fontResult.ok) {
      try {
        await textNode.setTextStyleIdAsync(styleId)
        result.typographyApplied = true
        logDebug("create", "Applied text style", { styleId })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        result.errors.push(`Style: ${msg}`)
        logWarn("create", "Failed to apply text style", { error: msg })
      }
    } else {
      result.errors.push(`Font: ${fontResult.reason}`)
      logWarn("create", "Could not load font for style", { reason: fontResult.reason })
    }
  }

  // Set text content - need to load the current font first
  try {
    const currentFont = textNode.fontName as FontName
    if (currentFont && typeof currentFont === "object" && currentFont.family) {
      const fontLoadResult = await loadFont(currentFont)
      if (fontLoadResult.ok) {
        textNode.characters = "Text"
        logDebug("create", "Set text content")
      } else {
        // Try loading Inter as fallback
        const fallbackResult = await loadFont({ family: "Inter", style: "Regular" })
        if (fallbackResult.ok) {
          textNode.fontName = { family: "Inter", style: "Regular" }
          textNode.characters = "Text"
          logDebug("create", "Set text content with fallback font")
        } else {
          logWarn("create", "Could not load any font for text content")
        }
      }
    }
  } catch (e) {
    logWarn("create", "Error setting text content", {
      error: e instanceof Error ? e.message : String(e),
    })
  }

  // Apply width if requested (after setting characters)
  if (request.width400) {
    try {
      textNode.textAutoResize = "HEIGHT"
      textNode.resize(400, Math.max(1, textNode.height))
      logDebug("create", "Applied fixed width")
    } catch (e) {
      logWarn("create", "Could not apply fixed width", {
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  // Resolve and apply color variable
  const colorVariableId = await resolveColorVariableForPreset(request.presetColor)

  if (colorVariableId) {
    // Set page-wide variable mode
    const modeResult = await setPageVariableMode(colorVariableId, request.forceModeName)
    if (!modeResult.ok) {
      logWarn("create", "Could not set variable mode", { reason: modeResult.reason })
    }

    // Apply the color fill
    try {
      const paint = createVariableBoundPaint(colorVariableId)
      textNode.fills = [paint]

      // Verify the fill was applied correctly
      const appliedFills = textNode.fills as readonly Paint[]
      if (
        appliedFills.length > 0 &&
        appliedFills[0].type === "SOLID" &&
        (appliedFills[0] as any).boundVariables?.color?.id === colorVariableId
      ) {
        result.colorApplied = true
        logDebug("create", "Applied color variable", { variableId: colorVariableId })
      } else {
        result.errors.push("Color fill not applied correctly")
        logWarn("create", "Color fill verification failed")
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      result.errors.push(`Color: ${msg}`)
      logWarn("create", "Failed to apply color", { error: msg })
    }
  } else {
    logWarn("create", "Color variable not resolved", { preset: request.presetColor })
  }

  // Select and scroll to the new node
  figma.currentPage.selection = [textNode]
  try {
    figma.viewport.scrollAndZoomIntoView([textNode])
  } catch {
    // Viewport operations can fail in certain contexts
  }

  // Show notification for missing typography
  if (!result.typographyApplied) {
    figma.notify(
      "Typography couldn't be applied. Import Mockup markup text styles into this file (Assets → Libraries → Mockup markup)."
    )
  }

  return result
}
