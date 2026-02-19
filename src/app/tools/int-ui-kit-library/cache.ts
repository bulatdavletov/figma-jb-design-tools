/**
 * Shared in-memory cache for Int UI Kit library data.
 *
 * Fingerprint-based invalidation: on each access we compare
 * a lightweight fingerprint (sorted COLOR variable keys) against
 * the cached one. If they match → return cached data instantly.
 * If not → reload from Figma API.
 *
 * Used by Find Color Match and any future tool that reads
 * Int UI Kit variables.
 */

import {
  discoverIntUiKitCollections,
  loadAndResolveLibraryColorVariables,
  loadLibraryCollectionModes,
  type LibraryCollectionInfo,
  type LoadProgress,
  type ResolvedColorVariable,
} from "./resolve"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LibraryCacheStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "updating"; current: number; total: number; message: string }
  | { state: "ready" }

type CacheEntry = {
  variables: ResolvedColorVariable[]
  fingerprint: string
  timestamp: number
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let collectionsCache: LibraryCollectionInfo[] | null = null
const variableCache = new Map<string, CacheEntry>()

function cacheKey(collectionKey: string, modeId: string | null): string {
  return `${collectionKey}:${modeId ?? "default"}`
}

// ---------------------------------------------------------------------------
// Fingerprinting
// ---------------------------------------------------------------------------

async function computeFingerprint(collectionKey: string): Promise<string> {
  const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionKey)
  const colorKeys = vars
    .filter((v) => v.resolvedType === "COLOR")
    .map((v) => v.key)
    .sort()
  return `${colorKeys.length}:${colorKeys.join(",")}`
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns discovered collections, caching after the first call.
 * Pass `forceRefresh` to re-query the Figma API.
 */
export async function getCachedCollections(forceRefresh = false): Promise<LibraryCollectionInfo[]> {
  if (collectionsCache && !forceRefresh) return collectionsCache
  collectionsCache = await discoverIntUiKitCollections()
  return collectionsCache
}

/**
 * Ensures modes are loaded for a collection (mutates the cached entry).
 */
export async function ensureCollectionModes(collection: LibraryCollectionInfo): Promise<void> {
  if (collection.modes.length > 0) return
  collection.modes = await loadLibraryCollectionModes(collection.key)
}

/**
 * Returns cached variables synchronously. Returns `null` when no
 * cached data is available (caller must use `getVariables` instead).
 */
export function getCachedVariablesSync(
  collectionKey: string,
  modeId: string | null
): ResolvedColorVariable[] | null {
  return variableCache.get(cacheKey(collectionKey, modeId))?.variables ?? null
}

/**
 * Main entry point. Returns variables for the given collection+mode,
 * using the fingerprint cache to avoid redundant reloads.
 *
 * Flow:
 *  1. If cached → compute fingerprint (1 lightweight API call)
 *     a. fingerprint matches → return cached
 *     b. fingerprint differs → full reload
 *  2. If not cached → full reload
 */
export async function getVariables(
  collectionKey: string,
  modeId: string | null,
  onStatus?: (status: LibraryCacheStatus) => void,
  onProgress?: (progress: LoadProgress) => void
): Promise<ResolvedColorVariable[]> {
  const key = cacheKey(collectionKey, modeId)
  const existing = variableCache.get(key)

  if (existing) {
    onStatus?.({ state: "checking" })
    try {
      const fp = await computeFingerprint(collectionKey)
      if (fp === existing.fingerprint) {
        console.log(`[LibCache] Cache hit for ${key} (fingerprint match)`)
        onStatus?.({ state: "ready" })
        return existing.variables
      }
      console.log(`[LibCache] Fingerprint changed for ${key}, reloading…`)
    } catch (e) {
      console.warn("[LibCache] Fingerprint check failed, returning cached data:", e)
      onStatus?.({ state: "ready" })
      return existing.variables
    }
  }

  onStatus?.({ state: "updating", current: 0, total: 0, message: "Loading library…" })

  const variables = await loadAndResolveLibraryColorVariables(
    collectionKey,
    modeId,
    (p) => {
      onStatus?.({ state: "updating", current: p.current, total: p.total, message: p.message })
      onProgress?.(p)
    }
  )

  let fingerprint = ""
  try {
    fingerprint = await computeFingerprint(collectionKey)
  } catch {
    // non-critical — next access will just reload
  }

  variableCache.set(key, { variables, fingerprint, timestamp: Date.now() })
  console.log(`[LibCache] Cached ${variables.length} variables for ${key}`)

  onStatus?.({ state: "ready" })
  return variables
}

/**
 * Clears all cached data (collections + variables).
 */
export function invalidateAll(): void {
  collectionsCache = null
  variableCache.clear()
  console.log("[LibCache] All caches invalidated")
}
