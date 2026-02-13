#!/usr/bin/env node

/**
 * Merge an exported mapping JSON into a built-in default mapping file.
 *
 * Usage:
 *   node scripts/merge-mapping.cjs <exported.json> <icons|uikit>
 *
 * The exported file should be a v2 schema mapping with `matches` and optional
 * `matchMeta`. It will be merged into the corresponding default mapping:
 *   - icons  → src/app/tools/library-swap/default-icon-mapping.json
 *   - uikit  → src/app/tools/library-swap/default-uikit-mapping.json
 *
 * Existing keys are overridden by the exported file.
 * After merging, run `npm run build` to rebuild the plugin.
 */

const fs = require("fs")
const path = require("path")

const [, , exportedPath, target] = process.argv

if (!exportedPath || !target) {
  console.error("Usage: node scripts/merge-mapping.cjs <exported.json> <icons|uikit>")
  process.exit(1)
}

const defaultFiles = {
  icons: path.resolve(__dirname, "../src/app/tools/library-swap/default-icon-mapping.json"),
  uikit: path.resolve(__dirname, "../src/app/tools/library-swap/default-uikit-mapping.json"),
}

if (!defaultFiles[target]) {
  console.error(`Unknown target "${target}". Use "icons" or "uikit".`)
  process.exit(1)
}

const defaultFilePath = defaultFiles[target]

// Read files
const exported = JSON.parse(fs.readFileSync(path.resolve(exportedPath), "utf-8"))
const defaultMapping = JSON.parse(fs.readFileSync(defaultFilePath, "utf-8"))

// Validate exported file
if (!exported.matches || typeof exported.matches !== "object") {
  console.error("Exported file must have a 'matches' object.")
  process.exit(1)
}

// Merge matches
const mergedMatches = { ...(defaultMapping.matches || {}), ...exported.matches }

// Merge matchMeta if present
const mergedMeta = { ...(defaultMapping.matchMeta || {}) }
if (exported.matchMeta) {
  Object.assign(mergedMeta, exported.matchMeta)
}

// Count changes
const beforeCount = Object.keys(defaultMapping.matches || {}).length
const exportedCount = Object.keys(exported.matches).length
const afterCount = Object.keys(mergedMatches).length
const newEntries = afterCount - beforeCount
const overridden = exportedCount - newEntries

// Write back
const result = {
  ...defaultMapping,
  matches: mergedMatches,
  matchMeta: Object.keys(mergedMeta).length > 0 ? mergedMeta : undefined,
}

fs.writeFileSync(defaultFilePath, JSON.stringify(result, null, 2) + "\n", "utf-8")

console.log(`Merged into ${target} mapping:`)
console.log(`  Before: ${beforeCount} entries`)
console.log(`  Exported: ${exportedCount} entries`)
console.log(`  After: ${afterCount} entries (${newEntries} new, ${overridden} overridden)`)
console.log(`  Written to: ${defaultFilePath}`)
console.log(`\nRun "npm run build" to rebuild the plugin.`)
