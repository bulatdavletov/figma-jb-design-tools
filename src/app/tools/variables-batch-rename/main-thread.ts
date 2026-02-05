import type {
  ActiveTool,
  UiToMainMessage,
  BatchRenamePreviewEntry,
  BatchRenamePreviewPayload,
  BatchRenameApplyResultPayload,
  BatchRenameApplyEntryResult,
  BatchRenameNameSetReadyPayload,
  VariableResolvedDataType,
} from "../../messages"
import { MAIN_TO_UI, UI_TO_MAIN } from "../../messages"
import {
  getVariable,
  getCollection,
  getAllLocalVariables,
  buildExistingNamesByCollection,
  clearLocalVariablesCache,
  updateVariableInCache,
} from "../variables-shared/caching"
import { parseImportedRenamePlan, isString } from "../variables-shared/json-parsers"

export function registerVariablesBatchRenameTool(getActiveTool: () => ActiveTool) {
  const sendCollectionsList = async () => {
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    const collectionsInfo = await Promise.all(
      collections.map(async (c) => {
        const collection = await figma.variables.getVariableCollectionByIdAsync(c.id)
        return {
          id: c.id,
          name: c.name,
          modeCount: c.modes.length,
          variableCount: collection?.variableIds.length ?? 0,
        }
      })
    )
    figma.ui.postMessage({
      type: MAIN_TO_UI.BATCH_RENAME_COLLECTIONS_LIST,
      collections: collectionsInfo,
    })
  }

  const exportNameSet = async (
    setName: string,
    description: string | undefined,
    collectionId: string | null,
    collectionIds: string[] | null,
    types: VariableResolvedDataType[],
    includeCurrentName: boolean
  ): Promise<BatchRenameNameSetReadyPayload> => {
    const trimmedName = setName.trim()
    if (!trimmedName) {
      throw new Error("Set name is required.")
    }

    const resolvedTypes =
      types.length > 0 ? types : (["COLOR", "FLOAT", "STRING", "BOOLEAN"] as VariableResolvedDataType[])
    const resolvedCollectionIds = Array.isArray(collectionIds)
      ? collectionIds.filter(isString).map((id) => id.trim()).filter(Boolean)
      : []

    const allVariables = await getAllLocalVariables(resolvedTypes)
    const scoped = resolvedCollectionIds.length
      ? allVariables.filter((v) => resolvedCollectionIds.includes(v.variableCollectionId))
      : collectionId
        ? allVariables.filter((v) => v.variableCollectionId === collectionId)
        : allVariables

    const setObject = {
      version: 1,
      name: trimmedName,
      description: description?.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      scope: {
        collectionId: resolvedCollectionIds.length ? null : collectionId,
        collectionIds: resolvedCollectionIds.length ? resolvedCollectionIds : undefined,
      },
      tokens: scoped
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((v) =>
          includeCurrentName
            ? { currentName: v.name, newName: v.name, id: v.id }
            : { newName: v.name, id: v.id }
        ),
    }

    const safeName = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)

    return {
      filename: `${safeName || "name-set"}-${setObject.createdAt}.json`,
      jsonText: JSON.stringify(setObject, null, 2),
    }
  }

  const buildImportedRenamePreview = async (jsonText: string): Promise<BatchRenamePreviewPayload> => {
    const { plan, meta } = parseImportedRenamePlan(jsonText)
    const scopeCollectionId = plan.scope?.collectionId ?? null
    const scopeTypes =
      plan.scope?.types?.length
        ? plan.scope.types
        : (["COLOR", "FLOAT", "STRING", "BOOLEAN"] as VariableResolvedDataType[])

    const existingNamesByCollection = await buildExistingNamesByCollection(scopeTypes, scopeCollectionId)

    const previewEntries: BatchRenamePreviewEntry[] = []

    // Preload variables referenced by the plan
    const variables = await Promise.all(
      plan.entries.map(async (entry) => (entry.id ? getVariable(entry.id) : null))
    )

    // Build planned newName buckets for collision detection (per collection)
    const plannedByCollection = new Map<string, Map<string, string[]>>()
    plan.entries.forEach((entry, index) => {
      const variable = variables[index]
      if (!variable || !entry.id || !entry.newName) return
      const colId = variable.variableCollectionId
      let byName = plannedByCollection.get(colId)
      if (!byName) {
        byName = new Map<string, string[]>()
        plannedByCollection.set(colId, byName)
      }
      const bucket = byName.get(entry.newName) ?? []
      bucket.push(variable.id)
      byName.set(entry.newName, bucket)
    })

    let renames = 0
    let unchanged = 0
    let conflicts = 0
    let missing = 0
    let stale = 0
    let invalid = 0
    let outOfScope = 0

    for (let i = 0; i < plan.entries.length; i += 1) {
      const entry = plan.entries[i]
      const variable = variables[i]

      if (!entry.id || !entry.newName) {
        invalid += 1
        previewEntries.push({
          variableId: entry.id || `row-${i + 1}`,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "invalid",
          reason: "Missing id or newName.",
        })
        continue
      }

      if (!variable) {
        missing += 1
        previewEntries.push({
          variableId: entry.id,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "missing",
          reason: "Variable not found (maybe deleted or not local).",
        })
        continue
      }

      const collection = await getCollection(variable.variableCollectionId)
      const currentName = variable.name

      // Scope checks (optional)
      if (scopeCollectionId && variable.variableCollectionId !== scopeCollectionId) {
        outOfScope += 1
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: collection?.name ?? "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "out_of_scope",
          reason: "Variable is outside of plan scope collection.",
        })
        continue
      }

      if (scopeTypes.length && !scopeTypes.includes(variable.resolvedType)) {
        outOfScope += 1
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: collection?.name ?? "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "out_of_scope",
          reason: "Variable type not in plan scope.",
        })
        continue
      }

      // Stale check
      const nameMismatchWarning =
        entry.expectedOldName && entry.expectedOldName !== currentName
          ? `Expected "${entry.expectedOldName}" but variable is currently "${currentName}".`
          : undefined

      if (entry.expectedOldName && entry.expectedOldName !== currentName) {
        stale += 1
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: collection?.name ?? "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "stale",
          reason: "Variable name changed since plan was created.",
          warning: nameMismatchWarning,
        })
        continue
      }

      // Unchanged check
      if (currentName === entry.newName) {
        unchanged += 1
        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: collection?.name ?? "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "unchanged",
          warning: nameMismatchWarning,
        })
        continue
      }

      // Conflict check
      const byExisting = existingNamesByCollection.get(variable.variableCollectionId) ?? new Map()
      const existingIds = byExisting.get(entry.newName) ?? []
      const byPlanned = plannedByCollection.get(variable.variableCollectionId) ?? new Map()
      const plannedIds = byPlanned.get(entry.newName) ?? []

      const existingConflict = existingIds.some((id: string) => id !== variable.id)
      const plannedConflict = plannedIds.length > 1

      if (existingConflict || plannedConflict) {
        conflicts += 1
        const conflicting = [
          ...existingIds.filter((id: string) => id !== variable.id),
          ...plannedIds.filter((id: string) => id !== variable.id),
        ].map((id: string) => ({ variableId: id, name: entry.newName }))

        previewEntries.push({
          variableId: variable.id,
          collectionId: variable.variableCollectionId,
          collectionName: collection?.name ?? "Unknown collection",
          resolvedType: variable.resolvedType,
          currentName,
          expectedOldName: entry.expectedOldName,
          newName: entry.newName,
          status: "conflict",
          reason: "Name already exists or multiple plan entries map to the same newName.",
          conflictWith: conflicting,
          warning: nameMismatchWarning,
        })
        continue
      }

      renames += 1
      previewEntries.push({
        variableId: variable.id,
        collectionId: variable.variableCollectionId,
        collectionName: collection?.name ?? "Unknown collection",
        resolvedType: variable.resolvedType,
        currentName,
        expectedOldName: entry.expectedOldName,
        newName: entry.newName,
        status: "rename",
        warning: nameMismatchWarning,
      })
    }

    return {
      meta,
      totals: {
        considered: plan.entries.length,
        renames,
        unchanged,
        conflicts,
        missing,
        stale,
        invalid,
        outOfScope,
      },
      entries: previewEntries,
    }
  }

  const applyImportedRenamePlan = async (
    entries: Array<{ variableId: string; expectedOldName?: string; newName: string }>,
    onProgress?: (done: number, total: number) => void
  ): Promise<BatchRenameApplyResultPayload> => {
    const results: BatchRenameApplyEntryResult[] = []
    let renamed = 0
    let unchanged = 0
    let skipped = 0
    let failed = 0

    // Build a mutable view of current names to detect conflicts while applying.
    const allTypes = ["COLOR", "FLOAT", "STRING", "BOOLEAN"] as VariableResolvedDataType[]
    const existingNamesByCollection = await buildExistingNamesByCollection(allTypes, null)

    const total = entries.length
    let done = 0

    if (onProgress) {
      onProgress(0, total)
    }

    for (const entry of entries) {
      const variable = await getVariable(entry.variableId)
      if (!variable) {
        skipped += 1
        results.push({ variableId: entry.variableId, status: "skipped", reason: "Variable not found." })
        done += 1
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total)
        }
        continue
      }

      const beforeName = variable.name
      const newName = entry.newName.trim()
      if (!newName) {
        failed += 1
        results.push({
          variableId: variable.id,
          beforeName,
          status: "failed",
          reason: "New name is empty.",
        })
        done += 1
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total)
        }
        continue
      }

      if (beforeName === newName) {
        unchanged += 1
        results.push({ variableId: variable.id, beforeName, afterName: newName, status: "unchanged" })
        done += 1
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total)
        }
        continue
      }

      // Conflict check at apply time
      const byName =
        existingNamesByCollection.get(variable.variableCollectionId) ?? new Map<string, string[]>()
      const existingIds = byName.get(newName) ?? []
      const hasConflict = existingIds.some((id) => id !== variable.id)
      if (hasConflict) {
        skipped += 1
        results.push({
          variableId: variable.id,
          beforeName,
          afterName: newName,
          status: "skipped",
          reason: "Target name already exists in this collection.",
        })
        done += 1
        if (onProgress && (done % 20 === 0 || done === total)) {
          onProgress(done, total)
        }
        continue
      }

      try {
        // Update name maps: remove old, add new
        const oldBucket = byName.get(beforeName) ?? []
        byName.set(
          beforeName,
          oldBucket.filter((id) => id !== variable.id)
        )
        const newBucket = byName.get(newName) ?? []
        newBucket.push(variable.id)
        byName.set(newName, newBucket)
        existingNamesByCollection.set(variable.variableCollectionId, byName)

        variable.name = newName
        updateVariableInCache(variable)
        clearLocalVariablesCache(variable.resolvedType)
        renamed += 1
        results.push({ variableId: variable.id, beforeName, afterName: newName, status: "renamed" })
      } catch (error) {
        failed += 1
        const message = error instanceof Error ? error.message : "Rename failed."
        results.push({
          variableId: variable.id,
          beforeName,
          afterName: newName,
          status: "failed",
          reason: message,
        })
      }

      done += 1
      if (onProgress && (done % 20 === 0 || done === total)) {
        onProgress(done, total)
      }
    }

    return { totals: { renamed, unchanged, skipped, failed }, results }
  }

  return {
    async onActivate() {
      await sendCollectionsList()
    },

    async onMessage(msg: UiToMainMessage): Promise<boolean> {
      if (getActiveTool() !== "variables-batch-rename-tool") return false

      if (msg.type === UI_TO_MAIN.BATCH_RENAME_EXPORT_NAME_SET) {
        try {
          const { setName, description, collectionId, collectionIds, types, includeCurrentName } =
            msg.request

          const payload = await exportNameSet(
            setName,
            description,
            collectionId ?? null,
            collectionIds ?? null,
            types ?? [],
            includeCurrentName !== false
          )

          figma.ui.postMessage({
            type: MAIN_TO_UI.BATCH_RENAME_NAME_SET_READY,
            payload,
          })
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Export failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Export failed",
          })
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.BATCH_RENAME_PREVIEW_IMPORT) {
        try {
          const payload = await buildImportedRenamePreview(msg.request.jsonText)
          figma.ui.postMessage({
            type: MAIN_TO_UI.BATCH_RENAME_IMPORT_PREVIEW,
            payload,
          })
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Preview failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Preview failed",
          })
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.BATCH_RENAME_APPLY_IMPORT) {
        try {
          const payload = await applyImportedRenamePlan(msg.request.entries, (done, total) => {
            figma.ui.postMessage({
              type: MAIN_TO_UI.BATCH_RENAME_APPLY_PROGRESS,
              progress: {
                current: done,
                total,
                message: `Renaming variables... ${done}/${total}`,
              },
            })
          })

          figma.ui.postMessage({
            type: MAIN_TO_UI.BATCH_RENAME_APPLY_RESULT,
            payload,
          })

          const { renamed, failed, skipped } = payload.totals
          if (failed === 0 && skipped === 0) {
            figma.notify(`Renamed ${renamed} variables`)
          } else {
            figma.notify(
              `Renamed ${renamed} variables, ${skipped} skipped, ${failed} failed`
            )
          }

          // Refresh collections list
          await sendCollectionsList()
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Apply failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Apply failed",
          })
        }
        return true
      }

      return false
    },
  }
}
