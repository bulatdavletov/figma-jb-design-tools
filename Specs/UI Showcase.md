# UI Showcase (Local Component Preview)

A standalone Vite app that renders plugin UI components **outside of Figma**, so you can iterate on look-and-feel without loading the plugin every time.

---

## How to Open

```bash
npm run preview
```

This starts a Vite dev server (default `http://localhost:5173`). Open the URL in your browser.

> The dev server supports hot-reload — edits to components are reflected instantly.

---

## Navigation

The showcase has a sidebar with three sections:

- **Components** — isolated demos of every reusable UI building block (ToolCard, Tree, ColorRow, etc.)
- **Home Page** — the real plugin home screen rendered at 360x500 (exact Figma plugin size)
- **Tools** — every tool view with multiple states shown side by side

### Tool Pages

Each tool page renders the **real view component** in multiple states simultaneously. States are displayed as side-by-side 360x500 frames. Each frame is an independent iframe with its own message isolation, so different states (empty, results, error) don't interfere with each other.

Example states for View Colors Chain:
- Empty Selection
- Single Layer with chain
- Multi-layer (3 layers)
- No Variables Found
- Error

---

## Shared Test Fixtures

Tool state data lives in `src/test-fixtures/` — one file per tool. Each file exports an array of `Scenario` objects:

```typescript
type Scenario = {
  id: string
  label: string
  messages: MainToUiMessage[]
  props?: { initialSelectionEmpty?: boolean }
}
```

These fixtures are typed against `MainToUiMessage` from `src/app/messages.ts`, so TypeScript catches drift if payload shapes change.

**The same fixtures can be used for future automated tests** (Vitest), ensuring visual and logical testing share realistic data.

---

## How to Add a New Tool State

1. Open the fixture file for the tool in `src/test-fixtures/<tool-name>.ts`.
2. Add a new entry to the `scenarios` array with the messages that produce that state.
3. Save — the new state appears automatically as a new frame on the tool's page.

---

## How to Add a New Component

1. Import your component at the top of `src/preview/preview-app.tsx`.
2. Add a new `ShowcaseSection` in the `ComponentsPage` function.
3. Save — the browser updates automatically.

---

## Architecture

```
src/preview/
  index.html            ← entry HTML loaded by Vite
  main.tsx              ← routes between PreviewApp (normal) and IsolatedToolView (iframe)
  preview-app.tsx       ← sidebar navigation + content pages
  mock-message-bus.ts   ← dispatches fake MainToUiMessage to window
  tool-registry.ts      ← maps tool IDs to view components + scenarios
  ToolPreview.tsx        ← renders side-by-side iframe grid for a tool
  IsolatedToolView.tsx   ← standalone renderer for one tool+scenario (loaded in iframe)

src/test-fixtures/
  types.ts              ← Scenario type definition
  color-chain.ts        ← Color Chain scenarios
  mockup-markup.ts      ← Mockup Markup scenarios
  ...                   ← one file per tool
```

**Iframe isolation:** Each scenario frame is an `<iframe>` loading `/?isolated=1&tool=X&scenario=Y`. This gives each instance its own `window`, so `window.addEventListener("message")` calls in the real views don't interfere between scenarios.

**Theme sync:** The parent page sends `postMessage({ __preview_theme: "figma-dark" })` to iframes when the theme toggles.

---

## Other Commands

| Command | Purpose |
|---------|---------|
| `npm run preview` | Start dev server with hot-reload |
| `npm run preview:build` | Build a static version into `dist-preview/` |
| `npm run preview:serve` | Serve the built static version locally |
