export type ActionType =
  | "selectByType"
  | "selectByName"
  | "expandToChildren"
  | "renameLayers"
  | "setFillColor"
  | "setFillVariable"
  | "setOpacity"
  | "notify"

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
  defaultParams: Record<string, unknown>
}

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  {
    type: "selectByType",
    label: "Select by type",
    description: "Filter current selection to only nodes of a given type",
    defaultParams: { nodeType: "TEXT" },
  },
  {
    type: "selectByName",
    label: "Select by name",
    description: "Filter selection by name pattern",
    defaultParams: { pattern: "", matchMode: "contains" },
  },
  {
    type: "expandToChildren",
    label: "Expand to children",
    description: "Replace selection with all direct children",
    defaultParams: {},
  },
  {
    type: "renameLayers",
    label: "Rename layers",
    description: "Find/replace in selected layer names",
    defaultParams: { find: "", replace: "" },
  },
  {
    type: "setFillColor",
    label: "Set fill color",
    description: "Set fill to a specific hex color",
    defaultParams: { hex: "#000000" },
  },
  {
    type: "setFillVariable",
    label: "Set fill variable",
    description: "Bind fill to a variable by name",
    defaultParams: { variableName: "" },
  },
  {
    type: "setOpacity",
    label: "Set opacity",
    description: "Set opacity on selected nodes (0–100)",
    defaultParams: { opacity: 100 },
  },
  {
    type: "notify",
    label: "Notify",
    description: "Show a Figma notification message",
    defaultParams: { message: "" },
  },
]

export const ALL_ACTION_TYPES: ActionType[] = ACTION_DEFINITIONS.map((d) => d.type)

export function getActionDefinition(type: ActionType): ActionDefinition | undefined {
  return ACTION_DEFINITIONS.find((d) => d.type === type)
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

export const MATCH_MODES = ["contains", "startsWith", "regex"] as const
export type MatchMode = (typeof MATCH_MODES)[number]
