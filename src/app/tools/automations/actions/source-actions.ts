import type { ActionHandler } from "../context"
import { plural } from "../../../utils/pluralize"

export const sourceFromSelection: ActionHandler = async (context, _params) => {
  const nodes = [...figma.currentPage.selection]
  context.nodes = nodes

  context.log.push({
    stepIndex: -1,
    stepName: "Source: selection",
    message: `Loaded ${plural(nodes.length, "node")} from current selection`,
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
    message: `Loaded ${plural(out.length, "node")} from current page`,
    itemsIn: 0,
    itemsOut: out.length,
    status: "success",
  })

  return context
}

export const sourceFromAllPages: ActionHandler = async (context, _params) => {
  await figma.loadAllPagesAsync()
  const out: SceneNode[] = []
  for (const page of figma.root.children) {
    for (const child of page.children) {
      collectAll([child] as readonly SceneNode[], out)
    }
  }
  context.nodes = out

  context.log.push({
    stepIndex: -1,
    stepName: "Source: all pages",
    message: `Loaded ${plural(out.length, "node")} from ${plural(figma.root.children.length, "page")}`,
    itemsIn: 0,
    itemsOut: out.length,
    status: "success",
  })

  return context
}

export const sourceFromPageByName: ActionHandler = async (context, params) => {
  const pageName = String(params.pageName ?? "").trim()
  if (!pageName) {
    context.log.push({
      stepIndex: -1,
      stepName: "Source: page by name",
      message: "No page name specified — skipped",
      itemsIn: 0,
      itemsOut: 0,
      status: "skipped",
    })
    return context
  }

  await figma.loadAllPagesAsync()
  const page = figma.root.children.find(
    (p) => p.name.toLowerCase() === pageName.toLowerCase(),
  )

  if (!page) {
    context.log.push({
      stepIndex: -1,
      stepName: "Source: page by name",
      message: `Page "${pageName}" not found`,
      itemsIn: 0,
      itemsOut: 0,
      status: "error",
      error: `Page "${pageName}" not found`,
    })
    return context
  }

  const out: SceneNode[] = []
  collectAll(page.children as readonly SceneNode[], out)
  context.nodes = out

  context.log.push({
    stepIndex: -1,
    stepName: "Source: page by name",
    message: `Loaded ${plural(out.length, "node")} from page "${page.name}"`,
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
