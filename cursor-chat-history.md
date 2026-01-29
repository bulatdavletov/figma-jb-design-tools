## Mem0 (installation + first run)

### 2026-01-29
- Goal: Install Mem0 on this Mac in a safe way for a non-developer workflow.
- Decision: Install Mem0 Python SDK (`mem0ai`) into a project-local virtual environment (`.venv`) to avoid changing global/system packages.
- Status: Installed successfully; basic `from mem0 import MemoryClient, Memory` import test passed.

## Mem0 (Docker: find what’s running)

### 2026-01-29
- User already had Mem0-related services running in Docker (Compose project `mem0`).
- Found containers/ports:
  - `openmemory-mcp` on `localhost:8765` (docs at `/docs`)
  - `qdrant` on `localhost:6333`
- Security fix: `docker-compose.yml` contained a hardcoded OpenAI API key; replaced with env var `${OPENAI_API_KEY}` and noted not to store secrets in the file.
- User requested to export the (leaked) API key; advised to rotate/revoke it and set a new key instead. Do not handle/paste secrets in chat.
- Next steps: rotate OpenAI key, export new `OPENAI_API_KEY`, restart `openmemory-mcp`, verify via `http://localhost:8765/docs`.
- Done: user exported a *new* key in terminal session, force-recreated `openmemory-mcp`, logs show Uvicorn running and `/docs` returns 200.
- Note: `http://localhost:8765/` returns 404 (no homepage). Use `/docs` for UI or call API/MCP endpoints.
- Using it: connect Cursor to MCP SSE endpoint `/mcp/cursor/sse/{user_id}` (example: `http://localhost:8765/mcp/cursor/sse/Bulat.Davletov`) or use REST API under `/api/v1/memories/`.

## OpenMemory in Cursor (Option A)

### 2026-01-29
- Found Cursor MCP config at `/Users/Bulat.Davletov/.cursor/mcp.json`.
- `openmemory` server is already configured via `npx supergateway --sse http://localhost:8765/mcp/cursor/sse/Bulat.Davletov`.
- Next: reload Cursor window, confirm MCP server is connected, then use it inside Cursor chat/tools.
- Checked REST `list_memories`: `GET /api/v1/memories/?user_id=Bulat.Davletov` returned `total: 0` (empty list).
- How to view all stored memories from Cursor chat: call MCP tool `user-openmemory` → `list_memories` (no args). It returns an array of memories with `id`, `memory`, timestamps, and metadata.
- Storage: memories/vectors persist in Qdrant (`mem0_store`) via Docker volume `mem0_mem0_storage` mounted at `/mem0/storage` inside the container.

## Figma utilities “one plugin” (product/spec work)

### 2026-01-29
- Goal: Combine several existing Figma plugins/utilities into one cohesive plugin with a nice UI (likely `create-figma-plugin`), and document clear use cases/specs for each utility.
- Inputs: list of existing plugins (icon library swap, variables rename helper, print color usages, color match finder, “variables helper”, “detach color variable”), plus new ideas (swap components+overrides, view/manage token chains).
- Questions to answer: is one plugin a good idea vs a suite; risks; how to explain use cases; how to test utilities/plugin to avoid breaking updates.
- Progress: Reviewed original “Find Color Match” plugin (`ds-colors-cursor`) README + code. Documented actual behavior (selection scan rules, variable matching, apply behavior, YAML mapping import/export, preference persistence) in `Specs/Find Color Match.md`.
- Persona note: “Find Color Match” is primarily for **design system maintainers** doing palette/token migrations; secondarily useful for **design ops**; occasionally useful for **product designers** cleaning up legacy colors in a selection.
- Progress: Drafted “Variable Chain Inspector” utility spec (view full alias chain + remove intermediate link + promote step) in `Specs/Chain Utility.md`.
- Progress: Implemented plugin scaffold + architecture: Home screen + separate Figma menu command per utility. Implemented “Variable Chain Inspector” Flow A (inspect selection → show variable alias chain per mode). Added `README.md` with build/import steps.
- Fix: Switched `create-figma-plugin` deps from v4 alpha to stable v3 and removed `networkAccess` from manifest to address Figma console warning about `local-network-access` and startup errors. Rebuilt `manifest.json`.
- Debug aid: changed plugin `id` + `name` and disabled minification to avoid caching and make console errors easier to read.
- Fix: Plugin crash `TypeError: not a function` was caused by command entry files not exporting a default function. Updated `src/home/main.ts` and `src/chain-inspector/main.ts` to `export default` and rebuilt.
- Progress: Reviewed original plugins `variables-rename-helper` and `Print Color Usages` (README/manifest/code) and documented their behavior/personas in `Specs/Variables Rename Helper Utility.md` and `Specs/Print Color Usages Utility.md`.
- Fix: Variable Chain Inspector now scans selection **recursively** (node + all descendants) for variable-bound fills/strokes/text, not just the top-level selected node.
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
- Update: Upgraded `@create-figma-plugin/*` to stable v4.0.3. `IconInteractionClickSmall24` is now available from the library, so the local `src/app/components/IconInteractionClickSmall24.tsx` was removed and imports were switched to the library icon.
- Update: v4 renamed several icons; updated imports (`IconArrow16`, `IconInstance16`, `IconComponent16`, etc.). `manifest.json` is clean (no `networkAccess` / `local-network-access` permission added).
- UI: Layer-type icons now use Figma “component purple” (`--figma-color-icon-component`) for INSTANCE/COMPONENT/COMPONENT_SET (matches Figma’s instance color).
- UX: Removed “Inspect selection” button. Chain Inspector now auto-refreshes when selection changes (main thread listens to `selectionchange` and pushes updates to UI). Empty state shown when nothing is selected.
- Fix: After upgrading to `@create-figma-plugin/*` v4, the UI could appear empty because `height: 100%` may collapse in the plugin iframe. Updated the global `Page` wrapper to use `height: 100vh` so content always shows.
- Fix: Chain Inspector UI could still look empty due to a race (initial selection update message arriving before the view subscribed). On mount, the view now requests a refresh (`INSPECT_SELECTION_FOR_VARIABLE_CHAINS`) and shows “Inspecting selection…” while waiting.
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
- UI: Added reusable `UtilityHeader` component (title + optional left action). Chain Inspector now uses it for a consistent header layout across utilities.
- UI: Chain rows now show a muted grey **down arrow** (rotated `IconArrow16`) to indicate direction (no arrow on the final HEX row). `IconChevronDown16` looked too much like “expand”.
- Dev: Added `AppIcons` collection (chevrons + arrows in 4 directions) so we stop hunting for “left/right/up/down” variants. Updated code to use these wrappers and removed the old one-off `IconChevronLeft16` file.
- Dev: Updated `AppIcons` arrows to use `IconStrokeLineArrow24` (scaled to 16px + rotated) because `IconArrow16` is diagonal and looks wrong when rotated.
- Dev: Switched `AppIcons` to re-export pixel-perfect SVGs from `src/app/components/custom-icons/` (no scaling). This replaces the temporary “scale a 24px icon down to 16px” approach.
- Naming: Keep `custom-icons/` for the raw SVG icon set, and keep `AppIcons.tsx` as the single import surface for the app. (If we later mix library + custom icons, “AppIcons” remains accurate.)
- UI: Added reusable `UtilityCard` component (icon + name + short description). Home screen now uses it for utilities (starting with Variable Chain Inspector).
- UI: `UtilityCard` now has hover + focus styles (hover background + stronger border; keyboard focus outline).
- UI: Home screen “Variable Chain Inspector” card icon updated to `IconLink16` (clearer “chain” metaphor).

## Git (initialize repo)

### 2026-01-29
- Goal: Initialize a git repository in this project folder so changes can be tracked and safely reverted.

