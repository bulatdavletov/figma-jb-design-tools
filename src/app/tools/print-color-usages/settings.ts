import type { PrintColorUsagesUiSettings } from "../../messages"

export const PRINT_COLOR_USAGES_SETTINGS_KEY = "print-color-usages.ui-settings"

export const DEFAULT_PRINT_COLOR_USAGES_SETTINGS: PrintColorUsagesUiSettings = {
  textPosition: "right",
  showLinkedColors: true,
  showFolderNames: true,
  textTheme: "dark",
  checkByContent: false,
  checkNested: true,
  printDistance: 16,
  applyTextColor: true,
  applyTextStyle: true,
}

export async function loadPrintColorUsagesSettings(): Promise<PrintColorUsagesUiSettings> {
  try {
    const saved = (await figma.clientStorage.getAsync(
      PRINT_COLOR_USAGES_SETTINGS_KEY
    )) as Partial<PrintColorUsagesUiSettings> | undefined
    return {
      textPosition: saved?.textPosition === "left" || saved?.textPosition === "right" ? saved.textPosition : "right",
      showLinkedColors: typeof saved?.showLinkedColors === "boolean" ? saved.showLinkedColors : true,
      showFolderNames: typeof saved?.showFolderNames === "boolean" ? saved.showFolderNames : true,
      textTheme: saved?.textTheme === "dark" || saved?.textTheme === "light" ? saved.textTheme : "dark",
      checkByContent: typeof saved?.checkByContent === "boolean" ? saved.checkByContent : false,
      checkNested: typeof saved?.checkNested === "boolean" ? saved.checkNested : true,
      printDistance: typeof saved?.printDistance === "number" && saved.printDistance >= 0 ? saved.printDistance : 16,
      applyTextColor: typeof saved?.applyTextColor === "boolean" ? saved.applyTextColor : true,
      applyTextStyle: typeof saved?.applyTextStyle === "boolean" ? saved.applyTextStyle : true,
    }
  } catch {
    return DEFAULT_PRINT_COLOR_USAGES_SETTINGS
  }
}

export async function savePrintColorUsagesSettings(settings: PrintColorUsagesUiSettings): Promise<void> {
  try {
    await figma.clientStorage.setAsync(PRINT_COLOR_USAGES_SETTINGS_KEY, settings)
  } catch {
    // ignore
  }
}

