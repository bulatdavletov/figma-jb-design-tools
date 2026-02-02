# OpenMemory Guide — figma-jb-variables-utilities

## Overview
- Figma plugin workspace that bundles multiple utilities into one plugin UI (built with `@create-figma-plugin/*`).

## Architecture (high-level)
- **Main thread**: receives Figma events/selection, computes results, posts messages to UI.
- **UI**: Preact views/components under `src/app/` render tool UIs and communicate via `src/app/messages.ts`.

## User Defined Namespaces
- 

## Components (notable)
- `src/app/views/color-chain-tool/ColorChainToolView.tsx`: “View Colors Chain” tool UI.
- `src/app/components/ColorSwatch.tsx`: `TextboxColor`-style “chit” swatch (checkerboard + split opacity preview).

## Patterns / Notes
- **Swatch parity with framework**: `ColorSwatch` intentionally mirrors `@create-figma-plugin/ui` `TextboxColor` `.chit` behavior (size 14×14, radius 2, checkerboard background SVG, and two halves when opacity < 100%). No standalone border: `TextboxColor` border belongs to the whole control, not the swatch.

