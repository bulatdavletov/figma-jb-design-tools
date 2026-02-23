# Testing Approach

This project is a Figma plugin with 9 tools that share significant logic. As it grows toward a paid product, automated testing is essential to prevent regressions when changing shared code.

## The Constraint

Figma plugins run inside Figma's sandbox with access to a global `figma` object. There is no official testing framework or headless Figma environment. Community mocks (`figma-api-stub`) don't cover the Variables API, which this plugin relies on heavily.

This means we **cannot** automatically test code that calls `figma.*` APIs -- those paths require manual testing in Figma.

## Current Strategy (Active)

### Layer 1: TypeScript Strict Compilation

The first line of defense. TypeScript catches type-level drift at compile time -- if a message field is renamed or a function signature changes, the build fails. This is free and always on.

### Layer 2: Unit Tests for Pure Logic (Vitest)

Framework: [Vitest](https://vitest.dev/) with TypeScript, no compilation step needed.

Test files live **next to the code they test** (co-located pattern):

```
src/app/variable-chain.ts
src/app/variable-chain.test.ts
src/app/tools/variables-shared/json-parsers.ts
src/app/tools/variables-shared/json-parsers.test.ts
```

Run with `npm test` (single run) or `npm run test:watch` (watch mode).

**What's tested:** Functions with zero `figma.*` API calls -- pure input/output:

- Color math: `toByteHex`, `colorToRgbHex`, `rgbToHex`, `solidPaintToHex`
- JSON parsers: `parseImportedRenamePlan`, `parseSnapshotDoc`, `parseUsagesReplaceMappingJson`, `flattenSnapshotDoc`
- String utilities: `maybeStripFolderPrefix`, `stripTrailingModeSuffix`, `extractModeNameFromLayerName`, `getVariableNameSuffix`
- Type guards: `hasChildren`, `hasFills`, `hasStrokes`, `hasBoundVariables`, `isColorValue`

### Layer 3: UI Showcase (Visual Regression by Eye)

The preview app (`npm run preview`) renders real tool views with fake data injected via the mock message bus. Every tool state (empty, results, error) is visible side by side.

Shared test fixtures in `src/test-fixtures/` define scenarios as typed `MainToUiMessage[]` arrays. These fixtures are consumed by both the showcase and unit tests.

### Layer 4: Manual Testing in Figma

For Figma API-dependent flows, manual testing remains the strategy. A checklist lives in `specs/Refactoring Ideas.md`.

Before any release:

- [ ] Each tool opens and shows correct initial state
- [ ] Selection changes are reflected in real time
- [ ] Apply/export/import operations complete without errors
- [ ] Variable resolution and chain display are correct

## Shared Test Fixtures

All fake data lives in `src/test-fixtures/`. One file per tool, plus shared helpers:

- `types.ts` -- `Scenario` type definition
- `figma-fakes.ts` -- factory functions for Figma objects (`makeSolidPaint`, etc.)
- `<tool-name>.ts` -- scenarios per tool (used by showcase AND tests)

Fixture rules:
- Deterministic (no randomness, no timestamps)
- Stable IDs (`VariableID:primary/default`)
- Human-readable colors (`#FF8000`, opacity `0.8`)
- Realistic data (real variable names and collection names from the design system)

## High-Risk Shared Modules

Changes to these modules can cascade to multiple tools. They should always have test coverage:

1. `src/app/messages.ts` -- 82+ message types, all tools depend on it
2. `src/app/variable-chain.ts` -- color resolution, used by Color Chain + Find Color Match
3. `src/app/tools/variables-shared/` -- caching, node traversal, JSON parsers (4+ tools)
4. `src/app/tools/print-color-usages/shared.ts` -- color utilities
5. `src/app/components/` -- 20 shared UI components

## Future Strategy (Not Yet Implemented)

### Message Contract Tests

Automated smoke tests for each tool view: dispatch `MainToUiMessage` payloads from the shared fixtures, verify the view renders expected DOM elements without crashing. Catches "I changed a message type and broke 3 tools."

Requires `@testing-library/preact` + `jsdom` environment in Vitest.

### Ports & Adapters Refactor

Extract Figma API calls behind thin interfaces so business logic becomes pure and testable. Example: `resolveChainForMode()` currently calls `figma.variables.getVariableByIdAsync` directly; refactored, it would receive a `getVariable(id)` function, letting tests inject fakes.

This would raise testable code from ~30% to ~70% but requires moderate refactoring effort.

### Visual Regression (Screenshot Diffing)

Automated screenshot comparison of the showcase. Overkill at current scale but worth considering if the plugin grows past 15+ tools.

### In-Figma Test Runner

Run tests inside actual Figma using experimental community projects. Worth exploring when the project grows, but currently has poor DX and can't run in CI.

## Rules

- Every new pure-logic function must have a co-located test file
- Every new shared module must have tests before merging
- Tests run on `npm test` -- keep it fast (< 5 seconds)
- Fixture data is shared between showcase and tests -- update in one place
- When adding a new tool, add its fixture file to `src/test-fixtures/`
