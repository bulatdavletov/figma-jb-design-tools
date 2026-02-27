import type { PrintColorUsagesUiSettings } from "../../home/messages"
import { plural } from "../../utils/pluralize"
import { applyTypographyToLabel, getThemeColors, loadFontsForLabelTextStyle, resolveMarkupDescriptionTextStyle, resolveMarkupTextFills, verifyFillBinding } from "./markup-kit"
import { analyzeNodeColors, calculateTextPositionFromRect } from "./analyze"
import type { ColorUsage } from "./shared"
import { savePrintColorUsagesSettings } from "./settings"

function getAbsoluteXY(node: SceneNode): { x: number; y: number } {
  const t = node.absoluteTransform
  return { x: t[0][2], y: t[1][2] }
}

function findContainingFrame(node: SceneNode): FrameNode | SectionNode | null {
  let p: BaseNode | null = node.parent
  while (p) {
    if (p.type === "FRAME") return p as FrameNode
    if (p.type === "SECTION") return p as SectionNode
    p = p.parent
  }
  return null
}

function findOutermostContainingInstance(node: SceneNode): InstanceNode | null {
  let current: BaseNode | null = node
  let lastInstance: InstanceNode | null = null
  while (current) {
    if (current.type === "INSTANCE") lastInstance = current as InstanceNode
    current = current.parent
  }
  return lastInstance
}

function getNodeRectInContainer(
  node: SceneNode,
  container: FrameNode | SectionNode | PageNode
): { x: number; y: number; width: number; height: number } {
  const absNode = getAbsoluteXY(node)

  if (container.type === "FRAME" || container.type === "SECTION") {
    const absContainer = getAbsoluteXY(container as any)
    return {
      x: absNode.x - absContainer.x,
      y: absNode.y - absContainer.y,
      width: node.width,
      height: node.height,
    }
  }

  return {
    x: absNode.x,
    y: absNode.y,
    width: node.width,
    height: node.height,
  }
}

export async function printColorUsagesFromSelection(settings: PrintColorUsagesUiSettings): Promise<number> {
  const selection = figma.currentPage.selection
  if (selection.length === 0) {
    figma.notify("Please select an element first")
    return 0
  }

  // Persist settings so future runs behave consistently.
  await savePrintColorUsagesSettings(settings)

  const textPosition = settings.textPosition
  const showLinkedColors = settings.showLinkedColors
  const showFolderNames = settings.showFolderNames
  const checkNested = settings.checkNested !== false
  const printDistance = typeof settings.printDistance === "number" ? settings.printDistance : 16

  const useMarkupStyle = settings.applyTextStyle !== false
  const useMarkupColor = settings.applyTextColor !== false

  let markupDescriptionStyle: TextStyle | null = null
  if (useMarkupStyle) {
    try {
      markupDescriptionStyle = await resolveMarkupDescriptionTextStyle()
    } catch {
      // ignore
    }
  }
  await loadFontsForLabelTextStyle(markupDescriptionStyle)

  const themeColors = getThemeColors(settings.textTheme)
  const labelFills = useMarkupColor ? await resolveMarkupTextFills(themeColors) : null
  const primaryFills = labelFills?.primary ?? [{ type: "SOLID" as const, color: themeColors.primary }]
  const secondaryFills = labelFills?.secondary ?? [{ type: "SOLID" as const, color: themeColors.secondary }]

  const textNodes: TextNode[] = []
  let groupsWithNoColors = 0

  // Group selection by containing instance (outermost).
  type PrintGroup = { anchor: SceneNode; selectedNodes: SceneNode[] }
  const groups = new Map<string, PrintGroup>()
  for (const selected of selection) {
    const anchor = findOutermostContainingInstance(selected) ?? selected
    const key = anchor.id
    const existing = groups.get(key)
    if (!existing) groups.set(key, { anchor, selectedNodes: [selected] })
    else existing.selectedNodes.push(selected)
  }

  for (const group of Array.from(groups.values())) {
    const anchor = group.anchor
    const nodesToAnalyze = group.selectedNodes.some((n: SceneNode) => n.id === anchor.id) ? [anchor] : group.selectedNodes

    const merged: Array<ColorUsage> = []
    for (const n of nodesToAnalyze) {
      const colors = await analyzeNodeColors(n, showLinkedColors, showFolderNames, checkNested)
      merged.push(...colors)
    }

    // Re-dedupe/sort after merge.
    const uniqueByKey = new Map<string, ColorUsage>()
    for (const item of merged) {
      if (!uniqueByKey.has(item.uniqueKey)) uniqueByKey.set(item.uniqueKey, item)
    }
    const colorInfo = Array.from(uniqueByKey.values()).sort((a, b) => {
      const aIsHex = a.label.startsWith("#")
      const bIsHex = b.label.startsWith("#")
      if (aIsHex && !bIsHex) return 1
      if (!aIsHex && bIsHex) return -1
      return a.label.localeCompare(b.label)
    })

    if (colorInfo.length === 0) {
      groupsWithNoColors++
      continue
    }

    const parentContainer = findContainingFrame(anchor) ?? figma.currentPage
    const nodeRect = getNodeRectInContainer(anchor, parentContainer)

    for (let i = 0; i < colorInfo.length; i++) {
      const info = colorInfo[i]
      const text = figma.createText()
      text.characters = info.label
      await applyTypographyToLabel(text, markupDescriptionStyle)

      // Set layer name from variable context (layer name is the single source of truth).
      const ctx = info.variableContext
      if (ctx) {
        text.name =
          ctx.isNonDefaultMode && ctx.variableModeName ? `${ctx.variableId} (${ctx.variableModeName})` : ctx.variableId
      } else {
        text.name = info.layerName
      }

      const position = calculateTextPositionFromRect(nodeRect, textPosition, i, printDistance)
      text.x = position.x
      text.y = position.y
      text.fills = primaryFills
      if (labelFills?.primaryVariableId && !verifyFillBinding(text, labelFills.primaryVariableId)) {
        console.warn("[Print Color Usages] Fill binding mismatch on primary fill for", text.name)
      }

      const parts = info.styledVariableParts
      if (parts) {
        const secondaryStart = parts.primaryText.length + parts.separator.length
        const secondaryEnd = secondaryStart + parts.secondaryText.length
        try {
          text.setRangeFills(secondaryStart, secondaryEnd, secondaryFills)
        } catch {
          // ignore
        }
      }

      if (textPosition === "left") text.x = nodeRect.x - text.width - 16

      parentContainer.appendChild(text)
      textNodes.push(text)
    }
  }

  if (textNodes.length > 0) {
    figma.currentPage.selection = textNodes
    try {
      figma.viewport.scrollAndZoomIntoView([textNodes[0]])
    } catch {
      // ignore
    }
    const suffix = groupsWithNoColors > 0 ? `; no colors found in ${plural(groupsWithNoColors, "selection group")}` : ""
    figma.notify(`Created ${plural(textNodes.length, "color usage text node")}${suffix}`)
  } else {
    figma.notify("No visible solid colors found in selection")
  }

  return textNodes.length
}

