import { describe, it, expect } from 'vitest'
import { makeSceneNode, makeSolidPaint } from '../../../test-fixtures/figma-fakes'
import {
  hasChildren,
  isNodeVisible,
  hasBoundVariables,
  hasFills,
  hasStrokes,
  hasFillStyleId,
  hasStrokeStyleId,
  hasBackgroundStyleId,
  hasEffectStyleId,
  hasTextStyleId,
  getSelectionWithDescendants,
  readBindings,
  solidPaintToHex,
  getVariableNameSuffix,
  getVariableGroupName,
  nodeNameStartsWithVariableId,
  getVariableIdPrefixFromLayerName,
} from './node-utils'

// ============================================================================
// Type Guards
// ============================================================================

describe('hasChildren', () => {
  it('returns true when node has children array', () => {
    const node = makeSceneNode({ type: 'FRAME', children: [] })
    expect(hasChildren(node)).toBe(true)
  })

  it('returns false when node has no children', () => {
    const node = makeSceneNode({ type: 'RECTANGLE' })
    expect(hasChildren(node)).toBe(false)
  })
})

describe('isNodeVisible', () => {
  it('returns true for visible nodes', () => {
    expect(isNodeVisible(makeSceneNode({ visible: true }))).toBe(true)
  })

  it('returns false for hidden nodes', () => {
    expect(isNodeVisible(makeSceneNode({ visible: false }))).toBe(false)
  })
})

describe('hasBoundVariables', () => {
  it('returns true when boundVariables exists', () => {
    const node = makeSceneNode({ boundVariables: { fills: [] } })
    expect(hasBoundVariables(node)).toBe(true)
  })

  it('returns false when no boundVariables', () => {
    expect(hasBoundVariables(makeSceneNode())).toBe(false)
  })
})

describe('hasFills', () => {
  it('returns true when fills property exists', () => {
    const node = makeSceneNode({ fills: [makeSolidPaint()] })
    expect(hasFills(node)).toBe(true)
  })

  it('returns false without fills', () => {
    expect(hasFills(makeSceneNode())).toBe(false)
  })
})

describe('hasStrokes', () => {
  it('returns true when strokes property exists', () => {
    const node = makeSceneNode({ strokes: [] })
    expect(hasStrokes(node)).toBe(true)
  })

  it('returns false without strokes', () => {
    expect(hasStrokes(makeSceneNode())).toBe(false)
  })
})

describe('hasFillStyleId', () => {
  it('returns true when fillStyleId exists', () => {
    expect(hasFillStyleId(makeSceneNode({ fillStyleId: 'S:abc' }))).toBe(true)
  })

  it('returns false without fillStyleId', () => {
    expect(hasFillStyleId(makeSceneNode())).toBe(false)
  })
})

describe('hasStrokeStyleId', () => {
  it('returns true when strokeStyleId exists', () => {
    expect(hasStrokeStyleId(makeSceneNode({ strokeStyleId: 'S:abc' }))).toBe(true)
  })

  it('returns false without strokeStyleId', () => {
    expect(hasStrokeStyleId(makeSceneNode())).toBe(false)
  })
})

describe('hasBackgroundStyleId', () => {
  it('returns true when backgroundStyleId exists', () => {
    expect(hasBackgroundStyleId(makeSceneNode({ backgroundStyleId: 'S:abc' }))).toBe(true)
  })

  it('returns false without backgroundStyleId', () => {
    expect(hasBackgroundStyleId(makeSceneNode())).toBe(false)
  })
})

describe('hasEffectStyleId', () => {
  it('returns true when effectStyleId exists', () => {
    expect(hasEffectStyleId(makeSceneNode({ effectStyleId: 'S:abc' }))).toBe(true)
  })

  it('returns false without effectStyleId', () => {
    expect(hasEffectStyleId(makeSceneNode())).toBe(false)
  })
})

describe('hasTextStyleId', () => {
  it('returns true when textStyleId exists', () => {
    expect(hasTextStyleId(makeSceneNode({ textStyleId: 'S:abc' }))).toBe(true)
  })

  it('returns false without textStyleId', () => {
    expect(hasTextStyleId(makeSceneNode())).toBe(false)
  })
})

// ============================================================================
// Node Traversal
// ============================================================================

describe('getSelectionWithDescendants', () => {
  it('returns empty array for empty selection', () => {
    expect(getSelectionWithDescendants([])).toEqual([])
  })

  it('returns flat nodes as-is', () => {
    const nodes = [makeSceneNode({ id: '1' }), makeSceneNode({ id: '2' })]
    const result = getSelectionWithDescendants(nodes)
    expect(result).toHaveLength(2)
  })

  it('traverses children', () => {
    const child = makeSceneNode({ id: 'child', type: 'RECTANGLE' })
    const parent = makeSceneNode({ id: 'parent', type: 'FRAME', children: [child] })
    const result = getSelectionWithDescendants([parent])
    expect(result).toHaveLength(2)
    expect(result.map((n) => n.id)).toContain('child')
  })

  it('skips hidden nodes by default', () => {
    const hidden = makeSceneNode({ id: 'hidden', visible: false })
    const visible = makeSceneNode({ id: 'visible' })
    const result = getSelectionWithDescendants([hidden, visible])
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('visible')
  })

  it('includes hidden nodes when includeHidden=true', () => {
    const hidden = makeSceneNode({ id: 'hidden', visible: false })
    const result = getSelectionWithDescendants([hidden], true)
    expect(result).toHaveLength(1)
  })
})

// ============================================================================
// Binding Readers
// ============================================================================

describe('readBindings', () => {
  it('reads single bindings', () => {
    const bindings = { fills: { id: 'var1', type: 'VARIABLE_ALIAS' } } as any
    const result = readBindings(bindings)
    expect(result).toEqual([{ variableId: 'var1', property: 'fills' }])
  })

  it('reads array bindings', () => {
    const bindings = {
      fills: [
        { id: 'var1', type: 'VARIABLE_ALIAS' },
        { id: 'var2', type: 'VARIABLE_ALIAS' },
      ],
    } as any
    const result = readBindings(bindings)
    expect(result).toHaveLength(2)
  })

  it('skips null entries', () => {
    const bindings = { fills: null } as any
    expect(readBindings(bindings)).toEqual([])
  })
})

// ============================================================================
// Color Helpers
// ============================================================================

describe('solidPaintToHex', () => {
  it('converts black paint', () => {
    const paint = makeSolidPaint({ r: 0, g: 0, b: 0 })
    expect(solidPaintToHex(paint)).toBe('#000000')
  })

  it('converts white paint', () => {
    const paint = makeSolidPaint({ r: 1, g: 1, b: 1 })
    expect(solidPaintToHex(paint)).toBe('#FFFFFF')
  })

  it('converts a colored paint', () => {
    const paint = makeSolidPaint({ r: 1, g: 0.5, b: 0 })
    expect(solidPaintToHex(paint)).toBe('#FF8000')
  })

  it('includes alpha hex when opacity < 1', () => {
    const paint = makeSolidPaint({ r: 1, g: 0, b: 0, opacity: 0.5 })
    expect(solidPaintToHex(paint)).toBe('#FF000080')
  })

  it('omits alpha hex when opacity = 1', () => {
    const paint = makeSolidPaint({ r: 1, g: 0, b: 0, opacity: 1 })
    expect(solidPaintToHex(paint)).toBe('#FF0000')
  })
})

// ============================================================================
// Name Helpers
// ============================================================================

describe('getVariableNameSuffix', () => {
  it('returns last segment', () => {
    expect(getVariableNameSuffix('Color/Primary/Default')).toBe('Default')
  })

  it('returns name as-is when no slash', () => {
    expect(getVariableNameSuffix('Default')).toBe('Default')
  })

  it('returns empty string for empty name', () => {
    expect(getVariableNameSuffix('')).toBe('')
  })
})

describe('getVariableGroupName', () => {
  it('returns group path', () => {
    expect(getVariableGroupName('Color/Primary/Default')).toBe('Color/Primary')
  })

  it('returns empty for no group', () => {
    expect(getVariableGroupName('Default')).toBe('')
  })

  it('handles single-level group', () => {
    expect(getVariableGroupName('Color/Default')).toBe('Color')
  })
})

describe('nodeNameStartsWithVariableId', () => {
  it('returns true for variable ID prefix', () => {
    expect(nodeNameStartsWithVariableId('VariableID:abc123 (Dark)')).toBe(true)
  })

  it('returns false for regular names', () => {
    expect(nodeNameStartsWithVariableId('Button/Primary')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(nodeNameStartsWithVariableId('')).toBe(false)
  })
})

describe('getVariableIdPrefixFromLayerName', () => {
  it('extracts variable ID', () => {
    expect(getVariableIdPrefixFromLayerName('VariableID:abc123 (Dark)')).toBe('VariableID:abc123')
  })

  it('returns null for non-variable names', () => {
    expect(getVariableIdPrefixFromLayerName('Button')).toBeNull()
  })

  it('handles no suffix', () => {
    expect(getVariableIdPrefixFromLayerName('VariableID:abc123')).toBe('VariableID:abc123')
  })
})
