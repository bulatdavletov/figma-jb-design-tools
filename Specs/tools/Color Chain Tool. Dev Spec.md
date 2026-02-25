## Color Chain Tool. Dev Spec

### Purpose
Inspect selected layers and show applied variable color chains (including alias steps), with quick actions to copy values or replace the main color variable usage in selection.

### Primary files
- `src/app/tools/color-chain-tool/main-thread.ts`
- `src/app/views/color-chain-tool/ColorChainToolView.tsx`
- `src/app/variable-chain.ts`
- `src/app/messages.ts`
- `src/app/components/ColorRow.tsx`
- `src/app/components/ColorSwatch.tsx`
- `src/app/components/CopyIconButton.tsx`
- `src/app/components/State.tsx`

### Main-thread flow
1. `registerColorChainTool` registers listeners and message handlers.
2. `onActivate` calls `scheduleUpdate()` to inspect current selection.
3. `sendUpdate()`:
   - if selection is empty -> posts `MAIN_TO_UI.SELECTION_EMPTY`
   - else -> calls `inspectSelectionForVariableChainsByLayerV2()` and posts `MAIN_TO_UI.VARIABLE_CHAINS_RESULT_V2`
4. Selection changes are debounced via `scheduleUpdate()` (50ms).
5. Optional live updates from `documentchange`:
   - loads all pages
   - listens for changes
   - refreshes only when changed node is inside current selection ancestry

### UI view-state model
`ColorChainToolView` uses a strict state model:
- `selectionEmpty` is true only when `MAIN_TO_UI.SELECTION_EMPTY` arrives.
- Any `VARIABLE_CHAINS_RESULT(_V2)` sets `selectionEmpty(false)`.
- `loading` is set before requesting inspection and cleared on response.
- Derived `viewState`:
  - `error`
  - `inspecting`
  - `selectionEmpty`
  - `nothingFound` (selection exists, but no variable colors)
  - `content`

### Message contract
- UI -> Main:
  - `INSPECT_SELECTION_FOR_VARIABLE_CHAINS`
  - `COLOR_CHAIN_REPLACE_MAIN_COLOR`
  - `COLOR_CHAIN_NOTIFY`
- Main -> UI:
  - `VARIABLE_CHAINS_RESULT_V2` (primary)
  - `VARIABLE_CHAINS_RESULT` (legacy-compatible path exists in view coercion)
  - `SELECTION_EMPTY`
  - `ERROR`

### Replace flow
- User clicks `Apply Color` on a chain step row.
- UI sends `COLOR_CHAIN_REPLACE_MAIN_COLOR` with source/target variable IDs.
- Main thread calls `replaceVariableUsagesInSelection(...)`.
- On success: `figma.notify("Applied ...")`, then refresh via `sendUpdate()`.

### Data shape notes
- V2 result row contains:
  - layer info (`layerId`, `layerName`, `layerType`)
  - `colors[]` entries with:
    - `variableId`, `variableName`, `collectionName`
    - `appliedMode`
    - `chainToRender` (resolved chain for applied mode)
    - `hasOtherModes`
- View has coercion helper to display legacy result payloads as V2.

### Known constraints
- Tool is selection-scoped, not page-scoped.
- Document change listener depends on `figma.loadAllPagesAsync()` success; if it fails, tool falls back to selection-change updates only.
- Replace action is disabled while another replace request is in progress (`replaceBusyRowId`).

### Testing checklist
- Open with empty selection -> shows selection empty state.
- Open with selected node(s) using variable colors -> shows content rows.
- Open with selected node(s) without variable colors -> shows nothing-found state.
- Change selection rapidly -> still gets stable debounced updates.
- Replace one chain step -> updates selection usages and refreshes result.
- Copy actions show expected notifications/value copying behavior.
