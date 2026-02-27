import type {
  ActiveTool,
  UiToMainMessage,
  LinkedColorsSelectionPayload,
  LinkedColorsVariableUsage,
  LinkedColorsVariableMatch,
  LinkedColorsColorUsage,
} from "../../home/messages"
import { MAIN_TO_UI, UI_TO_MAIN } from "../../home/messages"
import {
  getVariable,
  getCollection,
  getLocalVariablesForType,
  updateVariableInCache,
  clearLocalVariablesCache,
} from "../../utils/variables-shared/caching"
import {
  hasChildren,
  isNodeVisible,
  hasBoundVariables,
  hasFills,
  hasStrokes,
  readBindings,
  solidPaintToHex,
  getVariableNameSuffix,
  getVariableGroupName,
  collectSolidColors,
  hasFillStyleId,
  hasStrokeStyleId,
  getPaintStyle,
  collectStyleAliases,
} from "../../utils/variables-shared/node-utils"

export function registerVariablesCreateLinkedColorsTool(getActiveTool: () => ActiveTool) {
  const getSelectionWithDescendants = (selection: readonly SceneNode[]): SceneNode[] => {
    const stack = [...selection]
    const result: SceneNode[] = []

    while (stack.length) {
      const node = stack.pop()
      if (!node) continue
      if (!isNodeVisible(node)) continue
      result.push(node)

      if (hasChildren(node)) {
        stack.push(...node.children)
      }
    }

    return result
  }

  const addVariableUsage = async (
    variableId: string,
    property: string,
    node: SceneNode,
    variableMap: Map<string, LinkedColorsVariableUsage>
  ) => {
    const variable = await getVariable(variableId)
    if (!variable) return

    let usage = variableMap.get(variable.id)
    if (!usage) {
      const collection = await getCollection(variable.variableCollectionId)
      usage = {
        id: variable.id,
        name: variable.name,
        collectionId: variable.variableCollectionId,
        collectionName: collection?.name ?? "Unknown collection",
        resolvedType: variable.resolvedType,
        properties: [],
        nodes: [],
        defaultName: variable.name,
        matches: [],
        options: [],
        groups: [],
      }
      variableMap.set(variable.id, usage)
    }

    if (!usage.properties.includes(property)) {
      usage.properties.push(property)
    }

    if (!usage.nodes.some((entry) => entry.id === node.id)) {
      usage.nodes.push({ id: node.id, name: node.name || node.type })
    }
  }

  const collectStyleVariableBindings = async (
    node: SceneNode,
    variableMap: Map<string, LinkedColorsVariableUsage>
  ) => {
    const promises: Promise<void>[] = []

    if (hasFillStyleId(node)) {
      const styleId = node.fillStyleId
      if (typeof styleId === "string" && styleId.length) {
        promises.push(
          (async () => {
            const style = await getPaintStyle(styleId)
            if (!style) return
            const aliases = collectStyleAliases(style)
            for (const alias of aliases) {
              await addVariableUsage(alias, `fills (style ${style.name})`, node, variableMap)
            }
          })()
        )
      }
    }

    if (hasStrokeStyleId(node)) {
      const styleId = node.strokeStyleId
      if (typeof styleId === "string" && styleId.length) {
        promises.push(
          (async () => {
            const style = await getPaintStyle(styleId)
            if (!style) return
            const aliases = collectStyleAliases(style)
            for (const alias of aliases) {
              await addVariableUsage(alias, `strokes (style ${style.name})`, node, variableMap)
            }
          })()
        )
      }
    }

    if (promises.length) {
      await Promise.all(promises)
    }
  }

  const attachMatchesToVariables = async (
    variableMap: Map<string, LinkedColorsVariableUsage>
  ) => {
    const usages = Array.from(variableMap.values())

    await Promise.all(
      usages.map(async (usage) => {
        const variable = await getVariable(usage.id)
        if (!variable) {
          usage.matches = []
          return
        }

        const suffix = getVariableNameSuffix(variable.name)
        usage.defaultName = variable.name

        const candidates = await getLocalVariablesForType(variable.resolvedType)

        const candidateSummaries: LinkedColorsVariableMatch[] = []
        for (const candidate of candidates) {
          if (candidate.id === variable.id) continue
          const collection = await getCollection(candidate.variableCollectionId)
          candidateSummaries.push({
            id: candidate.id,
            name: candidate.name,
            collectionId: candidate.variableCollectionId,
            collectionName: collection?.name ?? "Unknown collection",
          })
        }

        candidateSummaries.sort((a, b) => a.name.localeCompare(b.name))
        usage.options = candidateSummaries

        const groupSet = new Set<string>()
        for (const option of candidateSummaries) {
          groupSet.add(getVariableGroupName(option.name))
        }
        usage.groups = Array.from(groupSet).sort((a, b) => a.localeCompare(b))

        if (!suffix) {
          usage.matches = []
          return
        }

        const suffixLower = suffix.toLowerCase()
        const matches = candidateSummaries.filter((candidate) =>
          candidate.name.toLowerCase().includes(suffixLower)
        )
        usage.matches = matches.sort((a, b) => a.name.localeCompare(b.name))
      })
    )
  }

  const getVariablesFromSelection = async (): Promise<LinkedColorsSelectionPayload> => {
    const selection = figma.currentPage.selection
    const nodesToInspect = getSelectionWithDescendants(selection)
    const variableMap = new Map<string, LinkedColorsVariableUsage>()
    const colorMap = new Map<string, LinkedColorsColorUsage>()

    for (const node of nodesToInspect) {
      if (hasBoundVariables(node)) {
        const bindings = readBindings(node.boundVariables)

        for (const binding of bindings) {
          await addVariableUsage(binding.variableId, binding.property, node, variableMap)
        }
      }
      await collectStyleVariableBindings(node, variableMap)

      const solidColors = collectSolidColors(node)
      for (const colorEntry of solidColors) {
        let usage = colorMap.get(colorEntry.hex)
        if (!usage) {
          usage = {
            hex: colorEntry.hex,
            properties: [],
            nodes: [],
          }
          colorMap.set(colorEntry.hex, usage)
        }

        if (!usage.properties.includes(colorEntry.property)) {
          usage.properties.push(colorEntry.property)
        }

        if (!usage.nodes.some((entry) => entry.id === node.id)) {
          usage.nodes.push({ id: node.id, name: node.name || node.type })
        }
      }
    }

    await attachMatchesToVariables(variableMap)

    const variables = Array.from(variableMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    const colors = Array.from(colorMap.values()).sort((a, b) => a.hex.localeCompare(b.hex))

    return { variables, selectionSize: selection.length, colors }
  }

  const sendSelectionInfo = async () => {
    const payload = await getVariablesFromSelection()
    figma.ui.postMessage({
      type: MAIN_TO_UI.LINKED_COLORS_SELECTION,
      payload,
    })
  }

  const sendCollectionsList = async () => {
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    const collectionsInfo = await Promise.all(
      collections.map(async (c) => {
        const collection = await figma.variables.getVariableCollectionByIdAsync(c.id)
        return {
          id: c.id,
          name: c.name,
          modeCount: c.modes.length,
          variableCount: collection?.variableIds.length ?? 0,
        }
      })
    )
    figma.ui.postMessage({
      type: MAIN_TO_UI.LINKED_COLORS_COLLECTIONS_LIST,
      collections: collectionsInfo,
    })
  }

  const rebindSelectionToVariable = (sourceVariableId: string, targetVariable: Variable) => {
    const selection = figma.currentPage.selection
    const nodes = getSelectionWithDescendants(selection)

    for (const node of nodes) {
      if (!hasBoundVariables(node) || !node.boundVariables) continue

      for (const [property, binding] of Object.entries(node.boundVariables)) {
        if (!binding) continue

        if (property === "fills" && Array.isArray(binding)) {
          if (hasFills(node)) {
            const paints = node.fills
            if (paints && paints !== figma.mixed) {
              const updated = paints.map((paint, index) => {
                const alias = binding[index]
                if (!alias?.id || alias.id !== sourceVariableId || paint.type !== "SOLID") {
                  return paint
                }
                return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable)
              })
              const changed = updated.some((p, i) => p !== paints[i])
              if (changed) {
                node.fills = updated
              }
            }
          }
          continue
        }

        if (property === "strokes" && Array.isArray(binding)) {
          if (hasStrokes(node)) {
            const paints = node.strokes
            if (paints) {
              const updated = paints.map((paint, index) => {
                const alias = binding[index]
                if (!alias?.id || alias.id !== sourceVariableId || paint.type !== "SOLID") {
                  return paint
                }
                return figma.variables.setBoundVariableForPaint(paint, "color", targetVariable)
              })
              const changed = updated.some((p, i) => p !== paints[i])
              if (changed) {
                node.strokes = updated
              }
            }
          }
          continue
        }

        if (!Array.isArray(binding) && binding.id === sourceVariableId) {
          try {
            const target = node as SceneNode & {
              setBoundVariable: (field: string, variable: Variable) => void
            }
            target.setBoundVariable(property, targetVariable)
          } catch {
            // ignore unsupported bindings
          }
        }
      }
    }
  }

  const createLinkedVariable = async (
    sourceVariableId: string,
    requestedName: string
  ): Promise<{ variableName: string; collectionName: string }> => {
    const trimmedName = requestedName.trim()
    if (!trimmedName) {
      throw new Error("Provide a name for the new variable.")
    }

    const sourceVariable = await getVariable(sourceVariableId)
    if (!sourceVariable) {
      throw new Error("Source variable no longer exists.")
    }

    const collection = await getCollection(sourceVariable.variableCollectionId)
    if (!collection) {
      throw new Error("Collection missing for the selected variable.")
    }

    const newVariable = figma.variables.createVariable(
      trimmedName,
      collection,
      sourceVariable.resolvedType
    )
    updateVariableInCache(newVariable)

    for (const mode of collection.modes) {
      newVariable.setValueForMode(mode.modeId, {
        type: "VARIABLE_ALIAS",
        id: sourceVariable.id,
      })
    }

    rebindSelectionToVariable(sourceVariable.id, newVariable)

    return { variableName: newVariable.name, collectionName: collection.name }
  }

  const applyExistingVariable = async (
    sourceVariableId: string,
    targetVariableId: string
  ): Promise<{ variableName: string; collectionName: string }> => {
    const targetVariable = await getVariable(targetVariableId)
    if (!targetVariable) {
      throw new Error("Selected variable no longer exists.")
    }
    rebindSelectionToVariable(sourceVariableId, targetVariable)
    const collection = await getCollection(targetVariable.variableCollectionId)
    return {
      variableName: targetVariable.name,
      collectionName: collection?.name ?? "Unknown collection",
    }
  }

  const renameVariable = async (
    variableId: string,
    requestedName: string
  ): Promise<{ variableName: string; collectionName: string }> => {
    const trimmedName = requestedName.trim()
    if (!trimmedName) {
      throw new Error("Provide a name to rename the variable.")
    }

    const variable = await getVariable(variableId)
    if (!variable) {
      throw new Error("Selected variable no longer exists.")
    }

    if (variable.name !== trimmedName) {
      variable.name = trimmedName
      updateVariableInCache(variable)
      clearLocalVariablesCache(variable.resolvedType)
    }

    const collection = await getCollection(variable.variableCollectionId)
    return { variableName: variable.name, collectionName: collection?.name ?? "Unknown collection" }
  }

  // Listen for selection changes
  figma.on("selectionchange", () => {
    if (getActiveTool() === "variables-create-linked-colors-tool") {
      sendSelectionInfo()
    }
  })

  return {
    async onActivate() {
      await sendSelectionInfo()
      await sendCollectionsList()
    },

    async onMessage(msg: UiToMainMessage): Promise<boolean> {
      if (getActiveTool() !== "variables-create-linked-colors-tool") return false

      if (msg.type === UI_TO_MAIN.LINKED_COLORS_CREATE) {
        try {
          const { variableId, targetVariableId } = msg.request
          const result = await createLinkedVariable(variableId, targetVariableId)
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_CREATE_SUCCESS,
            result: {
              success: true,
              message: `Created variable "${result.variableName}"`,
            },
          })
          figma.notify(`Created variable "${result.variableName}"`)
          await sendSelectionInfo()
        } catch (e) {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_CREATE_SUCCESS,
            result: {
              success: false,
              message: e instanceof Error ? e.message : String(e),
            },
          })
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.LINKED_COLORS_APPLY_EXISTING) {
        try {
          const { variableId, targetVariableId } = msg.request
          const result = await applyExistingVariable(variableId, targetVariableId)
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_APPLY_SUCCESS,
            result: {
              success: true,
              message: `Applied "${result.variableName}"`,
            },
          })
          figma.notify(`Applied variable "${result.variableName}"`)
          await sendSelectionInfo()
        } catch (e) {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_APPLY_SUCCESS,
            result: {
              success: false,
              message: e instanceof Error ? e.message : String(e),
            },
          })
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.LINKED_COLORS_RENAME) {
        try {
          const { variableId, newName } = msg.request
          const result = await renameVariable(variableId, newName)
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_RENAME_SUCCESS,
            result: {
              success: true,
              message: `Renamed to "${result.variableName}"`,
              newName: result.variableName,
            },
          })
          figma.notify(`Renamed variable to "${result.variableName}"`)
          await sendSelectionInfo()
        } catch (e) {
          figma.ui.postMessage({
            type: MAIN_TO_UI.LINKED_COLORS_RENAME_SUCCESS,
            result: {
              success: false,
              message: e instanceof Error ? e.message : String(e),
            },
          })
        }
        return true
      }

      return false
    },
  }
}
