import type { ComponentType } from "preact"
import type { Scenario } from "../test-fixtures/types"

import { scenarios as colorChainScenarios } from "../test-fixtures/color-chain"
import { scenarios as mockupMarkupScenarios } from "../test-fixtures/mockup-markup"
import { scenarios as findColorMatchScenarios } from "../test-fixtures/find-color-match"
import { scenarios as librarySwapScenarios } from "../test-fixtures/library-swap"
import { scenarios as printColorUsagesScenarios } from "../test-fixtures/print-color-usages"
import { scenarios as variablesExportImportScenarios } from "../test-fixtures/variables-export-import"
import { scenarios as variablesBatchRenameScenarios } from "../test-fixtures/variables-batch-rename"
import { scenarios as variablesCreateLinkedColorsScenarios } from "../test-fixtures/variables-create-linked-colors"
import { scenarios as variablesReplaceUsagesScenarios } from "../test-fixtures/variables-replace-usages"
import { scenarios as automationsScenarios } from "../test-fixtures/automations"

export type ToolViewProps = {
  onBack: () => void
  initialSelectionEmpty?: boolean
  initialTab?: string
}

export type ToolEntry = {
  id: string
  label: string
  section: "general" | "variables"
  scenarios: Scenario[]
  loadView: () => Promise<{ default: ComponentType<ToolViewProps> }>
}

export const tools: ToolEntry[] = [
  {
    id: "color-chain-tool",
    label: "View Colors Chain",
    section: "general",
    scenarios: colorChainScenarios,
    loadView: () =>
      import("../app/views/color-chain-tool/ColorChainToolView").then((m) => ({
        default: m.ColorChainToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "mockup-markup-tool",
    label: "Mockup Markup",
    section: "general",
    scenarios: mockupMarkupScenarios,
    loadView: () =>
      import("../app/views/mockup-markup-tool/MockupMarkupToolView").then((m) => ({
        default: m.MockupMarkupToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "find-color-match-tool",
    label: "Find Color Match",
    section: "general",
    scenarios: findColorMatchScenarios,
    loadView: () =>
      import("../app/views/find-color-match-tool/FindColorMatchToolView").then((m) => ({
        default: m.FindColorMatchToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "library-swap-tool",
    label: "Migrate to New UI Kit",
    section: "general",
    scenarios: librarySwapScenarios,
    loadView: () =>
      import("../app/views/library-swap-tool/LibrarySwapToolView").then((m) => ({
        default: m.LibrarySwapToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "print-color-usages-tool",
    label: "Print Color Usages",
    section: "variables",
    scenarios: printColorUsagesScenarios,
    loadView: () =>
      import("../app/views/print-color-usages-tool/PrintColorUsagesToolView").then((m) => ({
        default: m.PrintColorUsagesToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "variables-export-import-tool",
    label: "Export / Import",
    section: "variables",
    scenarios: variablesExportImportScenarios,
    loadView: () =>
      import("../app/views/variables-export-import-tool/VariablesExportImportToolView").then((m) => ({
        default: m.VariablesExportImportToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "variables-batch-rename-tool",
    label: "Rename via JSON",
    section: "variables",
    scenarios: variablesBatchRenameScenarios,
    loadView: () =>
      import("../app/views/variables-batch-rename-tool/VariablesBatchRenameToolView").then((m) => ({
        default: m.VariablesBatchRenameToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "variables-create-linked-colors-tool",
    label: "Create Linked Colors",
    section: "variables",
    scenarios: variablesCreateLinkedColorsScenarios,
    loadView: () =>
      import("../app/views/variables-create-linked-colors-tool/VariablesCreateLinkedColorsToolView").then((m) => ({
        default: m.VariablesCreateLinkedColorsToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "variables-replace-usages-tool",
    label: "Replace Usages",
    section: "variables",
    scenarios: variablesReplaceUsagesScenarios,
    loadView: () =>
      import("../app/views/variables-replace-usages-tool/VariablesReplaceUsagesToolView").then((m) => ({
        default: m.VariablesReplaceUsagesToolView as ComponentType<ToolViewProps>,
      })),
  },
  {
    id: "automations-tool",
    label: "Automations",
    section: "general",
    scenarios: automationsScenarios,
    loadView: () =>
      import("../app/views/automations-tool/AutomationsToolView").then((m) => ({
        default: m.AutomationsToolView as ComponentType<ToolViewProps>,
      })),
  },
]
