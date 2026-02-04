/**
 * Resolution logic for Mockup Markup tool.
 * Handles resolving text styles and color variables from presets.
 */

import type { MockupMarkupColorPreset, MockupMarkupTypographyPreset } from "../../messages"
import {
  COLOR_VARIABLE_ID_RAW_BY_PRESET,
  MOCKUP_MARKUP_LIBRARY_NAME,
  TEXT_STYLE_ID_BY_PRESET,
  getColorVariableNameCandidates,
} from "./presets"
import { logDebug, logWarn, type OperationResult } from "./utils"

// ============================================================================
// TEXT STYLE RESOLUTION
// ============================================================================

/**
 * Extracts the style key from a full style ID.
 * Style IDs look like: "S:<key>,<nodeId>"
 */
function extractStyleKey(styleId: string): string | null {
  const match = /^S:([^,]+)/.exec(styleId?.trim() ?? "")
  return match?.[1] ?? null
}

/**
 * Imports a text style from an enabled library by its key.
 * This is the simplest and most reliable way if the library is enabled.
 */
async function importStyleByKey(key: string): Promise<TextStyle | null> {
  if (!key) return null
  try {
    const style = await figma.importStyleByKeyAsync(key)
    if (style && (style as any).type === "TEXT") {
      return style as TextStyle
    }
  } catch (e) {
    logDebug("importStyleByKey", `Could not import style`, {
      key,
      error: e instanceof Error ? e.message : String(e),
    })
  }
  return null
}

/**
 * Finds a local text style by name pattern (fallback).
 */
async function findLocalStyleByName(namePattern: RegExp): Promise<TextStyle | null> {
  try {
    const styles = await figma.getLocalTextStylesAsync()
    return styles.find((s) => namePattern.test(s.name ?? "")) ?? null
  } catch {
    return null
  }
}

/**
 * Gets the name pattern for finding a style by preset type.
 */
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
 * Simple approach:
 * 1. Import the style by key from the enabled library (just like we do for variables)
 * 2. Fall back to finding local styles by name pattern
 */
export async function resolveTextStyleIdForPreset(
  preset: MockupMarkupTypographyPreset
): Promise<string | null> {
  const preferredId = TEXT_STYLE_ID_BY_PRESET[preset]
  const key = extractStyleKey(preferredId)

  // Strategy 1: Import from library (simplest if library is enabled)
  if (key) {
    const imported = await importStyleByKey(key)
    if (imported?.id) {
      logDebug("resolveTextStyleId", `Imported style for ${preset}`, { styleId: imported.id })
      return imported.id
    }
  }

  // Strategy 2: Find by name pattern in local styles
  const namePattern = getStyleNamePattern(preset)
  const byName = await findLocalStyleByName(namePattern)
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

/**
 * Loads the font for a text style so it can be applied to text nodes.
 */
export async function loadFontForTextStyle(styleId: string): Promise<OperationResult> {
  try {
    const style = await figma.getStyleByIdAsync(styleId)
    if (!style || (style as any).type !== "TEXT") {
      return { ok: false, reason: "Style not found or not a text style" }
    }
    const fontName = (style as any).fontName as FontName | undefined
    if (!fontName) {
      return { ok: false, reason: "Style has no font name" }
    }
    await figma.loadFontAsync(fontName)
    return { ok: true, value: undefined }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) }
  }
}

// ============================================================================
// COLOR VARIABLE RESOLUTION
// ============================================================================

/**
 * Normalizes a raw variable ID by removing the trailing node ID part.
 * Raw IDs look like: "VariableID:<hash>/<nodeId>"
 */
function normalizeVariableId(rawId: string): string {
  const trimmed = (rawId ?? "").trim()
  if (!trimmed) return ""
  const slashIdx = trimmed.indexOf("/")
  return (slashIdx >= 0 ? trimmed.slice(0, slashIdx) : trimmed).trim()
}

/**
 * Checks if two names match (case-insensitive, handles "Group/Name" format).
 */
function namesMatch(candidate: string, wanted: string): boolean {
  const normalize = (s: string) => (s ?? "").trim().toLowerCase()
  const c = normalize(candidate)
  const w = normalize(wanted)
  if (!c || !w) return false

  // Direct match
  if (c === w) return true

  // Match just the leaf name (after last "/")
  const leafIdx = c.lastIndexOf("/")
  const leaf = leafIdx >= 0 ? c.slice(leafIdx + 1) : c
  return leaf === w
}

/**
 * Tries to get a variable by its ID (works if already imported/local).
 */
async function getVariableById(variableId: string): Promise<Variable | null> {
  try {
    const v = await figma.variables.getVariableByIdAsync(variableId)
    return v ?? null
  } catch {
    return null
  }
}

/**
 * Searches local variables for one matching the given names.
 */
async function findLocalVariableByName(nameCandidates: string[]): Promise<Variable | null> {
  try {
    const locals = await figma.variables.getLocalVariablesAsync("COLOR" as any)
    for (const wanted of nameCandidates) {
      const match = locals.find((v) => namesMatch((v as any).name ?? "", wanted))
      if (match) return match
    }
  } catch {
    // Local variables API failed
  }
  return null
}

/**
 * Imports a variable from an enabled library by searching for matching names.
 * Prefers the "Mockup markup" library but falls back to others.
 */
async function importVariableFromLibrary(nameCandidates: string[]): Promise<Variable | null> {
  try {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()

    // Prefer Mockup markup library
    const libraryName = MOCKUP_MARKUP_LIBRARY_NAME.toLowerCase()
    const preferred = collections.filter(
      (c) => (c.libraryName ?? "").trim().toLowerCase() === libraryName
    )
    const rest = collections.filter(
      (c) => (c.libraryName ?? "").trim().toLowerCase() !== libraryName
    )
    const ordered = [...preferred, ...rest]

    for (const collection of ordered) {
      try {
        const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key)
        for (const wanted of nameCandidates) {
          const match = vars.find(
            (v) => (v.resolvedType as any) === "COLOR" && namesMatch(v.name ?? "", wanted)
          )
          if (match?.key) {
            const imported = await figma.variables.importVariableByKeyAsync(match.key)
            if (imported) {
              logDebug("importVariableFromLibrary", `Imported variable`, {
                name: match.name,
                library: collection.libraryName,
              })
              return imported
            }
          }
        }
      } catch {
        // Skip this collection
      }
    }
  } catch {
    // Team library API failed
  }
  return null
}

/**
 * Resolves a color variable for a given preset.
 *
 * Resolution order:
 * 1. Try to get by normalized ID (works if already imported)
 * 2. Search local variables by name
 * 3. Import from enabled library
 *
 * Returns the variable ID or null if not found.
 */
export async function resolveColorVariableForPreset(
  preset: MockupMarkupColorPreset
): Promise<string | null> {
  const rawId = COLOR_VARIABLE_ID_RAW_BY_PRESET[preset]
  const normalizedId = normalizeVariableId(rawId)
  const nameCandidates = getColorVariableNameCandidates(preset)

  // Strategy 1: Direct lookup by ID
  if (normalizedId) {
    const byId = await getVariableById(normalizedId)
    if (byId?.id) {
      logDebug("resolveColorVariable", `Found variable by ID for ${preset}`, { id: byId.id })
      return byId.id
    }
  }

  // Strategy 2: Find in local variables
  const local = await findLocalVariableByName(nameCandidates)
  if (local?.id) {
    logDebug("resolveColorVariable", `Found local variable for ${preset}`, { id: local.id })
    return local.id
  }

  // Strategy 3: Import from library
  const imported = await importVariableFromLibrary(nameCandidates)
  if (imported?.id) {
    logDebug("resolveColorVariable", `Imported variable for ${preset}`, { id: imported.id })
    return imported.id
  }

  logWarn("resolveColorVariable", `Could not resolve variable for ${preset}`, {
    rawId,
    nameCandidates,
    hint: "Enable the Mockup markup library in Assets → Libraries",
  })
  return null
}

// ============================================================================
// APPLYING COLOR VARIABLES
// ============================================================================

/**
 * Creates a SolidPaint bound to a color variable.
 */
export function createVariableBoundPaint(variableId: string): SolidPaint {
  const paint: SolidPaint = {
    type: "SOLID",
    color: { r: 0, g: 0, b: 0 },
    opacity: 1,
  }
  ;(paint as any).boundVariables = {
    color: { type: "VARIABLE_ALIAS", id: variableId },
  }
  return paint
}

/**
 * Sets the explicit variable mode for a variable's collection on the current page.
 */
export async function setPageVariableMode(
  variableId: string,
  modeName: "dark" | "light"
): Promise<OperationResult> {
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId)
    if (!variable) {
      return { ok: false, reason: "Variable not found" }
    }

    const collectionId = (variable as any).variableCollectionId as string | undefined
    if (!collectionId) {
      return { ok: false, reason: "Variable has no collection" }
    }

    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    if (!collection) {
      return { ok: false, reason: "Collection not found" }
    }

    const modes = (collection.modes ?? []) as Array<{ modeId: string; name: string }>
    const targetMode = modes.find((m) => (m.name ?? "").trim().toLowerCase() === modeName)

    if (targetMode?.modeId) {
      figma.currentPage.setExplicitVariableModeForCollection(collection, targetMode.modeId)
      logDebug("setPageVariableMode", `Set mode to ${modeName}`, { modeId: targetMode.modeId })
      return { ok: true, value: undefined }
    }

    // If target mode doesn't exist, clear explicit mode for "light"
    if (modeName === "light") {
      try {
        figma.currentPage.clearExplicitVariableModeForCollection(collection)
        logDebug("setPageVariableMode", "Cleared explicit mode (light fallback)")
        return { ok: true, value: undefined }
      } catch {
        // Ignore
      }
    }

    return { ok: false, reason: `Mode "${modeName}" not found in collection` }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) }
  }
}

// ============================================================================
// EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================================================

// These are kept for backward compatibility with existing code
export const loadFontForTextStyleId = loadFontForTextStyle
export const makeSolidPaintBoundToColorVariable = createVariableBoundPaint
export const setExplicitModeForColorVariableCollection = setPageVariableMode
export const resolveColorVariableId = async (
  rawId: string,
  fallbackNames: string[]
): Promise<string | null> => {
  const normalizedId = normalizeVariableId(rawId)
  if (normalizedId) {
    const byId = await getVariableById(normalizedId)
    if (byId?.id) return byId.id
  }
  const local = await findLocalVariableByName(fallbackNames)
  if (local?.id) return local.id
  const imported = await importVariableFromLibrary(fallbackNames)
  return imported?.id ?? null
}
