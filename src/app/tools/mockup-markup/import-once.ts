/**
 * One-time variable import for Mockup Markup tool.
 *
 * This module attempts to import the required color variables on first use,
 * tracking which variables were successfully imported to avoid redundant attempts.
 */

import type { MockupMarkupColorPreset } from "../../messages"
import { resolveColorVariableForPreset } from "./resolve"
import { logDebug, logWarn } from "./utils"

const STORAGE_KEY = "mockup-markup.import-status-v2"

type ImportStatus = {
  text: boolean
  "text-secondary": boolean
  purple: boolean
}

const ALL_PRESETS: MockupMarkupColorPreset[] = ["text", "text-secondary", "purple"]

/**
 * Gets the current import status from client storage.
 */
async function getImportStatus(): Promise<ImportStatus> {
  const defaults: ImportStatus = { text: false, "text-secondary": false, purple: false }
  try {
    const stored = await figma.clientStorage.getAsync(STORAGE_KEY)
    if (stored && typeof stored === "object") {
      return { ...defaults, ...stored }
    }
  } catch {
    // Ignore storage errors
  }
  return defaults
}

/**
 * Saves the import status to client storage.
 */
async function saveImportStatus(status: ImportStatus): Promise<void> {
  try {
    await figma.clientStorage.setAsync(STORAGE_KEY, status)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Attempts to import required Mockup Markup color variables.
 *
 * This function:
 * 1. Checks which variables have been successfully imported before
 * 2. Attempts to import any that haven't been imported yet
 * 3. Only marks a variable as "imported" if the import actually succeeded
 *
 * Returns an object indicating which presets are available.
 */
export async function importMockupMarkupVariablesOnce(): Promise<ImportStatus> {
  const status = await getImportStatus()
  const missing = ALL_PRESETS.filter((p) => !status[p])

  if (missing.length === 0) {
    logDebug("importOnce", "All variables already imported")
    return status
  }

  logDebug("importOnce", `Attempting to import missing variables`, { missing })

  const results = await Promise.all(
    missing.map(async (preset) => {
      const id = await resolveColorVariableForPreset(preset)
      return { preset, success: id !== null }
    })
  )

  let changed = false
  for (const { preset, success } of results) {
    if (success) {
      status[preset] = true
      changed = true
      logDebug("importOnce", `Successfully imported ${preset}`)
    } else {
      logWarn("importOnce", `Failed to import ${preset}`)
    }
  }

  if (changed) {
    await saveImportStatus(status)
  }

  return status
}

/**
 * Clears the import status, forcing re-import on next use.
 * Useful for debugging or when library access changes.
 */
export async function clearImportStatus(): Promise<void> {
  try {
    await figma.clientStorage.deleteAsync(STORAGE_KEY)
    logDebug("importOnce", "Cleared import status")
  } catch {
    // Ignore
  }
}
