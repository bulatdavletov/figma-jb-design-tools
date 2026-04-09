/**
 * Markup Presets — headless entry points for the Figma submenu.
 *
 * Each named export maps to a submenu item defined in sync-figma-menu.cjs.
 * The build system routes `figma.command` → the matching named export.
 */

import type { MockupMarkupApplyRequest } from "../../home/messages"
import { applyMockupMarkupToSelection } from "./apply"
import { loadMockupMarkupSettings } from "./settings"

type PresetConfig = Pick<MockupMarkupApplyRequest, "presetTypography" | "presetColor">

const PRESETS = {
  defaultText:   { presetTypography: "paragraph", presetColor: "text" },
  secondaryText: { presetTypography: "paragraph", presetColor: "text-secondary" },
  comment:       { presetTypography: "paragraph", presetColor: "purple" },
  h1:            { presetTypography: "h1",        presetColor: "text" },
  h2:            { presetTypography: "h2",        presetColor: "text" },
  h3:            { presetTypography: "h3",        presetColor: "text" },
} as const satisfies Record<string, PresetConfig>

async function runPreset(preset: PresetConfig) {
  try {
    const uiSettings = await loadMockupMarkupSettings()
    await applyMockupMarkupToSelection({
      presetTypography: preset.presetTypography,
      presetColor: preset.presetColor,
      forceModeName: "dark",
      applyPageVariableMode: uiSettings.applyPageVariableMode,
      width400: false,
    })
  } finally {
    figma.closePlugin()
  }
}

export function defaultText()   { runPreset(PRESETS.defaultText) }
export function secondaryText() { runPreset(PRESETS.secondaryText) }
export function comment()       { runPreset(PRESETS.comment) }
export function h1()            { runPreset(PRESETS.h1) }
export function h2()            { runPreset(PRESETS.h2) }
export function h3()            { runPreset(PRESETS.h3) }
