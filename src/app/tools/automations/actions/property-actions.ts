import type { AutomationContext, ActionHandler } from "../context"
import { resolveTokens, type TokenScope } from "../tokens"

export const renameLayers: ActionHandler = async (context, params) => {
  const find = String(params.find ?? "")
  const replace = String(params.replace ?? "")
  if (!find) {
    context.log.push({
      stepIndex: -1,
      stepName: "Rename layers",
      message: "No find pattern specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  let renamed = 0
  for (let i = 0; i < context.nodes.length; i++) {
    const node = context.nodes[i]
    const scope: TokenScope = { node, index: i, context }
    const resolvedReplace = resolveTokens(replace, scope)
    if (node.name.includes(find)) {
      node.name = node.name.split(find).join(resolvedReplace)
      renamed++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Rename layers",
    message: `Renamed ${renamed} of ${context.nodes.length} layer(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setFillColor: ActionHandler = async (context, params) => {
  const hex = String(params.hex ?? "#000000").replace(/^#/, "")
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set fill color",
      message: "Invalid hex color",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: "Invalid hex color",
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if ("fills" in node) {
      const fillsNode = node as GeometryMixin
      fillsNode.fills = [{ type: "SOLID", color: { r, g, b } }]
      applied++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set fill color",
    message: `Applied fill #${hex.toUpperCase()} to ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setFillVariable: ActionHandler = async (context, params) => {
  const variableName = String(params.variableName ?? "").trim()
  if (!variableName) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set fill variable",
      message: "No variable name specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const variables = await figma.variables.getLocalVariablesAsync("COLOR")
  const variable = variables.find((v) => v.name === variableName)
  if (!variable) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set fill variable",
      message: `Variable "${variableName}" not found`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Variable "${variableName}" not found`,
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if ("fills" in node) {
      const fillsNode = node as GeometryMixin
      const solidFill: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 } }
      const fill = figma.variables.setBoundVariableForPaint(solidFill, "color", variable)
      fillsNode.fills = [fill]
      applied++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set fill variable",
    message: `Bound variable "${variableName}" on ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setOpacity: ActionHandler = async (context, params) => {
  const opacity = Math.max(0, Math.min(100, Number(params.opacity ?? 100)))

  let applied = 0
  for (const node of context.nodes) {
    if ("opacity" in node) {
      ;(node as BlendMixin).opacity = opacity / 100
      applied++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set opacity",
    message: `Set opacity ${opacity}% on ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setCharacters: ActionHandler = async (context, params) => {
  const template = String(params.characters ?? "")
  if (!template) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set text content",
      message: "No text template specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  let applied = 0
  for (let i = 0; i < context.nodes.length; i++) {
    const node = context.nodes[i]
    if (node.type !== "TEXT") continue
    const textNode = node as TextNode
    const scope: TokenScope = { node, index: i, context }
    const resolved = resolveTokens(template, scope)

    try {
      await figma.loadFontAsync(textNode.getRangeFontName(0, 1) as FontName)
      textNode.characters = resolved
      applied++
    } catch {
      // Font load failed — skip this node silently
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set text content",
    message: `Set text content on ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const resizeAction: ActionHandler = async (context, params) => {
  const rawWidth = params.width
  const rawHeight = params.height

  let applied = 0
  for (let i = 0; i < context.nodes.length; i++) {
    const node = context.nodes[i]
    if (!("resize" in node)) continue

    const scope: TokenScope = { node, index: i, context }

    const widthStr = typeof rawWidth === "string" ? resolveTokens(rawWidth, scope) : String(rawWidth ?? "")
    const heightStr = typeof rawHeight === "string" ? resolveTokens(rawHeight, scope) : String(rawHeight ?? "")

    const w = widthStr ? Number(widthStr) : NaN
    const h = heightStr ? Number(heightStr) : NaN

    const finalW = isNaN(w) ? node.width : w
    const finalH = isNaN(h) ? node.height : h

    if (finalW > 0 && finalH > 0) {
      ;(node as LayoutMixin).resize(finalW, finalH)
      applied++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Resize",
    message: `Resized ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setLayoutMode: ActionHandler = async (context, params) => {
  const layoutMode = String(params.layoutMode ?? "VERTICAL") as "HORIZONTAL" | "VERTICAL" | "NONE"
  const validModes = ["HORIZONTAL", "VERTICAL", "NONE"]

  if (!validModes.includes(layoutMode)) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set auto layout",
      message: `Invalid layout mode "${layoutMode}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Invalid layout mode "${layoutMode}"`,
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if (node.type === "FRAME" || node.type === "COMPONENT") {
      ;(node as FrameNode).layoutMode = layoutMode
      applied++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set auto layout",
    message: `Set auto layout ${layoutMode} on ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const notifyAction: ActionHandler = async (context, params) => {
  const rawMessage = String(params.message ?? "").trim()
  if (!rawMessage) {
    context.log.push({
      stepIndex: -1,
      stepName: "Notify",
      message: "No message specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const resolvedMessage = resolveTokens(rawMessage, { context })
  figma.notify(resolvedMessage)

  context.log.push({
    stepIndex: -1,
    stepName: "Notify",
    message: `Notification: "${resolvedMessage}"`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}
