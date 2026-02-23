## Refactoring & Optimisation Ideas (tech spec)

**Last updated**: 2026-02-04

### Goal
Improve **performance**, **reliability** (no stale results / race conditions), and **maintainability** of the plugin as more tools get added — without changing the user-visible behavior of existing tools.

### Scope (what this spec covers)
- Refactors to make "many tools in one plugin" easier to scale
- Cross-tool code deduplication and consistency
- Tool-specific performance + correctness improvements
- Lightweight testing + rollout guidance (non-developer friendly)

### Non-goals (for now)
- Adding new user-facing features
- Major UI visual redesigns
- Automated test harness (we'll use a manual checklist)

---

## Priority Overview

| Priority | Impact | Risk | Items |
|----------|--------|------|-------|
| **P0** | High | Low | Shared utilities extraction, debounce settings, stale-result guard |
| **P1** | Medium | Low-Medium | Pattern consistency, component extraction, hooks |
| **P2** | Low | Medium | Project structure reorganization, type safety |

---

## Most Impactful Refactorings to Do Next (recommended order)

1. **Single source of truth for tool registry (P0)**
   - Replace duplicated per-tool lists and switch/if ladders in `src/app/run.ts`, `src/app/ui.tsx`, and `package.json`-aligned metadata with one shared `TOOLS_REGISTRY` (id, title, activate handler, view mapping, menu label).
   - This removes the highest-risk maintenance issue today: adding a tool currently requires editing many places and can silently drift.

2. **Centralize message routing/activation pipeline (P0)**
   - In `run.ts`, replace repeated `if` chains for activation + message dispatch with a data-driven array/map of registered handlers.
   - Gives immediate reliability and simpler extensibility for every new tool.

3. **Extract shared variable + color utilities (P0)**
   - Consolidate duplicated color/variable lookup helpers into `src/app/shared/*` as already outlined below.
   - Low-risk code reduction with strong bug-fix leverage (fix once, applies across tools).

4. **Add stale-result guards for async tool updates (P0)**
   - Introduce request tokens/update IDs for long-running scans and ignore out-of-date responses.
   - Highest user-facing reliability improvement (prevents flicker and wrong late results).

5. **Normalize UI message hooks + route mapping (P1)**
   - Introduce `usePluginMessages` and reuse shared route constants from the same tool registry.
   - Improves readability and reduces repeated event listener logic in tool views.

### Why this order
- Items 1-2 reduce ongoing engineering cost and defect risk whenever tools are added.
- Items 3-4 reduce correctness issues and duplicated bug surfaces.
- Item 5 is useful, but mostly compounds value after the registry/routing foundation is in place.

---

## Cross-tool: Shared Code Extraction

### P0.1 Extract shared color utilities
**Status**: Not started

**Problem**
Duplicate color conversion functions exist in multiple files:
- `src/app/variable-chain.ts`: `colorToRgbHex()`, `toByteHex()`, `clamp01()`
- `src/app/tools/print-color-usages/analyze.ts`: `rgbToHex()`

**What changes**
- Create `src/app/shared/color-utils.ts` with:
  - `rgbToHex(color: RGB): string`
  - `rgbaToHex(color: RGBA): string`
  - `colorToOpacityPercent(color: ColorValue): number`
  - `clamp01(n: number): number`

**Why it's a good idea**
- Single source of truth for color conversions
- Easier to fix bugs (fix once, applies everywhere)

**Implementation steps**
1. Create shared file with consolidated functions
2. Update imports in `variable-chain.ts`
3. Update imports in `analyze.ts`
4. Run `npm run build` and test

---

### P0.2 Extract shared Figma variable resolution utilities
**Status**: Not started

**Problem**
Similar variable/collection resolution logic with caching exists in multiple files:
- `src/app/variable-chain.ts` (getVariable/getCollection with caches)
- `src/app/tools/print-color-usages/shared.ts` (getVariableCollectionCached)
- `src/app/tools/mockup-markup/resolve.ts` (getVariableById, findLocalVariableByName, importVariableFromLibrary)
- `src/app/tools/print-color-usages/markup-kit.ts` (resolveColorVariableId)

**What changes**
- Create `src/app/shared/figma-variables.ts` with:
  - `getVariableByIdCached(id: string, cache?: Map): Promise<Variable | null>`
  - `getVariableCollectionByIdCached(id: string, cache?: Map): Promise<VariableCollection | null>`
  - `resolveColorVariableByIdOrName(rawId: string, fallbackNames: string[]): Promise<string | null>`
  - `importVariableFromLibrary(nameCandidates: string[], preferredLibrary?: string): Promise<Variable | null>`
  - `namesMatch(candidate: string, wanted: string): boolean`
  - `normalizeVariableId(rawId: string): string`

**Why it's a good idea**
- Reduces ~200 lines of duplicated code
- Consistent behavior across tools
- Caching logic in one place

**Will it break any existing functionality?**
- No. Same logic, consolidated.

**Implementation steps**
1. Create shared file with consolidated functions
2. Update Mockup Markup `resolve.ts` to use shared functions
3. Update Print Color Usages `markup-kit.ts` to use shared functions
4. Update `variable-chain.ts` to use shared functions
5. Run tests

---

### P0.3 Extract shared logging utility
**Status**: Not started

**Problem**
Inconsistent logging patterns across tools:
- Mockup Markup: `logDebug()`, `logWarn()` with consistent prefixes
- Print Color Usages: `debugLog()` with DEBUG_MARKUP_IDS flag
- Color Chain: No structured logging

**What changes**
- Create `src/app/shared/logging.ts`:
```typescript
type LogContext = string
const DEBUG = false // or read from environment

export function logDebug(context: LogContext, message: string, data?: Record<string, unknown>): void
export function logWarn(context: LogContext, message: string, data?: Record<string, unknown>): void
export function logError(context: LogContext, message: string, error?: Error | unknown): void
```

**Why it's a good idea**
- Consistent log formatting across all tools
- Easy to enable/disable debug logging globally
- Searchable log prefixes

---

## Cross-tool: Pattern Consistency

### P1.1 Standardize message handler pattern (use switch)
**Status**: Not started

**Problem**
Mixed patterns for handling messages in main-thread files:
- Color Chain: `if (msg.type === ...) { ... return true }`
- Print Color Usages: `if (msg.type === ...) { ... return true }`
- Mockup Markup: `switch (msg.type) { case ...: }`

**What changes**
- Standardize on `switch` statement pattern (like Mockup Markup)
- More readable, easier to add new message types

**Implementation steps**
1. Update `color-chain-tool/main-thread.ts`
2. Update `print-color-usages/main-thread.ts`
3. Verify consistent return patterns

---

### P1.2 Extract `usePluginMessages` hook
**Status**: Not started

**Problem**
Each UI view has nearly identical message listener setup code (~15 lines each).

**What changes**
- Create `src/app/hooks/usePluginMessages.ts`:
```typescript
export function usePluginMessages<T extends { type: string }>(
  handlers: Partial<Record<T['type'], (msg: T) => void>>
): void {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as T | undefined
      if (!msg || !('type' in msg)) return
      const handler = handlers[msg.type as keyof typeof handlers]
      handler?.(msg as any)
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}
```

**Why it's a good idea**
- DRY: reduces ~45 lines of duplicated code (3 views × 15 lines)
- Consistent message handling
- Easier to add global error handling

**Risks**
- Medium: refactor touches multiple views; do incrementally

---

### P1.3 Simplify UI routing logic
**Status**: Not started

**Problem**
Repetitive ternary conditionals for route mapping:
```typescript
setRoute(
  msg.command === "color-chain-tool"
    ? "color-chain-tool"
    : msg.command === "print-color-usages-tool"
      ? "print-color-usages-tool"
      : // ... more
)
```

**What changes**
```typescript
const VALID_ROUTES = ["color-chain-tool", "print-color-usages-tool", "mockup-markup-tool"] as const
type Route = (typeof VALID_ROUTES)[number] | "home"

const route: Route = VALID_ROUTES.includes(msg.command as any) 
  ? (msg.command as Route) 
  : "home"
```

**Why it's a good idea**
- Less code
- Adding new tools = just add to array
- Type-safe route validation

---

## Cross-tool: Component Extraction

### P1.4 Extract `ToolFooterActions` component
**Status**: Not started

**Problem**
Both Print Color Usages and Mockup Markup have similar "fixed bottom actions" layout:
```tsx
<Divider />
<Container space="small">
  <VerticalSpace space="small" />
  {/* buttons */}
  <VerticalSpace space="small" />
</Container>
```

**What changes**
- Create `src/app/components/ToolFooterActions.tsx`:
```typescript
export function ToolFooterActions(props: { children: preact.ComponentChildren }) {
  return (
    <>
      <Divider />
      <Container space="small">
        <VerticalSpace space="small" />
        {props.children}
        <VerticalSpace space="small" />
      </Container>
    </>
  )
}
```

**Why it's a good idea**
- Consistent footer spacing across tools
- Less layout code per view

---

## Cross-tool: Reliability

### P0.4 Prevent stale UI updates (race-proof async work)
**Status**: Not started

**Problem**
Tool runners can "fire and forget" async work. Quick user actions (selection changes) can result in older work posting results after newer work started, causing UI flicker.

**What changes**
- Add an incrementing `updateId` to each tool runner
- Only post results if the finished computation matches the latest `updateId`

**Example**:
```typescript
let currentUpdateId = 0

const sendUpdate = async () => {
  const thisUpdateId = ++currentUpdateId
  const results = await computeExpensiveResults()
  if (thisUpdateId !== currentUpdateId) return // stale, discard
  figma.ui.postMessage({ type: MAIN_TO_UI.RESULTS, results })
}
```

**Why it's a good idea**
- Prevents flicker and "wrong selection results" moments
- No expected behavior change; only prevents outdated updates

**Manual test checklist**
- Rapidly change selection between two layers → UI should not briefly show the wrong layer's results

---

## Tool: View Colors Chain

### P0.5 Compute only the chain we actually display
**Status**: ✅ Done (V2 payload implemented)

The V2 payload optimization has been implemented:
- `VARIABLE_CHAINS_RESULT_V2` sends `chainToRender` instead of `chains[]`
- UI supports both V1 and V2 payloads for backward compatibility

### P0.6 Add caching during chain resolution
**Status**: Partially done

Caching exists in `getFoundVariablesFromRoots()` but not passed through to `resolveChainForMode()`.

**What changes**
- Pass the existing caches into `resolveChainForMode()` to avoid repeated `getVariableByIdAsync()` calls during alias chain traversal

**Implementation steps**
1. Add cache parameters to `resolveChainForMode()`
2. Use caches in the recursive `step()` function
3. Test with deep alias chains

---

### P1.5 Move `variable-chain.ts` to tool folder
**Status**: Not started

**What changes**
- Move `src/app/variable-chain.ts` → `src/app/tools/color-chain-tool/variable-chain.ts`

**Why**
- Consistency with other tools (each tool's logic in its folder)
- Currently the only tool-specific file outside its folder

---

## Tool: Print Color Usages

### P0.7 Stop "save-after-load" + debounce settings persistence
**Status**: Not started

**Problem**
- Settings are persisted immediately after being loaded (no user action)
- Every toggle posts a save message

**What changes**
1. Introduce a `dirty` flag or `hydratedRef` to skip persistence on initial load
2. Debounce settings saves (300ms)
3. Flush pending saves before `Print` / `Update` actions
4. Flush on component unmount

**Implementation**:
```typescript
const [settings, setSettings] = useState(DEFAULT_SETTINGS)
const [isHydrated, setIsHydrated] = useState(false)
const saveTimeoutRef = useRef<number | null>(null)

// On hydration from main thread
useEffect(() => {
  if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS) {
    setSettings(msg.settings)
    setIsHydrated(true) // Don't trigger save
  }
}, [])

// Debounced save
useEffect(() => {
  if (!isHydrated) return
  if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
  saveTimeoutRef.current = setTimeout(() => {
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.SAVE_SETTINGS, settings } }, "*")
  }, 300)
  return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current) }
}, [settings, isHydrated])
```

**Manual test checklist**
- Open tool → no save happens until you change a setting
- Toggle multiple options quickly → only one save after 300ms
- Change a setting → immediately click `Print` → output uses the latest setting

---

### P1.6 Display status message inline
**Status**: Not started

**What changes**
- Render `status.message` as secondary text near bottom actions when status is `working`

**Why**
- Better feedback than just "loading" button state

---

## Tool: Mockup Markup

The Mockup Markup tool has already undergone significant refactoring (2026-02-03) and is in good shape:
- ✅ Extracted shared utilities (`utils.ts`)
- ✅ Clean resolution logic (`resolve.ts`)
- ✅ Proper error aggregation (`OperationResult` type)
- ✅ Consistent logging

### P1.7 Use shared utilities instead of local ones
**Status**: After P0.1/P0.2

Once shared utilities exist, update Mockup Markup to use them:
- Replace local `logDebug/logWarn` with shared logging
- Replace local variable resolution with shared functions

---

## Project Structure

### P2.1 Consider `src/plugin` vs `src/ui` vs `src/shared` split
**Status**: Deferred

**Suggested structure**:
```
src/
├── plugin/                    # Figma main thread code
│   ├── tools/
│   │   ├── color-chain/
│   │   ├── print-color-usages/
│   │   └── mockup-markup/
│   └── run.ts
├── ui/                        # Preact UI
│   ├── components/
│   ├── views/
│   └── App.tsx
└── shared/                    # Shared types & utilities
    ├── messages.ts
    ├── color-utils.ts
    └── figma-variables.ts
```

**Why deferred**
- Medium risk (file moves + import path churn)
- Current structure works well enough
- Consider when adding more tools

---

### P2.2 Type safety: reduce `any` usage
**Status**: Deferred

**Problem**
Many places cast to `any` for Figma API properties:
```typescript
const node = "node" in change ? (change as any).node : null
```

**What changes**
- Create typed helper functions or interfaces for common Figma patterns
- Add type guards where appropriate

**Why deferred**
- Low impact on functionality
- Figma types are sometimes incomplete

---

### P2.3 Add lightweight performance instrumentation
**Status**: Deferred

**What changes**
- Add timing logs behind a `DEBUG_PERF` flag
- Log scan + resolve durations

**Why deferred**
- Nice to have for debugging regressions
- Low priority vs functional improvements

---

## Rollout Plan (Recommended Order)

### Phase 1: Shared Utilities (P0.1–P0.3)
1. Extract shared color utilities
2. Extract shared variable resolution
3. Extract shared logging

### Phase 2: Quick Wins (P0.4, P0.6, P0.7)
4. Add stale-result guard
5. Complete caching in chain resolution
6. Debounce Print Color Usages settings

### Phase 3: Consistency (P1.1–P1.4)
7. Standardize message handler pattern
8. Extract `usePluginMessages` hook
9. Simplify routing logic
10. Extract `ToolFooterActions` component

### Phase 4: Cleanup (P1.5–P1.7)
11. Move `variable-chain.ts` to tool folder
12. Add inline status display
13. Update Mockup Markup to use shared utilities

### Phase 5: Structural (P2.x) — As needed
14. Consider folder reorganization
15. Improve type safety
16. Add performance instrumentation

---

## Testing & Safety

### Is it a good idea to do these refactors?
**Yes**, because they target:
- **Maintainability**: less duplicate code, consistent patterns
- **Reliability**: race-proof updates, proper error handling
- **Performance**: caching, reduced API calls

### Will it break any existing functionality?
It shouldn't if we:
- Ship changes incrementally (one refactor at a time)
- Keep backward compatibility during transitions
- Always run the manual checklist

### How main user flow will change
It should **not change**. Users do the same actions; the plugin becomes faster and more maintainable.

### Minimum "release" checklist
- Run `npm run build`
- In Figma:
  - Run **Tools Home** — verify all tool cards appear
  - Run **View Colors Chain** — test empty, simple, and nested selection
  - Run **Print Color Usages** — test Print and Update actions
  - Run **Mockup Markup Quick Apply** — test Apply and Create actions

---

## Quick Reference: File Locations

| Category | Files |
|----------|-------|
| Entry points | `src/home/main.ts`, `src/*-tool/main.ts` |
| Shared runner | `src/app/run.ts` |
| Messages | `src/app/messages.ts` |
| Components | `src/app/components/*.tsx` |
| Views | `src/app/views/<tool>/*.tsx` |
| Tool logic | `src/app/tools/<tool>/*.ts` |
| Variable chain | `src/app/variable-chain.ts` (→ move to tool folder) |
