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
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync()
    const scopedByCollectionId = new Map<string, Variable[]>()
    for (const variable of scoped) {
      const bucket = scopedByCollectionId.get(variable.variableCollectionId) ?? []
      bucket.push(variable)
      scopedByCollectionId.set(variable.variableCollectionId, bucket)
    }
    const orderedScoped: Variable[] = []
    for (const collection of localCollections) {
      const variablesInCollection = scopedByCollectionId.get(collection.id) ?? []
      if (!variablesInCollection.length) continue
      const byId = new Map(variablesInCollection.map((variable) => [variable.id, variable]))
      const collectionDetails = await figma.variables.getVariableCollectionByIdAsync(collection.id)
      const orderedByCollectionIds = (collectionDetails?.variableIds ?? [])
        .map((id) => byId.get(id))
        .filter((variable): variable is Variable => variable != null)
      const orderedIdSet = new Set(orderedByCollectionIds.map((variable) => variable.id))
      orderedScoped.push(
        ...orderedByCollectionIds,
        ...variablesInCollection.filter((variable) => !orderedIdSet.has(variable.id))
      )
    }

    // Auto-generate name from project + collection names when setName is empty
    const includedCollectionNames = localCollections
      .filter((c) => scopedByCollectionId.has(c.id))
      .map((c) => c.name)
    const autoName = trimmedName
      || `${figma.root.name}. ${includedCollectionNames.join(", ")}`

    const createdAt = new Date().toISOString().slice(0, 10)

    const setObject = {
      version: 1,
      name: autoName,
      description: description?.trim() || undefined,
      createdAt,
      scope: {
        collectionId: resolvedCollectionIds.length ? null : collectionId,
        collectionIds: resolvedCollectionIds.length ? resolvedCollectionIds : undefined,
      },
      tokens: orderedScoped.map((v) =>
          includeCurrentName
            ? { currentName: v.name, newName: v.name, id: v.id }
            : { newName: v.name, id: v.id }
        ),
    }

    const safeProjectName = figma.root.name
      .replace(/[/\\:*?"<>|]+/g, " ")
      .trim()
    const safeCollectionNames = includedCollectionNames
      .map((n) => n.replace(/[/\\:*?"<>|]+/g, " ").trim())
      .join(", ")
    const autoFilename = trimmedName
      ? `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60)}-${createdAt}.json`
      : `${safeProjectName}. ${safeCollectionNames}.json`

    return {
      filename: autoFilename,
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

    // Build set of variable IDs being renamed away from their current name.
    // Used to detect "resolvable" conflicts: if a target name is held by a
    // variable that is ALSO being renamed to something else, the name will
    // be freed and the conflict is not real.
    const idsBeingRenamedAway = new Set<string>()
    plan.entries.forEach((entry, index) => {
      const variable = variables[index]
      if (!variable || !entry.id || !entry.newName) return
      if (variable.name !== entry.newName) {
        idsBeingRenamedAway.add(variable.id)
      }
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

      const conflictingExistingIds = existingIds.filter((id: string) => id !== variable.id)
      const existingConflict = conflictingExistingIds.length > 0
      const plannedConflict = plannedIds.length > 1

      // An existing conflict is "resolvable" when every variable that currently
      // holds the target name is also being renamed away from it in this plan.
      // Example: gray-10 → gray-160 is resolvable if the variable currently
      // named gray-160 is also being renamed (e.g. to gray-10).
      const isExistingConflictResolvable =
        existingConflict && conflictingExistingIds.every((id: string) => idsBeingRenamedAway.has(id))

      const hasRealConflict = (existingConflict && !isExistingConflictResolvable) || plannedConflict

      if (hasRealConflict) {
        conflicts += 1
        const conflicting = [
          ...conflictingExistingIds,
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

    const allTypes = ["COLOR", "FLOAT", "STRING", "BOOLEAN"] as VariableResolvedDataType[]
    const existingNamesByCollection = await buildExistingNamesByCollection(allTypes, null)

    const total = entries.length
    let done = 0

    if (onProgress) {
      onProgress(0, total)
    }

    const reportProgress = () => {
      if (onProgress && (done % 20 === 0 || done === total)) {
        onProgress(done, total)
      }
    }

    // Helper: update the mutable name map after a rename
    const updateNameMap = (collectionId: string, oldName: string, newName: string, varId: string) => {
      const byName =
        existingNamesByCollection.get(collectionId) ?? new Map<string, string[]>()
      const oldBucket = byName.get(oldName) ?? []
      byName.set(oldName, oldBucket.filter((id) => id !== varId))
      const newBucket = byName.get(newName) ?? []
      newBucket.push(varId)
      byName.set(newName, newBucket)
      existingNamesByCollection.set(collectionId, byName)
    }

    // Helper: perform a single rename
    const doRename = (variable: Variable, newName: string) => {
      const oldName = variable.name
      updateNameMap(variable.variableCollectionId, oldName, newName, variable.id)
      variable.name = newName
      updateVariableInCache(variable)
      clearLocalVariablesCache(variable.resolvedType)
    }

    // ─── Phase 1: Validate entries, separate into pending renames and immediate results ───
    interface PendingRename {
      variable: Variable
      beforeName: string
      newName: string
    }

    const pending: PendingRename[] = []

    for (const entry of entries) {
      const variable = await getVariable(entry.variableId)
      if (!variable) {
        skipped += 1
        results.push({ variableId: entry.variableId, status: "skipped", reason: "Variable not found." })
        done += 1
        reportProgress()
        continue
      }

      const beforeName = variable.name
      const newName = entry.newName.trim()
      if (!newName) {
        failed += 1
        results.push({ variableId: variable.id, beforeName, status: "failed", reason: "New name is empty." })
        done += 1
        reportProgress()
        continue
      }

      if (beforeName === newName) {
        unchanged += 1
        results.push({ variableId: variable.id, beforeName, afterName: newName, status: "unchanged" })
        done += 1
        reportProgress()
        continue
      }

      pending.push({ variable, beforeName, newName })
    }

    // Set of IDs still pending rename (used to detect resolvable vs real conflicts)
    const pendingIds = new Set(pending.map((p) => p.variable.id))

    // ─── Phase 2: Iteratively rename entries whose target name is free ───
    // On each pass, entries whose target name is not occupied (or occupied only
    // by self) are renamed immediately. Entries whose target is held by another
    // pending variable are "blocked" and retried next pass (the holder may have
    // been renamed in this pass, freeing the name). Entries whose target is held
    // by a variable NOT in the plan are real conflicts.
    let remaining = [...pending]
    let maxPasses = remaining.length + 1

    while (remaining.length > 0 && maxPasses > 0) {
      const safe: PendingRename[] = []
      const blocked: PendingRename[] = []

      for (const r of remaining) {
        const byName =
          existingNamesByCollection.get(r.variable.variableCollectionId) ?? new Map<string, string[]>()
        const existingIds = byName.get(r.newName) ?? []
        const conflictingIds = existingIds.filter((id) => id !== r.variable.id)

        if (conflictingIds.length === 0) {
          safe.push(r)
        } else if (conflictingIds.every((id) => pendingIds.has(id))) {
          blocked.push(r)
        } else {
          // Real conflict: target held by a variable not in the rename plan
          skipped += 1
          results.push({
            variableId: r.variable.id,
            beforeName: r.beforeName,
            afterName: r.newName,
            status: "skipped",
            reason: "Target name already exists in this collection.",
          })
          pendingIds.delete(r.variable.id)
          done += 1
          reportProgress()
        }
      }

      const madeProgress = safe.length > 0 || remaining.length !== blocked.length

      for (const r of safe) {
        try {
          doRename(r.variable, r.newName)
          renamed += 1
          results.push({
            variableId: r.variable.id,
            beforeName: r.beforeName,
            afterName: r.newName,
            status: "renamed",
          })
        } catch (error) {
          failed += 1
          const message = error instanceof Error ? error.message : "Rename failed."
          results.push({
            variableId: r.variable.id,
            beforeName: r.beforeName,
            afterName: r.newName,
            status: "failed",
            reason: message,
          })
        }
        pendingIds.delete(r.variable.id)
        done += 1
        reportProgress()
      }

      remaining = blocked

      if (!madeProgress) {
        // All remaining entries form swap cycles — break out to Phase 3
        break
      }

      maxPasses -= 1
    }

    // ─── Phase 3: Break swap cycles using temporary names ───
    // For cycles like A→B, B→A where neither can go first, we first rename
    // all cycle members to unique temporary names, then rename from temp to
    // their final names.
    if (remaining.length > 0) {
      const cycleEntries: Array<PendingRename & { tempName: string }> = []

      // Step 1: rename all cycle members to temporary names
      for (let i = 0; i < remaining.length; i += 1) {
        const r = remaining[i]
        const tempName = `__swap_${i}__`
        try {
          doRename(r.variable, tempName)
          cycleEntries.push({ ...r, tempName })
        } catch (error) {
          failed += 1
          const message = error instanceof Error ? error.message : "Rename failed (swap step 1)."
          results.push({
            variableId: r.variable.id,
            beforeName: r.beforeName,
            afterName: r.newName,
            status: "failed",
            reason: message,
          })
          done += 1
          reportProgress()
        }
      }

      // Step 2: rename from temporary to final names
      for (const c of cycleEntries) {
        try {
          doRename(c.variable, c.newName)
          renamed += 1
          results.push({
            variableId: c.variable.id,
            beforeName: c.beforeName,
            afterName: c.newName,
            status: "renamed",
          })
        } catch (error) {
          failed += 1
          const message = error instanceof Error ? error.message : "Rename failed (swap step 2)."
          results.push({
            variableId: c.variable.id,
            beforeName: c.beforeName,
            afterName: c.newName,
            status: "failed",
            reason: message,
          })
        }
        done += 1
        reportProgress()
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
