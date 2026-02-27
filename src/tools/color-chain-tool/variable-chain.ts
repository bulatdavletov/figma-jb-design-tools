import type {
  LayerInspectionResult,
  LayerInspectionResultV2,
  ModeChain,
  VariableChainResult,
  VariableChainResultV2,
} from "../../home/messages"

type FoundVariable = {
  id: string
  name: string
  collectionName: string
  collectionId: string
  appliedMode:
    | { status: "single"; modeId: string; modeName: string }
    | { status: "mixed"; modeIds: Array<string>; modeNames: Array<string> }
    | { status: "unknown" }
}

export type ColorValue = RGB | RGBA

export function toByteHex(n01: number): string {
  const n255 = Math.max(0, Math.min(255, Math.round(n01 * 255)))
  return n255.toString(16).padStart(2, "0").toUpperCase()
}

export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

export function colorToRgbHex(color: ColorValue): string {
  return `#${toByteHex(color.r)}${toByteHex(color.g)}${toByteHex(color.b)}`
}

export function colorToOpacityPercent(color: ColorValue): number {
  const a = typeof (color as any).a === "number" ? (color as any).a : 1
  const alpha = clamp01(a)
  return Math.round(alpha * 100)
}

function getVariableAliasId(value: unknown): string | null {
  if (typeof value !== "object" || value == null) return null
  const anyValue = value as any
  if (anyValue.type !== "VARIABLE_ALIAS") return null
  if (typeof anyValue.id !== "string") return null
  return anyValue.id
}

export function isColorValue(value: unknown): value is ColorValue {
  if (typeof value !== "object" || value == null) return false
  const anyValue = value as any
  const isRgb = typeof anyValue.r === "number" && typeof anyValue.g === "number" && typeof anyValue.b === "number"
  if (!isRgb) return false
  // `a` is optional. If present, treat as RGBA.
  if (typeof anyValue.a === "undefined") return true
  return typeof anyValue.a === "number"
}

export async function resolveChainForMode(
  startVariable: Variable,
  modeId: string
): Promise<{
  chain: Array<string>
  chainVariableIds: Array<string>
  finalHex: string | null
  finalOpacityPercent: number | null
  circular: boolean
  note?: string
}> {
  const chain: Array<string> = [startVariable.name]
  const chainVariableIds: Array<string> = [startVariable.id]
  const visited = new Set<string>()
  let circularDetected = false
  let note: string | undefined

  async function step(variable: Variable, currentModeId: string): Promise<ColorValue | null> {
    const visitKey = `${variable.id}:${currentModeId}`
    if (visited.has(visitKey)) {
      circularDetected = true
      return null
    }
    visited.add(visitKey)

    const value = variable.valuesByMode[currentModeId]
    if (isColorValue(value)) return value

    const aliasId = getVariableAliasId(value)
    if (aliasId) {
      const next = await figma.variables.getVariableByIdAsync(aliasId)
      if (next == null) return null
      chain.push(next.name)
      chainVariableIds.push(next.id)
      return await step(next, currentModeId)
    }

    // No value for this mode, attempt fallback to any available mode.
    const availableModeIds = Object.keys(variable.valuesByMode)
    if (availableModeIds.length === 0) return null
    const fallbackModeId = availableModeIds[0]
    if (fallbackModeId === currentModeId) return null
    note = note ?? `No value in mode; used fallback mode "${fallbackModeId}"`
    return await step(variable, fallbackModeId)
  }

  const resolved = await step(startVariable, modeId)
  return {
    chain,
    chainVariableIds,
    finalHex: resolved ? colorToRgbHex(resolved) : null,
    finalOpacityPercent: resolved ? colorToOpacityPercent(resolved) : null,
    circular: circularDetected,
    note,
  }
}

function extractVariableIdsFromBoundVariables(boundVariables: unknown): Array<string> {
  if (typeof boundVariables !== "object" || boundVariables == null) return []
  const ids: Array<string> = []
  for (const value of Object.values(boundVariables as any)) {
    const aliasId = getVariableAliasId(value)
    if (aliasId) ids.push(aliasId)
  }
  return ids
}

function extractFromPaints(paints: ReadonlyArray<Paint> | any): Array<string> {
  if (!Array.isArray(paints)) return []
  const ids: Array<string> = []
  for (const paint of paints) {
    if (paint.type !== "SOLID") continue
    const anyPaint = paint as any
    ids.push(...extractVariableIdsFromBoundVariables(anyPaint.boundVariables))
  }
  return ids
}

function idsFromNode(node: SceneNode): Array<string> {
  const ids: Array<string> = []
  const anyNode = node as any

  if ("fills" in anyNode) {
    ids.push(...extractFromPaints(anyNode.fills))
  }
  if ("strokes" in anyNode) {
    ids.push(...extractFromPaints(anyNode.strokes))
  }

  // Text: fills are still paints. (Character-level bound variables are out of scope for Flow A.)
  if (node.type === "TEXT") {
    ids.push(...extractFromPaints((node as TextNode).fills))
  }

  return ids
}

type NodeContext = {
  resolvedVariableModes?: Record<string, string>
}

async function collectVariablesFromNodeTree(
  root: SceneNode,
  onVariable: (variableId: string, nodeContext: NodeContext) => Promise<void>
): Promise<void> {
  const stack: SceneNode[] = [root]
  while (stack.length > 0) {
    const node = stack.pop()!

    // Skip hidden layers (keeps results closer to what user sees)
    if (node.visible === false) {
      continue
    }

    const nodeContext: NodeContext = {
      resolvedVariableModes:
        typeof (node as any).resolvedVariableModes === "object" ? ((node as any).resolvedVariableModes as any) : undefined,
    }

    const ids = idsFromNode(node)
    for (const id of ids) {
      await onVariable(id, nodeContext)
    }

    if ("children" in node) {
      for (const child of node.children) {
        stack.push(child)
      }
    }
  }
}

async function getFoundVariablesFromRoots(roots: Array<SceneNode>): Promise<Array<FoundVariable>> {
  const variableCache = new Map<string, Variable | null>()
  const collectionCache = new Map<string, VariableCollection | null>()

  async function getVariable(id: string): Promise<Variable | null> {
    if (!variableCache.has(id)) {
      variableCache.set(id, await figma.variables.getVariableByIdAsync(id))
    }
    return variableCache.get(id) ?? null
  }

  async function getCollection(id: string): Promise<VariableCollection | null> {
    if (!collectionCache.has(id)) {
      collectionCache.set(id, await figma.variables.getVariableCollectionByIdAsync(id))
    }
    return collectionCache.get(id) ?? null
  }

  const found = new Map<
    string,
    {
      variable: Variable
      collection: VariableCollection
      appliedModeIds: Set<string>
    }
  >()

  for (const root of roots) {
    await collectVariablesFromNodeTree(root, async (variableId, nodeContext) => {
      const variable = await getVariable(variableId)
      if (variable == null) return
      const collection = await getCollection(variable.variableCollectionId)
      if (collection == null) return

      const existing = found.get(variable.id)
      const entry = existing ?? { variable, collection, appliedModeIds: new Set<string>() }
      found.set(variable.id, entry)

      const resolvedModes = nodeContext.resolvedVariableModes
      const modeId = resolvedModes?.[collection.id]
      if (typeof modeId === "string" && modeId.length > 0) {
        entry.appliedModeIds.add(modeId)
      }
    })
  }

  const results: Array<FoundVariable> = []
  for (const entry of Array.from(found.values())) {
    const modeIds: string[] = Array.from(entry.appliedModeIds)
    const modeNames: string[] = modeIds
      .map((id) => entry.collection.modes.find((m: { modeId: string; name: string }) => m.modeId === id)?.name)
      .filter((x): x is string => typeof x === "string")

    const appliedMode =
      modeIds.length === 1 && modeNames.length === 1
        ? { status: "single" as const, modeId: modeIds[0], modeName: modeNames[0] }
        : modeIds.length > 1
          ? { status: "mixed" as const, modeIds, modeNames }
          : { status: "unknown" as const }

    results.push({
      id: entry.variable.id,
      name: entry.variable.name,
      collectionId: entry.collection.id,
      collectionName: entry.collection.name,
      appliedMode,
    })
  }

  return results
}

async function buildVariableChainResult(found: FoundVariable): Promise<VariableChainResult | null> {
  const variable = await figma.variables.getVariableByIdAsync(found.id)
  if (variable == null) return null
  const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId)
  if (collection == null) return null

  const chains: Array<ModeChain> = []
  for (const mode of collection.modes) {
    const resolved = await resolveChainForMode(variable, mode.modeId)
    chains.push({
      modeId: mode.modeId,
      modeName: mode.name,
      chain: resolved.chain,
      chainVariableIds: resolved.chainVariableIds,
      finalHex: resolved.finalHex,
      finalOpacityPercent: resolved.finalOpacityPercent,
      circular: resolved.circular,
      note: resolved.note,
    })
  }

  return {
    variableId: variable.id,
    variableName: variable.name,
    collectionName: collection.name,
    appliedMode: found.appliedMode,
    chains,
  }
}

async function buildVariableChainResultV2(found: FoundVariable): Promise<VariableChainResultV2 | null> {
  const variable = await figma.variables.getVariableByIdAsync(found.id)
  if (variable == null) return null
  const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId)
  if (collection == null) return null

  const hasOtherModes = collection.modes.length > 1

  const pickedMode =
    found.appliedMode.status === "single"
      ? { modeId: found.appliedMode.modeId, modeName: found.appliedMode.modeName }
      : collection.modes.length > 0
        ? { modeId: collection.modes[0].modeId, modeName: collection.modes[0].name }
        : null

  if (pickedMode == null) {
    return {
      variableId: variable.id,
      variableName: variable.name,
      collectionName: collection.name,
      appliedMode: found.appliedMode,
      chainToRender: null,
      hasOtherModes,
    }
  }

  const resolved = await resolveChainForMode(variable, pickedMode.modeId)
  const note =
    resolved.note ??
    (found.appliedMode.status === "single" ? undefined : `Multiple/unknown modes; showing "${pickedMode.modeName}"`)

  return {
    variableId: variable.id,
    variableName: variable.name,
    collectionName: collection.name,
    appliedMode: found.appliedMode,
    chainToRender: {
      modeId: pickedMode.modeId,
      modeName: pickedMode.modeName,
      chain: resolved.chain,
      chainVariableIds: resolved.chainVariableIds,
      finalHex: resolved.finalHex,
      finalOpacityPercent: resolved.finalOpacityPercent,
      circular: resolved.circular,
      note,
    },
    hasOtherModes,
  }
}

async function getFoundVariablesFromNode(root: SceneNode): Promise<Array<FoundVariable>> {
  return await getFoundVariablesFromRoots([root])
}

export async function inspectSelectionForVariableChainsByLayer(): Promise<Array<LayerInspectionResult>> {
  const selected = figma.currentPage.selection
  if (selected.length === 0) return []

  const results: Array<LayerInspectionResult> = []
  for (const node of selected) {
    const found = await getFoundVariablesFromNode(node)
    const colors: Array<VariableChainResult> = []
    for (const f of found) {
      const built = await buildVariableChainResult(f)
      if (built) colors.push(built)
    }

    results.push({
      layerId: node.id,
      layerName: node.name,
      layerType: node.type,
      colors,
    })
  }

  return results
}

export async function inspectSelectionForVariableChainsByLayerV2(): Promise<Array<LayerInspectionResultV2>> {
  const selected = figma.currentPage.selection
  if (selected.length === 0) return []

  const results: Array<LayerInspectionResultV2> = []
  for (const node of selected) {
    const found = await getFoundVariablesFromNode(node)
    const colors: Array<VariableChainResultV2> = []
    for (const f of found) {
      const built = await buildVariableChainResultV2(f)
      if (built) colors.push(built)
    }

    results.push({
      layerId: node.id,
      layerName: node.name,
      layerType: node.type,
      colors,
    })
  }

  return results
}

export async function replaceVariableUsagesInSelection(
  sourceVariableId: string,
  targetVariableId: string
): Promise<{ sourceName: string; targetName: string; nodesChanged: number; bindingsChanged: number }> {
  if (sourceVariableId === targetVariableId) {
    throw new Error("Source and target colors are the same.")
  }
  if (figma.currentPage.selection.length === 0) {
    throw new Error("Select at least one layer first.")
  }

  const sourceVariable = await figma.variables.getVariableByIdAsync(sourceVariableId)
  if (sourceVariable == null) {
    throw new Error("Source color variable was not found.")
  }
  if (sourceVariable.resolvedType !== "COLOR") {
    throw new Error("Source variable must be a COLOR variable.")
  }

  const targetVariable = await figma.variables.getVariableByIdAsync(targetVariableId)
  if (targetVariable == null) {
    throw new Error("Selected chain color variable was not found.")
  }
  if (targetVariable.resolvedType !== "COLOR") {
    throw new Error("Selected chain color must be a COLOR variable.")
  }

  const stack: SceneNode[] = [...figma.currentPage.selection]
  let nodesChanged = 0
  let bindingsChanged = 0

  while (stack.length > 0) {
    const node = stack.pop()!
    if (node.visible === false) continue
    if ((node as SceneNode & { locked?: boolean }).locked === true) continue

    const anyNode = node as SceneNode & {
      boundVariables?: Record<string, unknown>
      fills?: ReadonlyArray<Paint> | PluginAPI["mixed"]
      strokes?: ReadonlyArray<Paint> | PluginAPI["mixed"]
      setBoundVariable?: (field: string, variable: Variable) => void
      children?: readonly SceneNode[]
    }

    let nodeHadChanges = false
    const boundVariables = anyNode.boundVariables
    if (boundVariables && typeof boundVariables === "object") {
      for (const [property, binding] of Object.entries(boundVariables)) {
        if (!binding) continue

        if (property === "fills" && Array.isArray(binding) && Array.isArray(anyNode.fills)) {
          const paints = anyNode.fills
          const updated = paints.map((paint, index) => {
            const alias = binding[index] as { id?: string } | undefined
            if (!alias?.id || alias.id !== sourceVariableId || paint.type !== "SOLID") return paint
            bindingsChanged += 1
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable)
          })
          const changed = updated.some((paint, index) => paint !== paints[index])
          if (changed) {
            ;(node as SceneNode & { fills: ReadonlyArray<Paint> }).fills = updated
            nodeHadChanges = true
          }
          continue
        }

        if (property === "strokes" && Array.isArray(binding) && Array.isArray(anyNode.strokes)) {
          const paints = anyNode.strokes
          const updated = paints.map((paint, index) => {
            const alias = binding[index] as { id?: string } | undefined
            if (!alias?.id || alias.id !== sourceVariableId || paint.type !== "SOLID") return paint
            bindingsChanged += 1
            return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable)
          })
          const changed = updated.some((paint, index) => paint !== paints[index])
          if (changed) {
            ;(node as SceneNode & { strokes: ReadonlyArray<Paint> }).strokes = updated
            nodeHadChanges = true
          }
          continue
        }

        if (Array.isArray(binding)) continue
        if (typeof binding !== "object" || binding == null || !("id" in binding)) continue
        const currentId = String((binding as { id?: string }).id ?? "")
        if (currentId !== sourceVariableId) continue
        try {
          anyNode.setBoundVariable?.(property, targetVariable)
          bindingsChanged += 1
          nodeHadChanges = true
        } catch {
          // Ignore unsupported fields for this node type.
        }
      }
    }

    if (nodeHadChanges) nodesChanged += 1
    if ("children" in node) {
      for (const child of node.children) stack.push(child)
    }
  }

  return {
    sourceName: sourceVariable.name,
    targetName: targetVariable.name,
    nodesChanged,
    bindingsChanged,
  }
}

