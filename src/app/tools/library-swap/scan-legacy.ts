// ---------------------------------------------------------------------------
// Scan Legacy – find old library paint styles and categorize old components
// ---------------------------------------------------------------------------

import type { LibrarySwapScope } from "../../messages"
import type { MergedMatchEntry } from "./mapping-types"
import { getInstancesForScope } from "./swap-logic"
import { getComponentDisplayName } from "../../utils/component-name"

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export type LegacyStyleItem = {
  nodeId: string
  nodeName: string
  pageName: string
  styleName: string
  styleKey: string
  property: "fill" | "stroke"
  isOverride: boolean
  colorHex: string | null
}

export type LegacyComponentCategory = "mapped" | "text_only" | "unmapped"

export type LegacyComponentItem = {
  nodeId: string
  nodeName: string
  pageName: string
  oldComponentKey: string
  oldComponentName: string
  category: LegacyComponentCategory
  newComponentName?: string
  description?: string
}

export type ScanLegacyResult = {
  styles: LegacyStyleItem[]
  components: LegacyComponentItem[]
  totalNodesScanned: number
}

// ---------------------------------------------------------------------------
// Known old component names (no match in new library)
// Source: unmatched-components.md
// ---------------------------------------------------------------------------

const UNMATCHED_OLD_COMPONENT_NAMES = new Set([
  "_Close",
  "_Icon",
  "_Icons",
  "_Indeterminate",
  "_Inline / State",
  "_Inline action / button",
  "_Inline action / right side",
  "_Split Button Dropdown",
  "_Tab / Background",
  "_Table / Header",
  "_Tree / Selection",
  "Collapsible",
  "Dialog / Group",
  "Editor / Tab",
  "Editor / Tab / Close",
  "Editor / Tabs",
  "Editor Code",
  "Inline Search",
  "Main Toolbar / MacOS Buttons",
  "Main Toolbar / Project Dropdown",
  "Main Toolbar / Split Button",
  "Main Toolbar / Win Button",
  "Main Toolbar / Windows Buttons",
  "Popup / Cell / Selection",
  "Popup / Context Menu",
  "Project Icon",
  "Run Widget",
  "Run Widget / Configurations",
  "Run Widget / Debug Button",
  "Run Widget / Run Button",
  "Run Widget / Simple Button",
  "Run Widget / Stop Button",
  "Shortcut",
  "Status Bar / Breadcrumb",
  "Stripes / Button",
  "Stripes / Separator",
  "Stripes / Stripe",
  "Tabs",
  "Toolbar / Icon",
])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SCAN_ITEMS_CAP = 300

function extractHexFromStyle(style: PaintStyle): string | null {
  const paints = style.paints
  if (!paints || paints.length === 0) return null
  const paint = paints[0]
  if (paint.type !== "SOLID") return null
  const { r, g, b } = paint.color
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function getPageName(node: BaseNode): string {
  let current: BaseNode | null = node
  while (current) {
    if (current.type === "PAGE") return current.name
    current = current.parent
  }
  return ""
}

// Cache of overrides per InstanceNode to avoid re-reading for every child
const overridesCache = new Map<string, Map<string, Set<string>>>()

/**
 * Check whether a specific property on a node is actually overridden
 * by reading `InstanceNode.overrides` from the nearest instance ancestor.
 */
function isPropertyOverridden(
  node: SceneNode,
  property: "fill" | "stroke"
): boolean {
  const instance = getNearestInstanceAncestor(node)
  if (!instance) return false

  let nodeOverrides = overridesCache.get(instance.id)
  if (!nodeOverrides) {
    nodeOverrides = new Map()
    try {
      for (const entry of instance.overrides) {
        nodeOverrides.set(entry.id, new Set(entry.overriddenFields as string[]))
      }
    } catch {
      // overrides may not be available in all contexts
    }
    overridesCache.set(instance.id, nodeOverrides)
  }

  const fields = nodeOverrides.get(node.id)
  if (!fields) return false

  if (property === "fill") {
    return fields.has("fillStyleId") || fields.has("fills")
  }
  return fields.has("strokeStyleId") || fields.has("strokes")
}

function getNearestInstanceAncestor(node: SceneNode): InstanceNode | null {
  let current: BaseNode | null = node.parent
  while (current) {
    if (current.type === "INSTANCE") return current as InstanceNode
    if (current.type === "PAGE" || current.type === "DOCUMENT") return null
    current = current.parent
  }
  return null
}

// ---------------------------------------------------------------------------
// Find the corresponding child in the main component.
// Instance child IDs follow the pattern "I<instanceId>;<originalChildId>"
// for nested instances: "I<outer>;I<inner>;<childId>"
// The last segment after ";" is the original ID in the main component.
// ---------------------------------------------------------------------------

function extractMainComponentChildId(instanceChildId: string): string | null {
  const idx = instanceChildId.lastIndexOf(";")
  if (idx < 0) return null
  return instanceChildId.substring(idx + 1)
}

async function findMainComponentChild(
  instance: InstanceNode,
  childId: string
): Promise<SceneNode | null> {
  let main: ComponentNode | null = null
  try {
    main = await instance.getMainComponentAsync()
  } catch {
    return null
  }
  if (!main || !("findOne" in main)) return null
  const relId = extractMainComponentChildId(childId)
  if (!relId) return null
  try {
    return main.findOne((n) => n.id === relId)
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Collect all nodes (not just instances) for style scanning
// ---------------------------------------------------------------------------

async function ensureAllPagesLoaded(): Promise<void> {
  if (typeof figma.loadAllPagesAsync === "function") {
    await figma.loadAllPagesAsync()
  }
}

function collectNodesInSelection(includeHidden: boolean): SceneNode[] {
  const sel = figma.currentPage.selection
  const out: SceneNode[] = []

  for (const node of sel) {
    if (!node) continue
    out.push(node)
    if ("findAll" in node && typeof node.findAll === "function") {
      const descendants = node.findAll() as SceneNode[]
      for (const d of descendants) out.push(d)
    }
  }
  return includeHidden ? out : out.filter((node) => isVisibleInCanvas(node))
}


function isVisibleInCanvas(node: BaseNode): boolean {
  let current: BaseNode | null = node
  while (current) {
    if ("visible" in current && current.visible === false) return false
    current = current.parent
  }
  return true
}

async function getNodesForScope(scope: LibrarySwapScope, includeHidden: boolean): Promise<SceneNode[]> {
  if (scope === "all_pages") {
    await ensureAllPagesLoaded()
    const nodes = figma.root.findAll() as SceneNode[]
    return includeHidden ? nodes : nodes.filter((node) => isVisibleInCanvas(node))
  }
  if (scope === "selection") {
    return collectNodesInSelection(includeHidden)
  }
  const nodes = figma.currentPage.findAll() as SceneNode[]
  return includeHidden ? nodes : nodes.filter((node) => isVisibleInCanvas(node))
}

// ---------------------------------------------------------------------------
// Style scanning
// ---------------------------------------------------------------------------

async function scanStyles(
  scope: LibrarySwapScope,
  includeHidden: boolean,
  onProgress?: (done: number, total: number) => void
): Promise<{ items: LegacyStyleItem[]; nodesScanned: number }> {
  overridesCache.clear()
  const allNodes = await getNodesForScope(scope, includeHidden)
  const items: LegacyStyleItem[] = []
  const styleCache = new Map<string, PaintStyle | null>()

  for (let i = 0; i < allNodes.length; i++) {
    const node = allNodes[i] as any

    for (const prop of ["fillStyleId", "strokeStyleId"] as const) {
      const styleId: unknown = node[prop]
      if (typeof styleId !== "string" || !styleId) continue

      let style = styleCache.get(styleId)
      if (style === undefined) {
        try {
          style = (await figma.getStyleByIdAsync(styleId)) as PaintStyle | null
        } catch {
          style = null
        }
        styleCache.set(styleId, style ?? null)
      }
      if (!style) continue
      if (!style.remote) continue

      if (items.length < SCAN_ITEMS_CAP) {
        items.push({
          nodeId: node.id,
          nodeName: node.name ?? "(unnamed)",
          pageName: getPageName(node as BaseNode),
          styleName: style.name,
          styleKey: style.key,
          property: prop === "fillStyleId" ? "fill" : "stroke",
          isOverride: isPropertyOverridden(node as SceneNode, prop === "fillStyleId" ? "fill" : "stroke"),
          colorHex: extractHexFromStyle(style),
        })
      }
    }

    if (onProgress && i % 200 === 0) {
      onProgress(i, allNodes.length)
      await new Promise((r) => setTimeout(r, 0))
    }
  }

  return { items, nodesScanned: allNodes.length }
}

// ---------------------------------------------------------------------------
// Component scanning
// ---------------------------------------------------------------------------

async function scanComponents(
  scope: LibrarySwapScope,
  includeHidden: boolean,
  richMatches: Record<string, MergedMatchEntry>,
  onProgress?: (done: number, total: number) => void
): Promise<LegacyComponentItem[]> {
  const instances = await getInstancesForScope(scope, includeHidden)
  const items: LegacyComponentItem[] = []
  const allMappedKeys = new Set(Object.keys(richMatches))

  for (let i = 0; i < instances.length; i++) {
    const inst = instances[i]
    let main: ComponentNode | null = null
    try {
      main = await inst.getMainComponentAsync()
    } catch {
      main = null
    }
    const oldKey = main?.key ?? null
    if (!oldKey) continue

    if (allMappedKeys.has(oldKey)) {
      const entry = richMatches[oldKey]
      if (!entry) continue
      if (items.length >= SCAN_ITEMS_CAP) break

      const oldName = main
        ? getComponentDisplayName(main)
        : entry.oldFullName ?? oldKey

      if (entry.newKey) {
        items.push({
          nodeId: inst.id,
          nodeName: inst.name,
          pageName: getPageName(inst),
          oldComponentKey: oldKey,
          oldComponentName: oldName,
          category: "mapped",
          newComponentName: entry.newFullName ?? entry.newKey,
        })
      } else if (entry.description) {
        items.push({
          nodeId: inst.id,
          nodeName: inst.name,
          pageName: getPageName(inst),
          oldComponentKey: oldKey,
          oldComponentName: oldName,
          category: "text_only",
          description: entry.description,
        })
      }
    } else if (main && main.remote) {
      // Check if this is a known unmatched old component by name
      const displayName = getComponentDisplayName(main)
      if (UNMATCHED_OLD_COMPONENT_NAMES.has(displayName)) {
        if (items.length >= SCAN_ITEMS_CAP) break
        items.push({
          nodeId: inst.id,
          nodeName: inst.name,
          pageName: getPageName(inst),
          oldComponentKey: oldKey,
          oldComponentName: displayName,
          category: "unmapped",
        })
      }
    }

    if (onProgress && i % 100 === 0) {
      onProgress(i, instances.length)
      await new Promise((r) => setTimeout(r, 0))
    }
  }

  return items
}

// ---------------------------------------------------------------------------
// Main scan entry point
// ---------------------------------------------------------------------------

export async function scanForLegacyItems(
  scope: LibrarySwapScope,
  includeHidden: boolean,
  richMatches: Record<string, MergedMatchEntry>,
  onProgress?: (message: string, done: number, total: number) => void
): Promise<ScanLegacyResult> {
  onProgress?.("Scanning styles...", 0, 0)
  const { items: styles, nodesScanned } = await scanStyles(scope, includeHidden, (done, total) => {
    onProgress?.(`Scanning styles... ${done} / ${total}`, done, total)
  })

  onProgress?.("Scanning components...", 0, 0)
  const components = await scanComponents(scope, includeHidden, richMatches, (done, total) => {
    onProgress?.(`Scanning components... ${done} / ${total}`, done, total)
  })

  return { styles, components, totalNodesScanned: nodesScanned }
}

// ---------------------------------------------------------------------------
// Reset a style override — restore the main component's default fill/stroke.
// Finds the corresponding child in the main component and copies its style.
// ---------------------------------------------------------------------------

export async function resetStyleOverride(
  nodeId: string,
  _property: "fill" | "stroke"
): Promise<boolean> {
  const node = await figma.getNodeByIdAsync(nodeId)
  if (!node) return false

  const instance = getNearestInstanceAncestor(node as SceneNode)
  if (!instance) return false

  instance.removeOverrides()
  return true
}
