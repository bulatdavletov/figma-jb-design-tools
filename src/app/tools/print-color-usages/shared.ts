export type ColorUsage = {
  label: string
  /**
   * What to set as the Figma layer name (`TextNode.name`).
   * If this usage comes from a variable, this is the variable id.
   */
  layerName: string
  /**
   * Used for de-duplication. If variableId exists, we should dedupe by it.
   * Otherwise we dedupe by the label.
   */
  uniqueKey: string
  /**
   * When present, this label was created from a variable and has mode context.
   * We store it on the created text node so "Update" can keep it consistent.
   */
  variableContext?: {
    variableId: string
    variableCollectionId: string | null
    variableModeId: string | null
    variableModeName: string | null
    isNonDefaultMode: boolean
  }
  /**
   * When present, the label was built from a variable name + linked name.
   * Used to apply different fills for the two parts.
   */
  styledVariableParts?: {
    primaryText: string
    separator: string
    secondaryText: string
  }
}

export function maybeStripFolderPrefix(name: string, hideFolderNames: boolean): string {
  if (!hideFolderNames) return name
  const idx = name.lastIndexOf("/")
  if (idx === -1) return name
  const leaf = name.slice(idx + 1)
  return leaf || name
}

export function getBoundColorVariableIdFromPaint(paint: Paint): string | null {
  if (paint.type !== "SOLID") return null
  const maybeBoundVariables = (paint as any).boundVariables as any
  const colorBinding = maybeBoundVariables?.color
  if (colorBinding && typeof colorBinding === "object" && typeof colorBinding.id === "string") {
    return colorBinding.id
  }
  return null
}

const variableCollectionCache = new Map<string, VariableCollection>()

export function stripTrailingModeSuffix(layerName: string): string {
  return layerName.replace(/\s*\([^)]+\)\s*$/, "").trim()
}

export function extractModeNameFromLayerName(layerName: string): string | null {
  const m = layerName.match(/\(([^)]+)\)\s*$/)
  const name = (m?.[1] ?? "").trim()
  return name ? name : null
}

export function extractVariableIdFromLayerName(layerName: string): string | null {
  const trimmed = layerName.trim()
  if (!trimmed || !trimmed.startsWith("VariableID")) return null
  const spaceIdx = trimmed.indexOf(" ")
  const parenIdx = trimmed.indexOf("(")
  const endCandidates = [spaceIdx, parenIdx].filter((i) => i > 0)
  const end = endCandidates.length > 0 ? Math.min(...endCandidates) : trimmed.length
  const candidate = trimmed.slice(0, end).trim()
  return candidate || null
}

export async function getVariableCollectionCached(collectionId: string): Promise<VariableCollection | null> {
  if (!collectionId) return null
  const cached = variableCollectionCache.get(collectionId)
  if (cached) return cached
  try {
    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    if (collection) variableCollectionCache.set(collectionId, collection)
    return collection ?? null
  } catch {
    return null
  }
}

export type VariableModeContext = {
  variableCollectionId: string | null
  modeId: string | null
  modeName: string | null
  isNonDefaultMode: boolean
}

export async function resolveVariableModeContext(
  variableCollectionId: string | undefined,
  node: SceneNode | undefined,
  valuesByMode: Record<string, any> | undefined,
  explicitModeId?: string | null
): Promise<VariableModeContext> {
  const collectionId = variableCollectionId ?? null
  if (!collectionId) {
    return { variableCollectionId: null, modeId: null, modeName: null, isNonDefaultMode: false }
  }

  let modeId: string | null = explicitModeId ?? null

  if (!modeId && node && "resolvedVariableModes" in node) {
    const resolvedModes = (node as any).resolvedVariableModes
    if (resolvedModes && typeof resolvedModes === "object" && collectionId in resolvedModes) {
      const maybe = resolvedModes[collectionId]
      if (typeof maybe === "string") modeId = maybe
    }
  }

  if (!modeId && valuesByMode && Object.keys(valuesByMode).length > 0) {
    modeId = Object.keys(valuesByMode)[0] ?? null
  }

  const collection = await getVariableCollectionCached(collectionId)
  const defaultModeId: string | null = (collection as any)?.defaultModeId ?? null

  if (!modeId) {
    modeId =
      defaultModeId ??
      (Array.isArray((collection as any)?.modes) ? (collection as any).modes[0]?.modeId : null) ??
      null
  }

  const modes: Array<{ modeId: string; name: string }> = Array.isArray((collection as any)?.modes) ? (collection as any).modes : []
  const modeName = modeId ? modes.find((m) => m.modeId === modeId)?.name ?? null : null

  const isNonDefaultMode = !!(defaultModeId && modeId && modeId !== defaultModeId)
  return { variableCollectionId: collectionId, modeId, modeName, isNonDefaultMode }
}

export async function resolveModeIdByName(variableCollectionId: string, modeName: string): Promise<string | null> {
  const wanted = modeName.trim().toLowerCase()
  if (!variableCollectionId || !wanted) return null
  const collection = await getVariableCollectionCached(variableCollectionId)
  const modes: Array<{ modeId: string; name: string }> = Array.isArray((collection as any)?.modes) ? (collection as any).modes : []
  return modes.find((m) => (m.name ?? "").trim().toLowerCase() === wanted)?.modeId ?? null
}

export function isTextNode(node: SceneNode): node is TextNode {
  return node.type === "TEXT"
}

export async function findLocalVariableIdByName(name: string): Promise<string | null> {
  const wanted = name.trim().toLowerCase()
  if (!wanted) return null

  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    const seen = new Set<string>()
    for (const collection of collections as any[]) {
      const variableIds: string[] = Array.isArray(collection.variableIds) ? collection.variableIds : []
      for (const id of variableIds) {
        if (!id || seen.has(id)) continue
        seen.add(id)
        try {
          const variable = await figma.variables.getVariableByIdAsync(id)
          const full = (variable?.name ?? "").trim().toLowerCase()
          const leaf = maybeStripFolderPrefix(variable?.name ?? "", true).trim().toLowerCase()
          const key = (variable?.key ?? "").trim().toLowerCase()
          if (full === wanted || leaf === wanted || key === wanted) {
            return id
          }
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  return null
}

