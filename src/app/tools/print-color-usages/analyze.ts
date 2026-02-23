import { ColorUsage, getBoundColorVariableIdFromPaint, maybeStripFolderPrefix, resolveVariableLabelPartsFromVariable, rgbToHex } from "./shared"

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

async function getColorUsage(
  paint: Paint,
  showLinkedColors: boolean = true,
  node?: SceneNode,
  showFolderNames: boolean = false
): Promise<ColorUsage> {
  const boundVariableId = getBoundColorVariableIdFromPaint(paint)

  // Variable case: build parts so we can apply different fills to each segment.
  if (boundVariableId) {
    const parts = await resolveVariableLabelPartsFromVariable(boundVariableId, showLinkedColors, node, showFolderNames)
    const primaryText = parts.primaryText
    const secondaryText = parts.secondaryText

    if (showLinkedColors && secondaryText && paint.type === "SOLID") {
      const separator = "   "
      // Combine variable alpha and paint opacity into one effective opacity value.
      const varAlpha = parts.alpha !== undefined ? parts.alpha : 1
      const paintOpacity = paint.opacity !== undefined ? paint.opacity : 1
      const effectiveOpacity = varAlpha * paintOpacity
      let opacitySuffix = ""
      if (Math.abs(effectiveOpacity - 1) > 0.001) {
        opacitySuffix = ` ${Math.round(effectiveOpacity * 100)}%`
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
  showFolderNames: boolean = false,
  checkNested: boolean = true
): Promise<Array<ColorUsage>> {
  const colorInfo: Array<ColorUsage> = []

  if (node.visible === false) return colorInfo

  // Fills
  if ("fills" in node && node.fills && Array.isArray(node.fills) && node.fills.length > 0) {
    const fillStyleName = await getStyleName(node, "fills")
    if (fillStyleName) {
      const label = maybeStripFolderPrefix(fillStyleName, showFolderNames)
      colorInfo.push({ label, layerName: label, uniqueKey: label })
    } else {
      const fillColors = await Promise.all(
        node.fills
          .filter((fill) => fill.type === "SOLID" && fill.visible !== false && (fill.opacity === undefined || fill.opacity > 0))
          .map((fill) => getColorUsage(fill, showLinkedColors, node, showFolderNames))
      )
      colorInfo.push(...fillColors)
    }
  }

  // Strokes
  if ("strokes" in node && node.strokes && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const strokeStyleName = await getStyleName(node, "strokes")
    if (strokeStyleName) {
      const label = maybeStripFolderPrefix(strokeStyleName, showFolderNames)
      colorInfo.push({ label, layerName: label, uniqueKey: label })
    } else {
      const strokeColors = await Promise.all(
        node.strokes
          .filter((stroke) => stroke.type === "SOLID" && stroke.visible !== false && (stroke.opacity === undefined || stroke.opacity > 0))
          .map((stroke) => getColorUsage(stroke, showLinkedColors, node, showFolderNames))
      )
      colorInfo.push(...strokeColors)
    }
  }

  // Recursively check children, but skip children of Union layers
  if (checkNested && "children" in node) {
    const isUnion = node.type === "BOOLEAN_OPERATION" && (node as BooleanOperationNode).booleanOperation === "UNION"
    if (!isUnion) {
      const children = node as unknown as ChildrenMixin
      for (const child of children.children) {
        const childColors = await analyzeNodeColors(child, showLinkedColors, showFolderNames, checkNested)
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
  index: number,
  spacing: number = 16
): { x: number; y: number } {
  const lineHeight = 24
  const centerY = rect.y + rect.height / 2
  const startY = centerY - 10

  if (position === "left") {
    return { x: rect.x - spacing, y: startY + index * lineHeight }
  }
  return { x: rect.x + rect.width + spacing, y: startY + index * lineHeight }
}

