// ============================================================================
// Variable and Collection Caching Utilities
// Ported from variables-rename-helper
// ============================================================================

// Variable cache by ID
const variableCache = new Map<string, Variable>()

// Collection cache by ID
const collectionCache = new Map<string, VariableCollection>()

// Local variables cache by type
const localVariablesCache = new Map<VariableResolvedDataType, Variable[]>()

// ============================================================================
// Core Getters
// ============================================================================

export const getVariable = async (id: string): Promise<Variable | null> => {
  if (!id) return null

  const cached = variableCache.get(id)
  if (cached) return cached

  try {
    const variable = await figma.variables.getVariableByIdAsync(id)
    if (variable) {
      variableCache.set(id, variable)
    }
    return variable
  } catch {
    return null
  }
}

export const getCollection = async (id: string): Promise<VariableCollection | null> => {
  if (!id) return null

  const cached = collectionCache.get(id)
  if (cached) return cached

  try {
    const collection = await figma.variables.getVariableCollectionByIdAsync(id)
    if (collection) {
      collectionCache.set(id, collection)
    }
    return collection
  } catch {
    return null
  }
}

export const getLocalVariablesForType = async (
  resolvedType: VariableResolvedDataType
): Promise<Variable[]> => {
  const cached = localVariablesCache.get(resolvedType)
  if (cached) return cached

  const variables = await figma.variables.getLocalVariablesAsync(resolvedType)
  localVariablesCache.set(resolvedType, variables)
  return variables
}

export const getAllLocalVariables = async (
  types: VariableResolvedDataType[]
): Promise<Variable[]> => {
  const variablesByType = await Promise.all(
    types.map(async (type) => getLocalVariablesForType(type))
  )
  return variablesByType.flat()
}

// ============================================================================
// Collection Helpers
// ============================================================================

export const getAllCollections = async (): Promise<VariableCollection[]> => {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  for (const collection of collections) {
    collectionCache.set(collection.id, collection)
  }
  return collections
}

export const getCollectionInfo = async (
  id: string
): Promise<{ id: string; name: string } | null> => {
  const collection = await getCollection(id)
  if (!collection) return null
  return { id: collection.id, name: collection.name }
}

// ============================================================================
// Index Builders
// ============================================================================

export const buildExistingNamesByCollection = async (
  scopeTypes: VariableResolvedDataType[],
  scopeCollectionId: string | null
): Promise<Map<string, Map<string, string[]>>> => {
  const allVariables = await getAllLocalVariables(scopeTypes)
  const scoped = scopeCollectionId
    ? allVariables.filter((v) => v.variableCollectionId === scopeCollectionId)
    : allVariables

  const result = new Map<string, Map<string, string[]>>()

  for (const variable of scoped) {
    let byName = result.get(variable.variableCollectionId)
    if (!byName) {
      byName = new Map<string, string[]>()
      result.set(variable.variableCollectionId, byName)
    }
    const bucket = byName.get(variable.name) ?? []
    bucket.push(variable.id)
    byName.set(variable.name, bucket)
  }

  return result
}

export const buildLocalVariablesIndex = async (): Promise<{
  byId: Map<string, Variable>
  byCollectionAndName: Map<string, Map<string, Variable>>
}> => {
  const allTypes: VariableResolvedDataType[] = ["COLOR", "FLOAT", "STRING", "BOOLEAN"]
  const allVars = await getAllLocalVariables(allTypes)

  const byId = new Map<string, Variable>()
  const byCollectionAndName = new Map<string, Map<string, Variable>>()

  for (const v of allVars) {
    byId.set(v.id, v)
    let byName = byCollectionAndName.get(v.variableCollectionId)
    if (!byName) {
      byName = new Map<string, Variable>()
      byCollectionAndName.set(v.variableCollectionId, byName)
    }
    if (!byName.has(v.name)) {
      byName.set(v.name, v)
    }
  }

  return { byId, byCollectionAndName }
}

// ============================================================================
// Cache Management
// ============================================================================

export const clearVariableCache = (variableId: string): void => {
  variableCache.delete(variableId)
}

export const updateVariableInCache = (variable: Variable): void => {
  variableCache.set(variable.id, variable)
}

export const clearLocalVariablesCache = (resolvedType: VariableResolvedDataType): void => {
  localVariablesCache.delete(resolvedType)
}

export const clearAllCaches = (): void => {
  variableCache.clear()
  collectionCache.clear()
  localVariablesCache.clear()
}

// ============================================================================
// Export caches for direct manipulation when needed
// ============================================================================

export { variableCache, collectionCache, localVariablesCache }
