#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Generate a UI Kit component mapping (v2 schema) by matching components
// from the old Int UI Kit to the new Islands library by normalizedFullName.
//
// Usage:
//   node scripts/generate-uikit-mapping.cjs <oldExport> <newExport> <output>
//
// The old library uses "Theme=Light/Dark" variant properties that the new
// Islands library doesn't have (themes are handled via variables/modes).
// We strip "Theme=Light, " and "Theme=Dark, " from old variant names
// before matching.
// ---------------------------------------------------------------------------

const fs = require("fs")
const path = require("path")

const args = process.argv.slice(2)
if (args.length < 3) {
  console.log("Usage: node generate-uikit-mapping.cjs <oldExport.json> <newExport.json> <output.json>")
  process.exit(1)
}

const [oldPath, newPath, outPath] = args

const oldData = JSON.parse(fs.readFileSync(oldPath, "utf8"))
const newData = JSON.parse(fs.readFileSync(newPath, "utf8"))

// Build index of new components by normalizedFullName
const newByName = {}
for (const c of newData.icons) {
  newByName[c.normalizedFullName] = c
}

// Strip Theme= variant property from old variant names
function stripTheme(variantName) {
  return variantName.replace(/^Theme=(Light|Dark),\s*/, "")
}

const matches = {}
const matchMeta = {}
let stats = {
  componentPairs: 0,
  variantPairs: 0,
  kindMismatchPairs: 0,
  unmatchedComponents: 0,
  unmatchedVariants: 0,
}

for (const oc of oldData.icons) {
  const nc = newByName[oc.normalizedFullName]
  if (!nc) {
    stats.unmatchedComponents++
    continue
  }

  // Case 1: component → component (both have direct componentKey)
  if (oc.kind === "component" && nc.kind === "component" && oc.componentKey && nc.componentKey) {
    matches[oc.componentKey] = nc.componentKey
    matchMeta[oc.componentKey] = {
      oldFullName: oc.name,
      newFullName: nc.name,
    }
    stats.componentPairs++
    continue
  }

  // Case 2: componentSet → component (kind mismatch)
  // Map all old variant keys to the single new component key
  if (oc.kind === "componentSet" && nc.kind === "component" && nc.componentKey) {
    for (const ov of oc.variants) {
      if (!ov.componentKey) continue
      matches[ov.componentKey] = nc.componentKey
      matchMeta[ov.componentKey] = {
        oldFullName: `${oc.name} :: ${ov.name}`,
        newFullName: nc.name,
        description: "kind mismatch: componentSet → component",
      }
      stats.kindMismatchPairs++
    }
    continue
  }

  // Case 3: componentSet → componentSet – match variants by name (with Theme stripping)
  if (oc.variants.length > 0 && nc.variants.length > 0) {
    const newVarByName = {}
    for (const v of nc.variants) {
      newVarByName[v.name] = v
    }

    for (const ov of oc.variants) {
      if (!ov.componentKey) continue
      const stripped = stripTheme(ov.name)
      // Try exact match first, then Theme-stripped match
      const match = newVarByName[ov.name] || newVarByName[stripped]
      if (match && match.componentKey) {
        matches[ov.componentKey] = match.componentKey
        matchMeta[ov.componentKey] = {
          oldFullName: `${oc.name} :: ${ov.name}`,
          newFullName: `${nc.name} :: ${match.name}`,
        }
        stats.variantPairs++
      } else {
        stats.unmatchedVariants++
      }
    }
    continue
  }

  // Case 4: component → componentSet (can't map without knowing variant)
  stats.unmatchedComponents++
}

const mapping = {
  schemaVersion: 2,
  createdAt: new Date().toISOString(),
  meta: {
    note: `Auto-generated mapping: ${oldData.fileName} → ${newData.fileName}`,
  },
  matches,
  matchMeta,
}

fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2), "utf8")

console.log("=== UI Kit Component Mapping Generated ===")
console.log(`Old: ${oldData.fileName} (${oldData.icons.length} components)`)
console.log(`New: ${newData.fileName} (${newData.icons.length} components)`)
console.log(`Output: ${outPath}`)
console.log(``)
console.log(`Matched:`)
console.log(`  Component → Component:     ${stats.componentPairs}`)
console.log(`  Variant → Variant:         ${stats.variantPairs}`)
console.log(`  Kind mismatch (set→comp):  ${stats.kindMismatchPairs}`)
console.log(`  Total mapping pairs:       ${Object.keys(matches).length}`)
console.log(``)
console.log(`Unmatched:`)
console.log(`  Components (no name match): ${stats.unmatchedComponents}`)
console.log(`  Variants (no variant match): ${stats.unmatchedVariants}`)
