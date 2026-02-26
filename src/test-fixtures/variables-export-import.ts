import type { Scenario } from "./types"
import type { MainToUiMessage } from "../home/messages"

const COLLECTIONS: MainToUiMessage = {
  type: "EXPORT_IMPORT_COLLECTIONS_LIST",
  collections: [
    { id: "col-1", name: "Int UI Kit", modeCount: 2, variableCount: 320 },
    { id: "col-2", name: "Brand Colors", modeCount: 1, variableCount: 45 },
    { id: "col-3", name: "Spacing", modeCount: 1, variableCount: 12 },
  ],
}

export const scenarios: Scenario[] = [
  {
    id: "collections-list",
    label: "Collections List",
    messages: [COLLECTIONS],
  },
  {
    id: "import-preview",
    label: "Import Preview",
    messages: [
      COLLECTIONS,
      {
        type: "EXPORT_IMPORT_PREVIEW",
        payload: {
          totals: {
            considered: 8,
            create: 3,
            update: 4,
            rename: 1,
            conflicts: 0,
            missingCollections: 0,
            invalid: 0,
          },
          entries: [
            { collectionName: "Int UI Kit", variableName: "button/tertiary/bg", status: "create" },
            { collectionName: "Int UI Kit", variableName: "button/primary/bg", status: "update" },
            { collectionName: "Int UI Kit", variableName: "text/link", status: "update" },
            { collectionName: "Brand Colors", variableName: "accent/coral", status: "rename", reason: "accent/red → accent/coral" },
          ],
        },
      },
    ],
  },
  {
    id: "apply-result",
    label: "Apply Result",
    messages: [
      COLLECTIONS,
      {
        type: "EXPORT_IMPORT_APPLY_RESULT",
        payload: {
          totals: { created: 3, updated: 4, renamed: 1, skipped: 0, failed: 0 },
          results: [
            { collectionName: "Int UI Kit", variableName: "button/tertiary/bg", status: "created" },
            { collectionName: "Int UI Kit", variableName: "button/primary/bg", status: "updated" },
            { collectionName: "Brand Colors", variableName: "accent/coral", status: "renamed" },
          ],
        },
      },
    ],
  },
]
