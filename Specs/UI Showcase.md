# UI Showcase (Local Component Preview)

A standalone Vite app that renders plugin UI outside of Figma so you can iterate faster on components and screen states.

---

## How to Open

```bash
npm run preview
```

Starts Vite on `http://localhost:5173` (default) with hot reload.

---

## Navigation

The sidebar has two top-level sections:

- **Components**
  - `Overview` (all component demos)
  - Individual component pages (ToolCard, ToolTabs, DataTable, TokenInput, etc.)
- **Screens**
  - `Home Page` (real `HomeView` preview at **360x550**)
  - One page per tool, each showing multiple scenarios

### Tool pages

Each tool page renders the real tool view in multiple isolated iframes (one iframe per scenario).

- Default scenario frame size: **360x500**
- Scenario can override size via `scenario.size` (used by wider/taller screens like Automations builder)
- Frames are currently displayed in a vertical stack

---

## Shared Test Fixtures

Tool scenarios live in `src/test-fixtures/` (one file per tool), typed by `Scenario` in `src/test-fixtures/types.ts`.

```ts
type Scenario = {
  id: string
  label: string
  messages: MainToUiMessage[]
  props?: {
    initialSelectionEmpty?: boolean
    initialTab?: string
  }
  size?: { width: number; height: number }
}
```

Notes:
- `messages` are dispatched in order to reproduce a state.
- `props` are passed to the tool view.
- `size` allows per-scenario frame overrides.

---

## How to Add a New Tool State

1. Open `src/test-fixtures/<tool>.ts`.
2. Add a new `Scenario` item to `scenarios`.
3. Save — the state appears automatically on that tool page.

---

## How to Add a New Component Demo

1. Import the component in `src/ui-showcase/preview-app.tsx`.
2. Add a showcase section/component entry to `componentShowcases`.
3. Save and verify in the browser.

---

## Architecture

```
src/ui-showcase/
  index.html                 ← Vite HTML entry
  main.tsx                   ← chooses PreviewApp vs IsolatedToolView
  preview-app.tsx            ← sidebar + pages
  mock-message-bus.ts        ← dispatches mocked Main→UI messages
  showcase-tool-registry.ts  ← maps tool IDs to view loaders + scenarios
  ToolPreview.tsx            ← renders scenario iframes for a tool
  IsolatedToolView.tsx       ← single isolated renderer (?isolated=1)

src/test-fixtures/
  types.ts                   ← Scenario type
  color-chain.ts
  mockup-markup.ts
  ...
```

Isolation URL format:
- Tool scenario: `/?isolated=1&tool=<toolId>&scenario=<scenarioId>&theme=<figma-light|figma-dark>`
- Home preview: `/?isolated=1&tool=home&theme=<theme>`

Theme sync is done by parent-to-iframe `postMessage` with `__preview_theme`.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run preview` | Start dev server with hot reload |
| `npm run preview:build` | Build static preview bundle |
| `npm run preview:serve` | Serve built preview locally |
