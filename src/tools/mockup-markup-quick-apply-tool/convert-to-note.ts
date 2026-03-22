/**
 * Convert to Markup Note — headless entry point for the Figma submenu.
 *
 * Replaces each selected text layer with a Markup Note component instance
 * whose text content matches the original layer.
 */

import {
  MARKUP_NOTE_COMPONENT_KEY,
  MARKUP_NOTE_COMPONENT_ID,
  MARKUP_NOTE_TEXT_CHILD_NAME,
} from "../../utils/mockup-markup-library/constants"
import { logDebug, logWarn, loadFont } from "./utils"
import { plural } from "../../utils/pluralize"

/**
 * Resolves the Markup Note master component.
 *
 * 1) Import by key — most reliable, works across files.
 * 2) Local node lookup — fallback if key import fails.
 */
async function resolveNoteComponent(): Promise<ComponentNode | null> {
  // 1) Import by key — most reliable, survives renames
  try {
    return await figma.importComponentByKeyAsync(MARKUP_NOTE_COMPONENT_KEY)
  } catch {
    // ignore
  }

  // 2) Local node lookup (works if library component is already referenced in file)
  try {
    const local = await figma.getNodeByIdAsync(MARKUP_NOTE_COMPONENT_ID)
    if (local?.type === "COMPONENT") return local as ComponentNode
  } catch {
    // ignore
  }

  return null
}

/**
 * Replaces selected text layers with Markup Note component instances.
 */
async function run(): Promise<void> {
  const selection = figma.currentPage.selection
  if (selection.length === 0) {
    figma.notify("Select a text layer first")
    return
  }

  // Collect only directly-selected text nodes (not nested children)
  const textNodes = selection.filter((n): n is TextNode => n.type === "TEXT")
  if (textNodes.length === 0) {
    figma.notify("No text layers selected")
    return
  }

  logDebug("convertToNote", `Converting ${textNodes.length} text node(s)`)

  // Resolve master component
  const masterComponent = await resolveNoteComponent()
  if (!masterComponent) {
    figma.notify(
      "Markup Note component not found. Make sure the Mockup markup library is enabled for this file."
    )
    return
  }

  const created: InstanceNode[] = []

  for (const textNode of textNodes) {
    try {
      const characters = textNode.characters
      const parent = textNode.parent
      const x = textNode.x
      const y = textNode.y

      // Determine insertion index in parent
      let insertIndex = -1
      if (parent && "children" in parent) {
        insertIndex = (parent as ChildrenMixin).children.indexOf(textNode)
      }

      // Create instance
      const instance = masterComponent.createInstance()

      // Place in the same parent at the same index
      if (parent && "insertChild" in parent && insertIndex >= 0) {
        ;(parent as ChildrenMixin).insertChild(insertIndex, instance)
      }

      instance.x = x
      instance.y = y

      // Find the Text child inside the instance and set its content
      const textChild = instance.findOne(
        (n) => n.type === "TEXT" && n.name === MARKUP_NOTE_TEXT_CHILD_NAME
      ) as TextNode | null

      if (textChild) {
        try {
          const font = textChild.fontName as FontName
          if (font && typeof font === "object" && font.family) {
            const loadResult = await loadFont(font)
            if (loadResult.ok) {
              textChild.characters = characters
            } else {
              logWarn("convertToNote", "Could not load font for note text", {
                reason: loadResult.reason,
              })
            }
          }
        } catch (e) {
          logWarn("convertToNote", "Error setting note text", {
            error: e instanceof Error ? e.message : String(e),
          })
        }
      } else {
        logWarn("convertToNote", "Text child not found in Markup Note instance")
      }

      // Remove original text node
      textNode.remove()
      created.push(instance)

      logDebug("convertToNote", `Converted text node at (${x}, ${y})`)
    } catch (e) {
      logWarn("convertToNote", "Failed to convert text node", {
        id: textNode.id,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  if (created.length > 0) {
    figma.currentPage.selection = created
    try {
      figma.viewport.scrollAndZoomIntoView([created[0]])
    } catch {
      // Viewport operations can fail in certain contexts
    }
    figma.notify(`Converted ${plural(created.length, "text layer")} to Markup Note`)
  } else {
    figma.notify("Could not convert any text layers")
  }
}

export function convertToNote() {
  run().finally(() => {
    figma.closePlugin()
  })
}
