import type { Scenario } from "./types"
import type { MainToUiMessage } from "../app/messages"

const RESULT_V2: MainToUiMessage = {
  type: "VARIABLE_CHAINS_RESULT_V2",
  results: [
    {
      layerId: "1:42",
      layerName: "Button / Primary",
      layerType: "RECTANGLE",
      colors: [
        {
          variableId: "VariableID:abc/1",
          variableName: "button/primary/background",
          collectionName: "Int UI Kit",
          appliedMode: { status: "single", modeId: "m1", modeName: "Light" },
          chainToRender: {
            modeId: "m1",
            modeName: "Light",
            chain: ["button/primary/background", "blue/500"],
            chainVariableIds: ["VariableID:abc/1", "VariableID:abc/2"],
            finalHex: "#3574F0",
            finalOpacityPercent: 100,
            circular: false,
          },
          hasOtherModes: true,
        },
      ],
    },
  ],
}

const MULTI_LAYER_RESULT: MainToUiMessage = {
  type: "VARIABLE_CHAINS_RESULT_V2",
  results: [
    {
      layerId: "1:42",
      layerName: "Button / Primary",
      layerType: "RECTANGLE",
      colors: [
        {
          variableId: "VariableID:abc/1",
          variableName: "button/primary/background",
          collectionName: "Int UI Kit",
          appliedMode: { status: "single", modeId: "m1", modeName: "Light" },
          chainToRender: {
            modeId: "m1",
            modeName: "Light",
            chain: ["button/primary/background", "blue/500"],
            chainVariableIds: ["VariableID:abc/1", "VariableID:abc/2"],
            finalHex: "#3574F0",
            finalOpacityPercent: 100,
            circular: false,
          },
          hasOtherModes: true,
        },
      ],
    },
    {
      layerId: "1:55",
      layerName: "Label",
      layerType: "TEXT",
      colors: [
        {
          variableId: "VariableID:abc/10",
          variableName: "text/on-primary",
          collectionName: "Int UI Kit",
          appliedMode: { status: "single", modeId: "m1", modeName: "Light" },
          chainToRender: {
            modeId: "m1",
            modeName: "Light",
            chain: ["text/on-primary", "white"],
            chainVariableIds: ["VariableID:abc/10", "VariableID:abc/11"],
            finalHex: "#FFFFFF",
            finalOpacityPercent: 100,
            circular: false,
          },
          hasOtherModes: false,
        },
      ],
    },
    {
      layerId: "1:60",
      layerName: "Icon Container",
      layerType: "FRAME",
      colors: [
        {
          variableId: "VariableID:abc/20",
          variableName: "surface/warning",
          collectionName: "Int UI Kit",
          appliedMode: { status: "single", modeId: "m2", modeName: "Dark" },
          chainToRender: {
            modeId: "m2",
            modeName: "Dark",
            chain: ["surface/warning", "yellow/700", "yellow/base"],
            chainVariableIds: ["VariableID:abc/20", "VariableID:abc/21", "VariableID:abc/22"],
            finalHex: "#F2C94C",
            finalOpacityPercent: 80,
            circular: false,
          },
          hasOtherModes: true,
        },
      ],
    },
  ],
}

const NOTHING_FOUND: MainToUiMessage = {
  type: "VARIABLE_CHAINS_RESULT_V2",
  results: [
    {
      layerId: "1:99",
      layerName: "Static Rectangle",
      layerType: "RECTANGLE",
      colors: [],
    },
  ],
}

export const scenarios: Scenario[] = [
  {
    id: "empty-selection",
    label: "Empty Selection",
    messages: [{ type: "SELECTION_EMPTY" }],
    props: { initialSelectionEmpty: true },
  },
  {
    id: "single-layer",
    label: "Single Layer",
    messages: [RESULT_V2],
  },
  {
    id: "multi-layer",
    label: "Multi-layer (3 layers)",
    messages: [MULTI_LAYER_RESULT],
  },
  {
    id: "nothing-found",
    label: "No Variables Found",
    messages: [NOTHING_FOUND],
  },
  {
    id: "error",
    label: "Error",
    messages: [{ type: "ERROR", message: "Failed to inspect: layer is inside a locked component" }],
  },
]
