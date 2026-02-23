/**
 * Factory helpers for creating minimal fake Figma objects in tests.
 * Only model the fields each function actually reads.
 */

export function makeSolidPaint(
  overrides: {
    r?: number
    g?: number
    b?: number
    opacity?: number
    variableId?: string | null
    visible?: boolean
  } = {}
): SolidPaint {
  const paint: any = {
    type: 'SOLID' as const,
    color: { r: overrides.r ?? 0, g: overrides.g ?? 0, b: overrides.b ?? 0 },
    opacity: overrides.opacity ?? 1,
    visible: overrides.visible ?? true,
  }

  if (overrides.variableId) {
    paint.boundVariables = { color: { id: overrides.variableId, type: 'VARIABLE_ALIAS' } }
  }

  return paint as SolidPaint
}

export function makeSceneNode(
  overrides: {
    type?: string
    id?: string
    name?: string
    visible?: boolean
    children?: any[]
    fills?: any[]
    strokes?: any[]
    boundVariables?: any
    fillStyleId?: string
    strokeStyleId?: string
    backgroundStyleId?: string
    effectStyleId?: string
    textStyleId?: string
  } = {}
): SceneNode {
  const node: any = {
    type: overrides.type ?? 'RECTANGLE',
    id: overrides.id ?? '1:1',
    name: overrides.name ?? 'Node',
    visible: overrides.visible ?? true,
  }

  if (overrides.children !== undefined) node.children = overrides.children
  if (overrides.fills !== undefined) node.fills = overrides.fills
  if (overrides.strokes !== undefined) node.strokes = overrides.strokes
  if (overrides.boundVariables !== undefined) node.boundVariables = overrides.boundVariables
  if (overrides.fillStyleId !== undefined) node.fillStyleId = overrides.fillStyleId
  if (overrides.strokeStyleId !== undefined) node.strokeStyleId = overrides.strokeStyleId
  if (overrides.backgroundStyleId !== undefined) node.backgroundStyleId = overrides.backgroundStyleId
  if (overrides.effectStyleId !== undefined) node.effectStyleId = overrides.effectStyleId
  if (overrides.textStyleId !== undefined) node.textStyleId = overrides.textStyleId

  return node as SceneNode
}
