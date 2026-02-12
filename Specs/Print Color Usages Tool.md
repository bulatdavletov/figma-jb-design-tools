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
  1) plugin data saved on printed layer (internal metadata key `pcu_variableId` written by this tool)
  2) VariableID in layer name
  3) variable name from layer name
  4) fallback: variable name from text content
- Can update **selection scope** or **current page scope** (when selection is empty).
- Apply can target **all preview rows** or only **selected preview rows**.

### Workflows
**Print**:
I need to create text labels for the colors used in the selection.
I open the Print Color Usages tool.
And just press the Print button.
Tool creates text labels for the unique colors used in the selection.

**Update**:
I need to update previously printed text labels.
I open the Print Color Usages tool, Update tab.
I press the Check changes button.
Tool gives me a preview of text/layer-name changes with per-row details.
I can review rows, keep all, or unselect some rows.
I press Apply in Selection (if selection exists) or Apply on Page (if selection is empty).
Tool updates only selected preview rows in the active scope.

