# Automations Tool

Create automations like Apple Shortcuts, but for Figma. Chain actions together, save them, share as JSON, rerun with one click.

[Implementation Plan](../.cursor/plans/automations_tool_409706d6.plan.md)

---
## Principles

### Figma-First Design
Align with Figma Data Structure.
Primitive actions should map directly to Figma API operations using Figma's property names as param keys. 
Action labels use human-friendly terms. 
Compound actions combine primitives for convenience and are clearly distinguished. 
The goal: never invent an abstraction when Figma already has the concept.

---

I want to create Automation tool, where I can create automations, like Apple Shortcuts, but for Figma.

The thing is: I don't want to search for plugin every time.
I want to create my own automations.

Let's think how to do it. What i need for that.

List of actions from Figma API

List of Object types

List of actions in Automations tool

Automations should be exportable/importable as JSON files (for sharing between team members or across devices).

[Plan](../.cursor/plans/automations_tool_409706d6.plan.md)

UI:
This tool requires lot's of space, but our plugin is quite narrow.
We need to come up with the way to resize plugin window, to increase it.

Several columns, Like apple shortcuts:
Left side for steps. Right side is dynamic: if nothing selected - for available actions. If step selected - for parameters.

When plugin finishes - there should be way to show output inside plugin window.

---

Idea: where to get ideas for actions for Automations plugin:
Try to replace some plugins with automations.

Many paster:
- Ask for text
- Choose what to do if amount of lines ends faster than amount of selected texts. Repeat list or not?
- Split text into lines
- Repeat with each line
  - selected text content [N] = line [N]
  - if repeat list = true
    somehow start list of line from index 0

Resize to parents width, height, or both
- Choose: width, height, or both
- Find parent node
- Check it's size
- Set size of selected node to parent's size

Add autolayout to each:
- Get selection nodes
- For each node
  - Add autolayout

Print color usages
- Find all unique colors used in selection
  - Find all layers
  - Extract all colors used in layers
  - Dedupliacte list of colors
- For every color
  - Create a text layer with color as content
  - Place near selected node

---

## Core Idea

Instead of searching for a plugin or doing repetitive manual steps every time, build your own named automations. Each automation is a sequence of steps. Steps flow data from one to the next — like a pipeline.

---

## The Pipeline Model

Every automation is a pipeline. Data flows through it step by step.

```
[Source] → [Filter] → [Filter] → [Action] → [Action] → [Output]
```

### The Context

Each step receives a **context** and returns a (possibly modified) context. The context is the "working set" — what the automation is currently operating on.

```
Context {
  nodes: SceneNode[]          — the current working set of layers
  variables: Variable[]       — optional, for variable-centric flows
  styles: BaseStyle[]         — optional, for style-centric flows
  log: string[]               — accumulated messages from steps
}
```

**Default starting context:** the user's current selection (or entire page if nothing selected, depending on scope choice).

### How Steps Connect

Each step:
1. Receives the context from the previous step
2. Does its work (filter, transform, read, create)
3. Passes the (possibly modified) context to the next step

This means **order matters**. Filtering first, then acting, is the natural pattern:

```
Example: "Make all text layers on this page semi-transparent"

Step 1: Source — Current page (all children)
Step 2: Filter by type — Keep only TEXT nodes
Step 3: Set opacity — 0.5
Result: All text layers on the page are now 50% transparent
```

### Step Categories

Every step falls into one of these categories:

| Category | What it does | Effect on context |
|----------|-------------|-------------------|
| **Source** | Sets the initial working set | Replaces `nodes` (or `variables`/`styles`) |
| **Filter** | Narrows the working set | Removes items from `nodes` |
| **Navigate** | Moves through the node tree | Replaces `nodes` with children/parents |
| **Transform** | Modifies properties on current nodes | Keeps `nodes`, changes their properties |
| **Create** | Adds new nodes to the document | Adds to `nodes` |
| **Output** | Reports or finalizes | Adds to `log`, may select nodes |

---

## Object Types as Targets

Not every action works on every object type. The automation builder must know what's valid.

### Node Types (what lives on the canvas)

| Type | String | Supports fills | Supports text | Is container | Has instances | Automation relevance |
|------|--------|---------------|--------------|-------------|--------------|---------------------|
| FrameNode | `"FRAME"` | yes | — | yes | — | Very common target. Artboards, cards, sections. |
| GroupNode | `"GROUP"` | — | — | yes | — | Navigate into to reach children. |
| ComponentNode | `"COMPONENT"` | yes | — | yes | — | Modify component definitions. |
| ComponentSetNode | `"COMPONENT_SET"` | — | — | yes | — | Variant containers. Usually navigate into. |
| InstanceNode | `"INSTANCE"` | yes | — | yes | yes | Swap, detach, read overrides. Very common. |
| RectangleNode | `"RECTANGLE"` | yes | — | — | — | Set fills, strokes, effects. |
| EllipseNode | `"ELLIPSE"` | yes | — | — | — | Set fills, strokes, effects. |
| LineNode | `"LINE"` | — | — | — | — | Set strokes. |
| PolygonNode | `"POLYGON"` | yes | — | — | — | Set fills, strokes, effects. |
| StarNode | `"STAR"` | yes | — | — | — | Set fills, strokes, effects. |
| VectorNode | `"VECTOR"` | yes | — | — | — | Set fills, strokes, effects. |
| TextNode | `"TEXT"` | yes | yes | — | — | Text content, font, color. Very common. |
| BooleanOperationNode | `"BOOLEAN_OPERATION"` | yes | — | yes | — | Set fills on boolean groups. |
| SectionNode | `"SECTION"` | — | — | yes | — | Navigate into. |
| SliceNode | `"SLICE"` | — | — | — | — | Export only. |

### Non-Node Resources (document-level)

These can also be targets of automation steps, but they flow through the `variables` or `styles` field of the context — not `nodes`.

| Resource | What it is | Automation relevance |
|----------|-----------|---------------------|
| Variable | Named value (Color, Number, Boolean, String) | Rename, create, rebind, inspect chains |
| VariableCollection | Group of variables with modes | Iterate variables, switch modes |
| PaintStyle | Reusable color/gradient | Apply to nodes, rename, create |
| TextStyle | Reusable typography | Apply to text nodes, rename |
| EffectStyle | Reusable shadow/blur | Apply to nodes |

---

## Action Catalog

All available automation actions, organized by category. Each action specifies:
- **What it does** (plain language)
- **Works on** (which object types / context fields)
- **Parameters** (what the user configures)
- **Context effect** (how it changes the pipeline context)

### Source Actions (set the starting working set)

| Action | Description | Parameters | Context effect |
|--------|-------------|-----------|----------------|
| **From selection** | Start with whatever the user has selected | — | `nodes` = current selection |
| **From current page** | Start with all nodes on the current page | — | `nodes` = all page children (flat or deep) |
| **From all pages** | Start with all nodes in the document | — | `nodes` = all nodes across all pages |
| **From page by name** | Start with nodes on a specific page | `pageName`: string pattern | `nodes` = matching page's children |
| **From local variables** | Start with local variables | `type?`: COLOR / FLOAT / STRING / BOOLEAN, `collection?`: name pattern | `variables` = matching local variables |
| **From local styles** | Start with local styles | `kind`: paint / text / effect / grid | `styles` = matching local styles |

### Filter Actions (narrow the working set)

| Action | Description | Parameters | Context effect |
|--------|-------------|-----------|----------------|
| **Filter by type** | Keep only nodes of a specific type | `nodeType`: FRAME, TEXT, INSTANCE, etc. | Removes non-matching from `nodes` |
| **Filter by name** | Keep nodes matching a name pattern | `pattern`: string, `mode`: contains / starts with / ends with / regex | Removes non-matching from `nodes` |
| **Filter by fill color** | Keep nodes that have a specific fill color | `hex`: color value, `tolerance?`: 0–100 | Removes non-matching from `nodes` |
| **Filter by fill variable** | Keep nodes whose fill is bound to a specific variable | `variableName`: string pattern | Removes non-matching from `nodes` |
| **Filter by fill style** | Keep nodes using a specific paint style | `styleName`: string pattern | Removes non-matching from `nodes` |
| **Filter by text style** | Keep text nodes using a specific text style | `styleName`: string pattern | Removes non-matching from `nodes` |
| **Filter by component** | Keep instances of a specific component | `componentName`: string pattern | Removes non-matching from `nodes` |
| **Filter visible only** | Keep only visible nodes | — | Removes hidden from `nodes` |
| **Filter by has variable** | Keep nodes that have any variable binding | `property?`: fill / stroke / any | Removes non-matching from `nodes` |
| **Filter by has style** | Keep nodes that have any style applied | `property?`: fill / stroke / text / effect / any | Removes non-matching from `nodes` |
| **Filter variables by name** | Narrow variable list by name pattern | `pattern`: string, `mode`: contains / regex | Removes non-matching from `variables` |
| **Filter variables by collection** | Keep variables from specific collection | `collectionName`: string pattern | Removes non-matching from `variables` |

### Navigate Actions (move through the tree)

| Action | Description | Parameters | Context effect |
|--------|-------------|-----------|----------------|
| **Expand to children** | Replace each node with its direct children | `deep?`: boolean (recursive or one level) | `nodes` = children of current nodes |
| **Go to parent** | Replace each node with its parent | `deduplicate`: true | `nodes` = unique parents |
| **Flatten descendants** | Replace with all descendants (deep traversal) | — | `nodes` = all nested children, flat list |
| **Enter instances** | For each instance, replace with its children (inner tree) | — | `nodes` = children inside instances |

### Transform Actions — Properties (modify nodes)

| Action | Description | Works on | Parameters |
|--------|-------------|---------|-----------|
| **Set fill color** | Set fill to a solid hex color | Nodes with fills | `hex`: color value |
| **Set fill variable** | Bind fill to a color variable | Nodes with fills | `variableName`: string (or `variableId`) |
| **Set fill style** | Apply a paint style | Nodes with fills | `styleName`: string (or `styleId`) |
| **Set stroke color** | Set stroke to a solid hex color | Nodes with strokes | `hex`: color value |
| **Set stroke variable** | Bind stroke to a color variable | Nodes with strokes | `variableName`: string |
| **Remove fills** | Clear all fills | Nodes with fills | — |
| **Remove strokes** | Clear all strokes | Nodes with strokes | — |
| **Set opacity** | Change opacity | Any SceneNode | `value`: 0–1 |
| **Set visibility** | Show or hide | Any SceneNode | `visible`: boolean |
| **Set locked** | Lock or unlock | Any SceneNode | `locked`: boolean |
| **Rename layers** | Find/replace in layer names | Any SceneNode | `find`: string, `replace`: string, `mode`: contains / regex |
| **Set name** | Set exact layer name | Any SceneNode | `name`: string (supports `{index}`, `{type}` tokens) |
| **Resize** | Set width and/or height | Any SceneNode | `width?`: number, `height?`: number |
| **Set position** | Move to x, y coordinates | Any SceneNode | `x?`: number, `y?`: number |
| **Set rotation** | Set rotation angle | Any SceneNode | `degrees`: number |
| **Remove node** | Delete from document | Any SceneNode | — (careful: destructive) |
| **Clone node** | Duplicate | Any SceneNode | — |
| **Set effect style** | Apply an effect style | Nodes with effects | `styleName`: string |
| **Remove effects** | Clear all effects | Nodes with effects | — |

### Transform Actions — Text (text-specific)

| Action | Description | Parameters |
|--------|-------------|-----------|
| **Set text content** | Replace text characters | `text`: string (supports `{original}`, `{name}` tokens) |
| **Set font** | Change font family and style | `family`: string, `style`: string |
| **Set font size** | Change font size | `size`: number |
| **Set text alignment** | Change horizontal alignment | `align`: LEFT / CENTER / RIGHT / JUSTIFIED |
| **Set text case** | Change text case | `case`: ORIGINAL / UPPER / LOWER / TITLE |
| **Set text decoration** | Underline or strikethrough | `decoration`: NONE / UNDERLINE / STRIKETHROUGH |
| **Set text style** | Apply a text style | `styleName`: string |
| **Set line height** | Change line height | `value`: number, `unit`: PIXELS / PERCENT / AUTO |

### Transform Actions — Components (instance-specific)

| Action | Description | Parameters |
|--------|-------------|-----------|
| **Swap component** | Replace instance's component | `componentKey`: string (team library key) or `componentName`: string |
| **Detach instance** | Convert instance to frame | — |
| **Set component properties** | Change instance overrides | `properties`: key-value pairs |
| **Reset overrides** | Reset all overrides to main component defaults | — |

### Transform Actions — Variables (operate on the `variables` list)

| Action | Description | Parameters |
|--------|-------------|-----------|
| **Rename variables** | Find/replace in variable names | `find`: string, `replace`: string, `mode`: contains / regex |
| **Set variable value** | Set a value for a specific mode | `modeId`: string, `value`: color/number/boolean/string |
| **Create variable alias** | Set variable to reference another variable | `targetVariableName`: string, `modeId?`: string |
| **Delete variables** | Remove variables from collection | — (careful: destructive) |

### Transform Actions — Styles (operate on the `styles` list)

| Action | Description | Parameters |
|--------|-------------|-----------|
| **Rename styles** | Find/replace in style names | `find`: string, `replace`: string |
| **Delete styles** | Remove styles | — (careful: destructive) |

### Layout Actions (auto-layout specific)

| Action | Description | Parameters |
|--------|-------------|-----------|
| **Set auto layout** | Enable/change auto layout | `direction`: HORIZONTAL / VERTICAL / NONE |
| **Set padding** | Set auto layout padding | `top?`, `right?`, `bottom?`, `left?`: numbers |
| **Set item spacing** | Set gap between children | `spacing`: number |
| **Set sizing** | Set primary/counter axis sizing | `primary?`: FIXED / AUTO, `counter?`: FIXED / AUTO |

### Output Actions (finalize / report)

| Action | Description | Parameters |
|--------|-------------|-----------|
| **Select results** | Set Figma selection to current nodes | `scrollTo?`: boolean |
| **Notify** | Show a Figma toast notification | `message`: string (supports `{count}` token) |
| **Log** | Add message to automation run log | `message`: string |
| **Count** | Log the count of items in context | `label?`: string |
| **Export nodes** | Export current nodes as PNG/SVG/PDF | `format`: PNG / SVG / JPG / PDF, `scale?`: number |

### High-Level Tool Wrappers (Phase 2)

These wrap existing plugin tools as single automation steps:

| Action | Wraps tool | Parameters |
|--------|-----------|-----------|
| **Print color usages** | Print Color Usages Tool | `theme?`: dark / light |
| **Update printed colors** | Print Color Usages (Update) | `checkByContent?`: boolean |
| **Replace variable usages** | Replace Variable Usages Tool | `source`: variable name, `target`: variable name |
| **Apply mockup markup** | Mockup Markup Tool | `preset`: preset name |
| **Library swap** | Library Swap Tool | `mappingSource?`: built-in / custom JSON |
| **Find color match** | Find Color Match Tool | `hex`: color, `collection?`: name |

---

## Object-Action Compatibility

Not all actions make sense for all object types. The builder UI should only show valid actions for the current context.

### Which node types support which properties

| Property | FRAME | GROUP | COMPONENT | INSTANCE | RECTANGLE | ELLIPSE | TEXT | VECTOR | LINE | BOOLEAN_OP | SECTION |
|----------|-------|-------|-----------|----------|-----------|---------|------|--------|------|-----------|---------|
| fills | yes | — | yes | yes | yes | yes | yes | yes | — | yes | — |
| strokes | yes | — | yes | yes | yes | yes | yes | yes | yes | yes | — |
| effects | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes | — |
| opacity | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes |
| visibility | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes |
| text content | — | — | — | — | — | — | yes | — | — | — | — |
| auto layout | yes | — | yes | — | — | — | — | — | — | — | — |
| swap component | — | — | — | yes | — | — | — | — | — | — | — |
| children | yes | yes | yes | yes | — | — | — | — | — | yes | yes |

### Context type determines available actions

| Context contains | Available action categories |
|-----------------|---------------------------|
| `nodes` (any) | Source, Filter (node-based), Navigate, Transform (properties), Output |
| `nodes` (TextNode only) | + Transform (text) |
| `nodes` (InstanceNode only) | + Transform (components) |
| `nodes` (FrameNode/ComponentNode) | + Layout |
| `variables` | Filter (variable-based), Transform (variables), Output |
| `styles` | Filter (style-based), Transform (styles), Output |

The builder UI should:
- **Show all actions** in the picker, but gray out incompatible ones
- **Show a warning badge** on a step if the previous step's output type doesn't match
- **Auto-suggest** relevant filters after a Source step (e.g., after "From current page" suggest "Filter by type")

---

## How Types and Actions Connect — Practical Examples

### Example 1: "Clean up text layers"

Goal: Find all text layers named "Label" on the page, rename them to "Label/{index}", set font size to 14.

```
Step 1: Source — From current page
Step 2: Filter by type — TEXT
Step 3: Filter by name — contains "Label"
Step 4: Set font size — 14
Step 5: Rename layers — pattern "Label/{index}"
Step 6: Notify — "Updated {count} text layers"
```

Context flow:
```
[All page nodes: 500] → [Only TEXT: 80] → [Named "Label": 12] → [Font=14: 12] → [Renamed: 12] → [Toast: "Updated 12 text layers"]
```

### Example 2: "Replace old color variable"

Goal: Find all nodes using `old/brand/primary` variable and rebind to `brand/primary`.

```
Step 1: Source — From current page
Step 2: Flatten descendants (deep traversal)
Step 3: Filter by fill variable — "old/brand/primary"
Step 4: Set fill variable — "brand/primary"
Step 5: Select results — scroll to first
Step 6: Notify — "Rebound {count} nodes"
```

### Example 3: "Prepare migration report"

Goal: Count how many instances of old library components exist per page.

```
Step 1: Source — From all pages
Step 2: Filter by type — INSTANCE
Step 3: Filter by component — starts with "Old UI Kit/"
Step 4: Count — "Old components found"
Step 5: Select results
```

### Example 4: "Batch variable rename"

Goal: Rename all color variables in "Semantic" collection from `color/` prefix to `sem/`.

```
Step 1: Source — From local variables (type: COLOR)
Step 2: Filter variables by collection — "Semantic"
Step 3: Filter variables by name — starts with "color/"
Step 4: Rename variables — find "color/", replace "sem/"
Step 5: Notify — "Renamed {count} variables"
```

### Example 5: "Apply consistent styling to selection"

Goal: For all frames in selection, set padding to 16, item spacing to 8, add a specific fill color.

```
Step 1: Source — From selection
Step 2: Filter by type — FRAME
Step 3: Set auto layout — VERTICAL
Step 4: Set padding — top: 16, right: 16, bottom: 16, left: 16
Step 5: Set item spacing — 8
Step 6: Set fill color — #FFFFFF
Step 7: Notify — "Styled {count} frames"
```

### Example 6: "Detach all instances of a deprecated component"

```
Step 1: Source — From current page
Step 2: Flatten descendants
Step 3: Filter by type — INSTANCE
Step 4: Filter by component — "DeprecatedButton"
Step 5: Detach instance
Step 6: Notify — "Detached {count} instances"
```

---

## JSON Format

Automations are exportable/importable as JSON for sharing between team members.

```json
{
  "version": 1,
  "automation": {
    "name": "Clean up text layers",
    "steps": [
      {
        "actionType": "sourceFromPage",
        "params": {},
        "enabled": true
      },
      {
        "actionType": "filterByType",
        "params": { "nodeType": "TEXT" },
        "enabled": true
      },
      {
        "actionType": "filterByName",
        "params": { "pattern": "Label", "mode": "contains" },
        "enabled": true
      },
      {
        "actionType": "setFontSize",
        "params": { "size": 14 },
        "enabled": true
      },
      {
        "actionType": "renameLayers",
        "params": { "find": ".*", "replace": "Label/{index}", "mode": "regex" },
        "enabled": true
      },
      {
        "actionType": "notify",
        "params": { "message": "Updated {count} text layers" },
        "enabled": true
      }
    ]
  }
}
```

---

## UI

### Layout

The plugin window is narrow. This tool needs more space.

- **Resize the plugin window** when Automations tool is active (use `figma.ui.resize()`)
- **Two-column layout** (like Apple Shortcuts):
  - Left: step list (the pipeline)
  - Right: dynamic panel
    - If no step selected → action picker (browse/search actions by category)
    - If step selected → parameter configuration form for that step

### Screens

**Screen 1: Automation List** (default)
- Saved automations (name, step count, last run)
- Each row: Run, Edit, Export, Delete
- Bottom: New + Import buttons
- Empty state when no automations

**Screen 2: Automation Builder** (two-column)
- Left: ordered step list with drag reorder, enable/disable toggle per step, remove button
- Right: action picker or step config
- Bottom sticky footer: Save + Run buttons
- Name field at the top

**Screen 3: Run Output**
- After automation completes: show accumulated log
- Step-by-step summary: step name, items processed, status (success/skip/error)
- "Done" or error state with which step failed

### Action Picker Organization

Actions in the picker should be organized by category with clear icons:

| Category | Icon idea | Actions count |
|----------|----------|---------------|
| Source | Target/scope icon | 6 |
| Filter | Funnel icon | 12 |
| Navigate | Tree/arrow icon | 4 |
| Properties | Brush/settings icon | 17 |
| Text | Text icon | 8 |
| Components | Component icon | 4 |
| Variables | Variable icon | 4 |
| Styles | Style icon | 2 |
| Layout | Grid/layout icon | 4 |
| Output | Export/bell icon | 5 |
| Tool wrappers | Plugin icon | 6 |

---

## Execution Engine

### Sequential, context-passing

```
function runAutomation(automation, initialContext):
  context = initialContext
  for each step in automation.steps:
    if step.enabled:
      context = await executeStep(step, context)
      postProgress(step.index, step.name, context.nodes.length)
      yield()  // let UI update
  return context.log
```

### Error Handling

- If a step fails: stop execution, report which step failed and why
- User can choose: "Fix and retry from this step" or "Cancel"
- Steps before the failure have already applied their changes (remind user about Figma Undo)

### Dry Run / Preview

For safety (aligning with Design Principles — preview before apply):
- **Preview mode**: run all steps but don't apply transforms. Only filters and navigations execute. Show "would affect N nodes" for each transform step.
- **Apply mode**: actually execute transforms.

---

## Expressions and Pipeline Variables

### The problem

Currently, action parameters are static — you type a fixed string, a fixed number. But real workflows need dynamic values:

- **Append text to a layer name** — not find/replace, but "take current name and add ' (deprecated)' to the end"
- **Read a property from one node and set it on another** — "copy this frame's width and set it as that frame's width"
- **Use a node's property in a notification** — "Processed layer: {name}, opacity was {opacity}"
- **Math** — "set opacity to current opacity × 0.5"

Without this, automations are limited to hardcoded values. With it, automations become truly programmable.

### Expression tokens

Any text parameter can contain `{token}` expressions that resolve at runtime against the current node being processed.

**Node property tokens:**

| Token | Resolves to | Example |
|-------|------------|---------|
| `{name}` | Current node's name | `Button`, `Frame 42` |
| `{type}` | Node type string | `TEXT`, `FRAME`, `INSTANCE` |
| `{index}` | Position in the current working set (0-based) | `0`, `1`, `2` |
| `{count}` | Total items in working set | `15` |
| `{width}` | Node width | `200` |
| `{height}` | Node height | `100` |
| `{opacity}` | Node opacity (0–1) | `0.5` |
| `{x}` | X position | `120` |
| `{y}` | Y position | `340` |
| `{fillHex}` | First fill's hex color | `#FF0000` |
| `{componentName}` | Main component name (instances) | `Button/Primary` |
| `{pageName}` | Containing page's name | `Dashboard` |
| `{id}` | Node ID | `123:456` |

**Usage examples:**

| Action | Parameter | Expression | Result |
|--------|-----------|-----------|--------|
| Set name | name | `{name} (old)` | `Button (old)` |
| Set name | name | `{type}/{name}` | `TEXT/Label` |
| Set name | name | `Item {index}` | `Item 0`, `Item 1`, ... |
| Notify | message | `Done: {count} layers` | `Done: 15 layers` |
| Log | message | `{name}: {fillHex}` | `Card: #FFFFFF` |

### Pipeline variables (store and reuse values across steps)

For cross-step data flow, introduce **pipeline variables** — named values that steps can write and later steps can read. Prefix: `$`.

**New actions:**

| Action | Category | Description | Parameters |
|--------|----------|-------------|-----------|
| **Set variable** | Transform | Store a value for later use | `variableName`: string, `value`: expression |
| **Set variable from property** | Transform | Read a property from current node(s) and store it | `variableName`: string, `property`: name / type / width / height / opacity / fillHex / ... |

**Reading pipeline variables in expressions:** `{$myVar}`

**Example: Copy width from one frame to another**

```
Step 1: Source — From selection
Step 2: Filter by name — "Source Frame"
Step 3: Set variable from property — $sourceWidth = {width}
Step 4: Source — From selection (resets working set)
Step 5: Filter by name — "Target Frame"
Step 6: Resize — width: {$sourceWidth}
Step 7: Notify — "Set width to {$sourceWidth}"
```

**Example: Append text to all layer names**

```
Step 1: Source — From selection
Step 2: Set name — "{name} - Copy"
Step 3: Notify — "Renamed {count} layers"
```

**Example: Tag layers with their type**

```
Step 1: Source — From current page
Step 2: Flatten descendants
Step 3: Set name — "[{type}] {name}"
Step 4: Notify — "Tagged {count} layers"
```

### String operations (future)

For more complex transformations, consider built-in string functions:

| Function | Example | Result |
|----------|---------|--------|
| `{name\|upper}` | `button` → `BUTTON` |
| `{name\|lower}` | `MyFrame` → `myframe` |
| `{name\|trim}` | `" hello "` → `"hello"` |
| `{name\|replace:old:new}` | `old-button` → `new-button` |
| `{name\|slice:0:5}` | `ButtonPrimary` → `Butto` |
| `{width\|round}` | `199.7` → `200` |

### Implementation notes

- Expression resolution happens in the executor, not in individual actions. Each action receives already-resolved parameter values.
- Pipeline variables live in the `AutomationContext` alongside `nodes`, `variables`, `styles`, `log`:
  ```
  Context {
    nodes: SceneNode[]
    variables: Variable[]
    styles: BaseStyle[]
    log: string[]
    pipelineVars: Record<string, string | number | boolean>
  }
  ```
- Token resolution iterates over `{...}` patterns in string params. Unknown tokens resolve to empty string with a warning in the log.
- For actions that operate on multiple nodes (like "Set name"), tokens resolve per-node — each node gets its own `{name}`, `{index}`, etc.
- Pipeline variables (`$`) resolve once from `context.pipelineVars` (same value for all nodes in that step).

---

## Implementation Progress

### What's built (Phase 1 — initial, 2026-02-19)

Skeleton of the tool is working. 8 basic actions, flat execution model, single-column UI.

**Files created:**
- `src/automations-tool/main.ts` — entry point
- `src/app/tools/automations/types.ts` — types + action definitions
- `src/app/tools/automations/storage.ts` — clientStorage CRUD + JSON export/import
- `src/app/tools/automations/actions/selection-actions.ts` — selectByType, selectByName, expandToChildren
- `src/app/tools/automations/actions/property-actions.ts` — renameLayers, setFillColor, setFillVariable, setOpacity, notify
- `src/app/tools/automations/executor.ts` — sequential execution with progress + stop
- `src/app/tools/automations/main-thread.ts` — message handler (CRUD + run + stop)
- `src/app/views/automations-tool/AutomationsToolView.tsx` — UI (list, builder, step config screens)

**What works:**
- Create / edit / delete / duplicate automations
- Add / remove / reorder / enable-disable steps
- Action picker with all 8 actions
- Per-step config forms
- Run with progress indicator (step X of Y)
- Stop mid-execution
- JSON export / import for sharing
- Saved to `figma.clientStorage` under `"automations_v1"`

**Architectural gaps vs. this spec:**
- **No Context object** — current implementation manipulates Figma's canvas selection directly instead of passing a `Context { nodes, variables, styles, log }` between steps. This blocks variable-centric flows, accumulated log, `{count}` tokens, and dry run.
- **No plugin window resize** — everything is squeezed into the narrow plugin column.
- **No two-column layout** — uses separate screens (list → builder → step config) instead of the Apple Shortcuts side-by-side design.
- **No Run Output screen** — result is shown as a simple toast, not a step-by-step log.
- **Flat action list** — no Source/Filter/Navigate/Transform/Output categories, no action compatibility checks.
- **Old action names** — `selectByType` instead of `filterByType`, etc.

---

## Implementation Phases

### Phase 1.5 — Architecture refactor (next)

Rework the foundation before adding more actions. Goal: match this spec's pipeline model.

1. **Introduce Context model + expression tokens**
   - Create `AutomationContext { nodes, variables, styles, log, pipelineVars }` type
   - Update executor to pass context between steps
   - Migrate all 8 existing actions to receive/return `AutomationContext`
   - Implement expression token resolver (`{name}`, `{type}`, `{index}`, `{count}`, etc.)
   - Apply token resolution to all string params before passing to actions
   - Add pipeline variable actions: "Set variable", "Set variable from property"

2. **Plugin window resize + two-column UI**
   - `figma.ui.resize(width, height)` when Automations tool activates
   - Restore original size when navigating away
   - Left column: step list (pipeline view)
   - Right column: action picker (when no step selected) or parameter config (when step selected)

3. **Action categories and naming**
   - Rename actions to match spec (`selectByType` → `filterByType`, etc.)
   - Add Source category (`sourceFromSelection`, `sourceFromPage`)
   - Organize action picker by category with headers
   - Migration: update stored automations on load (old action names → new names)

4. **Run Output screen**
   - Show accumulated `context.log` after execution
   - Per-step summary: step name, items processed, status (success / skip / error)
   - Replace toast-only result display

### Phase 2 — Extended actions + tool wrappers
- All remaining filter actions (by variable, by style, by component, by color)
- All remaining transform actions (text, components, variables, styles, layout)
- Navigate actions: go to parent, flatten descendants, enter instances
- Source actions: from all pages, from page by name, from local variables, from local styles
- Tool wrapper actions (Print Colors, Library Swap, Replace Usages, etc.)
- Object-action compatibility checks in the builder UI
- Dry run / preview mode

### Phase 3 — Advanced flow control
- Conditions (skip step if condition not met)
- Loops (for-each over current nodes)
- Keyboard shortcuts / menu commands for saved automations
- Automation templates (pre-built common workflows)