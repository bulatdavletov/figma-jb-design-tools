## Variables Rename Helper Tool

### Original plugin
`../variables-rename-helper`

### Persona (who it’s for)
- **Primary**: **Design system maintainer** (token naming migrations, bulk rename safely)
- **Secondary**: **Plugin owner / design ops** (repeatable rename/import/export, auditability)
- **Occasional**: **Product designer** (rare: fix a variable binding in a selection)

### Cases
- Token naming migration (old → new naming spec)
- Fixing “wrong variable bound” issues in a file/selection
- Exporting snapshots/mappings for review and re-apply later

### Category
Variables
Migration
Maintenance

### What it does (plain language)
An advanced helper for **inspecting variable usage in the current selection**, then:
- **Rename variables** (single or batch plans)
- **Rebind selection** to another existing variable
- **Create a new variable** linked (aliased) to an existing one
- **Import/Export** rename plans and variable snapshots for repeatable migrations

### Main UI areas (as implemented in the original plugin)
The UI is structured into 3 tabs:
- **Rename**: preview/apply rename plans
- **Export/Import**: export “name sets” and variable snapshots; preview/apply imports
- **Link**: create linked variables; apply an existing variable to selection; rename a variable directly

### Key mechanics / safety
- Starts from **selection analysis**: plugin scans selected nodes and collects variable bindings + raw colors used.
- Uses **preview** steps before applying imported rename plans / snapshots.
- Tracks outcomes with statuses like `rename`, `unchanged`, `conflict`, `missing`, etc.

