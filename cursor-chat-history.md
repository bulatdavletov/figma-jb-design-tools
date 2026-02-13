## Coding Conventions / UI Patterns

### @create-figma-plugin/ui components
- **Checkbox / RadioButtons labels**: Always wrap label text in `<Text>` component to fix alignment issues. Example: `<Checkbox value={v} onValueChange={setV}><Text>Label</Text></Checkbox>`

---

## Memory (Mem0 + OpenMemory)

### 2026-01-29

#### Installation (safe / non-developer workflow)
- Goal: Install Mem0 on this Mac in a safe way for a non-developer workflow.
- Decision: Install Mem0 Python SDK (`mem0ai`) into a project-local virtual environment (`.venv`) to avoid changing global/system packages.
- Status: Installed successfully; basic `from mem0 import MemoryClient, Memory` import test passed.

#### Docker (what’s running + safety)
- User already had Mem0-related services running in Docker (Compose project `mem0`).
- Found containers/ports:
  - `openmemory-mcp` on `localhost:8765` (docs at `/docs`)
  - `qdrant` on `localhost:6333`
- Security fix: `docker-compose.yml` contained a hardcoded OpenAI API key; replaced with env var `${OPENAI_API_KEY}` and noted not to store secrets in the file.
- User requested to export the (leaked) API key; advised to rotate/revoke it and set a new key instead. Do not handle/paste secrets in chat.
- Next steps: rotate OpenAI key, export new `OPENAI_API_KEY`, restart `openmemory-mcp`, verify via `http://localhost:8765/docs`.
- Done: user exported a *new* key in terminal session, force-recreated `openmemory-mcp`, logs show Uvicorn running and `/docs` returns 200.
- Note: `http://localhost:8765/` returns 404 (no homepage). Use `/docs` for UI or call API/MCP endpoints.

#### Cursor integration (MCP + verification)
- Found Cursor MCP config at `/Users/Bulat.Davletov/.cursor/mcp.json`.
- `openmemory` server is already configured via `npx supergateway --sse http://localhost:8765/mcp/cursor/sse/Bulat.Davletov`.
- Next: reload Cursor window, confirm MCP server is connected, then use it inside Cursor chat/tools.
- Checked REST `list_memories`: `GET /api/v1/memories/?user_id=Bulat.Davletov` returned `total: 0` (empty list).
- How to view all stored memories from Cursor chat: call MCP tool `user-openmemory` → `list_memories` (no args). It returns an array of memories with `id`, `memory`, timestamps, and metadata.
- Storage: memories/vectors persist in Qdrant (`mem0_store`) via Docker volume `mem0_mem0_storage` mounted at `/mem0/storage` inside the container.
- Using it: connect Cursor to MCP SSE endpoint `/mcp/cursor/sse/{user_id}` (example: `http://localhost:8765/mcp/cursor/sse/Bulat.Davletov`) or use REST API under `/api/v1/memories/`.

## Figma utilities “one plugin”

### 2026-02-13

#### Replace Variable Usages — adopt shared DataTable component
- Request: replace inline hand-rolled `<table>` blocks in `VariablesReplaceUsagesToolView` with the shared `DataTable` component.
- Done: added optional `align` property to `DataTableColumn` (supports `left`/`right`/`center`, defaults to `left`).
- Done: replaced "Mappings with Changes" inline table (~90 lines) with `DataTable` + column definitions.
- Done: replaced "Invalid Mapping Rows" inline table (~80 lines) with `DataTable` + column definitions.
- Done: replaced hardcoded `#666` Reason column color with `var(--figma-color-text-tertiary)` for proper theme support.
- Impact: visual refactor only; no logic/data changes. Tables now use Figma CSS variables for borders/backgrounds (better theme support) and share consistent styling with other tools via `DataTable`.
- Verification: `npm run build` passed; no linter errors.

#### Print Color Usages — "Check changes" button no feedback (debug + fix)
- Bug: "Check changes" button showed no spinner or progress when clicked.
- Root cause: The optimistic `setStatus` call in the onClick handler had an incorrect shape — it included an extra `type: MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS` property not part of `PrintColorUsagesStatus`. Additionally, previous debug instrumentation used `fetch()` calls which were all blocked by Figma's Content Security Policy (CSP), providing no runtime data.
- Fix: Corrected `setStatus` shape to `{ status: "working", message: "Checking changes…" }` (removed extra `type`). Confirmed via `console.log` instrumentation that Preact correctly renders `isWorking=true` immediately after click.
- Performance follow-up: Progress callbacks (every 10 layers) caused ~15 UI re-renders in 425ms. Throttled progress messages to max 1 every 200ms (~5 FPS) while keeping `yieldToUI()` on every callback for Figma responsiveness.
- Files changed: `PrintColorUsagesToolView.tsx` (setStatus fix, removed all debug logs), `main-thread.ts` (throttled progress messages, removed debug logs), `run.ts` (removed debug log).

#### DataRow/DataList — no visible gap between primary and secondary text (fix)
- Bug: Primary and secondary text in Print tab DataList preview appear with no vertical spacing.
- Root cause: `@create-figma-plugin/ui` `Text` component uses `::before { margin-top: -9px }` + `transform: translateY(4px)` for font-metric alignment. This compressed layout heights (20px→12px, 16px→8px) and made text fill each wrapper edge-to-edge, rendering the 4px flex gap invisible. `overflow: hidden` wrappers didn't help.
- Debug evidence: DOM measurements confirmed 4px layout gap existed but was imperceptible. Text elements extended 4px beyond their wrappers due to `translateY(4px)`. Note: `fetch()` logging blocked by Figma CSP — used `console.log` instead.
- Fix: Replaced `Text` component with plain `<div>` elements in `DataRow.tsx` and Print tab preview in `PrintColorUsagesToolView.tsx`. Removed `overflow: hidden` wrappers (no longer needed). Reduced explicit gap from 4px to 2px (natural line-height now provides sufficient breathing room).
- Post-fix measurements: primary height 20px (was 12px), secondary height 16px (was 8px), column height 38px (was 24px). Visible spacing confirmed.

#### Print Color Usages — reduce spacing around Settings disclosure
- Issue: Too much vertical space before and after the Settings section in Print tab.
- Root cause: `ToolBody`'s `<VerticalSpace space="medium" />` creates ~16px top/bottom padding; combined with Disclosure header padding this was excessive.
- Fix: Added `marginTop: -8, marginBottom: -8` on the outer Stack inside `PrintColorUsagesToolView` only — compensates for ToolBody padding locally without touching the shared `ToolBody` component.
- Impact: Visual only; no logic changes. Other tools unaffected.

#### Print Color Usages — UI redesign (shared components + cleanup)
- Created shared UI components in `src/app/components/`:
  - `CopyIconButton.tsx`: IconButton with copy icon; on click copies text to clipboard, icon changes to checkmark for 1.5s. Uses new shared `src/app/utils/clipboard.ts` utility.
  - `DataList.tsx`: Card-style container with border, radius, row separators, optional header/summary/emptyText.
  - `DataRow.tsx`: Row component with primary/secondary/tertiary text, hover actions, optional checkbox, alert block.
  - `DataTable.tsx`: Table container for columnar data (sticky header, shared styling with DataList). For future adoption by Variables tools.
- Print tab redesign:
  - Settings (Position, Show linked colors, Hide folder prefixes, info text) moved under `Disclosure` component, collapsed by default.
  - Live preview now uses `DataList` with "Will be printed" header. Each row shows label text + layer name, with `CopyIconButton` replacing the old text "Copy" button.
  - Removed separate "Linked:" line from preview rows (linked color is already in the label text).
  - Loading state changed from "Analyzing selection..." to "Loading..." for brevity.
- Update tab redesign:
  - Removed all three colored badge/tag spans (Main color, Layer name, Linked color).
  - Removed "Reset layer name" button.
  - Content mismatch alert now includes action buttons: "Update by layer name" and "Update by content".
  - Wrapped entries in `DataList` with "Changes found" header and summary stats.
  - Select all/Clear buttons moved to same row as selection count.
  - Diff content indented 24px left to align under checkbox label.
- Updated `Specs/Design Principles.md`: added "Copy Action Feedback" and "Data Lists and Tables" principles.
- Build passes with no errors.

#### Print Color Usages — fix opacity bugs + reset layer names button
- **Bug fix: double opacity %** in Print tab. `resolveVariableLabelPartsFromVariable` in `analyze.ts` appended variable alpha to secondaryText, then `getColorUsage` appended paint.opacity on top. Fix: consolidated function to `shared.ts`; alpha returned as separate field. `getColorUsage` now computes `effectiveOpacity = alpha * paintOpacity` and appends one `%` value.
- **Bug fix: missing linked color** in Update tab. `update.ts` had its own copy of `resolveVariableLabelPartsFromVariable` that only handled VARIABLE_ALIAS, skipping direct color values. Fix: removed duplicate, both files now import the shared function (which handles aliases AND direct colors).
- **DRY consolidation**: Moved `resolveVariableLabelPartsFromVariable` and `rgbToHex` to `shared.ts`. Both `analyze.ts` and `update.ts` import from there. Prevents future divergence.
- **Feature: Reset names button**: Added "Reset names" button in Update tab preview toolbar (next to Select all / Clear). Works on all checked rows. Sends batch `PRINT_COLOR_USAGES_RESET_LAYER_NAMES` message (array of nodeIds). Main thread resets each node's `.name` to `""`. After reset, entries are removed from the preview list. Replaced old singular `PRINT_COLOR_USAGES_RESET_LAYER_NAME`.
- **Simplified mismatch warning**: Removed "Update by layer name" and "Update by content" action buttons from mismatch warning; warning is now informational only. Layer name reset is handled by the new "Reset names" button.
- Files changed: `shared.ts` (added shared function + type), `analyze.ts` (removed duplicate, fixed opacity), `update.ts` (removed duplicate, imports shared, alpha handling), `messages.ts` (renamed message), `main-thread.ts` (batch reset handler), `PrintColorUsagesToolView.tsx` (Reset names button, simplified mismatch).
- Verification: `npm run build` passed; no linter errors.

#### Print Color Usages — major update batch (plan implementation)
- Implemented all changes from `print_update_improvements` plan.
- **Unify color application with Mockup Markup**: Added `reassertPageModeForVariable()` helper in `markup-kit.ts` that reads `figma.currentPage.explicitVariableModes` and re-asserts the current mode (or default) via `setExplicitVariableModeForCollection`. Called after resolving primary variable in `resolveMarkupTextFills()`. Added `verifyFillBinding()` export for post-apply verification. Applied in `print.ts` and `update.ts`.
- **Remove plugin data**: Removed `PLUGIN_DATA_VARIABLE_ID`, `PLUGIN_DATA_VARIABLE_COLLECTION_ID`, `PLUGIN_DATA_VARIABLE_MODE_ID` constants from `shared.ts`. Removed all `setPluginData` / `getPluginData` calls from `print.ts` and `update.ts`. Layer name is now the single source of truth.
- **Simplified resolution order** (no plugin data step): 1) VariableID from layer name, 2) Variable name from layer name, 3) (if checkByContent ON) Text content fallback.
- **Check by content**: Added `checkByContent: boolean` to `PrintColorUsagesUiSettings` (default false). Gated text-content fallback behind this setting. Added checkbox in Update tab UI.
- **Mismatch detection**: When checkByContent is ON and content resolves to a different variable than layer name, populates `contentMismatch` field on preview entry. UI shows warning with variable names.
- **Progress indicator / yield fix**: Added `yieldToUI()` calls after posting "working" status in `main-thread.ts` (fixes missing spinner). Added `onProgress` callbacks to `previewUpdateSelectedTextNodesByVariableId` and `updateSelectedTextNodesByVariableId` that post incremental progress text and yield. UI displays progress text when working.
- **Print tab live preview**: On selection change, main thread runs `analyzeNodeColors` and sends `PRINT_COLOR_USAGES_PRINT_PREVIEW` to UI (debounced 300ms). Print tab shows live list with variable name, future layer name (VariableID), linked color name, and Copy button per row.
- **Badge terminology**: "Text" -> "Main color", "Linked color changed" -> "Linked color" in Update tab preview badges. Removed "plugin data" from "Resolved by" display.
- **Specs updated**: `Print Color Usages Tool.md` (resolution order, color application, terminology, check by content, workflows). `Design Principles.md` (progress & yielding principle). `ToDo.md` (marked preview print as done).

### 2026-02-12

#### Replace Variable Usages — add "Get example JSON file" button
- Request: original `variables-rename-helper` plugin had a "Get example JSON file" button in the Usages tab; the new `VariablesReplaceUsagesToolView` was missing it.
- Done: added `downloadTextFile` helper + `getExampleMappingJsonText()` (same example data as original plugin) + "Get example JSON file" secondary button next to the file upload area.
- Safety: purely additive; no change to existing flow.
- Verification: `npm run build` passed; no linter errors.

#### Print Color Usages — no-color fallback behavior adjustment
- Request: do not create a text layer when no colors are found; use notification only. Also clarify meaning of “plugin data saved on printed layer” in spec.
- Safety expectation: better UX (less canvas noise); should not affect normal successful print flow.
- Done: updated `src/app/tools/print-color-usages/print.ts` to skip fallback layer creation and show notify:
  - if labels were created: summary includes optional note about groups with no colors
  - if none were created: `No visible solid colors found in selection`
- Done: updated `Specs/Print Color Usages Tool.md` line about no-color behavior to notification-only.
- Done: clarified spec wording for update resolver priority item #1 (`plugin data`) as internal metadata key `pcu_variableId` stored on printed text layers.

#### Print Color Usages spec alignment (code vs spec)
- Request: compare current Print Color Usages implementation with `Specs/Print Color Usages Tool.md` and then update the spec to match actual behavior.
- Findings captured: implementation matches core flow (Print from selection; Update with Check changes -> preview -> Apply), with additional behavior not fully documented before:
  - Update can run on current page when selection is empty (scope fallback).
  - Apply supports partial selection of preview rows (not only all rows).
  - Preview includes per-row diff details and resolution source.
- Expected impact: documentation-only update; no code logic or user flow changes.

#### Color swatch visibility in light theme (white color)
- Request: compare original swatch component vs copied one and verify whether white swatches should have a visible border in light theme.
- Safety expectation: visual-only tweak; no logic/flow changes.
- Finding: original `@create-figma-plugin/ui` `TextboxColor` has no border on the inner swatch (`.chit`), only on the full textbox control container.
- Gap in our usage: copied `ColorSwatch` is used as a standalone icon in lists/grids (without the textbox container border), so pure/very light colors can disappear against light backgrounds.
- Done: updated `src/app/components/ColorSwatch.tsx` to add a subtle border only for opaque very-light colors, preserving original behavior for non-light and transparent swatches.
- Specs check: no conflict with `Specs/Print Color Usages Tool.md`; this improves readability/scanability without changing workflow.

#### Color swatch visibility follow-up in dark theme
- Request: apply the same visibility protection for dark theme.
- Safety expectation: visual-only tweak; no logic/flow changes.
- Done: extended contrast-border rule in `src/app/components/ColorSwatch.tsx` to also apply for opaque very-dark colors (in addition to very-light), so extreme swatches remain visible in both themes.
- Specs check: no conflict with `Specs/Print Color Usages Tool.md`; workflow is unchanged.

#### Color swatch visibility follow-up (still low contrast)
- Request: user reports swatches are still barely noticeable for near-background dark colors.
- Root cause: previous condition targeted only extreme dark/light luminance, so medium-dark colors close to dark theme background (e.g. around `#33353B`) were not getting a border.
- Attempt 1: widened luminance thresholds with stronger border colors — resulted in borders that were too heavy/prominent (user feedback: "it looks too much now").
- Final approach: removed all conditional luminance logic entirely. Replaced with a universal subtle `inset box-shadow` (`0.5px` dark + light layers) on every swatch. This:
  - provides consistent edge definition in both themes without conditional jumping
  - is subtle enough not to be distracting on mid-range colors
  - is visible enough to define edges on near-background colors (white, near-black, etc.)
- Code simplification: removed `getHexLuminance` and `getContrastBorderColor` helpers; component is now much simpler.
- Specs check: no conflict with `Specs/Print Color Usages Tool.md`; visual readability only.

#### Print Color Usages — large-data list hover/layout instability
- Request: when list has lots of rows, UI becomes squeezed, rows jump on hover, and overall readability drops.
- Plan: find root cause in shared list/row layout styles (likely hover action width/reflow), fix it in reusable components, and verify other tools using the same pattern.
- Safety expectation: UI/styling behavior only; no change to tool logic/results.
- Root cause found: `Tree` row actions were mounted/unmounted on hover, which changed row width and caused text reflow/jump in dense lists.
- Done: updated shared `src/app/components/Tree.tsx` to reserve fixed action-slot width per row and fade actions via opacity (no layout shift on hover).
- Cross-tool impact: `Tree` is reused for View Colors Chain (and preview app), so fix is centralized and future tools using `Tree` inherit stable hover behavior.
- Verification: `npm run build` passed; no linter errors in edited file.
- Specs check: no conflict with `Specs/Print Color Usages Tool.md` and `Specs/design principles.md` (change aligns with predictable, non-jumpy list behavior).

#### View Colors Chain — replace pseudo-tree row with explicit `ColorRow`
- Request: current list is no longer a real tree (no nesting/folding); rename row primitive to `ColorRow` and remove Tree-specific props from this screen. Keep `Tree` for future true nested usage.
- Safety expectation: refactor only (naming/component structure), keep same row visuals/actions/flow.
- Done: added new dedicated component `src/app/components/ColorRow.tsx` (supports swatch, title, optional actions).
- Done: refactored `src/app/views/color-chain-tool/ColorChainToolView.tsx` to render `ColorRow` list directly; removed `Tree` usage and obsolete tree state from this view.
- Stability retained: `ColorRow` keeps fixed action slot width + hover fade to avoid row jump/reflow under large data.
- Verification: `npm run build` passed; no linter errors in edited files.
- Specs check: no conflicts found with current Specs; change improves naming clarity and matches actual flat-list behavior.

#### ColorRow hover background
- Request: add background highlight on hover to `ColorRow` component.
- Safety: visual-only; no logic/flow changes. Component already tracked hover state for action fade.
- Done: added `backgroundColor: var(--figma-color-bg-hover)` on hover with `borderRadius: 4` and `transition` in `src/app/components/ColorRow.tsx`.
- Verification: `npm run build` passed.

#### View Colors Chain — spacing and button order follow-up
- Request: ensure consistent vertical spacing in data-filled `ToolBody`, add this as an explicit rule, reorder row actions (`Swap` before `Copy`), and make color-group spacing larger.
- Safety expectation: visual/interaction polish only; no logic/data changes.
- Plan: update `ColorChainToolView` row action order and group spacer size, and add spacing rule in `Specs/design principles.md`.
- Done: in `ColorChainToolView`, step-row action order is now `Swap` first, then `Copy name`.
- Done: increased color-group vertical spacer from `16` to `24` for clearer separation.
- Done: added explicit spacing rule to `Specs/design principles.md` for `ToolBody` content with data (consistent vertical rhythm and group spacing).
- Verification: `npm run build` passed; no linter errors in edited files.
- Specs check: no conflicts found.
- Follow-up: user reported not seeing any spacing in Figma plugin.
- Investigation: confirmed build output IS up to date (groupSpacing=24, VerticalSpace rendered). Root cause: plugin must be re-run in Figma to load new UI bundle, plus the previous `VerticalSpace space="small"` (8px) was barely visible.
- Done: increased `ToolBody` top/bottom `VerticalSpace` from `space="small"` (8px) to `space="medium"` (~12-16px) for clearly visible content padding across all tools.
- Verification: `npm run build` passed; no linter errors.
- Bug report: vertical spacing between color groups gets squeezed when there's lots of data.
- Root cause: `ToolBody` inner `Container` had `flex: 1, display: flex, flexDirection: column` in ALL modes. In content mode with overflowing content, the flex algorithm was **shrinking spacer divs and VerticalSpaces** to fit everything inside the viewport, instead of letting the parent scroll.
- Fix: `Container` now only uses flex layout in "state" mode (needed for centering empty/loading screens). In "content" mode, Container is a normal block element — children flow as blocks, heights are respected, and the outer div scrolls correctly.
- Verification: `npm run build` passed; no linter errors.
- Cross-tool impact: this fix applies to ALL tools using `ToolBody mode="content"` — any tool with enough content to scroll now keeps stable spacing.

### 2026-02-11

#### Variables Export/Import UI — requested fix
- Request: remove horizontal/vertical scrolling inside tool body for Variables Export/Import UI, fix checkbox behavior/visuals, and verify other tools for the same issues.
- Expected impact: UI/layout only; no intended changes to export/import business logic.
- Done: Removed nested scroll areas in Variables tools (Export/Import, Batch Rename, Replace Usages, Create Linked Colors list). Tables now use wrapping (`tableLayout: fixed` + `wordBreak`) instead of horizontal scroll.
- Done: Export/Import collection checkboxes now disable while export is running to avoid inconsistent selection state during action.
- Verification: `npm run build` passed after changes.

#### Variables tools — checkbox spacing follow-up
- Request: checkbox rows look too tight (hard to scan/click); add clearer spacing in this screen and check other tools for same issue.
- Plan: adjust checkbox group spacing consistently in Variables tools and verify with build.
- Done: added `Stack space="extraSmall"` around checkbox lists in Variables Export/Import and Variables Batch Rename collection sections.
- Done: added extra spacing wrapper for checkbox options in Variables Replace Usages.
- Verification: `npm run build` passed.

#### Variables Export/Import — collections selection UX update
- Request: preselect all collections by default, use one parent "Collections" checkbox with nested child checkboxes, and show button label as "Export N files".
- Plan: update selection state defaults + parent/child checkbox logic + dynamic export button label.
- Done: collections are now selected by default on first load.
- Done: added parent `Collections` checkbox controlling all child checkboxes; child list is nested (indented).
- Done: export CTA now shows dynamic label (`Export N files`) and is disabled for zero selected collections.
- Verification: `npm run build` passed.
- Follow-up: added parent-to-children spacing and enabled mixed state on parent checkbox when selection is partial.

#### Cross-tool consistency + ordering questions
- Request: apply same parent-checkbox principle in other tools (replace Select all/Clear), avoid internal scrolls, extract design principles into a spec file, and explain/fix ordering differences vs Figma for collections and exported colors in JSON.
- Plan: update remaining Variables tool UI (Batch Rename), document design principles in `Specs/design principles.md`, then adjust ordering logic to align with Figma and explain behavior.
- Done: `Variables Batch Rename` now uses parent `Collections` checkbox with nested children and mixed state (removed Select all/Clear buttons), with default all-selected on first load.
- Done: removed alphabetical sorting for collections in affected Variables views to keep Figma order.
- Done: export ordering logic updated to follow collection `variableIds` order (Export/Import snapshots and Batch Rename export tokens) for closer match with Figma.
- Done: created `Specs/design principles.md` with UI/interaction principles extracted from this chat.
- Verification: `npm run build` passed.

#### Specs consolidation — Design Best Practices into Design Principles
- Request: merge `Specs/Design Best Practices.md` into `Specs/Design Principles.md`.
- Plan: consolidate unique rules into one principles file and remove duplicate source doc.
- Done: merged practical behavior rules (auto-refresh small utilities, preview-before-apply for batch, scope defaults based on selection) into `Specs/Design Principles.md`.
- Done: removed `Specs/Design Best Practices.md` to keep one source of truth.

#### Replace Variable Usages — avoid duplicate title
- Request: avoid showing the same title twice in the tool view.
- Done: removed duplicated in-body title in `VariablesReplaceUsagesToolView`; keep single title in header.
- Follow-up check: reviewed other tool views for the same duplicate-title pattern; no other exact header+body title duplicates found.

#### Variables Batch Rename — vertical spacing/title rhythm alignment
- Request: check vertical spacing and align with other tools.
- Done: aligned top section rhythm with other Variables tools by removing extra in-body section heading and keeping concise intro text under header.

#### Create Linked Colors — sync empty state pattern
- Request: sync no-selection state with Color Chain tool empty state pattern and add principle to reuse empty-state patterns.
- Done: `VariablesCreateLinkedColorsToolView` now uses centered shared `State` component with click icon for no-selection state (same pattern family as Color Chain).
- Done: added explicit principle to `Specs/design principles.md` to reuse shared `State` component for empty states.

#### Design Principles deep audit request
- Request: explicitly add no-selection empty-state reuse to principles and audit whole project for misalignment + improvements.
- Done: confirmed principles include shared `State` empty-state reuse.
- Audit: identified remaining alignment gaps (not all tools use shared `ToolBody`/`State` patterns yet; scope default heuristics not consistently enforced in all tools).

#### Scope consistency pre-check (before applying high-priority fixes)
- Request: list inconsistent scope places first, then apply only high-priority fixes.
- Finding: explicit scope toggle exists in `VariablesReplaceUsagesToolView` and currently defaults to `"selection"` unconditionally; this is inconsistent with the principle to default to page when selection is empty.
- Finding: other tools mostly use implicit selection/page behavior (e.g. Print Color Usages update action label changes by selection size) but do not expose a shared explicit scope control.

#### Applied high-priority alignment fixes only
- Request: apply only high-priority items from audit.
- Done: `VariablesCreateLinkedColorsToolView` content branch now uses `ToolBody mode="content"` (keeps no-selection in `ToolBody mode="state"`).
- Done: `MockupMarkupToolView` and `PrintColorUsagesToolView` now use shared `ToolBody mode="content"` for their main scrollable content (footer actions remain fixed as before).
- Done: `VariablesReplaceUsagesToolView` now receives `initialSelectionEmpty` and defaults scope to `"page"` when selection is empty, `"selection"` otherwise; wired from `ui.tsx`.
- Verification: `npm run build` passed; no linter errors in edited files.
- New request: use proper `Tabs` component for Print/Update switch instead of radio-style selector.
- Done: replaced Print/Update mode selector in `PrintColorUsagesToolView` from `RadioButtons` to `Tabs` from `@create-figma-plugin/ui`.
- Verification: `npm run build` passed; no linter errors in edited file.
- New request: fix UI polish issues from screenshot (tabs/scope controls rendering not matching intended segmented style).
- Done: `ScopeControl` now uses `SegmentedControl` from `@create-figma-plugin/ui` (instead of `RadioButtons`), matching intended segmented look.
- Done: scope indicator uses disabled/read-only segmented control so it no longer looks like editable radio inputs.
- Done: Print/Update tab values switched to title-case (`Print`, `Update`) to avoid lower-case labels in UI.
- Done: removed extra `Mode` label above tabs to reduce visual noise.
- Verification: `npm run build` passed; no linter errors in edited files.
- Follow-up request: tabs must be on very top of the tool content.
- Done: moved Print/Update `Tabs` to top section directly under `ToolHeader` (outside scrollable tool body), with divider below tabs.
- Done: removed former in-body tabs block and top spacer to avoid vertical gap before tabs.
- Verification: `npm run build` passed; no linter errors in edited file.
- New request: split Print Color Usages tool into two tabs (`Print`, `Update`), and always show Scope in `Update` tab to clarify where check applies.
- Done: added mode tabs in `PrintColorUsagesToolView` (`Print` first, `Update` second) using `RadioButtons`.
- Done: moved print-focused controls/content to `Print` tab; `Update` tab now contains check/apply workflow.
- Done: `Update` tab always shows scope indicator (live from current selection before check) and keeps preview totals scope once preview is available.
- Done: footer action is now tab-specific (`Print` on Print tab, `Apply` on Update tab).
- Verification: `npm run build` passed; no linter errors in edited files.
- New request: rename generic `SegmentedControl` to specific `ScopeControl` and use default segmented control from UI library.
- Done: replaced custom segmented container with new `ScopeControl` component at `src/app/components/ScopeControl.tsx`, implemented with default `RadioButtons` from `@create-figma-plugin/ui`.
- Done: updated `VariablesReplaceUsagesToolView` and `PrintColorUsagesScopeIndicator` to use `ScopeControl`.
- Done: removed old `src/app/components/SegmentedControl.tsx`.
- Verification: `npm run build` passed; no linter errors in edited files.
- New request: Scope component should use the same segmented button component/pattern as Replace Usages tool for consistency.
- Done: extracted a reusable segmented control component to `src/app/components/SegmentedControl.tsx`.
- Done: replaced inline scope segmented markup in `VariablesReplaceUsagesToolView` with shared `SegmentedControl` (same behavior as before).
- Done: updated `PrintColorUsagesScopeIndicator` to use the same `SegmentedControl` pattern (read-only visual state for preview scope).
- Verification: `npm run build` passed; no linter errors in edited files.
- User feedback: preview looked wrong ("it just shows different variable"). Clarification requested on what exactly Old/New represents and why values differ.
- New idea request: find variable by selected print text content (example `control-border-raised`) and detect if linked color changed.
- Done: update resolver now includes content fallback for selected print labels:
  - keeps existing priority: plugin data / VariableID in layer name / layer-name lookup
  - if unresolved, tries text content (`primary` part before triple-space separator, then full text) to find local variable by name.
- Done: preview now reports `Resolved by` source (`plugin data`, `layer VariableID`, `layer name`, `text content fallback`) for each row.
- Done: preview now flags linked-alias drift with `Linked color changed` badge (compares existing secondary linked part vs recomputed linked part).
- Verification: `npm run build` passed; no linter errors in edited files.

#### Print Color Usages — preview before applying update
- Request: move update action inside tool body under divider; rename action to `Check changes`; show preview (before/after text) before apply; make each preview row clickable to focus corresponding canvas layer; then provide final `Apply` action.
- Safety expectation: UX flow change only (adds review step before write), no intended change to print/update core logic.
- Done: moved update flow into `PrintColorUsagesToolView` content area under a divider; fixed bottom bar now keeps only `Print`.
- Done: added `Check changes` action that requests a main-thread preview (`PRINT_COLOR_USAGES_PREVIEW_UPDATE`) and returns per-layer before/after text rows.
- Done: preview rows are clickable; clicking sends `PRINT_COLOR_USAGES_FOCUS_NODE` and focuses that text layer on canvas (`selection` + `scrollAndZoomIntoView`).
- Done: added apply action after preview (`Apply in Selection` / `Apply on Page`) and disabled it when preview has no changes.
- Technical: added new UI/main message types + payload in `src/app/messages.ts` and non-mutating preview computation in `src/app/tools/print-color-usages/update.ts`.
- Verification: `npm run build` passed; no linter errors in edited files.
- Follow-up request: in preview, user wants to deselect items so update applies only to chosen preview rows (and not be driven only by current canvas selection).
- Done: preview rows now include per-row checkboxes; default is all selected after `Check changes`.
- Done: added quick controls `Select all` / `Clear` and selected counter (`X / N`) in update preview.
- Done: apply now sends explicit `targetNodeIds` from selected preview rows; update operation is no longer tied only to live canvas selection.
- Technical: `PRINT_COLOR_USAGES_UPDATE` message now accepts optional `targetNodeIds`; main thread forwards IDs to update logic; update supports explicit target mode and notifies `No preview items selected` when empty.
- Verification: `npm run build` passed; no linter errors in edited files.
- Follow-up request: replace deprecated `figma.getNodeById(...)` with async `figma.getNodeByIdAsync(...)` in Print Color Usages focus handler (`main-thread.ts`) and verify build.
- Done: updated focus handler in `src/app/tools/print-color-usages/main-thread.ts` to `await figma.getNodeByIdAsync(msg.nodeId)` (replaces deprecated sync API).
- Verification: `npm run build` passed; no linter errors in edited file.
- Visual review request: user asked to check current UI look of Print Color Usages preview after recent changes.
- Follow-up request: apply visual polish (row readability/spacing and make Apply action easier to access/visible while previewing).
- Done: improved preview row readability in `PrintColorUsagesToolView` (increased row padding, clearer line-height for Old/New text, selected-row background highlight).
- Done: moved main `Apply` action to fixed footer (visible during preview) and paired it with `Print` as secondary action.
- Done: removed duplicate in-body Apply button to avoid competing actions and keep primary action location stable.
- Verification: `npm run build` passed; no linter errors in edited file.
- Bug report: clicking a preview item focuses canvas but clears preview state and loses selection/check information.
- Done: fixed preview clearing bug in `PrintColorUsagesToolView` by ignoring exactly one `PRINT_COLOR_USAGES_SELECTION` reset when selectionchange is triggered by preview-row focus click.
- Verification: `npm run build` passed; no linter errors in edited file.
- Follow-up request: keep preview persistent even when user changes focus/selection in Figma manually; do not auto-clear preview on selection updates.
- Done: removed preview reset on `PRINT_COLOR_USAGES_SELECTION`; selection count still updates live, while preview and checked rows remain until user refreshes (`Check changes`) or changes settings.
- Verification: `npm run build` passed; no linter errors in edited file.
- Bug report: preview `New` text can look incomplete; this makes rows appear falsely changed.
- Done: preview entries now include explicit change markers (`Text`, `Layer name`) and show full text with preserved whitespace/wrapping, plus old/new layer-name diff when applicable.
- Technical: extended preview entry payload with `oldLayerName`, `newLayerName`, `textChanged`, `layerNameChanged` in `messages.ts` and `update.ts`.
- Verification: `npm run build` passed; no linter errors in edited files.
- Runtime issue reported: Apply still triggers dynamic-page error from sync `getNodeById` path; fix requires replacing remaining sync lookup(s) with async lookup(s).
- Done: replaced remaining sync lookup in apply path (`update.ts` explicit targetNodeIds branch) with `figma.getNodeByIdAsync` via `Promise.all`, with safe per-id fallback to `null` on lookup errors.
- Verification: `npm run build` passed; no linter errors in edited files.
- New request: extract Scope into separate component and show engaged scope visually; add ability to reset layer name for selected preview item; show red/green inline diff in preview (reuse existing diff pattern from another tool).
- Done: extracted scope line into `PrintColorUsagesScopeIndicator` component and made Selection scope visually engaged with a branded pill (`Selection (engaged)`).
- Done: added reusable `renderInlineDiff` helper in `src/app/components/InlineTextDiff.tsx` (moved from Variables Batch Rename view) and reused it in both Batch Rename and Print Color Usages preview.
- Done: Print Color Usages preview now renders old/new text with inline red/green changed segment highlighting.
- Done: added per-row `Reset layer name` action in preview (enabled when that row is selected) via new message `PRINT_COLOR_USAGES_RESET_LAYER_NAME`; main thread resets text node name by setting `node.name = ""`.
- Note: after reset, preview list is intentionally kept persistent; use `Check changes` to refresh computed diffs.
- Verification: `npm run build` passed; no linter errors in edited files.

#### Replace Usages follow-up: live update + segmented scope control
- Request: scope does not update live (only on startup) and checkboxes are not the right UI for mutually-exclusive scope options.
- Root cause: main thread already posted `REPLACE_USAGES_SELECTION` on `selectionchange`, but the view did not consume it for scope behavior.
- Done: `VariablesReplaceUsagesToolView` now listens to `REPLACE_USAGES_SELECTION`, updates current selection counter, and auto-syncs scope (`selection`/`page`) from live selection until user manually chooses scope.
- Done: replaced scope checkboxes with custom segmented buttons (`Selection only` / `Entire page`) to reflect a single-choice control.
- Verification: `npm run build` passed; no linter errors.

#### Replace Usages follow-up: add "All pages" scope
- Request: add one more scope option — `All pages`.
- Done: added `all_pages` scope to types and requests (`messages.ts`, shared types).
- Done: updated segmented scope control in `VariablesReplaceUsagesToolView` to include `All pages`.
- Done: updated shared node traversal to collect roots from all pages when scope is `all_pages`.
- Verification: `npm run build` passed; no linter errors.

#### Replace Usages scope behavior refinement
- Request: when selection exists, auto-choose Selection scope; when selection is empty, disable Selection and use Current page by default.
- Done: removed manual-lock behavior and made scope always auto-sync on live selection updates (`selection > 0` => `selection`, `selection = 0` => `page`).
- Done: disabled the `Selection only` segmented option when there is no selection.
- Done: `Current page` label remains explicit in segmented scope options.
- Verification: `npm run build` passed; no linter errors.

#### Replace Usages UI cleanup
- Request: remove helper text `Current selection: 0 nodes`.
- Done: removed selection-count helper line under scope segmented control.
- Verification: `npm run build` passed; no linter errors.

#### Home page compact ToolCards + Color Chain swatch icon
- Request: make Home `ToolCard` layout more compact and use a color swatch icon for Color Chain.
- Done: compacted `ToolCard` sizing (reduced padding/gap/icon box size and slightly tighter text spacing).
- Done: changed Home `View Colors Chain` card icon to use `ColorSwatch`.
- Done: tightened vertical spacing between cards/sections on Home.
- Verification: `npm run build` passed; no linter errors.

#### Home icon correction (Color Chain)
- Request: use icon (not swatch) and set `variable.color` icon for `View Colors Chain`.
- Done: replaced Home `View Colors Chain` icon with `IconVariableColor16`.
- Verification: `npm run build` passed; no linter errors.

#### Home spacing refactor to Stack
- Request: use `Stack` in `HomeView` instead of separate `VerticalSpace` blocks.
- Done: refactored `HomeView` spacing/layout to nested `Stack` groups and removed `VerticalSpace` import/usage.
- Verification: `npm run build` passed; no linter errors.

#### ToolCard hover polish (icon background brighter)
- Request: make tool icon background brighter on hover in Home cards.
- Done: updated `ToolCard` icon tile background to switch from `--figma-color-bg-secondary` to `--figma-color-bg-selected-secondary` on hover.
- Expected impact: visual feedback only; no behavior or flow changes.

#### Home section title text cleanup
- Request: improve Home section title text usage (`Colors`/`Variables`) in `HomeView`.
- Done: replaced duplicated inline `fontWeight: "var(--font-weight-bold)"` with a shared `sectionTitleStyle` (`fontWeight: 600`) for cleaner, consistent title styling.
- Expected impact: maintainability/readability improvement only; no behavior or flow changes.

#### Tool order alignment — Home as source of truth
- Request: align tool order in other places with `HomeView` order.
- Clarification: user wants all other places aligned **to HomeView** (not vice versa).
- Home canonical order:
  - Colors: Mockup Markup Quick Apply → View Colors Chain → Print Color Usages
  - Variables: Export / Import → Batch Rename → Create Linked Colors → Replace Usages
- Done: reordered corresponding command/route lists in `package.json`, `src/app/run.ts`, `src/app/ui.tsx`, and `src/app/messages.ts` to match Home order.
- Specs check: no conflicts found; `Specs/Design Principles.md` supports stable/predictable ordering.

#### Color Chain — hover actions (copy name + replace main color)
- Request: in Color Chain rows, show action buttons on hover:
  - copy color/variable name
  - `Replace` action to set selected chain color as main color
- Expected impact: faster in-list workflow for token cleanup/migration; no change to default read-only scanning behavior.
- Done: added hover row actions in Color Chain list:
  - copy icon button (`Copy name`) on main and chain-step variable rows
  - `Replace` button on chain-step rows to replace the main variable alias with selected step variable
- Done: added UI→main-thread message `COLOR_CHAIN_REPLACE_MAIN_COLOR` and replace logic for selected mode.
- Done: chain payload now includes variable IDs per chain step (so Replace can target exact variable, not just by name).
- Verification: `npm run build` passed; no linter errors in edited files.
- Follow-up question: why custom bordered icon-like button was used instead of standard icon button.
- Answer: this was an implementation shortcut in shared `Tree` row actions; standard borderless icon button is preferred for consistency with the existing UI kit usage and should be switched.
- Follow-up request: implement the switch and fix broken behavior because both `Copy` and `Replace` currently do not work in testing.
- Done: switched hover copy action to framework `IconButton` (borderless, standard UI kit style).
- Done: hardened row-action click handling (`preventDefault`/`stopPropagation`) to avoid row container swallowing action clicks.
- Done: updated replace implementation to use `figma.variables.createVariableAlias(...)` for mode value assignment.
- Done: copy action now has a last-resort manual fallback prompt when browser clipboard APIs are blocked.
- Behavior correction request: `Replace` must replace variable **usages in current selection** with chain variable, without changing original variable values.
- Done: replaced `Replace` behavior in Color Chain to update **selected-layer bindings** (and descendants) from source variable to chosen chain variable.
- Done: removed value-edit behavior (no `setValueForMode` on source variable anymore); original variable values are preserved.
- Follow-up UX request: rename `Replace` button to better reflect usage-level replacement behavior.
- Decision: rename action label to `Swap color`.
- Follow-up request: keep colors order unchanged (no re-sorting in the Color Chain view).
- Bug report: after `Swap color`, items still re-sort; hidden sorting likely remains in data preparation layer.
- New request: add copy action for final HEX row and show notification after copy action.
- Done: added `Copy HEX` action on final HEX row in Color Chain.
- Done: added native notifications (via main thread `figma.notify`) after copy actions (name/HEX success + fallback/failure messages).

### 2026-01-29

#### Vision / scope (product)
- Goal: Combine several existing Figma plugins/utilities into one cohesive plugin with a nice UI (likely `create-figma-plugin`), and document clear use cases/specs for each utility.
- Inputs: list of existing plugins (icon library swap, variables rename helper, print color usages, color match finder, “variables helper”, “detach color variable”), plus new ideas (swap components+overrides, view/manage token chains).
- Questions to answer: is one plugin a good idea vs a suite; risks; how to explain use cases; how to test utilities/plugin to avoid breaking updates.

#### Specs (documentation)
- Progress: Reviewed original “Find Color Match” plugin (`ds-colors-cursor`) README + code. Documented actual behavior (selection scan rules, variable matching, apply behavior, YAML mapping import/export, preference persistence) in `Specs/Find Color Match.md`.
- Persona note: “Find Color Match” is primarily for **design system maintainers** doing palette/token migrations; secondarily useful for **design ops**; occasionally useful for **product designers** cleaning up legacy colors in a selection.
- Progress: Drafted “Variable Chain Inspector” utility spec (view full alias chain + remove intermediate link + promote step) in `Specs/Chain Utility.md`.
- Progress: Reviewed original plugins `variables-rename-helper` and `Print Color Usages` (README/manifest/code) and documented their behavior/personas in `Specs/Variables Rename Helper Utility.md` and `Specs/Print Color Usages Utility.md`.

#### Plugin scaffold + architecture
- Progress: Implemented plugin scaffold + architecture: Home screen + separate Figma menu command per utility. Implemented “Variable Chain Inspector” Flow A (inspect selection → show variable alias chain per mode). Added `README.md` with build/import steps.
- Debug aid: changed plugin `id` + `name` and disabled minification to avoid caching and make console errors easier to read.

#### Dependency / manifest fixes
- Fix: Switched `create-figma-plugin` deps from v4 alpha to stable v3 and removed `networkAccess` from manifest to address Figma console warning about `local-network-access` and startup errors. Rebuilt `manifest.json`.
- Update: Upgraded `@create-figma-plugin/*` to stable v4.0.3.
- Update: v4 renamed several icons; updated imports (`IconArrow16`, `IconInstance16`, `IconComponent16`, etc.). `manifest.json` is clean (no `networkAccess` / `local-network-access` permission added).
- Update: Added `networkAccess: { allowedDomains: ["none"] }` (explicitly no network) to stop Figma’s “add networkAccess / or set to none” warning; rebuilt and confirmed it appears in `manifest.json`.
- Update: Set plugin id to `1598773743246786962` (in `package.json` as the source of truth), rebuilt and confirmed `manifest.json` now uses that id.

#### Crash / “empty UI” fixes
- Fix: Plugin crash `TypeError: not a function` was caused by command entry files not exporting a default function. Updated `src/home/main.ts` and the color chain tool entry (`src/color-chain-tool/main.ts`) to `export default` and rebuilt.
- Rename: The “chain inspector” tool entrypoint is now `src/color-chain-tool/main.ts` and the internal command is `"color-chain-tool"` (replaces `"chain-inspector"`). UI view folder is `src/app/views/color-chain-tool/`.
- Fix: After upgrading to `@create-figma-plugin/*` v4, the UI could appear empty because `height: 100%` may collapse in the plugin iframe. Updated the global `Page` wrapper to use `height: 100vh` so content always shows.
- Fix: Chain Inspector UI could still look empty due to a race (initial selection update message arriving before the view subscribed). On mount, the view now requests a refresh (`INSPECT_SELECTION_FOR_VARIABLE_CHAINS`) and shows “Inspecting selection…” while waiting.

#### “View Colors Chain” (Chain Inspector) behavior / UX
- Fix: Variable Chain Inspector now scans selection **recursively** (node + all descendants) for variable-bound fills/strokes/text, not just the top-level selected node.
- UX: Removed “Inspect selection” button. Chain Inspector now auto-refreshes when selection changes (main thread listens to `selectionchange` and pushes updates to UI). Empty state shown when nothing is selected.
- Naming: Renamed “Variable Chain Inspector” to **“View Colors Chain”** (menu command, window title, home card, and spec).

#### “View Colors Chain” UI evolution (high-level log)
- UI: Variable Chain Inspector now shows results as an expandable “tree” list (Disclosure). Each chain step is on its own line, and the currently applied mode is identified when detectable from `resolvedVariableModes`.
- UI: Variable list now uses `Layer` (tree-like) rows with left color swatch icon + HEX description; row expands to show chain details.
- UI: Added a custom `Tree` component to better match Figma Layers UX (indentation + expand/collapse per node). Chain Inspector now renders variables + chain steps as a real tree.
- UI: Updated tree content — parent row hint shows collection name (no HEX), removed mode info, chain is a single second-level node, and last chain item shows final HEX.
- UI: Removed extra “Chain” group node; expanding a variable now shows chain steps immediately (final HEX as last item).
- UI polish: tightened paddings/spacing and replaced Back with “All Utilities” + left arrow icon.
- UI layout: added top padding, moved instruction text + “Inspect selection” button into a bottom action bar, and reduced plugin window size.
- UI structure: tree is now 3 levels — selected layer (with type icon) → unique colors → chain steps; expanded by default.
- UI polish: Tree chevrons now match Disclosure behavior (caret-right rotated on open). Introduced global page padding wrapper so all pages share consistent top/bottom/side padding. Chain steps no longer repeat the top color name (first step is skipped).
- UI: Removed “Found colors (variables)” header for more space. Added proper empty state shown only when selection is empty: “Select a layer to see variables color chain.” Moved instruction out of bottom bar (button only).
- UI: Tree chevron icon now uses `IconChevronDown16` (rotated when collapsed).
- UI: Added reusable `EmptyState` component with a click icon (local `IconInteractionClickSmall24`). Chain Inspector uses it when selection is empty (shows immediately based on selection size on open).
- UI: Layer-type icons now use Figma “component purple” (`--figma-color-icon-component`) for INSTANCE/COMPONENT/COMPONENT_SET (matches Figma’s instance color).
- UI: Back button icon updated to a proper left-facing chevron (library `IconChevronRight16` rotated), since v4 no longer exports `IconArrowLeft16`.
- UI: Fixed vertical alignment of the back chevron by wrapping it in a 16×16 flex box (centers the icon with the label).
- UI: Added reusable `ButtonWithIcon` component (framework has `IconButton` but not “icon + text” button). Back button now uses it for consistent alignment.
- UI: Added local `IconChevronLeft16` wrapper (rotated `IconChevronRight16`) for a semantic “back” icon without inline rotate hacks in the UI code.
- UI: Improved `ButtonWithIcon` alignment by switching to a simple flex row and forcing `lineHeight: 0` for the icon container (fixes baseline-induced vertical misalignment).
- UI: Chain Inspector tree updated: the variable row (level 2) is no longer expandable; chain steps are flattened into the same level under the selected layer. Only the first row (original variable) shows a color swatch; chain-step rows do not.
- UI: Removed the “selected layer” grouping level. Top-level list is now just unique colors (with their chain steps shown under each color). Added clean vertical spacing between color groups instead of dividers.
- UI: Made the Chain Inspector list fully flat: color row + chain-step rows are siblings (no nested level / no chevrons). Kept bigger spacing between color groups.
- UI: Main color (variable) rows now render the name in bold for faster scanning; chain-step rows remain regular weight.
- UI: `EmptyState` is now grey (icon + text-secondary), and the icon is scaled to 2× for nicer presence.
- UI: `EmptyState` text is forced to `--figma-color-text-secondary` as well (some `Text` components don’t inherit parent color).
- UI: Chain Inspector header now shows utility name (“Variable Chain Inspector”) plus a back button to “All Utilities”.
- UI: Chain Inspector header back control switched to framework `IconButton` with `IconHome16` (home icon) instead of “All Utilities” text button.
- UI: Added reusable `ToolHeader` component (title + optional left action). Chain Inspector now uses it for a consistent header layout across tools.
- UI: Chain rows now show a muted grey **down arrow** (rotated `IconArrow16`) to indicate direction (no arrow on the final HEX row). `IconChevronDown16` looked too much like “expand”.
- UI layout: Removed global `Page` padding to avoid double left/right padding (Page + Container). Header now uses native `Container` inset, while its `Divider` is full-width (outside the inset).
- UI layout: Restored consistent header vertical spacing by adding `VerticalSpace` inside `ToolHeader` before the full-width divider.
- UI: Removed redundant divider above Chain Inspector content (header divider is enough). Added a small top padding on Home screen so content doesn’t start flush at the top.
- UI: When selection has no variable colors, show a “nothing found” empty state: **text only** (“No variable colors found in selection”).
- UI: Added reusable `ToolCard` component (icon + name + short description). Home screen now uses it for tools (starting with Variable Chain Inspector).
- UI: `ToolCard` now has hover + focus styles (hover background + stronger border; keyboard focus outline).
- UI: Home screen “Variable Chain Inspector” card icon updated to `IconLink16` (clearer “chain” metaphor).

#### Icons / internal dev tooling
- Dev: Added `AppIcons` collection (chevrons + arrows in 4 directions) so we stop hunting for “left/right/up/down” variants. Updated code to use these wrappers and removed the old one-off `IconChevronLeft16` file.
- Dev: Updated `AppIcons` arrows to use `IconStrokeLineArrow24` (scaled to 16px + rotated) because `IconArrow16` is diagonal and looks wrong when rotated.
- Dev: Switched `AppIcons` to re-export pixel-perfect SVGs from `src/app/components/custom-icons/` (no scaling). This replaces the temporary “scale a 24px icon down to 16px” approach.
- Naming: Keep `custom-icons/` for the raw SVG icon set, and keep `AppIcons.tsx` as the single import surface for the app. (If we later mix library + custom icons, “AppIcons” remains accurate.)
- Dev: Custom icons are now generated from the `.svg` files in `src/app/components/custom-icons/`. Update SVGs → `npm run build` (or `npm run watch`) regenerates `generated.tsx` automatically.
- UI: Chain “step direction” icon updated to use a curved arrow (`icon.16.arrow-curved-down-right.svg`) for clearer “flow” feel.
- UI: Added the same chain icon to the final HEX row too (so every chain item, including the last one, has the direction icon).
- UI: Chain View no longer shows variable collection name (cleaner list).

#### Visual preview of UI components (dev workflow)
- Best preview: run the plugin UI inside **Figma** (it’s the real environment these Preact components render in).
- Recommended loop: `npm run watch` → in Figma run the plugin command again to see updated UI after rebuild.
- Reference: create-figma-plugin framework Storybook (for framework UI components, not your app-specific ones): https://yuanqing.github.io/create-figma-plugin/storybook/?path=/story/index--index
- Local (non-Figma) preview: added a small Vite preview app that renders your `src/app/components/*` in a browser for faster iteration.
- Commands:
  - `npm run preview` (dev server)
  - `npm run preview:build` (builds to `dist-preview/`)
  - `npm run preview:serve` (serves the build)
- Notes:
  - Uses `@create-figma-plugin/ui` CSS tokens for “Figma-like” styling (light/dark toggle included).
  - Vite config includes a small workaround for a webpack-style CSS import used by `create-figma-plugin`.

#### Console warnings observed (Figma app)
- `[Violation] Added non-passive event listener to 'touchstart'`: appears to come from Figma/vendor bundles, not our plugin code (no `touchstart` listeners in `src/`). Usually safe to ignore unless you see real UI jank.
- `GET http://127.0.0.1:<port>/figma/font-preview?... 404`: Figma local font preview endpoint failing for some fonts; usually safe to ignore unless font previews are broken in Figma.

#### Code organization (separate files per tool)
- Observation: `src/home/main.ts` and `src/color-chain-tool/main.ts` are separate “tool entrypoints” (Figma commands). The “giant file” was the shared UI bundle `src/app/ui.tsx` which contained routing + Home view + Color Chain view.
- Plan: Split UI into one folder/file per tool, e.g. `src/app/views/home/HomeView.tsx` and `src/app/views/color-chain-tool/ColorChainToolView.tsx`, and keep `src/app/App.tsx` (or `ui.tsx`) as a small router that imports those views.
- Safety: This refactor should not change user-visible behavior if we only move code; it mainly improves maintainability.
  - Done: Extracted UI into:
   - `src/app/views/home/HomeView.tsx`
   - `src/app/views/color-chain-tool/ColorChainToolView.tsx`
   - shared layout wrapper `src/app/components/Page.tsx`
   and reduced `src/app/ui.tsx` to boot + routing + `render(App)`. Ran `npm run build` successfully.

### 2026-01-30

#### “View Colors Chain” (Color Chain Tool) — Inspecting state UI
- Goal: When the tool is in “Inspecting selection…” state, show the same reusable `EmptyState` UI component (grey text), with a clock icon if available.
- Follow-up: “No variable colors found in selection” state should also use `EmptyState` styling and must not show a scrollbar.
- Fix: Hide the scroll container scrollbar whenever we render an `EmptyState` (Inspecting / Selection empty / Nothing found).
- Refactor: Rename `EmptyState` → `State` and introduce reusable `ToolBody` layout so empty/loading/nothing-found screens don’t show scrollbars across tools.
- Improvement: `ToolBody` now supports `mode="state" | "content"` so tools don’t need ad-hoc `showScrollableContent` logic.
- UI: Color chain rows no longer show a direction icon; removed extra vertical spacing between color groups (no spacer rows).
- UI: Restored spacing *between* color groups (spacer rows), while keeping rows *within* a group tight.
- UI: Adjusted `ToolBody` padding — less left/right inset, more top spacing.
- Layout: `ToolBody` now owns sizing/scrolling only; padding is handled only by `Container`.
- Layout: `ToolBody` adds small top+bottom `VerticalSpace` in all modes (keeps state screens centered via symmetric spacing).
- Debug: Temporarily added red background to `TreeRow` to see row bounds/height. Remove `DEBUG_ROW_BOUNDS` when done.
- Layout: Removed extra left/right padding inside `TreeRow` so top-level rows align with header inset (indent now only comes from nesting level).
- Layout: Added 4px side padding to `TreeRow` to match `IconButton`’s internal icon inset (24px button with 16px icon → 4px per side).
- Fix: Color chain now respects opacity/alpha for color variables and shows it as a percentage (e.g. `20%`) alongside the final HEX.
- UI: Final color row now shows opacity as part of the main label (e.g. `#000000 0%`). Color swatch now visually indicates opacity with a checkerboard background + RGBA overlay.
- UI: Hide opacity text when it’s 100% (only show `… 0–99%`). Fixed swatch rendering so it shows solid color when opaque and checkerboard+overlay only when transparent.
- Process: Before implementing any request, answer:
  - Is it a good idea?
  - Will it break any existing functionality?
  - How main user flow will change?
- Process: Always run `npm run build` after code changes.

### 2026-02-02

#### Color Chain tool — live updates when editing colors
- Case: With a layer selected, changing its color didn’t refresh the plugin UI until deselect/reselect (because `selectionchange` doesn’t fire for style edits).
- Fix: Added `figma.on("documentchange")` in `src/app/run.ts` to trigger the existing debounced refresh when a document change affects the current selection (or its descendants). Uses a type guard to ignore `RemovedNode` changes.
- Figma incremental mode note: registering `documentchange` requires calling `figma.loadAllPagesAsync()` first. Updated `run.ts` to await it before attaching the handler (otherwise Figma throws at runtime). If load fails, we fall back to selectionchange-only updates.
- Verification: `npm run build` passed.

#### Print Color Usages — selection not detected on open (unify “Update Selection” behavior)
- Issue: If you run the tool while something is already selected, the UI can still think selection is empty until you change selection (race: view mounts after the initial selection message).
- Fix: When UI requests settings (`PRINT_COLOR_USAGES_LOAD_SETTINGS`), main thread now also re-posts the current selection size (`PRINT_COLOR_USAGES_SELECTION`) so the view shows the correct “Update Prints in Selection” label immediately.

#### Print Color Usages — Figma toast updates feel “slow” / selection seems to change mid-update
- Issue: During “Update”, we were spamming `figma.notify("Updating… x/y")` progress toasts. Figma queues toasts, so older progress toasts can continue showing *after* the update actually finished (making selection changes look “mid-process”).
- Fix: Removed per-10-layer progress toasts; keep only the final summary toast.

#### Refactoring ideas spec — split by tool + extend Print Color Usages view ideas
- Request: Re-organize `Specs/Refactoring Ideas.md` so it’s grouped by **tools** (not mixed), and add more targeted refactoring ideas for `src/app/views/print-color-usages-tool/PrintColorUsagesToolView.tsx`.
- Change: Restructured the spec into sections: **View Colors Chain**, **Print Color Usages**, and **Cross-tool / platform**; added concrete UI-side ideas for settings hydration + debounced persistence + small UX improvements.
- Note: Figma doesn’t have a dedicated “progress notification” API. For real progress, show it in the plugin UI (via `figma.ui.postMessage` + a progress bar/text), and use `figma.notify` only for start/end/error.
- Checked: Figma’s “Asynchronous Tasks” guide mentions progress indicators as a *general UI concept* during waiting, but it doesn’t define a plugin API for “progress notifications”. Reference: `https://developers.figma.com/docs/plugins/async-tasks/#synchronous-requests`.

#### Color Chain tool — swatch matches `TextboxColor`
- Goal: Make `src/app/components/ColorSwatch.tsx` look and behave **exactly** like the `@create-figma-plugin/ui` `TextboxColor` “chit” swatch.
- Change: Updated `ColorSwatch` defaults and styling to match `TextboxColor` `.chit` precisely:
  - 14×14 size, radius 2
  - checkerboard background (same SVG data URL)
  - opacity preview: 2 halves when opacity < 100%
  - no standalone swatch border (TextboxColor border is on the whole control, not the chit)
- Verification: `npm run build` passed.
- Memory: Stored an updated OpenMemory note clarifying the swatch details (including correcting the earlier “border on hover” assumption).

#### Memory process preference (OpenMemory)
- User preference: do **not** use/maintain `openmemory.md`; use the `openmemory-local` MCP memory system instead.

#### Refactoring ideas (spec)
- Goal: Capture concrete refactoring + optimisation ideas for this repo (performance, reliability, maintainability) in a single place under `Specs/`.
- Added: `Specs/Refactoring Ideas.md` — prioritised plan (P0/P1/P2), risks, rollout order, and a minimal manual test checklist.
- Update: Added “Print Color Usages” UI efficiency ideas (avoid redundant save-after-load, debounce settings persistence, reduce message branching).
- Decision: Highest impact next work should prioritize reliability + fewer Figma API calls (P0.3 stale-result guard / race-proof updates; then caching P0.2). For Print Color Usages, the highest impact “cheap win” is P1.4 (avoid save-after-load + debounce settings saves).

#### Refactor: remove dead/duplicated code in `variable-chain.ts`
- Goal: Improve maintainability by removing unused/duplicated code paths in selection scanning.
- Change: Deleted unused `getFoundVariablesFromSelection()` and introduced shared helper `getFoundVariablesFromRoots()`; `getFoundVariablesFromNode()` now delegates to the helper.
- Verification: `npm run build` passed.

#### Optimisation: compute only the chain we render (V2 payload)
- Goal: Avoid resolving chains for *all* modes when UI renders only one chain.
- Change:
  - Added `MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2` and V2 result types in `src/app/messages.ts` (`chainToRender` instead of `chains[]`).
  - Implemented `inspectSelectionForVariableChainsByLayerV2()` in `src/app/variable-chain.ts` (computes a single `ModeChain` per variable).
  - Updated main thread (`src/app/run.ts`) to send V2 results.
  - Updated UI (`src/app/views/color-chain-tool/ColorChainToolView.tsx`) to consume V2 and still accept old results (coerces legacy payload).
- Verification: `npm run build` passed.

#### New tool: Print Color Usages (integrated)
- Goal: Bring the separate “Print Color Usages” plugin into this combined plugin as a new tool.
- Decision: Keep Markup Kit-specific styling and expose as a single menu command that opens the tool UI.
- Change:
  - Added new tool entrypoint `src/print-color-usages-tool/main.ts` and menu item in `package.json` (adds `permissions: ["teamlibrary"]`).
  - Added Home card + UI route/view `src/app/views/print-color-usages-tool/PrintColorUsagesToolView.tsx`.
  - Refactored main-thread runner into per-tool handlers (`src/app/run.ts` dispatcher; tool runners under `src/app/tools/*/main-thread.ts`).
  - Ported Print/Update logic into `src/app/tools/print-color-usages/*` (settings, Markup Kit styling, analysis, print, update).

#### Print Color Usages UI — alignment
- Issue: horizontal `RadioButtons` looked slightly visually misaligned between options (baseline/inline-flex rendering quirk in `@create-figma-plugin/ui`).
- Fix: pass option labels as `<Text>` children (matches UI kit Storybook usage) to keep baselines consistent.
- Verification: `npm run build` passed.

#### Print Color Usages UI — remove Theme + checkbox alignment
- Change: removed Theme selector from UI and locked fallback to “dark” (white text) in main thread + UI state.
- Note shown in UI: Markup Kit “Markup Text” / “Markup Text Secondary” are used when available; otherwise fallback is white text.
- Change: checkbox labels are now wrapped in `<Text>` (matches UI kit Storybook usage, improves alignment).
- Verification: `npm run build` passed.

#### Print Color Usages UI — fixed bottom buttons + update label
- Change: Print/Update buttons are now fixed to the bottom (form scrolls above them).
- Change: removed “Done” UI state; completion feedback is via native `figma.notify` only.
- Change: Update button label now depends on selection:
  - If selection exists: “Update Prints in Selection”
  - If no selection: “Update Prints on Page”
- Verification: `npm run build` passed.

#### Print Color Usages — update selection recursively
- Change: when updating with a selection, the tool now finds **all text layers inside the selection recursively** (not only directly selected text layers).
- Verification: `npm run build` passed.

### 2026-02-03

#### New tool: Mockup markup tool (apply Mockup Markup text styles/colors)
- Goal: Add a new tool that can **apply** (and possibly “paste/apply to selection”) text styles and text colors from the **“Mockup markup”** library to selected text layers.
- Reference: reuse the existing Markup Kit resolution logic in `src/app/tools/print-color-usages/markup-kit.ts` (resolves “Markup Text” / “Markup Text Secondary” variable-based paints + preferred label text style id with safe fallbacks).
- Expected behavior: select one or more text layers (or frames/groups containing text) → run tool → plugin applies chosen markup typography + primary/secondary text color tokens to the selection.

#### Mockup Markup tool — issues + requested UX
- Issue: UI shows “Selection: none” even when selection exists (likely when navigating from Tools Home → tool card; main thread tool handler not active).
- Request: Add explicit presets:
  - Typography: H1, H2, H3, Description text, Paragraph text
  - Colors: Text, Text secondary, Purple
- Request: One-time debug logging to discover the needed IDs/keys (styles + variables) for the “Mockup markup” library in the current file.
- Question: Can we set a default variable mode (e.g. apply “Dark”) for whole page/document? (Investigate Figma variables mode APIs.)

#### Mockup Markup tool — implemented (presets + debug + force dark)
- Fix: Added active-tool routing between UI and main thread so tools opened from “Tools Home” receive selection updates (prevents “Selection: none” when selection exists).
- UI: Added preset selectors for typography (H1/H2/H3/Description/Paragraph) and color (Text/Text secondary/Purple).
- UI: Added “Force variables mode: Dark” toggle (sets explicit mode for the involved variable collection when applying preset color).
- Debug: Added “Debug: log IDs to console” button to print filtered local text styles + local color variables + enabled library variable collections for “Mockup markup”.
- Debug update: also logs filtered COLOR variables inside the preferred “Mockup markup” library variable collection(s) (helps identify exact variable names/keys like “Purple”).

#### Mockup Markup tool — new workflow: learn presets from selection
- User idea: place sample nodes for required typography + colors on canvas, select them, and let the tool extract and reuse them.
- Implemented: “Learn presets from selection” button saves learned presets to `figma.clientStorage` and reuses them for applying typography/color presets (prefers learned `textStyleId` and learned `fills`).

#### Mockup Markup tool — spec-based simplification (hardcoded IDs + cleaner UI)
- Source of truth: `Specs/Mockup markup tool.md` with fixed text style IDs and variable IDs.
- Change: Tool now uses **hardcoded** text style IDs (H1/H2/H3/Description/Paragraph) and **hardcoded** color variable IDs (Text/Text Secondary/Purple), resolving/importing variables as needed.
- UI: per `Specs/Design Best Practices.md`, removed competing bottom actions. Now there is **one primary action**:
  - If selection contains text → **Apply to selection**
  - If selection has no text → **Create text**
  Includes a small preview line (“will apply to N text layers” / “will create 1 text layer”).
- Debug: Added console logs when a color preset variable can’t be resolved/applied (prints preset name + raw VariableID + fallback name).
- Fix: Updated Description text style ID to `S:d8195a8211b3819b1a888e4d1edf6218ff5d2fd5,1282:7` (no longer shares H3 id).
- Fix: Dark mode now applies page-wide by calling `figma.currentPage.setExplicitVariableModeForCollection(...)` (previously we incorrectly called it on `figma`, so it didn’t stick).
- UI: Typography preset order now matches spec (Paragraph → Description → H1 → H2 → H3); default preset is Paragraph.
- UI: Added color swatches next to Text/Text secondary/Purple by resolving the variable colors on the main thread and sending hex previews to UI.
- Fix: Purple variable fallback name matching now uses “Markup Purple” (per spec) instead of only “Purple”, and resolution tries all candidate names when import-by-id fails.
- Debug (Figma MCP): Checked current selection nodes. Found sample typography nodes matching Markup H1/H2/H3/Description/Paragraph, and sample color nodes using tokens `--markup-text`, `--markup-text-secondary`, `--markup-purple` (purple resolves to `#DE3CE1` in the design context).
- Improvement: On first open, tool now auto-imports required Mockup Markup variables (Text/Text Secondary/Purple) once via `clientStorage` flag, so subsequent lookups by id work and swatches resolve immediately.
- UI: Added “Width 400” checkbox; when enabled, Create/Apply sets TextNodes to fixed width 400 with auto-height.
- Naming: Renamed the tool label to “Mockup Markup Quick Apply” (menu item, home card, window title/header).
- UI: Color selector moved above Text style and switched from RadioButtons to a SegmentedControl (with swatches).
- UI: Increased padding/spacing inside color segments (segmented control) for better visual balance.
- UI: Made Text style presets more obvious: custom 2-row layout (Paragraph/Description on first row, H1/H2/H3 on second) with “fake” larger preview typography for headings.
- UI: Applied the same 2-row “tile grid” treatment to colors (Text/Text secondary on first row, Purple on second), replacing the segmented control.
- UI: Removed extra secondary text under Paragraph/Description tiles.
- UI: Replaced the Dark mode checkbox with a bottom “Mode” segmented control (Dark/Light).
- UI: Replaced the (broken) library segmented control for Mode with a custom inline segmented UI to ensure correct rendering in the plugin iframe.
- UI: Tightened preset tiles styling: less internal padding/gap, no bold labels, and use default `Text` sizing for labels.
- UI: Removed secondary grey helper texts (selection/preview/empty hint) to keep the tool compact.
- UI: Home card icon updated for this tool.
- Fix: Applying typography could result in “Nothing applied (skipped 1)” when the Mockup markup text styles weren’t imported into the current file. We now attempt to import the text style from the library using `figma.importStyleByKeyAsync(...)` (deriving the key from the hardcoded `S:<key>,...` style id) before applying.
- UI: Moved “Mode” to the **bottom of the content area** (still scrollable content), anchored above the divider/button footer.
- Fix: Creating text could fail when “Width 400px” is enabled if the text node font wasn’t loaded (or style apply failed). We now load the text node’s current font before setting `characters`, and set `textAutoResize = "HEIGHT"` safely before resizing.
- Fix: Prevented “Uncaught (in promise)” errors by awaiting all tool `onActivate()` handlers and wrapping `figma.ui.onmessage` in a top-level try/catch (logs + `figma.notify`).
- Fix: Some environments throw “Unable to create style” when trying to import/apply remote text styles. We now **never auto-import text styles** and we avoid applying **remote** styles by id; typography is applied only if the style is already present in the file (local/imported, resolved by key/name). Otherwise the tool still Create/Apply color/width and shows a clear notify to import text styles into the file.

#### Mockup Markup tool — major refactoring for robustness
- Issue: Colors/styles sometimes didn't apply due to several root causes:
  1. Import-once caching bug: stored `true` even if imports failed
  2. Silent error swallowing: too many `catch { // ignore }` blocks
  3. Complex fallback logic with unclear failure paths
  4. No validation after applying fills/styles
  5. Duplicated code (`collectTextNodesRecursivelyFromSelection` in 2 files)
  6. Font loading timing issues
- Refactoring:
  - Added `utils.ts`: shared utilities (`collectTextNodesFromSelection`, `OperationResult` type, `loadFont`, `logDebug`, `logWarn`)
  - Rewrote `resolve.ts`: cleaner resolution strategies with explicit logging
  - Fixed `import-once.ts`: now tracks success **per variable** (v2 storage key), retries failed ones
  - Rewrote `apply.ts`: validates that fills/styles were actually applied, aggregates errors
  - Rewrote `create.ts`: proper font loading order (load style font → apply style → load current font → set characters)
  - Cleaned `main-thread.ts`: uses shared utilities, clearer structure
  - Updated `color-previews.ts`: uses shared utilities
- Simplified `resolve.ts` text style resolution: now uses `figma.importStyleByKeyAsync(key)` directly (like variables) instead of overly defensive logic that rejected remote styles. Works correctly when library is enabled.

### 2026-02-04

#### Full project audit — refactoring suggestions
- Goal: Audit the entire project for code quality improvements: structure, simplification, deduplication, efficiency, robustness, extracting reusable parts, pattern consistency.
- Scope: Reviewed all source files (run.ts, messages.ts, variable-chain.ts, all 3 tools main-thread + UI views, all components, presets, shared utilities).
- Output: Merged findings into `Specs/Refactoring Ideas.md` with prioritized recommendations:
  - **P0**: Shared utilities extraction (color-utils, figma-variables, logging), debounce settings, stale-result guard
  - **P1**: Pattern consistency (standardize message handlers, usePluginMessages hook, ToolFooterActions component)
  - **P2**: Project structure reorganization (deferred)
- Key duplications found:
  - Color conversion in `variable-chain.ts` and `analyze.ts`
  - Variable resolution in 4 files (resolve.ts, markup-kit.ts, shared.ts, variable-chain.ts)
  - Message listener setup in all 3 view files
  - Fixed footer pattern in Print Color Usages and Mockup Markup views

#### Testing Figma plugins — documentation
- Created `Specs/How to Test Figma Plugins.md` with comprehensive guide on testing strategies:
  - **Unit tests** for pure logic with Vitest (recommended first step)
  - **figma-api-stub** for mocking basic Figma API (limited — doesn't support variables)
  - **In-Figma test runners** (experimental, complex setup)
  - **Manual testing checklist** (current approach, keep maintaining)
- Key insight: Community mocks don't support Figma's newer variable APIs, so best ROI is extracting pure logic and unit testing it.

### 2026-02-05

#### Migration: Variables Rename Helper → 4 Separate Tools
- Goal: Migrate the separate `variables-rename-helper` plugin (4-tab UI) into this combined plugin as 4 distinct tools.
- User-specified tool names:
  1. **Variables Batch Rename** — Rename multiple variables at once via inline editing or CSV export/import
  2. **Variables Export Import** — Export variable collections to JSON snapshot, import from backup
  3. **Variables Create Linked Colors** — Create new color variables or rename existing ones in selection
  4. **Variables Replace Usages** — Replace variable bindings in selection with different variables
- Architecture decision: Each tool is completely separate (own entry file, main-thread handler, view, messages) rather than a single "sub-home" with tabs.
- Created files:
  - Entry files: `src/variables-*-tool/main.ts` (4 files)
  - Main-thread handlers: `src/app/tools/variables-*/main-thread.ts` (4 files)
  - Views: `src/app/views/variables-*-tool/*ToolView.tsx` (4 files)
  - Updated: `src/app/messages.ts` (added UI_TO_MAIN/MAIN_TO_UI constants + payload types)
  - Updated: `src/app/run.ts` (tool registration + routing)
  - Updated: `src/app/ui.tsx` (UI routing for 4 new views)
  - Updated: `src/app/views/home/HomeView.tsx` (4 new ToolCards under "Variables" section)
  - Updated: `package.json` (4 new menu entries)
- Build: `npm run build` passed successfully.
- Note: The main-thread handlers include basic working implementations; full feature parity with the original plugin may need additional refinement based on testing.

## Git (initialize repo)

### 2026-01-29
- Goal: Initialize a git repository in this project folder so changes can be tracked and safely reverted.

---

## General workflow / safety Q&A

### 2026-02-11
- Question: how to rename a folder and what can break.
- Guidance: renaming is usually fine, but references can break (imports, paths in config/scripts/docs, CI/deploy paths, and hardcoded file paths).
- Recommended safe flow: search references first, rename once, run build/tests, then quick manual smoke-check of main flows.
- Clarification: user asked specifically about renaming the repository root folder (`figma-jb-variables-utilities`).
- Extra risk note for root rename: local terminal scripts/shortcuts, Cursor workspace path, and any absolute paths outside the repo may need manual update; git history/remotes are typically unaffected.

