import type { ActionHandler } from "../context"
import { resolveTokens, type TokenScope } from "../tokens"

async function loadFontForNode(textNode: TextNode): Promise<boolean> {
  try {
    await figma.loadFontAsync(textNode.getRangeFontName(0, 1) as FontName)
    return true
  } catch {
    return false
  }
}

export const setFontSize: ActionHandler = async (context, params) => {
  const rawSize = params.size

  let applied = 0
  for (let i = 0; i < context.nodes.length; i++) {
    const node = context.nodes[i]
    if (node.type !== "TEXT") continue
    const textNode = node as TextNode

    const scope: TokenScope = { node, index: i, context }
    const sizeStr = typeof rawSize === "string" ? resolveTokens(rawSize, scope) : String(rawSize ?? "16")
    const size = Number(sizeStr)
    if (isNaN(size) || size <= 0) continue

    if (!(await loadFontForNode(textNode))) continue
    textNode.fontSize = size
    applied++
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set font size",
    message: `Set font size on ${applied} text node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setFont: ActionHandler = async (context, params) => {
  const family = String(params.family ?? "Inter")
  const style = String(params.style ?? "Regular")

  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "TEXT") continue
    const textNode = node as TextNode

    try {
      await figma.loadFontAsync({ family, style })
      textNode.fontName = { family, style }
      applied++
    } catch {
      // Font not available
    }
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set font",
    message: `Set font ${family} ${style} on ${applied} text node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setTextAlignment: ActionHandler = async (context, params) => {
  const align = String(params.align ?? "LEFT") as "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED"
  const validAligns = ["LEFT", "CENTER", "RIGHT", "JUSTIFIED"]
  if (!validAligns.includes(align)) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set text alignment",
      message: `Invalid alignment "${align}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Invalid alignment "${align}"`,
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "TEXT") continue
    ;(node as TextNode).textAlignHorizontal = align
    applied++
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set text alignment",
    message: `Set alignment ${align} on ${applied} text node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setTextCase: ActionHandler = async (context, params) => {
  const textCase = String(params.textCase ?? "ORIGINAL") as TextCase
  const validCases: TextCase[] = ["ORIGINAL", "UPPER", "LOWER", "TITLE"]
  if (!validCases.includes(textCase)) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set text case",
      message: `Invalid text case "${textCase}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Invalid text case "${textCase}"`,
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "TEXT") continue
    const textNode = node as TextNode
    if (!(await loadFontForNode(textNode))) continue
    textNode.textCase = textCase
    applied++
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set text case",
    message: `Set text case ${textCase} on ${applied} text node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setTextDecoration: ActionHandler = async (context, params) => {
  const decoration = String(params.decoration ?? "NONE") as TextDecoration
  const validDecorations: TextDecoration[] = ["NONE", "UNDERLINE", "STRIKETHROUGH"]
  if (!validDecorations.includes(decoration)) {
    context.log.push({
      stepIndex: -1,
      stepName: "Set text decoration",
      message: `Invalid decoration "${decoration}"`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Invalid decoration "${decoration}"`,
    })
    return context
  }

  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "TEXT") continue
    const textNode = node as TextNode
    if (!(await loadFontForNode(textNode))) continue
    textNode.textDecoration = decoration
    applied++
  }

  context.log.push({
    stepIndex: -1,
    stepName: "Set text decoration",
    message: `Set decoration ${decoration} on ${applied} text node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}

export const setLineHeight: ActionHandler = async (context, params) => {
  const unit = String(params.unit ?? "AUTO") as "PIXELS" | "PERCENT" | "AUTO"
  const rawValue = String(params.value ?? "")

  let applied = 0
  for (const node of context.nodes) {
    if (node.type !== "TEXT") continue
    const textNode = node as TextNode
    if (!(await loadFontForNode(textNode))) continue

    if (unit === "AUTO") {
      textNode.lineHeight = { unit: "AUTO" }
      applied++
    } else {
      const val = Number(rawValue)
      if (isNaN(val)) continue
      textNode.lineHeight = { value: val, unit }
      applied++
    }
  }

  const desc = unit === "AUTO" ? "AUTO" : `${rawValue}${unit === "PERCENT" ? "%" : "px"}`
  context.log.push({
    stepIndex: -1,
    stepName: "Set line height",
    message: `Set line height ${desc} on ${applied} text node(s)`,
    itemsIn: context.nodes.length,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}
