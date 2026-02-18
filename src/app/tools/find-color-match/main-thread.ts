import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type ActiveTool,
  type UiToMainMessage,
  type FindColorMatchResultEntry,
} from "../../messages"
import { scanSelectionForUnboundColors } from "./scan"
import { findBestMatches } from "./match"
import { applyVariableToNode } from "./apply"
import {
  discoverCollectionSources,
  findDefaultCollection,
  loadLibraryCollectionModes,
  loadVariablesFromLibrary,
  loadVariablesFromLocal,
} from "./variables"
import type { CollectionSource, VariableCandidate } from "./types"

export function registerFindColorMatchTool(getActiveTool: () => ActiveTool) {
  let pendingTimer: number | null = null
  let collectionSources: CollectionSource[] = []
  let activeCollectionKey: string | null = null
  let activeModeId: string | null = null
  let candidateCache: VariableCandidate[] = []
  let candidateCacheKey = ""

  const sendError = (message: string) => {
    figma.ui.postMessage({ type: MAIN_TO_UI.ERROR, message })
  }

  const sendCollections = async () => {
    collectionSources = await discoverCollectionSources()
    const defaultCollection = findDefaultCollection(collectionSources)

    if (defaultCollection && defaultCollection.isLibrary && defaultCollection.modes.length === 0) {
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

    let candidates: VariableCandidate[]
    if (source.isLibrary) {
      candidates = await loadVariablesFromLibrary(
        activeCollectionKey,
        activeModeId,
        (progress) => {
          figma.ui.postMessage({
            type: MAIN_TO_UI.FIND_COLOR_MATCH_PROGRESS,
            progress,
          })
        }
      )
    } else {
      candidates = await loadVariablesFromLocal(activeCollectionKey, activeModeId)
    }

    candidateCache = candidates
    candidateCacheKey = cacheKey
    return candidates
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
            diffPercent: m.diffPercent,
          }
        : null,
      allMatches: m.allMatches.map((am) => ({
        variableId: am.candidate.variableId,
        variableKey: am.candidate.variableKey,
        variableName: am.candidate.variableName,
        hex: am.candidate.hex,
        opacityPercent: am.candidate.opacityPercent,
        diffPercent: am.diffPercent,
      })),
    }))

    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
      payload: { entries, collectionKey: activeCollectionKey ?? "", modeId: activeModeId },
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
          if (source.isLibrary && source.modes.length === 0) {
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

        await runScan()
        return true
      }

      if (msg.type === UI_TO_MAIN.FIND_COLOR_MATCH_SET_MODE) {
        activeModeId = msg.modeId
        candidateCache = []
        candidateCacheKey = ""
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
    } catch (e) {
      sendError(e instanceof Error ? e.message : String(e))
    }
    return false
  }

  return {
    onActivate: async () => {
      await sendCollections()
      scheduleUpdate()
    },
    onMessage,
  }
}
