/**
 * Color preview resolution for Mockup Markup tool.
 * Resolves actual colors from variables for UI display.
 */

import type { MockupMarkupColorPreview, MockupMarkupColorPreviews } from "../../home/messages"
import { resolveColorVariableForPreset } from "./resolve"
import { logDebug } from "./utils"

/**
 * Clamps a number to the 0-1 range.
 */
function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

/**
 * Converts a 0-1 value to a 2-digit hex byte.
 */
function toHexByte(n01: number): string {
  const v = Math.round(clamp01(n01) * 255)
  return v.toString(16).padStart(2, "0").toUpperCase()
}

/**
 * Converts RGB values (0-1 range) to a hex color string.
 */
function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  return `#${toHexByte(rgb.r)}${toHexByte(rgb.g)}${toHexByte(rgb.b)}`
}

/**
 * Gets the mode ID for a variable, preferring the specified mode name.
 */
async function getModeIdForVariable(
  variableId: string,
  preferredModeName: "dark" | "light"
): Promise<string | null> {
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId)
    if (!variable) return null

    const collectionId = (variable as any).variableCollectionId as string | undefined
    if (!collectionId) return null

    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    if (!collection) return null

    const modes = (collection.modes ?? []) as Array<{ modeId: string; name: string }>

    // Try to find the preferred mode
    const preferredMode = modes.find(
      (m) => (m.name ?? "").trim().toLowerCase() === preferredModeName
    )
    if (preferredMode?.modeId) {
      return preferredMode.modeId
    }

    // Check if there's an explicit mode set on the page
    const explicitModes = (figma.currentPage as any).explicitVariableModes as
      | Record<string, string>
      | undefined
    if (explicitModes?.[collectionId]) {
      return explicitModes[collectionId]
    }

    // Fall back to default mode
    const defaultModeId = (collection as any).defaultModeId as string | undefined
    if (defaultModeId) return defaultModeId

    // Fall back to first mode
    return modes[0]?.modeId ?? null
  } catch {
    return null
  }
}

/**
 * Resolves a color variable to its actual RGB value, following alias chains.
 */
async function resolveVariableColor(
  variableId: string,
  modeName: "dark" | "light"
): Promise<MockupMarkupColorPreview> {
  const seen = new Set<string>()
  let currentId: string | null = variableId

  // Follow alias chain (max 10 steps to prevent infinite loops)
  for (let step = 0; step < 10; step++) {
    if (!currentId || seen.has(currentId)) break
    seen.add(currentId)

    try {
      const variable = await figma.variables.getVariableByIdAsync(currentId)
      if (!variable) break

      const modeId = await getModeIdForVariable(currentId, modeName)
      if (!modeId) break

      const valuesByMode = (variable as any).valuesByMode as Record<string, any> | undefined
      const value = valuesByMode?.[modeId]

      // If it's an alias, follow it
      if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
        currentId = value.id ?? null
        continue
      }

      // If it's an RGB value, return it
      if (value && typeof value === "object" && "r" in value && "g" in value && "b" in value) {
        const hex = rgbToHex({ r: value.r, g: value.g, b: value.b })
        const opacity = typeof value.a === "number" ? clamp01(value.a) : 1
        const opacityPercent = Math.round(opacity * 100)

        logDebug("colorPreviews", `Resolved color`, { variableId, hex, opacityPercent })
        return { hex, opacityPercent }
      }
    } catch {
      break
    }
  }

  logDebug("colorPreviews", `Could not resolve color`, { variableId })
  return { hex: null, opacityPercent: null }
}

/**
 * Gets color previews for all presets.
 */
export async function getMockupMarkupColorPreviews(
  forceModeName: "dark" | "light"
): Promise<MockupMarkupColorPreviews> {
  // Resolve all variable IDs in parallel
  const [textId, textSecondaryId, purpleId] = await Promise.all([
    resolveColorVariableForPreset("text"),
    resolveColorVariableForPreset("text-secondary"),
    resolveColorVariableForPreset("purple"),
  ])

  // Resolve all colors in parallel
  const [text, textSecondary, purple] = await Promise.all([
    textId ? resolveVariableColor(textId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null }),
    textSecondaryId
      ? resolveVariableColor(textSecondaryId, forceModeName)
      : Promise.resolve({ hex: null, opacityPercent: null }),
    purpleId
      ? resolveVariableColor(purpleId, forceModeName)
      : Promise.resolve({ hex: null, opacityPercent: null }),
  ])

  return { text, textSecondary, purple }
}
