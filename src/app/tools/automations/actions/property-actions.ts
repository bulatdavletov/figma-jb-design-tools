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

export const wrapInFrame: ActionHandler = async (context, params) => {
  const autoLayout = String(params.autoLayout ?? "")
  const validAutoLayouts = ["HORIZONTAL", "VERTICAL", ""]

  if (!validAutoLayouts.includes(autoLayout)) {
    context.log.push({
      stepIndex: -1,
      stepName: "Wrap in frame",
      message: `Invalid auto layout value "${autoLayout}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Invalid auto layout value "${autoLayout}"`,
    })
    return context
  }

  const newFrames: SceneNode[] = []

  for (const node of context.nodes) {
    const parent = node.parent
    if (!parent || parent.type === "DOCUMENT") continue

    const frame = figma.createFrame()
    frame.name = node.name
    frame.x = node.x
    frame.y = node.y
    frame.resize(node.width, node.height)
    frame.fills = []

    const parentWithChildren = parent as ChildrenMixin
    const index = Array.from(parentWithChildren.children).indexOf(node)
    parentWithChildren.insertChild(index, frame)

    frame.appendChild(node)
    node.x = 0
    node.y = 0

    if (autoLayout === "HORIZONTAL" || autoLayout === "VERTICAL") {
      frame.layoutMode = autoLayout
    }

    newFrames.push(frame)
  }

  context.nodes = newFrames

  const alLabel = autoLayout ? ` with auto layout (${autoLayout})` : ""
  context.log.push({
    stepIndex: -1,
    stepName: "Wrap in frame",
    message: `Wrapped ${newFrames.length} node(s) in frame${alLabel}`,
    itemsIn: newFrames.length,
    itemsOut: newFrames.length,
    status: "success",
  })

  return context
}

function supportsAutoLayout(node: SceneNode): node is FrameNode {
  return node.type === "FRAME" || node.type === "COMPONENT" || node.type === "COMPONENT_SET"
}

export const addAutoLayout: ActionHandler = async (context, params) => {
  const direction = String(params.direction ?? "VERTICAL") as "HORIZONTAL" | "VERTICAL"
  if (direction !== "HORIZONTAL" && direction !== "VERTICAL") {
    context.log.push({
      stepIndex: -1,
      stepName: "Add auto layout",
      message: `Invalid direction "${direction}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Invalid direction "${direction}"`,
    })
    return context
  }

  const rawSpacing = String(params.itemSpacing ?? "")
  const spacing = rawSpacing ? Number(rawSpacing) : NaN

  let applied = 0
  for (const node of context.nodes) {
    if (supportsAutoLayout(node)) {
      ;(node as FrameNode).layoutMode = direction
      if (!isNaN(spacing)) (node as FrameNode).itemSpacing = spacing
      applied++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Add auto layout",
    message: `Added auto layout (${direction}) on ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const editAutoLayout: ActionHandler = async (context, params) => {
  let applied = 0

  for (const node of context.nodes) {
    if (!supportsAutoLayout(node)) continue
    const frame = node as FrameNode
    if (frame.layoutMode === "NONE") continue

    const dir = String(params.direction ?? "")
    if (dir === "HORIZONTAL" || dir === "VERTICAL") {
      frame.layoutMode = dir
    }

    const spacing = String(params.itemSpacing ?? "")
    if (spacing !== "") {
      const n = Number(spacing)
      if (!isNaN(n)) frame.itemSpacing = n
    }

    const pTop = String(params.paddingTop ?? "")
    if (pTop !== "") { const n = Number(pTop); if (!isNaN(n)) frame.paddingTop = n }

    const pRight = String(params.paddingRight ?? "")
    if (pRight !== "") { const n = Number(pRight); if (!isNaN(n)) frame.paddingRight = n }

    const pBottom = String(params.paddingBottom ?? "")
    if (pBottom !== "") { const n = Number(pBottom); if (!isNaN(n)) frame.paddingBottom = n }

    const pLeft = String(params.paddingLeft ?? "")
    if (pLeft !== "") { const n = Number(pLeft); if (!isNaN(n)) frame.paddingLeft = n }

    applied++
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Edit auto layout",
    message: `Edited auto layout on ${applied} node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const removeAutoLayout: ActionHandler = async (context, _params) => {
  let applied = 0
  for (const node of context.nodes) {
    if (supportsAutoLayout(node)) {
      ;(node as FrameNode).layoutMode = "NONE"
      applied++
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Remove auto layout",
    message: `Removed auto layout from ${applied} node(s)`,
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
