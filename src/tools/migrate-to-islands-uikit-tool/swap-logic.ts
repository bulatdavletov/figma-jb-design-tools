// ---------------------------------------------------------------------------
// Library Swap – pure swap functions (main thread only)
// ---------------------------------------------------------------------------

import type { LibrarySwapScope } from "../../home/messages"
import type { MergedMeta } from "./mapping-types"
import { getComponentDisplayName, stripVariantInfo } from "../../utils/component-name"

// ---------------------------------------------------------------------------
// Scope helpers
// ---------------------------------------------------------------------------

async function ensureAllPagesLoaded(): Promise<void> {
  if (typeof figma.loadAllPagesAsync === "function") {
    await figma.loadAllPagesAsync()
  }
}

function isVisibleInCanvas(node: BaseNode): boolean {
  let current: BaseNode | null = node
  while (current) {
    if ("visible" in current && current.visible === false) return false
    current = current.parent
  }
  return true
}

function collectInstancesInSelection(): InstanceNode[] {
  const sel = figma.currentPage.selection
  const seen = new Set<string>()
  const out: InstanceNode[] = []

  const add = (inst: InstanceNode) => {
    if (seen.has(inst.id)) return
    seen.add(inst.id)
    out.push(inst)
  }

  for (const node of sel) {
    if (!node) continue
    if (node.type === "INSTANCE") add(node as InstanceNode)
    if ("findAllWithCriteria" in node && typeof node.findAllWithCriteria === "function") {
      const insts = node.findAllWithCriteria({ types: ["INSTANCE"] }) as InstanceNode[]
      for (const inst of insts) add(inst)
    }
  }

  return out
}

export async function getInstancesForScope(
  scope: LibrarySwapScope,
  includeHidden: boolean
): Promise<InstanceNode[]> {
  const filterByVisibility = (instances: InstanceNode[]) => {
    if (includeHidden) return instances
    return instances.filter((instance) => isVisibleInCanvas(instance))
  }

  if (scope === "all_pages") {
    await ensureAllPagesLoaded()
    return filterByVisibility(figma.root.findAllWithCriteria({ types: ["INSTANCE"] }) as InstanceNode[])
  }
  if (scope === "selection") {
    return filterByVisibility(collectInstancesInSelection())
  }
  // "page"
  return filterByVisibility(figma.currentPage.findAllWithCriteria({ types: ["INSTANCE"] }) as InstanceNode[])
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// getComponentDisplayName and stripVariantInfo are in ../../utils/component-name.ts

function getPageName(node: SceneNode): string {
  let current: BaseNode | null = node
  while (current) {
    if (current.type === "PAGE") return current.name
    current = current.parent
  }
  return ""
}

// ---------------------------------------------------------------------------
// Analyze
// ---------------------------------------------------------------------------

export type AnalyzeItem = {
  nodeId: string
  instanceName: string
  pageName: string
  oldComponentName: string
  newComponentName: string
}

export type AnalyzeResult = {
  totalInstances: number
  mappableInstances: number
  uniqueOldKeys: number
  items: AnalyzeItem[]
}

const ANALYZE_ITEMS_CAP = 200

export async function analyzeSwap(
  mergedMatches: Record<string, string>,
  scope: LibrarySwapScope,
  includeHidden: boolean,
  meta: Record<string, MergedMeta>,
  onProgress?: (done: number, total: number) => void
): Promise<AnalyzeResult> {
  const instances = await getInstancesForScope(scope, includeHidden)
  const total = instances.length
  let mappable = 0
  const uniqueKeys = new Set<string>()
  const items: AnalyzeItem[] = []

  for (let i = 0; i < instances.length; i++) {
    const inst = instances[i]
    let main: ComponentNode | null = null
    try {
      main = await inst.getMainComponentAsync()
    } catch {
      main = null
    }
    const oldKey = main?.key ?? null
    if (oldKey && mergedMatches[oldKey]) {
      mappable++
      uniqueKeys.add(oldKey)

      if (items.length < ANALYZE_ITEMS_CAP) {
        const m = meta[oldKey]
        items.push({
          nodeId: inst.id,
          instanceName: inst.name,
          pageName: getPageName(inst),
          oldComponentName: main ? getComponentDisplayName(main) : (m?.oldFullName ? stripVariantInfo(m.oldFullName) : oldKey),
          newComponentName: m?.newFullName ? stripVariantInfo(m.newFullName) : mergedMatches[oldKey],
        })
      }
    }

    if (onProgress && i % 100 === 0) {
      onProgress(i, total)
      await new Promise((r) => setTimeout(r, 0))
    }
  }

  return {
    totalInstances: total,
    mappableInstances: mappable,
    uniqueOldKeys: uniqueKeys.size,
    items,
  }
}

// ---------------------------------------------------------------------------
// Apply swap
// ---------------------------------------------------------------------------

export type SwappedItem = {
  nodeId: string
  name: string
  oldComponentName: string
  newComponentName: string
}

export type SwapResult = {
  swapped: number
  skipped: number
  swappedItems: SwappedItem[]
}

export async function swapInstances(
  mergedMatches: Record<string, string>,
  scope: LibrarySwapScope,
  includeHidden: boolean,
  onProgress?: (done: number, total: number) => void
): Promise<SwapResult> {
  const cache = new Map<string, ComponentNode>()
  const alreadySwapped = new Set<string>()

  let swapped = 0
  let skipped = 0
  const swappedItems: SwappedItem[] = []

  const MAX_PASSES = 5
  let pass = 0

  while (pass < MAX_PASSES) {
    pass++
    const instances = await getInstancesForScope(scope, includeHidden)
    let swappedThisPass = 0

    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i]
      if (alreadySwapped.has(inst.id)) continue

      let main: ComponentNode | null = null
      try {
        main = await inst.getMainComponentAsync()
      } catch {
        main = null
      }
      const oldKey = main?.key ?? null
      if (!oldKey || !mergedMatches[oldKey]) {
        if (pass === 1) skipped++
        if (onProgress && i % 50 === 0) {
          onProgress(swapped, instances.length)
          await new Promise((r) => setTimeout(r, 0))
        }
        continue
      }

      const newKey = mergedMatches[oldKey]
      try {
        let newComp = cache.get(newKey)
        if (!newComp) {
          newComp = await figma.importComponentByKeyAsync(newKey)
          cache.set(newKey, newComp)
        }
        const oldDisplayName = main ? getComponentDisplayName(main) : inst.name
        inst.swapComponent(newComp)
        alreadySwapped.add(inst.id)
        swapped++
        swappedThisPass++
        if (swappedItems.length < 200) {
          swappedItems.push({
            nodeId: inst.id,
            name: inst.name,
            oldComponentName: oldDisplayName,
            newComponentName: getComponentDisplayName(newComp),
          })
        }
      } catch {
        skipped++
      }

      if (onProgress && i % 50 === 0) {
        onProgress(swapped, instances.length)
        await new Promise((r) => setTimeout(r, 0))
      }
    }

    if (swappedThisPass === 0) break
  }

  return { swapped, skipped, swappedItems }
}

// ---------------------------------------------------------------------------
// Preview swap (on-canvas before/after frame)
// ---------------------------------------------------------------------------

const PREVIEW_FRAME_NAME = "Library Swap Preview"

const PREVIEW_BG: SolidPaint = { type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.96 } }
const SEPARATOR_COLOR: SolidPaint = { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } }
const HEADER_FONT: FontName = { family: "Inter", style: "Bold" }
const LABEL_FONT: FontName = { family: "Inter", style: "Regular" }
const ARROW_FONT: FontName = { family: "Inter", style: "Regular" }

async function loadPreviewFonts() {
  try {
    await Promise.all([
      figma.loadFontAsync(HEADER_FONT),
      figma.loadFontAsync(LABEL_FONT),
      figma.loadFontAsync(ARROW_FONT),
    ])
  } catch {
    // Inter may not be available; try loading any available font
    const fallback: FontName = { family: "Roboto", style: "Regular" }
    const fallbackBold: FontName = { family: "Roboto", style: "Bold" }
    try {
      await Promise.all([
        figma.loadFontAsync(fallbackBold),
        figma.loadFontAsync(fallback),
      ])
      // Update font references to the fallback
      ;(HEADER_FONT as any).family = "Roboto"
      ;(LABEL_FONT as any).family = "Roboto"
      ;(ARROW_FONT as any).family = "Roboto"
    } catch {
      // If Roboto also fails, throw a clear error
      throw new Error("Could not load fonts for preview (Inter or Roboto required)")
    }
  }
}

function createTextNode(
  text: string,
  font: FontName,
  size: number,
  color: RGB = { r: 0, g: 0, b: 0 }
): TextNode {
  const t = figma.createText()
  t.fontName = font
  t.characters = text
  t.fontSize = size
  t.fills = [{ type: "SOLID", color }]
  t.layoutAlign = "CENTER"
  return t
}

function createSeparator(): RectangleNode {
  const sep = figma.createRectangle()
  sep.name = "Separator"
  sep.fills = [SEPARATOR_COLOR]
  sep.resize(800, 1)
  sep.layoutAlign = "STRETCH"
  sep.layoutGrow = 0
  return sep
}

export async function previewSwap(
  mergedMatches: Record<string, string>,
  scope: LibrarySwapScope,
  includeHidden: boolean,
  sampleSize: number = 12
): Promise<{ previewed: number }> {
  // Gather mappable instances, deduped by old component key.
  // Stop scanning once we have enough unique keys (cap total scanned to avoid timeout).
  const instances = await getInstancesForScope(scope, includeHidden)
  // Deduplicate by newKey so Light/Dark variants mapping to the same new component show as one row
  const seenNewKeys = new Set<string>()
  const mappable: Array<{ inst: InstanceNode; oldKey: string; oldName: string }> = []
  const MAX_SCAN = 2000

  for (let i = 0; i < instances.length && i < MAX_SCAN; i++) {
    const inst = instances[i]
    let main: ComponentNode | null = null
    try {
      main = await inst.getMainComponentAsync()
    } catch {
      main = null
    }
    const oldKey = main?.key ?? null
    if (!oldKey) continue
    const newKey = mergedMatches[oldKey]
    if (!newKey) continue
    // Skip if we already have a row mapping to this new component
    if (seenNewKeys.has(newKey)) continue
    seenNewKeys.add(newKey)
    mappable.push({ inst, oldKey, oldName: main ? getComponentDisplayName(main) : inst.name })
    if (mappable.length >= sampleSize) break

    // Yield periodically
    if (i % 200 === 0) {
      await new Promise((r) => setTimeout(r, 0))
    }
  }

  if (!mappable.length) return { previewed: 0 }

  await loadPreviewFonts()

  // Find or create preview frame
  const existing = figma.currentPage.findAll(
    (n) => n.type === "FRAME" && n.name === PREVIEW_FRAME_NAME
  ) as FrameNode[]
  const frame = existing[0] ?? figma.createFrame()
  frame.name = PREVIEW_FRAME_NAME
  for (const dup of existing.slice(1)) {
    try { dup.remove() } catch { /* ignore */ }
  }
  for (const child of [...frame.children]) {
    try { child.remove() } catch { /* ignore */ }
  }
  frame.fills = [PREVIEW_BG]
  frame.layoutMode = "VERTICAL"
  frame.primaryAxisSizingMode = "AUTO"
  frame.counterAxisSizingMode = "AUTO"
  frame.itemSpacing = 0
  frame.paddingTop = 16
  frame.paddingBottom = 16
  frame.paddingLeft = 24
  frame.paddingRight = 24

  // Header row
  const headerRow = figma.createFrame()
  headerRow.name = "Header"
  headerRow.layoutMode = "HORIZONTAL"
  headerRow.primaryAxisSizingMode = "AUTO"
  headerRow.counterAxisSizingMode = "AUTO"
  headerRow.counterAxisAlignItems = "CENTER"
  headerRow.itemSpacing = 24
  headerRow.fills = []
  headerRow.paddingBottom = 12

  const headerLabel = createTextNode("Component", HEADER_FONT, 12, { r: 0.4, g: 0.4, b: 0.4 })
  headerLabel.resize(200, headerLabel.height)
  headerRow.appendChild(headerLabel)

  const headerBefore = createTextNode("Before", HEADER_FONT, 12, { r: 0.4, g: 0.4, b: 0.4 })
  headerRow.appendChild(headerBefore)

  // Spacer for arrow column
  const headerArrow = createTextNode("   ", LABEL_FONT, 12, { r: 0.4, g: 0.4, b: 0.4 })
  headerRow.appendChild(headerArrow)

  const headerAfter = createTextNode("After", HEADER_FONT, 12, { r: 0.4, g: 0.4, b: 0.4 })
  headerRow.appendChild(headerAfter)

  frame.appendChild(headerRow)
  frame.appendChild(createSeparator())

  const cache = new Map<string, ComponentNode>()
  let rowCount = 0

  for (let i = 0; i < mappable.length; i++) {
    const { inst, oldKey, oldName } = mappable[i]
    const newKey = mergedMatches[oldKey]

    try {
      const oldClone = inst.clone()
      oldClone.name = "Before"
      const afterClone = inst.clone()
      afterClone.name = "After"

      if (newKey) {
        let newComp = cache.get(newKey)
        if (!newComp) {
          newComp = await figma.importComponentByKeyAsync(newKey)
          cache.set(newKey, newComp)
        }
        afterClone.swapComponent(newComp)
      }

      // Resolve new component name
      let newName = oldName
      if (newKey) {
        const comp = cache.get(newKey)
        if (comp) newName = getComponentDisplayName(comp)
      }

      // Add separator before row (except first)
      if (rowCount > 0) {
        frame.appendChild(createSeparator())
      }

      const row = figma.createFrame()
      row.name = `${oldName} → ${newName}`
      row.layoutMode = "HORIZONTAL"
      row.primaryAxisSizingMode = "AUTO"
      row.counterAxisSizingMode = "AUTO"
      row.counterAxisAlignItems = "CENTER"
      row.itemSpacing = 24
      row.fills = []
      row.paddingTop = 12
      row.paddingBottom = 12

      // Label
      const label = createTextNode(oldName, LABEL_FONT, 11, { r: 0.2, g: 0.2, b: 0.2 })
      label.resize(200, label.height)
      label.textTruncation = "ENDING"
      row.appendChild(label)

      // Before clone
      row.appendChild(oldClone)

      // Arrow
      const arrow = createTextNode("→", ARROW_FONT, 14, { r: 0.5, g: 0.5, b: 0.5 })
      row.appendChild(arrow)

      // After clone
      row.appendChild(afterClone)

      frame.appendChild(row)
      rowCount++
    } catch {
      // Skip rows that fail (e.g. clone or import errors)
      continue
    }
  }

  const c = figma.viewport.center
  frame.x = Math.round(c.x - frame.width / 2)
  frame.y = Math.round(c.y - frame.height / 2)
  if (!frame.parent) figma.currentPage.appendChild(frame)
  figma.currentPage.selection = [frame]
  figma.viewport.scrollAndZoomIntoView([frame])

  return { previewed: rowCount }
}

// ---------------------------------------------------------------------------
// Clear previews
// ---------------------------------------------------------------------------

export function clearSwapPreviews(): number {
  const nodes = figma.currentPage.findAll(
    (n) => n.type === "FRAME" && n.name === PREVIEW_FRAME_NAME
  )
  let removed = 0
  for (const n of nodes) {
    try {
      n.remove()
      removed++
    } catch { /* ignore */ }
  }
  return removed
}

// ---------------------------------------------------------------------------
// Focus node
// ---------------------------------------------------------------------------

export async function focusNode(nodeId: string): Promise<boolean> {
  const node = await figma.getNodeByIdAsync(nodeId)
  if (!node || !("absoluteBoundingBox" in node)) return false
  const page = findPage(node)
  if (page && page !== figma.currentPage) {
    await figma.setCurrentPageAsync(page)
  }
  figma.currentPage.selection = [node as SceneNode]
  figma.viewport.scrollAndZoomIntoView([node as SceneNode])
  return true
}

function findPage(node: BaseNode): PageNode | null {
  let current: BaseNode | null = node
  while (current) {
    if (current.type === "PAGE") return current as PageNode
    current = current.parent
  }
  return null
}
