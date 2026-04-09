import type { MockupMarkupUiSettings } from "../../home/messages"

export const MOCKUP_MARKUP_UI_SETTINGS_KEY = "mockup-markup.ui-settings"

export const DEFAULT_MOCKUP_MARKUP_UI_SETTINGS: MockupMarkupUiSettings = {
  applyPageVariableMode: false,
}

export async function loadMockupMarkupSettings(): Promise<MockupMarkupUiSettings> {
  try {
    const saved = (await figma.clientStorage.getAsync(MOCKUP_MARKUP_UI_SETTINGS_KEY)) as
      | Partial<MockupMarkupUiSettings>
      | undefined
    return {
      applyPageVariableMode:
        typeof saved?.applyPageVariableMode === "boolean"
          ? saved.applyPageVariableMode
          : DEFAULT_MOCKUP_MARKUP_UI_SETTINGS.applyPageVariableMode,
    }
  } catch {
    return DEFAULT_MOCKUP_MARKUP_UI_SETTINGS
  }
}

export async function saveMockupMarkupSettings(settings: MockupMarkupUiSettings): Promise<void> {
  try {
    await figma.clientStorage.setAsync(MOCKUP_MARKUP_UI_SETTINGS_KEY, settings)
  } catch {
    // ignore
  }
}
