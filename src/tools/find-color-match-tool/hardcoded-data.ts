/**
 * Loads Int UI Kit Islands variables from shared JSON files in figma-exports/ for instant matching.
 * When you rename or add variables in the library, update these JSON files manually
 * (e.g. re-export from the Export tool).
 */

import type { ResolvedColorVariable } from "../../utils/int-ui-kit-library/resolve"

import colorPaletteJson from "../../../figma-exports/Int UI Kit  Islands. Color palette.json"
import semanticColorsJson from "../../../figma-exports/Int UI Kit  Islands. Semantic colors.json"

// ---------------------------------------------------------------------------
// JSON shape (minimal types for what we use)
// ---------------------------------------------------------------------------

type HardcodedFile = {
  collections: Array<{
    name: string
    modes: string[]
    variables: Record<string, unknown>
  }>
}

type VariableLeaf = {
  id: string
  /** Library variable key (from team library API). Required for Apply to work with hardcoded data. */
  key?: string
  type: string
  values: Record<string, string | { $alias: string }>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse hex (#RRGGBB or #RRGGBBAA) to rgb 0–1 and opacity 0–100.
 * Always returns hex6 (e.g. #RRGGBB) so UI ColorSwatch (which only accepts 6-digit) can display.
 */
function hexToRgb01(hex: string): { r: number; g: number; b: number; opacityPercent: number; hex6: string } {
  const clean = hex.startsWith("#") ? hex.slice(1) : hex
  const hasAlpha = clean.length === 8
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const opacityPercent = hasAlpha
    ? Math.round((parseInt(clean.slice(6, 8), 16) / 255) * 100)
    : 100
  const hex6 = "#" + clean.slice(0, 6)
  return { r, g, b, opacityPercent, hex6 }
}

function isVariableLeaf(v: unknown): v is VariableLeaf {
  if (typeof v !== "object" || v === null) return false
  const o = v as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.type === "string" &&
    typeof o.values === "object" &&
    o.values !== null
  )
}

/** Flatten nested variable trees; collect only color leaves. */
function flattenColorVariables(
  vars: Record<string, unknown>,
  prefix: string
): Array<{ name: string; id: string; key?: string; values: Record<string, string | { $alias: string }> }> {
  const result: Array<{
    name: string
    id: string
    key?: string
    values: Record<string, string | { $alias: string }>
  }> = []
  for (const [k, v] of Object.entries(vars)) {
    if (typeof v !== "object" || v === null) continue
    const o = v as Record<string, unknown>
    if (isVariableLeaf(o) && o.type === "color") {
      result.push({
        name: prefix ? `${prefix}/${k}` : k,
        id: o.id,
        key: typeof o.key === "string" ? o.key : undefined,
        values: o.values as Record<string, string | { $alias: string }>,
      })
    } else if (typeof o === "object" && !("type" in o)) {
      result.push(
        ...flattenColorVariables(o as Record<string, unknown>, prefix ? `${prefix}/${k}` : k)
      )
    }
  }
  return result
}

/**
 * Resolve value to hex: direct hex string, or "$alias" → lookup by variable name.
 * Accepts multiple lookup tables (checked in order) so both palette and
 * intra-collection aliases resolve correctly.
 */
function resolveValue(
  value: string | { $alias: string },
  ...lookups: Record<string, string>[]
): string | null {
  if (typeof value === "string") {
    return value
  }
  if (value && typeof value.$alias === "string") {
    const alias = value.$alias
    const colon = alias.indexOf(":")
    const varName = colon >= 0 ? alias.slice(colon + 1).trim() : alias
    for (const lookup of lookups) {
      const hex = lookup[varName]
      if (hex) return hex
    }
    return null
  }
  return null
}

// ---------------------------------------------------------------------------
// Build resolved data once at module load
// ---------------------------------------------------------------------------

const HARDCODED_COLLECTION_NAMES = ["Color palette", "Semantic colors"] as const

/** collectionName -> modeName -> ResolvedColorVariable[] */
const resolvedByCollectionAndMode = new Map<
  string,
  Map<string, ResolvedColorVariable[]>
>()

/** Color palette variable name -> hex (Default mode). Used to resolve Semantic aliases. */
let paletteHexByVarName: Record<string, string> = {}

function buildResolved(): void {
  if (resolvedByCollectionAndMode.size > 0) return

  const colorPaletteData = colorPaletteJson as unknown as HardcodedFile
  const semanticColorsData = semanticColorsJson as unknown as HardcodedFile

  const paletteColl = colorPaletteData.collections.find((c) => c.name === "Color palette")
  const semanticColl = semanticColorsData.collections.find((c) => c.name === "Semantic colors")

  if (paletteColl) {
    paletteHexByVarName = {}
    const modeName = paletteColl.modes[0] ?? "Default"
    const list: ResolvedColorVariable[] = []
    for (const [varName, v] of Object.entries(paletteColl.variables)) {
      if (!isVariableLeaf(v) || v.type !== "color") continue
      const hex = resolveValue(v.values[modeName], {})
      if (!hex) continue
      paletteHexByVarName[varName] = hex
      const { r, g, b, opacityPercent, hex6 } = hexToRgb01(hex)
      list.push({
        variableId: v.id,
        variableKey: (v as VariableLeaf).key ?? v.id,
        variableName: varName,
        collectionKey: "", // filled by caller
        collectionName: paletteColl.name,
        hex: hex6,
        r,
        g,
        b,
        opacityPercent,
      })
    }
    const byMode = new Map<string, ResolvedColorVariable[]>()
    byMode.set(modeName, list)
    resolvedByCollectionAndMode.set(paletteColl.name, byMode)
  }

  if (semanticColl) {
    const flat = flattenColorVariables(semanticColl.variables, "")
    const byMode = new Map<string, ResolvedColorVariable[]>()
    for (const modeName of semanticColl.modes) {
      // Multi-pass resolution: semantic vars can alias other semantic vars
      // (e.g. container/popup-bg → layer/layer-1-bg → palette color).
      // Pass 1: resolve direct hex and palette aliases.
      // Pass 2+: resolve remaining intra-collection aliases using already-resolved values.
      const semanticHexByName: Record<string, string> = {}
      const pending = new Map<
        string,
        { name: string; id: string; key?: string; value: string | { $alias: string } }
      >()

      for (const { name, id, key, values } of flat) {
        const value = values[modeName]
        if (value === undefined) continue
        const hex = resolveValue(value, paletteHexByVarName)
        if (hex) {
          semanticHexByName[name] = hex
        } else {
          pending.set(name, { name, id, key, value })
        }
      }

      // Iteratively resolve intra-collection aliases (max 5 passes for deep chains)
      for (let pass = 0; pass < 5 && pending.size > 0; pass++) {
        let resolvedAny = false
        for (const [pName, entry] of Array.from(pending.entries())) {
          const hex = resolveValue(entry.value, paletteHexByVarName, semanticHexByName)
          if (hex) {
            semanticHexByName[pName] = hex
            pending.delete(pName)
            resolvedAny = true
          }
        }
        if (!resolvedAny) break
      }

      // Build final resolved list from all resolved variables
      const list: ResolvedColorVariable[] = []
      for (const { name, id, key } of flat) {
        const hex = semanticHexByName[name]
        if (!hex) continue
        const { r, g, b, opacityPercent, hex6 } = hexToRgb01(hex)
        list.push({
          variableId: id,
          variableKey: key ?? id,
          variableName: name,
          collectionKey: "",
          collectionName: semanticColl.name,
          hex: hex6,
          r,
          g,
          b,
          opacityPercent,
        })
      }
      byMode.set(modeName, list)
    }
    resolvedByCollectionAndMode.set(semanticColl.name, byMode)
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Collection names that have hardcoded data (for quick check). */
export function getHardcodedCollectionNames(): string[] {
  buildResolved()
  return Array.from(resolvedByCollectionAndMode.keys())
}

/** Returns mode names available in hardcoded JSON for the given collection. */
export function getHardcodedModeNames(collectionName: string): string[] {
  buildResolved()
  const byMode = resolvedByCollectionAndMode.get(collectionName)
  if (!byMode) return []
  return Array.from(byMode.keys())
}

/**
 * Returns resolved color variables from hardcoded JSON for the given collection name and mode.
 * Returns null if no hardcoded data for that collection, or empty array if collection exists but no variables for that mode.
 * Caller should fill in collectionKey on each variable when using with Figma (for consistency).
 */
export function getHardcodedVariables(
  collectionName: string,
  modeName: string
): ResolvedColorVariable[] | null {
  buildResolved()
  const byMode = resolvedByCollectionAndMode.get(collectionName)
  if (!byMode) return null
  const list = byMode.get(modeName) ?? []
  return list
}

/**
 * Returns ordered top-level groups (prefix before first `/`) for hardcoded variables.
 * Group order follows variable order from the hardcoded JSON.
 * Results are cached per collection+mode to avoid recomputation on repeated calls.
 */
const groupsCache = new Map<string, string[]>()

export function getHardcodedGroups(collectionName: string, modeName: string): string[] {
  const cacheKey = `${collectionName}::${modeName}`
  const cached = groupsCache.get(cacheKey)
  if (cached) return cached

  const vars = getHardcodedVariables(collectionName, modeName) ?? []
  const seen = new Set<string>()
  const groups: string[] = []
  for (const v of vars) {
    const slashIdx = v.variableName.indexOf("/")
    if (slashIdx <= 0) continue
    const group = v.variableName.slice(0, slashIdx)
    if (!seen.has(group)) {
      seen.add(group)
      groups.push(group)
    }
  }
  groupsCache.set(cacheKey, groups)
  return groups
}
