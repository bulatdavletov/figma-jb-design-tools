import type { PrintColorUsagesUiSettings } from "../../messages"
import { applyTypographyToLabel, getThemeColors, loadFontsForLabelTextStyle, resolveMarkupDescriptionTextStyle, resolveMarkupTextFills } from "./markup-kit"
import {
  extractModeNameFromLayerName,
  extractVariableIdFromLayerName,
  findLocalVariableIdByName,
  isTextNode,
  PLUGIN_DATA_VARIABLE_COLLECTION_ID,
  PLUGIN_DATA_VARIABLE_ID,
  PLUGIN_DATA_VARIABLE_MODE_ID,
  resolveModeIdByName,
  resolveVariableModeContext,
  stripTrailingModeSuffix,
} from "./shared"
import { savePrintColorUsagesSettings } from "./settings"

async function resolveVariableLabelPartsFromVariable(
  variableId: string,
  showLinkedColors: boolean,
  node: SceneNode | undefined,
  hideFolderNames: boolean,
  explicitModeId?: string | null
): Promise<{ primaryText: string; secondaryText: string; modeContext: Awaited<ReturnType<typeof resolveVariableModeContext>> }> {
  const variable = await figma.variables.getVariableByIdAsync(variableId)
  const maybeStripFolderPrefix = (name: string) => {
    if (!hideFolderNames) return name
    const idx = name.lastIndexOf("/")
    if (idx === -1) return name
    const leaf = name.slice(idx + 1)
    return leaf || name
  }

  const primaryText = maybeStripFolderPrefix(variable?.name ?? variable?.key ?? "Unknown Variable")
  const modeContext = await resolveVariableModeContext(
    variable?.variableCollectionId,
    node,
    (variable as any)?.valuesByMode,
    explicitModeId
  )

  if (!showLinkedColors) return { primaryText, secondaryText: "", modeContext }

  let secondaryText = ""
  const currentModeId = modeContext.modeId
  const value = currentModeId && variable?.valuesByMode ? (variable.valuesByMode as any)[currentModeId] : undefined

  if (value && typeof value === "object" && "type" in value && (value as any).type === "VARIABLE_ALIAS") {
    const aliasValue = value as any
    if (aliasValue.id) {
      try {
        const linkedVariable = await figma.variables.getVariableByIdAsync(aliasValue.id)
        if (linkedVariable?.name) secondaryText = maybeStripFolderPrefix(linkedVariable.name)
      } catch {
        // ignore
      }
    }
  }

  return { primaryText, secondaryText, modeContext }
}

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
  resolvedBy: "plugin_data" | "layer_variable_id" | "layer_name" | "text_content"
}

async function resolveUpdateTargetForText(
  text: TextNode,
  settings: PrintColorUsagesUiSettings
): Promise<ResolvedUpdateTarget | null> {
  const currentLayerName = (text.name ?? "").trim()
  if (!currentLayerName) return null

  let variableIdToUse: string | null = null
  let variableCollectionId: string | null = null
  let resolvedBy: "plugin_data" | "layer_variable_id" | "layer_name" | "text_content" = "layer_name"

  const variableIdFromPluginData = (() => {
    try {
      const v = text.getPluginData(PLUGIN_DATA_VARIABLE_ID)
      return v ? v.trim() : ""
    } catch {
      return ""
    }
  })()

  const variableIdFromLayerName = extractVariableIdFromLayerName(currentLayerName)
  const idCandidate = variableIdFromPluginData || variableIdFromLayerName || ""
  const currentTextValue = (text.characters ?? "").trim()
  const currentTextPrimary = currentTextValue
    ? (currentTextValue.split(/\s{3,}/)[0] ?? "").trim()
    : ""

  // 1) If layer name is a variable id, use it.
  try {
    const v = await figma.variables.getVariableByIdAsync(idCandidate || currentLayerName)
    if (v?.id) {
      variableIdToUse = v.id
      variableCollectionId = (v as any)?.variableCollectionId ?? null
      resolvedBy = variableIdFromPluginData ? "plugin_data" : "layer_variable_id"
    }
  } catch {
    // ignore
  }

  // 2) Otherwise, try to match by variable name.
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

  // 3) If still unresolved, try selected print content (primary part before linked separator).
  if (!variableIdToUse) {
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

  let explicitModeId: string | null = (() => {
    try {
      const fromData = text.getPluginData(PLUGIN_DATA_VARIABLE_MODE_ID)
      return fromData ? fromData : null
    } catch {
      return null
    }
  })()

  if (!explicitModeId && variableCollectionId) {
    const modeName = extractModeNameFromLayerName(currentLayerName)
    if (modeName) explicitModeId = await resolveModeIdByName(variableCollectionId, modeName)
  }

  let parts: Awaited<ReturnType<typeof resolveVariableLabelPartsFromVariable>>
  try {
    parts = await resolveVariableLabelPartsFromVariable(
      variableIdToUse,
      settings.showLinkedColors,
      text,
      settings.hideFolderNames,
      explicitModeId
    )
  } catch {
    return null
  }

  const separator = "   "
  const hasSecondary = settings.showLinkedColors && !!parts.secondaryText
  const label = hasSecondary ? `${parts.primaryText}${separator}${parts.secondaryText}` : parts.primaryText

  const desiredLayerName =
    parts.modeContext.isNonDefaultMode && parts.modeContext.modeName
      ? `${variableIdToUse} (${parts.modeContext.modeName})`
      : variableIdToUse

  const needsCharactersUpdate = (text.characters ?? "") !== label
  const needsNameUpdate = (text.name ?? "") !== desiredLayerName
  const oldSecondaryText = (() => {
    const raw = text.characters ?? ""
    const parts = raw.split(/\s{3,}/)
    return parts.length > 1 ? parts.slice(1).join("   ").trim() : ""
  })()
  const linkedColorChanged =
    settings.showLinkedColors && ((oldSecondaryText || "") !== (parts.secondaryText || ""))

  return {
    label,
    desiredLayerName,
    hasSecondary,
    parts,
    variableIdToUse,
    needsCharactersUpdate,
    needsNameUpdate,
    linkedColorChanged,
    resolvedBy,
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
  resolvedBy: "plugin_data" | "layer_variable_id" | "layer_name" | "text_content"
}

export async function previewUpdateSelectedTextNodesByVariableId(
  settings: PrintColorUsagesUiSettings,
  scope: "selection" | "page" | "all_pages" = "page",
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

  for (const text of textNodes) {
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
  options?: { targetNodeIds?: string[] }
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

  for (const text of textNodes) {
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

    if (target.hasSecondary) {
      const secondaryStart = target.parts.primaryText.length + 3
      const secondaryEnd = secondaryStart + target.parts.secondaryText.length
      try {
        text.setRangeFills(secondaryStart, secondaryEnd, Array.from(secondaryFills))
      } catch {
        // ignore
      }
    }

    // Persist mode context on the layer, but only when it's not the default mode.
    try {
      text.setPluginData(PLUGIN_DATA_VARIABLE_ID, target.variableIdToUse)
      if (
        target.parts.modeContext.isNonDefaultMode &&
        target.parts.modeContext.variableCollectionId &&
        target.parts.modeContext.modeId
      ) {
        text.setPluginData(PLUGIN_DATA_VARIABLE_COLLECTION_ID, target.parts.modeContext.variableCollectionId)
        text.setPluginData(PLUGIN_DATA_VARIABLE_MODE_ID, target.parts.modeContext.modeId)
      } else {
        text.setPluginData(PLUGIN_DATA_VARIABLE_COLLECTION_ID, "")
        text.setPluginData(PLUGIN_DATA_VARIABLE_MODE_ID, "")
      }
    } catch {
      // ignore
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

