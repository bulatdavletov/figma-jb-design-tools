# UI Showcase (Local Component Preview)

A standalone Vite app that renders plugin UI components outside of Figma, so you can iterate on look-and-feel without loading the plugin every time.

---

## How to Open

```bash
npm run preview
```

This starts a Vite dev server (default `http://localhost:5173`). Open the URL in your browser.

The dev server supports hot reload: edits to components are reflected instantly.

---

## Navigation

The showcase has a sidebar with two top-level areas:

- **Components**: isolated demos of reusable UI building blocks (ToolCard, Tree, ColorRow, etc.)
- **Screens**: plugin home screen plus each tool view with multiple scenarios

### Screen Pages

Each tool page renders the real view component in multiple states simultaneously. Each state is rendered in an independent iframe, so message listeners are isolated and scenarios do not interfere with each other.

- Default tool scenario frame size: `360x500`
- Optional per-scenario override: `size: { width, height }` (for tools/screens that need a different window)
- Home screen preview size: `360x550`

Example states for View Colors Chain:

- Empty selection
- Single layer with chain
- Multi-layer (3 layers)
- No variables found
- Error

---

## Shared Test Fixtures

Tool state data lives in `src/test-fixtures/`, one file per tool. Each file exports an array of `Scenario` objects:

```typescript
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

These fixtures are typed against `MainToUiMessage` from `src/home/messages.ts`, so TypeScript catches payload drift.

The same fixtures can be reused by automated tests (Vitest), keeping visual and logic validation aligned.

---

## How to Add a New Tool State

1. Open the fixture file in `src/test-fixtures/<tool-name>.ts`.
2. Add a new entry to the `scenarios` array with the messages that produce that state.
3. Save. The state appears automatically on that tool page.

---

## How to Add a New Component

1. Import your component in `src/ui-showcase/preview-app.tsx`.
2. Add a new showcase section and register it in `componentShowcases`.
3. Save. The browser updates automatically.

---

## Architecture

```
src/ui-showcase/
  index.html                 <- entry HTML loaded by Vite
  main.tsx                   <- routes between PreviewApp and IsolatedToolView
  preview-app.tsx            <- sidebar navigation + component/screen pages
  mock-message-bus.ts        <- dispatches fake MainToUiMessage to window
  showcase-tool-registry.ts  <- maps tool IDs to view components + scenarios
  ToolPreview.tsx            <- renders per-scenario iframes for each tool
  IsolatedToolView.tsx       <- standalone renderer for one tool+scenario (iframe target)

src/test-fixtures/
  types.ts                   <- Scenario type definition
  color-chain.ts             <- Color Chain scenarios
  mockup-markup.ts           <- Mockup Markup scenarios
  ...                        <- one file per tool
```

**Iframe isolation:** each scenario frame loads `/?isolated=1&tool=X&scenario=Y`, giving each scenario its own `window` and independent message listeners.

**Theme sync:** the parent page sends `postMessage({ __preview_theme: "figma-dark" })` to iframes when the theme changes.

---

## Other Commands

| Command | Purpose |
|---------|---------|
| `npm run preview` | Start dev server with hot reload |
| `npm run preview:build` | Build a static version into `dist-preview/` |
| `npm run preview:serve` | Serve the built static version locally |
