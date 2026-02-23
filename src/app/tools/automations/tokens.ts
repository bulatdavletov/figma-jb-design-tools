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
 *   {count}  — total items in working set
 *   {$var}   — pipeline variable
 *
 * Node-level tokens (require node in scope):
 *   {index}  — position in working set
 *   {name}, {type}, {width}, {opacity}, ... — node properties from the registry
 */
export function resolveTokens(template: string, scope: TokenScope): string {
  return template.replace(/\{([^}]+)\}/g, (_match, token: string) => {
    if (token.startsWith("$")) {
      const varName = token.slice(1)
      const value = scope.context.pipelineVars[varName]
      return value !== undefined ? String(value) : ""
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
