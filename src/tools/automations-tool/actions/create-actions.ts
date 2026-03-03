import type { ActionHandler } from "../context"
import type { TokenScope } from "../tokens"
import { resolveTokens } from "../tokens"
import { plural } from "../../../utils/pluralize"

const DEFAULT_FONT: FontName = { family: "Inter", style: "Regular" }
const DEFAULT_FONT_SIZE = 12

export const createRectangle: ActionHandler = async (context, params) => {
  const width = Number(params.width)
  const height = Number(params.height)
  const name = String(params.name ?? "").trim()

  const w = Number.isFinite(width) && width > 0 ? width : 24
  const h = Number.isFinite(height) && height > 0 ? height : 24

  const rect = figma.createRectangle()
  rect.resize(w, h)
  rect.x = 0
  rect.y = 0
  if (name) rect.name = name
  figma.currentPage.appendChild(rect)

  context.nodes = [rect]

  context.log.push({
    stepIndex: -1,
    stepName: "Create rectangle",
    message: `Created rectangle ${w}×${h}`,
    itemsIn: 0,
    itemsOut: 1,
    status: "success",
  })

  return context
}

export const createText: ActionHandler = async (context, params) => {
  const template = String(params.characters ?? "")
  const scope: TokenScope = { context }
  const characters = resolveTokens(template, scope)

  let textNode: TextNode
  try {
    await figma.loadFontAsync(DEFAULT_FONT)
    textNode = figma.createText()
    textNode.fontName = DEFAULT_FONT
    textNode.fontSize = DEFAULT_FONT_SIZE
    textNode.characters = characters || " "
  } catch {
    context.log.push({
      stepIndex: -1,
      stepName: "Create text",
      message: "Failed to load font — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: "Failed to load default font",
    })
    return context
  }

  if (context.nodes.length === 1) {
    const first = context.nodes[0]
    textNode.x = first.x + (first.width ?? 0) + 4
    textNode.y = first.y
  } else {
    textNode.x = 0
    textNode.y = 0
  }

  figma.currentPage.appendChild(textNode)
  context.nodes = [...context.nodes, textNode]

  context.log.push({
    stepIndex: -1,
    stepName: "Create text",
    message: `Created text (${plural(context.nodes.length, "node")} in set)`,
    itemsIn: context.nodes.length - 1,
    itemsOut: context.nodes.length,
    status: "success",
  })

  return context
}
