/**
 * Shared utilities for resolving component display names.
 *
 * Design principle: when a component belongs to a Component Set, always
 * show the Component Set name — never the individual variant string
 * (e.g. "Theme=Light, State=Active").
 */

/**
 * Get a human-readable display name for a ComponentNode.
 *
 * If the component belongs to a Component Set, returns the set's name
 * (e.g. "Button") instead of the variant string.
 */
export function getComponentDisplayName(comp: ComponentNode): string {
  try {
    if (comp.parent && comp.parent.type === "COMPONENT_SET") {
      return comp.parent.name
    }
  } catch {
    // parent may not be accessible for remote library components
  }
  return comp.name
}

/**
 * Strip variant info from a full component name string.
 *
 * Figma represents variant names as `"SetName :: Prop=Val, Prop=Val"`.
 * This returns just the set name portion.
 *
 * E.g. `"_Checkbox :: Theme=Light, State=Active"` → `"_Checkbox"`
 */
export function stripVariantInfo(fullName: string): string {
  const idx = fullName.indexOf(" :: ")
  return idx >= 0 ? fullName.substring(0, idx) : fullName
}
