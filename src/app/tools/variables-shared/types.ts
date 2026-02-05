// ============================================================================
// Shared Types for Variables Tools
// Ported from variables-rename-helper
// ============================================================================

export type VariableBindingMap = Record<string, VariableAlias | VariableAlias[] | undefined>

export type VariableMatch = {
  id: string
  name: string
  collectionId: string
  collectionName: string
}

export type VariableUsage = {
  id: string
  name: string
  collectionId: string
  collectionName: string
  resolvedType: VariableResolvedDataType
  properties: string[]
  nodes: Array<{ id: string; name: string }>
  defaultName: string
  matches: VariableMatch[]
  options: VariableMatch[]
  groups: string[]
}

export type ColorUsage = {
  hex: string
  properties: string[]
  nodes: Array<{ id: string; name: string }>
}

export type SelectionVariablesPayload = {
  variables: VariableUsage[]
  selectionSize: number
  colors: ColorUsage[]
}

// ============================================================================
// Rename Types
// ============================================================================

export type ImportedRenamePreviewEntryStatus =
  | "rename"
  | "unchanged"
  | "conflict"
  | "missing"
  | "stale"
  | "invalid"
  | "out_of_scope"

export type ImportedRenamePreviewEntry = {
  variableId: string
  collectionId?: string
  collectionName?: string
  resolvedType?: VariableResolvedDataType
  currentName?: string
  expectedOldName?: string
  newName?: string
  status: ImportedRenamePreviewEntryStatus
  reason?: string
  warning?: string
  conflictWith?: Array<{ variableId: string; name: string }>
}

export type ImportedRenamePlanMeta = {
  version: 1
  title?: string
  description?: string
  createdAt?: string
  scope?: { collectionId: string | null; types: VariableResolvedDataType[] }
}

export type ImportedRenamePreviewPayload = {
  meta: ImportedRenamePlanMeta
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
  entries: ImportedRenamePreviewEntry[]
}

export type ImportedRenameApplyEntryResult = {
  variableId: string
  beforeName?: string
  afterName?: string
  status: "renamed" | "unchanged" | "skipped" | "failed"
  reason?: string
}

export type ImportedRenameApplyResultPayload = {
  totals: { renamed: number; unchanged: number; skipped: number; failed: number }
  results: ImportedRenameApplyEntryResult[]
}

export type NameSetExportReadyPayload = {
  filename: string
  jsonText: string
}

// ============================================================================
// Snapshot Types
// ============================================================================

export type VariablesSnapshotImportPreviewEntryStatus =
  | "create"
  | "update"
  | "rename"
  | "conflict"
  | "missing_collection"
  | "invalid"

export type VariablesSnapshotImportPreviewEntry = {
  collectionName: string
  variableName: string
  status: VariablesSnapshotImportPreviewEntryStatus
  reason?: string
}

export type VariablesSnapshotImportPreviewPayload = {
  totals: {
    considered: number
    create: number
    update: number
    rename: number
    conflicts: number
    missingCollections: number
    invalid: number
  }
  entries: VariablesSnapshotImportPreviewEntry[]
}

export type VariablesSnapshotImportApplyResultPayload = {
  totals: { created: number; updated: number; renamed: number; skipped: number; failed: number }
  results: Array<{
    collectionName: string
    variableName: string
    status: "created" | "updated" | "renamed" | "skipped" | "failed"
    reason?: string
  }>
}

export type VariablesSnapshotExportReadyPayload = {
  files: Array<{ filename: string; jsonText: string }>
}

export type SnapshotFlatEntry = {
  collectionName: string
  variableName: string
  id?: string
  resolvedType: VariableResolvedDataType
  values: Record<string, unknown>
  description?: string
  scopes?: string[]
}

export type SnapshotExportCollectionDoc = {
  name: string
  modes: string[]
  variables: Record<string, unknown>
}

export type SnapshotExportDoc = {
  collections: SnapshotExportCollectionDoc[]
}

// ============================================================================
// Usages Replace Types
// ============================================================================

export type UsagesReplaceScope = "selection" | "page"

export type UsagesReplacePhase = "component" | "instance_in_component" | "other"

export type UsagesReplaceMappingRow = {
  sourceId: string
  sourceName: string
  sourceCollectionId: string
  sourceCollectionName: string
  targetId: string
  targetName: string
  reason: string
  bindingsTotal: number
  bindingsByPhase: Record<UsagesReplacePhase, number>
  nodesTotal: number
  nodesByPhase: Record<UsagesReplacePhase, number>
}

export type UsagesReplaceInvalidMappingRow = {
  from: string
  to: string
  status: "ok" | "missing_source" | "missing_target" | "duplicate_from" | "invalid"
  reason?: string
}

export type UsagesReplacePreviewPayload = {
  scope: UsagesReplaceScope
  totals: {
    mappings: number
    invalidMappingRows: number
    nodesWithChanges: number
    bindingsWithChanges: number
    nodesWithChangesByPhase: Record<UsagesReplacePhase, number>
    bindingsWithChangesByPhase: Record<UsagesReplacePhase, number>
    printsRenameCandidates: number
  }
  mappings: UsagesReplaceMappingRow[]
  invalidMappingRows: UsagesReplaceInvalidMappingRow[]
}

export type UsagesReplaceApplyResultPayload = {
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

export type UsagesReplaceMappingJsonDoc = {
  version: 1
  collectionName?: string
  collectionId?: string
  replacements: Array<{ from: string; to: string }>
}

// ============================================================================
// Request Payloads
// ============================================================================

export type ExportNameSetRequestPayload = {
  setName: string
  description?: string
  collectionId?: string | null
  collectionIds?: string[] | null
  types?: VariableResolvedDataType[]
  includeCurrentName?: boolean
}

export type PreviewImportedRenamePlanRequestPayload = {
  jsonText: string
}

export type ApplyImportedRenamePlanRequestPayload = {
  entries: Array<{
    variableId: string
    expectedOldName?: string
    newName: string
  }>
}

export type ExportVariablesSnapshotRequestPayload = {
  collectionIds?: string[] | null
}

export type PreviewVariablesSnapshotImportRequestPayload = {
  jsonText: string
}

export type ApplyVariablesSnapshotImportRequestPayload = {
  jsonText: string
}

export type PreviewUsagesReplaceRequestPayload = {
  scope: UsagesReplaceScope
  renamePrints: boolean
  includeHidden: boolean
  mappingJsonText?: string
}

export type ApplyUsagesReplaceRequestPayload = {
  scope: UsagesReplaceScope
  renamePrints: boolean
  includeHidden: boolean
  mappingJsonText?: string
}

// ============================================================================
// Collection Info
// ============================================================================

export type CollectionInfo = {
  id: string
  name: string
}

// ============================================================================
// Imported Plan Types
// ============================================================================

export type ImportedRenamePlanEntry = {
  id: string
  expectedOldName?: string
  newName: string
}

export type ImportedRenamePlanScope = {
  collectionId?: string | null
  types?: VariableResolvedDataType[]
}

export type ImportedRenamePlan = {
  version: 1
  title?: string
  createdAt?: string
  scope?: ImportedRenamePlanScope
  entries: ImportedRenamePlanEntry[]
}
