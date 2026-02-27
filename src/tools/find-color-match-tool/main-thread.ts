import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type ActiveTool,
  type UiToMainMessage,
  type FindColorMatchResultEntry,
  type FindColorMatchVariableEntry,
  type LibraryCacheStatusPayload,
} from "../../home/messages"
import { scanSelectionForUnboundColors } from "./scan"
import { findBestMatches, deltaE, matchPercent } from "./match"
import { applyVariableToNode } from "./apply"
import {
  discoverCollectionSources,
  findDefaultCollection,
  loadLibraryCollectionModes,
} from "./variables"
import { getHardcodedVariables } from "./hardcoded-data"
import { loadAndResolveLibraryColorVariables } from "../../utils/int-ui-kit-library/resolve"
import type { CollectionSource, VariableCandidate } from "./types"

export function registerFindColorMatchTool(getActiveTool: () => ActiveTool) {
  let pendingTimer: number | null = null
  let collectionSources: CollectionSource[] = []
  let activeCollectionKey: string | null = null
  let activeModeId: string | null = null
  let activeGroupPrefix: string | null = null
  let activationLoadPromise: Promise<void> | null = null
  let scanVersion = 0
  const groupsPerCollection: Record<string, string[]> = {}
  /** Session-only: last loaded variables for current collection+mode (no persistent cache). */
  let lastLoadedCandidates: {
    collectionKey: string
    modeId: string | null
    candidates: VariableCandidate[]
  } | null = null

  const sendError = (message: string) => {
    figma.ui.postMessage({ type: MAIN_TO_UI.ERROR, message })
  }

  const sendCacheStatus = (status: LibraryCacheStatusPayload) => {
    figma.ui.postMessage({ type: MAIN_TO_UI.LIBRARY_CACHE_STATUS, status })
  }

  const sendCollections = async () => {
    collectionSources = await discoverCollectionSources()

    const defaultCollection = findDefaultCollection(collectionSources)

    if (defaultCollection && defaultCollection.modes.length === 0) {
      defaultCollection.modes = await loadLibraryCollectionModes(defaultCollection.key)
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
   * Loads candidates: tries hardcoded JSON first (instant), else from Figma (team library).
   * Stores result in session-only lastLoadedCandidates. Sends progress via sendCacheStatus.
   */
  const loadCandidates = async (
    collectionKey = activeCollectionKey,
    modeId = activeModeId,
    onPartial?: (candidates: VariableCandidate[]) => void
  ): Promise<VariableCandidate[]> => {
    if (!collectionKey) return []

    const source = collectionSources.find((s) => s.key === collectionKey)
    const modeName = source?.modes.find((m) => m.modeId === modeId)?.modeName
    if (source?.name && modeName !== undefined) {
      const hardcoded = getHardcodedVariables(source.name, modeName)
      if (hardcoded && hardcoded.length > 0) {
        const candidates = hardcoded.map((v) => ({ ...v, collectionKey }))
        lastLoadedCandidates = { collectionKey, modeId, candidates }
        const newGroups = extractGroups(candidates)
        const prev = groupsPerCollection[collectionKey]
        if (!prev || prev.length !== newGroups.length || prev.some((g, i) => g !== newGroups[i])) {
          groupsPerCollection[collectionKey] = newGroups
          sendAllGroups()
        }
        sendCacheStatus({ state: "ready" })
        return candidates
      }
    }

    sendCacheStatus({ state: "updating", current: 0, total: 0, message: "Loading library…" })

    const candidates = await loadAndResolveLibraryColorVariables(
      collectionKey,
      modeId,
      (p) => {
        sendCacheStatus({
          state: "updating",
          current: p.current,
          total: p.total,
          message: p.message,
        })
      },
      (partialCandidates, p) => {
        sendCacheStatus({
          state: "updating",
          current: p.current,
          total: p.total,
          message: p.message,
        })
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

    lastLoadedCandidates = { collectionKey, modeId, candidates }

    const newGroups = extractGroups(candidates)
    const prev = groupsPerCollection[collectionKey]
    if (!prev || prev.length !== newGroups.length || prev.some((g, i) => g !== newGroups[i])) {
      groupsPerCollection[collectionKey] = newGroups
      sendAllGroups()
    }

    sendCacheStatus({ state: "ready" })
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
   * Uses session-loaded candidates when they match; otherwise loads from Figma (with progressive results).
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

    const sessionCandidates =
      lastLoadedCandidates?.collectionKey === scanCollectionKey &&
      lastLoadedCandidates?.modeId === scanModeId
        ? lastLoadedCandidates.candidates
        : null

    if (sessionCandidates && sessionCandidates.length > 0) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
        payload: {
          entries: buildEntries(foundColors, sessionCandidates),
          collectionKey: scanCollectionKey,
          modeId: scanModeId,
        },
      })
      return
    }

    // No session data: show found colors immediately (matches will fill in as we load)
    figma.ui.postMessage({
      type: MAIN_TO_UI.FIND_COLOR_MATCH_RESULT,
      payload: {
        entries: buildEntries(foundColors, []),
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
            source.modes = await loadLibraryCollectionModes(msg.collectionKey)
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
        const { nodeId, variableId, variableKey, colorType, paintIndex } = msg.request
        const result = await applyVariableToNode(nodeId, variableId, colorType, paintIndex, variableKey)
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

      if (!activationLoadPromise) {
        activationLoadPromise = runScan()
          .catch((e) => sendError(e instanceof Error ? e.message : String(e)))
          .finally(() => {
            activationLoadPromise = null
            sendCacheStatus({ state: "idle" })
          })
      }
    },
    onMessage,
  }
}
