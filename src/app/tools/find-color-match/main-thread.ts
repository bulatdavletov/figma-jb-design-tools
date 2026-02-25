import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type ActiveTool,
  type UiToMainMessage,
  type FindColorMatchResultEntry,
  type FindColorMatchVariableEntry,
  type LibraryCacheStatusPayload,
} from "../../messages"
import { scanSelectionForUnboundColors } from "./scan"
import { findBestMatches, deltaE, matchPercent } from "./match"
import { applyVariableToNode } from "./apply"
import { findDefaultCollection } from "./variables"
import {
  getCachedVariablesSync,
  getVariables,
  ensureCollectionModes,
  getCachedCollections,
} from "../int-ui-kit-library/cache"
import { INT_UI_KIT_COLOR_COLLECTION_KEYS } from "../int-ui-kit-library/constants"
import type { CollectionSource, VariableCandidate } from "./types"

export function registerFindColorMatchTool(getActiveTool: () => ActiveTool) {
  let pendingTimer: number | null = null
  let collectionSources: CollectionSource[] = []
  let activeCollectionKey: string | null = null
  let activeModeId: string | null = null
  let activeGroupPrefix: string | null = null
  let backgroundCheckPromise: Promise<void> | null = null
  let activationLoadPromise: Promise<void> | null = null
  let scanVersion = 0
  const groupsPerCollection: Record<string, string[]> = {}

  const sendError = (message: string) => {
    figma.ui.postMessage({ type: MAIN_TO_UI.ERROR, message })
  }

  const sendCacheStatus = (status: LibraryCacheStatusPayload) => {
    figma.ui.postMessage({ type: MAIN_TO_UI.LIBRARY_CACHE_STATUS, status })
  }

  const sendCollections = async () => {
    const colorKeySet = new Set<string>(INT_UI_KIT_COLOR_COLLECTION_KEYS)
    const allCollections = await getCachedCollections()

    collectionSources = allCollections
      .filter((lc) => colorKeySet.has(lc.key))
      .map((lc) => ({
        key: lc.key,
        name: lc.name,
        libraryName: lc.libraryName,
        isLibrary: true,
        modes: lc.modes,
      }))

    const defaultCollection = findDefaultCollection(collectionSources)

    if (defaultCollection && defaultCollection.modes.length === 0) {
      const col = allCollections.find((c) => c.key === defaultCollection.key)
      if (col) {
        await ensureCollectionModes(col)
        defaultCollection.modes = col.modes
      }
    }

    activeCollectionKey = defaultCollection?.key ?? null
    activeModeId = defaultCollection?.modes[0]?.modeId ?? null

    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_COLLECTIONS,
      payload: {
        collections: collectionSources.map((s) => ({
          key: s.key,
          name: s.name,
          libraryName: s.libraryName,
          isLibrary: s.isLibrary,
          modes: s.modes,
        })),
        defaultCollectionKey: activeCollectionKey,
      },
    })
  }

  const extractGroups = (candidates: VariableCandidate[]): string[] => {
    const seen = new Set<string>()
    const result: string[] = []
    for (const c of candidates) {
      const slashIdx = c.variableName.indexOf("/")
      if (slashIdx > 0) {
        const group = c.variableName.substring(0, slashIdx)
        if (!seen.has(group)) {
          seen.add(group)
          result.push(group)
        }
      }
    }
    return result
  }

  const sendAllGroups = () => {
    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_GROUPS,
      groupsByCollection: { ...groupsPerCollection },
    })
  }

  const getFilteredCandidates = (candidates: VariableCandidate[]): VariableCandidate[] => {
    if (!activeGroupPrefix) return candidates
    const prefix = activeGroupPrefix + "/"
    return candidates.filter((c) => c.variableName.startsWith(prefix))
  }

  /**
   * Loads candidates via the shared cache (fingerprint-checked).
   * Sends groups to UI when the data set is new.
   */
  const loadCandidates = async (
    collectionKey = activeCollectionKey,
    modeId = activeModeId,
    onPartial?: (candidates: VariableCandidate[]) => void
  ): Promise<VariableCandidate[]> => {
    if (!collectionKey) return []

    const candidates = await getVariables(
      collectionKey,
      modeId,
      sendCacheStatus,
      undefined,
      (partialCandidates) => {
        const partialGroups = extractGroups(partialCandidates)
        const prevGroups = groupsPerCollection[collectionKey]
        if (
          !prevGroups ||
          prevGroups.length !== partialGroups.length ||
          prevGroups.some((g, i) => g !== partialGroups[i])
        ) {
          groupsPerCollection[collectionKey] = partialGroups
          sendAllGroups()
        }
        onPartial?.(partialCandidates)
      }
    )

    const newGroups = extractGroups(candidates)
    const prev = groupsPerCollection[collectionKey]
    if (!prev || prev.length !== newGroups.length || prev.some((g, i) => g !== newGroups[i])) {
      groupsPerCollection[collectionKey] = newGroups
      sendAllGroups()
    }

    return candidates
  }

  const buildEntries = (
    foundColors: Awaited<ReturnType<typeof scanSelectionForUnboundColors>>,
    candidates: VariableCandidate[]
  ): FindColorMatchResultEntry[] => {
    const filtered = getFilteredCandidates(candidates)
    const matches = findBestMatches(foundColors, filtered)

    return matches.map((m) => ({
      found: {
        hex: m.found.hex,
        r: m.found.r,
        g: m.found.g,
        b: m.found.b,
        opacity: m.found.opacity,
        nodeId: m.found.nodeId,
        nodeName: m.found.nodeName,
        colorType: m.found.colorType,
        paintIndex: m.found.paintIndex,
        sourceType: m.found.sourceType,
        sourceName: m.found.sourceName,
      },
      bestMatch: m.bestMatch
        ? {
            variableId: m.bestMatch.variableId,
            variableKey: m.bestMatch.variableKey,
            variableName: m.bestMatch.variableName,
            hex: m.bestMatch.hex,
            opacityPercent: m.bestMatch.opacityPercent,
            matchPercent: m.matchPercent,
          }
        : null,
      allMatches: m.allMatches.map((am) => ({
        variableId: am.candidate.variableId,
        variableKey: am.candidate.variableKey,
        variableName: am.candidate.variableName,
        hex: am.candidate.hex,
        opacityPercent: am.candidate.opacityPercent,
        matchPercent: am.matchPercent,
      })),
    }))
  }

  const sendEmptyResult = () => {
    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
      payload: { entries: [], collectionKey: activeCollectionKey ?? "", modeId: activeModeId },
    })
  }

  const sendSelectionEmpty = () => {
    figma.ui.postMessage({ type: MAIN_TO_UI.SELECTION_EMPTY })
  }

  /**
   * Core scan: match selection colors against candidate variables.
   * Uses cached data if available, otherwise loads via the shared cache.
   */
  const runScan = async () => {
    if (getActiveTool() !== "find-color-match-tool") return
    const runVersion = ++scanVersion
    const scanCollectionKey = activeCollectionKey
    const scanModeId = activeModeId
    if (!scanCollectionKey) {
      sendEmptyResult()
      return
    }

    if (figma.currentPage.selection.length === 0) {
      sendSelectionEmpty()
      return
    }

    const foundColors = await scanSelectionForUnboundColors()
    if (foundColors.length === 0) {
      sendEmptyResult()
      return
    }

    // Show immediate rows from whatever is already cached, then improve progressively.
    const cachedCandidates = getCachedVariablesSync(scanCollectionKey, scanModeId) ?? []
    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
      payload: {
        entries: buildEntries(foundColors, cachedCandidates),
        collectionKey: scanCollectionKey,
        modeId: scanModeId,
      },
    })

    let lastPartialSentAt = 0
    const allCandidates = await loadCandidates(scanCollectionKey, scanModeId, (partialCandidates) => {
      if (
        getActiveTool() !== "find-color-match-tool" ||
        runVersion !== scanVersion ||
        scanCollectionKey !== activeCollectionKey ||
        scanModeId !== activeModeId
      ) {
        return
      }

      const now = Date.now()
      if (now - lastPartialSentAt < 120) return
      lastPartialSentAt = now

      figma.ui.postMessage({
        type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
        payload: {
          entries: buildEntries(foundColors, partialCandidates),
          collectionKey: scanCollectionKey,
          modeId: scanModeId,
        },
      })
    })
    if (
      getActiveTool() !== "find-color-match-tool" ||
      runVersion !== scanVersion ||
      scanCollectionKey !== activeCollectionKey ||
      scanModeId !== activeModeId
    ) {
      return
    }
    const entries = buildEntries(foundColors, allCandidates)

    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
      payload: { entries, collectionKey: scanCollectionKey, modeId: scanModeId },
    })
  }

  /**
   * Runs a scan using only synchronously cached data (no API calls).
   * Returns false if no cached data was available.
   */
  const runScanFromCacheSync = async (): Promise<boolean> => {
    const scanCollectionKey = activeCollectionKey
    const scanModeId = activeModeId
    if (!scanCollectionKey) return false
    const cached = getCachedVariablesSync(scanCollectionKey, scanModeId)
    if (!cached || cached.length === 0) return false

    const newGroups = extractGroups(cached)
    const prev = groupsPerCollection[scanCollectionKey]
    if (!prev || prev.length !== newGroups.length || prev.some((g, i) => g !== newGroups[i])) {
      groupsPerCollection[scanCollectionKey] = newGroups
      sendAllGroups()
    }

    if (figma.currentPage.selection.length === 0) {
      sendSelectionEmpty()
      return true
    }

    const foundColors = await scanSelectionForUnboundColors()
    if (foundColors.length === 0) {
      sendEmptyResult()
      return true
    }

    const entries = buildEntries(foundColors, cached)
    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
      payload: { entries, collectionKey: scanCollectionKey, modeId: scanModeId },
    })
    return true
  }

  /**
   * Background check: validates cache freshness via fingerprint
   * and re-scans if data changed.
   */
  const backgroundCacheCheck = () => {
    if (backgroundCheckPromise) return
    const checkCollectionKey = activeCollectionKey
    const checkModeId = activeModeId
    if (!checkCollectionKey) return
    backgroundCheckPromise = (async () => {
      try {
        const previousCached = getCachedVariablesSync(checkCollectionKey, checkModeId)
        const fresh = await loadCandidates(checkCollectionKey, checkModeId)

        if (
          previousCached &&
          fresh !== previousCached &&
          fresh.length > 0 &&
          checkCollectionKey === activeCollectionKey &&
          checkModeId === activeModeId
        ) {
          console.log("[Find Color Match] Library data updated, re-scanning…")
          await runScan()
        }
      } catch (e) {
        console.warn("[Find Color Match] Background cache check failed:", e)
      } finally {
        backgroundCheckPromise = null
        sendCacheStatus({ state: "idle" })
      }
    })()
  }

  const runHexLookup = async (hex: string) => {
    const lookupCollectionKey = activeCollectionKey
    const lookupModeId = activeModeId
    if (!lookupCollectionKey) return

    const allCandidates = await loadCandidates(lookupCollectionKey, lookupModeId)
    if (
      getActiveTool() !== "find-color-match-tool" ||
      lookupCollectionKey !== activeCollectionKey ||
      lookupModeId !== activeModeId
    ) {
      return
    }
    const candidates = getFilteredCandidates(allCandidates)
    if (candidates.length === 0) return

    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const inputColor = { r, g, b }

    const scored = candidates
      .map((c) => ({ candidate: c, distance: deltaE(inputColor, c) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)

    const allMatches: FindColorMatchVariableEntry[] = scored.map((s) => ({
      variableId: s.candidate.variableId,
      variableKey: s.candidate.variableKey,
      variableName: s.candidate.variableName,
      hex: s.candidate.hex,
      opacityPercent: s.candidate.opacityPercent,
      matchPercent: matchPercent(s.distance),
    }))

    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_HEX_RESULT,
      payload: { hex, allMatches },
    })
  }

  const scheduleUpdate = () => {
    if (getActiveTool() !== "find-color-match-tool") return
    if (pendingTimer != null) clearTimeout(pendingTimer)
    pendingTimer = setTimeout(() => {
      pendingTimer = null
      runScan().catch((e) => sendError(e instanceof Error ? e.message : String(e)))
    }, 200) as unknown as number
  }

  figma.on("selectionchange", scheduleUpdate)

  const onMessage = async (msg: UiToMainMessage) => {
    try {
      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_SCAN) {
        await runScan()
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_SET_COLLECTION) {
        activeCollectionKey = msg.collectionKey
        activeGroupPrefix = null

        const source = collectionSources.find((s) => s.key === msg.collectionKey)
        if (source) {
          if (source.modes.length === 0) {
            const col = (await getCachedCollections()).find((c) => c.key === msg.collectionKey)
            if (col) {
              await ensureCollectionModes(col)
              source.modes = col.modes
            }
          }
          activeModeId = source.modes[0]?.modeId ?? null

          figma.ui.postMessage({
            type: MAIN_TO_UI.FIND_COLOR_MATCH_COLLECTIONS,
            payload: {
              collections: collectionSources.map((s) => ({
                key: s.key,
                name: s.name,
                libraryName: s.libraryName,
                isLibrary: s.isLibrary,
                modes: s.modes,
              })),
              defaultCollectionKey: activeCollectionKey,
            },
          })
        }

        await runScan()
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_SET_MODE) {
        activeModeId = msg.modeId
        activeGroupPrefix = null
        await runScan()
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_APPLY) {
        const { nodeId, variableId, colorType, paintIndex } = msg.request
        const result = await applyVariableToNode(nodeId, variableId, colorType, paintIndex)
        figma.ui.postMessage({
          type: MAIN_TO_UI.FIND_COLOR_MATCH_APPLY_RESULT,
          result: { ok: result.ok, reason: result.reason, nodeId, variableId },
        })
        if (result.ok) {
          figma.notify("Variable applied")
        } else {
          figma.notify(`Failed: ${result.reason ?? "unknown error"}`)
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_FOCUS_NODE) {
        const node = await figma.getNodeByIdAsync(msg.nodeId)
        if (node && "id" in node) {
          figma.currentPage.selection = [node as SceneNode]
          figma.viewport.scrollAndZoomIntoView([node as SceneNode])
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_HEX_LOOKUP) {
        await runHexLookup(msg.hex)
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_SET_GROUP) {
        activeGroupPrefix = msg.group
        await runScan()
        return true
      }
    } catch (e) {
      sendError(e instanceof Error ? e.message : String(e))
    }
    return false
  }

  return {
    onActivate: async () => {
      await sendCollections()

      const servedFromCache = await runScanFromCacheSync()

      if (servedFromCache) {
        backgroundCacheCheck()
      } else {
        if (!activationLoadPromise) {
          activationLoadPromise = runScan()
            .catch((e) => sendError(e instanceof Error ? e.message : String(e)))
            .finally(() => {
              activationLoadPromise = null
              sendCacheStatus({ state: "idle" })
            })
        }
      }
    },
    onMessage,
  }
}
