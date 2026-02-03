import type { MockupMarkupColorPreview, MockupMarkupColorPreviews } from "../../messages"
import { resolveColorVariableForPreset } from "./resolve"

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

function toHexByte(n01: number): string {
  const v = Math.round(clamp01(n01) * 255)
  return v.toString(16).padStart(2, "0").toUpperCase()
}

function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  return `#${toHexByte(rgb.r)}${toHexByte(rgb.g)}${toHexByte(rgb.b)}`
}

async function resolveModeIdForVariable(variableId: string, forceModeName: "none" | "dark"): Promise<string | null> {
  try {
    const variable = await figma.variables.getVariableByIdAsync(variableId)
    const collectionId = (variable as any)?.variableCollectionId as string | undefined
    if (!collectionId) return null

    const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId)
    if (!collection) return null

    if (forceModeName === "dark") {
      const match = (collection.modes ?? []).find((m) => (m.name ?? "").trim().toLowerCase() === "dark")
      if (match?.modeId) return match.modeId
    }

    // If the page has an explicit mode, use it; otherwise default.
    const explicit = (figma.currentPage as any).explicitVariableModes?.[collectionId]
    if (typeof explicit === "string" && explicit) return explicit

    const defaultModeId = (collection as any).defaultModeId as string | undefined
    if (defaultModeId) return defaultModeId

    return (collection.modes ?? [])[0]?.modeId ?? null
  } catch {
    return null
  }
}

async function resolveColorPreviewFromVariableId(
  variableId: string,
  forceModeName: "none" | "dark"
): Promise<MockupMarkupColorPreview> {
  const seen = new Set<string>()
  let currentId: string | null = variableId

  for (let steps = 0; steps < 10; steps++) {
    if (!currentId) break
    if (seen.has(currentId)) break
    seen.add(currentId)

    try {
      const variable = await figma.variables.getVariableByIdAsync(currentId)
      if (!variable) break
      const modeId = await resolveModeIdForVariable(currentId, forceModeName)
      const valuesByMode = (variable as any).valuesByMode as Record<string, any> | undefined
      const value = modeId && valuesByMode ? valuesByMode[modeId] : undefined

      if (value && typeof value === "object" && "type" in value && (value as any).type === "VARIABLE_ALIAS") {
        currentId = (value as any).id ?? null
        continue
      }

      if (value && typeof value === "object" && "r" in value && "g" in value && "b" in value) {
        const rgb = value as any
        const hex = rgbToHex({ r: rgb.r, g: rgb.g, b: rgb.b })
        const a = typeof rgb.a === "number" ? clamp01(rgb.a) : 1
        const opacityPercent = Math.round(a * 100)
        return { hex, opacityPercent }
      }
    } catch {
      break
    }
  }

  return { hex: null, opacityPercent: null }
}

export async function getMockupMarkupColorPreviews(forceModeName: "none" | "dark"): Promise<MockupMarkupColorPreviews> {
  const textId = await resolveColorVariableForPreset("text")
  const textSecondaryId = await resolveColorVariableForPreset("text-secondary")
  const purpleId = await resolveColorVariableForPreset("purple")

  const [text, textSecondary, purple] = await Promise.all([
    textId ? resolveColorPreviewFromVariableId(textId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null }),
    textSecondaryId
      ? resolveColorPreviewFromVariableId(textSecondaryId, forceModeName)
      : Promise.resolve({ hex: null, opacityPercent: null }),
    purpleId ? resolveColorPreviewFromVariableId(purpleId, forceModeName) : Promise.resolve({ hex: null, opacityPercent: null }),
  ])

  return { text, textSecondary, purple }
}

