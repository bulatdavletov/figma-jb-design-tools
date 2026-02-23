# Git Conventions

## Before commit
If changes worth to be mentioned in README.md, add/update it there.

## Commit Message Format

Always start with the **tool or component name**, followed by a colon and a short description:

Describe new functionality first, then changes, then fixes.

```
ComponentOrTool: Short description
```

### Examples

Single-scope changes:

```
ColorSwatch: Add swatch border for light themes
ColorRow: Change button to auto-size width based on label
ToolTabs: Fix bottom border missing from library Tabs
```

Multi-scope changes — list each component on its own line (group by type: new functionality, changes, then fixes):

```
VariablesReplaceUsagesToolView: Add example JSON download
ColorRow: Change button width auto-sizing
ToolTabs: Fix bottom border rendering
```

### Rules

- First word after colon is capitalized
- No period at the end
- Keep the first line concise (under ~72 characters)
- Use the component/file name as it appears in the codebase (e.g. `ColorRow`, `ToolBody`, `ToolTabs`)
- For tool-level changes use the tool name (e.g. `View Colors Chain`, `Print Color Usages`)
- For shared infrastructure use the module name (e.g. `messages`, `run`)
- When many changes accumulate, split them into smaller, focused commits rather than one large commit — each commit should be easy to understand on its own
