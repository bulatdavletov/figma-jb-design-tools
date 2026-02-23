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
