import { describe, it, expect } from 'vitest'
import type { MappingV1, MappingV2, MappingV3, MappingAny } from './mapping-types'
import {
  isMappingAny,
  getMappedNewKey,
  mergeMappingMatches,
  mergeMappingMatchesRich,
  mergeMappingMeta,
} from './mapping-types'

const v1Mapping: MappingV1 = {
  schemaVersion: 1,
  createdAt: '2026-01-01',
  matches: { oldKey1: 'newKey1', oldKey2: 'newKey2' },
}

const v2Mapping: MappingV2 = {
  schemaVersion: 2,
  createdAt: '2026-01-01',
  matches: { oldKey1: 'newKey1' },
  matchMeta: {
    oldKey1: { oldFullName: 'Old Icon', newFullName: 'New Icon' },
  },
}

const v3Mapping: MappingV3 = {
  schemaVersion: 3,
  createdAt: '2026-01-01',
  matches: {
    oldKey1: { match: 'newKey1', oldFullName: 'Old', newFullName: 'New' },
    oldKey2: { match: '', description: 'Use custom component' },
  },
}

// ============================================================================
// Validation
// ============================================================================

describe('isMappingAny', () => {
  it('returns true for v1 mapping', () => {
    expect(isMappingAny(v1Mapping)).toBe(true)
  })

  it('returns true for v2 mapping', () => {
    expect(isMappingAny(v2Mapping)).toBe(true)
  })

  it('returns true for v3 mapping', () => {
    expect(isMappingAny(v3Mapping)).toBe(true)
  })

  it('returns false for null', () => {
    expect(isMappingAny(null)).toBe(false)
  })

  it('returns false for missing matches', () => {
    expect(isMappingAny({ schemaVersion: 1 })).toBe(false)
  })

  it('returns false for unsupported version', () => {
    expect(isMappingAny({ schemaVersion: 99, matches: {} })).toBe(false)
  })
})

// ============================================================================
// Lookup
// ============================================================================

describe('getMappedNewKey', () => {
  it('looks up v1 mapping', () => {
    expect(getMappedNewKey(v1Mapping, 'oldKey1')).toBe('newKey1')
  })

  it('returns empty string for missing key in v1', () => {
    expect(getMappedNewKey(v1Mapping, 'missing')).toBe('')
  })

  it('looks up v2 mapping', () => {
    expect(getMappedNewKey(v2Mapping, 'oldKey1')).toBe('newKey1')
  })

  it('looks up v3 mapping', () => {
    expect(getMappedNewKey(v3Mapping, 'oldKey1')).toBe('newKey1')
  })

  it('returns empty for text-only v3 entry', () => {
    expect(getMappedNewKey(v3Mapping, 'oldKey2')).toBe('')
  })
})

// ============================================================================
// Merge
// ============================================================================

describe('mergeMappingMatches', () => {
  it('merges v1 mappings', () => {
    const result = mergeMappingMatches([v1Mapping])
    expect(result).toEqual({ oldKey1: 'newKey1', oldKey2: 'newKey2' })
  })

  it('merges v3 mappings (skips text-only entries)', () => {
    const result = mergeMappingMatches([v3Mapping])
    expect(result).toEqual({ oldKey1: 'newKey1' })
  })

  it('later mappings override earlier for same key', () => {
    const override: MappingV1 = {
      schemaVersion: 1,
      createdAt: '2026-02-01',
      matches: { oldKey1: 'overriddenKey' },
    }
    const result = mergeMappingMatches([v1Mapping, override])
    expect(result.oldKey1).toBe('overriddenKey')
    expect(result.oldKey2).toBe('newKey2')
  })
})

describe('mergeMappingMatchesRich', () => {
  it('includes description for text-only v3 entries', () => {
    const result = mergeMappingMatchesRich([v3Mapping])
    expect(result.oldKey2).toEqual({
      newKey: '',
      oldFullName: undefined,
      newFullName: undefined,
      description: 'Use custom component',
    })
  })

  it('includes meta from v2 mappings', () => {
    const result = mergeMappingMatchesRich([v2Mapping])
    expect(result.oldKey1.oldFullName).toBe('Old Icon')
    expect(result.oldKey1.newFullName).toBe('New Icon')
  })

  it('preserves existing meta when merging', () => {
    const result = mergeMappingMatchesRich([v3Mapping, v2Mapping])
    expect(result.oldKey1.newKey).toBe('newKey1')
  })
})

describe('mergeMappingMeta', () => {
  it('extracts meta from v3', () => {
    const result = mergeMappingMeta([v3Mapping])
    expect(result.oldKey1).toEqual({ oldFullName: 'Old', newFullName: 'New' })
  })

  it('extracts meta from v2', () => {
    const result = mergeMappingMeta([v2Mapping])
    expect(result.oldKey1).toEqual({ oldFullName: 'Old Icon', newFullName: 'New Icon' })
  })

  it('v1 has no meta', () => {
    const result = mergeMappingMeta([v1Mapping])
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('later mappings extend existing meta', () => {
    const result = mergeMappingMeta([v2Mapping, v3Mapping])
    expect(result.oldKey1.oldFullName).toBe('Old')
    expect(result.oldKey1.newFullName).toBe('New')
  })
})
