import {
  discoverIntUiKitCollections,
  loadLibraryCollectionModes as loadLibModes,
  loadAndResolveLibraryColorVariables,
} from "../int-ui-kit-library/resolve"
import { INT_UI_KIT_COLOR_COLLECTION_KEYS } from "../int-ui-kit-library/constants"
import type { CollectionSource, VariableCandidate, LoadProgress } from "./types"

export async function discoverCollectionSources(): Promise<CollectionSource[]> {
  const colorKeySet = new Set<string>(INT_UI_KIT_COLOR_COLLECTION_KEYS)
  const intUiKitCollections = await discoverIntUiKitCollections()

  return intUiKitCollections
    .filter((lc) => colorKeySet.has(lc.key))
    .map((lc) => ({
      key: lc.key,
      name: lc.name,
      libraryName: lc.libraryName,
      isLibrary: true,
      modes: lc.modes,
    }))
}

export function findDefaultCollection(sources: CollectionSource[]): CollectionSource | null {
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
