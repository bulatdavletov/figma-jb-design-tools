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

export function maybeStripFolderPrefix(name: string, showFolderNames: boolean): string {
  if (!showFolderNames) return name
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

export function rgbToHex(rgb: RGB): string {
  const red = Math.round(rgb.r * 255)
  const green = Math.round(rgb.g * 255)
  const blue = Math.round(rgb.b * 255)
  const toHex = (value: number) => {
    const hex = value.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase()
}

export type VariableLabelParts = {
  primaryText: string
  secondaryText: string
  /** Alpha channel of the variable's direct color value (undefined for aliases or non-color values). */
  alpha: number | undefined
  modeContext: VariableModeContext
}

/**
 * Resolves label parts for a variable: primary name, secondary linked color text,
 * alpha channel, and mode context. Alpha is NOT appended to secondaryText —
 * callers decide how to combine alpha with paint opacity.
 */
export async function resolveVariableLabelPartsFromVariable(
  variableId: string,
  showLinkedColors: boolean,
  node: SceneNode | undefined,
  showFolderNames: boolean,
  explicitModeId?: string | null
): Promise<VariableLabelParts> {
  const variable = await figma.variables.getVariableByIdAsync(variableId)
  const primaryText = maybeStripFolderPrefix(variable?.name ?? variable?.key ?? "Unknown Variable", showFolderNames)

  const modeContext = await resolveVariableModeContext(
    variable?.variableCollectionId,
    node,
    (variable as any)?.valuesByMode,
    explicitModeId
  )

  if (!showLinkedColors) return { primaryText, secondaryText: "", alpha: undefined, modeContext }

  let secondaryText = ""
  let alpha: number | undefined = undefined

  const currentModeId = modeContext.modeId
  const value = currentModeId && variable?.valuesByMode ? (variable.valuesByMode as any)[currentModeId] : undefined

  // Alias => show linked variable name.
  if (value && typeof value === "object" && "type" in value && (value as any).type === "VARIABLE_ALIAS") {
    const aliasValue = value as any
    if (aliasValue.id) {
      try {
        const linkedVariable = await figma.variables.getVariableByIdAsync(aliasValue.id)
        if (linkedVariable?.name) secondaryText = maybeStripFolderPrefix(linkedVariable.name, showFolderNames)
      } catch {
        // ignore
      }
    }
  } else if (value && typeof value === "object" && "r" in value && "g" in value && "b" in value) {
    // Direct color value => try match a local paint style, else hex.
    const rgb: RGB = { r: (value as any).r, g: (value as any).g, b: (value as any).b }
    const rawAlpha: number | undefined = typeof (value as any).a === "number" ? (value as any).a : undefined
    const valueOpacity = rawAlpha === undefined ? 1 : rawAlpha
    alpha = rawAlpha

    // Try style match.
    try {
      const styles = await figma.getLocalPaintStylesAsync()
      for (const style of styles) {
        if (!style.paints?.length) continue
        const stylePaint = style.paints[0]
        if (stylePaint.type !== "SOLID") continue
        const styleOpacity = stylePaint.opacity === undefined ? 1 : stylePaint.opacity
        const colorMatch =
          Math.abs(stylePaint.color.r - rgb.r) < 0.001 &&
          Math.abs(stylePaint.color.g - rgb.g) < 0.001 &&
          Math.abs(stylePaint.color.b - rgb.b) < 0.001 &&
          Math.abs(styleOpacity - valueOpacity) < 0.001
        if (colorMatch) {
          secondaryText = maybeStripFolderPrefix(style.name, showFolderNames)
          break
        }
      }
    } catch {
      // ignore
    }

    if (!secondaryText) secondaryText = rgbToHex(rgb)
    // NOTE: alpha is NOT appended here — callers combine it with paint.opacity
  }

  return { primaryText, secondaryText, alpha, modeContext }
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

