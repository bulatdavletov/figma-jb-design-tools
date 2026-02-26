import type {
  ActiveTool,
  UiToMainMessage,
  ExportImportSnapshotReadyPayload,
  ExportImportPreviewPayload,
  ExportImportPreviewEntry,
  ExportImportApplyResultPayload,
  VariableResolvedDataType,
} from "../../messages"
import { plural } from "../../utils/pluralize"
import { MAIN_TO_UI, UI_TO_MAIN } from "../../messages"
import {
  getVariable,
  getCollection,
  getAllLocalVariables,
  buildLocalVariablesIndex,
  updateVariableInCache,
  clearLocalVariablesCache,
} from "../variables-shared/caching"
import {
  parseSnapshotDoc,
  flattenSnapshotDoc,
  resolveAliasFromSnapshotValue,
  isString,
} from "../variables-shared/json-parsers"
import type { SnapshotFlatEntry } from "../variables-shared/types"

type RGBAValue = { r: number; g: number; b: number; a?: number }

const rgbaToHex = (value: RGBAValue): string => {
  const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
  const toHex = (n: number) =>
    Math.round(clamp01(n) * 255)
      .toString(16)
      .padStart(2, "0")
  const r = toHex(value.r)
  const g = toHex(value.g)
  const b = toHex(value.b)
  const a = toHex(value.a ?? 1)
  const hasAlpha = (value.a ?? 1) < 1
  return `#${r}${g}${b}${hasAlpha ? a : ""}`.toUpperCase()
}

const hexToRgba = (hex: string): RGBAValue | null => {
  const raw = String(hex || "").trim()
  if (!raw.startsWith("#")) return null
  const h = raw.slice(1)
  if (!(h.length === 6 || h.length === 8)) return null
  const int = (s: string) => parseInt(s, 16)
  const r = int(h.slice(0, 2))
  const g = int(h.slice(2, 4))
  const b = int(h.slice(4, 6))
  const a = h.length === 8 ? int(h.slice(6, 8)) : 255
  if ([r, g, b, a].some((n) => Number.isNaN(n))) return null
  return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 }
}

const setNestedObject = (root: Record<string, unknown>, path: string[], value: unknown) => {
  let cursor: Record<string, unknown> = root
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i] ?? ""
    if (!key) continue
    const existing = cursor[key]
    if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
      cursor[key] = {}
    }
    cursor = cursor[key] as Record<string, unknown>
  }
  const last = path[path.length - 1] ?? ""
  if (last) {
    cursor[last] = value
  }
}

const formatAliasRef = async (aliasId: string): Promise<{ $alias: string }> => {
  const aliasedVar = await getVariable(aliasId)
  if (!aliasedVar) {
    return { $alias: "" }
  }
  const col = await getCollection(aliasedVar.variableCollectionId)
  const colName = col?.name ?? "Unknown collection"
  return { $alias: `${colName}:${aliasedVar.name}` }
}

export function registerVariablesExportImportTool(getActiveTool: () => ActiveTool) {
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
      type: MAIN_TO_UI.EXPORT_IMPORT_COLLECTIONS_LIST,
      collections: collectionsInfo,
    })
  }

  const exportVariablesSnapshot = async (
    collectionIds: string[] | null
  ): Promise<ExportImportSnapshotReadyPayload> => {
    const collections = await figma.variables.getLocalVariableCollectionsAsync()
    const wantedIds =
      Array.isArray(collectionIds) && collectionIds.length
        ? collectionIds.filter(isString).map((id) => id.trim()).filter(Boolean)
        : []

    const scopedCollections = wantedIds.length
      ? collections.filter((c) => wantedIds.includes(c.id))
      : collections

    const allTypes = ["COLOR", "FLOAT", "STRING", "BOOLEAN"] as VariableResolvedDataType[]
    const allVars = await getAllLocalVariables(allTypes)

    const files: { filename: string; jsonText: string }[] = []
    const nameCounts = new Map<string, number>()

    for (const collection of scopedCollections) {
      const variablesInCollection = allVars.filter((v) => v.variableCollectionId === collection.id)
      const variablesById = new Map(variablesInCollection.map((variable) => [variable.id, variable]))
      const collectionDetails = await figma.variables.getVariableCollectionByIdAsync(collection.id)
      const orderedByCollectionIds = (collectionDetails?.variableIds ?? [])
        .map((id) => variablesById.get(id))
        .filter((variable): variable is Variable => variable != null)
      const orderedIdSet = new Set(orderedByCollectionIds.map((variable) => variable.id))
      const variables = [
        ...orderedByCollectionIds,
        ...variablesInCollection.filter((variable) => !orderedIdSet.has(variable.id)),
      ]

      const variablesTree: Record<string, unknown> = {}

      for (const variable of variables) {
        const parts = variable.name.split("/").map((p) => p.trim())
        const cleanParts = parts.filter(Boolean)
        if (!cleanParts.length) continue

        const leafKey = cleanParts[cleanParts.length - 1]
        const groupPath = cleanParts.slice(0, -1)

        const type =
          variable.resolvedType === "COLOR"
            ? "color"
            : variable.resolvedType === "FLOAT"
              ? "number"
              : variable.resolvedType === "STRING"
                ? "string"
                : variable.resolvedType === "BOOLEAN"
                  ? "boolean"
                  : "unknown"

        const values: Record<string, unknown> = {}

        for (const mode of collection.modes) {
          const modeName = mode.name
          const rawValue: unknown = variable.valuesByMode?.[mode.modeId]

          if (rawValue === null || rawValue === undefined) {
            values[modeName] = ""
            continue
          }

          if (
            typeof rawValue === "object" &&
            rawValue &&
            (rawValue as Record<string, unknown>).type === "VARIABLE_ALIAS" &&
            isString((rawValue as Record<string, unknown>).id)
          ) {
            values[modeName] = await formatAliasRef(
              String((rawValue as Record<string, unknown>).id)
            )
            continue
          }

          if (variable.resolvedType === "COLOR" && typeof rawValue === "object" && rawValue) {
            const v = rawValue as Record<string, unknown>
            if (typeof v.r === "number" && typeof v.g === "number" && typeof v.b === "number") {
              values[modeName] = rgbaToHex({
                r: v.r as number,
                g: v.g as number,
                b: v.b as number,
                a: typeof v.a === "number" ? (v.a as number) : 1,
              })
              continue
            }
          }

          values[modeName] = rawValue
        }

        const description =
          typeof variable.description === "string" && variable.description.trim()
            ? String(variable.description)
            : undefined
        const scopesRaw = Array.isArray(variable.scopes) ? (variable.scopes as unknown[]) : []
        const scopes = scopesRaw.filter(isString)

        const entry = {
          id: variable.id,
          type,
          values,
          description,
          scopes: scopes.length ? scopes : undefined,
        }
        const path = [...groupPath, leafKey]
        setNestedObject(variablesTree, path, entry)
      }

      const doc = {
        collections: [
          {
            name: collection.name,
            modes: collection.modes.map((m) => m.name),
            variables: variablesTree,
          },
        ],
      }

      const baseFilename = `${collection.name}.json`
      const prev = nameCounts.get(baseFilename) ?? 0
      nameCounts.set(baseFilename, prev + 1)
      const filename = prev === 0 ? baseFilename : `${collection.name}-${prev + 1}.json`

      files.push({ filename, jsonText: JSON.stringify(doc, null, 4) })
    }

    return { files }
  }

  const buildVariablesSnapshotImportPreview = async (
    jsonText: string
  ): Promise<ExportImportPreviewPayload> => {
    const doc = parseSnapshotDoc(jsonText)
    const flat = flattenSnapshotDoc(doc)

    const localCollections = await figma.variables.getLocalVariableCollectionsAsync()
    const byCollectionName = new Map(localCollections.map((c) => [c.name, c] as const))
    const { byId, byCollectionAndName } = await buildLocalVariablesIndex()

    const plannedNamesByCollection = new Map<string, Set<string>>()

    const entries: ExportImportPreviewEntry[] = []
    let create = 0
    let update = 0
    let rename = 0
    let conflicts = 0
    let missingCollections = 0
    let invalid = 0

    for (const row of flat) {
      const collection = byCollectionName.get(row.collectionName)
      if (!collection) {
        missingCollections += 1
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "missing_collection",
          reason: "Collection not found in this Figma file.",
        })
        continue
      }

      if (!row.variableName || !row.resolvedType) {
        invalid += 1
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName || "(missing)",
          status: "invalid",
        })
        continue
      }

      // Detect duplicate target names within snapshot itself
      const set = plannedNamesByCollection.get(collection.id) ?? new Set<string>()
      if (set.has(row.variableName)) {
        conflicts += 1
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "conflict",
          reason: "Duplicate variable name in snapshot for this collection.",
        })
        continue
      }
      set.add(row.variableName)
      plannedNamesByCollection.set(collection.id, set)

      const existingByName = byCollectionAndName.get(collection.id)?.get(row.variableName) ?? null
      const existingById = row.id ? byId.get(row.id) ?? null : null
      const target = existingById ?? existingByName

      if (target) {
        if (target.variableCollectionId !== collection.id) {
          conflicts += 1
          entries.push({
            collectionName: row.collectionName,
            variableName: row.variableName,
            status: "conflict",
            reason: "Snapshot variable id refers to a variable in a different collection.",
          })
          continue
        }
        if (target.resolvedType !== row.resolvedType) {
          conflicts += 1
          entries.push({
            collectionName: row.collectionName,
            variableName: row.variableName,
            status: "conflict",
            reason: "Type mismatch between snapshot and existing variable.",
          })
          continue
        }
        if (existingById && target.name !== row.variableName) {
          rename += 1
          entries.push({
            collectionName: row.collectionName,
            variableName: row.variableName,
            status: "rename",
          })
          continue
        }
        update += 1
        entries.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "update",
        })
        continue
      }

      create += 1
      entries.push({
        collectionName: row.collectionName,
        variableName: row.variableName,
        status: "create",
      })
    }

    return {
      totals: {
        considered: flat.length,
        create,
        update,
        rename,
        conflicts,
        missingCollections,
        invalid,
      },
      entries,
    }
  }

  const applyVariablesSnapshotImport = async (
    jsonText: string
  ): Promise<ExportImportApplyResultPayload> => {
    const doc = parseSnapshotDoc(jsonText)
    const flat = flattenSnapshotDoc(doc)

    const localCollections = await figma.variables.getLocalVariableCollectionsAsync()
    const byCollectionName = new Map(localCollections.map((c) => [c.name, c] as const))
    const { byId, byCollectionAndName } = await buildLocalVariablesIndex()

    const results: ExportImportApplyResultPayload["results"] = []
    let created = 0
    let updated = 0
    let renamed = 0
    let skipped = 0
    let failed = 0

    // First pass: create missing variables
    for (const row of flat) {
      const collection = byCollectionName.get(row.collectionName)
      if (!collection) {
        skipped += 1
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "skipped",
          reason: "Missing collection in this file.",
        })
        continue
      }

      const existingByName = byCollectionAndName.get(collection.id)?.get(row.variableName) ?? null
      const existingById = row.id ? byId.get(row.id) ?? null : null
      const target = existingById ?? existingByName

      if (target) continue

      try {
        const v = figma.variables.createVariable(row.variableName, collection, row.resolvedType)
        updateVariableInCache(v)
        byId.set(v.id, v)
        let byName = byCollectionAndName.get(collection.id)
        if (!byName) {
          byName = new Map()
          byCollectionAndName.set(collection.id, byName)
        }
        byName.set(v.name, v)
        clearLocalVariablesCache(v.resolvedType)
        created += 1
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "created",
        })
      } catch (error) {
        failed += 1
        const message = error instanceof Error ? error.message : "Create failed."
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "failed",
          reason: message,
        })
      }
    }

    // Second pass: rename (by id), update metadata, and set values
    for (const row of flat) {
      const collection = byCollectionName.get(row.collectionName)
      if (!collection) continue

      const existingByName = byCollectionAndName.get(collection.id)?.get(row.variableName) ?? null
      const existingById = row.id ? byId.get(row.id) ?? null : null
      const target = existingById ?? existingByName

      if (!target) continue

      if (target.variableCollectionId !== collection.id) {
        skipped += 1
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "skipped",
          reason: "Variable belongs to a different collection.",
        })
        continue
      }

      if (target.resolvedType !== row.resolvedType) {
        skipped += 1
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "skipped",
          reason: "Type mismatch; not updating.",
        })
        continue
      }

      try {
        // Rename only when snapshot provides an id
        if (existingById && target.name !== row.variableName) {
          const oldName = target.name
          target.name = row.variableName
          renamed += 1
          const byName = byCollectionAndName.get(collection.id) ?? new Map<string, Variable>()
          byName.delete(oldName)
          byName.set(target.name, target)
          byCollectionAndName.set(collection.id, byName)
        }

        // Description/scopes
        if (isString(row.description)) {
          try {
            target.description = row.description
          } catch {
            // ignore
          }
        }
        if (Array.isArray(row.scopes) && row.scopes.length) {
          try {
            target.scopes = row.scopes as VariableScope[]
          } catch {
            // ignore
          }
        }

        // Set values by matching mode names
        const modeNameToId = new Map(collection.modes.map((m) => [m.name, m.modeId] as const))
        for (const [modeName, rawValue] of Object.entries(row.values ?? {})) {
          const modeId = modeNameToId.get(modeName)
          if (!modeId) continue

          const alias = await resolveAliasFromSnapshotValue(
            rawValue,
            byCollectionName,
            byCollectionAndName
          )
          if (alias) {
            target.setValueForMode(modeId, alias)
            continue
          }

          if (row.resolvedType === "COLOR") {
            const rgba = typeof rawValue === "string" ? hexToRgba(rawValue) : null
            if (rgba) {
              target.setValueForMode(modeId, rgba as RGBA)
            }
            continue
          }

          if (row.resolvedType === "FLOAT" && typeof rawValue === "number") {
            target.setValueForMode(modeId, rawValue)
            continue
          }

          if (row.resolvedType === "BOOLEAN" && typeof rawValue === "boolean") {
            target.setValueForMode(modeId, rawValue)
            continue
          }

          if (row.resolvedType === "STRING" && typeof rawValue === "string") {
            target.setValueForMode(modeId, rawValue)
            continue
          }
        }

        // Count as updated if it existed by name and wasn't a rename-only action
        if (!existingById) {
          updated += 1
        }
      } catch (error) {
        failed += 1
        const message = error instanceof Error ? error.message : "Update failed."
        results.push({
          collectionName: row.collectionName,
          variableName: row.variableName,
          status: "failed",
          reason: message,
        })
      }
    }

    return { totals: { created, updated, renamed, skipped, failed }, results }
  }

  return {
    async onActivate() {
      await sendCollectionsList()
    },

    async onMessage(msg: UiToMainMessage): Promise<boolean> {
      if (getActiveTool() !== "variables-export-import-tool") return false

      if (msg.type === UI_TO_MAIN.EXPORT_IMPORT_EXPORT_SNAPSHOT) {
        try {
          const payload = await exportVariablesSnapshot(msg.request.collectionIds ?? null)
          figma.ui.postMessage({
            type: MAIN_TO_UI.EXPORT_IMPORT_SNAPSHOT_READY,
            payload,
          })

          if (payload.files.length === 0) {
            figma.notify("No collections to export")
          } else if (payload.files.length === 1) {
            figma.notify(`Exported: ${payload.files[0].filename}`)
          } else {
            figma.notify(`Snapshot ready: ${plural(payload.files.length, "file")}`)
          }
        } catch (e) {
          figma.notify(e instanceof Error ? e.message : "Export failed")
          figma.ui.postMessage({
            type: MAIN_TO_UI.ERROR,
            message: e instanceof Error ? e.message : "Export failed",
          })
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.EXPORT_IMPORT_PREVIEW_SNAPSHOT) {
        try {
          const payload = await buildVariablesSnapshotImportPreview(msg.request.jsonText)
          figma.ui.postMessage({
            type: MAIN_TO_UI.EXPORT_IMPORT_PREVIEW,
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

      if (msg.type === UI_TO_MAIN.EXPORT_IMPORT_APPLY_SNAPSHOT) {
        try {
          const payload = await applyVariablesSnapshotImport(msg.request.jsonText)
          figma.ui.postMessage({
            type: MAIN_TO_UI.EXPORT_IMPORT_APPLY_RESULT,
            payload,
          })

          const { created, updated, renamed, failed } = payload.totals
          if (failed === 0) {
            figma.notify(
              `Snapshot imported: created ${created}, updated ${updated}, renamed ${renamed}`
            )
          } else {
            figma.notify(
              `Snapshot imported: created ${created}, updated ${updated}, renamed ${renamed}, failed ${failed}`
            )
          }

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
