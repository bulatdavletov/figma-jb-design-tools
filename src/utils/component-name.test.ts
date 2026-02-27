import { describe, it, expect } from 'vitest'
import { stripVariantInfo } from './component-name'

describe('stripVariantInfo', () => {
  it('strips variant info from component name', () => {
    expect(stripVariantInfo('_Checkbox :: Theme=Light, State=Active')).toBe('_Checkbox')
  })

  it('returns name unchanged when no variant separator', () => {
    expect(stripVariantInfo('Button')).toBe('Button')
  })

  it('handles double-colon at start', () => {
    expect(stripVariantInfo(' :: Theme=Light')).toBe('')
  })

  it('handles names with spaces', () => {
    expect(stripVariantInfo('My Component :: Variant=A')).toBe('My Component')
  })
})
