## Refactoring & Optimisation Ideas (tech spec)

### Goal
Improve **performance**, **reliability** (no stale results / race conditions), and **maintainability** of the plugin as more tools get added — without changing the user-visible behavior of existing tools.

### Scope (what this spec covers)
- `View Colors Chain` performance + correctness improvements
- Project structure refactors that make “many tools in one plugin” easier to scale
- Lightweight testing + rollout guidance (non-developer friendly)

### Non-goals (for now)
- Adding new user-facing features
- Rewriting UI components or changing UI visuals
- Automated test harness (we’ll use a manual checklist)

---

## Current architecture (relevant parts)

### Data flow
- **Main thread**: `src/app/run.ts`
  - Opens UI, listens to `selectionchange`, sends results to UI.
- **Scanner + resolver**: `src/app/variable-chain.ts`
  - Walks selected node trees, extracts bound variable IDs from paints, resolves alias chains.
- **UI**: `src/app/views/color-chain-tool/ColorChainToolView.tsx`
  - Renders a list/tree; for each variable it typically displays **only one chain** (current applied mode if known, otherwise the first chain).

### Observed inefficiency
Main thread currently resolves **chains for every mode** of a collection, even though UI typically renders **one** chain.

---

## Refactoring / optimisation proposals (prioritised)

## P0 — “Biggest wins, low risk”

### P0.1 Compute only the chain we actually display
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

### P0.2 Add caching for variable + collection fetches during chain resolution
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

### P0.3 Prevent stale results when selection changes quickly (race-proof updates)
**Problem**
- Current code schedules updates and “fires and forgets” async work; quick selection changes can post results for an older selection.

**What changes**
- Add an incrementing `updateId` (or selection fingerprint) in main thread.
- Only post results if the finished computation matches the latest `updateId`.

**Why it’s a good idea**
- Prevents flicker and “wrong selection results” moments.

**Will it break any existing functionality?**
- No expected behavior change; it only prevents outdated updates from rendering.

**How main user flow will change**
- None; it will feel more stable.

**Manual test checklist**
- Rapidly change selection between two layers → UI should not briefly show the wrong layer’s results.

---

## P1 — “Maintainability wins + medium complexity”

### P1.1 Deduplicate variable IDs during scan (reduce repeated work)
**What changes**
- Before calling `onVariable(id, …)`, deduplicate ids per node (or per selection) using a `Set`.

**Why**
- Large selections can produce the same variable ID many times (fills/strokes/text, many descendants).

**Risks**
- Low. The only subtle risk is applied mode detection: ensure we still collect mode IDs from nodes where the variable appears.

**Manual test**
- A component with many nested layers using the same token → list should still contain that variable once (as today).

---

### P1.2 Remove dead/duplicated code paths in `variable-chain.ts`
**What changes**
- Keep one “find variables” implementation (node-based).
- Remove unused helpers if not referenced anywhere.

**Why**
- Less code means fewer bugs and easier future refactors.

**Risks**
- Low, but confirm no other tool imports the old function.

---

### P1.3 Improve module boundaries: `src/plugin` vs `src/ui` vs `src/shared`
**What changes (suggested structure)**
- `src/plugin/` — Figma main thread code (`run`, scanners, figma API calls)
- `src/ui/` — Preact UI
- `src/shared/` — message contracts (`messages.ts`) and shared types

**Why**
- Cleaner separation as more tools are added.
- Prevents accidental UI-to-plugin coupling.

**Risks**
- Medium (file moves + import path churn).

**Manual test**
- `npm run build` succeeds
- Plugin still loads in Figma, both menu commands open correctly

---

## P2 — “Nice-to-have improvements”

### P2.1 Add lightweight performance instrumentation (debug-only)
**What changes**
- Time the main thread scan (`Date.now()` before/after) and optionally post a hidden debug metric to UI, or log to console.

**Why**
- Helps detect regressions as tools grow.

**Risks**
- Very low if gated behind a `DEBUG_PERF` flag.

---

## Rollout plan (recommended order)
1. **P0.3** stale-result guard (reliability) — easiest to validate.
2. **P0.2** caching — quick performance win.
3. **P0.1** “only compute what we render” — biggest performance win, requires message/type updates.
4. P1 items as cleanup once the tool feels stable and fast.

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

