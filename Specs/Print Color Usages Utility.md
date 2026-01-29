## Print Color Usages Utility

### Original plugin
`../Print Color Usages`

### Persona (who it’s for)
- **Primary**: **Product designer** (quickly understand what colors are used in an icon/component)
- **Secondary**: **Design system maintainer** (audit “are these colors variable-based?” and spot inconsistencies)
- **Plugin owner**: supports reliable “print → update” workflow for repeatable audits

### Cases
- Audit icons/components during migration work
- See variable names + linked aliases + hex+opacity for a selection
- Keep printed labels up to date after token changes (Update)

### Category
Colors
Diagnostics
Variables

### What it does (plain language)
Analyzes your **current selection** and creates **Text layers** near it listing all **unique** colors used.

For each color, it prefers to show:
1) **Style names / variable names** (with optional “linked color” name)
2) Then raw **HEX (+ opacity %)** when no style/variable name applies

### Main workflow (as implemented)
- **Print** (headless command): runs immediately using saved settings and creates the labels.
- **Settings…**: opens UI to change:
  - label position (left/right, etc.)
  - show linked colors
  - hide folder prefixes (after `/`)
  - light/dark text theme
- **Update** (headless command): updates previously created labels (by stored Variable ID + optional mode info).

### Key mechanics / safety
- Uses `figma.clientStorage` to remember UI settings.
- When a label represents a Variable, it stores:
  - Variable ID in the text layer name/pluginData so “Update” can refresh reliably.
- Handles special cases:
  - If selection is inside an Instance, it anchors placement to the outer instance, but analyzes only the selected nodes.
  - Ignores non-visible layers/properties.

