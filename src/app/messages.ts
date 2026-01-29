export const UI_TO_MAIN = {
  BOOT: "BOOT",
  INSPECT_SELECTION_FOR_VARIABLE_CHAINS: "INSPECT_SELECTION_FOR_VARIABLE_CHAINS",
} as const

export const MAIN_TO_UI = {
  BOOTSTRAPPED: "BOOTSTRAPPED",
  VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
  SELECTION_EMPTY: "SELECTION_EMPTY",
  ERROR: "ERROR",
} as const

export type UiToMainMessage =
  | { type: typeof UI_TO_MAIN.BOOT }
  | { type: typeof UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS }

export type ModeChain = {
  modeId: string
  modeName: string
  chain: Array<string>
  finalHex: string | null
  circular: boolean
  note?: string
}

export type VariableChainResult = {
  variableId: string
  variableName: string
  collectionName: string
  appliedMode:
    | { status: "single"; modeId: string; modeName: string }
    | { status: "mixed"; modeIds: Array<string>; modeNames: Array<string> }
    | { status: "unknown" }
  chains: Array<ModeChain>
}

export type LayerInspectionResult = {
  layerId: string
  layerName: string
  layerType: SceneNode["type"]
  colors: Array<VariableChainResult>
}

export type MainToUiMessage =
  | { type: typeof MAIN_TO_UI.BOOTSTRAPPED; command: string; selectionSize: number }
  | { type: typeof MAIN_TO_UI.VARIABLE_CHAINS_RESULT; results: Array<LayerInspectionResult> }
  | { type: typeof MAIN_TO_UI.SELECTION_EMPTY }
  | { type: typeof MAIN_TO_UI.ERROR; message: string }

