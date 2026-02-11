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

