// ---------------------------------------------------------------------------
// Mapping types for Library Swap
// Supports schema versions 1, 2 and 3 produced by the icon-libraries-swap
// export / mapping tools.
// ---------------------------------------------------------------------------

export type MappingV1 = {
  schemaVersion: 1
  createdAt: string
  matches: Record<string, string> // oldComponentKey → newComponentKey
  meta?: { note?: string }
}

export type MappingMatchMetaV2 = {
  oldFullName: string
  newFullName: string
  description?: string
}

export type MappingV2 = {
  schemaVersion: 2
  createdAt: string
  matches: Record<string, string> // oldComponentKey → newComponentKey
  matchMeta?: Record<string, MappingMatchMetaV2>
  meta?: { note?: string }
}

export type MappingMatchV3 = {
  match: string // newComponentKey
  oldFullName?: string
  newFullName?: string
  description?: string
}

export type MappingV3 = {
  schemaVersion: 3
  createdAt: string
  matches: Record<string, MappingMatchV3>
  meta?: { note?: string }
}

export type MappingAny = MappingV1 | MappingV2 | MappingV3

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function isMappingAny(v: unknown): v is MappingAny {
  if (!v || typeof v !== "object") return false
  const obj = v as Record<string, unknown>
  const schema = obj.schemaVersion
  const hasMatches = typeof obj.matches === "object" && !!obj.matches
  return (schema === 1 || schema === 2 || schema === 3) && hasMatches
}

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

export function getMappedNewKey(mapping: MappingAny, oldKey: string): string {
  if (mapping.schemaVersion === 3) {
    const entry = (mapping.matches as Record<string, MappingMatchV3>)[oldKey]
    return entry && typeof entry.match === "string" ? entry.match : ""
  }
  const v = (mapping.matches as Record<string, string>)[oldKey]
  return typeof v === "string" ? v : ""
}

// ---------------------------------------------------------------------------
// Merge helper – combine multiple mappings into a single matches dict.
// Later mappings override earlier ones for the same key.
// ---------------------------------------------------------------------------

export function mergeMappingMatches(
  mappings: MappingAny[]
): Record<string, string> {
  const merged: Record<string, string> = {}
  for (const m of mappings) {
    if (m.schemaVersion === 3) {
      for (const [oldKey, entry] of Object.entries(m.matches)) {
        const newKey =
          entry && typeof (entry as MappingMatchV3).match === "string"
            ? (entry as MappingMatchV3).match
            : ""
        if (newKey) merged[oldKey] = newKey
      }
    } else {
      for (const [oldKey, newKey] of Object.entries(m.matches)) {
        if (typeof newKey === "string" && newKey) merged[oldKey] = newKey
      }
    }
  }
  return merged
}

// ---------------------------------------------------------------------------
// Meta merge – extract display names (oldFullName / newFullName) from all
// active mappings so the UI can show human-readable labels in the DataTable.
// ---------------------------------------------------------------------------

export type MergedMeta = {
  oldFullName?: string
  newFullName?: string
}

// ---------------------------------------------------------------------------
// Rich merge – returns newKey + description per old key.
// Includes text-only entries (match="" with a description) so Scan Legacy
// can distinguish "has replacement" / "text-only guidance" / "not mapped".
// ---------------------------------------------------------------------------

export type MergedMatchEntry = {
  newKey: string
  oldFullName?: string
  newFullName?: string
  description?: string
}

export function mergeMappingMatchesRich(
  mappings: MappingAny[]
): Record<string, MergedMatchEntry> {
  const merged: Record<string, MergedMatchEntry> = {}
  for (const m of mappings) {
    if (m.schemaVersion === 3) {
      for (const [oldKey, entry] of Object.entries(m.matches)) {
        const e = entry as MappingMatchV3
        const newKey = e.match ?? ""
        if (newKey || e.description) {
          merged[oldKey] = {
            newKey,
            oldFullName: e.oldFullName ?? merged[oldKey]?.oldFullName,
            newFullName: e.newFullName ?? merged[oldKey]?.newFullName,
            description: e.description ?? merged[oldKey]?.description,
          }
        }
      }
    } else if (m.schemaVersion === 2) {
      const meta = (m as MappingV2).matchMeta
      for (const [oldKey, newKey] of Object.entries(m.matches)) {
        if (typeof newKey === "string" && newKey) {
          const metaEntry = meta?.[oldKey]
          merged[oldKey] = {
            newKey,
            oldFullName: metaEntry?.oldFullName ?? merged[oldKey]?.oldFullName,
            newFullName: metaEntry?.newFullName ?? merged[oldKey]?.newFullName,
            description: metaEntry?.description ?? merged[oldKey]?.description,
          }
        }
      }
    } else {
      for (const [oldKey, newKey] of Object.entries(m.matches)) {
        if (typeof newKey === "string" && newKey) {
          merged[oldKey] = { ...merged[oldKey], newKey }
        }
      }
    }
  }
  return merged
}

export function mergeMappingMeta(
  mappings: MappingAny[]
): Record<string, MergedMeta> {
  const merged: Record<string, MergedMeta> = {}
  for (const m of mappings) {
    if (m.schemaVersion === 3) {
      for (const [oldKey, entry] of Object.entries(m.matches)) {
        const e = entry as MappingMatchV3
        if (e.oldFullName || e.newFullName) {
          merged[oldKey] = {
            oldFullName: e.oldFullName ?? merged[oldKey]?.oldFullName,
            newFullName: e.newFullName ?? merged[oldKey]?.newFullName,
          }
        }
      }
    } else if (m.schemaVersion === 2 && (m as MappingV2).matchMeta) {
      const meta = (m as MappingV2).matchMeta!
      for (const [oldKey, entry] of Object.entries(meta)) {
        merged[oldKey] = {
          oldFullName: entry.oldFullName ?? merged[oldKey]?.oldFullName,
          newFullName: entry.newFullName ?? merged[oldKey]?.newFullName,
        }
      }
    }
    // v1 has no meta
  }
  return merged
}
