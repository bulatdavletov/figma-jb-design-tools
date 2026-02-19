import { colorToRgbHex, colorToOpacityPercent } from "../../variable-chain"
import type { FoundColor, ColorType } from "./types"

function isBooleanOperationChild(node: SceneNode): boolean {
  const parent = node.parent
  if (!parent || !("type" in parent)) return false
  return (parent as any).type === "BOOLEAN_OPERATION"
}

function hasBoundVariable(paint: SolidPaint): boolean {
  const bv = (paint as any).boundVariables
  if (!bv || typeof bv !== "object") return false
  return bv.color != null
}

function hasBoundStyle(node: SceneNode, colorType: ColorType): boolean {
  const any = node as any
  if (colorType === "FILL" || colorType === "TEXT") {
    if (any.fillStyleId && typeof any.fillStyleId === "string" && any.fillStyleId.length > 0) return true
  }
  if (colorType === "STROKE") {
    if (any.strokeStyleId && typeof any.strokeStyleId === "string" && any.strokeStyleId.length > 0) return true
  }
  return false
}

function extractSolidPaints(
  paints: ReadonlyArray<Paint> | typeof figma.mixed | undefined,
  node: SceneNode,
  colorType: ColorType
): FoundColor[] {
  if (!paints || paints === figma.mixed || !Array.isArray(paints)) return []
  if (hasBoundStyle(node, colorType)) return []

  const results: FoundColor[] = []
  for (let i = 0; i < paints.length; i++) {
    const paint = paints[i]
    if (paint.type !== "SOLID") continue
    if (paint.visible === false) continue
    if (hasBoundVariable(paint as SolidPaint)) continue

    const solid = paint as SolidPaint
    const hex = colorToRgbHex(solid.color)
    const opacity = solid.opacity !== undefined ? Math.round(solid.opacity * 100) : 100

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
    })
  }
  return results
}

export async function scanSelectionForUnboundColors(): Promise<FoundColor[]> {
  const selection = figma.currentPage.selection
  if (selection.length === 0) return []

  const results: FoundColor[] = []
  const stack: SceneNode[] = [...selection]

  while (stack.length > 0) {
    const node = stack.pop()!

    if (node.visible === false) continue
    if (isBooleanOperationChild(node)) continue

    const any = node as any

    if (node.type === "TEXT") {
      results.push(...extractSolidPaints(any.fills, node, "TEXT"))
    } else if ("fills" in any) {
      results.push(...extractSolidPaints(any.fills, node, "FILL"))
    }

    if ("strokes" in any) {
      results.push(...extractSolidPaints(any.strokes, node, "STROKE"))
    }

    if ("children" in node) {
      for (const child of node.children) {
        stack.push(child)
      }
    }
  }

  return results
}
