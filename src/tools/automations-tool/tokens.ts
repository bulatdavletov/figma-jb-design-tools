import type { AutomationContext } from "./context"
import { getNodeProperty } from "./properties"

export interface TokenScope {
  node?: SceneNode
  index?: number
  context: AutomationContext
}

/**
 * Resolve `{token}` expressions in a template string.
 *
 * Context-level tokens (resolve once per step):
 *   {count}       — total items in working set
 *   {$var}        — pipeline variable (scalar or stringified array)
 *   {#snap.prop}  — property from first node of a saved node set
 *
 * Node-level tokens (require node in scope):
 *   {index}  — position in working set
 *   {name}, {type}, {width}, {opacity}, ... — node properties from the registry
 */
/** Property alias for $item.text (user-friendly name for text content). */
const ITEM_PROP_ALIASES: Record<string, string> = { text: "characters" }

export function resolveTokens(template: string, scope: TokenScope): string {
  return template.replace(/\{([^}]+)\}/g, (_match, token: string) => {
    if (token.startsWith("$")) {
      const rest = token.slice(1)
      const dotIndex = rest.indexOf(".")
      // {$item.text}: resolve property from repeat's current node (stored on context, not scope)
      if (dotIndex > 0) {
        const varName = rest.slice(0, dotIndex)
        if (varName === scope.context.repeatItemVar && scope.context.repeatItemNode) {
          const propKey = rest.slice(dotIndex + 1)
          const registryKey = ITEM_PROP_ALIASES[propKey] ?? propKey
          const value = getNodeProperty(scope.context.repeatItemNode, registryKey)
          return value != null ? String(value) : ""
        }
      }
      const varName = rest
      const value = scope.context.pipelineVars[varName]
      if (value === undefined) return ""
      if (Array.isArray(value)) return value.join(", ")
      return String(value)
    }

    if (token.startsWith("#")) {
      const dotIndex = token.indexOf(".")
      if (dotIndex === -1) return ""
      const snapName = token.slice(1, dotIndex)
      const propKey = token.slice(dotIndex + 1)
      const savedNodes = scope.context.savedNodeSets[snapName]
      if (!savedNodes || savedNodes.length === 0) return ""
      const value = getNodeProperty(savedNodes[0], propKey)
      return value !== null ? String(value) : ""
    }

    if (token === "count") {
      return String(scope.context.nodes.length)
    }

    if (scope.node) {
      if (token === "index") {
        return String(scope.index ?? 0)
      }
      const value = getNodeProperty(scope.node, token)
      if (value !== null) return String(value)
    }

    return ""
  })
}

/**
 * Resolve all string values in a params object (context-level only, no per-node).
 * Useful for actions that don't iterate nodes.
 */
export function resolveParamsContextLevel(
  params: Record<string, unknown>,
  context: AutomationContext,
): Record<string, unknown> {
  const scope: TokenScope = { context }
  const resolved: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(params)) {
    resolved[key] = typeof value === "string" ? resolveTokens(value, scope) : value
  }
  return resolved
}
