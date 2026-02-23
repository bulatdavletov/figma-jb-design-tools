import type { AutomationContext, ActionHandler } from "../context"
import type { FindScope, MatchMode, SelectableNodeType } from "../types"

export const filterByType: ActionHandler = async (context, params) => {
  const nodeType = String(params.nodeType ?? "TEXT")
  const scope = (params.scope ?? undefined) as FindScope | undefined

  let sourceNodes: SceneNode[]

  if (scope === "page") {
    sourceNodes = collectAllFromPage()
  } else if (scope === "all_pages") {
    sourceNodes = collectAllFromAllPages()
  } else {
    sourceNodes = flattenNodes(context.nodes)
  }

  const before = sourceNodes.length
  const filtered = sourceNodes.filter((n) => n.type === nodeType)
  context.nodes = filtered

  const scopeLabel =
    scope === "page" ? "on page" : scope === "all_pages" ? "in all pages" : "in working set"

  context.log.push({
    stepIndex: -1,
    stepName: "Filter by type",
    message: `Kept ${filtered.length} of ${before} ${nodeType} node(s) ${scopeLabel}`,
    itemsIn: before,
    itemsOut: filtered.length,
    status: "success",
  })

  return context
}

export const filterByName: ActionHandler = async (context, params) => {
  const pattern = String(params.pattern ?? "")
  const matchMode = (params.matchMode ?? "contains") as MatchMode
  if (!pattern) {
    context.log.push({
      stepIndex: -1,
      stepName: "Filter by name",
      message: "No pattern specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const sourceNodes = flattenNodes(context.nodes)
  const before = sourceNodes.length
  const filtered = sourceNodes.filter((n) => matchesName(n.name, pattern, matchMode))
  context.nodes = filtered

  context.log.push({
    stepIndex: -1,
    stepName: "Filter by name",
    message: `Kept ${filtered.length} of ${before} node(s) matching "${pattern}"`,
    itemsIn: before,
    itemsOut: filtered.length,
    status: "success",
  })

  return context
}

export const expandToChildren: ActionHandler = async (context, _params) => {
  const before = context.nodes.length
  const children: SceneNode[] = []
  for (const node of context.nodes) {
    if ("children" in node) {
      for (const child of (node as ChildrenMixin).children) {
        children.push(child as SceneNode)
      }
    }
  }
  context.nodes = children

  context.log.push({
    stepIndex: -1,
    stepName: "Expand to children",
    message: `Expanded ${before} node(s) → ${children.length} children`,
    itemsIn: before,
    itemsOut: children.length,
    status: "success",
  })

  return context
}

export const goToParent: ActionHandler = async (context, _params) => {
  const before = context.nodes.length
  const seen = new Set<string>()
  const parents: SceneNode[] = []

  for (const node of context.nodes) {
    const parent = node.parent
    if (!parent || parent.type === "PAGE" || parent.type === "DOCUMENT") continue
    if (seen.has(parent.id)) continue
    seen.add(parent.id)
    parents.push(parent as SceneNode)
  }

  context.nodes = parents

  context.log.push({
    stepIndex: -1,
    stepName: "Go to parent",
    message: `Navigated to ${parents.length} parent(s) from ${before} node(s)`,
    itemsIn: before,
    itemsOut: parents.length,
    status: "success",
  })

  return context
}

export const flattenDescendants: ActionHandler = async (context, _params) => {
  const before = context.nodes.length
  const descendants: SceneNode[] = []

  for (const node of context.nodes) {
    collectAllDescendantsOnly(node, descendants)
  }

  context.nodes = descendants

  context.log.push({
    stepIndex: -1,
    stepName: "Flatten descendants",
    message: `Flattened to ${descendants.length} descendant(s) from ${before} node(s)`,
    itemsIn: before,
    itemsOut: descendants.length,
    status: "success",
  })

  return context
}

function collectAllDescendantsOnly(node: SceneNode, out: SceneNode[]): void {
  if ("children" in node) {
    for (const child of (node as ChildrenMixin).children) {
      out.push(child as SceneNode)
      collectAllDescendantsOnly(child as SceneNode, out)
    }
  }
}

function collectAllFromPage(): SceneNode[] {
  const out: SceneNode[] = []
  for (const child of figma.currentPage.children) {
    collectAllDescendants(child, out)
  }
  return out
}

function collectAllFromAllPages(): SceneNode[] {
  const out: SceneNode[] = []
  for (const page of figma.root.children) {
    for (const child of page.children) {
      collectAllDescendants(child as SceneNode, out)
    }
  }
  return out
}

function flattenNodes(nodes: SceneNode[]): SceneNode[] {
  const out: SceneNode[] = []
  for (const node of nodes) {
    collectAllDescendants(node, out)
  }
  return out
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
