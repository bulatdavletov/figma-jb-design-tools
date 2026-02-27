import type { Scenario } from "./types"
import type { MainToUiMessage } from "../app/messages"

export const scenarios: Scenario[] = [
  {
    id: "idle",
    label: "Idle",
    messages: [
      { type: "REPLACE_USAGES_SELECTION", payload: { variables: [], selectionSize: 5, colors: [] } },
    ],
  },
  {
    id: "preview-with-mappings",
    label: "Preview with Mappings",
    messages: [
      { type: "REPLACE_USAGES_SELECTION", payload: { variables: [], selectionSize: 5, colors: [] } },
      {
        type: "REPLACE_USAGES_PREVIEW",
        payload: {
          scope: "selection",
          totals: {
            mappings: 2,
            invalidMappingRows: 1,
            nodesWithChanges: 8,
            bindingsWithChanges: 12,
            nodesWithChangesByPhase: { component: 2, instance_in_component: 3, other: 3 },
            bindingsWithChangesByPhase: { component: 4, instance_in_component: 4, other: 4 },
            printsRenameCandidates: 2,
          },
          mappings: [
            {
              sourceId: "VariableID:abc/1",
              sourceName: "button/primary/bg-old",
              sourceCollectionId: "col-1",
              sourceCollectionName: "Int UI Kit (old)",
              targetId: "VariableID:abc/100",
              targetName: "button/primary/background",
              reason: "Exact match by name",
              bindingsTotal: 8,
              bindingsByPhase: { component: 3, instance_in_component: 2, other: 3 },
              nodesTotal: 6,
              nodesByPhase: { component: 2, instance_in_component: 2, other: 2 },
              defaultName: "button/primary/background",
            },
            {
              sourceId: "VariableID:abc/2",
              sourceName: "text/primary-old",
              sourceCollectionId: "col-1",
              sourceCollectionName: "Int UI Kit (old)",
              targetId: "VariableID:abc/101",
              targetName: "text/default",
              reason: "Mapping file",
              bindingsTotal: 4,
              bindingsByPhase: { component: 1, instance_in_component: 2, other: 1 },
              nodesTotal: 2,
              nodesByPhase: { component: 0, instance_in_component: 1, other: 1 },
              defaultName: "text/default",
            },
          ],
          invalidMappingRows: [
            {
              from: "nonexistent/variable",
              to: "text/default",
              status: "missing_source",
              reason: "Source variable not found",
            },
          ],
        },
      },
    ],
  },
  {
    id: "apply-progress",
    label: "Apply In Progress",
    messages: [
      { type: "REPLACE_USAGES_SELECTION", payload: { variables: [], selectionSize: 5, colors: [] } },
      {
        type: "REPLACE_USAGES_APPLY_PROGRESS",
        progress: { current: 4, total: 12, message: "Updating bindings… 4/12" },
      },
    ],
  },
]
