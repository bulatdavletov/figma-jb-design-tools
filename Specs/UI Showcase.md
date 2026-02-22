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

## What It Shows

The preview app (`src/preview/preview-app.tsx`) renders a page with every custom component the plugin uses:

| Component | What you see |
|-----------|-------------|
| **ToolCard** | Card with icon, title, description, and click handler |
| **ButtonWithIcon** | Button with a leading icon |
| **Tree** | Collapsible tree with groups, rows, spacers |
| **State** | Empty/info state with icon, title, description |
| **ToolHeader** | Top toolbar bar (also hosts the theme toggle) |

A **light/dark theme toggle** is in the top-left corner (the home icon). You can also use the Light / Dark buttons in the Theme section.

---

## How to Add a New Component

1. Import your component at the top of `src/preview/preview-app.tsx`.
2. Add a new section inside the `<Container>` block, following the existing pattern:

```tsx
<VerticalSpace space="medium" />
<Divider />
<VerticalSpace space="medium" />

<Text style={{ fontWeight: 600 }}>YourComponent</Text>
<VerticalSpace space="extraSmall" />
<YourComponent prop1="value" />
```

3. Save — the browser updates automatically.

---

## How It Works (Architecture)

```
src/preview/
  index.html      ← entry HTML loaded by Vite
  main.tsx         ← imports Figma plugin CSS + mounts <PreviewApp />
  preview-app.tsx  ← renders all component demos + theme toggle
```

- **Vite config** (`vite.config.ts`) sets `root` to `src/preview/` and uses the Preact preset.
- **CSS** comes from `@create-figma-plugin/ui` (base, fonts, theme) — same styles as in the real plugin.
- **Theme classes** (`figma-light` / `figma-dark`) are toggled on `<html>` and `<body>`, exactly like Figma does.

---

## Other Commands

| Command | Purpose |
|---------|---------|
| `npm run preview` | Start dev server with hot-reload |
| `npm run preview:build` | Build a static version into `dist-preview/` |
| `npm run preview:serve` | Serve the built static version locally |
