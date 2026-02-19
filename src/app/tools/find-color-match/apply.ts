import type { ColorType } from "./types"

export async function applyVariableToNode(
  nodeId: string,
  variableId: string,
  colorType: ColorType,
  paintIndex: number
): Promise<{ ok: boolean; reason?: string }> {
  const node = await figma.getNodeByIdAsync(nodeId)
  if (!node || !("id" in node)) {
    return { ok: false, reason: "Node not found" }
  }

  const variable = await figma.variables.getVariableByIdAsync(variableId)
  if (!variable) {
    return { ok: false, reason: "Variable not found" }
  }

  const sceneNode = node as SceneNode
  const any = sceneNode as any

  try {
    if (colorType === "TEXT" && sceneNode.type === "TEXT") {
      const paints = any.fills
      if (!Array.isArray(paints) || paintIndex >= paints.length) {
        return { ok: false, reason: "Paint not found at index" }
      }
      const paint = paints[paintIndex]
      if (paint.type !== "SOLID") {
        return { ok: false, reason: "Paint is not SOLID" }
      }
      const updated = figma.variables.setBoundVariableForPaint(paint, "color", variable)
      const newPaints = [...paints]
      newPaints[paintIndex] = updated
      any.fills = newPaints
      return { ok: true }
    }

    if (colorType === "FILL") {
      const paints = any.fills
      if (!Array.isArray(paints) || paintIndex >= paints.length) {
        return { ok: false, reason: "Paint not found at index" }
      }
      const paint = paints[paintIndex]
      if (paint.type !== "SOLID") {
        return { ok: false, reason: "Paint is not SOLID" }
      }
      const updated = figma.variables.setBoundVariableForPaint(paint, "color", variable)
      const newPaints = [...paints]
      newPaints[paintIndex] = updated
      any.fills = newPaints
      return { ok: true }
    }

    if (colorType === "STROKE") {
      const paints = any.strokes
      if (!Array.isArray(paints) || paintIndex >= paints.length) {
        return { ok: false, reason: "Paint not found at index" }
      }
      const paint = paints[paintIndex]
      if (paint.type !== "SOLID") {
        return { ok: false, reason: "Paint is not SOLID" }
      }
      const updated = figma.variables.setBoundVariableForPaint(paint, "color", variable)
      const newPaints = [...paints]
      newPaints[paintIndex] = updated
      any.strokes = newPaints
      return { ok: true }
    }

    return { ok: false, reason: `Unknown colorType: ${colorType}` }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) }
  }
}
