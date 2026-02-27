export type ActionType =
  | "sourceFromSelection"
  | "sourceFromPage"
  | "sourceFromAllPages"
  | "sourceFromPageByName"
  | "filter"
  | "filterByType"
  | "filterByName"
  | "expandToChildren"
  | "goToParent"
  | "flattenDescendants"
  | "restoreNodes"
  | "renameLayers"
  | "setFillColor"
  | "setFillVariable"
  | "setStrokeColor"
  | "removeFills"
  | "removeStrokes"
  | "setOpacity"
  | "setVisibility"
  | "setLocked"
  | "setName"
  | "setRotation"
  | "removeNode"
  | "cloneNode"
  | "setCharacters"
  | "setFontSize"
  | "setFont"
  | "setTextAlignment"
  | "setTextCase"
  | "setTextDecoration"
  | "setLineHeight"
  | "resize"
  | "wrapInFrame"
  | "wrapAllInFrame"
  | "addAutoLayout"
  | "editAutoLayout"
  | "removeAutoLayout"
  | "detachInstance"
  | "swapComponent"
  | "pasteComponentById"
  | "notify"
  | "selectResults"
  | "log"
  | "count"
  | "setPipelineVariable"
  | "setPipelineVariableFromProperty"
  | "splitText"
  | "math"
  | "setPosition"
  | "askForInput"
  | "repeatWithEach"

export type ActionCategory = "source" | "filter" | "navigate" | "transform" | "output" | "variables" | "input" | "flow"

export interface AutomationStep {
  id: string
  actionType: ActionType
  params: Record<string, unknown>
  enabled: boolean
  outputName?: string
  children?: AutomationStep[]
  target?: string
}

export interface Automation {
  id: string
  name: string
  steps: AutomationStep[]
  createdAt: number
  updatedAt: number
}

export interface AutomationExportStepFormat {
  actionType: ActionType
  params: Record<string, unknown>
  enabled: boolean
  outputName?: string
  children?: AutomationExportStepFormat[]
  target?: string
}

export interface AutomationExportFormat {
  version: 1
  automation: {
    name: string
    steps: AutomationExportStepFormat[]
  }
}

export interface ActionDefinition {
  type: ActionType
  label: string
  description: string
  category: ActionCategory
  defaultParams: Record<string, unknown>
  producesData?: boolean
  defaultOutputName?: string
}

export const ACTION_CATEGORIES: { key: ActionCategory; label: string }[] = [
  { key: "source", label: "Source" },
  { key: "filter", label: "Filter" },
  { key: "navigate", label: "Navigate" },
  { key: "transform", label: "Transform" },
  { key: "input", label: "Input" },
  { key: "variables", label: "Variables" },
  { key: "flow", label: "Flow" },
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
    defaultOutputName: "selection",
  },
  {
    type: "sourceFromPage",
    label: "From current page",
    description: "Start with all nodes on the current page",
    category: "source",
    defaultParams: {},
    defaultOutputName: "page",
  },
  {
    type: "sourceFromAllPages",
    label: "From all pages",
    description: "Start with all nodes across all pages in the document",
    category: "source",
    defaultParams: {},
    defaultOutputName: "allPages",
  },
  {
    type: "sourceFromPageByName",
    label: "From page by name",
    description: "Start with all nodes from a page matching the given name",
    category: "source",
    defaultParams: { pageName: "" },
    defaultOutputName: "namedPage",
  },

  // Filter
  {
    type: "filter",
    label: "Filter",
    description: "Keep nodes matching one or more conditions (type, name, color, visibility, etc.)",
    category: "filter",
    defaultParams: { logic: "and", conditions: [{ field: "type", operator: "equals", value: "TEXT" }] },
    defaultOutputName: "filtered",
  },

  // Navigate
  {
    type: "expandToChildren",
    label: "Expand to children",
    description: "Replace working set with direct children of current nodes",
    category: "navigate",
    defaultParams: {},
    defaultOutputName: "children",
  },
  {
    type: "goToParent",
    label: "Go to parent",
    description: "Replace each node with its parent (deduplicated). Skips page-root nodes",
    category: "navigate",
    defaultParams: {},
    defaultOutputName: "parent",
  },
  {
    type: "flattenDescendants",
    label: "Flatten descendants",
    description: "Recursively collect all descendants into a flat list",
    category: "navigate",
    defaultParams: {},
    defaultOutputName: "descendants",
  },
  {
    type: "restoreNodes",
    label: "Restore nodes",
    description: "Restore a previously saved node snapshot to the working set",
    category: "navigate",
    defaultParams: { snapshotName: "" },
    defaultOutputName: "restored",
  },

  // Transform — Properties
  {
    type: "renameLayers",
    label: "Rename layers",
    description: "Find/replace in layer names. Replace supports {name}, {type}, {index} tokens",
    category: "transform",
    defaultParams: { find: "", replace: "" },
    defaultOutputName: "renamed",
  },
  {
    type: "setName",
    label: "Set name",
    description: "Set exact layer name. Supports {name}, {type}, {index} tokens",
    category: "transform",
    defaultParams: { name: "" },
    defaultOutputName: "named",
  },
  {
    type: "setFillColor",
    label: "Set fill color",
    description: "Set fill to a specific hex color",
    category: "transform",
    defaultParams: { hex: "#000000" },
    defaultOutputName: "filled",
  },
  {
    type: "setFillVariable",
    label: "Set fill variable",
    description: "Bind fill to a color variable by name",
    category: "transform",
    defaultParams: { variableName: "" },
    defaultOutputName: "filled",
  },
  {
    type: "setStrokeColor",
    label: "Set stroke color",
    description: "Set stroke to a specific hex color",
    category: "transform",
    defaultParams: { hex: "#000000" },
    defaultOutputName: "stroked",
  },
  {
    type: "removeFills",
    label: "Remove fills",
    description: "Clear all fills from nodes",
    category: "transform",
    defaultParams: {},
    defaultOutputName: "nodes",
  },
  {
    type: "removeStrokes",
    label: "Remove strokes",
    description: "Clear all strokes from nodes",
    category: "transform",
    defaultParams: {},
    defaultOutputName: "nodes",
  },
  {
    type: "setOpacity",
    label: "Set opacity",
    description: "Set opacity on nodes (0–100)",
    category: "transform",
    defaultParams: { opacity: 100 },
    defaultOutputName: "nodes",
  },
  {
    type: "setVisibility",
    label: "Set visibility",
    description: "Show or hide nodes",
    category: "transform",
    defaultParams: { visible: true },
    defaultOutputName: "nodes",
  },
  {
    type: "setLocked",
    label: "Set locked",
    description: "Lock or unlock nodes",
    category: "transform",
    defaultParams: { locked: true },
    defaultOutputName: "nodes",
  },
  {
    type: "setRotation",
    label: "Set rotation",
    description: "Set rotation angle in degrees. Supports tokens",
    category: "transform",
    defaultParams: { degrees: "0" },
    defaultOutputName: "rotated",
  },
  {
    type: "removeNode",
    label: "Remove node",
    description: "Delete nodes from the document. Destructive — cannot be undone within the automation",
    category: "transform",
    defaultParams: {},
    defaultOutputName: "removed",
  },
  {
    type: "cloneNode",
    label: "Clone node",
    description: "Duplicate each node. Working set becomes the new clones",
    category: "transform",
    defaultParams: {},
    defaultOutputName: "clones",
  },
  {
    type: "setCharacters",
    label: "Set text content",
    description: "Set text content on TEXT nodes. Supports {$var}, {name} tokens",
    category: "transform",
    defaultParams: { characters: "" },
    defaultOutputName: "texts",
  },
  {
    type: "setFontSize",
    label: "Set font size",
    description: "Change font size on TEXT nodes",
    category: "transform",
    defaultParams: { size: "16" },
    defaultOutputName: "texts",
  },
  {
    type: "setFont",
    label: "Set font",
    description: "Change font family and style on TEXT nodes",
    category: "transform",
    defaultParams: { family: "Inter", style: "Regular" },
    defaultOutputName: "texts",
  },
  {
    type: "setTextAlignment",
    label: "Set text alignment",
    description: "Change horizontal text alignment on TEXT nodes",
    category: "transform",
    defaultParams: { align: "LEFT" },
    defaultOutputName: "texts",
  },
  {
    type: "setTextCase",
    label: "Set text case",
    description: "Change text case on TEXT nodes",
    category: "transform",
    defaultParams: { textCase: "ORIGINAL" },
    defaultOutputName: "texts",
  },
  {
    type: "setTextDecoration",
    label: "Set text decoration",
    description: "Set underline or strikethrough on TEXT nodes",
    category: "transform",
    defaultParams: { decoration: "NONE" },
    defaultOutputName: "texts",
  },
  {
    type: "setLineHeight",
    label: "Set line height",
    description: "Change line height on TEXT nodes",
    category: "transform",
    defaultParams: { value: "", unit: "AUTO" },
    defaultOutputName: "texts",
  },
  {
    type: "resize",
    label: "Resize",
    description: "Set width and/or height on nodes. Leave blank to keep original",
    category: "transform",
    defaultParams: { width: "", height: "" },
    defaultOutputName: "resized",
  },
  {
    type: "wrapInFrame",
    label: "Wrap in frame",
    description: "Wrap each node in an individual frame. Optionally enable auto layout on the wrapper",
    category: "transform",
    defaultParams: { autoLayout: "" },
    defaultOutputName: "frames",
  },
  {
    type: "wrapAllInFrame",
    label: "Wrap all in frame",
    description: "Wrap all current nodes into one frame. Optionally enable auto layout on the wrapper",
    category: "transform",
    defaultParams: { frameName: "Group", autoLayout: "VERTICAL", itemSpacing: "" },
    defaultOutputName: "frame",
  },
  {
    type: "addAutoLayout",
    label: "Add auto layout",
    description: "Enable auto layout on frames/components. Sets direction and optional initial spacing",
    category: "transform",
    defaultParams: { direction: "VERTICAL", itemSpacing: "" },
    defaultOutputName: "layouts",
  },
  {
    type: "editAutoLayout",
    label: "Edit auto layout",
    description: "Change properties on nodes that already have auto layout",
    category: "transform",
    defaultParams: { direction: "", itemSpacing: "", paddingTop: "", paddingRight: "", paddingBottom: "", paddingLeft: "" },
    defaultOutputName: "layouts",
  },
  {
    type: "removeAutoLayout",
    label: "Remove auto layout",
    description: "Turn off auto layout on frames/components",
    category: "transform",
    defaultParams: {},
    defaultOutputName: "nodes",
  },
  {
    type: "detachInstance",
    label: "Detach instance",
    description: "Convert instances to frames, detaching from their main component",
    category: "transform",
    defaultParams: {},
    defaultOutputName: "detached",
  },
  {
    type: "swapComponent",
    label: "Swap component",
    description: "Replace instance's component by name",
    category: "transform",
    defaultParams: { componentName: "" },
    defaultOutputName: "swapped",
  },
  {
    type: "pasteComponentById",
    label: "Paste component by ID",
    description: "Create a component instance from a component node id or library key",
    category: "transform",
    defaultParams: { componentId: "", x: "", y: "" },
    defaultOutputName: "instances",
  },
  {
    type: "setPosition",
    label: "Set position",
    description: "Set X and/or Y position on nodes. Leave blank to keep original",
    category: "transform",
    defaultParams: { x: "", y: "" },
    defaultOutputName: "positioned",
  },

  // Input
  {
    type: "askForInput",
    label: "Ask for input",
    description: "Pause and ask the user to enter text. Output saved as a variable",
    category: "input",
    defaultParams: { label: "Enter text", placeholder: "", inputType: "text", defaultValue: "" },
    producesData: true,
    defaultOutputName: "input",
  },

  // Pipeline Variables
  {
    type: "setPipelineVariable",
    label: "Set variable",
    description: "Store a value for later steps. Use {token} expressions in value",
    category: "variables",
    defaultParams: { variableName: "", value: "" },
    defaultOutputName: "variable",
  },
  {
    type: "setPipelineVariableFromProperty",
    label: "Set variable from property",
    description: "Read a property from the first node and store it for later steps",
    category: "variables",
    defaultParams: { variableName: "", property: "name" },
    defaultOutputName: "property",
  },
  {
    type: "splitText",
    label: "Split text",
    description: "Split a variable string by delimiter into a list",
    category: "variables",
    defaultParams: { sourceVar: "", delimiter: "\\n" },
    producesData: true,
    defaultOutputName: "parts",
  },
  {
    type: "math",
    label: "Math",
    description: "Perform arithmetic: add, subtract, multiply, or divide two values. Supports tokens",
    category: "variables",
    defaultParams: { x: "", operation: "add", y: "" },
    producesData: true,
    defaultOutputName: "result",
  },

  // Flow
  {
    type: "repeatWithEach",
    label: "Repeat with each",
    description: "Loop over a list variable or working set nodes, running child steps for each item",
    category: "flow",
    defaultParams: { source: "nodes", itemVar: "item", onMismatch: "error", resultMode: "originalNodes" },
  },

  // Output
  {
    type: "notify",
    label: "Notify",
    description: "Show a toast notification. Supports {count}, {$var} tokens",
    category: "output",
    defaultParams: { message: "" },
    defaultOutputName: "notification",
  },
  {
    type: "selectResults",
    label: "Select results",
    description: "Set Figma selection to the current working set",
    category: "output",
    defaultParams: { scrollTo: true },
    defaultOutputName: "selected",
  },
  {
    type: "log",
    label: "Log message",
    description: "Add a message to the run log. Supports {count}, {$var} tokens",
    category: "output",
    defaultParams: { message: "" },
    defaultOutputName: "log",
  },
  {
    type: "count",
    label: "Count items",
    description: "Log the count of items in the working set",
    category: "output",
    defaultParams: { label: "Count" },
    producesData: true,
    defaultOutputName: "count",
  },
]

export const ALL_ACTION_TYPES: ActionType[] = ACTION_DEFINITIONS.map((d) => d.type)

export function getActionDefinition(type: ActionType): ActionDefinition | undefined {
  return ACTION_DEFINITIONS.find((d) => d.type === type)
}

export function getActionsByCategory(category: ActionCategory): ActionDefinition[] {
  return ACTION_DEFINITIONS.filter((d) => d.category === category)
}

export function actionProducesData(actionType: ActionType): boolean {
  const def = getActionDefinition(actionType)
  return def?.producesData === true
}

export function generateDefaultOutputName(
  actionType: ActionType,
  existingNames: string[],
): string {
  const def = getActionDefinition(actionType)
  const base = def?.defaultOutputName ?? actionType
  if (!existingNames.includes(base)) return base
  let counter = 2
  while (existingNames.includes(`${base}-${counter}`)) counter++
  return `${base}-${counter}`
}

export function collectOutputNames(steps: { outputName?: string; children?: { outputName?: string }[] }[]): string[] {
  const names: string[] = []
  for (const s of steps) {
    if (s.outputName) names.push(s.outputName)
    if (s.children) {
      for (const c of s.children) {
        if (c.outputName) names.push(c.outputName)
      }
    }
  }
  return names
}

export function generateStepId(): string {
  return `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function generateAutomationId(): string {
  return `auto_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ============================================================================
// Unified Filter types
// ============================================================================

export type FilterField =
  | "type" | "name" | "fillColor" | "fillVariable" | "component"
  | "visible" | "hasVariable" | "hasFills" | "hasStrokes"
  | "opacity" | "width" | "height"

export type FilterOperator =
  | "equals" | "notEquals"
  | "contains" | "startsWith" | "endsWith" | "regex"
  | "is" | "isNot"
  | "greaterThan" | "lessThan"

export interface FilterCondition {
  field: FilterField
  operator: FilterOperator
  value: string | boolean | number
}

export type FilterLogic = "and" | "or"

export const FILTER_FIELDS: { key: FilterField; label: string; group: string; valueType: "string" | "enum" | "color" | "boolean" | "number" }[] = [
  { key: "type", label: "Type", group: "General", valueType: "enum" },
  { key: "name", label: "Name", group: "General", valueType: "string" },
  { key: "visible", label: "Visible", group: "General", valueType: "boolean" },
  { key: "component", label: "Component", group: "General", valueType: "string" },
  { key: "fillColor", label: "Fill color", group: "Appearance", valueType: "color" },
  { key: "fillVariable", label: "Fill variable", group: "Appearance", valueType: "string" },
  { key: "hasFills", label: "Has fills", group: "Appearance", valueType: "boolean" },
  { key: "hasStrokes", label: "Has strokes", group: "Appearance", valueType: "boolean" },
  { key: "hasVariable", label: "Has variable", group: "Appearance", valueType: "boolean" },
  { key: "opacity", label: "Opacity", group: "Dimensions", valueType: "number" },
  { key: "width", label: "Width", group: "Dimensions", valueType: "number" },
  { key: "height", label: "Height", group: "Dimensions", valueType: "number" },
]

export function getOperatorsForField(field: FilterField): { value: FilterOperator; text: string }[] {
  const fieldDef = FILTER_FIELDS.find((f) => f.key === field)
  if (!fieldDef) return [{ value: "equals", text: "equals" }]

  switch (fieldDef.valueType) {
    case "string":
      return [
        { value: "equals", text: "equals" },
        { value: "notEquals", text: "not equals" },
        { value: "contains", text: "contains" },
        { value: "startsWith", text: "starts with" },
        { value: "endsWith", text: "ends with" },
        { value: "regex", text: "regex" },
      ]
    case "enum":
      return [
        { value: "equals", text: "equals" },
        { value: "notEquals", text: "not equals" },
      ]
    case "color":
      return [
        { value: "equals", text: "equals" },
        { value: "notEquals", text: "not equals" },
      ]
    case "boolean":
      return [
        { value: "is", text: "is" },
        { value: "isNot", text: "is not" },
      ]
    case "number":
      return [
        { value: "equals", text: "=" },
        { value: "notEquals", text: "≠" },
        { value: "greaterThan", text: ">" },
        { value: "lessThan", text: "<" },
      ]
    default:
      return [{ value: "equals", text: "equals" }]
  }
}

// ============================================================================
// Node types
// ============================================================================

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
