export const UI_TO_MAIN = {
  BOOT: "BOOT",
  INSPECT_SELECTION_FOR_VARIABLE_CHAINS: "INSPECT_SELECTION_FOR_VARIABLE_CHAINS",
  PRINT_COLOR_USAGES_LOAD_SETTINGS: "PRINT_COLOR_USAGES_LOAD_SETTINGS",
  PRINT_COLOR_USAGES_SAVE_SETTINGS: "PRINT_COLOR_USAGES_SAVE_SETTINGS",
  PRINT_COLOR_USAGES_PRINT: "PRINT_COLOR_USAGES_PRINT",
  PRINT_COLOR_USAGES_UPDATE: "PRINT_COLOR_USAGES_UPDATE",
} as const

export const MAIN_TO_UI = {
  BOOTSTRAPPED: "BOOTSTRAPPED",
  VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
  VARIABLE_CHAINS_RESULT_V2: "VARIABLE_CHAINS_RESULT_V2",
  SELECTION_EMPTY: "SELECTION_EMPTY",
  PRINT_COLOR_USAGES_SETTINGS: "PRINT_COLOR_USAGES_SETTINGS",
  PRINT_COLOR_USAGES_SELECTION: "PRINT_COLOR_USAGES_SELECTION",
  PRINT_COLOR_USAGES_STATUS: "PRINT_COLOR_USAGES_STATUS",
  ERROR: "ERROR",
} as const

export type UiToMainMessage =
  | { type: typeof UI_TO_MAIN.BOOT }
  | { type: typeof UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS; settings: PrintColorUsagesUiSettings }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT; settings: PrintColorUsagesUiSettings }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE; settings: PrintColorUsagesUiSettings }

export type PrintColorUsagesUiSettings = {
  textPosition: "left" | "right"
  showLinkedColors: boolean
  hideFolderNames: boolean
  textTheme: "dark" | "light"
}

export type PrintColorUsagesStatus =
  | { status: "idle" }
  | { status: "working"; message: string }
  | { status: "done"; message: string }
  | { status: "error"; message: string }

export type ModeChain = {
  modeId: string
  modeName: string
  chain: Array<string>
  finalHex: string | null
  /**
   * Opacity of the resolved color as a percent (0..100).
   * If `finalHex` is null, this will be null too.
   */
  finalOpacityPercent: number | null
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

export type VariableChainResultV2 = {
  variableId: string
  variableName: string
  collectionName: string
  appliedMode:
    | { status: "single"; modeId: string; modeName: string }
    | { status: "mixed"; modeIds: Array<string>; modeNames: Array<string> }
    | { status: "unknown" }
  /**
   * The single chain that the UI should render.
   * (The UI previously picked one chain from `chains[]`; V2 computes only that one.)
   */
  chainToRender: ModeChain | null
  /** True if the variable's collection has multiple modes. */
  hasOtherModes: boolean
}

export type LayerInspectionResult = {
  layerId: string
  layerName: string
  layerType: SceneNode["type"]
  colors: Array<VariableChainResult>
}

export type LayerInspectionResultV2 = {
  layerId: string
  layerName: string
  layerType: SceneNode["type"]
  colors: Array<VariableChainResultV2>
}

export type MainToUiMessage =
  | { type: typeof MAIN_TO_UI.BOOTSTRAPPED; command: string; selectionSize: number }
  | { type: typeof MAIN_TO_UI.VARIABLE_CHAINS_RESULT; results: Array<LayerInspectionResult> }
  | { type: typeof MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2; results: Array<LayerInspectionResultV2> }
  | { type: typeof MAIN_TO_UI.SELECTION_EMPTY }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS; settings: PrintColorUsagesUiSettings }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION; selectionSize: number }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS; status: PrintColorUsagesStatus }
  | { type: typeof MAIN_TO_UI.ERROR; message: string }

