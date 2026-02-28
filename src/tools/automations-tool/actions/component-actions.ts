import type { ActionHandler } from "../context"
import { resolveTokens } from "../tokens"
import { plural } from "../../../utils/pluralize"

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
    message: `Detached ${plural(applied, "instance")}`,
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
    message: `Swapped ${plural(applied, "instance")} to "${componentName}"`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const swapComponentByKey: ActionHandler = async (context, params) => {
  const componentKey = String(params.componentKey ?? "").trim()
  if (!componentKey) {
    context.log.push({
      stepIndex: -1,
      stepName: "Swap component by key",
      message: "No component key specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  let imported: ComponentNode
  try {
    imported = await figma.importComponentByKeyAsync(componentKey)
  } catch {
    context.log.push({
      stepIndex: -1,
      stepName: "Swap component by key",
      message: `Component key "${componentKey}" could not be imported`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Component key "${componentKey}" could not be imported`,
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "INSTANCE") continue
    try {
      ;(node as InstanceNode).swapComponent(imported)
      applied++
    } catch {
      // swap failed
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Swap component by key",
    message: `Swapped ${plural(applied, "instance")} using key "${componentKey}"`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setInstanceProperties: ActionHandler = async (context, params) => {
  const raw = String(params.properties ?? "").trim()
  if (!raw) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set instance properties",
      message: "No properties specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const parsed = Object.fromEntries(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [k, ...rest] = line.split("=")
        return [k?.trim() ?? "", rest.join("=").trim()]
      })
      .filter(([k, v]) => Boolean(k) && v !== ""),
  )

  const keys = Object.keys(parsed)
  if (keys.length === 0) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set instance properties",
      message: "No valid key=value properties found — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "INSTANCE") continue
    try {
      ;(node as InstanceNode).setProperties(parsed)
      applied++
    } catch {
      // apply failed
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set instance properties",
    message: `Updated ${plural(applied, "instance")} (${keys.join(", ")})`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const resetInstanceOverrides: ActionHandler = async (context, _params) => {
  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "INSTANCE") continue
    try {
      ;(node as InstanceNode).resetOverrides()
      applied++
    } catch {
      // unavailable in some files/api versions
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Reset instance overrides",
    message: `Reset overrides on ${plural(applied, "instance")}`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const pasteComponentById: ActionHandler = async (context, params) => {
  const componentIdTemplate = String(params.componentId ?? "").trim()
  if (!componentIdTemplate) {
    context.log.push({
      stepIndex: -1,
      stepName: "Paste component by ID",
      message: "No component ID specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const componentId = resolveTokens(componentIdTemplate, { context }).trim()
  const xRaw = resolveTokens(String(params.x ?? ""), { context })
  const yRaw = resolveTokens(String(params.y ?? ""), { context })

  const created: SceneNode[] = []
  const target = await resolveComponentById(componentId)

  if (!target) {
    context.log.push({
      stepIndex: -1,
      stepName: "Paste component by ID",
      message: `Component not found for ID "${componentId}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Component "${componentId}" not found`,
    })
    return context
  }

  const instance = target.createInstance()
  const hasX = xRaw !== "" && !Number.isNaN(Number(xRaw))
  const hasY = yRaw !== "" && !Number.isNaN(Number(yRaw))

  if (hasX) instance.x = Number(xRaw)
  if (hasY) instance.y = Number(yRaw)
  if (!hasX || !hasY) {
    figma.currentPage.appendChild(instance)
  }

  created.push(instance)
  context.nodes = created

  context.log.push({
    stepIndex: -1,
    stepName: "Paste component by ID",
    message: `Pasted 1 instance from "${componentId}"`,
    itemsIn: 0,
    itemsOut: 1,
    status: "success",
  })

  return context
}

async function resolveComponentById(componentId: string): Promise<ComponentNode | null> {
  const localNode = await figma.getNodeByIdAsync(componentId)
  if (localNode?.type === "COMPONENT") return localNode as ComponentNode

  try {
    return await figma.importComponentByKeyAsync(componentId)
  } catch {
    return null
  }
}
