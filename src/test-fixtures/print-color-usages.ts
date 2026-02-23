import type { Scenario } from "./types"
import type { MainToUiMessage, PrintColorUsagesUiSettings } from "../app/messages"

const DEFAULT_SETTINGS: PrintColorUsagesUiSettings = {
  textPosition: "right",
  showLinkedColors: true,
  showFolderNames: false,
  textTheme: "dark",
  checkByContent: false,
  checkNested: true,
  printDistance: 8,
  applyTextColor: true,
  applyTextStyle: true,
}

const SETTINGS_MSG: MainToUiMessage = {
  type: "PRINT_COLOR_USAGES_SETTINGS",
  settings: DEFAULT_SETTINGS,
}

export const scenarios: Scenario[] = [
  {
    id: "settings",
    label: "Settings Tab",
    messages: [
      SETTINGS_MSG,
      { type: "PRINT_COLOR_USAGES_SELECTION", selectionSize: 0 },
      { type: "PRINT_COLOR_USAGES_STATUS", status: { status: "idle" } },
    ],
  },
  {
    id: "print-idle",
    label: "Print Tab — Idle",
    messages: [
      SETTINGS_MSG,
      { type: "PRINT_COLOR_USAGES_SELECTION", selectionSize: 3 },
      { type: "PRINT_COLOR_USAGES_STATUS", status: { status: "idle" } },
    ],
  },
  {
    id: "print-preview",
    label: "Print Tab — Preview",
    messages: [
      SETTINGS_MSG,
      { type: "PRINT_COLOR_USAGES_SELECTION", selectionSize: 3 },
      { type: "PRINT_COLOR_USAGES_STATUS", status: { status: "idle" } },
      {
        type: "PRINT_COLOR_USAGES_PRINT_PREVIEW",
        payload: {
          entries: [
            { label: "#3574F0 100%", layerName: "button/primary/background", variableId: "v1", linkedColorName: "blue/500" },
            { label: "#FFFFFF 100%", layerName: "text/on-primary" },
            { label: "#6C707A 100%", layerName: "text/secondary", variableId: "v3", linkedColorName: "grey/400" },
          ],
        },
      },
    ],
  },
  {
    id: "update-preview",
    label: "Update Tab — Preview",
    messages: [
      SETTINGS_MSG,
      { type: "PRINT_COLOR_USAGES_SELECTION", selectionSize: 5 },
      { type: "PRINT_COLOR_USAGES_STATUS", status: { status: "idle" } },
      {
        type: "PRINT_COLOR_USAGES_UPDATE_PREVIEW",
        payload: {
          scope: "selection",
          totals: { candidates: 3, changed: 2, unchanged: 1, skipped: 0 },
          entries: [
            {
              nodeId: "1:10",
              nodeName: "Color label 1",
              oldText: "#3574F0 100%",
              newText: "#3574F0 100% (blue/500)",
              oldLayerName: "Color label 1",
              newLayerName: "VariableID:abc/1 (Light)",
              textChanged: true,
              layerNameChanged: true,
              linkedColorChanged: false,
              resolvedBy: "layer_variable_id",
            },
            {
              nodeId: "1:11",
              nodeName: "Color label 2",
              oldText: "#FFFFFF 100%",
              newText: "#FFFFFF 100%",
              oldLayerName: "Color label 2",
              newLayerName: "Color label 2",
              textChanged: false,
              layerNameChanged: false,
              linkedColorChanged: false,
              resolvedBy: "text_content",
            },
          ],
        },
      },
    ],
  },
]
