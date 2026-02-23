import type { ActionHandler } from "../context"

export const sourceFromSelection: ActionHandler = async (context, _params) => {
  const nodes = [...figma.currentPage.selection]
  context.nodes = nodes

  context.log.push({
    stepIndex: -1,
    stepName: "Source: selection",
    message: `Loaded ${nodes.length} node(s) from current selection`,
    itemsIn: 0,
    itemsOut: nodes.length,
    status: "success",
  })

  return context
}

export const sourceFromPage: ActionHandler = async (context, _params) => {
  const out: SceneNode[] = []
  collectAll(figma.currentPage.children, out)
  context.nodes = out

  context.log.push({
    stepIndex: -1,
    stepName: "Source: current page",
    message: `Loaded ${out.length} node(s) from current page`,
    itemsIn: 0,
    itemsOut: out.length,
    status: "success",
  })

  return context
}

function collectAll(children: readonly SceneNode[], out: SceneNode[]): void {
  for (const child of children) {
    out.push(child)
    if ("children" in child) {
      collectAll((child as ChildrenMixin).children as readonly SceneNode[], out)
    }
  }
}
