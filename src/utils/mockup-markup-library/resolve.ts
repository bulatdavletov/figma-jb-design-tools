/**
 * Core resolution logic for the "Mockup markup" library.
 * Shared by Print Color Usages and Mockup Markup tools.
 *
 * Resolution order for color variables:
 *   1. Direct ID lookup (works if variable is already local/imported)
 *   2. Import by key (most reliable — keys survive renames)
 *   3. Local variables search by name
 *   4. Library search by name + import
 */

import { MARKUP_LIBRARY_NAME } from "./constants"

export type VariableResolveSource = "id" | "key-import" | "local-name" | "library-import"

export type VariableResolveResult = {
  id: string
  source: VariableResolveSource
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeVariableId(raw: string): string {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) return ""
  const slashIdx = trimmed.indexOf("/")
  return (slashIdx >= 0 ? trimmed.slice(0, slashIdx) : trimmed).trim()
}

/**
 * Extracts the variable key (hash) from a raw variable ID.
 * Raw IDs look like: "VariableID:<hash>/<nodeId>"
 * The hash IS the variable key used by importVariableByKeyAsync — survives renames.
 */
function extractVariableKey(rawId: string): string | null {
  const match = /^VariableID:([a-f0-9]+)/i.exec((rawId ?? "").trim())
  return match?.[1] ?? null
}

/**
 * Extracts the style key from a full style ID.
 * Style IDs look like: "S:<key>,<nodeId>"
 */
export function extractStyleKey(styleId: string): string | null {
  const match = /^S:([^,]+)/.exec(styleId?.trim() ?? "")
  return match?.[1] ?? null
}

function leafName(name: string): string {
  const idx = (name ?? "").lastIndexOf("/")
  return idx >= 0 ? name.slice(idx + 1) || name : name
}

function namesMatch(candidate: string, wanted: string): boolean {
  const c = (candidate ?? "").trim().toLowerCase()
  const w = (wanted ?? "").trim().toLowerCase()
  if (!c || !w) return false
  return c === w || leafName(c) === w
}

function libraryNameMatches(candidate: string): boolean {
  const c = (candidate ?? "").trim().toLowerCase()
  const w = MARKUP_LIBRARY_NAME.toLowerCase()
  return c === w
}

// ---------------------------------------------------------------------------
// Color variable resolution
// ---------------------------------------------------------------------------

/**
 * Resolves a Mockup markup color variable from its raw ID and fallback names.
 *
 * Strategies (tried in order):
 *   1. Direct ID lookup
 *   2. Import by key (hash from raw ID) — survives renames
 *   3. Local variable search by name candidates
 *   4. Library search by name candidates + import
 */
export async function resolveMarkupColorVariable(
  rawId: string,
  fallbackNames: string[]
): Promise<VariableResolveResult | null> {
  const normalized = normalizeVariableId(rawId)

  // 1) Direct ID lookup (works only if variable is local/imported).
  if (normalized) {
    try {
      const v = await figma.variables.getVariableByIdAsync(normalized)
      if (v?.id) return { id: v.id, source: "id" }
    } catch {
      // ignore
    }
  }

  // 2) Import by key — most reliable, survives renames.
  const variableKey = extractVariableKey(rawId)
  if (variableKey) {
    try {
      const imported = await figma.variables.importVariableByKeyAsync(variableKey)
      if (imported?.id && (imported as any).resolvedType === "COLOR") {
        return { id: imported.id, source: "key-import" }
      }
    } catch {
      // ignore
    }
  }

  // 3) Local variables search by name.
  try {
    const locals = await figma.variables.getLocalVariablesAsync("COLOR" as any)
    for (const wanted of fallbackNames) {
      const match = locals.find((v) => namesMatch((v as any).name ?? "", wanted))
      if (match?.id) return { id: match.id, source: "local-name" }
    }
  } catch {
    // ignore
  }

  // 4) Library search by name + import.
  try {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
    const preferred = collections.filter((c) => libraryNameMatches(c.libraryName))
    const rest = collections.filter((c) => !libraryNameMatches(c.libraryName))
    const ordered = preferred.length > 0 ? [...preferred, ...rest] : collections

    for (const c of ordered) {
      try {
        const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key)
        for (const wanted of fallbackNames) {
          const libMatch = vars.find(
            (v) => (v.resolvedType as any) === "COLOR" && namesMatch(v.name ?? "", wanted)
          )
          if (libMatch?.key) {
            const imported = await figma.variables.importVariableByKeyAsync(libMatch.key)
            if (imported?.id) return { id: imported.id, source: "library-import" }
          }
        }
      } catch {
        // ignore this collection
      }
    }
  } catch {
    // ignore
  }

  return null
}

// ---------------------------------------------------------------------------
// Text style resolution
// ---------------------------------------------------------------------------

/**
 * Imports a text style from an enabled library by its key.
 */
export async function importTextStyleByKey(key: string): Promise<TextStyle | null> {
  if (!key) return null
  try {
    const style = await figma.importStyleByKeyAsync(key)
    if (style && (style as any).type === "TEXT") {
      return style as TextStyle
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * Finds a local text style by name pattern (fallback).
 */
export async function findLocalTextStyleByName(namePattern: RegExp): Promise<TextStyle | null> {
  try {
    const styles = await figma.getLocalTextStylesAsync()
    return styles.find((s) => namePattern.test(s.name ?? "")) ?? null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Paint helpers
// ---------------------------------------------------------------------------

/**
 * Creates a SolidPaint bound to a color variable.
 */
export function createVariableBoundPaint(variableId: string): SolidPaint {
  const paint: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 }
  ;(paint as any).boundVariables = { color: { type: "VARIABLE_ALIAS", id: variableId } }
  return paint
}

/**
 * Verify that a variable-bound fill was applied correctly to a text node.
 */
export function verifyFillBinding(node: TextNode, expectedVariableId: string): boolean {
  try {
    const fills = node.fills as readonly Paint[]
    if (fills.length === 0) return false
    const first = fills[0]
    if (first.type !== "SOLID") return false
    const boundId = (first as any).boundVariables?.color?.id
    return boundId === expectedVariableId
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Variable mode helpers
// ---------------------------------------------------------------------------

/**
 * Re-assert the page's current variable mode for the given variable's collection.
 * Triggers Figma to properly resolve newly-applied variable-bound fills.
 */
export async function reassertPageModeForVariable(variableId: string): Promise<void> {
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId)
    if (!variable) return
    const collectionId = (variable as any).variableCollectionId as string | undefined
    if (!collectionId) return
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    if (!collection) return

    const explicitModes = (figma.currentPage as any).explicitVariableModes as Record<string, string> | undefined
    const currentModeId = explicitModes?.[collectionId]
    const defaultModeId = (collection as any).defaultModeId as string | undefined
    const modeId = currentModeId || defaultModeId || (Array.isArray(collection.modes) && collection.modes[0]?.modeId) || null

    if (modeId) {
      figma.currentPage.setExplicitVariableModeForCollection(collection, modeId)
    }
  } catch {
    // non-fatal
  }
}

export type OperationResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; reason: string }

/**
 * Sets the explicit variable mode for a variable's collection on the current page.
 */
export async function setPageVariableMode(
  variableId: string,
  modeName: "dark" | "light"
): Promise<OperationResult> {
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId)
    if (!variable) return { ok: false, reason: "Variable not found" }

    const collectionId = (variable as any).variableCollectionId as string | undefined
    if (!collectionId) return { ok: false, reason: "Variable has no collection" }

    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    if (!collection) return { ok: false, reason: "Collection not found" }

    const modes = (collection.modes ?? []) as Array<{ modeId: string; name: string }>
    const targetMode = modes.find((m) => (m.name ?? "").trim().toLowerCase() === modeName)

    if (targetMode?.modeId) {
      figma.currentPage.setExplicitVariableModeForCollection(collection, targetMode.modeId)
      return { ok: true, value: undefined }
    }

    if (modeName === "light") {
      try {
        figma.currentPage.clearExplicitVariableModeForCollection(collection)
        return { ok: true, value: undefined }
      } catch {
        // ignore
      }
    }

    return { ok: false, reason: `Mode "${modeName}" not found in collection` }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) }
  }
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
