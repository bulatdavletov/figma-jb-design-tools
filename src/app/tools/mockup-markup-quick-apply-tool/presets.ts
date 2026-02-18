import type { MockupMarkupColorPreset, MockupMarkupTypographyPreset } from "../../messages"
import {
  MARKUP_COLOR_VARIABLE_RAW_IDS,
  MARKUP_COLOR_VARIABLE_NAME_CANDIDATES,
  MARKUP_TEXT_STYLE_IDS,
} from "../mockup-markup-library/constants"

export { MARKUP_COLOR_VARIABLE_RAW_IDS, MARKUP_COLOR_VARIABLE_NAME_CANDIDATES, MARKUP_TEXT_STYLE_IDS }

const COLOR_PRESET_TO_KEY: Record<MockupMarkupColorPreset, keyof typeof MARKUP_COLOR_VARIABLE_RAW_IDS> = {
  text: "text",
  "text-secondary": "textSecondary",
  purple: "purple",
}

export const TEXT_STYLE_ID_BY_PRESET: Record<MockupMarkupTypographyPreset, string> = {
  h1: MARKUP_TEXT_STYLE_IDS.h1,
  h2: MARKUP_TEXT_STYLE_IDS.h2,
  h3: MARKUP_TEXT_STYLE_IDS.h3,
  description: MARKUP_TEXT_STYLE_IDS.description,
  paragraph: MARKUP_TEXT_STYLE_IDS.paragraph,
}

export const COLOR_VARIABLE_ID_RAW_BY_PRESET: Record<MockupMarkupColorPreset, string> = {
  text: MARKUP_COLOR_VARIABLE_RAW_IDS.text,
  "text-secondary": MARKUP_COLOR_VARIABLE_RAW_IDS.textSecondary,
  purple: MARKUP_COLOR_VARIABLE_RAW_IDS.purple,
}

export function getTypographyPresetLabel(preset: MockupMarkupTypographyPreset): string {
  switch (preset) {
    case "h1":
      return "H1"
    case "h2":
      return "H2"
    case "h3":
      return "H3"
    case "description":
      return "Description text"
    case "paragraph":
      return "Paragraph text"
  }
}

export function getColorPresetLabel(preset: MockupMarkupColorPreset): string {
  switch (preset) {
    case "text":
      return "Default"
    case "text-secondary":
      return "Secondary"
    case "purple":
      return "Purple"
  }
}

export function getColorVariableNameCandidates(preset: MockupMarkupColorPreset): string[] {
  const key = COLOR_PRESET_TO_KEY[preset]
  return [...MARKUP_COLOR_VARIABLE_NAME_CANDIDATES[key]]
}
