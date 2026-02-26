/**
 * Apply Mockup Markup styles to selection.
 */

import type { MockupMarkupApplyRequest } from "../../messages"
import { plural } from "../../utils/pluralize"
import {
  resolveTextStyleIdForPreset,
  loadFontForTextStyle,
  createVariableBoundPaint,
  resolveColorVariableForPreset,
  setPageVariableMode,
} from "./resolve"
import { collectTextNodesFromSelection, logDebug, logWarn, loadFont } from "./utils"

export type ApplyResult = {
  applied: number
  skipped: number
  errors: string[]
  typographyAvailable: boolean
  colorAvailable: boolean
}

/**
 * Applies Mockup Markup styles to all text nodes in the current selection.
 *
 * This function:
 * 1. Collects all text nodes recursively from selection
 * 2. Resolves the text style and color variable
 * 3. Applies style and color to each text node
 * 4. Reports detailed results
 */
export async function applyMockupMarkupToSelection(
  request: MockupMarkupApplyRequest
): Promise<ApplyResult> {
  const result: ApplyResult = {
    applied: 0,
    skipped: 0,
    errors: [],
    typographyAvailable: true,
    colorAvailable: true,
  }

  // Check selection
  const selection = figma.currentPage.selection
  if (selection.length === 0) {
    figma.notify("Select a text layer (or a frame with text) first")
    return result
  }

  // Collect text nodes
  const textNodes = collectTextNodesFromSelection(selection)
  if (textNodes.length === 0) {
    figma.notify("No text layers found in selection")
    return result
  }

  logDebug("apply", `Processing ${textNodes.length} text nodes`)

  // Resolve text style
  const styleId = await resolveTextStyleIdForPreset(request.presetTypography)
  result.typographyAvailable = styleId !== null

  // Pre-load font for the style (if available)
  if (styleId) {
    const fontResult = await loadFontForTextStyle(styleId)
    if (!fontResult.ok) {
      logWarn("apply", `Could not load font for style`, { reason: fontResult.reason })
    }
  }

  // Resolve color variable and create paint
  const colorVariableId = await resolveColorVariableForPreset(request.presetColor)
  result.colorAvailable = colorVariableId !== null

  let fills: SolidPaint[] | null = null
  if (colorVariableId) {
    // Set the page-wide variable mode before creating the paint
    const modeResult = await setPageVariableMode(colorVariableId, request.forceModeName)
    if (!modeResult.ok) {
      logWarn("apply", `Could not set variable mode`, { reason: modeResult.reason })
    }
    fills = [createVariableBoundPaint(colorVariableId)]
  }

  // Apply to each text node
  const successfulNodes: TextNode[] = []

  for (const textNode of textNodes) {
    let nodeModified = false

    // Apply text style
    if (styleId) {
      try {
        await textNode.setTextStyleIdAsync(styleId)
        nodeModified = true
        logDebug("apply", `Applied style to node ${textNode.id}`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (!result.errors.includes(msg)) {
          result.errors.push(msg)
        }
        logWarn("apply", `Failed to apply style to node ${textNode.id}`, { error: msg })
      }
    }

    // Apply width if requested
    if (request.width400) {
      try {
        textNode.textAutoResize = "HEIGHT"
        textNode.resize(400, Math.max(1, textNode.height))
        nodeModified = true
      } catch (e) {
        // Width resize failures are not critical, don't add to errors
        logDebug("apply", `Could not resize node ${textNode.id}`)
      }
    }

    // Apply color fills
    if (fills) {
      try {
        textNode.fills = fills
        // Verify the fill was applied
        const appliedFills = textNode.fills as readonly Paint[]
        if (
          appliedFills.length > 0 &&
          appliedFills[0].type === "SOLID" &&
          (appliedFills[0] as any).boundVariables?.color?.id === colorVariableId
        ) {
          nodeModified = true
          logDebug("apply", `Applied color to node ${textNode.id}`)
        } else {
          logWarn("apply", `Color fill not applied correctly to node ${textNode.id}`)
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (!result.errors.includes(msg)) {
          result.errors.push(msg)
        }
        logWarn("apply", `Failed to apply color to node ${textNode.id}`, { error: msg })
      }
    }

    if (nodeModified) {
      result.applied++
      successfulNodes.push(textNode)
    } else {
      result.skipped++
    }
  }

  // Update selection to show modified nodes
  if (successfulNodes.length > 0) {
    figma.currentPage.selection = successfulNodes
    try {
      figma.viewport.scrollAndZoomIntoView([successfulNodes[0]])
    } catch {
      // Viewport operations can fail in certain contexts
    }
  }

  // Show notification with results
  showResultNotification(result)

  return result
}

/**
 * Shows a user-friendly notification based on apply results.
 */
function showResultNotification(result: ApplyResult): void {
  const parts: string[] = []

  if (result.applied > 0) {
    parts.push(`Applied markup to ${plural(result.applied, "text layer")}`)

    if (!result.typographyAvailable) {
      parts.push("(typography unavailable)")
    }
    if (result.skipped > 0) {
      parts.push(`skipped ${result.skipped}`)
    }
  } else if (result.skipped > 0) {
    parts.push(`Nothing applied (skipped ${result.skipped})`)
    if (result.errors.length > 0) {
      parts.push(result.errors[0])
    }
  } else {
    parts.push("Nothing applied")
  }

  figma.notify(parts.join(", "))

  // Additional notification for missing typography
  if (!result.typographyAvailable) {
    figma.notify(
      "Typography presets require importing Mockup markup text styles into this file (Assets → Libraries → Mockup markup)."
    )
  }
}
