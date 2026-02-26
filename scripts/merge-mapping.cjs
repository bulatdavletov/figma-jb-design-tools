#!/usr/bin/env node

/**
 * Merge exported mapping JSONs from the mapping inbox into built-in default mappings.
 *
 * Usage:
 *   node scripts/merge-mapping.cjs
 *
 * Reads the fixed inbox folder, finds all JSON files whose names indicate target:
 *   - uikit-mapping-*.json  → merge into default-uikit-mapping.json
 *   - icons-mapping-*.json  → merge into default-icon-mapping.json
 * Other JSON files in the folder are skipped.
 *
 * Each exported file must be v2 schema with `matches` and optional `matchMeta`.
 * After a successful merge, the exported file is deleted.
 * Then run `npm run build` to rebuild the plugin.
 */

const fs = require("fs")
const path = require("path")

const MAPPING_INBOX = "/Users/Bulat.Davletov/Cursor Projects/Figma JSONs/mapping inbox"

const defaultFiles = {
  icons: path.resolve(__dirname, "../src/app/tools/library-swap/default-icon-mapping.json"),
  uikit: path.resolve(__dirname, "../src/app/tools/library-swap/default-uikit-mapping.json"),
}

function getTargetFromFilename(name) {
  if (name.startsWith("uikit-mapping-") && name.endsWith(".json")) return "uikit"
  if (name.startsWith("icons-mapping-") && name.endsWith(".json")) return "icons"
  return null
}

function mergeOne(exportedFilePath, target) {
  const defaultFilePath = defaultFiles[target]
  const exported = JSON.parse(fs.readFileSync(exportedFilePath, "utf-8"))
  const defaultMapping = JSON.parse(fs.readFileSync(defaultFilePath, "utf-8"))

  if (!exported.matches || typeof exported.matches !== "object") {
    console.error(`  Skipped (no "matches" object): ${path.basename(exportedFilePath)}`)
    return false
  }

  const mergedMatches = { ...(defaultMapping.matches || {}), ...exported.matches }
  const mergedMeta = { ...(defaultMapping.matchMeta || {}) }
  if (exported.matchMeta) {
    Object.assign(mergedMeta, exported.matchMeta)
  }

  const beforeCount = Object.keys(defaultMapping.matches || {}).length
  const exportedCount = Object.keys(exported.matches).length
  const afterCount = Object.keys(mergedMatches).length
  const newEntries = afterCount - beforeCount
  const overridden = exportedCount - newEntries

  const result = {
    ...defaultMapping,
    matches: mergedMatches,
    matchMeta: Object.keys(mergedMeta).length > 0 ? mergedMeta : undefined,
  }

  fs.writeFileSync(defaultFilePath, JSON.stringify(result, null, 2) + "\n", "utf-8")
  fs.unlinkSync(exportedFilePath)

  console.log(`  Merged ${path.basename(exportedFilePath)} → ${target}:`)
  console.log(`    Before: ${beforeCount} → After: ${afterCount} (${newEntries} new, ${overridden} overridden)`)
  console.log(`    Deleted: ${exportedFilePath}`)
  return true
}

// --- main ---
const inboxPath = path.resolve(MAPPING_INBOX)
if (!fs.existsSync(inboxPath)) {
  console.error(`Inbox folder does not exist: ${inboxPath}`)
  process.exit(1)
}

const entries = fs.readdirSync(inboxPath, { withFileTypes: true })
const jsonFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith(".json"))
  .map((e) => ({ name: e.name, path: path.join(inboxPath, e.name) }))

const toProcess = []
for (const f of jsonFiles) {
  const target = getTargetFromFilename(f.name)
  if (target) toProcess.push({ ...f, target })
  else console.log(`  Skipped (unknown prefix): ${f.name}`)
}

if (toProcess.length === 0) {
  console.log("No uikit-mapping-*.json or icons-mapping-*.json files in inbox. Nothing to do.")
  process.exit(0)
}

console.log(`Inbox: ${inboxPath}`)
console.log(`Processing ${toProcess.length} file(s):\n`)

let merged = 0
for (const { path: filePath, target } of toProcess) {
  try {
    if (mergeOne(filePath, target)) merged++
  } catch (err) {
    console.error(`  Error processing ${path.basename(filePath)}:`, err.message)
  }
}

console.log(`\nDone. Merged ${merged} file(s).`)
if (merged > 0) {
  console.log('Run "npm run build" to rebuild the plugin.')
}
