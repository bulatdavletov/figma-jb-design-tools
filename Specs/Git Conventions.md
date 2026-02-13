# Git Conventions

## Commit Message Format

Always start with the **tool or component name**, followed by a colon and a short description:

```
ComponentOrTool: Short description
```

### Examples

Single-scope changes:

```
ColorSwatch: Fixed border
ColorRow: Auto-size button width based on label
ToolTabs: Remove bottom border from library Tabs
```

Multi-scope changes — list each component on its own line:

```
ColorRow: Auto-size button width
ToolTabs: Remove bottom border
VariablesReplaceUsagesToolView: Add example JSON download
```

### Rules

- First word after colon is capitalized
- No period at the end
- Keep the first line concise (under ~72 characters)
- Use the component/file name as it appears in the codebase (e.g. `ColorRow`, `ToolBody`, `ToolTabs`)
- For tool-level changes use the tool name (e.g. `View Colors Chain`, `Print Color Usages`)
- For shared infrastructure use the module name (e.g. `messages`, `run`)
- When many changes accumulate, split them into smaller, focused commits rather than one large commit — each commit should be easy to understand on its own
