import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type ActiveTool,
  type UiToMainMessage,
  type FindColorMatchResultEntry,
  type FindColorMatchVariableEntry,
} from "../../messages"
import { scanSelectionForUnboundColors } from "./scan"
import { findBestMatches, deltaE, matchPercent } from "./match"
import { applyVariableToNode } from "./apply"
import {
  discoverCollectionSources,
  findDefaultCollection,
  loadLibraryCollectionModes,
  loadVariablesFromLibrary,
} from "./variables"
import type { CollectionSource, VariableCandidate } from "./types"

export function registerFindColorMatchTool(getActiveTool: () => ActiveTool) {
  let pendingTimer: number | null = null
  let collectionSources: CollectionSource[] = []
  let activeCollectionKey: string | null = null
  let activeModeId: string | null = null
  let candidateCache: VariableCandidate[] = []
  let candidateCacheKey = ""
  let preloadPromise: Promise<void> | null = null

  const sendError = (message: string) => {
    figma.ui.postMessage({ type: MAIN_TO_UI.ERROR, message })
  }

  const sendCollections = async () => {
    collectionSources = await discoverCollectionSources()
    const defaultCollection = findDefaultCollection(collectionSources)

    if (defaultCollection && defaultCollection.modes.length === 0) {
      const modes = await loadLibraryCollectionModes(defaultCollection.key)
      defaultCollection.modes = modes
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

  const loadCandidates = async (): Promise<VariableCandidate[]> => {
    if (!activeCollectionKey) return []

    const cacheKey = `${activeCollectionKey}:${activeModeId ?? "default"}`
    if (cacheKey === candidateCacheKey && candidateCache.length > 0) {
      return candidateCache
    }

    const source = collectionSources.find((s) => s.key === activeCollectionKey)
    if (!source) return []

    const candidates = await loadVariablesFromLibrary(
      activeCollectionKey,
      activeModeId,
      (progress) => {
        figma.ui.postMessage({
          type: MAIN_TO_UI.FIND_COLOR_MATCH_PROGRESS,
          progress,
        })
      }
    )

    candidateCache = candidates
    candidateCacheKey = cacheKey
    return candidates
  }

  const preloadCandidatesInBackground = () => {
    if (preloadPromise) return
    preloadPromise = loadCandidates()
      .then(() => { console.log(`[Find Color Match] Preloaded ${candidateCache.length} candidates`) })
      .catch((e) => { console.warn("[Find Color Match] Preload failed:", e) })
      .finally(() => { preloadPromise = null })
  }

  const runScan = async () => {
    if (getActiveTool() !== "find-color-match-tool") return

    if (figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
        payload: { entries: [], collectionKey: activeCollectionKey ?? "", modeId: activeModeId },
      })
      return
    }

    const foundColors = await scanSelectionForUnboundColors()
    if (foundColors.length === 0) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
        payload: { entries: [], collectionKey: activeCollectionKey ?? "", modeId: activeModeId },
      })
      return
    }

    if (preloadPromise) await preloadPromise
    const candidates = await loadCandidates()
    const matches = findBestMatches(foundColors, candidates)

    const entries: FindColorMatchResultEntry[] = matches.map((m) => ({
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

    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
      payload: { entries, collectionKey: activeCollectionKey ?? "", modeId: activeModeId },
    })
  }

  const runHexLookup = async (hex: string) => {
    if (preloadPromise) await preloadPromise
    const candidates = await loadCandidates()
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
        candidateCache = []
        candidateCacheKey = ""

        const source = collectionSources.find((s) => s.key === msg.collectionKey)
        if (source) {
          if (source.modes.length === 0) {
            const modes = await loadLibraryCollectionModes(msg.collectionKey)
            source.modes = modes
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

        preloadCandidatesInBackground()
        await runScan()
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_SET_MODE) {
        activeModeId = msg.modeId
        candidateCache = []
        candidateCacheKey = ""
        preloadCandidatesInBackground()
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
    } catch (e) {
      sendError(e instanceof Error ? e.message : String(e))
    }
    return false
  }

  return {
    onActivate: async () => {
      await sendCollections()
      preloadCandidatesInBackground()
      scheduleUpdate()
    },
    onMessage,
  }
}
