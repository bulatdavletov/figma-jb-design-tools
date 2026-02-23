const test = require('node:test')
const assert = require('node:assert/strict')

const {
  maybeStripFolderPrefix,
  getBoundColorVariableIdFromPaint,
  stripTrailingModeSuffix,
  extractModeNameFromLayerName,
  extractVariableIdFromLayerName,
  rgbToHex,
} = require('../.tmp-tests/src/shared.js')

const { makeSolidPaint } = require('./fixtures/figma-fakes.cjs')

test('maybeStripFolderPrefix removes folder path only when enabled', () => {
  assert.equal(maybeStripFolderPrefix('Color/Primary/Default', true), 'Default')
  assert.equal(maybeStripFolderPrefix('Color/Primary/Default', false), 'Color/Primary/Default')
})

test('getBoundColorVariableIdFromPaint returns variable id from SOLID paint', () => {
  const paint = makeSolidPaint({ variableId: 'VariableID:123' })
  assert.equal(getBoundColorVariableIdFromPaint(paint), 'VariableID:123')
})

test('rgbToHex converts normalized rgb values to uppercase hex', () => {
  assert.equal(rgbToHex({ r: 1, g: 0.5, b: 0 }), '#FF8000')
})

test('stripTrailingModeSuffix removes mode suffix from labels', () => {
  assert.equal(stripTrailingModeSuffix('Color/Primary (Dark)'), 'Color/Primary')
})

test('extractModeNameFromLayerName returns mode name from suffix', () => {
  assert.equal(extractModeNameFromLayerName('VariableID:1 (Dark)'), 'Dark')
  assert.equal(extractModeNameFromLayerName('VariableID:1'), null)
})

test('extractVariableIdFromLayerName parses VariableID token', () => {
  assert.equal(extractVariableIdFromLayerName('VariableID:abc123 (Dark)'), 'VariableID:abc123')
  assert.equal(extractVariableIdFromLayerName('Color/Primary (Dark)'), null)
})
