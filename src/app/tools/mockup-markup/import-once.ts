import { resolveColorVariableForPreset } from "./resolve"

const IMPORT_ONCE_KEY = "mockup-markup.imported-v1"

export async function importMockupMarkupVariablesOnce(): Promise<void> {
  try {
    const already = await figma.clientStorage.getAsync(IMPORT_ONCE_KEY)
    if (already === true) return
  } catch {
    // ignore
  }

  // Best-effort import. `resolveColorVariableForPreset` will:
  // - return by ID if already imported
  // - otherwise search enabled libraries by name and import by key
  await Promise.all([
    resolveColorVariableForPreset("text"),
    resolveColorVariableForPreset("text-secondary"),
    resolveColorVariableForPreset("purple"),
  ])

  try {
    await figma.clientStorage.setAsync(IMPORT_ONCE_KEY, true)
  } catch {
    // ignore
  }
}

