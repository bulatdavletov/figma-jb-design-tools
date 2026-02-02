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

export async function updateSelectedTextNodesByVariableId(settings: PrintColorUsagesUiSettings): Promise<{
  updated: number
  unchanged: number
  skipped: number
}> {
  // Persist settings (matches original plugin behavior).
  await savePrintColorUsagesSettings(settings)

  const selection = figma.currentPage.selection
  const hasSelection = selection.length > 0

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

  const textNodes: TextNode[] = hasSelection
    ? collectTextNodesRecursivelyFromSelection(selection)
    : figma.currentPage
        .findAll((n) => n.type === "TEXT")
        .map((n) => n as TextNode)
        .filter((t) => (t.name ?? "").trim().startsWith("VariableID"))

  if (hasSelection && textNodes.length === 0) {
    figma.notify("No text layers selected")
    return { updated: 0, unchanged: 0, skipped: 0 }
  }

  if (!hasSelection && textNodes.length === 0) {
    figma.notify('No text layers found on this page with name starting "VariableID"')
    return { updated: 0, unchanged: 0, skipped: 0 }
  }

  let updated = 0
  let skipped = 0
  let unchanged = 0
  const changedNodes: TextNode[] = []

  const total = textNodes.length
  const showProgress = (done: number) => {
    figma.notify(`Updating… ${done}/${total}`, { timeout: 1000 })
  }
  showProgress(0)

  for (let idx = 0; idx < textNodes.length; idx++) {
    const text = textNodes[idx]
    if (idx > 0 && (idx % 10 === 0 || idx === total - 1)) showProgress(idx + 1)

    const currentLayerName = (text.name ?? "").trim()
    if (!currentLayerName) {
      skipped++
      continue
    }

    let variableIdToUse: string | null = null
    let variableCollectionId: string | null = null

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

    // 1) If layer name is a variable id, use it.
    try {
      const v = await figma.variables.getVariableByIdAsync(idCandidate || currentLayerName)
      if (v?.id) {
        variableIdToUse = v.id
        variableCollectionId = (v as any)?.variableCollectionId ?? null
      }
    } catch {
      // ignore
    }

    // 2) Otherwise, try to match by variable name.
    if (!variableIdToUse) {
      variableIdToUse = await findLocalVariableIdByName(stripTrailingModeSuffix(currentLayerName))
      if (variableIdToUse) {
        try {
          const v = await figma.variables.getVariableByIdAsync(variableIdToUse)
          variableCollectionId = (v as any)?.variableCollectionId ?? null
        } catch {
          // ignore
        }
      }
    }

    if (!variableIdToUse) {
      skipped++
      continue
    }

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
      skipped++
      continue
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
    if (!needsCharactersUpdate && !needsNameUpdate) {
      unchanged++
      continue
    }

    try {
      if (needsCharactersUpdate) text.characters = label
    } catch {
      skipped++
      continue
    }

    if (needsNameUpdate) text.name = desiredLayerName

    try {
      await applyTypographyToLabel(text, markupDescriptionStyle)
    } catch {
      // ignore
    }

    text.fills = primaryFills

    if (hasSecondary) {
      const secondaryStart = parts.primaryText.length + separator.length
      const secondaryEnd = secondaryStart + parts.secondaryText.length
      try {
        text.setRangeFills(secondaryStart, secondaryEnd, Array.from(secondaryFills))
      } catch {
        // ignore
      }
    }

    // Persist mode context on the layer, but only when it's not the default mode.
    try {
      text.setPluginData(PLUGIN_DATA_VARIABLE_ID, variableIdToUse)
      if (parts.modeContext.isNonDefaultMode && parts.modeContext.variableCollectionId && parts.modeContext.modeId) {
        text.setPluginData(PLUGIN_DATA_VARIABLE_COLLECTION_ID, parts.modeContext.variableCollectionId)
        text.setPluginData(PLUGIN_DATA_VARIABLE_MODE_ID, parts.modeContext.modeId)
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
          hasSelection ? "" : " (page scan)"
        }`
      : `No layers were updated${unchanged ? ` (${unchanged} unchanged)` : ""}${skipped ? `, skipped ${skipped}` : ""}${
          hasSelection ? "" : " (page scan)"
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

