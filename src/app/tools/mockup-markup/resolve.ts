import type { MockupMarkupColorPreset, MockupMarkupTypographyPreset } from "../../messages"
import {
  COLOR_VARIABLE_ID_RAW_BY_PRESET,
  MOCKUP_MARKUP_LIBRARY_NAME,
  TEXT_STYLE_ID_BY_PRESET,
  getColorVariableNameCandidates,
} from "./presets"

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

function extractStyleKeyFromStyleId(styleId: string): string | null {
  // Style ids look like: "S:<key>,<nodeId>"
  const m = /^S:([^,]+)/.exec((styleId ?? "").trim())
  return m?.[1] ?? null
}

async function resolveLocalTextStyleIdByKey(key: string): Promise<string | null> {
  const k = (key ?? "").trim()
  if (!k) return null
  try {
    const styles = await figma.getLocalTextStylesAsync()
    const match = styles.find((s) => ((s as any).key as string | undefined) === k)
    return match?.id ?? null
  } catch {
    return null
  }
}

async function resolveLocalTextStyleIdByNameRegex(regex: RegExp): Promise<string | null> {
  try {
    const styles = await figma.getLocalTextStylesAsync()
    const match = styles.find((s) => regex.test(s.name ?? ""))
    return match?.id ?? null
  } catch {
    return null
  }
}

async function resolveAccessibleTextStyleIdById(styleId: string): Promise<string | null> {
  try {
    const style = await figma.getStyleByIdAsync(styleId)
    if (style && (style as any).type === "TEXT") return styleId
  } catch {
    // ignore
  }
  return null
}

export async function resolveTextStyleIdForPreset(preset: MockupMarkupTypographyPreset): Promise<string | null> {
  const preferred = TEXT_STYLE_ID_BY_PRESET[preset]

  // IMPORTANT: We intentionally do NOT call `figma.importStyleByKeyAsync` here.
  // In some environments this throws "Unable to create style" and can surface as an
  // unhandled promise rejection in Figma's host. We only apply typography using
  // styles that are already present in the file (local/imported).

  // 1) If the style id is accessible AND already present, we can use it safely.
  const accessibleById = await resolveAccessibleTextStyleIdById(preferred)
  if (accessibleById) {
    // If the spec historically had Description/H3 swapped, prefer local-by-name when present.
    try {
      const style = await figma.getStyleByIdAsync(preferred)
      const name = (style as any)?.name as string | undefined
      const remote = Boolean((style as any)?.remote)
      const n = (name ?? "").toLowerCase()
      if (remote) {
        // Remote styles can't reliably be applied via id unless imported into the file.
        // Fall through to local resolution by key/name.
        throw new Error("remote-style")
      }
      if (preset === "description" && n.includes("h3")) {
        return (await resolveLocalTextStyleIdByNameRegex(/description/i)) ?? preferred
      }
      if (preset === "h3" && n.includes("description")) {
        return (await resolveLocalTextStyleIdByNameRegex(/\bh3\b/i)) ?? preferred
      }
    } catch {
      // ignore
    }
    return preferred
  }

  // 2) Prefer resolving to a *local imported* style by key, when possible.
  const key = extractStyleKeyFromStyleId(preferred)
  if (key) {
    const byKey = await resolveLocalTextStyleIdByKey(key)
    if (byKey) return byKey
  }

  // As a fallback, try resolving by local style name.
  const byName =
    preset === "h1"
      ? await resolveLocalTextStyleIdByNameRegex(/\bh1\b/i)
      : preset === "h2"
        ? await resolveLocalTextStyleIdByNameRegex(/\bh2\b/i)
        : preset === "h3"
          ? await resolveLocalTextStyleIdByNameRegex(/\bh3\b/i)
          : preset === "description"
            ? await resolveLocalTextStyleIdByNameRegex(/description/i)
            : await resolveLocalTextStyleIdByNameRegex(/paragraph|body/i)

  return byName ?? null
}

export async function loadFontForTextStyleId(textStyleId: string): Promise<void> {
  try {
    const style = await figma.getStyleByIdAsync(textStyleId)
    if (style && (style as any).type === "TEXT") {
      const fontName = (style as any).fontName as FontName | undefined
      if (fontName) await figma.loadFontAsync(fontName)
    }
  } catch {
    // ignore
  }
}

export async function loadFontForTextStyle(style: TextStyle): Promise<void> {
  try {
    const fontName = (style as any).fontName as FontName | undefined
    if (fontName) await figma.loadFontAsync(fontName)
  } catch {
    // ignore
  }
}

export function makeSolidPaintBoundToColorVariable(variableId: string): SolidPaint {
  const paint: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 1 } as SolidPaint
  ;(paint as any).boundVariables = { color: { type: "VARIABLE_ALIAS", id: variableId } }
  return paint
}

function normalizeVariableId(raw: string): string {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) return ""
  const slashIdx = trimmed.indexOf("/")
  return (slashIdx >= 0 ? trimmed.slice(0, slashIdx) : trimmed).trim()
}

export async function resolveColorVariableId(rawId: string, fallbackNames: string[]): Promise<string | null> {
  const normalized = normalizeVariableId(rawId)

  // 1) Try by ID (works only if variable is local/imported).
  if (normalized) {
    try {
      const v = await figma.variables.getVariableByIdAsync(normalized)
      if (v?.id) return v.id
    } catch {
      // ignore
    }
  }

  // 2) Otherwise resolve by name from enabled libraries (imports variable by key).
  const importedId = await resolveColorVariableIdByNameFromEnabledLibraries(fallbackNames)
  if (!importedId) {
    // eslint-disable-next-line no-console
    console.log("[Mockup Markup] Color variable not found", {
      rawId,
      normalizedId: normalized || null,
      fallbackNames,
      note: "Enable the Mockup markup library OR import the variable into this file.",
    })
  }
  return importedId
}

export async function resolveColorVariableIdByNameFromEnabledLibraries(variableNameCandidates: string[]): Promise<string | null> {
  // 1) Try local variables by name (imported variables become "local" in the file).
  try {
    const locals = await figma.variables.getLocalVariablesAsync("COLOR" as any)
    for (const wanted of variableNameCandidates) {
      const match = locals.find((v) => namesMatch((v as any).name ?? "", wanted))
      if (match?.id) return match.id
    }
  } catch {
    // ignore
  }

  // 2) Search enabled libraries and import by key.
  try {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
    const preferred = collections.filter((c) => libraryNameMatches(c.libraryName, MOCKUP_MARKUP_LIBRARY_NAME))
    const rest = collections.filter((c) => !libraryNameMatches(c.libraryName, MOCKUP_MARKUP_LIBRARY_NAME))
    const ordered = preferred.length > 0 ? [...preferred, ...rest] : collections

    for (const c of ordered) {
      try {
        const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key)
        for (const wanted of variableNameCandidates) {
          const libMatch = vars.find(
            (v) => (v.resolvedType as any) === "COLOR" && namesMatch(v.name ?? "", wanted)
          )
          if (libMatch?.key) {
            const imported = await figma.variables.importVariableByKeyAsync(libMatch.key)
            if (imported?.id) return imported.id
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

export async function resolveColorVariableForPreset(preset: MockupMarkupColorPreset): Promise<string | null> {
  const rawId = COLOR_VARIABLE_ID_RAW_BY_PRESET[preset]
  const fallbackNames = getColorVariableNameCandidates(preset)
  const id = await resolveColorVariableId(rawId, fallbackNames.length > 0 ? fallbackNames : ["Unknown"])
  if (!id) {
    // eslint-disable-next-line no-console
    console.log("[Mockup Markup] Failed to resolve color preset", { preset, rawId, fallbackNames })
  }
  return id
}

export async function setExplicitModeForColorVariableCollection(variableId: string, modeName: "dark" | "light"): Promise<void> {
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId)
    const collectionId = (variable as any)?.variableCollectionId as string | undefined
    if (!collectionId) return

    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    if (!collection) return

    const modes: Array<{ modeId: string; name: string }> = Array.isArray((collection as any).modes) ? (collection as any).modes : []
    const match = modes.find((m) => (m.name ?? "").trim().toLowerCase() === modeName)
    const modeId = match?.modeId ?? null

    if (modeId) {
      // This is a *node/page* API (ExplicitVariableModesMixin). Set it on the current page
      // so the mode applies across the page.
      figma.currentPage.setExplicitVariableModeForCollection(collection, modeId)
      return
    }

    // If "Light" mode doesn't exist in this collection, clear explicit mode to fall back to defaults.
    if (modeName === "light") {
      try {
        figma.currentPage.clearExplicitVariableModeForCollection(collection)
      } catch {
        // ignore
      }
    }
  } catch {
    // eslint-disable-next-line no-console
    console.log("[Mockup Markup] Failed to set explicit variable mode", { variableId, modeName })
  }
}

