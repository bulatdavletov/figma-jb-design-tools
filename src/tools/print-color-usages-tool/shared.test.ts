import { describe, it, expect } from 'vitest'
import { makeSolidPaint } from '../../test-fixtures/figma-fakes'
import {
  maybeStripFolderPrefix,
  getBoundColorVariableIdFromPaint,
  stripTrailingModeSuffix,
  extractModeNameFromLayerName,
  extractVariableIdFromLayerName,
  isTextNode,
  rgbToHex,
} from './shared'

describe('maybeStripFolderPrefix', () => {
  it('returns full name when showFolderNames is false', () => {
    expect(maybeStripFolderPrefix('Color/Primary/Default', false)).toBe('Color/Primary/Default')
  })

  it('strips folder prefix when enabled', () => {
    expect(maybeStripFolderPrefix('Color/Primary/Default', true)).toBe('Default')
  })

  it('returns name as-is when no slash', () => {
    expect(maybeStripFolderPrefix('Default', true)).toBe('Default')
  })

  it('handles trailing slash gracefully', () => {
    expect(maybeStripFolderPrefix('Color/', true)).toBe('Color/')
  })
})

describe('getBoundColorVariableIdFromPaint', () => {
  it('returns variable id from SOLID paint with binding', () => {
    const paint = makeSolidPaint({ variableId: 'VariableID:123' })
    expect(getBoundColorVariableIdFromPaint(paint)).toBe('VariableID:123')
  })

  it('returns null for SOLID paint without binding', () => {
    const paint = makeSolidPaint()
    expect(getBoundColorVariableIdFromPaint(paint)).toBeNull()
  })

  it('returns null for non-SOLID paint', () => {
    const paint = { type: 'GRADIENT_LINEAR' } as any
    expect(getBoundColorVariableIdFromPaint(paint)).toBeNull()
  })
})

describe('stripTrailingModeSuffix', () => {
  it('removes parenthesized suffix', () => {
    expect(stripTrailingModeSuffix('Color/Primary (Dark)')).toBe('Color/Primary')
  })

  it('returns unchanged when no suffix', () => {
    expect(stripTrailingModeSuffix('Color/Primary')).toBe('Color/Primary')
  })

  it('handles variable ID with mode suffix', () => {
    expect(stripTrailingModeSuffix('VariableID:abc (Light)')).toBe('VariableID:abc')
  })
})

describe('extractModeNameFromLayerName', () => {
  it('extracts mode name from suffix', () => {
    expect(extractModeNameFromLayerName('VariableID:1 (Dark)')).toBe('Dark')
  })

  it('returns null when no suffix', () => {
    expect(extractModeNameFromLayerName('VariableID:1')).toBeNull()
  })

  it('handles whitespace in mode name', () => {
    expect(extractModeNameFromLayerName('Color (Dark Theme)')).toBe('Dark Theme')
  })
})

describe('extractVariableIdFromLayerName', () => {
  it('extracts VariableID from layer name', () => {
    expect(extractVariableIdFromLayerName('VariableID:abc123 (Dark)')).toBe('VariableID:abc123')
  })

  it('returns null for non-variable layer names', () => {
    expect(extractVariableIdFromLayerName('Color/Primary (Dark)')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractVariableIdFromLayerName('')).toBeNull()
  })

  it('extracts from a simple VariableID without suffix', () => {
    expect(extractVariableIdFromLayerName('VariableID:abc123')).toBe('VariableID:abc123')
  })
})

describe('isTextNode', () => {
  it('returns true for TEXT type', () => {
    expect(isTextNode({ type: 'TEXT' } as any)).toBe(true)
  })

  it('returns false for other types', () => {
    expect(isTextNode({ type: 'RECTANGLE' } as any)).toBe(false)
  })
})

describe('rgbToHex', () => {
  it('converts black', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
  })

  it('converts white', () => {
    expect(rgbToHex({ r: 1, g: 1, b: 1 })).toBe('#FFFFFF')
  })

  it('converts normalized values', () => {
    expect(rgbToHex({ r: 1, g: 0.5, b: 0 })).toBe('#FF8000')
  })

  it('converts a mid-range color', () => {
    expect(rgbToHex({ r: 0.2, g: 0.4, b: 0.6 })).toBe('#336699')
  })
})
