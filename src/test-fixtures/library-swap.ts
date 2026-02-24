import type { Scenario } from "./types"
import type { MainToUiMessage } from "../app/messages"

export const scenarios: Scenario[] = [
  {
    id: "idle-no-mapping",
    label: "No Mapping Loaded",
    messages: [
      { type: "LIBRARY_SWAP_SELECTION", selectionSize: 3 },
    ],
  },
  {
    id: "analyze-results",
    label: "Analyze Results",
    messages: [
      { type: "LIBRARY_SWAP_SELECTION", selectionSize: 12 },
      {
        type: "LIBRARY_SWAP_ANALYZE_RESULT",
        payload: {
          totalInstances: 42,
          mappableInstances: 38,
          uniqueOldKeys: 7,
          items: [
            {
              nodeId: "1:100",
              instanceName: "Button / Primary",
              pageName: "Dashboard",
              oldComponentName: "IU/Button/Primary",
              newComponentName: "IntUI/Button/Primary",
            },
            {
              nodeId: "1:101",
              instanceName: "Icon / Close",
              pageName: "Dashboard",
              oldComponentName: "IU/Icon/Close",
              newComponentName: "IntUI/Icon/Close",
            },
            {
              nodeId: "1:102",
              instanceName: "Checkbox / Default",
              pageName: "Settings",
              oldComponentName: "IU/Checkbox/Default",
              newComponentName: "IntUI/Checkbox/Default",
            },
          ],
        },
      },
    ],
  },
  {
    id: "apply-results",
    label: "Apply Results",
    messages: [
      { type: "LIBRARY_SWAP_SELECTION", selectionSize: 12 },
      {
        type: "LIBRARY_SWAP_APPLY_RESULT",
        payload: {
          swapped: 35,
          skipped: 3,
          swappedItems: [
            {
              nodeId: "1:100",
              name: "Button / Primary",
              oldComponentName: "IU/Button/Primary",
              newComponentName: "IntUI/Button/Primary",
            },
            {
              nodeId: "1:101",
              name: "Icon / Close",
              oldComponentName: "IU/Icon/Close",
              newComponentName: "IntUI/Icon/Close",
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
      { type: "LIBRARY_SWAP_SELECTION", selectionSize: 12 },
      { type: "ERROR", message: "Failed to analyze selection for library swap" },
    ],
  },
]
