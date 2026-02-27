# Cursor Chat History

## Automations Tool — Phase 0, 1 (Apple Shortcuts parity)

### 2026-02-27
- **Phase 0 — Direction lock**: Renamed "Pipeline Variables" → "Variables" in action picker. Added PRD addendum to `Automations Tool.md` with Apple Shortcuts parity target, acceptance criteria, v1 non-goals.
- **Phase 1 — Step inspector + iterative authoring**:
  - **Step Output Inspector**: When a step is selected, right panel shows "Step output" section with node list preview (name/type/id, capped at 20), data/variables preview, last-run metadata (items in→out, errors). "Run to this step" button.
  - **Run to step**: New "Run to step" button in builder footer (when step selected) and in Step Output Inspector. Executes steps 1..N and stops; does not update Figma selection (dry-ish). Result includes per-step `stepOutputs` for inspector.
  - Executor: `executeAutomation` now accepts `ExecuteOptions` (`runToStepIndex`, `collectStepOutputs`). Returns `ExecuteResult` with `stepOutputs` when collecting. `step-output-serializer.ts` serializes nodes (id, name, type) and pipeline vars for UI.
  - Messages: `AUTOMATIONS_RUN` accepts optional `runToStepIndex`. `AutomationsRunResult` has `stepOutputs?: StepOutputPreview[]`.
- **Phase 2** deferred (typed data flow, action compatibility) — can be done in follow-up.
- Build OK.

## Library Swap Tool — Manual pairs tab

### 2026-02-26
- Moved **Manual pairs** into a separate tab (like Print Color Usages: Print / Update / Settings). Library Swap now has **Main** and **Manual pairs** tabs via `ToolTabs`. Created `ManualPairsTab.tsx` with capture slots, pairs table, export target, and Export button. Footer (Analyze / Apply) shows only on Main tab. Build OK.

## Tools registry — order from JSON array

### 2026-02-26
- Removed explicit `order` field from tools registry: display order is now the order of entries in `tools-registry-data.json`.
- Changes: removed `order` from `ToolRegistryEntry` type and from JSON; `HomeView` now uses filtered array as-is (no sort). Build and lint OK.

## Find Color Match Tool — Performance and Caching

### 2026-02-26 (hardcoded lists)
- Find Color Match now uses **hardcoded JSON** first for Int UI Kit Islands: `Int UI Kit  Islands. Color palette.json` and `Int UI Kit  Islands. Semantic colors.json` are bundled and parsed in `hardcoded-data.ts`. Semantic aliases (`$alias: "Color palette:…"`) are resolved against the palette. Load path: try `getHardcodedVariables(collectionName, modeName)` → if present use it (instant); else load from Figma. When you rename or add variables, update the JSON files manually (e.g. re-export from Export tool). Dev spec updated.

### 2026-02-26
- Dropped persistent cache: Find Color Match now uses **Figma directly** (no `int-ui-kit-library/cache.ts`). Original plugin used **local** variables only (no team library), so it was fast; our slowness was from the Islands library path. Decision: remove fingerprint/cache layer, call `loadAndResolveLibraryColorVariables` from resolve when needed; keep session-only in-memory store so re-scans (same collection+mode) don’t re-fetch.
- Removed: `cache.ts`, `runScanFromCacheSync`, `backgroundCacheCheck`. Main-thread uses `discoverCollectionSources` / `loadLibraryCollectionModes` / `loadAndResolveLibraryColorVariables` directly. Progressive results and status bar (updating/ready) unchanged.
- Dev spec updated: no cache; loading strategy describes direct Figma + session-only reuse.

### 2026-02-25
- User reported severe startup slowness in Find Color Match when opening in new projects.
- Main decision: keep caching, but make loading non-blocking and load only active collection first.
- Planned implementation:
  - Make `find-color-match` activation return quickly (so UI becomes usable immediately).
  - Remove eager "load all collections" behavior during activation.
  - Keep fingerprint cache logic and lazy-load by collection/mode.
  - Add dev spec doc named `Find Color Match Tool. Dev Spec.md` under `Specs/tools/`.

### 2026-02-25 (Implementation)
- Updated `src/app/tools/find-color-match/main-thread.ts`:
  - Removed eager all-collection group discovery on activation.
  - Made cold-start scan run in background instead of blocking activation.
  - Added collection/mode race guards for async scan and hex lookup results.
- Added `Specs/tools/Find Color Match Tool. Dev Spec.md`.
- Validation: `npm run build` succeeded, no linter errors in changed files.

## Find Color Match Tool — Selection State Alignment

### 2026-02-25
- Goal: make Find Color Match show correct state on open with non-empty selection (same behavior model as Color Chain), while keeping progress only in bottom bar.
- Updated `src/app/tools/find-color-match/main-thread.ts`:
  - Added explicit `SELECTION_EMPTY` messaging path.
  - Scan paths now send `SELECTION_EMPTY` only when real selection is empty.
  - Removed unconditional empty result post during activation.
- Updated `src/app/views/find-color-match-tool/FindColorMatchToolView.tsx`:
  - `FIND_COLOR_MATCH_RESULT` now marks `selectionEmpty=false`.
  - `SELECTION_EMPTY` remains the only source of `selectionEmpty=true`.
- Added `Specs/tools/Color Chain Tool. Dev Spec.md`.
- Validation:
  - `npm run build` passed.
  - No linter errors in changed files.
  - Fixed an existing preview typing issue in `src/preview/preview-app.tsx` by introducing `LibraryCacheStatusBarShowcase` wrapper with required `status` prop.

## Find Color Match Tool — Include Bound Colors

### 2026-02-25
- New request: search for any selected color (not only unbound), and when color comes from variable/style show that source name in row title while still matching by hex.
- Planned changes:
  - expand scan to include bound variable/style paints
  - include source name/type in found-color payload
  - update Find Color Match row title and wording accordingly
  - update Find Color Match dev spec to reflect new behavior

### 2026-02-25 (Implementation)
- Updated `src/app/tools/find-color-match/scan.ts`:
  - Scans all solid colors (raw + style-bound + variable-bound), not just unbound.
  - Resolves optional source metadata per color: `sourceType` and `sourceName`.
- Updated payload types:
  - `src/app/tools/find-color-match/types.ts`
  - `src/app/messages.ts`
  - `src/app/tools/find-color-match/main-thread.ts` mapping now forwards source metadata.
- Updated `src/app/views/find-color-match-tool/FindColorMatchToolView.tsx`:
  - Row title now shows source variable/style name when present.
  - Secondary line keeps node context + hex/type.
  - Empty text changed to `No colors found in selection`.
  - Counter text changed to `N colors found`.
- Updated fixture `src/test-fixtures/find-color-match.ts` for new fields and wording.
- Updated `Specs/tools/Find Color Match Tool. Dev Spec.md` for the new all-colors scan behavior.
- Validation: `npm run build` passed, no linter errors.

## Find Color Match Tool — Streaming Cache First Attempt

### 2026-02-25
- User requested incremental behavior: show results immediately, fill cache progressively.
- Implemented first streaming pass:
  - `src/app/tools/int-ui-kit-library/resolve.ts`: loader now supports partial callbacks and finer progress cadence.
  - `src/app/tools/int-ui-kit-library/cache.ts`: cache stores partial snapshots during load and tracks completion.
  - `src/app/tools/find-color-match/main-thread.ts`: scan now sends immediate result from current cache and posts progressively improved results during candidate loading (throttled).
- Updated `Specs/tools/Find Color Match Tool. Dev Spec.md` with streaming behavior notes.

## Find Color Match Tool — Filters Layout Grid

### 2026-02-25
- Updated filters layout in `src/app/views/find-color-match-tool/FindColorMatchToolView.tsx`:
  - switched from one horizontal flex row to a 2-column grid
  - collection and mode dropdowns stay on first row
  - `TextboxColor` moved to second row first column (`gridColumn: "1 / 2"`) so width aligns with the first dropdown and no longer stretches the container

## Find Color Match Tool — Component Set Node Name

### 2026-02-25
- Requirement: when scanned node is component from a component set, `nodeName` should use the component set name.
- Implemented in `src/app/tools/find-color-match/scan.ts` using shared utility `getComponentDisplayName` from `src/app/utils/component-name.ts`.
- Behavior:
  - `COMPONENT` -> component set display name (if in set)
  - `INSTANCE` -> uses `mainComponent` display name when available
  - fallback -> node name

## Automations Tool — Phase 1.5 Context System

### 2026-02-23: Context pipeline architecture implemented

**Task:** Implement Phase 1.5 of Automations Tool — introduce Context model, expression tokens, property registry, action categories, run output log.

**What was done:**
- Created `AutomationContext` type (`nodes`, `variables`, `styles`, `log`, `pipelineVars`)
- Created property accessor registry (15 node properties: name, type, width, height, opacity, fillHex, etc.)
- Created expression token resolver supporting `{name}`, `{count}`, `{index}`, `{$pipelineVar}`
- Migrated all 8 existing actions from selection-based to context-based signatures
- Added 7 new actions: `sourceFromSelection`, `sourceFromPage`, `selectResults`, `log`, `count`, `setPipelineVariable`, `setPipelineVariableFromProperty`
- Added action categories (Source, Filter, Navigate, Transform, Pipeline Variables, Output)
- Renamed actions: `findByType` → `filterByType`, `selectByName` → `filterByName`
- Added storage migration for old action names
- Added Run Output screen showing step-by-step log
- Action picker now organized by category with headers

**Architecture decisions:**
- Actions receive `AutomationContext` and return modified context (unified signature)
- Token resolution is centralized in `tokens.ts` but called by actions when needed (per-node or per-context)
- Property accessors are a registry (`properties.ts`) used by tokens, pipeline variables, and future filter actions
- The executor creates initial context from selection, passes it through each step, then syncs back to Figma selection
- Each action adds its own log entries (the action knows best what it did)
- Old automations with `findByType`/`selectByName` are migrated transparently on load

### 2026-02-23: Added Automations to UI Showcase

**Task:** Register Automations tool in UI Showcase with preview scenarios.

**What was done:**
- Added optional `size?: { width; height }` to `Scenario` type for tools that use non-standard frame sizes
- Updated `ScenarioFrame` in `ToolPreview.tsx` to use per-scenario size overrides
- Created `src/test-fixtures/automations.ts` with 8 scenarios:
  - Empty list, List with items, List running, List run success (all 360x500)
  - Builder empty, Builder with steps, Run output success, Run output error (all 680x520)
- Registered `automations-tool` in `tool-registry.ts` under "general" section

### 2026-02-23: Auto-save on Back button in Builder

- `goToList` now sends `AUTOMATIONS_SAVE` before navigating if `editingAutomation` is present
- Only fires from builder screen (editingAutomation is null on run output screen)

### 2026-02-23: Discussed opportunities from Context system

**Summary of Context capabilities:**
- 16 actions across 6 categories (Source, Filter, Navigate, Transform, Pipeline Variables, Output)
- 17 node properties in registry
- Expression tokens: `{name}`, `{type}`, `{index}`, `{count}`, `{$var}` + all properties
- Pipeline variables for passing data between steps
- JSON export/import for sharing automations

**Key opportunities identified:**
- Composable multi-step workflows (source → filter → transform → output)
- Wrapping existing tools (Print Colors, Library Swap) as automation actions (Phase 2)
- Conditions and loops (Phase 3) — architecture already supports them
- Dry run/preview mode — context cloning makes it feasible
- Design QA automations, migration helpers, consistency checks
- Shareable "recipe" automations via export/import

## Phase 2

### 2026-02-23: Phase 2 design — data primitives, loops, action outputs

**Designed Phase 2 by analyzing three example automations from spec:**
1. Many Paster (paste text into layers) — fully covered
2. Resize to parent — needs goToParent, resize, node snapshots
3. Print color usages — needs node creation, data extraction (Phase 4)

**Key architecture decisions:**
- **Action output model** (Apple Shortcuts-style): every step has optional `outputName`. Executor auto-saves result as pipeline var (data actions) or node snapshot (node actions)
- **`savedNodeSets`** on context: named snapshots of working sets, restorable via `restoreNodes`
- **`{#snapshotName.property}`** tokens: access properties of saved node snapshots
- **`repeatWithEach`** supports two modes: iterate a list var (paired with nodes) OR iterate the working set directly
- **`onMismatch`** param on repeat: `"error"` (default), `"repeatList"` (cycle), `"skipExtra"`
- **`ActionResult`** return type: actions return `{ context, output? }` so executor can capture the data output

**Phase 2 actions (8 total):**
- askForInput, splitText, setCharacters (data primitives)
- repeatWithEach (flow control)
- restoreNodes, goToParent, flattenDescendants (navigate)
- resize, setLayoutMode (transform)

**Deferred to Phase 4:** extractPropertyToList, node creation, math expressions, compound actions

### 2026-02-23: Added Figma-First principle, Quick Actions, builder autocomplete

**Figma-First Design Principle:**
- Primitive actions map 1:1 to Figma API operations
- Param keys use Figma's property names (`characters`, `layoutMode`, `opacity`)
- Action labels are human-friendly ("Set text content", "Set auto layout")
- Two-tier model: Primitives (Figma API wrappers) + Compounds (convenience combos, Phase 4)
- Renamed: `setTextContent` → `setCharacters`, `setAutoLayout` → `setLayoutMode`

**Quick Actions (Phase 2R):**
- "Run Automation" menu command with `figma.parameters` autocomplete
- Cmd+/ → Tab → type automation name → runs immediately
- Uses `parameterOnly: false` — Quick Actions shows autocomplete, regular menu opens full UI
- Needs `sync-figma-menu.cjs` extension for `parameters` field support

**Builder Autocomplete (Phase 2Q):**
- `TextboxWithSuggestions` component for token/variable input in step config forms
- Triggered by `{` character → shows available tokens, `{$` for pipeline vars, `{#` for snapshots
- Sources: property registry, previous steps' outputName, enclosing repeat vars

### 2026-02-23: Phase 2 core implementation (2A–2P)

**What was done:**
- **Data model** (2A-2C): Added `outputName`, `children` to AutomationStep. Added `savedNodeSets` to context, `PipelineListValue` type, `ActionResult` return type, `isActionResult` helper. Deep clone for arrays and node sets.
- **9 new action types**: goToParent, flattenDescendants, restoreNodes, setCharacters, resize, setLayoutMode, askForInput, splitText, repeatWithEach. 2 new categories: input, flow.
- **Token resolution**: Added `{#snapshotName.property}` for saved node set properties. Array pipeline vars stringify with `join(", ")`.
- **New action implementations**:
  - `goToParent`: deduplicated parents, skips page root
  - `flattenDescendants`: recursive deep collect of all descendants
  - `restoreNodes`: loads saved node snapshot back to working set
  - `setCharacters`: font loading per TEXT node + template token resolution
  - `resizeAction`: token-aware width/height with fallback to original dimensions
  - `setLayoutMode`: HORIZONTAL/VERTICAL/NONE on FRAME/COMPONENT nodes
  - `splitText`: splits pipeline var string by delimiter, returns ActionResult with list
  - `askForInput`: uses input bridge to pause execution and wait for user input
- **Input bridge** (2D): Promise-based `requestInput`/`resolveInput`/`cancelInput` for main thread ↔ UI communication
- **Messages** (2E): AUTOMATIONS_INPUT_REQUEST/RESPONSE messages, AutomationsInputRequest type
- **Executor refactor** (2F+2J): Extracted `executeSteps` for recursive use, auto-save outputs (data→pipelineVars, nodes→savedNodeSets), repeatWithEach with list mode (paired with nodes, onMismatch: error/repeatList/skipExtra) and nodes mode
- **Main thread** (2M): Handles AUTOMATIONS_INPUT_RESPONSE via input bridge
- **Storage**: Export/import supports outputName + children (recursive)
- **UI**:
  - Config forms for all 9 new actions
  - OutputName field on all step config panels with data/node hint
  - Output name badge on StepRow ($var or #snapshot)
  - Category badges for input (IN) and flow (FLW)
  - Param summaries for all new actions
  - Runtime input dialog overlay (modal with text/textarea, submit/cancel)
  - Nested step rendering for repeatWithEach (indented children block with own Add Step button)
  - StepPath-based selection supporting nested children

**Architecture decisions:**
- `ActionResult` type allows data actions to return output alongside modified context
- `isActionResult` discriminator uses `"context" in value` to distinguish from plain AutomationContext
- repeatWithEach is handled directly in executor (not an action handler) since it needs recursive executeSteps
- In list mode, repeatList iterates nodeCount times (list cycles); skipExtra iterates min(list, nodes)
- Input bridge uses promise pattern — requestInput posts message and returns promise, resolveInput completes it
- StepPath = `{ index: number; childIndex?: number }` for clean nested selection tracking

### 2026-02-24: Phase 2 completion (2Q–2R) and Apple Shortcuts audit

**What was done:**
- **TextboxWithSuggestions** (2Q): Reusable autocomplete component. Triggers on `{` character, shows dropdown with property tokens, pipeline vars, saved snapshots, loop vars. Keyboard navigation (arrows, Enter/Tab, Escape), click-outside dismiss. Used for rename replace, setCharacters, resize, notify/log, setPipelineVariable value fields.
- **Quick Actions** (2R): "Run Automation" menu command with `figma.parameters` autocomplete. Separate entry point (`src/run-automation/main.ts`). Shows saved automations list in Cmd+/, runs selected automation directly without UI. Falls back to full UI for automations with `askForInput` steps. `sync-figma-menu.cjs` extended with QUICK_ACTIONS array.
- **buildSuggestions** helper: Computes available tokens from context tokens (count, index), property registry (15 properties), previous steps' outputName ($data or #nodes), and enclosing repeatWithEach loop variables ($item, $repeatIndex).

**Phase 2 audit vs Apple Shortcuts:**

What we do **differently** (and why):
1. **Explicit output naming** — Apple auto-names every output ("Output of Ask for Input"). We require explicit `outputName`. Reason: text-based `{$var}` tokens are more compact than Apple's tap-to-insert model, and explicit naming makes JSON exports more readable.
2. **Two output types** (data vs nodes) — Apple has one output type per action. We distinguish `$data` (pipelineVars) from `#nodes` (savedNodeSets). Reason: Figma operates on two fundamentally different things — live node references and data values.
3. **Template tokens** `{curly braces}` — Apple uses visual variable chips (tap to insert). We use text `{token}` syntax. Reason: plugin text input can't support drag-and-drop chips. TextboxWithSuggestions bridges the gap with autocomplete.
4. **Two-column builder** — Apple uses single-column inline editing. We use two columns (steps left, config right). Reason: narrow plugin window can't fit Apple's wide inline cards. Two columns separate concerns well for complex automations.
5. **Quick Actions** — Apple has Siri, widgets, home screen, share sheet. We have Figma's Cmd+/ Quick Actions. Both let users trigger automations without opening the full UI.

What we do **better** for our domain:
1. **Node-centric design** — Purpose-built for Figma's node tree. Source → Filter → Navigate → Transform pipeline maps directly to how designers think about batch operations.
2. **Saved node snapshots** (#snap) — No equivalent in Apple Shortcuts. Lets you save a working set, navigate elsewhere, then reference the saved nodes' properties. Critical for "resize to parent" type workflows.
3. **`{#snap.property}` tokens** — Read properties from saved snapshots inline. Apple would need separate "Get Details" actions.
4. **onMismatch handling** in repeatWithEach — error/repeatList/skipExtra for list-node pairing. Apple Shortcuts doesn't have this concept since it doesn't pair external data with visual elements.
5. **JSON export/import** — Shareable automation recipes as plain JSON files. More portable than Apple's iCloud-linked shortcuts for team workflows.

What we should consider **aligning** (future phases):
1. **Conditions** (Phase 4) — Apple has If/Otherwise/End If. Essential for smart automations. Already planned.
2. **Action search** — Apple's full-text search across all actions is very useful. Our picker only has category browsing. Consider adding a search field to the action picker.
3. **Auto-generated output names** — Could default to `actionType_stepIndex` if user doesn't set outputName, making outputs always referenceable. Trade-off: adds noise when output isn't needed.
4. **Choose from Menu/List** — Apple's "Choose from Menu" and "Choose from List" are useful input patterns beyond text. Could add as input actions.
5. **Step notes/descriptions** — Apple lets you add notes to steps for documentation. Could add an optional `description` field to AutomationStep.

### 2026-02-24: Split setLayoutMode into three auto layout actions

**Task:** Replace the single `setLayoutMode` action with three semantically distinct actions matching Figma's own UI model.

**What was done:**
- **addAutoLayout**: Enables auto layout on frames/components with direction (HORIZONTAL/VERTICAL) and optional initial item spacing
- **editAutoLayout**: Changes properties on nodes that already have auto layout — direction, item spacing, padding (top/right/bottom/left). Only affects nodes with `layoutMode != "NONE"`. Empty fields preserve current values.
- **removeAutoLayout**: Turns off auto layout (`layoutMode = "NONE"`)
- Storage migration: `setLayoutMode` with `layoutMode: "NONE"` → `removeAutoLayout`, otherwise → `addAutoLayout`
- UI: Dedicated config forms for each — Add has direction dropdown + spacing, Edit has direction + spacing + 4-field padding grid, Remove has no params

**Why:** The original `setLayoutMode` conflated three distinct operations into one dropdown. Splitting matches Figma's own "Add auto layout" / "Remove auto layout" UI pattern and the Figma-First design principle. Edit is a natural complement for changing existing layouts without toggling them on/off.

### 2026-02-24: Add wrapInFrame action

**Task:** Auto layout only works on FRAME/COMPONENT nodes. Need a way to wrap non-frame nodes into frames first.

**What was done:**
- **wrapInFrame** action (category: transform): Wraps each node in the working set into its own frame. Creates frame at node's position/size, reparents node into it, clears fills to make it transparent. Optionally enables auto layout on the wrapper frame (HORIZONTAL/VERTICAL).
- Working set is updated to contain the new wrapper frames (not the original nodes), so subsequent `addAutoLayout` or `editAutoLayout` works.
- Config form: dropdown for optional auto layout direction (None/Vertical/Horizontal)
- Typical workflow: `sourceFromSelection` → `wrapInFrame(autoLayout: VERTICAL)` → done, or `wrapInFrame()` → `addAutoLayout` → `editAutoLayout`

### 2026-02-24: Fix Many Paster automation + UX improvements

**Task:** Many Paster automation failed because `askForInput` output wasn't being saved as a pipeline variable. Plus UX improvements: auto-generated output names, Input dropdowns with autocomplete, auto-populate from previous step.

**Bugs fixed:**
- **`askForInput` missing `producesData: true`**: Output was saved to `savedNodeSets` instead of `pipelineVars`, causing downstream `splitText` to fail with "Variable $input not found"
- **`countAction` not returning `ActionResult`**: Had `producesData: true` but returned plain context, so output was silently dropped. Now returns `{ context, output: count }`

**UX improvements:**
- **Auto-generated output names**: New steps get default names based on action type (e.g., "askForInput", "splitText-2"). Implemented via `generateDefaultOutputName()` and `collectOutputNames()` in `types.ts`. `repeatWithEach` excluded (doesn't produce output).
- **Input dropdowns with autocomplete**: `splitText`, `repeatWithEach`, and `restoreNodes` now show dropdown selectors listing available outputs from previous steps instead of raw text fields. Dropdowns filter by type (data-only for splitText/repeat, node snapshots for restoreNodes).
- **Auto-populate input from previous step**: When adding `splitText` or `repeatWithEach`, auto-sets input to previous data-producing step's output.
- **Removed `outputRequired` concept**: All outputs are optional with auto-generated defaults. Removed from `askForInput` and `splitText` definitions, removed from `ActionDefinition` interface.

**Architecture:**
- `buildInputSourceOptions()` helper: Scans previous steps for outputs, returns formatted dropdown options with `$`/`#` prefix indicators
- `renderStepParams()` now receives `allSteps` and `stepIndex` for context-aware UI
- `StepConfigPanel` passes step context to params renderer

### 2026-02-24: Action picker search + repeatWithEach syntax help + spec update

**What was done:**
- **Action picker search**: Added search/filter textbox to `ActionPickerPanel`. Searches across label, description, and action type name. Shows "No actions matching" empty state when no results.
- **repeatWithEach syntax help**: Added detailed inline documentation in the config panel explaining nodes mode vs list mode, available variables (`$itemVar`, `$repeatIndex`), and onMismatch behavior. `onMismatch` dropdown now only shown in list mode (hidden when source is "nodes").
- **Spec updated**: Replaced outdated "Implementation Progress" and "Implementation Phases" sections in `Automations Tool.md` with comprehensive "Current Implementation" documentation covering all 28 action types, their params, the output system, expression tokens, JSON format with corrected Many Paster example, and updated phase descriptions.

### 2026-02-24: Context-aware child steps + label improvements

- **Renamed "Working set (nodes)"** → "Current nodes" in repeatWithEach dropdown — less jargon
- **setCharacters context inside repeat**: When `setCharacters` is inside a `repeatWithEach`, shows "Input" section with available loop variables (`$item`, `$repeatIndex`). Placeholder changes to `Use {$item} for current item`.
- **Auto-populate setCharacters in repeat**: When adding `setCharacters` inside a `repeatWithEach`, auto-fills `characters` param with `{$itemVar}` so user immediately sees what it will do.
- **parentStep passed through config chain**: `StepConfigPanel` and `renderStepParams` now receive optional `parentStep` for context-aware rendering of child steps.

### 2026-02-24: Count input hint + copy run log

- **Count input hint**: `count` config now shows "Input" section indicating what nodes are being counted (label of previous step).
- **Copy run log**: Run Output screen footer now has "Done" + "Copy log" buttons side by side. `formatLogAsText()` formats the log as plain text with status indicators (`[OK]`, `[ERR]`, `[SKIP]`), step names, item counts, messages, and errors. "Copy log" button shows "Copied!" feedback for 2 seconds.

### 2026-02-26: Copy log on Edit page run output

- **Run output in builder**: The Run Output right panel (when running from Edit page) now has a "Copy log" button after the run, matching the full Run Output screen. Extracted `RunOutputPanelWithResult` to hold result UI + copy state and button; reuses `formatLogAsText()` and same "Copied!" feedback.

### 2026-02-26: Paste component by ID + Copy log fixes

**Issues:** (1) Automation "Paste components by IDs and wrap" failed with: `getNodeById: Cannot call with documentAccess: dynamic-page. Use figma.getNodeByIdAsync instead`. (2) Copy log buttons (full Run Output screen and Edit page panel) did not copy anything in plugin UI.

**Fixes:**
- **component-actions.ts**: In `resolveComponentById()`, replaced synchronous `figma.getNodeById(componentId)` with `await figma.getNodeByIdAsync(componentId)` so it works with `documentAccess: "dynamic-page"`.
- **Copy log**: Both RunOutputScreen and RunOutputPanelWithResult now use `copyTextToClipboard()` from `../../utils/clipboard`, which uses Clipboard API with fallback to `document.execCommand("copy")` via a temporary textarea, so copy works in the Figma plugin iframe. Only show "Copied!" when copy succeeds.

### 2026-02-26: Repeat nodes mode — $item for current node

**Issue:** Automation "Add Numeration to Text" (repeat with each node → setCharacters "{$repeatIndex}. {$item}") produced "1. ", "2. ", "3. " because in nodes mode the executor never set the item variable, so {$item} was empty.

**Fixes:**
- `{$item}` (plain): executor sets `pipelineVars[itemVar]` to node's text content or name each iteration.
- `{$item.text}` / `{$item.name}` / `{$item.<prop>}`: added `repeatItemNode` on context — the actual SceneNode reference for the current iteration. Token resolver checks `context.repeatItemVar` + `context.repeatItemNode` (NOT `scope.node`) so it works in any action (log, notify, etc.), not just actions that happen to set scope.node. Alias: `text` → `characters`.
- `repeatItemNode` is set alongside `repeatItemVar` in `executeRepeatNodesMode` and cleaned up after the loop.

### 2026-02-26: Math action

**Task:** Add arithmetic operations (add, subtract, multiply, divide) so users can compute values like `repeatIndex + startWith`.

**What was done:**
- **`math` action** (category: variables): params `x`, `y` (token-aware), `operation` (add/subtract/multiply/divide). Produces data output. Handles division by zero.
- **UI**: Config form with X (TextboxWithSuggestions), Operation (dropdown: Plus/Minus/Multiply/Divide), Y (TextboxWithSuggestions). Param summary shows `X + Y` style.
- **Use case**: `askForInput` (startWith=5) → repeat → `math` (x: `{$repeatIndex}`, op: add, y: `{$startWith}`, out: lineNumber) → `setCharacters` (`{$lineNumber}. {$item.text}`) → results: 5. text, 6. text, 7. text.

### 2026-02-26: Autocomplete fixes + askForInput default value

**Issues:** (1) Inside repeat, `$item` and `$item.text` etc. didn't appear in autocomplete suggestions. (2) Child steps inside repeat couldn't see sibling child step outputs (e.g., math output). (3) askForInput had no default/initial value.

**Fixes:**
- **`buildSuggestions`**: Now accepts `childIndex` param. When inside a repeat, adds `$item.text`, `$item.name`, and all `$item.<property>` suggestions under "Loop item properties" category. Also scans sibling children `[0..childIndex-1]` for their outputs so later children can reference earlier ones.
- **`askForInput` default value**: Added `defaultValue` param through the full stack — `ActionDefinition.defaultParams`, `input-bridge.ts` (`requestInput` signature), `input-actions.ts`, `AutomationsInputRequest` message type, `InputDialog` (initializes state with `defaultValue`), config form (new "Default value" field between label and placeholder).

### 2026-02-24: Fix Cancel button in Ask for Input dialog

**Bug:** Pressing Cancel in the input dialog submitted an empty string and continued the automation instead of stopping it.

**Fix:** Cancel now properly stops the automation:
- Added `InputCancelledError` class in `input-bridge.ts` — `cancelInput()` rejects the promise instead of resolving with ""
- Added `cancelled` flag to `AUTOMATIONS_INPUT_RESPONSE` message type
- Main thread calls `cancelInput()` when `cancelled: true` (was always calling `resolveInput`)
- Executor catches `InputCancelledError` and sets `stopRequested = true` with "skipped" status (not error)
- UI has separate `handleInputCancel` callback sending `cancelled: true`
- `InputDialog` accepts `onCancel` prop, Cancel button calls it. Escape key also triggers cancel.

### 2026-02-24: Fix Quick Actions auto-run for askForInput automations

**Bug:** Running an automation with `askForInput` via Figma's Quick Actions (Cmd+/ → "Run Automation") just opened the Automations list — didn't actually run the automation. User had to find it and click Run again.

**Fix:** Added auto-run mechanism:
- `setAutoRunAutomation(id)` in `main-thread.ts` stores a pending automation ID
- `run-automation/main.ts` calls `setAutoRunAutomation(automationId)` before `run("automations-tool")` for askForInput automations
- `onActivate` checks for `pendingAutoRunId` — if set, immediately runs the automation after UI boots
- Refactored `runAutomationById()` helper extracted from inline AUTOMATIONS_RUN handler to avoid duplication
- Flow: Quick Actions → set pending ID → open UI → UI boots → auto-run → input dialog appears → user submits → execution completes → run output shown

### 2026-02-24: Fix Quick Actions "Cannot show UI in queryMode" crash

**Bug:** Running ANY automation via Quick Actions (Cmd+/ → "Run Automation") crashed with `Cannot show UI in queryMode`. The "Add auto-layout to each" automation (no askForInput) triggered it too.

**Root cause:** `build-figma-plugin` calls `modules[commandId]()` (the default export) immediately during plugin initialization. For Quick Actions commands with `parameters`, Figma is in "query mode" at that point (for parameter autocomplete). The default export received no arguments (`event` = undefined), fell to `else { run("automations-tool") }` → `showUI()` → crash because `showUI()` is forbidden in query mode.

**Fix (two parts):**
1. Restructured `run-automation/main.ts` so the default export only registers `figma.on("run", handler)` instead of executing directly. The actual logic moved to `handleRun()` called from the "run" event handler, which fires AFTER Figma exits query mode:
   - From Quick Actions: query mode → parameter collection → "run" event fires with `parameters` → `handleRun(parameters)` runs in normal mode
   - From Plugins menu: no query mode → "run" event fires without parameters → `handleRun(undefined)` → opens full Automations UI
2. Wrapped `figma.ui.postMessage()` in `executor.ts` with try/catch — the progress update call crashed when running headlessly via Quick Actions (no UI to post to)

### 2026-02-24: Automation builder UX improvements — auto-save, Run from Edit, inline output

**Task:** Three UX improvements: (1) auto-save after each change, (2) allow running from builder, (3) show run output in right panel.

**What was done:**
- **Auto-save**: Debounced (800ms) save triggers whenever `editingAutomation` changes while on builder screen. Uses `lastSavedRef` to avoid re-save loops when AUTOMATIONS_SAVED response updates the state. Flushes immediately on Back navigation or Run button.
- **Run from builder**: Footer changed from [Save] [Export JSON] to [▶ Run] [Export JSON]. Save button removed since auto-save makes it redundant. `handleBuilderRun` flushes pending auto-save, saves immediately, then sends AUTOMATIONS_RUN.
- **Run output in right panel**: New `"runOutput"` state added to `RightPanel` type. `RunOutputPanel` component shows progress (step X/Y: stepName) while running, then full log with step-by-step results on completion. Reuses existing `StepLogRow` component.
- **InputDialog on builder**: Input dialog overlay now renders on builder screen too (was only on list screen), so `askForInput` steps work when running from the builder.
- **Run result routing**: `screenRef` tracks current screen. When result arrives and screen is "builder", result stays in right panel. When on list screen, still navigates to full RunOutputScreen as before.

**Architecture decisions:**
- Auto-save uses `useRef` for timer and last-saved JSON to avoid stale closure issues in useEffect
- Run clears any pending auto-save timer and sends save+run messages sequentially (main thread processes in order)
- `screenRef` (useRef) used instead of state in the message handler to avoid stale closure from the `useEffect([], [])` pattern

### 2026-02-24: Input context hints for all action config forms

**Task:** Many action config panels didn't show what data flows in from previous steps. Users couldn't discover `{#snapshot.property}` syntax for referencing saved node sets (e.g., getting parent's width for resize).

**What was done:**
- Created `renderInputContext()` helper: generates an "Input" section showing (1) which previous step provides nodes, (2) available `$variables` and `#snapshots` for token-enabled fields, (3) repeat context when inside `repeatWithEach`
- Added input hints to 20+ action configs across all categories:
  - **Navigate**: `goToParent`, `expandToChildren`, `flattenDescendants` — "Nodes from: {prev step}"
  - **Filter**: `filterByType`, `filterByName` — "Filtering: {prev step}"
  - **Transform with tokens**: `resize`, `setCharacters`, `renameLayers` — nodes + available vars/snapshots
  - **Transform simple**: `setFillColor`, `setFillVariable`, `setOpacity`, `wrapInFrame`, `addAutoLayout`, `editAutoLayout`, `removeAutoLayout` — "Nodes from: {prev step}"
  - **Output**: `notify`/`log`, `count`, `selectResults` — context-appropriate labels
  - **Variables**: `setPipelineVariable`, `setPipelineVariableFromProperty` — tokens/nodes context
- Replaced custom inline hints in `setCharacters` and `count` with the generic helper for consistency

### 2026-02-24: Explicit step references — Apple Shortcuts-style

**Task:** Eliminate `restoreNodes` workaround by adding explicit target/input references. Add `setPosition` action. Fix autocomplete for snapshot properties. Add value-source dropdowns.

**What was done:**
- **`target` field on AutomationStep**: Optional field that specifies which saved node set to load before running the action. Executor swaps `context.nodes` to the referenced snapshot before calling the handler. Backward compatible — omitted `target` keeps the previous working-set flow. Eliminates `restoreNodes` for most use cases.
- **Target dropdown in config panel**: All filter/navigate/transform actions show a "Target nodes" dropdown when previous steps have node-set outputs. Options: "Previous step (default)" + all `#snapshot` outputs from earlier steps.
- **Auto-generated output names**: All new steps (except `repeatWithEach`) auto-get an `outputName` via `generateDefaultOutputName()`. Output name shown on step rows as `→ #outputName` or `→ $outputName`, plus target shown as `#target →` when set.
- **Autocomplete for `#snapshot.property`**: `buildSuggestions` now generates property-level suggestions for every node-set output (e.g., `#parent.width`, `#parent.height`, `#selection.name`), using the full `PROPERTY_REGISTRY`.
- **Value-source dropdowns for resize and setPosition**: Width/Height (and X/Y) fields now show a dropdown with "Custom value" + all `step.property` combinations from previous node-set steps. Selecting a preset inserts `{#step.property}` as the param value; selecting "Custom value" shows the textbox for freeform input.
- **`setPosition` action** (category: transform): Sets `node.x` and/or `node.y` on working set nodes. Supports tokens. Leave blank to keep original. Same config pattern as resize with value-source dropdowns.
- **Storage**: Export/import handles `target` field on steps.
- **Messages**: `AutomationStepPayload` includes `target` field.

**Files changed:**
- `types.ts` — `target?: string` on `AutomationStep` + `AutomationExportStepFormat`, `"setPosition"` in ActionType union + ACTION_DEFINITIONS
- `executor.ts` — `target` swap before handler call, registered `setPositionAction`
- `property-actions.ts` — `setPositionAction` handler
- `storage.ts` — `target` in export/import
- `messages.ts` — `target` in `AutomationStepPayload`
- `AutomationsToolView.tsx` — `buildSuggestions` expanded, `buildValueSourceOptions` helper, target dropdown in `StepConfigPanel`, resize/setPosition config forms with value-source dropdowns, `getParamSummary` case for setPosition, step row shows target

### 2026-02-24: Automation card three-dot menu with Duplicate & Delete

**Task:** Replace inline Delete button on automation list cards with a three-dot (kebab) menu containing Duplicate and Delete actions.

**What was done:**
- Added `AUTOMATIONS_DUPLICATE` message type for UI→main thread communication
- Added `duplicateAutomation()` in `storage.ts` — creates a deep clone with new ID and "(copy)" suffix
- Added handler in `main-thread.ts` to process duplicate requests and refresh the list
- Replaced the Delete button in `AutomationRow` with a `···` kebab menu that opens a dropdown with "Duplicate" and "Delete" options
- Run button remains visible on hover as the primary action
- Menu closes on outside click or mouse leave

**Files changed:**
- `messages.ts` — `AUTOMATIONS_DUPLICATE` message type
- `storage.ts` — `duplicateAutomation()` function
- `main-thread.ts` — duplicate message handler
- `AutomationsToolView.tsx` — `AutomationRow` kebab menu, `handleDuplicate` callback, wired through `ListScreen`

### 2026-02-24: Phase 3 — Extended actions, unified filter, token UI

**Task:** Add 19 new basic Figma API actions, replace separate filters with unified filter, audit output names to nouns, add token highlighting UI.

**What was done:**

1. **Output name audit**: Added `defaultOutputName` field to `ActionDefinition`. All 28 existing actions got noun-based defaults (e.g., `sourceFromSelection`→`selection`, `goToParent`→`parent`, `askForInput`→`input`). `generateDefaultOutputName()` now uses `def.defaultOutputName ?? actionType`.

2. **Unified filter action**: Replaced `filterByType` + `filterByName` with single `filter` action supporting:
   - AND/OR logic toggle between conditions
   - 12 filter fields: type, name, visible, component, fillColor, fillVariable, hasFills, hasStrokes, hasVariable, opacity, width, height
   - Query-builder UI with per-condition field/operator/value dropdowns and add/remove buttons
   - Legacy `filterByType`/`filterByName` params still work via auto-detection in handler

3. **19 new actions:**
   - **Source (2):** `sourceFromAllPages`, `sourceFromPageByName`
   - **Transform — Properties (9):** `setName`, `setStrokeColor`, `removeFills`, `removeStrokes`, `setVisibility`, `setLocked`, `setRotation`, `removeNode`, `cloneNode`
   - **Transform — Text (6):** `setFontSize`, `setFont`, `setTextAlignment`, `setTextCase`, `setTextDecoration`, `setLineHeight`
   - **Transform — Components (2):** `detachInstance`, `swapComponent`

4. **TokenHighlighter component**: Renders token expressions as styled pills with **hidden internal syntax** — `{`, `}`, `#`, `$` are never visible to users:
   - Blue/indigo pills for property tokens (e.g., `width`, `name`)
   - Green pills for pipeline variables (e.g., `myVar`)
   - Orange/amber pills for snapshot references (e.g., `parent › width`)
   - Used in step rows, param summaries, input context hints, run output log, repeat help text
   - `stripTokenSyntax()` helper for plain-text contexts (clipboard log copy)

5. **Storage migration**: Auto-converts on load:
   - `filterByType`/`filterByName` → `filter` with conditions array
   - Old verb-style output names → new noun defaults
   - Token references `{#oldName.prop}` → `{#newName.prop}`

**Files changed:**
- `types.ts` — ActionType union (47 types), `defaultOutputName` field, `FilterCondition`/`FilterField`/`FilterLogic` types, `FILTER_FIELDS` array, `getOperatorsForField()`
- `actions/filter-actions.ts` — new file, unified `filterAction` with `evaluateCondition()` for 12 fields
- `actions/source-actions.ts` — `sourceFromAllPages`, `sourceFromPageByName`
- `actions/property-actions.ts` — 9 new handlers: `setStrokeColor`, `removeFills`, `removeStrokes`, `setVisibility`, `setLocked`, `setNameAction`, `setRotation`, `removeNodeAction`, `cloneNodeAction`
- `actions/text-actions.ts` — new file, 6 handlers: `setFontSize`, `setFont`, `setTextAlignment`, `setTextCase`, `setTextDecoration`, `setLineHeight`
- `actions/component-actions.ts` — new file, 2 handlers: `detachInstance`, `swapComponent`
- `executor.ts` — registered all 19 new + 1 unified filter handlers
- `storage.ts` — `OUTPUT_NAME_MIGRATIONS` map, filter→conditions migration, token reference migration
- `components/TokenHighlighter.tsx` — new file, colored pill rendering for `{token}` expressions
- `AutomationsToolView.tsx` — imports, `getParamSummary()` for all new actions, `renderStepParams()` with unified filter query-builder UI and 19 new config forms, `TokenHighlighter` integration in step rows
- `Specs/tools/Automations Tool.md` — updated Current Implementation section with all 47 actions

### 2026-02-24: Hide internal token syntax from users

**Task:** Token syntax characters (`{`, `}`, `#`, `$`) are internal implementation details — users should never see them anywhere in the UI.

**What was done:**
- **TokenHighlighter** updated: `classifyToken()` strips prefix characters and formats clean labels. `$myVar` → `myVar` (green pill), `#parent.width` → `parent › width` (orange pill), `name` → `name` (blue pill). Added `stripTokenSyntax()` for plain-text contexts.
- **TextboxWithSuggestions** dropdown: Uses TokenHighlighter pills instead of raw `{token}` text.
- **Step row badges**: Target and output name badges use TokenHighlighter pills instead of raw `#target →` / `→ $output`.
- **getParamSummary()**: Variable references now wrapped with `{...}` so TokenHighlighter processes them (e.g., `setPipelineVariable` shows pill instead of `$varName`).
- **renderInputContext()**: Available tokens listed as TokenHighlighter pills instead of raw `{$var}`, `{#snap.*}` text.
- **Dropdown labels**: `buildInputSourceOptions` and `buildValueSourceOptions` no longer show `#`/`$` prefixes.
- **Placeholders**: Rephrased from "Supports {$var}, {name} tokens..." to "Supports tokens from previous steps".
- **Output name hint**: Simplified from "($name)" / "(#name)" to just "data variable" / "node snapshot".
- **repeatWithEach help text**: Uses TokenHighlighter pills instead of raw `{$item}`, `{$repeatIndex}` syntax.
- **StepLogRow**: Renders messages through TokenHighlighter.
- **Executor + action log messages**: Wrapped `$var` references with `{...}` for TokenHighlighter processing.
- **Clipboard log copy**: Uses `stripTokenSyntax()` for clean plain-text output.
- **Plan updated**: Part 3 redesigned as "Token Display — Hide Internal Syntax" with TokenDisplay + TokenInput components spec.

**Files changed:**
- `TokenHighlighter.tsx` — `classifyToken()`, `stripTokenSyntax()`, `TokenStyle` type
- `TextboxWithSuggestions.tsx` — import + use TokenHighlighter in dropdown
- `AutomationsToolView.tsx` — all display points cleaned
- `executor.ts` — log messages wrapped for TokenHighlighter
- `variable-actions.ts` — log messages wrapped for TokenHighlighter

### 2026-02-24: Fix Dropdown crash + migration gap for bare output name references

**Bug:** Clicking "Split text" step in builder crashed with `Invalid value: askForInput`. The `Dropdown` component from `@create-figma-plugin/ui` throws when `value` doesn't match any `option`. The `sourceVar` param still held the old output name `"askForInput"` (pre-migration) while the actual output name was migrated to `"input"`.

**Root cause:** `migrateTokenReferences()` only handled `{#name.prop}` and `{$name}` token patterns in string params. Bare name references (`sourceVar`, `source`, `snapshotName`) that directly store an output name without `{...}` wrapping were not migrated.

**Second bug:** Back button "squished" the screen — window resized to 360px (list size) but builder screen stayed visible. Caused by Preact's render tree being in an error state from the Dropdown crash, preventing `setScreen("list")` from taking effect.

**Fixes:**
1. **Storage migration**: Added `BARE_REF_PARAMS` set (`sourceVar`, `source`, `snapshotName`). `migrateTokenReferences()` now checks bare string params against the nameMap for direct output name references.
2. **Defensive `safeDropdownValue()` helper**: Falls back to first option if value doesn't match any option. Applied to all reference dropdowns (splitText input, repeatWithEach source, restoreNodes snapshot, target nodes).
3. **restoreNodes filter fix**: The `#` prefix filter `o.text.startsWith("#")` broke after removing `#` from option text. Replaced with proper `producesData !== true` filter.

**Files changed:**
- `storage.ts` — `BARE_REF_PARAMS`, updated `migrateTokenReferences()`
- `AutomationsToolView.tsx` — `safeDropdownValue()`, applied to 4 dropdowns, fixed restoreNodes filter

## Library Swap / merge-mapping script

### 2026-02-26: How to run merge-mapping and merge two inbox files

**Task:** Run `scripts/merge-mapping.cjs` to merge two manual mapping JSONs from "Figma JSONs/mapping inbox" into the plugin default, then delete the source files.

**How the script works:**
- Merges **one** exported mapping JSON into the plugin’s built-in mapping.
- Usage: `node scripts/merge-mapping.cjs <path-to-exported.json> <icons|uikit>`
- Run from the **plugin repo** (`figma-jb-variables-utilities`). JSON path can be absolute (e.g. another project folder).
- Target: `uikit` for UI components (Labelled Input, Toggle, Slim Button, etc.); `icons` for icon-only mappings.
- Result is written to `src/app/tools/library-swap/default-uikit-mapping.json` (or `default-icon-mapping.json`). Then run `npm run build` to rebuild the plugin.

**To merge two files:** Run the script twice (one file per run); both merge into the same default. Then delete the source files manually or via delete_file.

**Done:** Merged `manual-mapping-26.02.2026-12-01.json` (1 entry) and `manual-mapping-26.02.20026-12-56.json` (3 entries) into uikit default (636 → 640 entries). Deleted both source files from mapping inbox.

## Token-aware input (Automations)

### 2026-02-26: TokenInput component — tokens as pill UI in "Text content" field

**Task:** Input fields could not parse tokens as UI elements; only TokenHighlighter was used elsewhere. Implement a token-aware input that shows `{...}` tokens as pill/chip UI inside the field.

**What was done:**
1. **token-utils.ts** — Shared token parsing: `TOKEN_REGEX`, `parseTokenSegments()`, `classifyToken()`, `segmentsToValue()`. Token categories: pipeline ($), snapshot (#), property. TokenHighlighter refactored to use token-utils.
2. **TokenInput.tsx** — New component: contenteditable div with token pills (non-editable spans with remove ×). Value stays a single string; DOM sync on input/paste/keydown/remove. Token pills use same classification colors; optional suggestion dropdown (trigger on `{`, filter, Enter/Tab to insert). Backspace before a token removes the whole token. Paste normalizes pasted text so tokens become pills.
3. **Automations "Text content"** — Replaced `TextboxWithSuggestions` with `TokenInput` for setCharacters step param so the field shows e.g. `{$repeatIndex}. {$item}` as token pills instead of plain text.

**Files:** `src/app/components/token-utils.ts`, `TokenHighlighter.tsx`, `TokenInput.tsx`; `AutomationsToolView.tsx` (setCharacters uses TokenInput). Fixed pre-existing ScopeControl.tsx (added `import { h } from "preact"`) so build passes.

### 2026-02-26: TokenInput — fix 6 issues (border jump, duplicate insert, prefix search, item.text alias, replace all TextboxWithSuggestions, dropdown styling)

**Issues fixed:**
1. **Border jump on hover** — Container had no border by default; hover added `1px solid` causing layout shift. Fix: always `border: 1px solid transparent`, only change `borderColor` on hover/focus.
2. **Duplicate text on suggestion insert** — Partial text `{ma` stayed in DOM when inserting suggestion pill. Fix: `insertSuggestion` now uses value-based replacement (slice old value at `triggerStart`, insert token, rebuild DOM), plus new `placeCaretAtOffset` helper for cursor positioning.
3. **Prefix search not matching** — Typing `item` didn't match `$item` because filter only did `startsWith`. Fix: also strips `$`/`#` prefix and checks `includes()`.
4. **`{$item.text}` not in suggestions** — Runtime resolver supports `text` → `characters` alias, but suggestion list only iterated PROPERTY_REGISTRY (key=`characters`). Fix: explicitly add `$item.text` alias suggestion after the registry loop.
5. **Replace all TextboxWithSuggestions** — All 13 remaining `TextboxWithSuggestions` in AutomationsToolView replaced with `TokenInput`. Import updated to get `Suggestion` type from TokenInput.
6. **Dropdown styling** — Updated SuggestionDropdown: 28px row height, `bg-hover` for highlight (not `bg-selected`), `borderRadius: 6` on container, `borderRadius: 4` on items, hover tracking, `padding: "4px 0"` container padding, category headers restyled. Added second TokenInput instance in preview showcase to demonstrate suggestions.

**Files:** `src/app/components/TokenInput.tsx`, `src/app/views/automations-tool/AutomationsToolView.tsx`, `src/preview/preview-app.tsx`.

### 2026-02-26: Branch review — TokenInput flex wrapper, bug fixes, helpers extract, merge into automations-tool

**Task:** Review Codex branch, fix TokenInput height/growth, apply bug fixes and cleanup, then rebase onto automations-tool and delete the feature branch.

**What was done:**
1. **TokenInput** — Restructured to match Figma native pattern: styling moved to a flex wrapper (`display: flex`, `align-items: center`, `height: 24px`, `padding: 0 7px`); contentEditable is a plain flex child (`flex: 1 1 auto`, `whiteSpace: nowrap`, `overflow: hidden`). Fixes input growing when pills are present.
2. **TokenPill** — Removed `marginTop: 2px`, set `verticalAlign: middle` for centering in the flex line.
3. **property-actions** — Extracted `parseHexColor()` helper; used in `setFillColor` and `setStrokeColor` (validates hex length).
4. **text-actions** — Guard `loadFontForNode`: return false for empty text nodes before `getRangeFontName(0, 1)`.
5. **Dead code** — Deleted `TextboxWithSuggestions.tsx` (unused). Cleaned `token-utils.ts`: removed unused `TokenStyle` and color objects, simplified `segmentsToValue`.
6. **AutomationsToolView** — Extracted helpers to `helpers.tsx`: `getCategoryBadge`, `getParamSummary`, `buildSuggestions`, `formatLogAsText`, `buildInputSourceOptions`, `buildValueSourceOptions`, `renderInputContext`.
7. **Git** — Merged `codex/create-automation-for-component-placement` into `automations-tool` (fast-forward), deleted the feature branch. Current branch: `automations-tool` (ahead of origin by 13 commits).

**Deferred:** Part 4B (extract leaf components) and 4C (extract step-params-renderer) — can be done in a follow-up to avoid risk in one session.
