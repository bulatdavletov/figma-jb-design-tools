import type { Scenario } from "./types"
import type { MainToUiMessage } from "../app/messages"

const COLLECTIONS: MainToUiMessage = {
  type: "LINKED_COLORS_COLLECTIONS_LIST",
  collections: [
    { id: "col-1", name: "Int UI Kit", modeCount: 2, variableCount: 320 },
    { id: "col-2", name: "Brand Colors", modeCount: 1, variableCount: 45 },
  ],
}

export const scenarios: Scenario[] = [
  {
    id: "empty-selection",
    label: "Empty Selection",
    messages: [
      COLLECTIONS,
      {
        type: "LINKED_COLORS_SELECTION",
        payload: { variables: [], selectionSize: 0, colors: [] },
      },
    ],
  },
  {
    id: "with-variables",
    label: "Variables in Selection",
    messages: [
      COLLECTIONS,
      {
        type: "LINKED_COLORS_SELECTION",
        payload: {
          selectionSize: 2,
          colors: [],
          variables: [
            {
              id: "VariableID:abc/1",
              name: "button/primary/background",
              collectionId: "col-1",
              collectionName: "Int UI Kit",
              resolvedType: "COLOR",
              properties: ["fill"],
              nodes: [
                { id: "1:42", name: "Button / Primary" },
                { id: "1:43", name: "Button / Hover" },
              ],
              defaultName: "button/primary/background-linked",
              matches: [
                {
                  id: "VariableID:abc/50",
                  name: "linked/button-primary-bg",
                  collectionId: "col-2",
                  collectionName: "Brand Colors",
                },
              ],
              options: [
                {
                  id: "VariableID:abc/50",
                  name: "linked/button-primary-bg",
                  collectionId: "col-2",
                  collectionName: "Brand Colors",
                },
                {
                  id: "VariableID:abc/51",
                  name: "linked/blue-500",
                  collectionId: "col-2",
                  collectionName: "Brand Colors",
                },
              ],
              groups: ["button", "linked"],
            },
          ],
        },
      },
    ],
  },
  {
    id: "error",
    label: "Error",
    messages: [
      COLLECTIONS,
      { type: "ERROR", message: "Failed to create linked colors from selection" },
    ],
  },
]
