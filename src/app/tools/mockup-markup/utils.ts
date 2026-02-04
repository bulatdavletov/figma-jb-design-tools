/**
 * Shared utilities for Mockup Markup tool.
 */

/**
 * Recursively collects all TextNodes from a selection (including nested children).
 */
export function collectTextNodesFromSelection(selection: readonly SceneNode[]): TextNode[] {
  const result: TextNode[] = []
  const seen = new Set<string>()

  function walk(node: SceneNode): void {
    if (node.type === "TEXT" && !seen.has(node.id)) {
      seen.add(node.id)
      result.push(node)
    }
    if ("children" in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child)
      }
    }
  }

  for (const root of selection) {
    walk(root)
  }

  return result
}

/**
 * Result of an operation that can succeed or fail with a reason.
 */
export type OperationResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; reason: string }

/**
 * Safely loads a font, returning a result indicating success or failure.
 */
export async function loadFont(fontName: FontName): Promise<OperationResult> {
  try {
    await figma.loadFontAsync(fontName)
    return { ok: true, value: undefined }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) }
  }
}

/**
 * Logs a debug message with consistent prefix.
 */
export function logDebug(context: string, message: string, data?: Record<string, unknown>): void {
  const prefix = `[Mockup Markup] ${context}:`
  if (data) {
    // eslint-disable-next-line no-console
    console.log(prefix, message, data)
  } else {
    // eslint-disable-next-line no-console
    console.log(prefix, message)
  }
}

/**
 * Logs a warning with consistent prefix.
 */
export function logWarn(context: string, message: string, data?: Record<string, unknown>): void {
  const prefix = `[Mockup Markup] ${context}:`
  if (data) {
    // eslint-disable-next-line no-console
    console.warn(prefix, message, data)
  } else {
    // eslint-disable-next-line no-console
    console.warn(prefix, message)
  }
}
