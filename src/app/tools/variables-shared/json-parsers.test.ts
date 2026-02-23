import { describe, it, expect } from 'vitest'
import {
  isString,
  parseImportedRenamePlan,
  parseSnapshotDoc,
  snapshotTypeToResolvedType,
  flattenSnapshotVariablesTree,
  flattenSnapshotDoc,
  parseUsagesReplaceMappingJson,
} from './json-parsers'

describe('isString', () => {
  it('returns true for strings', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
  })

  it('returns false for non-strings', () => {
    expect(isString(42)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

// ============================================================================
// Rename Plan Parsing
// ============================================================================

describe('parseImportedRenamePlan', () => {
  it('parses a minimal valid plan', () => {
    const json = JSON.stringify({
      version: 1,
      entries: [{ id: 'var1', newName: 'primary' }],
    })
    const { plan, meta } = parseImportedRenamePlan(json)
    expect(plan.version).toBe(1)
    expect(plan.entries).toHaveLength(1)
    expect(plan.entries[0].id).toBe('var1')
    expect(plan.entries[0].newName).toBe('primary')
    expect(meta.version).toBe(1)
  })

  it('parses token-based format', () => {
    const json = JSON.stringify({
      version: 1,
      name: 'My Set',
      tokens: [{ id: 'var1', name: 'primary' }],
    })
    const { plan } = parseImportedRenamePlan(json)
    expect(plan.entries).toHaveLength(1)
    expect(plan.entries[0].newName).toBe('primary')
    expect(plan.title).toBe('My Set')
  })

  it('extracts scope when present', () => {
    const json = JSON.stringify({
      version: 1,
      entries: [{ id: 'var1', newName: 'x' }],
      scope: { types: ['COLOR'], collectionId: 'col1' },
    })
    const { plan } = parseImportedRenamePlan(json)
    expect(plan.scope!.types).toEqual(['COLOR'])
    expect(plan.scope!.collectionId).toBe('col1')
  })

  it('defaults scope types to all when absent', () => {
    const json = JSON.stringify({
      version: 1,
      entries: [{ id: 'var1', newName: 'x' }],
    })
    const { plan } = parseImportedRenamePlan(json)
    expect(plan.scope!.types).toEqual(['COLOR', 'FLOAT', 'STRING', 'BOOLEAN'])
  })

  it('throws on invalid JSON', () => {
    expect(() => parseImportedRenamePlan('not json')).toThrow('Invalid JSON')
  })

  it('throws on wrong version', () => {
    expect(() => parseImportedRenamePlan(JSON.stringify({ version: 2, entries: [] }))).toThrow(
      'version must be 1'
    )
  })

  it('throws when entries/tokens missing', () => {
    expect(() => parseImportedRenamePlan(JSON.stringify({ version: 1 }))).toThrow(
      'expected "entries" or "tokens"'
    )
  })

  it('handles expectedOldName and currentName', () => {
    const json = JSON.stringify({
      version: 1,
      entries: [{ id: 'var1', expectedOldName: 'old', newName: 'new' }],
    })
    const { plan } = parseImportedRenamePlan(json)
    expect(plan.entries[0].expectedOldName).toBe('old')
  })
})

// ============================================================================
// Snapshot Parsing
// ============================================================================

describe('parseSnapshotDoc', () => {
  it('parses a valid snapshot', () => {
    const json = JSON.stringify({
      collections: [{ name: 'Colors', variables: {} }],
    })
    const doc = parseSnapshotDoc(json)
    expect(doc.collections).toHaveLength(1)
    expect(doc.collections[0].name).toBe('Colors')
  })

  it('throws on invalid JSON', () => {
    expect(() => parseSnapshotDoc('bad')).toThrow('Invalid JSON')
  })

  it('throws on missing collections', () => {
    expect(() => parseSnapshotDoc(JSON.stringify({}))).toThrow('expected "collections"')
  })
})

describe('snapshotTypeToResolvedType', () => {
  it('maps color', () => {
    expect(snapshotTypeToResolvedType('color')).toBe('COLOR')
  })

  it('maps number', () => {
    expect(snapshotTypeToResolvedType('number')).toBe('FLOAT')
  })

  it('maps string', () => {
    expect(snapshotTypeToResolvedType('string')).toBe('STRING')
  })

  it('maps boolean', () => {
    expect(snapshotTypeToResolvedType('boolean')).toBe('BOOLEAN')
  })

  it('returns null for unknown types', () => {
    expect(snapshotTypeToResolvedType('unknown')).toBeNull()
  })

  it('is case-insensitive', () => {
    expect(snapshotTypeToResolvedType('Color')).toBe('COLOR')
  })
})

describe('flattenSnapshotVariablesTree', () => {
  it('flattens a leaf entry', () => {
    const tree = {
      primary: {
        type: 'color',
        values: { 'mode1': { r: 1, g: 0, b: 0 } },
      },
    }
    const out: any[] = []
    flattenSnapshotVariablesTree('Colors', tree, [], out)
    expect(out).toHaveLength(1)
    expect(out[0].collectionName).toBe('Colors')
    expect(out[0].variableName).toBe('primary')
    expect(out[0].resolvedType).toBe('COLOR')
  })

  it('flattens nested groups', () => {
    const tree = {
      button: {
        primary: {
          type: 'color',
          values: { m1: {} },
        },
        secondary: {
          type: 'color',
          values: { m1: {} },
        },
      },
    }
    const out: any[] = []
    flattenSnapshotVariablesTree('UI', tree, [], out)
    expect(out).toHaveLength(2)
    expect(out.map((e) => e.variableName).sort()).toEqual(['button/primary', 'button/secondary'])
  })

  it('skips entries without a type', () => {
    const tree = { invalid: { values: { m1: {} } } }
    const out: any[] = []
    flattenSnapshotVariablesTree('X', tree, [], out)
    expect(out).toHaveLength(0)
  })

  it('handles null/array inputs gracefully', () => {
    const out: any[] = []
    flattenSnapshotVariablesTree('X', null, [], out)
    expect(out).toHaveLength(0)
    flattenSnapshotVariablesTree('X', [1, 2, 3], [], out)
    expect(out).toHaveLength(0)
  })
})

describe('flattenSnapshotDoc', () => {
  it('flattens a complete doc', () => {
    const doc = {
      collections: [
        {
          name: 'Colors',
          variables: {
            primary: { type: 'color', values: { m1: {} } },
          },
        },
      ],
    }
    const entries = flattenSnapshotDoc(doc as any)
    expect(entries).toHaveLength(1)
    expect(entries[0].variableName).toBe('primary')
  })

  it('skips collections without variables', () => {
    const doc = { collections: [{ name: 'Empty' }] }
    const entries = flattenSnapshotDoc(doc as any)
    expect(entries).toHaveLength(0)
  })
})

// ============================================================================
// Usages Replace Mapping
// ============================================================================

describe('parseUsagesReplaceMappingJson', () => {
  it('parses a valid mapping', () => {
    const json = JSON.stringify({
      version: 1,
      replacements: [{ from: 'old', to: 'new' }],
    })
    const doc = parseUsagesReplaceMappingJson(json)
    expect(doc.version).toBe(1)
    expect(doc.replacements).toHaveLength(1)
    expect(doc.replacements[0]).toEqual({ from: 'old', to: 'new' })
  })

  it('extracts optional collectionName and collectionId', () => {
    const json = JSON.stringify({
      version: 1,
      collectionName: 'Colors',
      collectionId: 'col1',
      replacements: [],
    })
    const doc = parseUsagesReplaceMappingJson(json)
    expect(doc.collectionName).toBe('Colors')
    expect(doc.collectionId).toBe('col1')
  })

  it('throws on invalid JSON', () => {
    expect(() => parseUsagesReplaceMappingJson('bad')).toThrow('Invalid JSON')
  })

  it('throws on wrong version', () => {
    expect(() =>
      parseUsagesReplaceMappingJson(JSON.stringify({ version: 2, replacements: [] }))
    ).toThrow('version must be 1')
  })

  it('throws on missing replacements', () => {
    expect(() => parseUsagesReplaceMappingJson(JSON.stringify({ version: 1 }))).toThrow(
      'expected "replacements"'
    )
  })

  it('handles malformed replacement entries', () => {
    const json = JSON.stringify({
      version: 1,
      replacements: [null, { from: 'a', to: 'b' }, 42],
    })
    const doc = parseUsagesReplaceMappingJson(json)
    expect(doc.replacements).toHaveLength(3)
    expect(doc.replacements[0]).toEqual({ from: '', to: '' })
    expect(doc.replacements[1]).toEqual({ from: 'a', to: 'b' })
    expect(doc.replacements[2]).toEqual({ from: '', to: '' })
  })
})
