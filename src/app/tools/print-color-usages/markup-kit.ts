const DEBUG_MARKUP_IDS = false

/**
 * Markup Kit token to use for printed label text color.
 * If the variable isn't accessible in the current file (e.g. library not enabled),
 * we fall back to theme colors.
 *
 * Provided by user: `VariableID:.../1116:1` (normalize by stripping the suffix after `/`).
 */
const MARKUP_TEXT_COLOR_VARIABLE_ID_RAW = "VariableID:35e0b230bbdc8fa1906c60a25117319e726f2bd7/1116:1"
/**
 * Secondary label text color (linked part) from Markup Kit.
 * Used for the "linked" / secondary segment of variable labels (instead of 50% opacity).
 */
const MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW = "VariableID:84f084bc9e1c3ed3add7febfe9326d633010f8a2/1260:12"
/**
 * Library name where "Markup Text" variables live.
 * We prioritize searching/importing variables from this library, but still
 * fall back to scanning all enabled libraries if needed.
 */
const MARKUP_LIBRARY_NAME = "Mockup markup"
const MARKUP_TEXT_VARIABLE_NAME_CANDIDATES = ["markup-text", "Markup Text", "Text"]
const MARKUP_TEXT_SECONDARY_VARIABLE_NAME_CANDIDATES = ["markup-text-secondary", "Markup Text Secondary", "Text Secondary", "Markup Text secondary", "Text secondary"]
/**
 * Preferred text style for printed labels (from Markup Kit).
 * If not accessible in the current file (e.g. library not enabled/imported),
 * we fall back to local "Markup Description text", then Inter.
 */
const MARKUP_LABEL_TEXT_STYLE_ID = "S:a6d1706e317719d0750eae3655a3b4360ad2b9ef,1260:39"

function debugLog(...args: Array<unknown>): void {
  if (!DEBUG_MARKUP_IDS) return
  // eslint-disable-next-line no-console
  console.log("[Print Color Usages]", ...args)
}

function clonePaints(paints: Paint[]): Paint[] {
  // Figma paints are plain objects; JSON clone is enough for our use.
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

function normalizeVariableId(raw: string): string {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) return ""
  const slashIdx = trimmed.indexOf("/")
  return (slashIdx >= 0 ? trimmed.slice(0, slashIdx) : trimmed).trim()
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

function libraryNameMatches(candidate: string, wanted: string): boolean {
  const c = (candidate ?? "").trim().toLowerCase()
  const w = (wanted ?? "").trim().toLowerCase()
  if (!c || !w) return false
  return c === w
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

async function resolveColorVariableId(
  rawId: string,
  fallbackNames: string[]
): Promise<{ id: string; source: "id" | "key-import" | "local-name" | "library-import" } | null> {
  const normalized = normalizeVariableId(rawId)

  // 1) Try by ID (works only if variable is local/imported).
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
        debugLog("Resolved variable by key import", { key: variableKey, id: imported.id })
        return { id: imported.id, source: "key-import" }
      }
    } catch {
      // ignore
    }
  }

  // 3) Try local variables by name.
  try {
    const locals = await figma.variables.getLocalVariablesAsync("COLOR" as any)
    for (const wanted of fallbackNames) {
      const match = locals.find((v) => namesMatch((v as any).name ?? "", wanted))
      if (match?.id) return { id: match.id, source: "local-name" }
    }
  } catch {
    // ignore
  }

  // 4) Try enabled libraries: search by name and import by key.
  try {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
    const preferred = collections.filter((c) => libraryNameMatches(c.libraryName, MARKUP_LIBRARY_NAME))
    const rest = collections.filter((c) => !libraryNameMatches(c.libraryName, MARKUP_LIBRARY_NAME))
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

function makeSolidPaint(color: RGB, opacity: number = 1): SolidPaint {
  return { type: "SOLID", color, opacity }
}

export function getThemeColors(theme: string): { primary: RGB; secondary: RGB } {
  // light theme = black text (000), dark theme = white text (fff)
  const isWhite = theme === "dark"
  const primaryColor: RGB = isWhite ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 }
  const secondaryColor: RGB = isWhite ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 }
  return { primary: primaryColor, secondary: secondaryColor }
}

/**
 * Re-assert the page's current variable mode for the given variable's collection.
 * This triggers Figma to properly resolve newly-applied variable-bound fills.
 * Reads the current explicit mode from the page and sets it again (no change for the user).
 * If no explicit mode is set, falls back to the collection's default mode.
 */
async function reassertPageModeForVariable(variableId: string): Promise<void> {
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
      debugLog("Reasserted page mode for variable collection", { collectionId, modeId, wasExplicit: !!currentModeId })
    }
  } catch (e) {
    debugLog("reassertPageModeForVariable failed (non-fatal)", { variableId, error: String(e) })
  }
}

/**
 * Verify that a variable-bound fill was applied correctly to a text node.
 * Returns true if the primary fill's boundVariables.color.id matches the expected variable ID.
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

  const resolvedPrimary = await resolveColorVariableId(MARKUP_TEXT_COLOR_VARIABLE_ID_RAW, MARKUP_TEXT_VARIABLE_NAME_CANDIDATES)
  if (resolvedPrimary?.id) {
    primaryVariableId = resolvedPrimary.id
    const paint: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 } as SolidPaint
    ;(paint as any).boundVariables = { color: { type: "VARIABLE_ALIAS", id: resolvedPrimary.id } }
    primary = [paint]

    // Re-assert page mode so Figma properly resolves the variable-bound fill.
    await reassertPageModeForVariable(resolvedPrimary.id)

    debugLog("Markup Text variable resolved", {
      raw: MARKUP_TEXT_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId(MARKUP_TEXT_COLOR_VARIABLE_ID_RAW),
      resolvedId: resolvedPrimary.id,
      source: resolvedPrimary.source,
      namesTried: MARKUP_TEXT_VARIABLE_NAME_CANDIDATES,
    })
  } else {
    debugLog("Markup Text variable NOT resolved (using theme)", {
      raw: MARKUP_TEXT_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId(MARKUP_TEXT_COLOR_VARIABLE_ID_RAW),
      namesTried: MARKUP_TEXT_VARIABLE_NAME_CANDIDATES,
    })
  }

  const resolvedSecondary = await resolveColorVariableId(
    MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW,
    MARKUP_TEXT_SECONDARY_VARIABLE_NAME_CANDIDATES
  )
  if (resolvedSecondary?.id) {
    secondaryVariableId = resolvedSecondary.id
    const paint: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 } as SolidPaint
    ;(paint as any).boundVariables = { color: { type: "VARIABLE_ALIAS", id: resolvedSecondary.id } }
    secondary = [paint]
    debugLog("Markup Text Secondary variable resolved", {
      raw: MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId(MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW),
      resolvedId: resolvedSecondary.id,
      source: resolvedSecondary.source,
      namesTried: MARKUP_TEXT_SECONDARY_VARIABLE_NAME_CANDIDATES,
    })
  } else {
    // If secondary is missing but primary exists, keep old 50% behavior.
    if (primary !== fallbackPrimary) secondary = multiplyPaintOpacity(primary, 0.5)
    debugLog("Markup Text Secondary variable NOT resolved", {
      raw: MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW,
      normalized: normalizeVariableId(MARKUP_TEXT_SECONDARY_COLOR_VARIABLE_ID_RAW),
      namesTried: MARKUP_TEXT_SECONDARY_VARIABLE_NAME_CANDIDATES,
      usingFallback50pctOfPrimary: primary !== fallbackPrimary,
      secondarySource: primary !== fallbackPrimary ? "derived" : "theme",
    })
  }

  debugLog("Resolved label fills", {
    primarySource: primary === fallbackPrimary ? "theme" : "variable",
    secondarySource: secondary === fallbackSecondary ? "theme" : "variable_or_derived",
  })
  return { primary, secondary, primaryVariableId, secondaryVariableId }
}

export async function resolveMarkupDescriptionTextStyle(): Promise<TextStyle | null> {
  const styles = await figma.getLocalTextStylesAsync()
  return styles.find((s) => s.name === "Markup Description text") ?? styles.find((s) => /markup description text/i.test(s.name)) ?? null
}

export async function loadFontsForLabelTextStyle(markupDescriptionStyle: TextStyle | null): Promise<void> {
  // Prefer the explicit Markup Kit text style id.
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
    // fall through
    debugLog("Markup label textStyleId lookup ERROR", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, error: String(e) })
  }

  // Otherwise use local Markup Description text when available.
  if (markupDescriptionStyle) {
    try {
      await figma.loadFontAsync(markupDescriptionStyle.fontName)
      debugLog("Fallback typography: local Markup Description text", { fontName: markupDescriptionStyle.fontName })
      return
    } catch {
      // fall through
    }
  }

  // Hard fallback.
  debugLog("Fallback typography: Inter Regular")
  await figma.loadFontAsync({ family: "Inter", style: "Regular" })
}

export async function applyTypographyToLabel(text: TextNode, markupDescriptionStyle: TextStyle | null): Promise<void> {
  // Prefer the explicit Markup Kit text style id.
  try {
    await text.setTextStyleIdAsync(MARKUP_LABEL_TEXT_STYLE_ID)
    // Ensure ALL characters (including spaces) get the style.
    try {
      const len = (text.characters ?? "").length
      if (len > 0) {
        await text.setRangeTextStyleIdAsync(0, len, MARKUP_LABEL_TEXT_STYLE_ID)
      }
      debugLog("Applied label textStyleId", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, rangeLen: len })
    } catch (e) {
      debugLog("Applied label textStyleId (range apply failed)", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, error: String(e) })
    }
    return
  } catch (e) {
    debugLog("Failed to apply label textStyleId (will fallback)", { textStyleId: MARKUP_LABEL_TEXT_STYLE_ID, error: String(e) })
  }

  if (markupDescriptionStyle) {
    text.fontName = markupDescriptionStyle.fontName
    text.fontSize = markupDescriptionStyle.fontSize
    text.letterSpacing = markupDescriptionStyle.letterSpacing
    text.lineHeight = markupDescriptionStyle.lineHeight
    return
  }

  // Hard fallback.
  text.fontName = { family: "Inter", style: "Regular" }
  text.fontSize = 15
  text.lineHeight = { value: 21, unit: "PIXELS" }
}

