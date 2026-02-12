# Design Principles

## Goals
- Make every tool easy to understand
- Keep behavior predictable across all tools
- Avoid UI patterns that hide content or confuse selection state

## Layout and Scrolling
- Do not use nested scroll containers inside a tool body
- Prefer a single page/body scroll when needed
- Avoid horizontal scrolling in tables and lists; wrap text instead
- Use consistent spacing blocks between sections (`small`, `medium`, `large`)
- For `ToolBody` content with data, keep consistent vertical rhythm (same top/bottom spacing and explicit spacing between logical groups).

## Selection UX (Checkboxes)
- Always wrap checkbox labels in `<Text>` for alignment
- Use one parent checkbox for grouped child options.
- Parent checkbox states:
  - checked: all children selected
  - mixed: some children selected
  - unchecked: no children selected
- Indent child checkbox lists under parent for clear hierarchy.
- Add visible spacing between parent row and child rows.

## Selection UX (Segmented vs. Radios)
- Prefer Segmented Button groups over traditional Radio Buttons for mutually exclusive choices. Segmented Buttons are more modern, visually clear, and fit Figma/modern UI conventions.

## Actions and Buttons
- Prefer one clear primary action per section.
- Button labels should reflect result count when possible (example: `Export N files`).
- Disable actions when required input/selection is missing.
- Keep status and errors visible near the related action.

## Tool Behavior Heuristics
- For small (non-batch) utilities, do not use an explicit "inspect selection" button.
- Small utilities should auto-refresh when selection changes.
- For batch operations, always show a preview step before apply.
- Scope defaults should follow user intent:
  - if there is a selection, default scope to selection
  - if there is no selection, default scope to whole page

## Ordering and Data Consistency
- Preserve Figma order for collections and variables by default.
- Avoid extra alphabetical sorting unless explicitly requested by the user.
- Exported JSON should keep stable, predictable ordering that matches Figma as closely as possible.

## Cross-Tool Consistency
- Reuse shared layout and header patterns across tools.
- Use the same selection and empty-state patterns in all tools.
- Reuse the shared `State` empty-state component for no-selection/nothing-found states.
- For **No selection** state specifically, reuse the same centered `State` pattern (same icon family, tone, and concise guidance text) across tools.
- Keep wording and interaction patterns consistent (same terms for same actions).

## Quality Gate
- After UI changes, always run `npm run build`.
- Fix lint/type issues before finalizing.
