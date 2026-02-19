import { colorToRgbHex, colorToOpacityPercent, resolveChainForMode } from "../../variable-chain"
import { getAllCollections } from "../variables-shared/caching"
import type { CollectionSource, VariableCandidate, FindColorMatchProgress } from "./types"
import { INT_UI_KIT_LIBRARY_NAME } from "./types"

export async function discoverCollectionSources(): Promise<CollectionSource[]> {
  const sources: CollectionSource[] = []

  try {
    const libraryCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
    for (const lc of libraryCollections) {
      sources.push({
        key: lc.key,
        name: lc.name,
        libraryName: lc.libraryName ?? null,
        isLibrary: true,
        modes: [],
      })
    }
  } catch {
    // Team library API may fail if no libraries are enabled
  }

  try {
    const localCollections = await getAllCollections()
    for (const lc of localCollections) {
      sources.push({
        key: lc.id,
        name: lc.name,
        libraryName: null,
        isLibrary: false,
        modes: lc.modes.map((m) => ({ modeId: m.modeId, modeName: m.name })),
      })
    }
  } catch {
    // Local collections API may fail
  }

  return sources
}

export function findDefaultCollection(sources: CollectionSource[]): CollectionSource | null {
  const intUiKit = sources.find(
    (s) => s.isLibrary && (s.libraryName ?? "").trim().toLowerCase() === INT_UI_KIT_LIBRARY_NAME.toLowerCase()
  )
  if (intUiKit) return intUiKit
  return sources.length > 0 ? sources[0] : null
}

export async function loadLibraryCollectionModes(collectionKey: string): Promise<Array<{ modeId: string; modeName: string }>> {
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

export async function loadVariablesFromLibrary(
  collectionKey: string,
  modeId: string | null,
  onProgress?: (progress: FindColorMatchProgress) => void
): Promise<VariableCandidate[]> {
  const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionKey)
  const colorVars = libraryVars.filter((v) => v.resolvedType === "COLOR")

  if (colorVars.length === 0) return []

  const candidates: VariableCandidate[] = []
  const total = colorVars.length

  for (let i = 0; i < colorVars.length; i++) {
    const lv = colorVars[i]

    if (onProgress && i % 10 === 0) {
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

      const hex = resolved.finalHex
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255

      candidates.push({
        variableId: imported.id,
        variableKey: lv.key,
        variableName: imported.name,
        collectionKey,
        collectionName: collection.name,
        hex,
        r,
        g,
        b,
        opacityPercent: resolved.finalOpacityPercent ?? 100,
      })
    } catch {
      // Skip variables that fail to import/resolve
    }
  }

  if (onProgress) {
    onProgress({ current: total, total, message: `Loaded ${candidates.length} color variables` })
  }

  return candidates
}

export async function loadVariablesFromLocal(
  collectionId: string,
  modeId: string | null
): Promise<VariableCandidate[]> {
  const allVars = await figma.variables.getLocalVariablesAsync("COLOR")
  const filtered = allVars.filter((v) => v.variableCollectionId === collectionId)

  const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
  if (!collection) return []

  const effectiveModeId = modeId ?? collection.modes[0]?.modeId
  if (!effectiveModeId) return []

  const candidates: VariableCandidate[] = []

  for (const variable of filtered) {
    try {
      const resolved = await resolveChainForMode(variable, effectiveModeId)
      if (!resolved.finalHex) continue

      const hex = resolved.finalHex
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255

      candidates.push({
        variableId: variable.id,
        variableKey: "",
        variableName: variable.name,
        collectionKey: collectionId,
        collectionName: collection.name,
        hex,
        r,
        g,
        b,
        opacityPercent: resolved.finalOpacityPercent ?? 100,
      })
    } catch {
      // Skip variables that fail to resolve
    }
  }

  return candidates
}
