## Find Color Match Tool. Dev Spec

### Purpose
Match any selection solid colors (raw, style-bound, or variable-bound) to the closest Int UI Kit color variables, then let user apply selected variable bindings to nodes.

### Primary files
- `src/app/tools/find-color-match/main-thread.ts`
- `src/app/views/find-color-match-tool/FindColorMatchToolView.tsx`
- `src/app/tools/find-color-match/scan.ts`
- `src/app/tools/find-color-match/match.ts`
- `src/app/tools/find-color-match/apply.ts`
- `src/app/tools/find-color-match/variables.ts`
- `src/app/tools/find-color-match/types.ts`
- `src/app/tools/find-color-match/hardcoded-data.ts` — loads from shared JSON in `figma-exports/` for instant matching
- `figma-exports/Int UI Kit  Islands. Color palette.json` — hardcoded palette (shared, update manually when library changes)
- `figma-exports/Int UI Kit  Islands. Semantic colors.json` — hardcoded semantic (shared, update manually when library changes)
- `src/app/tools/int-ui-kit-library/resolve.ts`
- `src/app/tools/int-ui-kit-library/constants.ts`
- `src/app/components/LibraryCacheStatusBar.tsx`
- `src/app/messages.ts`

### Scope and library
- Library name source of truth: `INT_UI_KIT_LIBRARY_NAME` in `int-ui-kit-library/constants.ts`.
- Allowed color collections are explicitly whitelisted by `INT_UI_KIT_COLOR_COLLECTION_KEYS`.
- Tool works with collection + mode selection; optional group filter is derived from variable name prefix before first `/`.

### Runtime flow
1. Tool activates (`registerFindColorMatchTool`).
2. Collections are discovered via Figma team library API and posted to UI.
3. Scan runs: if we already have variables in memory for this collection+mode (session-only), results show immediately. Otherwise we try **hardcoded JSON** first (instant); if available for that collection+mode we use it. If not, we load from Figma via `loadAndResolveLibraryColorVariables`, show found colors with empty matches first, then progressive results as variables stream in.
4. Selection changes trigger debounced re-scan (reuses session-loaded candidates when same collection+mode).
5. Hex lookup loads variables for active collection+mode when needed, returns top matches.
6. Apply action binds selected variable to node paint and returns per-row apply result.

### Loading strategy
- **Hardcoded first**: Two shared JSON files from `figma-exports/` (Color palette, Semantic colors) are bundled and parsed at load. For the whitelisted Int UI Kit collections, `getHardcodedVariables(collectionName, modeName)` returns resolved color variables instantly. Semantic aliases (e.g. `$alias: "Color palette:gray-130"`) are resolved against the palette. When you rename or add variables in the library, update the shared JSON files in `figma-exports/` manually (e.g. re-export from the Export tool).
- **Fallback**: If no hardcoded data for the selected collection+mode, variables are loaded from Figma via `int-ui-kit-library/resolve.ts`.
- Session-only in-memory store: last loaded candidates (from hardcoded or Figma) are kept so re-scans don’t re-fetch; switching collection/mode loads again (hardcoded then Figma).
- Progress is shown via `LIBRARY_CACHE_STATUS` (updating/ready) and optional progressive result updates via `onPartial` when loading from Figma.

### Message contract (high level)
- UI -> Main:
  - `FIND_COLOR_MATCH_SCAN`
  - `FIND_COLOR_MATCH_SET_COLLECTION`
  - `FIND_COLOR_MATCH_SET_MODE`
  - `FIND_COLOR_MATCH_SET_GROUP`
  - `FIND_COLOR_MATCH_HEX_LOOKUP`
  - `FIND_COLOR_MATCH_APPLY`
  - `FIND_COLOR_MATCH_FOCUS_NODE`
- Main -> UI:
  - `FIND_COLOR_MATCH_COLLECTIONS`
  - `FIND_COLOR_MATCH_GROUPS`
  - `FIND_COLOR_MATCH_RESULT`
  - `FIND_COLOR_MATCH_HEX_RESULT`
  - `FIND_COLOR_MATCH_APPLY_RESULT`
  - `LIBRARY_CACHE_STATUS`

### Key implementation notes
- Preserve Figma order (collections and variables); do not add extra alphabetical sorting.
- Keep progress messages non-blocking and visible via `LIBRARY_CACHE_STATUS`.
- Avoid loading data for non-active collections unless user actually switches to them.
- Guard async result posting against stale collection/mode context where possible.
- Scan payload includes source metadata per color: `sourceType` (`VARIABLE` | `STYLE` | `RAW`) and optional `sourceName`. UI uses `sourceName` for row title when available.
- **Apply**: Library variables are not in the document until imported. Apply uses `getVariableByIdAsync` first; if not found, uses `importVariableByKeyAsync(variableKey)`. So `variableKey` (library variable key from team library) must be sent with the apply request. When loading from Figma we have it; for hardcoded JSON the `key` field is included in the export. `enrichCandidatesWithLibraryKeys` patches any candidates still missing keys as a safety net. Apply works even when the "outdated" banner is showing.

### Outdated hardcoded tokens status bar
When hardcoded JSON files (Color palette, Semantic colors) are loaded and the tool detects that the live Int UI Kit library differs from the bundled data, a warning bar appears at the bottom of the tool UI via `LIBRARY_CACHE_STATUS` with `state: "outdated"`. The comparison is **one-directional**: "outdated" means the library has variables not present in the hardcoded data. Extra variables in the hardcoded data (e.g. deleted from library) are tolerated — only missing new variables trigger the warning. The comparison strategy is adaptive:
- **Key-based** (preferred): When the exported JSONs include proper `key` fields (hash-style library keys), comparison uses variable keys for reliable matching.
- **Name-based** (fallback): For older JSONs without `key` fields (where `variableKey` starts with `VariableID:`), comparison falls back to variable name matching.

#### Library key enrichment
`checkLibraryState` fetches live library variables. `enrichCandidatesWithLibraryKeys` patches only candidates that are missing `key` or still have the old `VariableID:` format, mapping by name → key. Modern exported JSONs with proper keys need no patching.

The status bar shows **one contextual action button**, depending on where the plugin is running:

- **In the UI Kit source file** (`isSourceFile: true`): The document name contains `INT_UI_KIT_LIBRARY_NAME`. The bar shows an **"Export"** button that navigates to the Variables Export/Import tool so the user can re-export the updated tokens into the bundled JSON files.
- **Not in the UI Kit source file** (`isSourceFile: false`): The bar shows an **"Open UI Kit"** button that opens the Islands UI Kit Figma file in a new browser tab so the user can navigate there and export.

Detection uses `figma.root.name` compared against `INT_UI_KIT_LIBRARY_NAME` from `int-ui-kit-library/constants.ts`.

The outdated message text is also context-specific:
- Source file: "Hardcoded JSON is outdated. Export updated tokens."
- Other file: "Hardcoded JSON is outdated. Open UI Kit to export updated tokens."

### Testing checklist
- Open Find Color Match in a fresh project with large library:
  - UI appears quickly.
  - Cache status feedback appears.
  - Results eventually appear without reopening tool.
- Switch collection/mode and verify:
  - Correct candidates loaded.
  - Groups dropdown updates for selected collection.
- Verify selection-based scan updates on `selectionchange`.
- Verify hex lookup returns closest variables and copy/apply still work.
- Verify apply still binds variable and shows success/failure notifications.
