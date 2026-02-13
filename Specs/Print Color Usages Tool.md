## Print Color Usages Tool

Original plugin `../Print Color Usages`

### Persona (who it’s for)
- **Primary**: **Product designer** (quickly understand what colors are used in an icon/component)
- **Secondary**: **Design system maintainer** (audit “are these colors variable-based?” and spot inconsistencies)
- **Plugin owner**: supports reliable “print → update” workflow for repeatable audits

### Cases
- Write down color usages for developers during design handoff.
- Print color usages for variables description in main UI Kit.
- Keep printed labels up to date after token changes (update).

### Category
Colors
Variables
Documentation

### What it does (plain language)
Print:
- Analyzes your **current selection** and creates **Text layers** near it with all **unique** colors used.
- If selection contains nodes inside instances, analysis is grouped by outermost selected instance context.
- If no colors are found, tool shows a notification and does not create fallback text layers.

Label text priority:
1) **Style names / variable names**
2) Optional linked color info (for aliases, when enabled)
3) Raw **HEX (+ opacity %)** when style/variable naming is not available

Update:
- Works from **Update** tab with a **preview-before-apply** flow.
- Resolves target variable in this order:
  1) VariableID in layer name (the layer name is the single source of truth)
  2) Variable name from layer name
  3) (Only when "Check by content" is ON) Text content fallback: match primary text to variable name
- **No plugin data** -- the tool no longer reads or writes `pcu_variableId` / `pcu_variableCollectionId` / `pcu_variableModeId`. Layer name is the single source of truth.
- Can update **selection scope**, **current page scope**, or **all pages scope**.
- Apply can target **all preview rows** or only **selected preview rows**.

### Color Application
- Color application uses the same **page-mode-setting mechanism** as Mockup Markup tool.
- Before applying variable-bound fills, the tool re-asserts the current page's explicit variable mode for the variable's collection. This triggers Figma to properly resolve the variable fill, preventing stale/dark text.
- After applying fills, the tool verifies that the fill binding is correct.

### Terminology
- **Main color**: The first (primary) color in the label -- the variable's own name.
- **Linked color**: The second (secondary) color after the separator -- the alias-target variable name.

### Check by Content
- Checkbox in the Update tab, **off by default**.
- When ON, enables an additional fallback: if the layer name doesn't resolve to a variable, the tool tries to match the text content to a variable name.
- **Mismatch detection**: When content resolves to a different variable than the layer name, the preview shows a warning: "Layer name points to X but text content matches Y".

### Workflows
**Print**:
I need to create text labels for the colors used in the selection.
I open the Print Color Usages tool.
The Print tab shows a **live preview** of what would be printed (auto-updates on selection change).
Each row shows: variable name (label text), future layer name (VariableID), and a Copy button.
I press the Print button to actually create the text layers.

**Update**:
I need to update previously printed text labels.
I open the Print Color Usages tool, Update tab.
I press the Check changes button.
Tool shows **progress text** ("Checking… 15/200 layers") during the operation.
Tool gives me a preview of text/layer-name changes with per-row details.
Badges: "Main color" for text changes, "Linked color" for linked color changes.
I can review rows, keep all, or unselect some rows.
I press Apply in Selection (if selection exists) or Apply on Page (if selection is empty).
Tool updates only selected preview rows in the active scope.

