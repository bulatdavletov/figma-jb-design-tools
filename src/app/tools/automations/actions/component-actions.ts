import type { ActionHandler } from "../context"

export const detachInstance: ActionHandler = async (context, _params) => {
  const detached: SceneNode[] = []
  let applied = 0

  for (const node of context.nodes) {
    if (node.type !== "INSTANCE") continue
    try {
      const frame = (node as InstanceNode).detachInstance()
      detached.push(frame)
      applied++
    } catch {
      detached.push(node)
    }
  }

  const nonInstances = context.nodes.filter((n) => n.type !== "INSTANCE")
  context.nodes = [...nonInstances, ...detached]

  context.log.push({
    stepIndex: -1,
    stepName: "Detach instance",
    message: `Detached ${applied} instance(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const swapComponent: ActionHandler = async (context, params) => {
  const componentName = String(params.componentName ?? "").trim()
  if (!componentName) {
    context.log.push({
      stepIndex: -1,
      stepName: "Swap component",
      message: "No component name specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const allComponents: ComponentNode[] = []
  figma.root.findAll((n) => {
    if (n.type === "COMPONENT" && n.name === componentName) {
      allComponents.push(n as ComponentNode)
    }
    return false
  })

  if (allComponents.length === 0) {
    context.log.push({
      stepIndex: -1,
      stepName: "Swap component",
      message: `Component "${componentName}" not found`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Component "${componentName}" not found`,
    })
    return context
  }

  const targetComponent = allComponents[0]
  let applied = 0

  for (const node of context.nodes) {
    if (node.type !== "INSTANCE") continue
    try {
      ;(node as InstanceNode).swapComponent(targetComponent)
      applied++
    } catch {
      // swap failed
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Swap component",
    message: `Swapped ${applied} instance(s) to "${componentName}"`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}
