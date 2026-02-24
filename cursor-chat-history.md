# Cursor Chat History

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

**Fix:** Restructured `run-automation/main.ts` so the default export only registers `figma.on("run", handler)` instead of executing directly. The actual logic moved to `handleRun()` called from the "run" event handler, which fires AFTER Figma exits query mode:
- From Quick Actions: query mode → parameter collection → "run" event fires with `parameters` → `handleRun(parameters)` runs in normal mode
- From Plugins menu: no query mode → "run" event fires without parameters → `handleRun(undefined)` → opens full Automations UI
