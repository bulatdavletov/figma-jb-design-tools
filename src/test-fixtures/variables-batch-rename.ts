import type { Scenario } from "./types"
import type { MainToUiMessage } from "../app/messages"

const COLLECTIONS: MainToUiMessage = {
  type: "BATCH_RENAME_COLLECTIONS_LIST",
  collections: [
    { id: "col-1", name: "Int UI Kit", modeCount: 2, variableCount: 320 },
    { id: "col-2", name: "Brand Colors", modeCount: 1, variableCount: 45 },
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
    label: "Import Preview (mixed)",
    messages: [
      COLLECTIONS,
      {
        type: "BATCH_RENAME_IMPORT_PREVIEW",
        payload: {
          meta: { version: 1, title: "Rename plan Q1 2026" },
          totals: {
            considered: 6,
            renames: 3,
            unchanged: 1,
            conflicts: 1,
            missing: 1,
            stale: 0,
            invalid: 0,
            outOfScope: 0,
          },
          entries: [
            {
              variableId: "VariableID:abc/1",
              collectionId: "col-1",
              collectionName: "Int UI Kit",
              currentName: "button/primary/bg",
              newName: "button/primary/background",
              status: "rename",
            },
            {
              variableId: "VariableID:abc/2",
              collectionId: "col-1",
              collectionName: "Int UI Kit",
              currentName: "text/primary",
              newName: "text/default",
              status: "rename",
            },
            {
              variableId: "VariableID:abc/3",
              collectionId: "col-1",
              collectionName: "Int UI Kit",
              currentName: "text/secondary",
              newName: "text/secondary",
              status: "unchanged",
            },
            {
              variableId: "VariableID:abc/4",
              collectionId: "col-1",
              collectionName: "Int UI Kit",
              currentName: "surface/elevated",
              newName: "surface/raised",
              status: "conflict",
              reason: "Name already taken",
              conflictWith: [{ variableId: "VariableID:abc/99", name: "surface/raised" }],
            },
            {
              variableId: "VariableID:abc/5",
              collectionId: "col-1",
              collectionName: "Int UI Kit",
              expectedOldName: "border/focus",
              newName: "border/focused",
              status: "missing",
              reason: "Variable not found in file",
            },
            {
              variableId: "VariableID:abc/6",
              collectionId: "col-1",
              collectionName: "Int UI Kit",
              currentName: "icon/default",
              newName: "icon/primary",
              status: "rename",
            },
          ],
        },
      },
    ],
  },
]
