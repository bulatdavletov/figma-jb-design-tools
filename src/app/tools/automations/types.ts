export type ActionType =
  | "sourceFromSelection"
  | "sourceFromPage"
  | "filterByType"
  | "filterByName"
  | "expandToChildren"
  | "renameLayers"
  | "setFillColor"
  | "setFillVariable"
  | "setOpacity"
  | "notify"
  | "selectResults"
  | "log"
  | "count"
  | "setPipelineVariable"
  | "setPipelineVariableFromProperty"

export type ActionCategory = "source" | "filter" | "navigate" | "transform" | "output" | "variables"

export interface AutomationStep {
  id: string
  actionType: ActionType
  params: Record<string, unknown>
  enabled: boolean
}

export interface Automation {
  id: string
  name: string
  steps: AutomationStep[]
  createdAt: number
  updatedAt: number
}

export interface AutomationExportFormat {
  version: 1
  automation: {
    name: string
    steps: Array<{
      actionType: ActionType
      params: Record<string, unknown>
      enabled: boolean
    }>
  }
}

export interface ActionDefinition {
  type: ActionType
  label: string
  description: string
  category: ActionCategory
  defaultParams: Record<string, unknown>
}

export const ACTION_CATEGORIES: { key: ActionCategory; label: string }[] = [
  { key: "source", label: "Source" },
  { key: "filter", label: "Filter" },
  { key: "navigate", label: "Navigate" },
  { key: "transform", label: "Transform" },
  { key: "variables", label: "Pipeline Variables" },
  { key: "output", label: "Output" },
]

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  // Source
  {
    type: "sourceFromSelection",
    label: "From selection",
    description: "Start with the current Figma selection",
    category: "source",
    defaultParams: {},
  },
  {
    type: "sourceFromPage",
    label: "From current page",
    description: "Start with all nodes on the current page",
    category: "source",
    defaultParams: {},
  },

  // Filter
  {
    type: "filterByType",
    label: "Filter by type",
    description: "Keep only nodes of a specific type",
    category: "filter",
    defaultParams: { nodeType: "TEXT" },
  },
  {
    type: "filterByName",
    label: "Filter by name",
    description: "Keep nodes matching a name pattern",
    category: "filter",
    defaultParams: { pattern: "", matchMode: "contains" },
  },

  // Navigate
  {
    type: "expandToChildren",
    label: "Expand to children",
    description: "Replace working set with direct children of current nodes",
    category: "navigate",
    defaultParams: {},
  },

  // Transform
  {
    type: "renameLayers",
    label: "Rename layers",
    description: "Find/replace in layer names. Replace supports {name}, {type}, {index} tokens",
    category: "transform",
    defaultParams: { find: "", replace: "" },
  },
  {
    type: "setFillColor",
    label: "Set fill color",
    description: "Set fill to a specific hex color",
    category: "transform",
    defaultParams: { hex: "#000000" },
  },
  {
    type: "setFillVariable",
    label: "Set fill variable",
    description: "Bind fill to a color variable by name",
    category: "transform",
    defaultParams: { variableName: "" },
  },
  {
    type: "setOpacity",
    label: "Set opacity",
    description: "Set opacity on nodes (0–100)",
    category: "transform",
    defaultParams: { opacity: 100 },
  },

  // Pipeline Variables
  {
    type: "setPipelineVariable",
    label: "Set variable",
    description: "Store a value for later steps. Use {token} expressions in value",
    category: "variables",
    defaultParams: { variableName: "", value: "" },
  },
  {
    type: "setPipelineVariableFromProperty",
    label: "Set variable from property",
    description: "Read a property from the first node and store it for later steps",
    category: "variables",
    defaultParams: { variableName: "", property: "name" },
  },

  // Output
  {
    type: "notify",
    label: "Notify",
    description: "Show a toast notification. Supports {count}, {$var} tokens",
    category: "output",
    defaultParams: { message: "" },
  },
  {
    type: "selectResults",
    label: "Select results",
    description: "Set Figma selection to the current working set",
    category: "output",
    defaultParams: { scrollTo: true },
  },
  {
    type: "log",
    label: "Log message",
    description: "Add a message to the run log. Supports {count}, {$var} tokens",
    category: "output",
    defaultParams: { message: "" },
  },
  {
    type: "count",
    label: "Count items",
    description: "Log the count of items in the working set",
    category: "output",
    defaultParams: { label: "Count" },
  },
]

export const ALL_ACTION_TYPES: ActionType[] = ACTION_DEFINITIONS.map((d) => d.type)

export function getActionDefinition(type: ActionType): ActionDefinition | undefined {
  return ACTION_DEFINITIONS.find((d) => d.type === type)
}

export function getActionsByCategory(category: ActionCategory): ActionDefinition[] {
  return ACTION_DEFINITIONS.filter((d) => d.category === category)
}

export function generateStepId(): string {
  return `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function generateAutomationId(): string {
  return `auto_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const VALID_NODE_TYPES = [
  "TEXT",
  "FRAME",
  "GROUP",
  "COMPONENT",
  "COMPONENT_SET",
  "INSTANCE",
  "RECTANGLE",
  "ELLIPSE",
  "LINE",
  "POLYGON",
  "STAR",
  "VECTOR",
  "BOOLEAN_OPERATION",
  "SECTION",
] as const

export type SelectableNodeType = (typeof VALID_NODE_TYPES)[number]

export const FIND_SCOPES = ["selection", "page", "all_pages"] as const
export type FindScope = (typeof FIND_SCOPES)[number]

export const MATCH_MODES = ["contains", "startsWith", "regex"] as const
export type MatchMode = (typeof MATCH_MODES)[number]
