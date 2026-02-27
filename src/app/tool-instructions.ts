import type { ToolId } from "./tools-registry"

export type ToolInstructions = {
  whenToUse: string
  steps: string[]
  output: string
  notes?: string[]
}

export const TOOL_INSTRUCTIONS_BY_ID: Record<ToolId, ToolInstructions> = {
  "library-swap-tool": {
    whenToUse: "When you need to migrate legacy components/styles to the Islands UI Kit.",
    steps: [
      "Select the target frame(s) or run on page/all pages.",
      "Run analysis and review unmatched / mappable items.",
      "Apply swap and verify changed instances.",
    ],
    output: "Instances and styles are replaced using mapping rules.",
    notes: ["Use Manual Pairs tab when auto-mapping misses components."],
  },
  "color-chain-tool": {
    whenToUse: "When you need to inspect variable alias chains on selected layers.",
    steps: [
      "Select one or more layers.",
      "Run scan to inspect bound fills/strokes/effects.",
      "Review the chain from semantic tokens to palette/base tokens.",
    ],
    output: "A readable chain per property so you can debug token source quickly.",
  },
  "find-color-match-tool": {
    whenToUse: "When a layer has unbound colors and you need closest Islands variable matches.",
    steps: [
      "Select the target layers.",
      "Run match to see nearest candidate variables.",
      "Apply chosen match(es) to bind colors.",
    ],
    output: "Matched variable bindings applied to selected layers.",
  },
  "mockup-markup-tool": {
    whenToUse: "When preparing mockups fast with consistent text styles and color markup.",
    steps: [
      "Select layer(s) or text nodes.",
      "Choose a preset / style action.",
      "Apply and verify typography and color bindings.",
    ],
    output: "Selected layers updated to the chosen mockup markup style.",
  },
  "automations-tool": {
    whenToUse: "When you want repeatable workflows with saved action sequences.",
    steps: [
      "Create or open an automation.",
      "Configure actions and tokenized inputs.",
      "Run automation and review execution log.",
    ],
    output: "Configured actions execute in order and change current selection/document state.",
    notes: ["Start with small automations first; then compose longer flows."],
  },
  "print-color-usages-tool": {
    whenToUse: "When you need text labels showing unique color usage near layers.",
    steps: [
      "Choose scope (selection/page/all pages).",
      "Use Print tab to preview generated labels.",
      "Print or open Update tab to update existing labels safely.",
    ],
    output: "Color usage labels are created/updated according to settings and scope.",
  },
  "variables-export-import-tool": {
    whenToUse: "When you need backups or transfer of variable collections via JSON.",
    steps: [
      "Choose collection(s) to export or a JSON file to import.",
      "Review file metadata and potential conflicts.",
      "Confirm export/import action.",
    ],
    output: "Variable collections exported or imported from JSON.",
    notes: ["Use project-aware filenames for easier versioned backups."],
  },
  "variables-batch-rename-tool": {
    whenToUse: "When renaming many variables with a controlled JSON mapping.",
    steps: [
      "Export current variables to JSON template.",
      "Edit names in JSON and re-import.",
      "Preview and apply rename changes.",
    ],
    output: "Variable names updated in batch from the JSON mapping.",
  },
  "variables-create-linked-colors-tool": {
    whenToUse: "When creating linked color variables or connecting existing aliases.",
    steps: [
      "Choose source/target collections or variables.",
      "Set naming and linking options.",
      "Create linked variables and verify alias structure.",
    ],
    output: "New linked variables created (or existing ones updated) with alias relationships.",
  },
  "variables-replace-usages-tool": {
    whenToUse: "When replacing one variable usage with another across selected layers.",
    steps: [
      "Pick the source variable usage(s).",
      "Pick replacement variable(s).",
      "Preview impacted bindings and apply replacement.",
    ],
    output: "Variable bindings are replaced according to selected mapping.",
  },
}
