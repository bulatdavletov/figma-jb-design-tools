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

The showcase sidebar currently has two sections:

- **Components** — isolated demos of reusable UI building blocks (ToolCard, Tree, ColorRow, TokenInput, etc.)
- **Screens** — the real plugin Home screen plus each tool view rendered in scenario states

### Tool Pages

Each tool page renders the **real view component** in multiple states simultaneously.

- Frames are currently stacked vertically (not side-by-side)
- Default frame size is `360x500`
- A scenario can override frame size via `scenario.size` (used by larger screens like Automations builder)
- Home screen preview uses `360x550`

Each frame is an independent iframe with its own message isolation, so different states (empty, results, error) do not interfere with each other.

Example states for View Colors Chain:
- Empty Selection
- Single Layer with chain
- Multi-layer (3 layers)
- No Variables Found
- Error

---

## Shared Test Fixtures

Tool state data lives in `src/test-fixtures/` (one file per tool). Each file exports an array of `Scenario` objects:

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

These fixtures are typed against `MainToUiMessage` from `src/home/messages.ts`, so TypeScript catches drift if payload shapes change.

**The same fixtures can be used for future automated tests** (Vitest), ensuring visual and logical testing share realistic data.

---

## How to Add a New Tool State

1. Open the fixture file for the tool in `src/test-fixtures/<tool-name>.ts`.
2. Add a new entry to the `scenarios` array with the messages that produce that state.
3. Save — the new state appears automatically as a new frame on the tool's page.

---

## How to Add a New Component

1. Import your component at the top of `src/ui-showcase/preview-app.tsx`.
2. Add a new showcase entry in the `componentShowcases` registry inside `src/ui-showcase/preview-app.tsx`.
3. Save — the browser updates automatically.

---

## Architecture

```
src/ui-showcase/
  index.html            ← entry HTML loaded by Vite
  main.tsx              ← routes between PreviewApp (normal) and IsolatedToolView (iframe)
  preview-app.tsx       ← sidebar navigation + content pages
  mock-message-bus.ts   ← dispatches fake MainToUiMessage to window
  showcase-tool-registry.ts ← maps tool IDs to view components + scenarios
  ToolPreview.tsx        ← renders stacked iframe scenario frames for a tool
  IsolatedToolView.tsx   ← standalone renderer for one tool+scenario (loaded in iframe)

src/test-fixtures/
  types.ts              ← Scenario type definition
  color-chain.ts        ← Color Chain scenarios
  mockup-markup.ts      ← Mockup Markup scenarios
  ...                   ← one file per tool
```

**Iframe isolation:** Each scenario frame is an `<iframe>` loading `/?isolated=1&tool=X&scenario=Y&theme=figma-dark|figma-light`. This gives each instance its own `window`, so `window.addEventListener("message")` calls in the real views do not interfere between scenarios.

**Theme sync:** The parent page sends `postMessage({ __preview_theme: "figma-dark" })` to iframes when the theme toggles.

---

## Other Commands

| Command | Purpose |
|---------|---------|
| `npm run preview` | Start dev server with hot-reload |
| `npm run preview:build` | Build a static version into `dist-preview/` |
| `npm run preview:serve` | Serve the built static version locally |
