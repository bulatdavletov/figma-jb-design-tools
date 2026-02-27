import type {
  ActiveTool,
  UiToMainMessage,
  LibrarySwapScope,
  ManualPair,
} from "../../home/messages"
import { MAIN_TO_UI, UI_TO_MAIN } from "../../home/messages"
import { isMappingAny, mergeMappingMatches, mergeMappingMeta, mergeMappingMatchesRich, type MappingAny } from "./mapping-types"
import {
  analyzeSwap,
  swapInstances,
  previewSwap,
  clearSwapPreviews,
  focusNode,
} from "./swap-logic"
import { getComponentDisplayName } from "../../utils/component-name"
import { scanForLegacyItems, resetStyleOverride } from "./scan-legacy"
import defaultIconMapping from "./default-icon-mapping.json"
import defaultUikitMapping from "./default-uikit-mapping.json"

export function registerLibrarySwapTool(getActiveTool: () => ActiveTool) {
  let customMapping: MappingAny | null = null

  // Manual pair capture state
  let capturedOld: { key: string; name: string } | null = null
  let capturedNew: { key: string; name: string } | null = null
  const manualPairs: ManualPair[] = []

  // -----------------------------------------------------------------------
  // Collect active mapping sources
  // -----------------------------------------------------------------------
  function collectSources(
    useBuiltInIcons: boolean,
    useBuiltInUikit: boolean,
    customMappingJsonText?: string
  ): MappingAny[] {
    const sources: MappingAny[] = []
    if (useBuiltInIcons && isMappingAny(defaultIconMapping)) {
      sources.push(defaultIconMapping as MappingAny)
    }
    if (useBuiltInUikit && isMappingAny(defaultUikitMapping)) {
      sources.push(defaultUikitMapping as MappingAny)
    }
    // If custom mapping text is provided inline, parse it fresh
    if (customMappingJsonText) {
      try {
        const parsed = JSON.parse(customMappingJsonText)
        if (isMappingAny(parsed)) {
          sources.push(parsed as MappingAny)
        }
      } catch {
        // ignore parse errors; UI already validated
      }
    } else if (customMapping) {
      sources.push(customMapping)
    }
    // Manual pairs as synthetic MappingV2 (highest priority -- last)
    if (manualPairs.length > 0) {
      const matches: Record<string, string> = {}
      const matchMeta: Record<string, { oldFullName: string; newFullName: string }> = {}
      for (const p of manualPairs) {
        matches[p.oldKey] = p.newKey
        matchMeta[p.oldKey] = { oldFullName: p.oldName, newFullName: p.newName }
      }
      sources.push({
        schemaVersion: 2,
        createdAt: new Date().toISOString(),
        matches,
        matchMeta,
      } as MappingAny)
    }
    return sources
  }

  function buildMergedMatches(
    useBuiltInIcons: boolean,
    useBuiltInUikit: boolean,
    customMappingJsonText?: string
  ): Record<string, string> {
    return mergeMappingMatches(collectSources(useBuiltInIcons, useBuiltInUikit, customMappingJsonText))
  }

  // -----------------------------------------------------------------------
  // Manual pair helpers
  // -----------------------------------------------------------------------
  async function captureFromSelection(): Promise<{ key: string; name: string } | null> {
    const sel = figma.currentPage.selection
    for (const node of sel) {
      if (node.type === "INSTANCE") {
        try {
          const main = await (node as InstanceNode).getMainComponentAsync()
          if (main?.key) {
            return { key: main.key, name: getComponentDisplayName(main) }
          }
        } catch {
          // continue
        }
      }
    }
    return null
  }

  function tryCreatePair() {
    if (!capturedOld || !capturedNew) return
    if (capturedOld.key === capturedNew.key) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.ERROR,
        message: "Old and new are the same component",
      })
      capturedOld = null
      capturedNew = null
      figma.ui.postMessage({
        type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
        side: "old" as const,
        name: null,
      })
      figma.ui.postMessage({
        type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
        side: "new" as const,
        name: null,
      })
      return
    }
    // Check for duplicate oldKey
    const existing = manualPairs.findIndex((p) => p.oldKey === capturedOld!.key)
    if (existing >= 0) {
      manualPairs[existing] = {
        oldKey: capturedOld.key,
        newKey: capturedNew.key,
        oldName: capturedOld.name,
        newName: capturedNew.name,
      }
    } else {
      manualPairs.push({
        oldKey: capturedOld.key,
        newKey: capturedNew.key,
        oldName: capturedOld.name,
        newName: capturedNew.name,
      })
    }
    figma.notify(`Pair added: ${capturedOld.name} → ${capturedNew.name}`)
    capturedOld = null
    capturedNew = null
    // Reset capture slots in UI
    figma.ui.postMessage({
      type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
      side: "old" as const,
      name: null,
    })
    figma.ui.postMessage({
      type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
      side: "new" as const,
      name: null,
    })
    // Send updated pairs
    figma.ui.postMessage({
      type: MAIN_TO_UI.LIBRARY_SWAP_PAIRS_UPDATED,
      pairs: [...manualPairs],
    })
  }

  // -----------------------------------------------------------------------
  // Selection change listener
  // -----------------------------------------------------------------------
  figma.on("selectionchange", () => {
    if (getActiveTool() === "migrate-to-islands-uikit-tool") {
      figma.ui.postMessage({
        type: MAIN_TO_UI.LIBRARY_SWAP_SELECTION,
        selectionSize: figma.currentPage.selection.length,
      })
    }
  })

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------
  return {
    async onActivate() {
      figma.ui.postMessage({
        type: MAIN_TO_UI.LIBRARY_SWAP_SELECTION,
        selectionSize: figma.currentPage.selection.length,
      })

    },

    async onMessage(msg: UiToMainMessage): Promise<boolean> {
      if (getActiveTool() !== "migrate-to-islands-uikit-tool") return false

      // -- Set custom mapping ------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_SET_CUSTOM_MAPPING) {
        try {
          const parsed = JSON.parse(msg.jsonText)
          if (isMappingAny(parsed)) {
            customMapping = parsed as MappingAny
          } else {
            customMapping = null
            figma.ui.postMessage({
              type: MAIN_TO_UI.ERROR,
              message: "Invalid mapping file format",
            })
          }
        } catch {
          customMapping = null
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: "Could not parse mapping JSON",
          })
        }
        return true
      }

      // -- Analyze (includes Scan Legacy) ------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_ANALYZE) {
        try {
          const { scope, includeHidden = true, useBuiltInIcons, useBuiltInUikit, customMappingJsonText } = msg.request
          const sources = collectSources(useBuiltInIcons, useBuiltInUikit, customMappingJsonText)
          const merged = mergeMappingMatches(sources)
          const meta = mergeMappingMeta(sources)
          const richMatches = mergeMappingMatchesRich(sources)

          if (Object.keys(merged).length === 0) {
            figma.ui.postMessage({
              type: MAIN_TO_UI.ERROR,
              message: "No mapping entries available",
            })
            return true
          }

          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_PROGRESS,
            progress: { current: 0, total: 0, message: "Analyzing..." },
          })
          await new Promise((r) => setTimeout(r, 0))

          const result = await analyzeSwap(merged, scope as LibrarySwapScope, includeHidden, meta, (done, total) => {
            figma.ui.postMessage({
              type: MAIN_TO_UI.LIBRARY_SWAP_PROGRESS,
              progress: { current: done, total, message: `Analyzing... ${done} / ${total}` },
            })
          })

          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_ANALYZE_RESULT,
            payload: result,
          })

          // Run Scan Legacy as part of analyze
          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_PROGRESS,
            progress: { current: 0, total: 0, message: "Scanning legacy items..." },
          })
          await new Promise((r) => setTimeout(r, 0))

          const legacyResult = await scanForLegacyItems(
            scope as LibrarySwapScope,
            includeHidden,
            richMatches,
            (message, done, total) => {
              figma.ui.postMessage({
                type: MAIN_TO_UI.LIBRARY_SWAP_PROGRESS,
                progress: { current: done, total, message },
              })
            }
          )

          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESULT,
            payload: legacyResult,
          })
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Analyze failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Analyze failed",
          })
        }
        return true
      }

      // -- Preview -----------------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_PREVIEW) {
        try {
          const { scope, includeHidden = true, useBuiltInIcons, useBuiltInUikit, customMappingJsonText, sampleSize } = msg.request
          const merged = buildMergedMatches(useBuiltInIcons, useBuiltInUikit, customMappingJsonText)

          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_PROGRESS,
            progress: { current: 0, total: 0, message: "Creating preview..." },
          })
          await new Promise((r) => setTimeout(r, 0))

          const result = await previewSwap(merged, scope as LibrarySwapScope, includeHidden, sampleSize ?? 12)
          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_PREVIEW_RESULT,
            previewed: result.previewed,
          })
          figma.notify(`Preview created: ${result.previewed} samples`)
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Preview failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Preview failed",
          })
        }
        return true
      }

      // -- Apply -------------------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_APPLY) {
        try {
          const { scope, includeHidden = true, useBuiltInIcons, useBuiltInUikit, customMappingJsonText } = msg.request
          const merged = buildMergedMatches(useBuiltInIcons, useBuiltInUikit, customMappingJsonText)

          if (Object.keys(merged).length === 0) {
            figma.ui.postMessage({
              type: MAIN_TO_UI.ERROR,
              message: "No mapping entries available",
            })
            return true
          }

          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_PROGRESS,
            progress: { current: 0, total: 0, message: "Swapping..." },
          })
          await new Promise((r) => setTimeout(r, 0))

          const result = await swapInstances(merged, scope as LibrarySwapScope, includeHidden, (done, total) => {
            figma.ui.postMessage({
              type: MAIN_TO_UI.LIBRARY_SWAP_PROGRESS,
              progress: {
                current: done,
                total,
                message: `Swapping... ${done} / ${total}`,
              },
            })
          })

          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_APPLY_RESULT,
            payload: {
              swapped: result.swapped,
              skipped: result.skipped,
              swappedItems: result.swappedItems,
            },
          })
          figma.notify(`Swapped ${result.swapped} instances`)
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Swap failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Swap failed",
          })
        }
        return true
      }

      // -- Clear previews ----------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_CLEAR_PREVIEWS) {
        const removed = clearSwapPreviews()
        figma.notify(`Removed ${removed} preview frame${removed !== 1 ? "s" : ""}`)
        return true
      }

      // -- Focus node --------------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_FOCUS_NODE) {
        await focusNode(msg.nodeId)
        return true
      }

      // -- Capture old -------------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_OLD) {
        const result = await captureFromSelection()
        if (result) {
          capturedOld = result
          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
            side: "old" as const,
            name: result.name,
          })
          tryCreatePair()
        } else {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
            side: "old" as const,
            name: null,
          })
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: "Select an instance to capture",
          })
        }
        return true
      }

      // -- Capture new -------------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_NEW) {
        const result = await captureFromSelection()
        if (result) {
          capturedNew = result
          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
            side: "new" as const,
            name: result.name,
          })
          tryCreatePair()
        } else {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT,
            side: "new" as const,
            name: null,
          })
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: "Select an instance to capture",
          })
        }
        return true
      }

      // -- Remove pair -------------------------------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_REMOVE_PAIR) {
        const idx = manualPairs.findIndex((p) => p.oldKey === msg.oldKey)
        if (idx >= 0) manualPairs.splice(idx, 1)
        figma.ui.postMessage({
          type: MAIN_TO_UI.LIBRARY_SWAP_PAIRS_UPDATED,
          pairs: [...manualPairs],
        })
        return true
      }

      // -- Scan Legacy: reset style override ---------------------------------
      if (msg.type === UI_TO_MAIN.LIBRARY_SWAP_SCAN_LEGACY_RESET) {
        const ok = await resetStyleOverride(msg.nodeId, msg.property)
        figma.ui.postMessage({
          type: MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT,
          ok,
          nodeId: msg.nodeId,
        })
        if (ok) figma.notify("Override reset")
        return true
      }

      return false
    },
  }
}
