import type {
  ActiveTool,
  UiToMainMessage,
  LinkedColorsSelectionPayload,
  ReplaceUsagesPreviewPayload,
  ReplaceUsagesMappingRow,
  ReplaceUsagesInvalidMappingRow,
  ReplaceUsagesApplyResultPayload,
  ReplaceUsagesScope,
  ReplaceUsagesPhase,
} from "../../messages"
import { MAIN_TO_UI, UI_TO_MAIN } from "../../messages"
import { getVariable, getCollection, getAllLocalVariables } from "../variables-shared/caching"
import {
  hasChildren,
  isNodeVisible,
  hasBoundVariables,
  hasFills,
  hasStrokes,
  readBindings,
  collectSolidColors,
  getVariableNameSuffix,
  getVariableGroupName,
  collectNodesForScope,
  getVariableIdPrefixFromLayerName,
  setBoundVariableTry,
} from "../variables-shared/node-utils"
import { parseUsagesReplaceMappingJson, isString } from "../variables-shared/json-parsers"
import type {
  VariableUsage,
  VariableMatch,
  ColorUsage,
  UsagesReplaceMappingJsonDoc,
} from "../variables-shared/types"

type UsagesReplaceMappingEntry = {
  row: ReplaceUsagesMappingRow
  targetVariable: Variable
}

export function registerVariablesReplaceUsagesTool(getActiveTool: () => ActiveTool) {
  const getSelectionWithDescendants = (selection: readonly SceneNode[]): SceneNode[] => {
    const stack = [...selection]
    const result: SceneNode[] = []

    while (stack.length) {
      const node = stack.pop()
      if (!node) continue
      if (!isNodeVisible(node)) continue
      result.push(node)

      if (hasChildren(node)) {
        stack.push(...node.children)
      }
    }

    return result
  }

  const addVariableUsage = async (
    variableId: string,
    property: string,
    node: SceneNode,
    variableMap: Map<string, VariableUsage>
  ) => {
    const variable = await getVariable(variableId)
    if (!variable) return

    let usage = variableMap.get(variable.id)
    if (!usage) {
      const collection = await getCollection(variable.variableCollectionId)
      usage = {
        id: variable.id,
        name: variable.name,
        collectionId: variable.variableCollectionId,
        collectionName: collection?.name ?? "Unknown collection",
        resolvedType: variable.resolvedType,
        properties: [],
        nodes: [],
        defaultName: variable.name,
        matches: [],
        options: [],
        groups: [],
      }
      variableMap.set(variable.id, usage)
    }

    if (!usage.properties.includes(property)) {
      usage.properties.push(property)
    }

    if (!usage.nodes.some((entry) => entry.id === node.id)) {
      usage.nodes.push({ id: node.id, name: node.name || node.type })
    }
  }

  const getVariablesFromSelection = async (): Promise<LinkedColorsSelectionPayload> => {
    const selection = figma.currentPage.selection
    const nodesToInspect = getSelectionWithDescendants(selection)
    const variableMap = new Map<string, VariableUsage>()
    const colorMap = new Map<string, ColorUsage>()

    for (const node of nodesToInspect) {
      if (hasBoundVariables(node)) {
        const bindings = readBindings(node.boundVariables)

        for (const binding of bindings) {
          await addVariableUsage(binding.variableId, binding.property, node, variableMap)
        }
      }

      const solidColors = collectSolidColors(node)
      for (const colorEntry of solidColors) {
        let usage = colorMap.get(colorEntry.hex)
        if (!usage) {
          usage = {
            hex: colorEntry.hex,
            properties: [],
            nodes: [],
          }
          colorMap.set(colorEntry.hex, usage)
        }

        if (!usage.properties.includes(colorEntry.property)) {
          usage.properties.push(colorEntry.property)
        }

        if (!usage.nodes.some((entry) => entry.id === node.id)) {
          usage.nodes.push({ id: node.id, name: node.name || node.type })
        }
      }
    }

    // Add options and matches for each variable
    for (const usage of Array.from(variableMap.values())) {
      const variable = await getVariable(usage.id)
      if (!variable) continue

      const suffix = getVariableNameSuffix(variable.name)
      usage.defaultName = variable.name

      const candidates = await getAllLocalVariables([variable.resolvedType])

      const candidateSummaries: VariableMatch[] = []
      for (const candidate of candidates) {
        if (candidate.id === variable.id) continue
        const collection = await getCollection(candidate.variableCollectionId)
        candidateSummaries.push({
          id: candidate.id,
          name: candidate.name,
          collectionId: candidate.variableCollectionId,
          collectionName: collection?.name ?? "Unknown collection",
        })
      }

      candidateSummaries.sort((a, b) => a.name.localeCompare(b.name))
      usage.options = candidateSummaries

      const groupSet = new Set<string>()
      for (const option of candidateSummaries) {
        groupSet.add(getVariableGroupName(option.name))
      }
      usage.groups = Array.from(groupSet).sort((a, b) => a.localeCompare(b))

      if (suffix) {
        const suffixLower = suffix.toLowerCase()
        usage.matches = candidateSummaries
          .filter((c) => c.name.toLowerCase().includes(suffixLower))
          .sort((a, b) => a.name.localeCompare(b.name))
      } else {
        usage.matches = []
      }
    }

    const variables = Array.from(variableMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    const colors = Array.from(colorMap.values()).sort((a, b) => a.hex.localeCompare(b.hex))

    return { variables, selectionSize: selection.length, colors }
  }

  const sendSelectionInfo = async () => {
    const payload = await getVariablesFromSelection()
    figma.ui.postMessage({
      type: MAIN_TO_UI.REPLACE_USAGES_SELECTION,
      payload,
    })
  }

  const resolveCollectionForMapping = async (
    doc: UsagesReplaceMappingJsonDoc
  ): Promise<VariableCollection> => {
    if (doc.collectionId) {
      const byId = await getCollection(doc.collectionId)
      if (!byId) {
        throw new Error("Mapping collectionId not found in this file.")
      }
      return byId
    }

    if (doc.collectionName) {
      const collections = await figma.variables.getLocalVariableCollectionsAsync()
      const match = collections.find((c) => c.name === doc.collectionName)
      if (!match) {
        throw new Error("Mapping collectionName not found in this file.")
      }
      return match
    }

    throw new Error("Mapping must include collectionName or collectionId.")
  }

  const buildUsagesReplaceMappingFromJson = async (
    jsonText: string
  ): Promise<{
    entries: UsagesReplaceMappingEntry[]
    invalidMappingRows: ReplaceUsagesInvalidMappingRow[]
  }> => {
    const doc = parseUsagesReplaceMappingJson(jsonText)
    const collection = await resolveCollectionForMapping(doc)

    const vars = await getAllLocalVariables(["COLOR"])
    const byName = new Map<string, Variable>()
    for (const v of vars) {
      if (v.variableCollectionId !== collection.id) continue
      if (!byName.has(v.name)) byName.set(v.name, v)
    }

    const entries: UsagesReplaceMappingEntry[] = []
    const invalidMappingRows: ReplaceUsagesInvalidMappingRow[] = []
    const seenFrom = new Set<string>()

    for (const r of doc.replacements) {
      const from = r.from
      const to = r.to
      if (!from || !to) {
        invalidMappingRows.push({ from, to, status: "invalid", reason: "Missing from/to." })
        continue
      }

      if (seenFrom.has(from)) {
        invalidMappingRows.push({
          from,
          to,
          status: "duplicate_from",
          reason: 'Duplicate "from" row (keep only one).',
        })
        continue
      }
      seenFrom.add(from)

      const sourceVar = byName.get(from) ?? null
      if (!sourceVar) {
        invalidMappingRows.push({
          from,
          to,
          status: "missing_source",
          reason: "Source variable not found by name.",
        })
        continue
      }
      const targetVar = byName.get(to) ?? null
      if (!targetVar) {
        invalidMappingRows.push({
          from,
          to,
          status: "missing_target",
          reason: "Target variable not found by name.",
        })
        continue
      }

      if (sourceVar.id === targetVar.id) {
        invalidMappingRows.push({ from, to, status: "ok", reason: "No-op (same variable)." })
        continue
      }

      const row: ReplaceUsagesMappingRow = {
        sourceId: sourceVar.id,
        sourceName: sourceVar.name,
        sourceCollectionId: sourceVar.variableCollectionId,
        sourceCollectionName: collection.name,
        targetId: targetVar.id,
        targetName: targetVar.name,
        reason: "imported mapping",
        bindingsTotal: 0,
        bindingsByPhase: { component: 0, instance_in_component: 0, other: 0 },
        nodesTotal: 0,
        nodesByPhase: { component: 0, instance_in_component: 0, other: 0 },
        defaultName: sourceVar.name,
      }

      entries.push({ row, targetVariable: targetVar })
      invalidMappingRows.push({ from, to, status: "ok" })
    }

    entries.sort((a, b) => a.row.sourceName.localeCompare(b.row.sourceName))
    return { entries, invalidMappingRows }
  }

  const scanUsagesReplacePreview = async (
    scope: ReplaceUsagesScope,
    renamePrints: boolean,
    includeHidden: boolean,
    mappingJsonText: string
  ): Promise<ReplaceUsagesPreviewPayload> => {
    if (!mappingJsonText.trim()) {
      throw new Error("Mapping JSON is required. Please load a mapping file.")
    }
    const { entries, invalidMappingRows } = await buildUsagesReplaceMappingFromJson(mappingJsonText)
    const bySourceId = new Map<string, UsagesReplaceMappingEntry>(
      entries.map((e) => [e.row.sourceId, e])
    )

    const perRowNodeSets = new Map<string, Record<ReplaceUsagesPhase, Set<string>>>()
    for (const e of entries) {
      perRowNodeSets.set(e.row.sourceId, {
        component: new Set(),
        instance_in_component: new Set(),
        other: new Set(),
      })
    }

    const nodesWithChangesByPhase: Record<ReplaceUsagesPhase, Set<string>> = {
      component: new Set(),
      instance_in_component: new Set(),
      other: new Set(),
    }

    let bindingsWithChanges = 0
    const bindingsWithChangesByPhase: Record<ReplaceUsagesPhase, number> = {
      component: 0,
      instance_in_component: 0,
      other: 0,
    }
    let printsRenameCandidates = 0

    const nodes = collectNodesForScope(scope, includeHidden)
    for (const { node, phase } of nodes) {
      if ((node as SceneNode & { locked?: boolean }).locked === true) {
        continue
      }

      if (!hasBoundVariables(node) || !node.boundVariables) {
        // Still allow Prints-only candidates based on layer name
        if (renamePrints && node.type === "TEXT") {
          const sourceIdFromName = getVariableIdPrefixFromLayerName(node.name)
          if (sourceIdFromName && bySourceId.has(sourceIdFromName)) {
            printsRenameCandidates += 1
          }
        }
        continue
      }

      for (const [property, binding] of Object.entries(node.boundVariables)) {
        if (!binding) continue

        const handleId = (id: string) => {
          const hit = bySourceId.get(id)
          if (!hit) return
          hit.row.bindingsTotal += 1
          hit.row.bindingsByPhase[phase] += 1
          bindingsWithChanges += 1
          bindingsWithChangesByPhase[phase] += 1
          nodesWithChangesByPhase[phase].add(node.id)
          const sets = perRowNodeSets.get(id)
          sets?.[phase].add(node.id)
        }

        if ((property === "fills" || property === "strokes") && Array.isArray(binding)) {
          for (const item of binding) {
            if (item?.id) {
              handleId(item.id)
            }
          }
          continue
        }

        if (
          !Array.isArray(binding) &&
          typeof binding === "object" &&
          "id" in binding &&
          (binding as { id: string }).id
        ) {
          handleId(String((binding as { id: string }).id))
        }
      }

      if (renamePrints && node.type === "TEXT") {
        const sourceIdFromName = getVariableIdPrefixFromLayerName(node.name)
        if (sourceIdFromName && bySourceId.has(sourceIdFromName)) {
          printsRenameCandidates += 1
        }
      }
    }

    for (const e of entries) {
      const sets = perRowNodeSets.get(e.row.sourceId)
      if (!sets) continue
      e.row.nodesByPhase.component = sets.component.size
      e.row.nodesByPhase.instance_in_component = sets.instance_in_component.size
      e.row.nodesByPhase.other = sets.other.size
      e.row.nodesTotal = sets.component.size + sets.instance_in_component.size + sets.other.size
    }

    const nodesWithChanges =
      nodesWithChangesByPhase.component.size +
      nodesWithChangesByPhase.instance_in_component.size +
      nodesWithChangesByPhase.other.size

    return {
      scope,
      totals: {
        mappings: entries.length,
        invalidMappingRows: invalidMappingRows.length,
        nodesWithChanges,
        bindingsWithChanges,
        nodesWithChangesByPhase: {
          component: nodesWithChangesByPhase.component.size,
          instance_in_component: nodesWithChangesByPhase.instance_in_component.size,
          other: nodesWithChangesByPhase.other.size,
        },
        bindingsWithChangesByPhase,
        printsRenameCandidates,
      },
      mappings: entries.map((e) => e.row).filter((r) => r.bindingsTotal > 0),
      invalidMappingRows,
    }
  }

  const applyUsagesReplace = async (
    scope: ReplaceUsagesScope,
    renamePrints: boolean,
    includeHidden: boolean,
    mappingJsonText: string,
    onProgress?: (done: number, total: number) => void
  ): Promise<ReplaceUsagesApplyResultPayload> => {
    if (!mappingJsonText.trim()) {
      throw new Error("Mapping JSON is required. Please load a mapping file.")
    }
    const { entries } = await buildUsagesReplaceMappingFromJson(mappingJsonText)
    const mappingBySourceId = new Map<string, Variable>(
      entries.map((e) => [e.row.sourceId, e.targetVariable])
    )

    const nodes = collectNodesForScope(scope, includeHidden)
    const buckets: Record<ReplaceUsagesPhase, SceneNode[]> = {
      component: [],
      instance_in_component: [],
      other: [],
    }
    for (const item of nodes) {
      buckets[item.phase].push(item.node)
    }

    const ordered: SceneNode[] = [
      ...buckets.component,
      ...buckets.instance_in_component,
      ...buckets.other,
    ]
    const total = ordered.length
    let done = 0

    let nodesVisited = 0
    let nodesChanged = 0
    let bindingsChanged = 0
    let nodesSkippedLocked = 0
    let bindingsSkippedUnsupported = 0
    let bindingsFailed = 0
    let printsRenamed = 0

    if (onProgress) {
      onProgress(0, total)
    }

    for (const node of ordered) {
      nodesVisited += 1

      if ((node as SceneNode & { locked?: boolean }).locked === true) {
        nodesSkippedLocked += 1
        done += 1
        if (onProgress && (done % 50 === 0 || done === total)) onProgress(done, total)
        continue
      }

      let nodeHadChanges = false
      const sourceIdFromName =
        renamePrints && node.type === "TEXT" ? getVariableIdPrefixFromLayerName(node.name) : null

      // Apply Prints renaming
      if (renamePrints && node.type === "TEXT" && sourceIdFromName) {
        const targetVar = mappingBySourceId.get(sourceIdFromName)
        if (targetVar) {
          const prefix = sourceIdFromName
          const rest = node.name.slice(prefix.length)
          const nextName = `${targetVar.id}${rest}`
          if (nextName !== node.name) {
            node.name = nextName
            printsRenamed += 1
            nodeHadChanges = true
          }
        }
      }

      if (!hasBoundVariables(node) || !node.boundVariables) {
        if (nodeHadChanges) {
          nodesChanged += 1
        }
        done += 1
        if (onProgress && (done % 50 === 0 || done === total)) onProgress(done, total)
        continue
      }

      for (const [property, binding] of Object.entries(node.boundVariables)) {
        if (!binding) continue

        // Paint arrays
        if (property === "fills" && Array.isArray(binding)) {
          if (!hasFills(node)) {
            bindingsSkippedUnsupported += binding.length
            continue
          }
          const paintsValue = node.fills
          if (!paintsValue || paintsValue === figma.mixed) {
            continue
          }
          const updated = paintsValue.map((paint: Paint, index: number) => {
            const alias = binding[index]
            if (!alias?.id || paint.type !== "SOLID") {
              return paint
            }
            const targetVar = mappingBySourceId.get(alias.id)
            if (!targetVar) {
              return paint
            }
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVar)
          })
          const changed = updated.some((p: Paint, i: number) => p !== paintsValue[i])
          if (changed) {
            node.fills = updated
            for (const alias of binding) {
              if (alias?.id && mappingBySourceId.has(alias.id)) {
                bindingsChanged += 1
              }
            }
            nodeHadChanges = true
          }
          continue
        }

        if (property === "strokes" && Array.isArray(binding)) {
          if (!hasStrokes(node)) {
            bindingsSkippedUnsupported += binding.length
            continue
          }
          const paintsValue = node.strokes
          if (!paintsValue) {
            continue
          }
          const updated = paintsValue.map((paint: Paint, index: number) => {
            const alias = binding[index]
            if (!alias?.id || paint.type !== "SOLID") {
              return paint
            }
            const targetVar = mappingBySourceId.get(alias.id)
            if (!targetVar) {
              return paint
            }
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVar)
          })
          const changed = updated.some((p: Paint, i: number) => p !== paintsValue[i])
          if (changed) {
            node.strokes = updated
            for (const alias of binding) {
              if (alias?.id && mappingBySourceId.has(alias.id)) {
                bindingsChanged += 1
              }
            }
            nodeHadChanges = true
          }
          continue
        }

        // Other single bindings
        if (
          !Array.isArray(binding) &&
          typeof binding === "object" &&
          "id" in binding &&
          (binding as { id: string }).id
        ) {
          const sourceId = String((binding as { id: string }).id)
          const targetVar = mappingBySourceId.get(sourceId)
          if (!targetVar) {
            continue
          }
          const ok = setBoundVariableTry(node, property, targetVar)
          if (ok) {
            bindingsChanged += 1
            nodeHadChanges = true
          } else {
            bindingsFailed += 1
          }
          continue
        }

        if (Array.isArray(binding)) {
          bindingsSkippedUnsupported += binding.length
        }
      }

      if (nodeHadChanges) {
        nodesChanged += 1
      }

      done += 1
      if (onProgress && (done % 50 === 0 || done === total)) {
        onProgress(done, total)
      }
    }

    return {
      totals: {
        nodesVisited,
        nodesChanged,
        bindingsChanged,
        nodesSkippedLocked,
        bindingsSkippedUnsupported,
        bindingsFailed,
        printsRenamed,
      },
    }
  }

  // Listen for selection changes
  figma.on("selectionchange", () => {
    if (getActiveTool() === "variables-replace-usages-tool") {
      sendSelectionInfo()
    }
  })

  return {
    async onActivate() {
      await sendSelectionInfo()
    },

    async onMessage(msg: UiToMainMessage): Promise<boolean> {
      if (getActiveTool() !== "variables-replace-usages-tool") return false

      if (msg.type === UI_TO_MAIN.REPLACE_USAGES_PREVIEW) {
        try {
          const { scope, renamePrints, includeHidden, mappingJsonText } = msg.request
          const payload = await scanUsagesReplacePreview(
            scope,
            renamePrints,
            includeHidden,
            mappingJsonText ?? ""
          )
          figma.ui.postMessage({
            type: MAIN_TO_UI.REPLACE_USAGES_PREVIEW,
            payload,
          })
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Preview failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Preview failed",
          })
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.REPLACE_USAGES_APPLY) {
        try {
          const { scope, renamePrints, includeHidden, mappingJsonText } = msg.request
          const payload = await applyUsagesReplace(
            scope,
            renamePrints,
            includeHidden,
            mappingJsonText ?? "",
            (done, total) => {
              figma.ui.postMessage({
                type: MAIN_TO_UI.REPLACE_USAGES_APPLY_PROGRESS,
                progress: {
                  current: done,
                  total,
                  message: `Replacing usages... ${done}/${total}`,
                },
              })
            }
          )

          figma.ui.postMessage({
            type: MAIN_TO_UI.REPLACE_USAGES_APPLY_RESULT,
            payload,
          })

          const { nodesChanged, bindingsChanged, printsRenamed } = payload.totals
          figma.notify(
            `Replaced: ${bindingsChanged} bindings in ${nodesChanged} nodes, ${printsRenamed} prints renamed`
          )

          await sendSelectionInfo()
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Apply failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Apply failed",
          })
        }
        return true
      }

      return false
    },
  }
}
