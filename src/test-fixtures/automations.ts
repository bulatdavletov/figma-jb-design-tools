import type { Scenario } from "./types"
import type {
  MainToUiMessage,
  AutomationListItem,
  AutomationPayload,
  AutomationsRunProgress,
  AutomationsRunResult,
} from "../app/messages"

const BUILDER_SIZE = { width: 680, height: 520 }

const now = Date.now()

const sampleAutomations: AutomationListItem[] = [
  { id: "auto_1", name: "Find all icons", stepCount: 3, createdAt: now - 86400000, updatedAt: now - 3600000 },
  { id: "auto_2", name: "Rename text layers", stepCount: 2, createdAt: now - 172800000, updatedAt: now - 7200000 },
  { id: "auto_3", name: "Set brand colors", stepCount: 5, createdAt: now - 259200000, updatedAt: now - 10800000 },
]

const sampleFullAutomation: AutomationPayload = {
  id: "auto_1",
  name: "Find all icons",
  steps: [
    { id: "step_1", actionType: "sourceFromPage", params: {}, enabled: true },
    { id: "step_2", actionType: "filterByType", params: { nodeType: "INSTANCE" }, enabled: true },
    { id: "step_3", actionType: "filterByName", params: { pattern: "icon/", matchMode: "startsWith" }, enabled: true },
    { id: "step_4", actionType: "count", params: { label: "Icons found" }, enabled: true },
    { id: "step_5", actionType: "selectResults", params: { scrollTo: true }, enabled: true },
  ],
  createdAt: now - 86400000,
  updatedAt: now - 3600000,
}

const emptyAutomation: AutomationPayload = {
  id: "auto_new",
  name: "Untitled Automation",
  steps: [],
  createdAt: now,
  updatedAt: now,
}

const runProgress: AutomationsRunProgress = {
  automationName: "Find all icons",
  currentStep: 2,
  totalSteps: 5,
  stepName: "Filter by type",
  status: "running",
}

const successResult: AutomationsRunResult = {
  success: true,
  message: "Completed — 12 nodes selected",
  stepsCompleted: 5,
  totalSteps: 5,
  errors: [],
  log: [],
}

const successResultWithLog: AutomationsRunResult = {
  success: true,
  message: "Completed — 12 nodes selected",
  stepsCompleted: 5,
  totalSteps: 5,
  errors: [],
  log: [
    { stepIndex: 0, stepName: "From current page", message: "Loaded 347 nodes from page", itemsIn: 0, itemsOut: 347, status: "success" },
    { stepIndex: 1, stepName: "Filter by type", message: "Kept 42 INSTANCE nodes", itemsIn: 347, itemsOut: 42, status: "success" },
    { stepIndex: 2, stepName: "Filter by name", message: 'Kept 12 nodes matching "icon/"', itemsIn: 42, itemsOut: 12, status: "success" },
    { stepIndex: 3, stepName: "Count items", message: "Icons found: 12", itemsIn: 12, itemsOut: 12, status: "success" },
    { stepIndex: 4, stepName: "Select results", message: "Selected 12 nodes", itemsIn: 12, itemsOut: 12, status: "success" },
  ],
}

const errorResult: AutomationsRunResult = {
  success: false,
  message: "Stopped at step 3",
  stepsCompleted: 2,
  totalSteps: 5,
  errors: ["Filter by name: invalid regex pattern — unterminated group"],
  log: [
    { stepIndex: 0, stepName: "From current page", message: "Loaded 347 nodes from page", itemsIn: 0, itemsOut: 347, status: "success" },
    { stepIndex: 1, stepName: "Filter by type", message: "Kept 42 INSTANCE nodes", itemsIn: 347, itemsOut: 42, status: "success" },
    { stepIndex: 2, stepName: "Filter by name", message: "Invalid regex: unterminated group", itemsIn: 42, itemsOut: 0, status: "error", error: "unterminated group" },
  ],
}

const LIST: MainToUiMessage = { type: "AUTOMATIONS_LIST", automations: sampleAutomations }
const EMPTY_LIST: MainToUiMessage = { type: "AUTOMATIONS_LIST", automations: [] }
const FULL: MainToUiMessage = { type: "AUTOMATIONS_FULL", automation: sampleFullAutomation }
const FULL_EMPTY: MainToUiMessage = { type: "AUTOMATIONS_FULL", automation: emptyAutomation }
const PROGRESS: MainToUiMessage = { type: "AUTOMATIONS_RUN_PROGRESS", progress: runProgress }
const SUCCESS: MainToUiMessage = { type: "AUTOMATIONS_RUN_RESULT", result: successResult }
const SUCCESS_LOG: MainToUiMessage = { type: "AUTOMATIONS_RUN_RESULT", result: successResultWithLog }
const ERROR_LOG: MainToUiMessage = { type: "AUTOMATIONS_RUN_RESULT", result: errorResult }

export const scenarios: Scenario[] = [
  {
    id: "empty-list",
    label: "Empty List",
    messages: [EMPTY_LIST],
  },
  {
    id: "list-with-items",
    label: "List (3 automations)",
    messages: [LIST],
  },
  {
    id: "list-running",
    label: "List — Running",
    messages: [LIST, PROGRESS],
  },
  {
    id: "list-success",
    label: "List — Run Success",
    messages: [LIST, SUCCESS],
  },
  {
    id: "builder-empty",
    label: "Builder — Empty",
    messages: [EMPTY_LIST, FULL_EMPTY],
    size: BUILDER_SIZE,
  },
  {
    id: "builder-with-steps",
    label: "Builder — With Steps",
    messages: [EMPTY_LIST, FULL],
    size: BUILDER_SIZE,
  },
  {
    id: "run-output-success",
    label: "Run Output — Success",
    messages: [EMPTY_LIST, SUCCESS_LOG],
    size: BUILDER_SIZE,
  },
  {
    id: "run-output-error",
    label: "Run Output — Error",
    messages: [EMPTY_LIST, ERROR_LOG],
    size: BUILDER_SIZE,
  },
]
