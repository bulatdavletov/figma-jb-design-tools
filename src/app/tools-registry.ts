import registryData from "./tools-registry-data.json"

export const TOOL_IDS = [
  "mockup-markup-tool",
  "color-chain-tool",
  "library-swap-tool",
  "print-color-usages-tool",
  "variables-export-import-tool",
  "variables-batch-rename-tool",
  "variables-create-linked-colors-tool",
  "variables-replace-usages-tool",
  "find-color-match-tool",
  "automations-tool"
] as const

export type ToolId = (typeof TOOL_IDS)[number]
export type ActiveTool = "home" | ToolId
export type ToolCategory = "General" | "Variables Management"

export type ToolRegistryEntry = {
  id: ToolId
  title: string
  menuLabel: string
  main: string
  cardTitle: string
  description: string
  category: ToolCategory
  icon: "IconShapeText16" | "IconVariableColor16" | "IconTarget16" | "IconLibrary16" | "IconText16" | "IconFolder16" | "IconVariable16" | "IconLink16" | "IconAdjust16" | "IconPrototype16"
  needsSelection: boolean
}

export const TOOLS_REGISTRY = registryData as ToolRegistryEntry[]

const TOOL_BY_ID = Object.fromEntries(
  TOOLS_REGISTRY.map((tool) => [tool.id, tool])
) as Record<ToolId, ToolRegistryEntry>

export function getToolById(id: ToolId): ToolRegistryEntry {
  return TOOL_BY_ID[id]
}

export function isToolId(value: string): value is ToolId {
  return TOOL_IDS.includes(value as ToolId)
}
