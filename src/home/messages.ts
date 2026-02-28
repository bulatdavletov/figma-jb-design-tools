import type { ActiveTool } from "../tools-registry/tools-registry"
export type { ActiveTool }

export const UI_TO_MAIN = {
  BOOT: "BOOT",
  SET_ACTIVE_TOOL: "SET_ACTIVE_TOOL",
  INSPECT_SELECTION_FOR_VARIABLE_CHAINS: "INSPECT_SELECTION_FOR_VARIABLE_CHAINS",
  COLOR_CHAIN_REPLACE_MAIN_COLOR: "COLOR_CHAIN_REPLACE_MAIN_COLOR",
  COLOR_CHAIN_NOTIFY: "COLOR_CHAIN_NOTIFY",
  PRINT_COLOR_USAGES_LOAD_SETTINGS: "PRINT_COLOR_USAGES_LOAD_SETTINGS",
  PRINT_COLOR_USAGES_SAVE_SETTINGS: "PRINT_COLOR_USAGES_SAVE_SETTINGS",
  PRINT_COLOR_USAGES_PRINT: "PRINT_COLOR_USAGES_PRINT",
  PRINT_COLOR_USAGES_PREVIEW_UPDATE: "PRINT_COLOR_USAGES_PREVIEW_UPDATE",
  PRINT_COLOR_USAGES_UPDATE: "PRINT_COLOR_USAGES_UPDATE",
  PRINT_COLOR_USAGES_FOCUS_NODE: "PRINT_COLOR_USAGES_FOCUS_NODE",
  PRINT_COLOR_USAGES_RESET_LAYER_NAMES: "PRINT_COLOR_USAGES_RESET_LAYER_NAMES",
  MOCKUP_MARKUP_LOAD_STATE: "MOCKUP_MARKUP_LOAD_STATE",
  MOCKUP_MARKUP_APPLY: "MOCKUP_MARKUP_APPLY",
  MOCKUP_MARKUP_CREATE_TEXT: "MOCKUP_MARKUP_CREATE_TEXT",
  MOCKUP_MARKUP_GET_COLOR_PREVIEWS: "MOCKUP_MARKUP_GET_COLOR_PREVIEWS",
  // Variables Batch Rename
  BATCH_RENAME_EXPORT_NAME_SET: "BATCH_RENAME_EXPORT_NAME_SET",
  BATCH_RENAME_PREVIEW_IMPORT: "BATCH_RENAME_PREVIEW_IMPORT",
  BATCH_RENAME_APPLY_IMPORT: "BATCH_RENAME_APPLY_IMPORT",
  // Variables Export Import
  EXPORT_IMPORT_EXPORT_SNAPSHOT: "EXPORT_IMPORT_EXPORT_SNAPSHOT",
  EXPORT_IMPORT_PREVIEW_SNAPSHOT: "EXPORT_IMPORT_PREVIEW_SNAPSHOT",
  EXPORT_IMPORT_APPLY_SNAPSHOT: "EXPORT_IMPORT_APPLY_SNAPSHOT",
  // Variables Create Linked Colors
  LINKED_COLORS_CREATE: "LINKED_COLORS_CREATE",
  LINKED_COLORS_APPLY_EXISTING: "LINKED_COLORS_APPLY_EXISTING",
  LINKED_COLORS_RENAME: "LINKED_COLORS_RENAME",
  // Variables Replace Usages
  REPLACE_USAGES_PREVIEW: "REPLACE_USAGES_PREVIEW",
  REPLACE_USAGES_APPLY: "REPLACE_USAGES_APPLY",
  // Library Swap
  LIBRARY_SWAP_ANALYZE: "LIBRARY_SWAP_ANALYZE",
  LIBRARY_SWAP_PREVIEW: "LIBRARY_SWAP_PREVIEW",
  LIBRARY_SWAP_APPLY: "LIBRARY_SWAP_APPLY",
  LIBRARY_SWAP_CLEAR_PREVIEWS: "LIBRARY_SWAP_CLEAR_PREVIEWS",
  LIBRARY_SWAP_SET_CUSTOM_MAPPING: "LIBRARY_SWAP_SET_CUSTOM_MAPPING",
  LIBRARY_SWAP_FOCUS_NODE: "LIBRARY_SWAP_FOCUS_NODE",
  LIBRARY_SWAP_CAPTURE_OLD: "LIBRARY_SWAP_CAPTURE_OLD",
  LIBRARY_SWAP_CAPTURE_NEW: "LIBRARY_SWAP_CAPTURE_NEW",
  LIBRARY_SWAP_REMOVE_PAIR: "LIBRARY_SWAP_REMOVE_PAIR",
  LIBRARY_SWAP_SCAN_LEGACY_RESET: "LIBRARY_SWAP_SCAN_LEGACY_RESET",
  // Find Color Match
  FIND_COLOR_MATCH_SCAN: "FIND_COLOR_MATCH_SCAN",
  FIND_COLOR_MATCH_SET_COLLECTION: "FIND_COLOR_MATCH_SET_COLLECTION",
  FIND_COLOR_MATCH_SET_MODE: "FIND_COLOR_MATCH_SET_MODE",
  FIND_COLOR_MATCH_APPLY: "FIND_COLOR_MATCH_APPLY",
  FIND_COLOR_MATCH_FOCUS_NODE: "FIND_COLOR_MATCH_FOCUS_NODE",
  FIND_COLOR_MATCH_HEX_LOOKUP: "FIND_COLOR_MATCH_HEX_LOOKUP",
  FIND_COLOR_MATCH_SET_GROUP: "FIND_COLOR_MATCH_SET_GROUP",
  // Window
  RESIZE_WINDOW: "RESIZE_WINDOW",
  // Automations
  AUTOMATIONS_LOAD: "AUTOMATIONS_LOAD",
  AUTOMATIONS_GET: "AUTOMATIONS_GET",
  AUTOMATIONS_SAVE: "AUTOMATIONS_SAVE",
  AUTOMATIONS_DELETE: "AUTOMATIONS_DELETE",
  AUTOMATIONS_DUPLICATE: "AUTOMATIONS_DUPLICATE",
  AUTOMATIONS_RUN: "AUTOMATIONS_RUN",
  AUTOMATIONS_STOP: "AUTOMATIONS_STOP",
  AUTOMATIONS_INPUT_RESPONSE: "AUTOMATIONS_INPUT_RESPONSE",
} as const

export const MAIN_TO_UI = {
  BOOTSTRAPPED: "BOOTSTRAPPED",
  VARIABLE_CHAINS_RESULT: "VARIABLE_CHAINS_RESULT",
  VARIABLE_CHAINS_RESULT_V2: "VARIABLE_CHAINS_RESULT_V2",
  SELECTION_EMPTY: "SELECTION_EMPTY",
  PRINT_COLOR_USAGES_SETTINGS: "PRINT_COLOR_USAGES_SETTINGS",
  PRINT_COLOR_USAGES_SELECTION: "PRINT_COLOR_USAGES_SELECTION",
  PRINT_COLOR_USAGES_STATUS: "PRINT_COLOR_USAGES_STATUS",
  PRINT_COLOR_USAGES_UPDATE_PREVIEW: "PRINT_COLOR_USAGES_UPDATE_PREVIEW",
  PRINT_COLOR_USAGES_PRINT_PREVIEW: "PRINT_COLOR_USAGES_PRINT_PREVIEW",
  MOCKUP_MARKUP_STATE: "MOCKUP_MARKUP_STATE",
  MOCKUP_MARKUP_STATUS: "MOCKUP_MARKUP_STATUS",
  MOCKUP_MARKUP_COLOR_PREVIEWS: "MOCKUP_MARKUP_COLOR_PREVIEWS",
  ERROR: "ERROR",
  // Variables Batch Rename
  BATCH_RENAME_COLLECTIONS_LIST: "BATCH_RENAME_COLLECTIONS_LIST",
  BATCH_RENAME_NAME_SET_READY: "BATCH_RENAME_NAME_SET_READY",
  BATCH_RENAME_IMPORT_PREVIEW: "BATCH_RENAME_IMPORT_PREVIEW",
  BATCH_RENAME_APPLY_PROGRESS: "BATCH_RENAME_APPLY_PROGRESS",
  BATCH_RENAME_APPLY_RESULT: "BATCH_RENAME_APPLY_RESULT",
  // Variables Export Import
  EXPORT_IMPORT_COLLECTIONS_LIST: "EXPORT_IMPORT_COLLECTIONS_LIST",
  EXPORT_IMPORT_SNAPSHOT_READY: "EXPORT_IMPORT_SNAPSHOT_READY",
  EXPORT_IMPORT_PREVIEW: "EXPORT_IMPORT_PREVIEW",
  EXPORT_IMPORT_APPLY_RESULT: "EXPORT_IMPORT_APPLY_RESULT",
  // Variables Create Linked Colors
  LINKED_COLORS_SELECTION: "LINKED_COLORS_SELECTION",
  LINKED_COLORS_CREATE_SUCCESS: "LINKED_COLORS_CREATE_SUCCESS",
  LINKED_COLORS_APPLY_SUCCESS: "LINKED_COLORS_APPLY_SUCCESS",
  LINKED_COLORS_RENAME_SUCCESS: "LINKED_COLORS_RENAME_SUCCESS",
  LINKED_COLORS_COLLECTIONS_LIST: "LINKED_COLORS_COLLECTIONS_LIST",
  // Variables Replace Usages
  REPLACE_USAGES_SELECTION: "REPLACE_USAGES_SELECTION",
  REPLACE_USAGES_PREVIEW: "REPLACE_USAGES_PREVIEW",
  REPLACE_USAGES_APPLY_PROGRESS: "REPLACE_USAGES_APPLY_PROGRESS",
  REPLACE_USAGES_APPLY_RESULT: "REPLACE_USAGES_APPLY_RESULT",
  // Library Swap
  LIBRARY_SWAP_SELECTION: "LIBRARY_SWAP_SELECTION",
  LIBRARY_SWAP_ANALYZE_RESULT: "LIBRARY_SWAP_ANALYZE_RESULT",
  LIBRARY_SWAP_PROGRESS: "LIBRARY_SWAP_PROGRESS",
  LIBRARY_SWAP_APPLY_RESULT: "LIBRARY_SWAP_APPLY_RESULT",
  LIBRARY_SWAP_PREVIEW_RESULT: "LIBRARY_SWAP_PREVIEW_RESULT",
  LIBRARY_SWAP_CAPTURE_RESULT: "LIBRARY_SWAP_CAPTURE_RESULT",
  LIBRARY_SWAP_PAIRS_UPDATED: "LIBRARY_SWAP_PAIRS_UPDATED",
  LIBRARY_SWAP_SCAN_LEGACY_RESULT: "LIBRARY_SWAP_SCAN_LEGACY_RESULT",
  LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT: "LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT",
  // Find Color Match
  FIND_COLOR_MATCH_COLLECTIONS: "FIND_COLOR_MATCH_COLLECTIONS",
  FIND_COLOR_MATCH_RESULT: "FIND_COLOR_MATCH_RESULT",
  FIND_COLOR_MATCH_PROGRESS: "FIND_COLOR_MATCH_PROGRESS",
  FIND_COLOR_MATCH_APPLY_RESULT: "FIND_COLOR_MATCH_APPLY_RESULT",
  FIND_COLOR_MATCH_HEX_RESULT: "FIND_COLOR_MATCH_HEX_RESULT",
  FIND_COLOR_MATCH_GROUPS: "FIND_COLOR_MATCH_GROUPS",
  // Library cache
  LIBRARY_CACHE_STATUS: "LIBRARY_CACHE_STATUS",
  // Automations
  AUTOMATIONS_LIST: "AUTOMATIONS_LIST",
  AUTOMATIONS_FULL: "AUTOMATIONS_FULL",
  AUTOMATIONS_SAVED: "AUTOMATIONS_SAVED",
  AUTOMATIONS_RUN_PROGRESS: "AUTOMATIONS_RUN_PROGRESS",
  AUTOMATIONS_RUN_RESULT: "AUTOMATIONS_RUN_RESULT",
  AUTOMATIONS_INPUT_REQUEST: "AUTOMATIONS_INPUT_REQUEST",
} as const

export type UiToMainMessage =
  | { type: typeof UI_TO_MAIN.BOOT }
  | { type: typeof UI_TO_MAIN.SET_ACTIVE_TOOL; tool: ActiveTool }
  | { type: typeof UI_TO_MAIN.INSPECT_SELECTION_FOR_VARIABLE_CHAINS }
  | { type: typeof UI_TO_MAIN.COLOR_CHAIN_REPLACE_MAIN_COLOR; request: ColorChainReplaceMainColorRequest }
  | { type: typeof UI_TO_MAIN.COLOR_CHAIN_NOTIFY; message: string }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS; settings: PrintColorUsagesUiSettings }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT; settings: PrintColorUsagesUiSettings }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_PREVIEW_UPDATE; settings: PrintColorUsagesUiSettings; scope: "selection" | "page" | "all_pages" }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE; settings: PrintColorUsagesUiSettings; targetNodeIds?: string[] }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_FOCUS_NODE; nodeId: string }
  | { type: typeof UI_TO_MAIN.PRINT_COLOR_USAGES_RESET_LAYER_NAMES; nodeIds: string[] }
  | { type: typeof UI_TO_MAIN.MOCKUP_MARKUP_LOAD_STATE }
  | { type: typeof UI_TO_MAIN.MOCKUP_MARKUP_APPLY; request: MockupMarkupApplyRequest }
  | { type: typeof UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT; request: MockupMarkupApplyRequest }
  | { type: typeof UI_TO_MAIN.MOCKUP_MARKUP_GET_COLOR_PREVIEWS; forceModeName: MockupMarkupApplyRequest["forceModeName"] }
  // Variables Batch Rename
  | { type: typeof UI_TO_MAIN.BATCH_RENAME_EXPORT_NAME_SET; request: BatchRenameExportNameSetRequest }
  | { type: typeof UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT; request: BatchRenamePreviewImportRequest }
  | { type: typeof UI_TO_MAIN.BATCH_RENAME_APPLY_IMPORT; request: BatchRenameApplyImportRequest }
  // Variables Export Import
  | { type: typeof UI_TO_MAIN.EXPORT_IMPORT_EXPORT_SNAPSHOT; request: ExportImportExportRequest }
  | { type: typeof UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT; request: ExportImportPreviewRequest }
  | { type: typeof UI_TO_MAIN.EXPORT_IMPORT_APPLY_SNAPSHOT; request: ExportImportApplyRequest }
  // Variables Create Linked Colors
  | { type: typeof UI_TO_MAIN.LINKED_COLORS_CREATE; request: LinkedColorsCreateAliasRequest }
  | { type: typeof UI_TO_MAIN.LINKED_COLORS_APPLY_EXISTING; request: LinkedColorsApplyExistingRequest }
  | { type: typeof UI_TO_MAIN.LINKED_COLORS_RENAME; request: LinkedColorsRenameVariableRequest }
  // Variables Replace Usages
  | { type: typeof UI_TO_MAIN.REPLACE_USAGES_PREVIEW; request: ReplaceUsagesPreviewRequest }
  | { type: typeof UI_TO_MAIN.REPLACE_USAGES_APPLY; request: ReplaceUsagesApplyRequest }
  // Library Swap
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_ANALYZE; request: LibrarySwapAnalyzeRequest }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_PREVIEW; request: LibrarySwapPreviewRequest }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_APPLY; request: LibrarySwapApplyRequest }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_CLEAR_PREVIEWS }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_SET_CUSTOM_MAPPING; jsonText: string }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_FOCUS_NODE; nodeId: string }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_OLD }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_CAPTURE_NEW }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_REMOVE_PAIR; oldKey: string }
  | { type: typeof UI_TO_MAIN.LIBRARY_SWAP_SCAN_LEGACY_RESET; nodeId: string; property: "fill" | "stroke" }
  // Find Color Match
  | { type: typeof UI_TO_MAIN.FIND_COLOR_MATCH_SCAN }
  | { type: typeof UI_TO_MAIN.FIND_COLOR_MATCH_SET_COLLECTION; collectionKey: string }
  | { type: typeof UI_TO_MAIN.FIND_COLOR_MATCH_SET_MODE; modeId: string }
  | { type: typeof UI_TO_MAIN.FIND_COLOR_MATCH_APPLY; request: FindColorMatchApplyRequest }
  | { type: typeof UI_TO_MAIN.FIND_COLOR_MATCH_FOCUS_NODE; nodeId: string }
  | { type: typeof UI_TO_MAIN.FIND_COLOR_MATCH_HEX_LOOKUP; hex: string }
  | { type: typeof UI_TO_MAIN.FIND_COLOR_MATCH_SET_GROUP; group: string | null }
  // Window
  | { type: typeof UI_TO_MAIN.RESIZE_WINDOW; width: number; height: number }
  // Automations
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_LOAD }
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_GET; automationId: string }
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_SAVE; automation: AutomationPayload }
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_DELETE; automationId: string }
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_DUPLICATE; automationId: string }
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_RUN; automationId: string; runToStepIndex?: number }
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_STOP }
  | { type: typeof UI_TO_MAIN.AUTOMATIONS_INPUT_RESPONSE; value: string; cancelled?: boolean }


export type PrintColorUsagesUiSettings = {
  textPosition: "left" | "right"
  showLinkedColors: boolean
  showFolderNames: boolean
  textTheme: "dark" | "light"
  checkByContent: boolean
  checkNested: boolean
  printDistance: number
  applyTextColor: boolean
  applyTextStyle: boolean
}

export type PrintColorUsagesStatus =
  | { status: "idle" }
  | { status: "working"; message: string }
  | { status: "done"; message: string }
  | { status: "error"; message: string }

export type PrintColorUsagesUpdatePreviewEntry = {
  nodeId: string
  nodeName: string
  oldText: string
  newText: string
  oldLayerName: string
  newLayerName: string
  textChanged: boolean
  layerNameChanged: boolean
  linkedColorChanged: boolean
  resolvedBy: "layer_variable_id" | "layer_name" | "text_content"
  contentMismatch?: {
    contentVariableId: string
    contentVariableName: string
    layerVariableId: string
    layerVariableName: string
  }
}

export type PrintColorUsagesUpdatePreviewPayload = {
  scope: "selection" | "page" | "all_pages"
  totals: {
    candidates: number
    changed: number
    unchanged: number
    skipped: number
  }
  entries: PrintColorUsagesUpdatePreviewEntry[]
}

export type PrintColorUsagesPrintPreviewEntry = {
  label: string
  layerName: string
  variableId?: string
  linkedColorName?: string
}

export type PrintColorUsagesPrintPreviewPayload = {
  entries: PrintColorUsagesPrintPreviewEntry[]
}

export type MockupMarkupApplyRequest = {
  presetColor: MockupMarkupColorPreset
  presetTypography: MockupMarkupTypographyPreset
  forceModeName: "dark" | "light"
  width400: boolean
}

export type MockupMarkupTypographyPreset = "h1" | "h2" | "h3" | "description" | "paragraph"
export type MockupMarkupColorPreset = "text" | "text-secondary" | "purple"

export type MockupMarkupState = {
  selectionSize: number
  textNodeCount: number
  hasSourceTextNode: boolean
}

export type MockupMarkupStatus =
  | { status: "idle" }
  | { status: "working"; message: string }

export type MockupMarkupColorPreview = {
  hex: string | null
  opacityPercent: number | null
}

export type MockupMarkupColorPreviews = {
  text: MockupMarkupColorPreview
  textSecondary: MockupMarkupColorPreview
  purple: MockupMarkupColorPreview
}

export type ModeChain = {
  modeId: string
  modeName: string
  chain: Array<string>
  /**
   * Variable IDs for each chain item (same order/length as `chain`).
   * Missing/legacy payloads may omit this field.
   */
  chainVariableIds?: Array<string>
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

export type ColorChainReplaceMainColorRequest = {
  sourceVariableId: string
  targetVariableId: string
}

export type MainToUiMessage =
  | { type: typeof MAIN_TO_UI.BOOTSTRAPPED; command: string; selectionSize: number }
  | { type: typeof MAIN_TO_UI.VARIABLE_CHAINS_RESULT; results: Array<LayerInspectionResult> }
  | { type: typeof MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2; results: Array<LayerInspectionResultV2> }
  | { type: typeof MAIN_TO_UI.SELECTION_EMPTY }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS; settings: PrintColorUsagesUiSettings }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION; selectionSize: number }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS; status: PrintColorUsagesStatus }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_UPDATE_PREVIEW; payload: PrintColorUsagesUpdatePreviewPayload }
  | { type: typeof MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW; payload: PrintColorUsagesPrintPreviewPayload }
  | { type: typeof MAIN_TO_UI.MOCKUP_MARKUP_STATE; state: MockupMarkupState }
  | { type: typeof MAIN_TO_UI.MOCKUP_MARKUP_STATUS; status: MockupMarkupStatus }
  | { type: typeof MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS; previews: MockupMarkupColorPreviews }
  | { type: typeof MAIN_TO_UI.ERROR; message: string }
  // Variables Batch Rename
  | { type: typeof MAIN_TO_UI.BATCH_RENAME_COLLECTIONS_LIST; collections: VariableCollectionInfo[] }
  | { type: typeof MAIN_TO_UI.BATCH_RENAME_NAME_SET_READY; payload: BatchRenameNameSetReadyPayload }
  | { type: typeof MAIN_TO_UI.BATCH_RENAME_IMPORT_PREVIEW; payload: BatchRenamePreviewPayload }
  | { type: typeof MAIN_TO_UI.BATCH_RENAME_APPLY_PROGRESS; progress: BatchRenameProgress }
  | { type: typeof MAIN_TO_UI.BATCH_RENAME_APPLY_RESULT; payload: BatchRenameApplyResultPayload }
  // Variables Export Import
  | { type: typeof MAIN_TO_UI.EXPORT_IMPORT_COLLECTIONS_LIST; collections: VariableCollectionInfo[] }
  | { type: typeof MAIN_TO_UI.EXPORT_IMPORT_SNAPSHOT_READY; payload: ExportImportSnapshotReadyPayload }
  | { type: typeof MAIN_TO_UI.EXPORT_IMPORT_PREVIEW; payload: ExportImportPreviewPayload }
  | { type: typeof MAIN_TO_UI.EXPORT_IMPORT_APPLY_RESULT; payload: ExportImportApplyResultPayload }
  // Variables Create Linked Colors
  | { type: typeof MAIN_TO_UI.LINKED_COLORS_SELECTION; payload: LinkedColorsSelectionPayload }
  | { type: typeof MAIN_TO_UI.LINKED_COLORS_CREATE_SUCCESS; result: LinkedColorsCreateResult }
  | { type: typeof MAIN_TO_UI.LINKED_COLORS_APPLY_SUCCESS; result: LinkedColorsApplyResult }
  | { type: typeof MAIN_TO_UI.LINKED_COLORS_RENAME_SUCCESS; result: LinkedColorsRenameResult }
  | { type: typeof MAIN_TO_UI.LINKED_COLORS_COLLECTIONS_LIST; collections: VariableCollectionInfo[] }
  // Variables Replace Usages
  | { type: typeof MAIN_TO_UI.REPLACE_USAGES_SELECTION; payload: LinkedColorsSelectionPayload }
  | { type: typeof MAIN_TO_UI.REPLACE_USAGES_PREVIEW; payload: ReplaceUsagesPreviewPayload }
  | { type: typeof MAIN_TO_UI.REPLACE_USAGES_APPLY_PROGRESS; progress: ReplaceUsagesProgress }
  | { type: typeof MAIN_TO_UI.REPLACE_USAGES_APPLY_RESULT; payload: ReplaceUsagesApplyResultPayload }
  // Library Swap
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_SELECTION; selectionSize: number }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_ANALYZE_RESULT; payload: LibrarySwapAnalyzeResultPayload }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_PROGRESS; progress: LibrarySwapProgress }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_APPLY_RESULT; payload: LibrarySwapApplyResultPayload }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_PREVIEW_RESULT; previewed: number }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_CAPTURE_RESULT; side: "old" | "new"; name: string | null }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_PAIRS_UPDATED; pairs: ManualPair[] }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESULT; payload: LibrarySwapScanLegacyResultPayload }
  | { type: typeof MAIN_TO_UI.LIBRARY_SWAP_SCAN_LEGACY_RESET_RESULT; ok: boolean; nodeId: string }
  // Find Color Match
  | { type: typeof MAIN_TO_UI.FIND_COLOR_MATCH_COLLECTIONS; payload: FindColorMatchCollectionsPayload }
  | { type: typeof MAIN_TO_UI.FIND_COLOR_MATCH_RESULT; payload: FindColorMatchResultPayload }
  | { type: typeof MAIN_TO_UI.FIND_COLOR_MATCH_PROGRESS; progress: FindColorMatchProgressPayload }
  | { type: typeof MAIN_TO_UI.FIND_COLOR_MATCH_APPLY_RESULT; result: FindColorMatchApplyResultPayload }
  | { type: typeof MAIN_TO_UI.FIND_COLOR_MATCH_HEX_RESULT; payload: FindColorMatchHexResultPayload }
  | { type: typeof MAIN_TO_UI.FIND_COLOR_MATCH_GROUPS; groupsByCollection: Record<string, string[]> }
  // Library cache
  | { type: typeof MAIN_TO_UI.LIBRARY_CACHE_STATUS; status: LibraryCacheStatusPayload }
  // Automations
  | { type: typeof MAIN_TO_UI.AUTOMATIONS_LIST; automations: AutomationListItem[] }
  | { type: typeof MAIN_TO_UI.AUTOMATIONS_FULL; automation: AutomationPayload | null }
  | { type: typeof MAIN_TO_UI.AUTOMATIONS_SAVED; automation: AutomationPayload }
  | { type: typeof MAIN_TO_UI.AUTOMATIONS_RUN_PROGRESS; progress: AutomationsRunProgress }
  | { type: typeof MAIN_TO_UI.AUTOMATIONS_RUN_RESULT; result: AutomationsRunResult }
  | { type: typeof MAIN_TO_UI.AUTOMATIONS_INPUT_REQUEST; request: AutomationsInputRequest }

// ============================================================================
// Variables Batch Rename Types
// ============================================================================

export type VariableCollectionInfo = {
  id: string
  name: string
  modeCount: number
  variableCount: number
}

export type BatchRenameExportNameSetRequest = {
  setName: string
  description?: string
  collectionId?: string | null
  collectionIds?: string[] | null
  types?: VariableResolvedDataType[]
  includeCurrentName?: boolean
}

export type BatchRenameNameSetReadyPayload = {
  filename: string
  jsonText: string
}

export type BatchRenamePreviewImportRequest = {
  jsonText: string
}

export type BatchRenameApplyImportRequest = {
  entries: Array<{
    variableId: string
    expectedOldName?: string
    newName: string
  }>
}

export type BatchRenamePreviewEntryStatus =
  | "rename"
  | "unchanged"
  | "conflict"
  | "missing"
  | "stale"
  | "invalid"
  | "out_of_scope"

export type BatchRenamePreviewEntry = {
  variableId: string
  collectionId?: string
  collectionName?: string
  resolvedType?: VariableResolvedDataType
  currentName?: string
  expectedOldName?: string
  newName?: string
  status: BatchRenamePreviewEntryStatus
  reason?: string
  warning?: string
  conflictWith?: Array<{ variableId: string; name: string }>
}

export type BatchRenamePlanMeta = {
  version: 1
  title?: string
  description?: string
  createdAt?: string
  scope?: { collectionId: string | null; types: VariableResolvedDataType[] }
}

export type BatchRenamePreviewPayload = {
  meta: BatchRenamePlanMeta
  totals: {
    considered: number
    renames: number
    unchanged: number
    conflicts: number
    missing: number
    stale: number
    invalid: number
    outOfScope: number
  }
  entries: BatchRenamePreviewEntry[]
}

export type BatchRenameApplyEntryResult = {
  variableId: string
  beforeName?: string
  afterName?: string
  status: "renamed" | "unchanged" | "skipped" | "failed"
  reason?: string
}

export type BatchRenameApplyResultPayload = {
  totals: { renamed: number; unchanged: number; skipped: number; failed: number }
  results: BatchRenameApplyEntryResult[]
}

export type BatchRenameProgress = {
  current: number
  total: number
  message: string
}

// Legacy types for backward compatibility
export type BatchRenameImportData = {
  collectionId: string
  mappings: BatchRenameMapping[]
}

export type BatchRenameMapping = {
  variableId: string
  oldName: string
  newName: string
}

export type BatchRenameNameSetData = {
  collectionId: string
  collectionName: string
  variables: Array<{
    id: string
    name: string
  }>
}

export type BatchRenamePreviewResult = {
  valid: boolean
  changes: BatchRenameMapping[]
  errors: string[]
}

export type BatchRenameApplyResult = {
  success: boolean
  renamed: number
  errors: string[]
}

// Types re-exported for use in messages
export type VariableResolvedDataType = "BOOLEAN" | "COLOR" | "FLOAT" | "STRING"

// ============================================================================
// Variables Export Import Types
// ============================================================================

export type ExportImportExportRequest = {
  collectionIds?: string[] | null
  /** When true, include each variable's key in the JSON (for use in hardcoded Find Color Match data). */
  includeKey?: boolean
}

export type ExportImportSnapshotReadyPayload = {
  files: Array<{ filename: string; jsonText: string }>
}

export type ExportImportPreviewRequest = {
  jsonText: string
}

export type ExportImportApplyRequest = {
  jsonText: string
}

export type ExportImportPreviewEntryStatus =
  | "create"
  | "update"
  | "rename"
  | "conflict"
  | "missing_collection"
  | "invalid"

export type ExportImportPreviewEntry = {
  collectionName: string
  variableName: string
  status: ExportImportPreviewEntryStatus
  reason?: string
}

export type ExportImportPreviewPayload = {
  totals: {
    considered: number
    create: number
    update: number
    rename: number
    conflicts: number
    missingCollections: number
    invalid: number
  }
  entries: ExportImportPreviewEntry[]
}

export type ExportImportApplyResultPayload = {
  totals: { created: number; updated: number; renamed: number; skipped: number; failed: number }
  results: Array<{
    collectionName: string
    variableName: string
    status: "created" | "updated" | "renamed" | "skipped" | "failed"
    reason?: string
  }>
}

// Legacy types for backward compatibility
export type ExportImportSnapshotData = {
  collectionId: string
  snapshot: ExportImportSnapshot
}

export type ExportImportSnapshot = {
  version: string
  collectionId: string
  collectionName: string
  modes: Array<{
    id: string
    name: string
  }>
  variables: Array<ExportImportVariableEntry>
}

export type ExportImportVariableEntry = {
  id: string
  name: string
  resolvedType: string
  values: Record<string, unknown> // modeId -> value
}

export type ExportImportPreviewResult = {
  valid: boolean
  additions: number
  modifications: number
  deletions: number
  errors: string[]
}

export type ExportImportApplyResult = {
  success: boolean
  added: number
  modified: number
  deleted: number
  errors: string[]
}

// ============================================================================
// Variables Create Linked Colors Types
// ============================================================================

export type LinkedColorsVariableMatch = {
  id: string
  name: string
  collectionId: string
  collectionName: string
}

export type LinkedColorsVariableUsage = {
  id: string
  name: string
  collectionId: string
  collectionName: string
  resolvedType: VariableResolvedDataType
  properties: string[]
  nodes: Array<{ id: string; name: string }>
  defaultName: string
  matches: LinkedColorsVariableMatch[]
  options: LinkedColorsVariableMatch[]
  groups: string[]
}

export type LinkedColorsColorUsage = {
  hex: string
  properties: string[]
  nodes: Array<{ id: string; name: string }>
}

export type LinkedColorsSelectionPayload = {
  variables: LinkedColorsVariableUsage[]
  selectionSize: number
  colors: LinkedColorsColorUsage[]
}

export type LinkedColorsCreateAliasRequest = {
  variableId: string
  targetVariableId: string
}

export type LinkedColorsApplyExistingRequest = {
  variableId: string
  targetVariableId: string
}

export type LinkedColorsRenameVariableRequest = {
  variableId: string
  newName: string
}

export type LinkedColorsCreateResult = {
  success: boolean
  message: string
  variableId?: string
}

export type LinkedColorsApplyResult = {
  success: boolean
  message: string
  nodesChanged?: number
}

export type LinkedColorsRenameResult = {
  success: boolean
  message: string
  newName?: string
}

// Legacy types for backward compatibility
export type LinkedColorsCreateRequest = {
  collectionId: string
  variableName: string
  colorValues: Record<string, string> // modeId -> hex color
}

export type LinkedColorsApplyRequest = {
  nodeIds: string[]
  variableId: string
}

export type LinkedColorsRenameRequest = {
  variableId: string
  newName: string
}

export type LinkedColorsSelectionInfo = {
  nodeCount: number
  colorVariables: Array<{
    variableId: string
    variableName: string
    collectionName: string
    usageCount: number
    hex: string | null
  }>
}

export type LinkedColorsResult = {
  success: boolean
  message: string
  variableId?: string
  variableName?: string
}

// ============================================================================
// Variables Replace Usages Types
// ============================================================================

export type ReplaceUsagesScope = "selection" | "page" | "all_pages"

export type ReplaceUsagesPhase = "component" | "instance_in_component" | "other"

export type ReplaceUsagesPreviewRequest = {
  scope: ReplaceUsagesScope
  renamePrints: boolean
  includeHidden: boolean
  mappingJsonText?: string
}

export type ReplaceUsagesApplyRequest = {
  scope: ReplaceUsagesScope
  renamePrints: boolean
  includeHidden: boolean
  mappingJsonText?: string
}

export type ReplaceUsagesMappingRow = {
  sourceId: string
  sourceName: string
  sourceCollectionId: string
  sourceCollectionName: string
  targetId: string
  targetName: string
  reason: string
  bindingsTotal: number
  bindingsByPhase: Record<ReplaceUsagesPhase, number>
  nodesTotal: number
  nodesByPhase: Record<ReplaceUsagesPhase, number>
  defaultName: string
}

export type ReplaceUsagesInvalidMappingRow = {
  from: string
  to: string
  status: "ok" | "missing_source" | "missing_target" | "duplicate_from" | "invalid"
  reason?: string
}

export type ReplaceUsagesPreviewPayload = {
  scope: ReplaceUsagesScope
  totals: {
    mappings: number
    invalidMappingRows: number
    nodesWithChanges: number
    bindingsWithChanges: number
    nodesWithChangesByPhase: Record<ReplaceUsagesPhase, number>
    bindingsWithChangesByPhase: Record<ReplaceUsagesPhase, number>
    printsRenameCandidates: number
  }
  mappings: ReplaceUsagesMappingRow[]
  invalidMappingRows: ReplaceUsagesInvalidMappingRow[]
}

export type ReplaceUsagesApplyResultPayload = {
  totals: {
    nodesVisited: number
    nodesChanged: number
    bindingsChanged: number
    nodesSkippedLocked: number
    bindingsSkippedUnsupported: number
    bindingsFailed: number
    printsRenamed: number
  }
}

export type ReplaceUsagesProgress = {
  current: number
  total: number
  message: string
}

// Legacy types for backward compatibility
export type ReplaceUsagesMapping = {
  fromVariableId: string
  toVariableId: string
}

export type ReplaceUsagesSelectionInfo = {
  nodeCount: number
  variableUsages: Array<{
    variableId: string
    variableName: string
    collectionName: string
    usageCount: number
    property: string // e.g., "fill", "stroke", "effect"
  }>
  allVariables: Array<{
    id: string
    name: string
    collectionName: string
    resolvedType: string
  }>
}

export type ReplaceUsagesPreviewResult = {
  valid: boolean
  replacements: Array<{
    nodeId: string
    nodeName: string
    property: string
    fromVariableName: string
    toVariableName: string
  }>
  errors: string[]
}

export type ReplaceUsagesApplyResult = {
  success: boolean
  replaced: number
  errors: string[]
}

// ============================================================================
// Library Swap Types
// ============================================================================

export type LibrarySwapScope = "selection" | "page" | "all_pages"

export type LibrarySwapAnalyzeRequest = {
  scope: LibrarySwapScope
  includeHidden: boolean
  useBuiltInIcons: boolean
  useBuiltInUikit: boolean
  customMappingJsonText?: string
}

export type LibrarySwapPreviewRequest = {
  scope: LibrarySwapScope
  includeHidden: boolean
  useBuiltInIcons: boolean
  useBuiltInUikit: boolean
  customMappingJsonText?: string
  sampleSize?: number
}

export type LibrarySwapApplyRequest = {
  scope: LibrarySwapScope
  includeHidden: boolean
  useBuiltInIcons: boolean
  useBuiltInUikit: boolean
  customMappingJsonText?: string
}

export type LibrarySwapAnalyzeItem = {
  nodeId: string
  instanceName: string
  pageName: string
  oldComponentName: string
  newComponentName: string
}

export type LibrarySwapAnalyzeResultPayload = {
  totalInstances: number
  mappableInstances: number
  uniqueOldKeys: number
  items: LibrarySwapAnalyzeItem[]
}

export type LibrarySwapProgress = {
  current: number
  total: number
  message: string
}

export type LibrarySwapSwappedItem = {
  nodeId: string
  name: string
  oldComponentName: string
  newComponentName: string
}

export type LibrarySwapApplyResultPayload = {
  swapped: number
  skipped: number
  swappedItems: LibrarySwapSwappedItem[]
}

export type ManualPair = {
  oldKey: string
  newKey: string
  oldName: string
  newName: string
}

export type LibrarySwapLegacyStyleItem = {
  nodeId: string
  nodeName: string
  pageName: string
  styleName: string
  styleKey: string
  property: "fill" | "stroke"
  isOverride: boolean
  colorHex: string | null
}

export type LibrarySwapLegacyComponentItem = {
  nodeId: string
  nodeName: string
  pageName: string
  oldComponentKey: string
  oldComponentName: string
  category: "mapped" | "text_only" | "unmapped"
  newComponentName?: string
  description?: string
}

export type LibrarySwapScanLegacyResultPayload = {
  styles: LibrarySwapLegacyStyleItem[]
  components: LibrarySwapLegacyComponentItem[]
  totalNodesScanned: number
}

// ============================================================================
// Library Cache Types
// ============================================================================

export type LibraryCacheStatusPayload =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "updating"; current: number; total: number; message: string }
  | { state: "ready" }

// ============================================================================
// Find Color Match Types
// ============================================================================

export type FindColorMatchCollectionInfo = {
  key: string
  name: string
  libraryName: string | null
  isLibrary: boolean
  modes: Array<{ modeId: string; modeName: string }>
}

export type FindColorMatchCollectionsPayload = {
  collections: FindColorMatchCollectionInfo[]
  defaultCollectionKey: string | null
}

export type FindColorMatchFoundColorEntry = {
  hex: string
  r: number
  g: number
  b: number
  opacity: number
  nodeId: string
  nodeName: string
  colorType: "FILL" | "STROKE" | "TEXT"
  paintIndex: number
  sourceType: "VARIABLE" | "STYLE" | "RAW"
  sourceName: string | null
}

export type FindColorMatchVariableEntry = {
  variableId: string
  variableKey: string
  variableName: string
  hex: string
  opacityPercent: number
  matchPercent: number
}

export type FindColorMatchResultEntry = {
  found: FindColorMatchFoundColorEntry
  bestMatch: FindColorMatchVariableEntry | null
  allMatches: FindColorMatchVariableEntry[]
}

export type FindColorMatchResultPayload = {
  entries: FindColorMatchResultEntry[]
  collectionKey: string
  modeId: string | null
}

export type FindColorMatchProgressPayload = {
  current: number
  total: number
  message: string
}

export type FindColorMatchApplyRequest = {
  nodeId: string
  variableId: string
  /** Library variable key for import when variable is not yet in document. Required for Apply with hardcoded/team library variables. */
  variableKey?: string | null
  colorType: "FILL" | "STROKE" | "TEXT"
  paintIndex: number
}

export type FindColorMatchApplyResultPayload = {
  ok: boolean
  reason?: string
  nodeId: string
  variableId: string
}

export type FindColorMatchHexResultPayload = {
  hex: string
  allMatches: FindColorMatchVariableEntry[]
}

// ============================================================================
// Automations Types
// ============================================================================

export type AutomationStepPayload = {
  id: string
  actionType: string
  params: Record<string, unknown>
  enabled: boolean
  outputName?: string
  children?: AutomationStepPayload[]
  elseChildren?: AutomationStepPayload[]
  input?: string
}

export type AutomationPayload = {
  id: string
  name: string
  emoji?: string
  steps: AutomationStepPayload[]
  createdAt: number
  updatedAt: number
}

export type AutomationListItem = {
  id: string
  name: string
  emoji?: string
  stepCount: number
  createdAt: number
  updatedAt: number
}

export type AutomationsRunProgress = {
  automationName: string
  currentStep: number
  totalSteps: number
  stepName: string
  status: "running" | "done" | "error"
}

export type AutomationsStepLog = {
  stepIndex: number
  stepName: string
  message: string
  itemsIn: number
  itemsOut: number
  status: "success" | "skipped" | "error"
  error?: string
}

export type StepOutputPreviewPayload = {
  stepId: string
  stepIndex: number
  status: "success" | "error" | "skipped"
  nodesAfter: number
  nodeSample: { id: string; name: string; type: string }[]
  dataOutput?: string | number | boolean | (string | number | boolean)[]
  pipelineVarsSnapshot: Record<string, string>
  savedNodeSetsCount: Record<string, number>
  durationMs: number
  message?: string
  error?: string
}

export type AutomationsRunResult = {
  success: boolean
  message: string
  stepsCompleted: number
  totalSteps: number
  errors: string[]
  log: AutomationsStepLog[]
  stepOutputs?: StepOutputPreviewPayload[]
}

export type AutomationsInputRequest = {
  label: string
  placeholder: string
  inputType: "text" | "textarea" | "select"
  defaultValue: string
  options?: string[]
}
