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

## Visual Alignment and Indentation
- Always be aware of the overall visual left indent for elements in your UI. If a header's button has an 8px left indent but does not have a background that clearly shows this indent, and an icon inside it has an additional 4px indent, the total perceived horizontal indent is 12px.
- It is important to know and check the overall left indent for content—ensure elements are visually aligned, not just mathematically.
- Content may have an indent of X, but make sure all children (and interactive elements) maintain the same perceived left edge where possible.
- Components with transparent backgrounds and colored hover states are especially tricky, as their visual indent can be less obvious; visually compensate for this to keep alignment consistent.

## Progress Feedback
- Always show progress feedback during operations that take more than a brief moment. Good progress UX reassures users that the tool is working, prevents doubt about failure/freeze, and helps set expectations about waiting.
- Whenever possible, prefer **numeric progress indicators** (such as "3 / 5 updated", or a percent/step bar) over spinners or indeterminate loaders. Numeric progress gives users concrete information on what’s left and enables better decisions if they want to cancel or wait. Spinners are less reassuring and do not communicate how long the process will take.
- Make progress visible and non-blocking where appropriate so users can retain context or cancel actions if supported.

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

## Progress & Yielding in Figma Plugins
- For operations that may take more than ~1 second, show incremental progress text in the plugin UI via `figma.ui.postMessage` (e.g., "Checking… 15/200 layers").
- Always yield (`await new Promise(resolve => setTimeout(resolve, 0))`) after posting status/progress messages -- Figma batches `postMessage` calls and only delivers them when the main thread yields. Without yielding, the UI never sees intermediate states.
- Do not use `figma.notify` for progress (it queues toasts that pile up). Reserve `figma.notify` for final results and errors.

## Copy Action Feedback
- Copy actions must use `IconButton` with a copy icon (not text buttons).
- On successful copy, temporarily replace the icon with a checkmark for 1.5 seconds.
- Always provide visual feedback on click -- never leave a click without response.
- Use the shared `CopyIconButton` component (`src/app/components/CopyIconButton.tsx`) for consistency.

## Data Lists and Tables
- Use the shared `DataList` container for card-style data lists (border, radius, row separators).
- Use `DataRow` for simple primary/secondary/tertiary data items with optional hover actions.
- Use `DataTable` for columnar data (Variables tools).
- Always include a header label above data (e.g. "Will be printed", "Changes found") so the user knows what they're looking at.
- Prefer concise row content over badges/tags -- let the data speak through diffs and structure, not decorative labels.

## Quality Gate
- After UI changes, always run `npm run build`.
- Fix lint/type issues before finalizing.
