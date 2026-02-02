import { ColorUsage, getBoundColorVariableIdFromPaint, maybeStripFolderPrefix, resolveVariableModeContext, type VariableModeContext } from "./shared"

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

async function getStyleName(node: SceneNode, property: "fills" | "strokes"): Promise<string | null> {
  if (property === "fills" && "fillStyleId" in node && node.fillStyleId && typeof node.fillStyleId === "string") {
    try {
      const style = await figma.getStyleByIdAsync(node.fillStyleId)
      if (style?.name) return style.name
    } catch {
      // ignore
    }
  }

  if (
    property === "strokes" &&
    "strokeStyleId" in node &&
    node.strokeStyleId &&
    typeof node.strokeStyleId === "string"
  ) {
    try {
      const style = await figma.getStyleByIdAsync(node.strokeStyleId)
      if (style?.name) return style.name
    } catch {
      // ignore
    }
  }

  return null
}

async function resolveVariableLabelPartsFromVariable(
  variableId: string,
  showLinkedColors: boolean,
  node: SceneNode | undefined,
  hideFolderNames: boolean,
  explicitModeId?: string | null
): Promise<{ primaryText: string; secondaryText: string; modeContext: VariableModeContext }> {
  const variable = await figma.variables.getVariableByIdAsync(variableId)
  const primaryText = maybeStripFolderPrefix(variable?.name ?? variable?.key ?? "Unknown Variable", hideFolderNames)

  const modeContext = await resolveVariableModeContext(
    variable?.variableCollectionId,
    node,
    (variable as any)?.valuesByMode,
    explicitModeId
  )

  if (!showLinkedColors) return { primaryText, secondaryText: "", modeContext }

  let secondaryText = ""

  const currentModeId = modeContext.modeId
  const value = currentModeId && variable?.valuesByMode ? (variable.valuesByMode as any)[currentModeId] : undefined

  // Alias => show linked variable name.
  if (value && typeof value === "object" && "type" in value && (value as any).type === "VARIABLE_ALIAS") {
    const aliasValue = value as any
    if (aliasValue.id) {
      try {
        const linkedVariable = await figma.variables.getVariableByIdAsync(aliasValue.id)
        if (linkedVariable?.name) secondaryText = maybeStripFolderPrefix(linkedVariable.name, hideFolderNames)
      } catch {
        // ignore
      }
    }
  } else if (value && typeof value === "object" && "r" in value && "g" in value && "b" in value) {
    // Direct color value => try match a local paint style, else hex.
    const rgb: RGB = { r: (value as any).r, g: (value as any).g, b: (value as any).b }
    const alpha: number | undefined = typeof (value as any).a === "number" ? (value as any).a : undefined
    const valueOpacity = alpha === undefined ? 1 : alpha

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
          secondaryText = maybeStripFolderPrefix(style.name, hideFolderNames)
          break
        }
      }
    } catch {
      // ignore
    }

    if (!secondaryText) secondaryText = rgbToHex(rgb)

    if (alpha !== undefined && alpha !== 1) {
      secondaryText += ` ${Math.round(alpha * 100)}%`
    }
  }

  return { primaryText, secondaryText, modeContext }
}

async function getColorUsage(
  paint: Paint,
  showLinkedColors: boolean = true,
  node?: SceneNode,
  hideFolderNames: boolean = false
): Promise<ColorUsage> {
  const boundVariableId = getBoundColorVariableIdFromPaint(paint)

  // Variable case: build parts so we can apply different fills to each segment.
  if (boundVariableId) {
    const parts = await resolveVariableLabelPartsFromVariable(boundVariableId, showLinkedColors, node, hideFolderNames)
    const primaryText = parts.primaryText
    const secondaryText = parts.secondaryText

    if (showLinkedColors && secondaryText && paint.type === "SOLID") {
      const separator = "   "
      let opacitySuffix = ""
      if (paint.opacity !== undefined && paint.opacity !== 1) {
        opacitySuffix = ` ${Math.round(paint.opacity * 100)}%`
      }
      const secondaryWithOpacity = `${secondaryText}${opacitySuffix}`
      return {
        label: `${primaryText}${separator}${secondaryWithOpacity}`,
        layerName: boundVariableId,
        uniqueKey: boundVariableId,
        variableContext: {
          variableId: boundVariableId,
          variableCollectionId: parts.modeContext.variableCollectionId,
          variableModeId: parts.modeContext.modeId,
          variableModeName: parts.modeContext.modeName,
          isNonDefaultMode: parts.modeContext.isNonDefaultMode,
        },
        styledVariableParts: {
          primaryText,
          separator,
          secondaryText: secondaryWithOpacity,
        },
      }
    }

    return {
      label: primaryText,
      layerName: boundVariableId,
      uniqueKey: boundVariableId,
      variableContext: {
        variableId: boundVariableId,
        variableCollectionId: parts.modeContext.variableCollectionId,
        variableModeId: parts.modeContext.modeId,
        variableModeName: parts.modeContext.modeName,
        isNonDefaultMode: parts.modeContext.isNonDefaultMode,
      },
    }
  }

  // Style names / hex.
  if (paint.type === "SOLID") {
    const label = rgbToHex(paint.color) + (paint.opacity !== undefined && paint.opacity !== 1 ? ` ${Math.round(paint.opacity * 100)}%` : "")
    return { label, layerName: label, uniqueKey: label }
  }

  return { label: "unknown color", layerName: "unknown color", uniqueKey: "unknown color" }
}

export async function analyzeNodeColors(
  node: SceneNode,
  showLinkedColors: boolean = true,
  hideFolderNames: boolean = false
): Promise<Array<ColorUsage>> {
  const colorInfo: Array<ColorUsage> = []

  if (node.visible === false) return colorInfo

  // Fills
  if ("fills" in node && node.fills && Array.isArray(node.fills) && node.fills.length > 0) {
    const fillStyleName = await getStyleName(node, "fills")
    if (fillStyleName) {
      const label = maybeStripFolderPrefix(fillStyleName, hideFolderNames)
      colorInfo.push({ label, layerName: label, uniqueKey: label })
    } else {
      const fillColors = await Promise.all(
        node.fills
          .filter((fill) => fill.type === "SOLID" && fill.visible !== false && (fill.opacity === undefined || fill.opacity > 0))
          .map((fill) => getColorUsage(fill, showLinkedColors, node, hideFolderNames))
      )
      colorInfo.push(...fillColors)
    }
  }

  // Strokes
  if ("strokes" in node && node.strokes && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const strokeStyleName = await getStyleName(node, "strokes")
    if (strokeStyleName) {
      const label = maybeStripFolderPrefix(strokeStyleName, hideFolderNames)
      colorInfo.push({ label, layerName: label, uniqueKey: label })
    } else {
      const strokeColors = await Promise.all(
        node.strokes
          .filter((stroke) => stroke.type === "SOLID" && stroke.visible !== false && (stroke.opacity === undefined || stroke.opacity > 0))
          .map((stroke) => getColorUsage(stroke, showLinkedColors, node, hideFolderNames))
      )
      colorInfo.push(...strokeColors)
    }
  }

  // Recursively check children, but skip children of Union layers
  if ("children" in node) {
    const isUnion = node.type === "BOOLEAN_OPERATION" && (node as BooleanOperationNode).booleanOperation === "UNION"
    if (!isUnion) {
      const children = node as unknown as ChildrenMixin
      for (const child of children.children) {
        const childColors = await analyzeNodeColors(child, showLinkedColors, hideFolderNames)
        colorInfo.push(...childColors)
      }
    }
  }

  // De-dupe and sort
  const uniqueByKey = new Map<string, ColorUsage>()
  for (const item of colorInfo) {
    if (!uniqueByKey.has(item.uniqueKey)) uniqueByKey.set(item.uniqueKey, item)
  }
  const uniqueColors = Array.from(uniqueByKey.values())
  return uniqueColors.sort((a, b) => {
    const aIsHex = a.label.startsWith("#")
    const bIsHex = b.label.startsWith("#")
    if (aIsHex && !bIsHex) return 1
    if (!aIsHex && bIsHex) return -1
    return a.label.localeCompare(b.label)
  })
}

export function calculateTextPositionFromRect(
  rect: { x: number; y: number; width: number; height: number },
  position: "left" | "right",
  index: number
): { x: number; y: number } {
  const spacing = 16
  const lineHeight = 24
  const centerY = rect.y + rect.height / 2
  const startY = centerY - 10

  if (position === "left") {
    return { x: rect.x - spacing, y: startY + index * lineHeight }
  }
  return { x: rect.x + rect.width + spacing, y: startY + index * lineHeight }
}

