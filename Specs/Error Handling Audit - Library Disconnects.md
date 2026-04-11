# Error Handling Audit: Library Disconnect Scenarios

## Scope

This audit checks current behavior when required team libraries are **not connected** in a Figma file:

- **Mockup Markup** library (`"Mockup markup"`)
- **Islands** library (`"Int UI Kit: Islands"`)

Reviewed modules:

- `src/app/tools/mockup-markup-library/resolve.ts`
- `src/app/tools/mockup-markup-quick-apply-tool/import-once.ts`
- `src/app/tools/mockup-markup-quick-apply-tool/main-thread.ts`
- `src/app/tools/int-ui-kit-library/resolve.ts`
- `src/app/tools/int-ui-kit-library/cache.ts`
- `src/app/tools/find-color-match/main-thread.ts`

---

## Current behavior by tool

## 1) Mockup Markup (library disconnected)

### What happens now

- Variable/style resolution is intentionally defensive and uses many `try/catch` blocks that **swallow errors** and continue with fallbacks.
- If all fallback strategies fail, resolution returns `null` (no hard failure is propagated).
- One-time import marks only successful presets; failed presets remain false, but this is logged internally only.
- Tool activation still transitions to `idle` status after attempting imports and preview generation.

### User-visible outcome

- The tool often looks “ready” even when required library values were not resolved.
- Color swatches can stay empty (`null` hex/opacity) without an explicit actionable message.
- Users may only see generic failure notifications when a later action throws.

### Risk

- **Silent degradation**: the user does not clearly know that the root cause is missing library access.

---

## 2) Find Color Match in Islands (library disconnected)

### What happens now

- Collection discovery filters by exact `Int UI Kit: Islands` library name.
- If no matching collections are found, code logs a warning in console and returns an empty list.
- Cache and scan pipeline treat empty list/empty variables as a valid state.
- UI receives empty collections and empty scan results without a dedicated “library disconnected” error state.

### User-visible outcome

- The tool opens, but has no usable collections/results.
- User receives little to no direct guidance in UI on how to fix it (enable library in Assets → Libraries).

### Risk

- **Ambiguous empty state**: appears similar to “nothing selected” or “no matches,” masking configuration error.

---

## Cross-tool inconsistency summary

Current error-handling patterns are mixed:

- **Silent fallback + logs** in low-level resolvers.
- **Generic notify/error channel** in some main-thread handlers.
- **Empty success states** where dependency failure should be explicit.
- Different tools encode dependency problems differently (or not at all).

Result: users get inconsistent recovery hints for the same root issue (library unavailable).

---

## Recommended unified approach

Introduce one shared error model for all tools that depend on libraries.

## A) Standardized error contract

Define shared type (example):

```ts
type ToolErrorCode =
  | "LIBRARY_NOT_ENABLED"
  | "COLLECTION_NOT_FOUND"
  | "VARIABLE_IMPORT_FAILED"
  | "STYLE_IMPORT_FAILED"
  | "PARTIAL_LIBRARY_DATA"
  | "UNEXPECTED"

type ToolErrorPayload = {
  code: ToolErrorCode
  tool: "mockup-markup" | "find-color-match" | "print-color-usages" | string
  severity: "info" | "warning" | "error"
  userMessage: string
  remediation?: string
  details?: Record<string, unknown>
  recoverable: boolean
}
```

## B) Dependency health checks on activation

Each tool should run a lightweight `checkRequiredLibraries()` during `onActivate` and emit one of:

- `ready`
- `degraded` (partial dependencies)
- `blocked` (required library missing)

For missing library, emit `LIBRARY_NOT_ENABLED` with a consistent remediation:

> “Enable `<library>` in Assets → Libraries, then reopen or refresh the tool.”

## C) Explicit UI states (not silent empty data)

For disconnected libraries:

- Show a top warning banner with exact missing dependency name.
- Disable actions that cannot succeed.
- Keep a retry action (`Retry library check`).

For partial data:

- Allow work but show non-blocking warning and what was skipped.

## D) Central helper module

Create a shared module (e.g. `src/app/tools/shared/tool-errors.ts`) that provides:

- error constructors (`libraryNotEnabled(...)`, etc.)
- mapper from caught exceptions to standardized payload
- single `postToolError(figma.ui.postMessage, payload)` utility

This avoids every tool inventing ad-hoc error strings and states.

## E) Logging policy

- Keep detailed console logs for diagnostics.
- Always pair logs with user-facing standardized error events when actionability is needed.
- Never rely on console-only warnings for dependency outages.

---

## Suggested rollout plan

1. Implement shared error types + posting helper.
2. Update `find-color-match` activation flow to emit `LIBRARY_NOT_ENABLED` when Islands collections are missing.
3. Update `mockup-markup` activation flow to emit `PARTIAL_LIBRARY_DATA` or `LIBRARY_NOT_ENABLED` when required presets cannot resolve.
4. Add a reusable UI banner component for tool-level warnings/errors.
5. Add tests for:
   - no-library activation state
   - partial imports
   - retry flow after library is enabled.

---

## Expected UX after unification

- Same root cause (“library disconnected”) always yields the same style of message, severity, and fix guidance.
- Users can distinguish:
  - empty result due to selection/content,
  - empty result due to dependency/configuration failure.
- Fewer support/debug loops because remediation is immediate and explicit.
