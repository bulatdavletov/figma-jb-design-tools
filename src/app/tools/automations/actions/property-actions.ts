export async function renameLayers(params: Record<string, unknown>): Promise<string> {
  const find = String(params.find ?? "")
  const replace = String(params.replace ?? "")
  if (!find) return "No find pattern specified"

  const selection = figma.currentPage.selection
  if (selection.length === 0) return "No selection"

  let renamed = 0
  for (const node of selection) {
    if (node.name.includes(find)) {
      node.name = node.name.split(find).join(replace)
      renamed++
    }
  }
  return `Renamed ${renamed} layer(s)`
}

export async function setFillColor(params: Record<string, unknown>): Promise<string> {
  const hex = String(params.hex ?? "#000000").replace(/^#/, "")
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  if (isNaN(r) || isNaN(g) || isNaN(b)) return "Invalid hex color"

  const selection = figma.currentPage.selection
  if (selection.length === 0) return "No selection"

  let applied = 0
  for (const node of selection) {
    if ("fills" in node) {
      const fillsNode = node as GeometryMixin
      fillsNode.fills = [{ type: "SOLID", color: { r, g, b } }]
      applied++
    }
  }
  return `Applied fill #${hex} to ${applied} node(s)`
}

export async function setFillVariable(params: Record<string, unknown>): Promise<string> {
  const variableName = String(params.variableName ?? "").trim()
  if (!variableName) return "No variable name specified"

  const selection = figma.currentPage.selection
  if (selection.length === 0) return "No selection"

  const variables = await figma.variables.getLocalVariablesAsync("COLOR")
  const variable = variables.find((v) => v.name === variableName)
  if (!variable) return `Variable "${variableName}" not found`

  let applied = 0
  for (const node of selection) {
    if ("fills" in node) {
      const fillsNode = node as GeometryMixin
      const solidFill: SolidPaint = { type: "SOLID", color: { r: 0, g: 0, b: 0 } }
      const fill = figma.variables.setBoundVariableForPaint(solidFill, "color", variable)
      fillsNode.fills = [fill]
      applied++
    }
  }
  return `Bound variable "${variableName}" on ${applied} node(s)`
}

export async function setOpacity(params: Record<string, unknown>): Promise<string> {
  const opacity = Math.max(0, Math.min(100, Number(params.opacity ?? 100)))

  const selection = figma.currentPage.selection
  if (selection.length === 0) return "No selection"

  let applied = 0
  for (const node of selection) {
    if ("opacity" in node) {
      ;(node as BlendMixin).opacity = opacity / 100
      applied++
    }
  }
  return `Set opacity ${opacity}% on ${applied} node(s)`
}

export async function notifyAction(params: Record<string, unknown>): Promise<string> {
  const message = String(params.message ?? "").trim()
  if (!message) return "No message specified"
  figma.notify(message)
  return `Notification shown: "${message}"`
}
