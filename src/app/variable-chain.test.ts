import { describe, it, expect } from 'vitest'
import { toByteHex, clamp01, colorToRgbHex, colorToOpacityPercent, isColorValue } from './variable-chain'

describe('toByteHex', () => {
  it('converts 0 to "00"', () => {
    expect(toByteHex(0)).toBe('00')
  })

  it('converts 1 to "FF"', () => {
    expect(toByteHex(1)).toBe('FF')
  })

  it('converts 0.5 to "80"', () => {
    expect(toByteHex(0.5)).toBe('80')
  })

  it('clamps negative values to "00"', () => {
    expect(toByteHex(-0.5)).toBe('00')
  })

  it('clamps values > 1 to "FF"', () => {
    expect(toByteHex(2)).toBe('FF')
  })

  it('pads single-digit hex values', () => {
    expect(toByteHex(1 / 255)).toBe('01')
  })
})

describe('clamp01', () => {
  it('returns value when in range', () => {
    expect(clamp01(0.5)).toBe(0.5)
  })

  it('clamps to 0', () => {
    expect(clamp01(-1)).toBe(0)
  })

  it('clamps to 1', () => {
    expect(clamp01(5)).toBe(1)
  })

  it('returns exact boundaries', () => {
    expect(clamp01(0)).toBe(0)
    expect(clamp01(1)).toBe(1)
  })
})

describe('colorToRgbHex', () => {
  it('converts black RGB', () => {
    expect(colorToRgbHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
  })

  it('converts white RGB', () => {
    expect(colorToRgbHex({ r: 1, g: 1, b: 1 })).toBe('#FFFFFF')
  })

  it('converts a branded blue', () => {
    expect(colorToRgbHex({ r: 0, g: 0.525, b: 1 })).toBe('#0086FF')
  })

  it('ignores the alpha channel in RGBA', () => {
    expect(colorToRgbHex({ r: 1, g: 0, b: 0, a: 0.5 })).toBe('#FF0000')
  })
})

describe('colorToOpacityPercent', () => {
  it('returns 100 for RGB without alpha', () => {
    expect(colorToOpacityPercent({ r: 0, g: 0, b: 0 })).toBe(100)
  })

  it('returns 100 for alpha=1', () => {
    expect(colorToOpacityPercent({ r: 0, g: 0, b: 0, a: 1 })).toBe(100)
  })

  it('returns 50 for alpha=0.5', () => {
    expect(colorToOpacityPercent({ r: 0, g: 0, b: 0, a: 0.5 })).toBe(50)
  })

  it('returns 0 for alpha=0', () => {
    expect(colorToOpacityPercent({ r: 0, g: 0, b: 0, a: 0 })).toBe(0)
  })

  it('clamps alpha > 1 to 100', () => {
    expect(colorToOpacityPercent({ r: 0, g: 0, b: 0, a: 2 })).toBe(100)
  })

  it('clamps negative alpha to 0', () => {
    expect(colorToOpacityPercent({ r: 0, g: 0, b: 0, a: -0.5 })).toBe(0)
  })
})

describe('isColorValue', () => {
  it('returns true for RGB', () => {
    expect(isColorValue({ r: 0, g: 0, b: 0 })).toBe(true)
  })

  it('returns true for RGBA', () => {
    expect(isColorValue({ r: 0, g: 0, b: 0, a: 1 })).toBe(true)
  })

  it('returns false for null', () => {
    expect(isColorValue(null)).toBe(false)
  })

  it('returns false for string', () => {
    expect(isColorValue('#FF0000')).toBe(false)
  })

  it('returns false for missing channels', () => {
    expect(isColorValue({ r: 0, g: 0 })).toBe(false)
  })

  it('returns false for non-numeric channels', () => {
    expect(isColorValue({ r: '0', g: '0', b: '0' })).toBe(false)
  })

  it('returns false for variable alias objects', () => {
    expect(isColorValue({ type: 'VARIABLE_ALIAS', id: 'VariableID:1' })).toBe(false)
  })
})
