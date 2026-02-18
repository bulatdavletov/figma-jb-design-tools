/**
 * Markup Kit integration for Print Color Usages tool.
 *
 * Core variable/style resolution is delegated to the shared mockup-markup-library.
 * This file provides Print-specific helpers: theme colors, label fills,
 * label typography, and font loading.
 */

import {
  MARKUP_COLOR_VARIABLE_RAW_IDS,
  MARKUP_COLOR_VARIABLE_NAME_CANDIDATES,
  MARKUP_TEXT_STYLE_IDS,
} from "../mockup-markup-library/constants"

import {
  resolveMarkupColorVariable,
  createVariableBoundPaint,
  reassertPageModeForVariable,
  verifyFillBinding as libraryVerifyFillBinding,
} from "../mockup-markup-library/resolve"

const DEBUG_MARKUP_IDS = false

const MARKUP_LABEL_TEXT_STYLE_ID = MARKUP_TEXT_STYLE_IDS.paragraph

function debugLog(...args: Array<unknown>): void {
  if (!DEBUG_MARKUP_IDS) return
  // eslint-disable-next-line no-console
  console.log("[Print Color Usages]", ...args)
}

function clonePaints(paints: Paint[]): Paint[] {
  try {
    return JSON.parse(JSON.stringify(paints)) as Paint[]
  } catch {
    return Array.from(paints)
  }
}

function multiplyPaintOpacity(paints: Paint[], multiplier: number): Paint[] {
  const safe = Math.max(0, Math.min(1, multiplier))
  return clonePaints(paints).map((p) => {
    const anyPaint = p as any
    const opacity = typeof anyPaint.opacity === "number" ? anyPaint.opacity : 1
    anyPaint.opacity = opacity * safe
    return p
  })
}

function makeSolidPaint(color: RGB, opacity: number = 1): SolidPaint {
  return { type: "SOLID", color, opacity }
}

export function getThemeColors(theme: string): { primary: RGB; secondary: RGB } {
  const isWhite = theme === "dark"
  const primaryColor: RGB = isWhite ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 }
  const secondaryColor: RGB = isWhite ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 }
  return { primary: primaryColor, secondary: secondaryColor }
}

export { libraryVerifyFillBinding as verifyFillBinding }

export async function resolveMarkupTextFills(themeColors: {
  primary: RGB
  secondary: RGB
}): Promise<{ primary: Paint[]; secondary: Paint[]; primaryVariableId: string | null; secondaryVariableId: string | null }> {
  const fallbackPrimary: Paint[] = [makeSolidPaint(themeColors.primary, 1)]
  const fallbackSecondary: Paint[] = [makeSolidPaint(themeColors.secondary, 0.5)]

  let primary: Paint[] = fallbackPrimary
  let secondary: Paint[] = fallbackSecondary
  let primaryVariableId: string | null = null
  let secondaryVariableId: string | null = null

  const resolvedPrimary = await resolveMarkupColorVariable(
    MARKUP_COLOR_VARIABLE_RAW_IDS.text,
    [...MARKUP_COLOR_VARIABLE_NAME_CANDIDATES.text]
  )
  if (resolvedPrimary?.id) {
    primaryVariableId = resolvedPrimary.id
    primary = [createVariableBoundPaint(resolvedPrimary.id)]
    await reassertPageModeForVariable(resolvedPrimary.id)

    debugLog("Markup Text variable resolved", {
      resolvedId: resolvedPrimary.id,
      source: resolvedPrimary.source,
    })
  } else {
    debugLog("Markup Text variable NOT resolved (using theme)")
  }

  const resolvedSecondary = await resolveMarkupColorVariable(
    MARKUP_COLOR_VARIABLE_RAW_IDS.textSecondary,
    [...MARKUP_COLOR_VARIABLE_NAME_CANDIDATES.textSecondary]
  )
  if (resolvedSecondary?.id) {
    secondaryVariableId = resolvedSecondary.id
    secondary = [createVariableBoundPaint(resolvedSecondary.id)]
    debugLog("Markup Text Secondary variable resolved", {
      resolvedId: resolvedSecondary.id,
      source: resolvedSecondary.source,
    })
  } else {
    if (primary !== fallbackPrimary) secondary = multiplyPaintOpacity(primary, 0.5)
    debugLog("Markup Text Secondary variable NOT resolved", {
      usingFallback50pctOfPrimary: primary !== fallbackPrimary,
    })
  }

  return { primary, secondary, primaryVariableId, secondaryVariableId }
}

export async function resolveMarkupDescriptionTextStyle(): Promise<TextStyle | null> {
  const styles = await figma.getLocalTextStylesAsync()
  return styles.find((s) => s.name === "Markup Description text") ?? styles.find((s) => /markup description text/i.test(s.name)) ?? null
}

export async function loadFontsForLabelTextStyle(markupDescriptionStyle: TextStyle | null): Promise<void> {
  try {
    const style = await figma.getStyleByIdAsync(MARKUP_LABEL_TEXT_STYLE_ID)
    if (style && (style as any).type === "TEXT") {
      const fontName = (style as any).fontName as FontName | undefined
      if (fontName) {
        await figma.loadFontAsync(fontName)
        debugLog("Markup label textStyleId resolved & font loaded", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, fontName })
        return
      }
    }
  } catch (e) {
    debugLog("Markup label textStyleId lookup ERROR", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, error: String(e) })
  }

  if (markupDescriptionStyle) {
    try {
      await figma.loadFontAsync(markupDescriptionStyle.fontName)
      debugLog("Fallback typography: local Markup Description text", { fontName: markupDescriptionStyle.fontName })
      return
    } catch {
      // fall through
    }
  }

  debugLog("Fallback typography: Inter Regular")
  await figma.loadFontAsync({ family: "Inter", style: "Regular" })
}

export async function applyTypographyToLabel(text: TextNode, markupDescriptionStyle: TextStyle | null): Promise<void> {
  try {
    await text.setTextStyleIdAsync(MARKUP_LABEL_TEXT_STYLE_ID)
    try {
      const len = (text.characters ?? "").length
      if (len > 0) {
        await text.setRangeTextStyleIdAsync(0, len, MARKUP_LABEL_TEXT_STYLE_ID)
      }
    } catch {
      // range apply failed
    }
    return
  } catch {
    // will fallback
  }

  if (markupDescriptionStyle) {
    text.fontName = markupDescriptionStyle.fontName
    text.fontSize = markupDescriptionStyle.fontSize
    text.letterSpacing = markupDescriptionStyle.letterSpacing
    text.lineHeight = markupDescriptionStyle.lineHeight
    return
  }

  text.fontName = { family: "Inter", style: "Regular" }
  text.fontSize = 15
  text.lineHeight = { value: 21, unit: "PIXELS" }
}
