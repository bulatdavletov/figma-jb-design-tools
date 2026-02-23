import type { Scenario } from "./types"
import type { MainToUiMessage } from "../app/messages"

const COLLECTIONS: MainToUiMessage = {
  type: "FIND_COLOR_MATCH_COLLECTIONS",
  payload: {
    collections: [
      {
        key: "col-1",
        name: "Int UI Kit",
        libraryName: "Int UI Library",
        isLibrary: true,
        modes: [
          { modeId: "m1", modeName: "Light" },
          { modeId: "m2", modeName: "Dark" },
        ],
      },
      {
        key: "col-2",
        name: "Brand Colors",
        libraryName: null,
        isLibrary: false,
        modes: [{ modeId: "m3", modeName: "Default" }],
      },
    ],
    defaultCollectionKey: "col-1",
  },
}

const GROUPS: MainToUiMessage = {
  type: "FIND_COLOR_MATCH_GROUPS",
  groupsByCollection: {
    "col-1": ["button", "text", "surface", "border"],
    "col-2": ["primary", "secondary"],
  },
}

const CACHE_READY: MainToUiMessage = {
  type: "LIBRARY_CACHE_STATUS",
  status: { state: "ready" },
}

export const scenarios: Scenario[] = [
  {
    id: "empty-selection",
    label: "Empty Selection",
    messages: [COLLECTIONS, GROUPS, CACHE_READY, { type: "SELECTION_EMPTY" }],
    props: { initialSelectionEmpty: true },
  },
  {
    id: "no-unbound",
    label: "No Unbound Colors",
    messages: [
      COLLECTIONS,
      GROUPS,
      CACHE_READY,
      {
        type: "FIND_COLOR_MATCH_RESULT",
        payload: { entries: [], collectionKey: "col-1", modeId: "m1" },
      },
    ],
  },
  {
    id: "results",
    label: "Results with Matches",
    messages: [
      COLLECTIONS,
      GROUPS,
      CACHE_READY,
      {
        type: "FIND_COLOR_MATCH_RESULT",
        payload: {
          collectionKey: "col-1",
          modeId: "m1",
          entries: [
            {
              found: {
                hex: "#3574F0",
                r: 0.21,
                g: 0.455,
                b: 0.941,
                opacity: 1,
                nodeId: "1:42",
                nodeName: "Button bg",
                colorType: "FILL",
                paintIndex: 0,
              },
              bestMatch: {
                variableId: "VariableID:abc/1",
                variableKey: "abc/1",
                variableName: "button/primary/background",
                hex: "#3574F0",
                opacityPercent: 100,
                matchPercent: 100,
              },
              allMatches: [
                {
                  variableId: "VariableID:abc/1",
                  variableKey: "abc/1",
                  variableName: "button/primary/background",
                  hex: "#3574F0",
                  opacityPercent: 100,
                  matchPercent: 100,
                },
              ],
            },
            {
              found: {
                hex: "#FF8800",
                r: 1,
                g: 0.533,
                b: 0,
                opacity: 1,
                nodeId: "1:55",
                nodeName: "Warning icon",
                colorType: "FILL",
                paintIndex: 0,
              },
              bestMatch: {
                variableId: "VariableID:abc/30",
                variableKey: "abc/30",
                variableName: "status/warning",
                hex: "#F29D00",
                opacityPercent: 100,
                matchPercent: 92,
              },
              allMatches: [
                {
                  variableId: "VariableID:abc/30",
                  variableKey: "abc/30",
                  variableName: "status/warning",
                  hex: "#F29D00",
                  opacityPercent: 100,
                  matchPercent: 92,
                },
                {
                  variableId: "VariableID:abc/31",
                  variableKey: "abc/31",
                  variableName: "accent/orange",
                  hex: "#FF8800",
                  opacityPercent: 100,
                  matchPercent: 100,
                },
              ],
            },
          ],
        },
      },
    ],
  },
]
