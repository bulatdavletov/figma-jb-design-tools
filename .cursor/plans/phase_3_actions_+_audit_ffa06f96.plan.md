---
name: Phase 3 Actions + Audit
overview: Audit output names to use nouns, replace separate filters with one unified Filter action (AND/OR conditions), add ~19 new basic Figma API actions, and create a TokenHighlighter component for token expression rendering.
todos:
  - id: audit-output-names
    content: Add defaultOutputName to ActionDefinition, update generateDefaultOutputName(), and update all existing action definitions with noun-based output names
    status: completed
  - id: unified-filter
    content: Replace filterByType + filterByName with a single unified 'filter' action supporting multiple conditions (type, name, fillColor, component, visible, hasVariable, fillVariable) with AND/OR logic and query-builder UI
    status: completed
  - id: storage-migration
    content: "Migrate saved automations: rename old output names, convert filterByType/filterByName to unified filter, update token references"
    status: pending
  - id: new-source-actions
    content: Implement sourceFromAllPages and sourceFromPageByName actions (handler + definition + UI)
    status: in_progress
  - id: new-property-actions
    content: "Implement 9 new property transform actions: setVisibility, setLocked, setName, setRotation, removeNode, cloneNode, setStrokeColor, removeFills, removeStrokes"
    status: in_progress
  - id: new-text-actions
    content: "Implement 6 new text transform actions: setFontSize, setTextAlignment, setFont, setTextCase, setTextDecoration, setLineHeight"
    status: in_progress
  - id: new-component-actions
    content: "Implement 2 new component actions: detachInstance, swapComponent"
    status: in_progress
  - id: register-all-actions
    content: Register all new actions in executor.ts ACTION_HANDLERS and add config forms + param summaries in AutomationsToolView.tsx
    status: pending
  - id: token-highlighter
    content: Create TokenHighlighter component with colored background pills for {token} expressions, using different colors for property/pipeline/snapshot tokens
    status: pending
  - id: integrate-token-highlighter
    content: Replace plain text token rendering with TokenHighlighter in param summaries, config panels, and run output
    status: pending
  - id: update-spec
    content: Update Automations Tool.md spec with new actions in Current Implementation section
    status: pending
isProject: false
---

# Phase 3: Action Audit, New Actions, and Token UI

## Part 1: Output Name Audit

Every step's auto-generated `outputName` should be a **noun** representing what the output contains. Currently they mirror the `actionType` (verb-style). Change `generateDefaultOutputName()` base names.

### Proposed output name mapping

**Source:**

- `sourceFromSelection` -> `selection`
- `sourceFromPage` -> `page`
- (new) `sourceFromAllPages` -> `allPages`
- (new) `sourceFromPageByName` -> `page`

**Filter:**

- `filterByType` -> migrated to unified `filter` action, output: `filtered`
- `filterByName` -> migrated to unified `filter` action, output: `filtered`
- (new) `filter` -> `filtered`

**Navigate:**

- `expandToChildren` -> `children`
- `goToParent` -> `parent`
- `flattenDescendants` -> `descendants`
- `restoreNodes` -> `restoredNodes`

**Transform:**

- `renameLayers` -> `renamedLayer`
- `setFillColor` -> `fillColor`
- `setFillVariable` -> `fillVariable`
- `setOpacity` -> `nodes`
- `setCharacters` -> `texts`
- `resize` -> `resized`
- `wrapInFrame` -> `wrappedFrames`
- `addAutoLayout` -> `layouts`
- `editAutoLayout` -> `layouts`
- `removeAutoLayout` -> `nodes`
- `setPosition` -> `positioned`

**Data-producing:**

- `askForInput` -> `askForInput`
- `splitText` -> `splitText`
- `count` -> `count` (already a noun)

**Output:**

- `notify` -> `notification`
- `selectResults` -> `selectResults`
- `log` -> `log`

**Pipeline Variables:**

- `setPipelineVariable` -> `variable`
- `setPipelineVariableFromProperty` -> `property`

### Implementation

- Add `defaultOutputName` field to `ActionDefinition` in [types.ts](src/app/tools/automations/types.ts)
- Update `generateDefaultOutputName()` to use `def.defaultOutputName ?? actionType` as base
- Add storage migration in [storage.ts](src/app/tools/automations/storage.ts) to rename old output references in saved automations (both `outputName` fields and `{#oldName.prop}` / `{$oldName}` token references in params)

---

## Part 2: New Actions (~19 new actions)

All new actions follow the existing pattern: define in `ACTION_DEFINITIONS`, implement handler, register in executor, add config form + param summary in the view.

### Unified Filter Action (replaces filterByType + filterByName)

One `filter` action with a conditions builder. Replaces all separate filter actions.

**Data model:**

```typescript
// In step params
{
  logic: "and" | "or",
  conditions: FilterCondition[]
}

interface FilterCondition {
  field: FilterField
  operator: FilterOperator
  value: string | boolean | number
}
```

**Available filter fields:**

- **String fields** (operators: equals, contains, startsWith, endsWith, regex):
  - `name` -- layer name
  - `fillVariable` -- bound fill variable name
  - `component` -- instance's main component name
- **Enum field** (operators: equals, notEquals):
  - `type` -- node type (FRAME, TEXT, INSTANCE, etc.)
- **Color field** (operators: equals, with optional tolerance):
  - `fillColor` -- first fill's hex color
- **Boolean fields** (operators: is, isNot):
  - `visible` -- node visibility
  - `hasVariable` -- has any variable binding (optionally scoped to fill/stroke)
  - `hasFills` -- has fills
  - `hasStrokes` -- has strokes
- **Number fields** (operators: equals, greaterThan, lessThan):
  - `opacity` -- opacity (0-1)
  - `width` -- node width
  - `height` -- node height

**Config form UI (query builder):**

```
Filter: [AND v]
+-----------------------------------------+
| [Type v]    [equals v]    [TEXT v]    x |
| [Name v]    [contains v]  [Label___] x |
| + Add condition                         |
+-----------------------------------------+
```

Each condition row:

1. Field dropdown (grouped: General, Appearance, Dimensions)
2. Operator dropdown (changes based on field type)
3. Value input (dropdown for type/enum, textbox for strings, color for fillColor, toggle for booleans)
4. Remove button

**Param summary:** `"AND: type = TEXT, name ~ Label"` (concise inline summary)

**Migration:** `filterByType` -> `filter` with `conditions: [{ field: "type", operator: "equals", value: nodeType }]`. Same for `filterByName`.

Files: new [filter-actions.ts](src/app/tools/automations/actions/filter-actions.ts)

### New Source Actions (2)


| actionType             | Label             | Output      | Params             |
| ---------------------- | ----------------- | ----------- | ------------------ |
| `sourceFromAllPages`   | From all pages    | `allPages`  | --                 |
| `sourceFromPageByName` | From page by name | `namedPage` | `pageName: string` |


Files: [source-actions.ts](src/app/tools/automations/actions/source-actions.ts)

### New Transform -- Properties (9)


| actionType       | Label            | Output    | Params                                                |
| ---------------- | ---------------- | --------- | ----------------------------------------------------- |
| `setVisibility`  | Set visibility   | `nodes`   | `visible: boolean`                                    |
| `setLocked`      | Set locked       | `nodes`   | `locked: boolean`                                     |
| `setName`        | Set name         | `named`   | `name: string` (supports tokens like `{type}/{name}`) |
| `setRotation`    | Set rotation     | `rotated` | `degrees: string` (supports tokens)                   |
| `removeNode`     | Remove node      | `removed` | -- (destructive warning)                              |
| `cloneNode`      | Clone node       | `clones`  | --                                                    |
| `setStrokeColor` | Set stroke color | `stroked` | `hex: string`                                         |
| `removeFills`    | Remove fills     | `nodes`   | --                                                    |
| `removeStrokes`  | Remove strokes   | `nodes`   | --                                                    |


Files: [property-actions.ts](src/app/tools/automations/actions/property-actions.ts)

### New Transform -- Text (6)


| actionType          | Label               | Output  | Params                                               |
| ------------------- | ------------------- | ------- | ---------------------------------------------------- |
| `setFontSize`       | Set font size       | `texts` | `size: string` (supports tokens)                     |
| `setTextAlignment`  | Set text alignment  | `texts` | `align: "LEFT" / "CENTER" / "RIGHT" / "JUSTIFIED"`   |
| `setFont`           | Set font            | `texts` | `family: string, style: string`                      |
| `setTextCase`       | Set text case       | `texts` | `textCase: "ORIGINAL" / "UPPER" / "LOWER" / "TITLE"` |
| `setTextDecoration` | Set text decoration | `texts` | `decoration: "NONE" / "UNDERLINE" / "STRIKETHROUGH"` |
| `setLineHeight`     | Set line height     | `texts` | `value: string, unit: "PIXELS" / "PERCENT" / "AUTO"` |


Files: new [text-actions.ts](src/app/tools/automations/actions/text-actions.ts)

### New Transform -- Components (2)


| actionType       | Label           | Output     | Params                  |
| ---------------- | --------------- | ---------- | ----------------------- |
| `detachInstance` | Detach instance | `detached` | --                      |
| `swapComponent`  | Swap component  | `swapped`  | `componentName: string` |


Files: new [component-actions.ts](src/app/tools/automations/actions/component-actions.ts)

### Action type union and definitions

All 22 new types added to `ActionType` union and `ACTION_DEFINITIONS` in [types.ts](src/app/tools/automations/types.ts). All registered in `ACTION_HANDLERS` in [executor.ts](src/app/tools/automations/executor.ts).

### UI: Config forms and param summaries

Each new action needs:

- Config form in `renderStepParams()` in [AutomationsToolView.tsx](src/app/views/automations-tool/AutomationsToolView.tsx)
- Param summary in `getParamSummary()`
- Input context hints via `renderInputContext()`

---

## Part 3: Token Highlighting UI

Currently `{token}` expressions appear as plain text everywhere. Create a visual treatment similar to the [InlineTextDiff](src/app/components/InlineTextDiff.tsx) component's colored background approach.

### TokenHighlighter component

New file: `src/app/components/TokenHighlighter.tsx`

- **Input:** A string like `"Hello {name}, your {type} is ready"`
- **Output:** JSX with regular text spans and highlighted token spans
- **Token style:** Indigo/blue colored background pill:
  - `background: "var(--figma-color-bg-brand-tertiary)"` (or fallback `#eef2ff`)
  - `border: 1px solid` with matching border color
  - `borderRadius: 4px`, `padding: 0 3px`
  - `fontFamily: monospace`, `fontSize: 0.9em`
- Detects `{...}` patterns, including `{$var}`, `{#snap.prop}`, `{name}`
- Different colors for different token types:
  - Property tokens `{name}`, `{width}`: blue/indigo
  - Pipeline vars `{$var}`: green
  - Snapshot refs `{#snap.prop}`: orange/amber

### Usage locations

- `getParamSummary()` return values (step row descriptions)
- `StepConfigPanel` display labels
- Run output log messages
- Anywhere token expressions are shown read-only (NOT in editable textboxes)

---

## Storage Migration

Three migration tasks in [storage.ts](src/app/tools/automations/storage.ts):

1. **Output name migration**: Update `outputName` fields from old verb-style defaults to new noun defaults. Only migrate if outputName exactly matches the old auto-generated pattern (user-customized names stay untouched). Map: `sourceFromSelection` -> `selection`, `goToParent` -> `parent`, `filterByType` -> `filtered`, etc.
2. **Token reference migration**: Update `{#oldName.property}` and `{$oldName}` references inside step param values to use new output names.
3. **Filter action migration**: Convert `filterByType` steps to `filter` with `{ logic: "and", conditions: [{ field: "type", operator: "equals", value: params.nodeType }] }`. Convert `filterByName` steps to `filter` with `{ logic: "and", conditions: [{ field: "name", operator: params.matchMode, value: params.pattern }] }`.

