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
- `src/app/tools/int-ui-kit-library/cache.ts`
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
2. Collections are discovered and posted to UI.
3. Fast path: if candidate variables for active collection+mode exist in memory cache, scan runs from cache and results are shown instantly.
4. Cold path: scan starts in background; cache status is posted while loading; rows are shown immediately from current cache (or empty matches), then progressively improved as candidates stream in.
5. Selection changes trigger debounced re-scan.
6. Hex lookup uses the same candidate pool and returns top matches.
7. Apply action binds selected variable to node paint and returns per-row apply result.

### Caching and loading strategy
- Shared cache module: `int-ui-kit-library/cache.ts`.
- Cache key: `collectionKey + modeId`.
- Invalidation strategy: fingerprint check (`sorted COLOR variable keys`) before trusting cached variables.
- On cache hit + unchanged fingerprint: return cached variables immediately.
- On fingerprint mismatch or empty cache: reload variables through `loadAndResolveLibraryColorVariables`.
- During reload, cache receives partial candidate snapshots so UI can improve results incrementally.
- Activation does **not** eagerly preload all collections anymore; variables are loaded lazily for active collection/mode.

### Why performance was bad before
- Activation used to load variable groups for all whitelisted collections.
- Each variable load includes import + collection lookup + alias-chain resolution.
- Result: first open in a new project could block interaction for a long time.

### Current performance behavior
- Tool opens quickly and remains responsive sooner.
- Heavy loading is deferred to active collection/mode and done when actually needed.
- Background cache check still verifies freshness and can trigger re-scan if data changed.

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
