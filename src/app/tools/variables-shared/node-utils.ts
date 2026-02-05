// ============================================================================
// Node Traversal and Binding Utilities
// Ported from variables-rename-helper
// ============================================================================

import type { VariableBindingMap, UsagesReplacePhase } from './types'

// ============================================================================
// Type Guards
// ============================================================================

type FillsNode = SceneNode & { fills: ReadonlyArray<Paint> | PluginAPI['mixed'] }
type StrokesNode = SceneNode & { strokes: ReadonlyArray<Paint> | PluginAPI['mixed'] }
type FillStyleNode = SceneNode & { fillStyleId: string | symbol }
type StrokeStyleNode = SceneNode & { strokeStyleId: string | symbol }
type BackgroundStyleNode = SceneNode & { backgroundStyleId: string | symbol }
type EffectStyleNode = SceneNode & { effectStyleId: string | symbol }
type TextStyleNode = SceneNode & { textStyleId: string | symbol }
type VariableSettableNode = SceneNode & {
  setBoundVariable: (field: VariableBindableNodeField | VariableBindableTextField, variable: Variable) => void
}

export const hasChildren = (node: SceneNode): node is SceneNode & ChildrenMixin => {
  return 'children' in node && Array.isArray(node.children)
}

export const isNodeVisible = (node: SceneNode): boolean => {
  return node.visible !== false
}

export const hasBoundVariables = (
  node: SceneNode
): node is SceneNode & { boundVariables: VariableBindingMap } => {
  return 'boundVariables' in node && node.boundVariables !== undefined
}

export const hasFills = (node: SceneNode): node is FillsNode => {
  return 'fills' in node
}

export const hasStrokes = (node: SceneNode): node is StrokesNode => {
  return 'strokes' in node
}

export const hasFillStyleId = (node: SceneNode): node is FillStyleNode => {
  return 'fillStyleId' in node && node.fillStyleId !== undefined
}

export const hasStrokeStyleId = (node: SceneNode): node is StrokeStyleNode => {
  return 'strokeStyleId' in node && node.strokeStyleId !== undefined
}

export const hasBackgroundStyleId = (node: SceneNode): node is BackgroundStyleNode => {
  return 'backgroundStyleId' in node && node.backgroundStyleId !== undefined
}

export const hasEffectStyleId = (node: SceneNode): node is EffectStyleNode => {
  return 'effectStyleId' in node && node.effectStyleId !== undefined
}

export const hasTextStyleId = (node: SceneNode): node is TextStyleNode => {
  return 'textStyleId' in node && node.textStyleId !== undefined
}

// ============================================================================
// Node Traversal
// ============================================================================

export const getSelectionWithDescendants = (
  selection: readonly SceneNode[],
  includeHidden = false
): SceneNode[] => {
  const stack = [...selection]
  const result: SceneNode[] = []

  while (stack.length) {
    const node = stack.pop()
    if (!node) continue
    if (!includeHidden && !isNodeVisible(node)) continue
    result.push(node)

    if (hasChildren(node)) {
      stack.push(...node.children)
    }
  }

  return result
}

export type NodeWithContext = { node: SceneNode; phase: UsagesReplacePhase }

export const collectNodesForScope = (
  scope: 'selection' | 'page',
  includeHidden: boolean
): NodeWithContext[] => {
  const roots = scope === 'selection' ? figma.currentPage.selection : figma.currentPage.children
  const stack: Array<{ node: SceneNode; inComponent: boolean; inInstance: boolean }> = roots.map(
    (n) => ({
      node: n,
      inComponent: false,
      inInstance: false,
    })
  )

  const result: NodeWithContext[] = []

  while (stack.length) {
    const item = stack.pop()
    if (!item) continue
    const node = item.node
    if (!includeHidden && !isNodeVisible(node)) continue

    const phase: UsagesReplacePhase = item.inComponent
      ? item.inInstance
        ? 'instance_in_component'
        : 'component'
      : 'other'
    result.push({ node, phase })

    if (hasChildren(node)) {
      const nextInComponent = item.inComponent || node.type === 'COMPONENT'
      const nextInInstance = item.inInstance || node.type === 'INSTANCE'
      for (const child of node.children) {
        stack.push({ node: child, inComponent: nextInComponent, inInstance: nextInInstance })
      }
    }
  }

  return result
}

// ============================================================================
// Binding Readers
// ============================================================================

export const readBindings = (
  boundVariables: VariableBindingMap
): { variableId: string; property: string }[] => {
  const entries: { variableId: string; property: string }[] = []

  for (const [property, binding] of Object.entries(boundVariables)) {
    if (!binding) continue

    if (Array.isArray(binding)) {
      for (const item of binding) {
        if (item?.id) {
          entries.push({ variableId: item.id, property })
        }
      }
    } else if (typeof binding === 'object' && 'id' in binding && binding.id) {
      entries.push({ variableId: binding.id, property })
    }
  }

  return entries
}

// ============================================================================
// Color Helpers
// ============================================================================

export const solidPaintToHex = (paint: SolidPaint): string => {
  const toHex = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, '0')

  const r = toHex(paint.color.r)
  const g = toHex(paint.color.g)
  const b = toHex(paint.color.b)
  const opacity = paint.opacity ?? 1

  if (opacity < 1) {
    const a = toHex(opacity)
    return `#${(r + g + b + a).toUpperCase()}`
  }

  return `#${(r + g + b).toUpperCase()}`
}

export const collectSolidColors = (node: SceneNode): { hex: string; property: string }[] => {
  const entries: { hex: string; property: string }[] = []

  if (hasFills(node)) {
    const paints = node.fills
    if (paints && paints !== figma.mixed) {
      for (const paint of paints) {
        if (paint.type === 'SOLID' && paint.visible !== false) {
          entries.push({ hex: solidPaintToHex(paint), property: 'fills' })
        }
      }
    }
  }

  if (hasStrokes(node)) {
    const paints = node.strokes
    if (paints && paints !== figma.mixed) {
      for (const paint of paints) {
        if (paint.type === 'SOLID' && paint.visible !== false) {
          entries.push({ hex: solidPaintToHex(paint), property: 'strokes' })
        }
      }
    }
  }

  return entries
}

// ============================================================================
// Style Binding Helpers
// ============================================================================

// Style caches
const paintStyleCache = new Map<string, PaintStyle | null>()
const effectStyleCache = new Map<string, EffectStyle | null>()
const textStyleCache = new Map<string, TextStyle | null>()

export const getPaintStyle = async (styleId: string): Promise<PaintStyle | null> => {
  if (paintStyleCache.has(styleId)) {
    return paintStyleCache.get(styleId) ?? null
  }
  try {
    const style = await figma.getStyleByIdAsync(styleId)
    if (style && style.type === 'PAINT') {
      paintStyleCache.set(styleId, style as PaintStyle)
      return style as PaintStyle
    }
    paintStyleCache.set(styleId, null)
    return null
  } catch {
    paintStyleCache.set(styleId, null)
    return null
  }
}

export const getEffectStyle = async (styleId: string): Promise<EffectStyle | null> => {
  if (effectStyleCache.has(styleId)) {
    return effectStyleCache.get(styleId) ?? null
  }
  try {
    const style = await figma.getStyleByIdAsync(styleId)
    if (style && style.type === 'EFFECT') {
      effectStyleCache.set(styleId, style as EffectStyle)
      return style as EffectStyle
    }
    effectStyleCache.set(styleId, null)
    return null
  } catch {
    effectStyleCache.set(styleId, null)
    return null
  }
}

export const getTextStyle = async (styleId: string): Promise<TextStyle | null> => {
  if (textStyleCache.has(styleId)) {
    return textStyleCache.get(styleId) ?? null
  }
  try {
    const style = await figma.getStyleByIdAsync(styleId)
    if (style && style.type === 'TEXT') {
      textStyleCache.set(styleId, style as TextStyle)
      return style as TextStyle
    }
    textStyleCache.set(styleId, null)
    return null
  } catch {
    textStyleCache.set(styleId, null)
    return null
  }
}

export const collectStyleAliases = (style: PaintStyle): string[] => {
  const aliasIds: string[] = []

  const styleLevelAliases = style.boundVariables?.paints ?? []
  for (const alias of styleLevelAliases) {
    if (alias?.id) {
      aliasIds.push(alias.id)
    }
  }

  for (const paint of style.paints) {
    if (paint.type !== 'SOLID') continue
    const bound = paint.boundVariables?.color
    if (bound?.id) {
      aliasIds.push(bound.id)
    }
  }

  return aliasIds
}

export const collectEffectStyleAliases = (style: EffectStyle): string[] => {
  const aliasIds: string[] = []
  const styleLevelAliases = style.boundVariables?.effects ?? []
  for (const alias of styleLevelAliases) {
    if (alias?.id) {
      aliasIds.push(alias.id)
    }
  }

  for (const effect of style.effects) {
    const boundEntries = Object.values(effect.boundVariables ?? {}) as (VariableAlias | undefined)[]
    for (const alias of boundEntries) {
      if (alias?.id) {
        aliasIds.push(alias.id)
      }
    }
  }

  return aliasIds
}

type TextStyleAlias = { id: string; field?: string }

export const collectTextStyleAliases = (style: TextStyle): TextStyleAlias[] => {
  const aliases: TextStyleAlias[] = []
  const boundEntries = Object.entries(style.boundVariables ?? {}) as [
    string,
    VariableAlias | undefined
  ][]

  for (const [field, alias] of boundEntries) {
    if (!alias?.id) continue
    aliases.push({ id: alias.id, field })
  }

  return aliases
}

// ============================================================================
// Variable Binding Helpers
// ============================================================================

export const setBoundVariableTry = (
  node: SceneNode,
  property: string,
  variable: Variable
): boolean => {
  const target = node as VariableSettableNode
  try {
    target.setBoundVariable(property as VariableBindableNodeField | VariableBindableTextField, variable)
    return true
  } catch {
    return false
  }
}

// ============================================================================
// Name Helpers
// ============================================================================

export const getVariableNameSuffix = (name: string): string => {
  const parts = name.split('/')
  return parts[parts.length - 1] || ''
}

export const getVariableGroupName = (name: string): string => {
  const parts = name.split('/')
  if (parts.length <= 1) return ''
  return parts.slice(0, -1).join('/')
}

export const nodeNameStartsWithVariableId = (name: string): boolean =>
  /^VariableID:[^\s]+/.test(String(name || ''))

export const getVariableIdPrefixFromLayerName = (name: string): string | null => {
  const match = /^VariableID:[^\s]+/.exec(String(name || ''))
  return match ? match[0] : null
}

// ============================================================================
// Cache Management
// ============================================================================

export const clearStyleCaches = (): void => {
  paintStyleCache.clear()
  effectStyleCache.clear()
  textStyleCache.clear()
}
