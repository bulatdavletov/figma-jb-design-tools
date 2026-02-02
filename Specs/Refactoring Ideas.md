## Refactoring & Optimisation Ideas (tech spec)

### Goal
Improve **performance**, **reliability** (no stale results / race conditions), and **maintainability** of the plugin as more tools get added — without changing the user-visible behavior of existing tools.

### Scope (what this spec covers)
- Refactors to make “many tools in one plugin” easier to scale
- `View Colors Chain` performance + correctness improvements
- `Print Color Usages` UI efficiency + maintainability improvements
- Lightweight testing + rollout guidance (non-developer friendly)

### Non-goals (for now)
- Adding new user-facing features
- Rewriting UI components or changing UI visuals
- Automated test harness (we’ll use a manual checklist)

---

## Tool: View Colors Chain

### Current architecture (relevant parts)

#### Data flow
- **Main thread**: `src/app/run.ts`
  - Opens UI, listens to selection/document changes, sends results to UI.
- **Scanner + resolver**: `src/app/variable-chain.ts`
  - Walks selected node trees, extracts bound variable IDs from paints, resolves alias chains.
- **UI**: `src/app/views/color-chain-tool/ColorChainToolView.tsx`
  - Renders a list/tree; for each variable it typically displays **only one chain** (current applied mode if known, otherwise the first chain).

#### Observed inefficiency
- Main thread can resolve **chains for every mode** of a collection, even though UI typically renders **one** chain.

### Proposals (prioritised)

#### P0.1 Compute only the chain we actually display
**What changes**
- Change the data contract so main thread sends:
  - `chainToRender` (single chain) instead of `chains[]` (all modes),
  - plus metadata like `appliedMode` and optionally `hasOtherModes`.

**Why it’s a good idea**
- Massive reduction in variable-alias traversal and Figma API calls.
- Keeps UI output the same (UI already chooses 1 chain to show).

**Will it break any existing functionality?**
- Low risk if we keep the same selection rules and chain rendering logic.
- Requires a coordinated change across:
  - `src/app/messages.ts` (types)
  - `src/app/variable-chain.ts` (output shape)
  - `src/app/views/color-chain-tool/ColorChainToolView.tsx` (consume new shape)

**How main user flow will change**
- It won’t. User still selects layers and sees the same list.

**Implementation steps (safe rollout)**
1. Add a new message payload type (versioned) alongside the old one.
2. Update UI to support both shapes (backward compatibility).
3. Switch main thread to send only the new payload.
4. Remove old payload once stable.

**Manual test checklist**
- Empty selection → shows empty state.
- Selection with variable-bound fill → shows variable name + chain steps + final HEX.
- Mixed-mode selection (if possible) → still shows something sensible (fallback chain).

---

#### P0.2 Add caching for variable + collection fetches during chain resolution
**What changes**
- Reuse a `Map<string, Variable | null>` and `Map<string, VariableCollection | null>` across:
  - extraction,
  - chain traversal (alias resolution).

**Why it’s a good idea**
- Many alias chains converge to the same variables; caching avoids repeated async calls.

**Will it break any existing functionality?**
- Very unlikely. Caching does not change values, only reduces repeated fetches.

**How main user flow will change**
- None; it should just feel faster.

**Implementation steps**
1. Create shared caches in `inspectSelectionForVariableChainsByLayer()`.
2. Pass caches into `resolveChainForMode()` (or its replacement).

**Manual test checklist**
- Same selection repeatedly (click different layers back and forth) → results appear faster and consistently.

---

#### P1.1 Deduplicate variable IDs during scan (reduce repeated work)
**What changes**
- Before calling `onVariable(id, …)`, deduplicate ids per node (or per selection) using a `Set`.

**Why**
- Large selections can produce the same variable ID many times (fills/strokes/text, many descendants).

**Risks**
- Low. The only subtle risk is applied mode detection: ensure we still collect mode IDs from nodes where the variable appears.

**Manual test**
- A component with many nested layers using the same token → list should still contain that variable once (as today).

---

#### P1.2 Remove dead/duplicated code paths in `variable-chain.ts`
**What changes**
- Keep one “find variables” implementation (node-based).
- Remove unused helpers if not referenced anywhere.

**Why**
- Less code means fewer bugs and easier future refactors.

**Risks**
- Low, but confirm no other tool imports the old function.

---

## Tool: Print Color Usages

### Current architecture (relevant parts)

#### Data flow
- **Main thread tool runner**: `src/app/tools/print-color-usages/main-thread.ts`
  - Posts selection + settings to UI, runs Print/Update actions, saves settings.
- **UI**: `src/app/views/print-color-usages-tool/PrintColorUsagesToolView.tsx`
  - Renders settings form + bottom actions, sends settings updates back to main thread.

#### Observed inefficiency / pain points
- **Save-after-load**: UI currently persists settings immediately after receiving `PRINT_COLOR_USAGES_SETTINGS` (no user action).
- **Chatty saves**: every quick toggle posts a save message (and main thread writes to `figma.clientStorage`).
- **Working status not visible**: UI sets `status`, but doesn’t display `status.message` anywhere (only button loading).
- **Layout is “hand-rolled”**: this view re-implements “scrollable body + fixed actions”, while other tools already have standard layout building blocks (e.g. `ToolBody`).

### Proposals (prioritised)

#### P0.1 Stop “save-after-load” by separating hydration vs user edits
**What changes**
- Introduce a “hydration” concept so settings received from main thread do not trigger persistence back.
  - Examples: `hydratedRef`, `skipNextSaveRef`, or `dirty` flag that is only set by UI interactions.

**Why it’s a good idea**
- Removes redundant message traffic and storage writes.
- Makes it harder to accidentally create a save loop as the tool grows.

**Will it break any existing functionality?**
- Low risk. Biggest subtlety: ensure user changes still persist reliably.

**How main user flow will change**
- It won’t. The UI behaves the same; it just does less background work.

**Manual test checklist**
- Open tool → no save happens until you change a setting.
- Change a setting → close tool → reopen → change is persisted.

---

#### P0.2 Debounce settings persistence + flush before actions
**What changes**
- Debounce settings saves (e.g. 250–500ms) so multiple rapid toggles result in one save.
- Flush any pending save before triggering `Print` / `Update` (so actions always use the latest settings).

**Why**
- Less message traffic + fewer storage writes.
- Avoids subtle “last toggle wasn’t saved yet” situations.

**Risks**
- Medium-low. Risk is losing last change if plugin closes before debounce fires.
  - Mitigation: flush on unmount + flush before Print/Update.

**Manual test checklist**
- Toggle multiple options quickly → settings still persist after closing + reopening.
- Change a setting → immediately click `Print` → output uses the latest setting.

---

#### P1.1 Display `status.message` inline (small, secondary text)
**What changes**
- Render the current status message (“Printing…”, “Updating…”) near the bottom actions or below header (secondary text).

**Why**
- Better feedback: “loading” buttons alone can be ambiguous.

**Risks**
- Very low.

---

#### P1.2 Use shared tool layout primitives (`ToolBody` + a reusable “fixed actions” wrapper)
**What changes**
- Align this view with other tools by using `ToolBody` for the scrollable content area.
- Optional follow-up: introduce a shared `ToolFooterActions` component (divider + container + button row) so multiple tools can reuse it.

**Why**
- Consistency and less custom layout code per tool.

**Risks**
- Low-medium: visual spacing might shift slightly; validate in Figma UI.

---

#### P1.3 Consolidate message wiring into a reusable UI hook
**What changes**
- Extract common “listen to `window.message` + route by `msg.type`” logic into something like `usePluginMessages(...)`.

**Why**
- Most tools will need the same wiring; reduces copy/paste and subtle message handling bugs.

**Risks**
- Medium: refactor touches multiple tools if adopted widely; do it incrementally.

---

## Rollout plan (recommended order)
1. **Cross-tool reliability**: stale-result guard for async work (see below) — easiest to validate.
2. **View Colors Chain**: caching — quick performance win.
3. **View Colors Chain**: “only compute what we render” — biggest performance win, requires message/type updates.
4. **Print Color Usages**: stop save-after-load + debounce saves — reduces background work and avoids future loops.
5. P1 items as cleanup once both tools feel stable and fast.

---

## Testing & safety (non-developer friendly)

### Is it a good idea to do these refactors?
**Yes**, because they target:
- performance (less scanning / fewer API calls),
- reliability (no stale UI state),
- maintainability (easier to add more tools safely).

### Will it break any existing functionality?
It shouldn’t if we:
- ship changes incrementally (one refactor at a time),
- keep backward compatibility for the message payload during the transition,
- always run the manual checklist in a “golden test file”.

### How main user flow will change
It should **not change**. The user will do the same actions (select layers, view chain); it just becomes faster and less glitchy.

### Minimum “release” checklist
- Run `npm run build`
- In Figma:
  - Run **Tools Home**
  - Run **View Colors Chain**
  - Test empty selection, simple selection, and a nested selection

---

## Cross-tool / platform proposals

### P0.1 Prevent stale UI updates when async work completes out of order (race-proof updates)
**Problem**
- Tool runners can “fire and forget” async work; quick user actions (selection changes, reruns, etc.) can result in older work posting results after newer work started.

**What changes**
- Add an incrementing `updateId` (or request ID) and only post results if the finished computation matches the latest `updateId`.

**Why it’s a good idea**
- Prevents flicker and “wrong selection results” moments.

**Will it break any existing functionality?**
- No expected behavior change; it only prevents outdated updates from rendering.

**How main user flow will change**
- None; it will feel more stable.

**Manual test checklist**
- Rapidly change selection between two layers → UI should not briefly show the wrong layer’s results.

---

### P1.1 Improve module boundaries: `src/plugin` vs `src/ui` vs `src/shared`
**What changes (suggested structure)**
- `src/plugin/` — Figma main thread code (tool runners, scanners, figma API calls)
- `src/ui/` — Preact UI
- `src/shared/` — message contracts (`messages.ts`) and shared types

**Why**
- Cleaner separation as more tools are added.
- Prevents accidental UI-to-plugin coupling.

**Risks**
- Medium (file moves + import path churn).

**Manual test**
- `npm run build` succeeds
- Plugin still loads in Figma, all menu commands open correctly

---

### P2.1 Add lightweight performance instrumentation (debug-only)
**What changes**
- Time “main thread scan + resolve” work (`Date.now()` before/after) and log to console, or post a debug metric to UI behind a `DEBUG_PERF` flag.

**Why**
- Helps detect regressions as tools grow.

**Risks**
- Very low if gated behind a flag.

