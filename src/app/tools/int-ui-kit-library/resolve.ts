/**
 * Core resolution logic for the "Int UI Kit: Islands" library.
 * Shared module — used by Find Color Match and any future tools
 * that need to access Int UI Kit variables.
 *
 * Resolution approach:
 *   1. Discover library collections via teamLibrary API
 *   2. Filter by INT_UI_KIT_LIBRARY_NAME
 *   3. Import variables via importVariableByKeyAsync (keys survive renames)
 *   4. Resolve alias chains to final color values per mode
 */

import { resolveChainForMode } from "../../variable-chain"
import { INT_UI_KIT_LIBRARY_NAME } from "./constants"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CollectionMode = {
  modeId: string
  modeName: string
}

export type LibraryCollectionInfo = {
  key: string
  name: string
  libraryName: string
  modes: CollectionMode[]
}

export type ResolvedColorVariable = {
  variableId: string
  variableKey: string
  variableName: string
  collectionKey: string
  collectionName: string
  hex: string
  r: number
  g: number
  b: number
  opacityPercent: number
}

export type LoadProgress = {
  current: number
  total: number
  message: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function libraryNameMatches(candidate: string): boolean {
  return (candidate ?? "").trim().toLowerCase() === INT_UI_KIT_LIBRARY_NAME.toLowerCase()
}

function hexToRgb01(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  }
}

// ---------------------------------------------------------------------------
// Collection discovery
// ---------------------------------------------------------------------------

/**
 * Discovers all Int UI Kit: Islands collections available via the team library.
 * Returns empty array if the library is not enabled.
 */
export async function discoverIntUiKitCollections(): Promise<LibraryCollectionInfo[]> {
  try {
    const all = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()

    console.log(
      "[Int UI Kit] Available library variable collections:",
      all.map((c) => ({ key: c.key, name: c.name, libraryName: c.libraryName }))
    )

    const matched = all.filter((c) => libraryNameMatches(c.libraryName))

    if (matched.length === 0) {
      console.warn(
        `[Int UI Kit] No collections found for "${INT_UI_KIT_LIBRARY_NAME}". ` +
        `Enable the library in Assets → Libraries. Available libraries: ` +
        Array.from(new Set(all.map((c) => c.libraryName))).join(", ")
      )
    } else {
      console.log(
        `[Int UI Kit] Matched ${matched.length} collection(s):`,
        matched.map((c) => ({ key: c.key, name: c.name }))
      )
      for (const c of matched) {
        console.log(`🔑 COLLECTION KEY: "${c.key}"  —  name: "${c.name}"  library: "${c.libraryName}"`)
      }
    }

    return matched.map((c) => ({
      key: c.key,
      name: c.name,
      libraryName: c.libraryName,
      modes: [],
    }))
  } catch (e) {
    console.error("[Int UI Kit] Failed to discover collections:", e)
    return []
  }
}

/**
 * Loads the modes for a library collection by importing one variable
 * and reading its parent collection's modes.
 */
export async function loadLibraryCollectionModes(collectionKey: string): Promise<CollectionMode[]> {
  try {
    const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionKey)
    if (vars.length === 0) return []

    const first = await figma.variables.importVariableByKeyAsync(vars[0].key)
    if (!first) return []

    const collection = await figma.variables.getVariableCollectionByIdAsync(first.variableCollectionId)
    if (!collection) return []

    return collection.modes.map((m) => ({ modeId: m.modeId, modeName: m.name }))
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Variable loading + resolution
// ---------------------------------------------------------------------------

/**
 * Loads all COLOR variables from a library collection, imports them,
 * and resolves each to its final HEX value for the given mode.
 *
 * This may be slow for large libraries — use onProgress for UI feedback.
 */
export async function loadAndResolveLibraryColorVariables(
  collectionKey: string,
  modeId: string | null,
  onProgress?: (progress: LoadProgress) => void,
  onPartial?: (variables: ResolvedColorVariable[], progress: LoadProgress) => void
): Promise<ResolvedColorVariable[]> {
  const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionKey)
  const colorVars = libraryVars.filter((v) => v.resolvedType === "COLOR")

  if (colorVars.length === 0) return []

  const results: ResolvedColorVariable[] = []
  const total = colorVars.length
  const progressStep = 2

  for (let i = 0; i < colorVars.length; i++) {
    const lv = colorVars[i]

    if (onProgress && i % progressStep === 0) {
      onProgress({ current: i, total, message: `Loading variables… ${i}/${total}` })
      await new Promise((r) => setTimeout(r, 0))
    }

    try {
      const imported = await figma.variables.importVariableByKeyAsync(lv.key)
      if (!imported) continue

      const collection = await figma.variables.getVariableCollectionByIdAsync(imported.variableCollectionId)
      if (!collection) continue

      const effectiveModeId = modeId ?? collection.modes[0]?.modeId
      if (!effectiveModeId) continue

      const resolved = await resolveChainForMode(imported, effectiveModeId)
      if (!resolved.finalHex) continue

      const rgb = hexToRgb01(resolved.finalHex)

      results.push({
        variableId: imported.id,
        variableKey: lv.key,
        variableName: imported.name,
        collectionKey,
        collectionName: collection.name,
        hex: resolved.finalHex,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        opacityPercent: resolved.finalOpacityPercent ?? 100,
      })

      if (
        onPartial &&
        (results.length === 1 || results.length % progressStep === 0 || i === colorVars.length - 1)
      ) {
        onPartial(results.slice(), { current: i + 1, total, message: `Loading variables… ${i + 1}/${total}` })
      }
    } catch {
      // Skip variables that fail to import/resolve
    }
  }

  if (onProgress) {
    onProgress({ current: total, total, message: `Loaded ${results.length} color variables` })
  }

  return results
}

/**
 * Resolves a single library variable by key (import + resolve chain).
 * Useful for targeted lookups when you already know the variable key.
 */
export async function resolveLibraryColorVariable(
  variableKey: string,
  modeId: string
): Promise<ResolvedColorVariable | null> {
  try {
    const imported = await figma.variables.importVariableByKeyAsync(variableKey)
    if (!imported) return null

    const collection = await figma.variables.getVariableCollectionByIdAsync(imported.variableCollectionId)
    if (!collection) return null

    const resolved = await resolveChainForMode(imported, modeId)
    if (!resolved.finalHex) return null

    const rgb = hexToRgb01(resolved.finalHex)

    return {
      variableId: imported.id,
      variableKey,
      variableName: imported.name,
      collectionKey: collection.id,
      collectionName: collection.name,
      hex: resolved.finalHex,
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      opacityPercent: resolved.finalOpacityPercent ?? 100,
    }
  } catch {
    return null
  }
}
