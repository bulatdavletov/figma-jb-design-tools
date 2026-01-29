import type { LayerInspectionResult, ModeChain, VariableChainResult } from "./messages"

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

function rgbToHex(rgb: RGB): string {
  const toHex = (n01: number) => {
    const n255 = Math.max(0, Math.min(255, Math.round(n01 * 255)))
    const hex = n255.toString(16).padStart(2, "0")
    return hex.toUpperCase()
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

function getVariableAliasId(value: unknown): string | null {
  if (typeof value !== "object" || value == null) return null
  const anyValue = value as any
  if (anyValue.type !== "VARIABLE_ALIAS") return null
  if (typeof anyValue.id !== "string") return null
  return anyValue.id
}

function isRgb(value: unknown): value is RGB {
  if (typeof value !== "object" || value == null) return false
  const anyValue = value as any
  return typeof anyValue.r === "number" && typeof anyValue.g === "number" && typeof anyValue.b === "number"
}

async function resolveChainForMode(
  startVariable: Variable,
  modeId: string
): Promise<{ chain: Array<string>; finalHex: string | null; circular: boolean; note?: string }> {
  const chain: Array<string> = [startVariable.name]
  const visited = new Set<string>()
  let circularDetected = false
  let note: string | undefined

  async function step(variable: Variable, currentModeId: string): Promise<RGB | null> {
    const visitKey = `${variable.id}:${currentModeId}`
    if (visited.has(visitKey)) {
      circularDetected = true
      return null
    }
    visited.add(visitKey)

    const value = variable.valuesByMode[currentModeId]
    if (isRgb(value)) return value

    const aliasId = getVariableAliasId(value)
    if (aliasId) {
      const next = await figma.variables.getVariableByIdAsync(aliasId)
      if (next == null) return null
      chain.push(next.name)
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
    finalHex: resolved ? rgbToHex(resolved) : null,
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

async function getFoundVariablesFromSelection(): Promise<Array<FoundVariable>> {
  const selected = figma.currentPage.selection
  if (selected.length === 0) return []

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

  for (const node of selected) {
    await collectVariablesFromNodeTree(node, async (variableId, nodeContext) => {
      const variable = await getVariable(variableId)
      if (variable == null) return
      const collection = await getCollection(variable.variableCollectionId)
      if (collection == null) return

      const existing = found.get(variable.id)
      const entry =
        existing ?? { variable, collection, appliedModeIds: new Set<string>() }
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

  results.sort((a, b) => a.name.localeCompare(b.name))
  return results
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
      finalHex: resolved.finalHex,
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

async function getFoundVariablesFromNode(root: SceneNode): Promise<Array<FoundVariable>> {
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

  results.sort((a, b) => a.name.localeCompare(b.name))
  return results
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

