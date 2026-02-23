import type { FindScope, MatchMode, SelectableNodeType } from "../types"

export async function findByType(params: Record<string, unknown>): Promise<string> {
  const nodeType = String(params.nodeType ?? "TEXT")
  const scope = (params.scope ?? "selection") as FindScope

  const roots = getRootsForScope(scope)
  if (roots.length === 0) {
    return scope === "selection" ? "No selection to search in" : "No nodes found"
  }

  const allNodes: SceneNode[] = []
  for (const node of roots) {
    collectAllDescendants(node, allNodes)
  }

  const filtered = allNodes.filter((n) => n.type === nodeType)
  figma.currentPage.selection = filtered
  const scopeLabel = scope === "selection" ? "in selection" : scope === "page" ? "on page" : "in all pages"
  return `Found ${filtered.length} ${nodeType} node(s) ${scopeLabel}`
}

export async function selectByName(params: Record<string, unknown>): Promise<string> {
  const pattern = String(params.pattern ?? "")
  const matchMode = (params.matchMode ?? "contains") as MatchMode
  if (!pattern) return "No pattern specified"

  const selection = figma.currentPage.selection
  if (selection.length === 0) return "No selection to filter"

  const allNodes: SceneNode[] = []
  for (const node of selection) {
    collectAllDescendants(node, allNodes)
  }

  const filtered = allNodes.filter((n) => matchesName(n.name, pattern, matchMode))
  figma.currentPage.selection = filtered
  return `Selected ${filtered.length} node(s) matching "${pattern}"`
}

export async function expandToChildren(_params: Record<string, unknown>): Promise<string> {
  const selection = figma.currentPage.selection
  if (selection.length === 0) return "No selection to expand"

  const children: SceneNode[] = []
  for (const node of selection) {
    if ("children" in node) {
      for (const child of (node as ChildrenMixin).children) {
        children.push(child as SceneNode)
      }
    }
  }

  figma.currentPage.selection = children
  return `Expanded to ${children.length} children`
}

function getRootsForScope(scope: FindScope): readonly SceneNode[] {
  switch (scope) {
    case "selection":
      return figma.currentPage.selection
    case "page":
      return figma.currentPage.children
    case "all_pages":
      return figma.root.children.flatMap((page) => [...page.children])
  }
}

function collectAllDescendants(node: SceneNode, out: SceneNode[]): void {
  out.push(node)
  if ("children" in node) {
    for (const child of (node as ChildrenMixin).children) {
      collectAllDescendants(child as SceneNode, out)
    }
  }
}

function matchesName(name: string, pattern: string, mode: MatchMode): boolean {
  switch (mode) {
    case "contains":
      return name.toLowerCase().includes(pattern.toLowerCase())
    case "startsWith":
      return name.toLowerCase().startsWith(pattern.toLowerCase())
    case "regex":
      try {
        return new RegExp(pattern, "i").test(name)
      } catch {
        return false
      }
    default:
      return false
  }
}

export const SELECTABLE_NODE_TYPES: SelectableNodeType[] = [
  "TEXT",
  "FRAME",
  "GROUP",
  "COMPONENT",
  "COMPONENT_SET",
  "INSTANCE",
  "RECTANGLE",
  "ELLIPSE",
  "LINE",
  "POLYGON",
  "STAR",
  "VECTOR",
  "BOOLEAN_OPERATION",
  "SECTION",
]
