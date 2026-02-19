---
name: Automations Tool
overview: Add a new "Automations" tool to the plugin that lets users create, save, and run sequential automation workflows by chaining actions (both low-level Figma operations and high-level wrappers around existing tools).
todos:
  - id: phase1-infra
    content: "Phase 1A: Create tool infrastructure -- entry point, main-thread handler, messages, routing, Home card, empty UI shell"
    status: pending
  - id: phase1-data
    content: "Phase 1B: Data model + storage -- types.ts, storage.ts (CRUD for automations in clientStorage), JSON export/import"
    status: pending
  - id: phase1-ui-list
    content: "Phase 1C: Automation list UI -- list saved automations, create new, delete, edit navigation"
    status: pending
  - id: phase1-ui-builder
    content: "Phase 1D: Automation builder UI -- add/remove/reorder steps, action picker, per-step config forms"
    status: pending
  - id: phase1-actions
    content: "Phase 1E: Implement core actions -- select by type, select by name, expand to children, rename, set fill, set opacity, notify"
    status: pending
  - id: phase1-executor
    content: "Phase 1F: Execution engine -- run steps sequentially, progress UI, error handling, summary"
    status: pending
  - id: phase2-tool-wrappers
    content: "Phase 2: High-level tool wrapper actions -- mockup markup, library swap, replace usages, print/update colors"
    status: pending
  - id: phase3-advanced
    content: "Phase 3: Advanced features -- conditions, loops, run from menu"
    status: pending
isProject: false
---

# Automations Tool -- Sequential Workflow Builder

## Concept

A new tool where users build named automations by adding steps from a menu of actions. Steps execute sequentially, with selection/context flowing from one step to the next. Automations are saved to `figma.clientStorage` and can be reused.

Think: a simplified Apple Shortcuts where each "block" is a Figma action.

## Architecture

Follows the existing tool pattern:

- Entry: `src/automations-tool/main.ts`
- Main thread: `src/app/tools/automations/main-thread.ts`
- UI view: `src/app/views/automations-tool/AutomationsToolView.tsx`
- Registered via `run.ts`, routed via `ui.tsx`, messages in `messages.ts`

### Data Model

```typescript
interface Automation {
  id: string;
  name: string;
  steps: AutomationStep[];
  createdAt: number;
  updatedAt: number;
}

interface AutomationStep {
  id: string;
  actionType: ActionType;
  params: Record<string, unknown>;
  enabled: boolean;
}
```

Stored as JSON array in `figma.clientStorage` under key `"automations_v1"`.

### JSON Export/Import (core feature)

Automations are fully serializable to JSON. Each automation can be exported as a standalone `.json` file and imported back. This allows sharing automations between team members or across devices.

Export format:

```json
{
  "version": 1,
  "automation": {
    "name": "My automation",
    "steps": [
      { "actionType": "selectByType", "params": { "nodeType": "TEXT" }, "enabled": true },
      { "actionType": "renameLayers", "params": { "find": "old", "replace": "new" }, "enabled": true }
    ]
  }
}
```

- Export: downloads a `.json` file via the existing `downloadTextFile` utility (already used in Batch Rename tool).
- Import: uses `FileUploadButton` from `@create-figma-plugin/ui` to upload a `.json` file, validates the schema, and adds the automation to the list.

### Execution Model

Steps run sequentially on the main thread. Each step receives:

- Current selection (may have changed from previous step)
- Its configured params

Each step produces:

- Modified selection or canvas state
- Optional log message for progress UI

The UI shows a progress indicator during execution (step X of Y + current step name).

```
flowchart TD
    Start["Run Automation"] --> S1["Step 1: Select by type"]
    S1 --> S2["Step 2: Rename layers"]
    S2 --> S3["Step 3: Apply Markup"]
    S3 --> Done["Done - show summary"]
```

## UI Flow

### Screen 1: Automation List (default)

- List of saved automations (name + step count + last run date)
- Each row: Run button, Edit button, Export button, Delete button
- "New automation" button + "Import automation" (`FileUploadButton`) at the bottom
- Empty state when no automations exist

### Screen 2: Automation Builder (edit/create)

- Name field at the top
- Ordered list of steps (each showing action type + brief param summary)
- Each step: drag handle (or up/down buttons), enable/disable toggle, configure button, remove button
- "Add step" button opens an action picker
- Save button in footer

### Screen 3: Step Configuration

- Dynamic form based on action type
- Shows action description + parameter fields
- Back to builder when done

## Actions (Phased)

### Phase 1 -- Core low-level actions

These are simple Figma API wrappers, easy to implement:

- **Select by type** -- Filter current selection to only nodes of a given type (TEXT, FRAME, INSTANCE, etc.)
- **Select by name** -- Filter selection by name pattern (contains / starts with / regex)
- **Expand to children** -- Replace selection with all descendants
- **Rename layers** -- Find/replace or set pattern on selected layer names
- **Set fill color** -- Set fill to a specific hex color
- **Set fill variable** -- Bind fill to a variable (by name or ID)
- **Set opacity** -- Set opacity on selected nodes
- **Notify** -- Show a Figma notification message (useful for debugging or confirmation)

### Phase 2 -- High-level tool wrappers

These reuse logic from existing tools in `src/app/tools/`:

- **Apply Mockup Markup** -- Apply typography + color preset to selection (wraps mockup-markup tool logic)
- **Library Swap** -- Run component swap on selection (wraps library-swap logic, requires mapping source)
- **Replace Variable Usages** -- Replace variable bindings in scope (wraps replace-usages logic, requires mapping)
- **Print Color Usages** -- Print colors from selection
- **Update Printed Colors** -- Update existing printed text layers

### Phase 3 -- Advanced features

- **Conditions** -- Skip step if condition not met (e.g., "selection is empty", "page name contains X")
- **Loop** -- Run subsequent steps for each item in selection individually
- **Run from menu** -- Assign a keyboard shortcut or menu command to a saved automation

## Files to Create/Modify

**New files:**

- `src/automations-tool/main.ts` -- tool entry point
- `src/app/tools/automations/main-thread.ts` -- main thread handler
- `src/app/tools/automations/types.ts` -- Automation, AutomationStep, ActionType definitions
- `src/app/tools/automations/storage.ts` -- clientStorage CRUD for automations
- `src/app/tools/automations/actions/` -- folder with one file per action category
  - `selection-actions.ts` -- select by type, name, expand
  - `property-actions.ts` -- set fill, opacity, rename
  - `tool-actions.ts` -- wrappers around existing tools (Phase 2)
- `src/app/tools/automations/executor.ts` -- sequential execution engine
- `src/app/views/automations-tool/AutomationsToolView.tsx` -- list + builder + step config UI

**Modified files:**

- `package.json` -- add menu entry for automations-tool
- `src/app/messages.ts` -- add AUTOMATIONS_* message types
- `src/app/run.ts` -- register automations tool
- `src/app/ui.tsx` -- add route for automations-tool
- `src/app/views/home/HomeView.tsx` -- add tool card (new "Automation" section)

## Design Principles Alignment

- Uses shared `ToolHeader`, `ToolBody`, `State` components
- Scope follows existing pattern (operates on current selection)
- Progress shown via incremental updates (step X of Y)
- Automation list uses `DataList`/`DataRow` components
- Save/Run as primary actions in fixed footer
- Empty state uses shared `State` component

## Risks and Mitigations

- **Action params complexity**: Each action type needs its own config form. Start with simple text/dropdown inputs; avoid overengineering.
- **Error handling**: If a step fails mid-automation, show which step failed and why, and offer "Continue from here" or "Stop."
- **Storage limits**: `clientStorage` is per-device and has size limits. Keep automation definitions small (params only, no data blobs).
- **Existing tool coupling**: Phase 2 actions need clean interfaces to existing tool logic. May require extracting "run" functions from existing `main-thread.ts` files into importable utilities.

