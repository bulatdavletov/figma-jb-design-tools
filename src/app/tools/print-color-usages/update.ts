import type { PrintColorUsagesUiSettings } from "../../messages"
import { applyTypographyToLabel, getThemeColors, loadFontsForLabelTextStyle, resolveMarkupDescriptionTextStyle, resolveMarkupTextFills, verifyFillBinding } from "./markup-kit"
import {
  extractModeNameFromLayerName,
  extractVariableIdFromLayerName,
  findLocalVariableIdByName,
  isTextNode,
  resolveModeIdByName,
  resolveVariableLabelPartsFromVariable,
  stripTrailingModeSuffix,
} from "./shared"
import { savePrintColorUsagesSettings } from "./settings"

function collectTextNodesRecursivelyFromSelection(selection: readonly SceneNode[]): TextNode[] {
  const result: TextNode[] = []
  const seen = new Set<string>()

  const add = (node: SceneNode) => {
    if (node.type !== "TEXT") return
    if (seen.has(node.id)) return
    seen.add(node.id)
    result.push(node as TextNode)
  }

  const walk = (node: SceneNode) => {
    add(node)
    if (!("children" in node)) return
    const children = (node as any).children as SceneNode[] | undefined
    if (!children || !Array.isArray(children)) return
    for (const child of children) {
      walk(child)
    }
  }

  for (const root of selection) {
    walk(root)
  }

  return result
}

type ResolvedUpdateTarget = {
  label: string
  desiredLayerName: string
  hasSecondary: boolean
  parts: Awaited<ReturnType<typeof resolveVariableLabelPartsFromVariable>>
  variableIdToUse: string
  needsCharactersUpdate: boolean
  needsNameUpdate: boolean
  linkedColorChanged: boolean
  resolvedBy: "layer_variable_id" | "layer_name" | "text_content"
  contentMismatch?: {
    contentVariableId: string
    contentVariableName: string
    layerVariableId: string
    layerVariableName: string
  }
}

async function resolveUpdateTargetForText(
  text: TextNode,
  settings: PrintColorUsagesUiSettings
): Promise<ResolvedUpdateTarget | null> {
  const currentLayerName = (text.name ?? "").trim()
  if (!currentLayerName) return null

  let variableIdToUse: string | null = null
  let variableCollectionId: string | null = null
  let resolvedBy: "layer_variable_id" | "layer_name" | "text_content" = "layer_name"

  const variableIdFromLayerName = extractVariableIdFromLayerName(currentLayerName)
  const currentTextValue = (text.characters ?? "").trim()
  const currentTextPrimary = currentTextValue
    ? (currentTextValue.split(/\s{3,}/)[0] ?? "").trim()
    : ""

  // 1) If layer name contains a VariableID, resolve by it.
  if (variableIdFromLayerName) {
    try {
      const v = await figma.variables.getVariableByIdAsync(variableIdFromLayerName)
      if (v?.id) {
        variableIdToUse = v.id
        variableCollectionId = (v as any)?.variableCollectionId ?? null
        resolvedBy = "layer_variable_id"
      }
    } catch {
      // ignore
    }
  }

  // 2) Otherwise, try to match by variable name from layer name.
  if (!variableIdToUse) {
    variableIdToUse = await findLocalVariableIdByName(stripTrailingModeSuffix(currentLayerName))
    if (variableIdToUse) {
      resolvedBy = "layer_name"
      try {
        const v = await figma.variables.getVariableByIdAsync(variableIdToUse)
        variableCollectionId = (v as any)?.variableCollectionId ?? null
      } catch {
        // ignore
      }
    }
  }

  // 3) If checkByContent is ON and still unresolved, try text content fallback.
  if (!variableIdToUse && settings.checkByContent) {
    const contentCandidates = [currentTextPrimary, currentTextValue]
      .map((s) => s.trim())
      .filter((s, i, arr) => s.length > 0 && arr.indexOf(s) === i)

    for (const candidate of contentCandidates) {
      const byContent = await findLocalVariableIdByName(candidate)
      if (!byContent) continue
      variableIdToUse = byContent
      resolvedBy = "text_content"
      try {
        const v = await figma.variables.getVariableByIdAsync(variableIdToUse)
        variableCollectionId = (v as any)?.variableCollectionId ?? null
      } catch {
        // ignore
      }
      break
    }
  }

  if (!variableIdToUse) return null

  // Mismatch detection: when resolved by layer name, also check content.
  let contentMismatch: ResolvedUpdateTarget["contentMismatch"] = undefined
  if (settings.checkByContent && resolvedBy !== "text_content") {
    const contentCandidates = [currentTextPrimary, currentTextValue]
      .map((s) => s.trim())
      .filter((s, i, arr) => s.length > 0 && arr.indexOf(s) === i)
    for (const candidate of contentCandidates) {
      const contentVarId = await findLocalVariableIdByName(candidate)
      if (contentVarId && contentVarId !== variableIdToUse) {
        try {
          const contentVar = await figma.variables.getVariableByIdAsync(contentVarId)
          const layerVar = await figma.variables.getVariableByIdAsync(variableIdToUse)
          contentMismatch = {
            contentVariableId: contentVarId,
            contentVariableName: contentVar?.name ?? contentVarId,
            layerVariableId: variableIdToUse,
            layerVariableName: layerVar?.name ?? variableIdToUse,
          }
        } catch {
          // ignore
        }
        break
      }
    }
  }

  let explicitModeId: string | null = null
  if (variableCollectionId) {
    const modeName = extractModeNameFromLayerName(currentLayerName)
    if (modeName) explicitModeId = await resolveModeIdByName(variableCollectionId, modeName)
  }

  let parts: Awaited<ReturnType<typeof resolveVariableLabelPartsFromVariable>>
  try {
    parts = await resolveVariableLabelPartsFromVariable(
      variableIdToUse,
      settings.showLinkedColors,
      text,
      settings.showFolderNames,
      explicitModeId
    )
  } catch {
    return null
  }

  const separator = "   "
  // In the Update flow we don't have access to paint.opacity, so we use
  // only the variable's alpha channel for the opacity suffix.
  let secondaryWithAlpha = parts.secondaryText
  if (secondaryWithAlpha && parts.alpha !== undefined && Math.abs(parts.alpha - 1) > 0.001) {
    secondaryWithAlpha += ` ${Math.round(parts.alpha * 100)}%`
  }
  const hasSecondary = settings.showLinkedColors && !!secondaryWithAlpha
  const label = hasSecondary ? `${parts.primaryText}${separator}${secondaryWithAlpha}` : parts.primaryText

  const desiredLayerName =
    parts.modeContext.isNonDefaultMode && parts.modeContext.modeName
      ? `${variableIdToUse} (${parts.modeContext.modeName})`
      : variableIdToUse

  const needsCharactersUpdate = (text.characters ?? "") !== label
  const needsNameUpdate = (text.name ?? "") !== desiredLayerName
  const oldSecondaryText = (() => {
    const raw = text.characters ?? ""
    const rawParts = raw.split(/\s{3,}/)
    return rawParts.length > 1 ? rawParts.slice(1).join("   ").trim() : ""
  })()
  const linkedColorChanged =
    settings.showLinkedColors && ((oldSecondaryText || "") !== (secondaryWithAlpha || ""))

  // Override secondaryText in parts so the apply logic uses the correct length (with alpha suffix).
  const adjustedParts = { ...parts, secondaryText: secondaryWithAlpha }

  return {
    label,
    desiredLayerName,
    hasSecondary,
    parts: adjustedParts,
    variableIdToUse,
    needsCharactersUpdate,
    needsNameUpdate,
    linkedColorChanged,
    resolvedBy,
    contentMismatch,
  }
}

export type PrintColorUsagesUpdatePreviewEntry = {
  nodeId: string
  nodeName: string
  oldText: string
  newText: string
  oldLayerName: string
  newLayerName: string
  textChanged: boolean
  layerNameChanged: boolean
  linkedColorChanged: boolean
  resolvedBy: "layer_variable_id" | "layer_name" | "text_content"
  contentMismatch?: {
    contentVariableId: string
    contentVariableName: string
    layerVariableId: string
    layerVariableName: string
  }
}

export async function previewUpdateSelectedTextNodesByVariableId(
  settings: PrintColorUsagesUiSettings,
  scope: "selection" | "page" | "all_pages" = "page",
  onProgress?: (current: number, total: number) => Promise<void>,
): Promise<{
  scope: "selection" | "page" | "all_pages"
  candidates: number
  changed: number
  unchanged: number
  skipped: number
  entries: PrintColorUsagesUpdatePreviewEntry[]
}> {
  let textNodes: TextNode[]

  if (scope === "selection") {
    const selection = figma.currentPage.selection
    textNodes = collectTextNodesRecursivelyFromSelection(selection)
  } else if (scope === "all_pages") {
    textNodes = []
    for (const page of figma.root.children) {
      const nodes = page
        .findAll((n) => n.type === "TEXT")
        .map((n) => n as TextNode)
        .filter((t) => (t.name ?? "").trim().startsWith("VariableID"))
      textNodes.push(...nodes)
    }
  } else {
    textNodes = figma.currentPage
      .findAll((n) => n.type === "TEXT")
      .map((n) => n as TextNode)
      .filter((t) => (t.name ?? "").trim().startsWith("VariableID"))
  }

  const entries: PrintColorUsagesUpdatePreviewEntry[] = []
  let changed = 0
  let unchanged = 0
  let skipped = 0
  const total = textNodes.length

  for (let i = 0; i < total; i++) {
    const text = textNodes[i]
    if (onProgress && i > 0 && i % 10 === 0) {
      await onProgress(i, total)
    }
    const target = await resolveUpdateTargetForText(text, settings)
    if (!target) {
      skipped++
      continue
    }

    if (!target.needsCharactersUpdate && !target.needsNameUpdate) {
      unchanged++
      continue
    }

    changed++
    entries.push({
      nodeId: text.id,
      nodeName: text.name || "Untitled",
      oldText: text.characters ?? "",
      newText: target.label,
      oldLayerName: text.name ?? "",
      newLayerName: target.desiredLayerName,
      textChanged: target.needsCharactersUpdate,
      layerNameChanged: target.needsNameUpdate,
      linkedColorChanged: target.linkedColorChanged,
      resolvedBy: target.resolvedBy,
      contentMismatch: target.contentMismatch,
    })
  }

  return {
    scope,
    candidates: textNodes.length,
    changed,
    unchanged,
    skipped,
    entries,
  }
}

export async function updateSelectedTextNodesByVariableId(
  settings: PrintColorUsagesUiSettings,
  options?: { targetNodeIds?: string[] },
  onProgress?: (current: number, total: number) => Promise<void>,
): Promise<{
  updated: number
  unchanged: number
  skipped: number
}> {
  // Persist settings (matches original plugin behavior).
  await savePrintColorUsagesSettings(settings)

  const selection = figma.currentPage.selection
  const hasSelection = selection.length > 0
  const targetNodeIds = options?.targetNodeIds ?? []
  const hasExplicitTargets = targetNodeIds.length > 0

  // Typography: prefer "Markup Description text" style.
  let markupDescriptionStyle: TextStyle | null = null
  try {
    markupDescriptionStyle = await resolveMarkupDescriptionTextStyle()
  } catch {
    // ignore
  }
  await loadFontsForLabelTextStyle(markupDescriptionStyle)

  const themeColors = getThemeColors(settings.textTheme)
  const labelFills = await resolveMarkupTextFills(themeColors)
  const primaryFills: Paint[] = labelFills.primary
  const secondaryFills: Paint[] = labelFills.secondary

  const explicitTargetTextNodes: TextNode[] = hasExplicitTargets
    ? (
        await Promise.all(
          targetNodeIds.map(async (id) => {
            try {
              return await figma.getNodeByIdAsync(id)
            } catch {
              return null
            }
          })
        )
      )
        .filter((node): node is SceneNode => node !== null)
        .filter(isTextNode)
    : []

  const textNodes: TextNode[] = hasExplicitTargets
    ? explicitTargetTextNodes
    : hasSelection
      ? collectTextNodesRecursivelyFromSelection(selection)
      : figma.currentPage
          .findAll((n) => n.type === "TEXT")
          .map((n) => n as TextNode)
          .filter((t) => (t.name ?? "").trim().startsWith("VariableID"))

  if (hasExplicitTargets && textNodes.length === 0) {
    figma.notify("No preview items selected")
    return { updated: 0, unchanged: 0, skipped: 0 }
  }

  if (!hasExplicitTargets && hasSelection && textNodes.length === 0) {
    figma.notify("No text layers selected")
    return { updated: 0, unchanged: 0, skipped: 0 }
  }

  if (!hasExplicitTargets && !hasSelection && textNodes.length === 0) {
    figma.notify('No text layers found on this page with name starting "VariableID"')
    return { updated: 0, unchanged: 0, skipped: 0 }
  }

  let updated = 0
  let skipped = 0
  let unchanged = 0
  const changedNodes: TextNode[] = []
  const total = textNodes.length

  for (let i = 0; i < total; i++) {
    const text = textNodes[i]
    if (onProgress && i > 0 && i % 10 === 0) {
      await onProgress(i, total)
    }
    const target = await resolveUpdateTargetForText(text, settings)
    if (!target) {
      skipped++
      continue
    }

    if (!target.needsCharactersUpdate && !target.needsNameUpdate) {
      unchanged++
      continue
    }

    try {
      if (target.needsCharactersUpdate) text.characters = target.label
    } catch {
      skipped++
      continue
    }

    if (target.needsNameUpdate) text.name = target.desiredLayerName

    try {
      await applyTypographyToLabel(text, markupDescriptionStyle)
    } catch {
      // ignore
    }

    text.fills = primaryFills
    if (labelFills.primaryVariableId && !verifyFillBinding(text, labelFills.primaryVariableId)) {
      console.warn("[Print Color Usages] Fill binding mismatch on primary fill for", text.name)
    }

    if (target.hasSecondary) {
      const secondaryStart = target.parts.primaryText.length + 3
      const secondaryEnd = secondaryStart + target.parts.secondaryText.length
      try {
        text.setRangeFills(secondaryStart, secondaryEnd, Array.from(secondaryFills))
      } catch {
        // ignore
      }
    }

    updated++
    changedNodes.push(text)
  }

  const summaryMessage =
    updated > 0
      ? `Updated ${updated} text layer(s)${unchanged ? `, unchanged ${unchanged}` : ""}${skipped ? `, skipped ${skipped}` : ""}${
          hasExplicitTargets ? " (preview selection)" : hasSelection ? "" : " (page scan)"
        }`
      : `No layers were updated${unchanged ? ` (${unchanged} unchanged)` : ""}${skipped ? `, skipped ${skipped}` : ""}${
          hasExplicitTargets ? " (preview selection)" : hasSelection ? "" : " (page scan)"
        }`

  figma.notify(summaryMessage)

  if (changedNodes.length > 0) {
    figma.currentPage.selection = changedNodes
    try {
      figma.viewport.scrollAndZoomIntoView([changedNodes[0]])
    } catch {
      // ignore
    }
  }

  return { updated, unchanged, skipped }
}

