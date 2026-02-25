import { colorToRgbHex, colorToOpacityPercent } from "../../variable-chain"
import type { FoundColor, ColorType } from "./types"

function isBooleanOperationChild(node: SceneNode): boolean {
  const parent = node.parent
  if (!parent || !("type" in parent)) return false
  return (parent as any).type === "BOOLEAN_OPERATION"
}

function getBoundVariableId(paint: SolidPaint): string | null {
  const bv = (paint as any).boundVariables
  if (!bv || typeof bv !== "object") return null
  const colorBinding = bv.color
  if (!colorBinding) return null
  if (typeof colorBinding === "string") return colorBinding
  if (typeof colorBinding === "object" && typeof (colorBinding as any).id === "string") {
    return (colorBinding as any).id
  }
  return null
}

function getBoundStyleId(node: SceneNode, colorType: ColorType): string | null {
  const any = node as any
  if (colorType === "FILL" || colorType === "TEXT") {
    if (any.fillStyleId && typeof any.fillStyleId === "string" && any.fillStyleId.length > 0) {
      return any.fillStyleId
    }
  }
  if (colorType === "STROKE") {
    if (any.strokeStyleId && typeof any.strokeStyleId === "string" && any.strokeStyleId.length > 0) {
      return any.strokeStyleId
    }
  }
  return null
}

async function getVariableNameById(
  variableId: string,
  cache: Map<string, string | null>
): Promise<string | null> {
  if (cache.has(variableId)) return cache.get(variableId) ?? null
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId)
    const name = variable?.name ?? null
    cache.set(variableId, name)
    return name
  } catch {
    cache.set(variableId, null)
    return null
  }
}

async function getStyleNameById(
  styleId: string,
  cache: Map<string, string | null>
): Promise<string | null> {
  if (cache.has(styleId)) return cache.get(styleId) ?? null
  try {
    const style = await figma.getStyleByIdAsync(styleId)
    const name = style?.name ?? null
    cache.set(styleId, name)
    return name
  } catch {
    cache.set(styleId, null)
    return null
  }
}

async function extractSolidPaints(
  paints: ReadonlyArray<Paint> | typeof figma.mixed | undefined,
  node: SceneNode,
  colorType: ColorType,
  variableNameCache: Map<string, string | null>,
  styleNameCache: Map<string, string | null>
): Promise<FoundColor[]> {
  if (!paints || paints === figma.mixed || !Array.isArray(paints)) return []

  const results: FoundColor[] = []
  const styleId = getBoundStyleId(node, colorType)
  const styleName = styleId ? await getStyleNameById(styleId, styleNameCache) : null

  for (let i = 0; i < paints.length; i++) {
    const paint = paints[i]
    if (paint.type !== "SOLID") continue
    if (paint.visible === false) continue

    const solid = paint as SolidPaint
    const hex = colorToRgbHex(solid.color)
    const opacity = solid.opacity !== undefined ? Math.round(solid.opacity * 100) : 100
    const variableId = getBoundVariableId(solid)
    const variableName = variableId ? await getVariableNameById(variableId, variableNameCache) : null

    results.push({
      hex,
      r: solid.color.r,
      g: solid.color.g,
      b: solid.color.b,
      opacity,
      nodeId: node.id,
      nodeName: node.name,
      colorType,
      paintIndex: i,
      sourceType: variableName ? "VARIABLE" : styleName ? "STYLE" : "RAW",
      sourceName: variableName ?? styleName ?? null,
    })
  }
  return results
}

export async function scanSelectionForColors(): Promise<FoundColor[]> {
  const selection = figma.currentPage.selection
  if (selection.length === 0) return []

  const results: FoundColor[] = []
  const stack: SceneNode[] = [...selection]
  const variableNameCache = new Map<string, string | null>()
  const styleNameCache = new Map<string, string | null>()

  while (stack.length > 0) {
    const node = stack.pop()!

    if (node.visible === false) continue
    if (isBooleanOperationChild(node)) continue

    const any = node as any

    if (node.type === "TEXT") {
      results.push(...(await extractSolidPaints(any.fills, node, "TEXT", variableNameCache, styleNameCache)))
    } else if ("fills" in any) {
      results.push(...(await extractSolidPaints(any.fills, node, "FILL", variableNameCache, styleNameCache)))
    }

    if ("strokes" in any) {
      results.push(...(await extractSolidPaints(any.strokes, node, "STROKE", variableNameCache, styleNameCache)))
    }

    if ("children" in node) {
      for (const child of node.children) {
        stack.push(child)
      }
    }
  }

  return results
}

// Backward-compat export name used by older callers.
export const scanSelectionForUnboundColors = scanSelectionForColors
