import { resolveChainForMode } from "../../variable-chain"
import { getAllCollections } from "../variables-shared/caching"
import {
  discoverIntUiKitCollections,
  loadLibraryCollectionModes as loadLibModes,
  loadAndResolveLibraryColorVariables,
} from "../int-ui-kit-library/resolve"
import type { CollectionSource, VariableCandidate, LoadProgress } from "./types"

export async function discoverCollectionSources(): Promise<CollectionSource[]> {
  const sources: CollectionSource[] = []

  const intUiKitCollections = await discoverIntUiKitCollections()
  for (const lc of intUiKitCollections) {
    sources.push({
      key: lc.key,
      name: lc.name,
      libraryName: lc.libraryName,
      isLibrary: true,
      modes: lc.modes,
    })
  }

  try {
    const allLibraryCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
    const intUiKitKeys = new Set(intUiKitCollections.map((c) => c.key))
    for (const lc of allLibraryCollections) {
      if (intUiKitKeys.has(lc.key)) continue
      sources.push({
        key: lc.key,
        name: lc.name,
        libraryName: lc.libraryName ?? null,
        isLibrary: true,
        modes: [],
      })
    }
  } catch {
    // Other library collections may fail
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
    // Local collections may fail
  }

  return sources
}

export function findDefaultCollection(sources: CollectionSource[]): CollectionSource | null {
  const intUiKit = sources.find((s) => s.isLibrary && s.libraryName != null)
  if (intUiKit) return intUiKit
  return sources.length > 0 ? sources[0] : null
}

export async function loadLibraryCollectionModes(collectionKey: string) {
  return loadLibModes(collectionKey)
}

export async function loadVariablesFromLibrary(
  collectionKey: string,
  modeId: string | null,
  onProgress?: (progress: LoadProgress) => void
): Promise<VariableCandidate[]> {
  return loadAndResolveLibraryColorVariables(collectionKey, modeId, onProgress)
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
