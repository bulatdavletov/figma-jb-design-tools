/**
 * Resolution logic for Mockup Markup Quick Apply tool.
 * Delegates core resolution to the shared mockup-markup-library.
 * This file provides preset-specific wrappers used by apply.ts and create.ts.
 */

import type { MockupMarkupColorPreset, MockupMarkupTypographyPreset } from "../../messages"
import {
  resolveMarkupColorVariable,
  extractStyleKey,
  importTextStyleByKey,
  findLocalTextStyleByName,
  createVariableBoundPaint,
  setPageVariableMode,
  loadFontForTextStyle,
  type OperationResult,
} from "../mockup-markup-library/resolve"
import { COLOR_VARIABLE_ID_RAW_BY_PRESET, TEXT_STYLE_ID_BY_PRESET, getColorVariableNameCandidates } from "./presets"
import { logDebug, logWarn } from "./utils"

// Re-export library utilities so existing imports in apply.ts / create.ts keep working
export { createVariableBoundPaint, setPageVariableMode, loadFontForTextStyle }
export type { OperationResult }

// ============================================================================
// TEXT STYLE RESOLUTION
// ============================================================================

function getStyleNamePattern(preset: MockupMarkupTypographyPreset): RegExp {
  switch (preset) {
    case "h1":
      return /\bh1\b/i
    case "h2":
      return /\bh2\b/i
    case "h3":
      return /\bh3\b/i
    case "description":
      return /description/i
    case "paragraph":
      return /paragraph|body/i
  }
}

/**
 * Resolves the text style ID for a given typography preset.
 *
 * 1. Import the style by key from the enabled library
 * 2. Fall back to finding local styles by name pattern
 */
export async function resolveTextStyleIdForPreset(
  preset: MockupMarkupTypographyPreset
): Promise<string | null> {
  const preferredId = TEXT_STYLE_ID_BY_PRESET[preset]
  const key = extractStyleKey(preferredId)

  if (key) {
    const imported = await importTextStyleByKey(key)
    if (imported?.id) {
      logDebug("resolveTextStyleId", `Imported style for ${preset}`, { styleId: imported.id })
      return imported.id
    }
  }

  const namePattern = getStyleNamePattern(preset)
  const byName = await findLocalTextStyleByName(namePattern)
  if (byName?.id) {
    logDebug("resolveTextStyleId", `Found local style by name for ${preset}`, {
      styleId: byName.id,
      pattern: namePattern.source,
    })
    return byName.id
  }

  logWarn("resolveTextStyleId", `Could not resolve style for ${preset}`, {
    preferredId,
    key,
    hint: "Enable the Mockup markup library in Assets → Libraries",
  })
  return null
}

// ============================================================================
// COLOR VARIABLE RESOLUTION
// ============================================================================

/**
 * Resolves a color variable for a given preset.
 * Delegates to the shared library's resolveMarkupColorVariable.
 */
export async function resolveColorVariableForPreset(
  preset: MockupMarkupColorPreset
): Promise<string | null> {
  const rawId = COLOR_VARIABLE_ID_RAW_BY_PRESET[preset]
  const nameCandidates = getColorVariableNameCandidates(preset)

  const result = await resolveMarkupColorVariable(rawId, nameCandidates)

  if (result) {
    logDebug("resolveColorVariable", `Resolved variable for ${preset}`, { id: result.id, source: result.source })
    return result.id
  }

  logWarn("resolveColorVariable", `Could not resolve variable for ${preset}`, {
    rawId,
    nameCandidates,
    hint: "Enable the Mockup markup library in Assets → Libraries",
  })
  return null
}
