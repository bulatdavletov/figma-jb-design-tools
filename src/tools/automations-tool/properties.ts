export type PropertyValue = string | number | boolean | null

export interface PropertyDefinition {
  key: string
  label: string
  valueType: "string" | "number" | "boolean"
  category: "general" | "geometry" | "appearance" | "text" | "component"
  accessor: (node: SceneNode) => PropertyValue
}

function getFirstFillHex(node: SceneNode): string | null {
  if (!("fills" in node)) return null
  const fills = (node as GeometryMixin).fills
  if (!Array.isArray(fills) || fills.length === 0) return null
  const first = fills[0]
  if (first.type !== "SOLID") return null
  const { r, g, b } = first.color
  const toHex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function getPageName(node: SceneNode): string {
  let current: BaseNode | null = node
  while (current) {
    if (current.type === "PAGE") return current.name
    current = current.parent
  }
  return ""
}

function getTextContent(node: SceneNode): string | null {
  if (node.type !== "TEXT") return null
  return (node as TextNode).characters
}

function getMainComponentName(node: SceneNode): string | null {
  if (node.type !== "INSTANCE") return null
  return (node as InstanceNode).mainComponent?.name ?? null
}

export const PROPERTY_REGISTRY: PropertyDefinition[] = [
  // General
  { key: "name", label: "Name", valueType: "string", category: "general", accessor: (n) => n.name },
  { key: "type", label: "Type", valueType: "string", category: "general", accessor: (n) => n.type },
  { key: "id", label: "ID", valueType: "string", category: "general", accessor: (n) => n.id },
  { key: "visible", label: "Visible", valueType: "boolean", category: "general", accessor: (n) => n.visible },
  { key: "locked", label: "Locked", valueType: "boolean", category: "general", accessor: (n) => n.locked },
  { key: "pageName", label: "Page name", valueType: "string", category: "general", accessor: getPageName },

  // Geometry
  { key: "width", label: "Width", valueType: "number", category: "geometry", accessor: (n) => n.width },
  { key: "height", label: "Height", valueType: "number", category: "geometry", accessor: (n) => n.height },
  { key: "x", label: "X position", valueType: "number", category: "geometry", accessor: (n) => n.x },
  { key: "y", label: "Y position", valueType: "number", category: "geometry", accessor: (n) => n.y },
  {
    key: "rotation",
    label: "Rotation",
    valueType: "number",
    category: "geometry",
    accessor: (n) => ("rotation" in n ? (n as FrameNode).rotation : null),
  },

  // Appearance
  {
    key: "opacity",
    label: "Opacity",
    valueType: "number",
    category: "appearance",
    accessor: (n) => ("opacity" in n ? (n as BlendMixin).opacity : null),
  },
  { key: "fillHex", label: "Fill color (hex)", valueType: "string", category: "appearance", accessor: getFirstFillHex },

  // Text
  { key: "characters", label: "Text content", valueType: "string", category: "text", accessor: getTextContent },

  // Component
  {
    key: "componentName",
    label: "Component name",
    valueType: "string",
    category: "component",
    accessor: getMainComponentName,
  },
]

const registryMap = new Map(PROPERTY_REGISTRY.map((p) => [p.key, p]))

export function getNodeProperty(node: SceneNode, key: string): PropertyValue {
  const def = registryMap.get(key)
  if (!def) return null
  return def.accessor(node)
}

export function getPropertyDefinition(key: string): PropertyDefinition | undefined {
  return registryMap.get(key)
}

export function getPropertyKeys(): string[] {
  return PROPERTY_REGISTRY.map((p) => p.key)
}
