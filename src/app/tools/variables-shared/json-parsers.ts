// ============================================================================
// JSON Parsing Utilities
// Ported from variables-rename-helper
// ============================================================================

import type {
  ImportedRenamePlan,
  ImportedRenamePlanMeta,
  ImportedRenamePlanEntry,
  SnapshotExportDoc,
  SnapshotFlatEntry,
  UsagesReplaceMappingJsonDoc,
} from './types'

// ============================================================================
// Helpers
// ============================================================================

export const isString = (value: unknown): value is string => typeof value === 'string'

// ============================================================================
// Rename Plan Parsing
// ============================================================================

export const parseImportedRenamePlan = (
  jsonText: string
): { plan: ImportedRenamePlan; meta: ImportedRenamePlanMeta } => {
  let raw: unknown
  try {
    raw = JSON.parse(jsonText)
  } catch {
    throw new Error('Invalid JSON. Please check the file contents.')
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid plan: expected a JSON object.')
  }

  const obj = raw as Record<string, unknown>
  if (obj.version !== 1) {
    throw new Error('Invalid plan: version must be 1.')
  }

  // Backward compatible:
  // - rename plan: { entries: [{ id, expectedOldName?, newName }] }
  // - name set:    { name|set.name, description|set.description, tokens: [{ id, name }] }
  const entriesRaw = Array.isArray(obj.entries)
    ? obj.entries
    : Array.isArray(obj.tokens)
      ? obj.tokens
      : null
  if (!entriesRaw) {
    throw new Error('Invalid plan: expected "entries" or "tokens" array.')
  }

  const setRaw = (obj.set ?? null) as Record<string, unknown> | null
  const titleRaw = obj.title ?? obj.name ?? setRaw?.name
  const descriptionRaw = obj.description ?? setRaw?.description
  const createdAtRaw = obj.createdAt ?? setRaw?.createdAt

  const scopeRaw = (obj.scope ?? null) as Record<string, unknown> | null
  const scopeTypesRaw = scopeRaw?.types
  const scopeCollectionIdRaw = scopeRaw?.collectionId

  const types =
    Array.isArray(scopeTypesRaw) && scopeTypesRaw.length
      ? (scopeTypesRaw.filter(isString) as VariableResolvedDataType[])
      : (['COLOR', 'FLOAT', 'STRING', 'BOOLEAN'] as VariableResolvedDataType[])

  const scopeCollectionId =
    scopeCollectionIdRaw === null || scopeCollectionIdRaw === undefined
      ? null
      : isString(scopeCollectionIdRaw)
        ? scopeCollectionIdRaw
        : null

  const entries: ImportedRenamePlanEntry[] = entriesRaw.map((entry) => {
    if (!entry || typeof entry !== 'object') {
      return { id: '', newName: '' }
    }
    const e = entry as Record<string, unknown>
    const id = isString(e.id) ? e.id.trim() : ''
    const currentName = isString(e.currentName) ? e.currentName.trim() : undefined
    const newName = isString(e.newName)
      ? e.newName.trim()
      : isString(e.name)
        ? e.name.trim()
        : currentName
          ? currentName
          : ''
    const expectedOldName = isString(e.expectedOldName) ? e.expectedOldName.trim() : currentName
    return { id, expectedOldName, newName }
  })

  const plan: ImportedRenamePlan = {
    version: 1,
    title: isString(titleRaw) ? titleRaw : undefined,
    createdAt: isString(createdAtRaw) ? createdAtRaw : undefined,
    scope: { collectionId: scopeCollectionId, types },
    entries,
  }

  const meta: ImportedRenamePlanMeta = {
    version: 1,
    title: plan.title,
    description: isString(descriptionRaw) ? descriptionRaw : undefined,
    createdAt: plan.createdAt,
    scope: { collectionId: scopeCollectionId, types },
  }

  return { plan, meta }
}

// ============================================================================
// Snapshot Parsing
// ============================================================================

export const parseSnapshotDoc = (jsonText: string): SnapshotExportDoc => {
  let raw: unknown
  try {
    raw = JSON.parse(jsonText)
  } catch {
    throw new Error('Invalid JSON. Please check the file contents.')
  }
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid snapshot: expected a JSON object.')
  }
  const obj = raw as Record<string, unknown>
  const collectionsRaw = obj.collections
  if (!Array.isArray(collectionsRaw)) {
    throw new Error('Invalid snapshot: expected "collections" array.')
  }
  return { collections: collectionsRaw as SnapshotExportDoc['collections'] }
}

export const snapshotTypeToResolvedType = (type: unknown): VariableResolvedDataType | null => {
  const t = String(type || '').toLowerCase()
  if (t === 'color') return 'COLOR'
  if (t === 'number') return 'FLOAT'
  if (t === 'string') return 'STRING'
  if (t === 'boolean') return 'BOOLEAN'
  return null
}

export const flattenSnapshotVariablesTree = (
  collectionName: string,
  node: unknown,
  prefix: string[],
  out: SnapshotFlatEntry[]
): void => {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return
  }
  const obj = node as Record<string, unknown>

  // leaf entry: { type, values, ... }
  if (
    'type' in obj &&
    'values' in obj &&
    obj.values &&
    typeof obj.values === 'object' &&
    !Array.isArray(obj.values)
  ) {
    const resolvedType = snapshotTypeToResolvedType(obj.type)
    const values = obj.values as Record<string, unknown>
    const name = prefix.join('/').trim()
    if (!name || !resolvedType) {
      return
    }
    const id = isString(obj.id) ? obj.id.trim() : undefined
    const description = isString(obj.description) ? obj.description : undefined
    const scopes = Array.isArray(obj.scopes) ? (obj.scopes.filter(isString) as string[]) : undefined
    out.push({ collectionName, variableName: name, id, resolvedType, values, description, scopes })
    return
  }

  for (const [key, child] of Object.entries(obj)) {
    const nextKey = String(key || '').trim()
    if (!nextKey) continue
    flattenSnapshotVariablesTree(collectionName, child, [...prefix, nextKey], out)
  }
}

export const flattenSnapshotDoc = (doc: SnapshotExportDoc): SnapshotFlatEntry[] => {
  const entries: SnapshotFlatEntry[] = []
  for (const c of doc.collections ?? []) {
    const name = String(c.name || '').trim()
    const vars = c.variables
    if (!name || !vars) continue
    flattenSnapshotVariablesTree(name, vars, [], entries)
  }
  return entries
}

// ============================================================================
// Usages Replace Mapping Parsing
// ============================================================================

export const parseUsagesReplaceMappingJson = (jsonText: string): UsagesReplaceMappingJsonDoc => {
  let raw: unknown
  try {
    raw = JSON.parse(jsonText)
  } catch {
    throw new Error('Invalid JSON. Please check the file contents.')
  }
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid mapping: expected a JSON object.')
  }
  const obj = raw as Record<string, unknown>
  if (obj.version !== 1) {
    throw new Error('Invalid mapping: version must be 1.')
  }
  const replacementsRaw = obj.replacements
  if (!Array.isArray(replacementsRaw)) {
    throw new Error('Invalid mapping: expected "replacements" array.')
  }

  const collectionName = isString(obj.collectionName) ? obj.collectionName.trim() : undefined
  const collectionId = isString(obj.collectionId) ? obj.collectionId.trim() : undefined
  const replacements = replacementsRaw.map((r) => {
    if (!r || typeof r !== 'object') return { from: '', to: '' }
    const row = r as Record<string, unknown>
    return {
      from: isString(row.from) ? row.from.trim() : '',
      to: isString(row.to) ? row.to.trim() : '',
    }
  })

  return { version: 1, collectionName, collectionId, replacements }
}

// ============================================================================
// Alias Resolution
// ============================================================================

export const resolveAliasFromSnapshotValue = async (
  raw: unknown,
  byCollectionName: Map<string, VariableCollection>,
  byCollectionAndName: Map<string, Map<string, Variable>>
): Promise<VariableAlias | null> => {
  const aliasString = (() => {
    if (
      raw &&
      typeof raw === 'object' &&
      !Array.isArray(raw) &&
      isString((raw as Record<string, unknown>).$alias)
    ) {
      return String((raw as Record<string, unknown>).$alias).trim()
    }
    return null
  })()
  if (!aliasString) return null
  const idx = aliasString.indexOf(':')
  if (idx <= 0) return null
  const collectionName = aliasString.slice(0, idx).trim()
  const variableName = aliasString.slice(idx + 1).trim()
  if (!collectionName || !variableName) return null
  const col = byCollectionName.get(collectionName)
  if (!col) return null
  const target = byCollectionAndName.get(col.id)?.get(variableName)
  if (!target) return null
  return { type: 'VARIABLE_ALIAS', id: target.id }
}
