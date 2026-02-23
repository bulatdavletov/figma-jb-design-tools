# How to Test Figma Plugins

This document covers testing strategies for Figma plugins, from simple unit tests to in-Figma integration testing.

## The Challenge

Figma plugins run in a sandboxed environment with access to a global `figma` object. This makes automated testing tricky because:

- The real `figma` API only exists inside the Figma app
- Many operations are async and depend on Figma's internal state (fonts, variables, styles)
- There's **no official testing framework** from Figma
- Newer APIs (variables, modes, `resolveForConsumer`) are not covered by community mocks

---

## Testing Strategies

### 1. Unit Tests for Pure Logic (Recommended First Step)

**What:** Test utility functions that don't call Figma APIs directly.

**Tools:** [Vitest](https://vitest.dev/) (fast, Vite-native) or Jest.

**Examples of testable code in this project:**

| File | Function | What to test |
|------|----------|--------------|
| `src/app/tools/mockup-markup/utils.ts` | `collectTextNodesFromSelection` | Tree traversal logic (with mock node objects) |
| `src/app/tools/mockup-markup/utils.ts` | `OperationResult` handling | Success/failure result pattern |
| `src/app/tools/print-color-usages/analyze.ts` | Color analysis logic | Data transformation |
| `src/app/variable-chain.ts` | Chain building logic | Array/object manipulation |

**Setup (Vitest):**

```bash
npm install -D vitest
```

Add to `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})
```

**Example test file** (`src/app/tools/mockup-markup/utils.test.ts`):

```ts
import { describe, it, expect } from 'vitest'
import { collectTextNodesFromSelection } from './utils'

describe('collectTextNodesFromSelection', () => {
  it('should return empty array for empty selection', () => {
    const result = collectTextNodesFromSelection([])
    expect(result).toEqual([])
  })

  it('should find nested text nodes', () => {
    // Create mock nodes (simplified structure)
    const textNode = { type: 'TEXT', id: '1' } as unknown as SceneNode
    const frame = {
      type: 'FRAME',
      id: '2',
      children: [textNode],
    } as unknown as SceneNode

    const result = collectTextNodesFromSelection([frame])
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })
})
```

---

### 2. Mock Figma API with `figma-api-stub`

**What:** A community stub implementation of the Figma Plugins API for testing code that creates/modifies nodes.

**Repo:** [github.com/react-figma/figma-api-stub](https://github.com/react-figma/figma-api-stub)

**Setup:**

```bash
npm install -D figma-api-stub
```

**Usage:**

```ts
import { createFigma } from 'figma-api-stub'
import { beforeEach, describe, it, expect } from 'vitest'

describe('Rectangle creation', () => {
  beforeEach(() => {
    // @ts-ignore - global figma mock
    global.figma = createFigma()
  })

  it('should create a rectangle with correct size', () => {
    const rect = figma.createRectangle()
    rect.resize(100, 200)

    expect(rect.width).toBe(100)
    expect(rect.height).toBe(200)
  })
})
```

**Limitations:**

| Feature | Supported |
|---------|-----------|
| Basic node creation (Rectangle, Frame, Text) | ✅ Yes |
| Node properties (fills, strokes, effects) | ✅ Partial |
| Variables API (`figma.variables.*`) | ❌ No |
| `setBoundVariable` / `resolveForConsumer` | ❌ No |
| Text styles / font loading | ❌ Limited |
| `importStyleByKeyAsync` / `importVariableByKeyAsync` | ❌ No |

**Bottom line:** Good for basic node manipulation tests, but won't work for this project's variable-heavy logic.

---

### 3. In-Figma Test Runners (Experimental)

**What:** Run tests inside the actual Figma environment.

**Projects:**

| Project | Status | Notes |
|---------|--------|-------|
| [figma-test-runner](https://github.com/tokilabs/figma-test-runner) | Early stage | Nx monorepo, runs BDD tests in Figma |
| [runrun](https://github.com/figma-plugin-sdk/runrun) | Minimal | Test runner for Figma plugins |

**How it works:**

1. Tests are bundled into the plugin
2. Plugin runs in Figma and executes tests
3. Results are displayed in the plugin UI or console

**When to use:** Integration tests that require real Figma API access (variables, styles, fonts).

**Drawbacks:**

- Requires Figma to be open (can't run in headless CI easily)
- Complex setup
- Slower feedback loop

---

### 4. Manual Testing Checklist (Current Approach)

For this project, manual testing is documented in `Specs/Refactoring Ideas.md`. Keep maintaining this as the primary QA strategy for integration flows.

**Before any release:**

- [ ] View Colors Chain: Select layer with variable colors → chain displays correctly
- [ ] View Colors Chain: Edit color → chain updates live
- [ ] Print Color Usages: Print to selection → text matches node color
- [ ] Print Color Usages: Update existing prints → correct refresh
- [ ] Mockup Markup: Apply typography preset → style applies
- [ ] Mockup Markup: Apply color preset → variable binds correctly
- [ ] Mockup Markup: Create text with width → fixed width 400px

---


## Fake Data Strategy for This Repository

Use deterministic fixtures that model only the fields each function actually reads.

### 1) Build tiny fixture factories

Create reusable factory helpers for paints, variables, and selection trees. Keep defaults realistic and allow per-test overrides.

```ts
// tests/fixtures/figma-fakes.ts
export function makeSolidPaint(overrides: Partial<SolidPaint> = {}): SolidPaint {
  return {
    type: 'SOLID',
    visible: true,
    opacity: 1,
    color: { r: 0, g: 0, b: 0 },
    ...overrides,
  }
}
```

### 2) Model only the minimum Figma shape

For unit tests, prefer plain objects cast to minimal plugin types instead of full object graphs.

- `collectTextNodesFromSelection`: fake `SceneNode` trees (`type`, `children`, `id`)
- `analyzeNodeColors`: fake `fills`/`strokes` arrays with only `SOLID` paints
- variable label parsing helpers: fake layer names + IDs

### 3) Add golden JSON fixture sets

For regression-heavy tools (`library-swap`, variable mapping), store fixture input/output JSON pairs:

- `tests/fixtures/library-swap/input.json`
- `tests/fixtures/library-swap/expected-output.json`

Then assert deep equality after the transform runs.

### 4) Keep fake data deterministic

- Avoid timestamps and randomness in fixture data
- Use stable IDs like `VariableID:primary/default`
- Keep color examples human-readable (`#FF8000`, opacity `0.8`)

---

## Repository Link Check (from this spec)

If you need to quickly validate referenced repositories from your machine:

```bash
curl -I -L https://github.com/react-figma/figma-api-stub
curl -I -L https://github.com/tokilabs/figma-test-runner
curl -I -L https://github.com/figma-plugin-sdk/runrun
```

Expected result: HTTP status `200` (or `301/302` then final `200`). If blocked by corporate proxy/network policy, run the same command in CI or another network and capture results in your QA notes.

---

## Recommended Testing Strategy for This Project

| Layer | What to Test | Tool |
|-------|--------------|------|
| **Unit** | Pure utility functions (parsing, formatting, traversal) | Vitest |
| **Integration** | Full tool flows with real Figma API | Manual in Figma |
| **Regression** | Critical paths after each change | Manual checklist |

### Priority Order

1. **Extract pure logic** into testable functions (no `figma.*` calls)
2. **Add Vitest** for those functions
3. **Maintain manual checklist** in `Specs/Refactoring Ideas.md`
4. **(Future)** Explore in-Figma test runner when project grows

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [figma-api-stub](https://github.com/react-figma/figma-api-stub)
- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/)
- [Figma Async Tasks Guide](https://developers.figma.com/docs/plugins/async-tasks/)

---

## Notes

- Figma does not provide an official testing framework or headless environment
- Community mocks lag behind the official API (especially for variables)
- Best ROI: extract pure logic and unit test it; keep integration tests manual
