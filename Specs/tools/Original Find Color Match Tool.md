## Find Color Match (aka “Find Color Variable Match”)

### Original plugin
`../ds-colors-cursor`

### Persona (who it’s for)
- **Primary**: **Design system maintainer** (token migration work: convert legacy colors/styles to variables safely)
- **Occasional**: **Product designer** (when working in legacy files and needing quick “make it variables” cleanup)

### Cases:
- Migration from old UI Kit to new one. Icons, colors to variables, components.

### Category:
Colors
Variables
Migration

### What it does (plain language)
Helps migrate **raw colors / paint styles** in your current selection to **local color variables**.

It:
- Scans your **current selection** and collects SOLID colors from:
  - **Fills** (non-text nodes)
  - **Strokes**
  - **Text fills**
- **Ignores** colors that are already:
  - Bound to a **variable**
  - Bound to a **paint style**
  - Hidden (hidden layers, hidden fills/strokes)
  - Inside **Union/Subtract** boolean operation children (not visible)
- Builds a list of **local color variables** from the file (including variable **alias chains** → resolves to final HEX)
- Suggests the **closest variable match** for each found color (RGB distance + extra “semantic” scoring rules)
- Lets you override the suggestion per-row, then **Apply colors** to bind paints to the chosen variables

### Main workflow in the UI
- **Mode selector** (“All modes” / specific mode): filters variables by mode/theme.
- **Filter selector** (“All colors” / category): filters suggested variables by extracted category (from variable naming like `X/Y…`).
- **Selected Objects table**:
  - Shows color, node info, layer path, difference %, and a “map to variable” dropdown.
  - Clicking a **layer path** focuses the node in the canvas; plugin can **restore original selection** when applying.
- **Apply colors**: binds matched fills/strokes/text fills to variables (supports opacity).
- **Update selection**: re-scan current selection (manual refresh; no auto-sync).

### Remembers mappings & preferences
- Can **import/export** a `mappings*.yaml` file (plus an in-plugin “Edit Mappings” UI).
- Saves mappings and some preferences in Figma `clientStorage`, including **per-project mappings** (based on file identity).
- Supports rules that influence which variables are prioritized for **FILL/STROKE/TEXT** suggestions.
