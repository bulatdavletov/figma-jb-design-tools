## Int UI Design Tools

### What this is
- A Figma plugin that has:
  - **All Tools** (launcher)
  - **Variable Chain Inspector** (Flow A: inspect alias chain from selected layer’s bound variable)

### UI Framework
Create UI Figma
Storybook https://yuanqing.github.io/create-figma-plugin/storybook/?path=/story/index--index

### How to test
- `npm test` runs Vitest unit tests (151 tests, ~1 sec) for all shared pure-logic modules
- `npm run test:watch` starts Vitest in watch mode for active development
- Pre-commit hook runs tests automatically before every commit

### UI Showcase
- `npm run preview` opens a standalone Vite dev server at `http://localhost:5173`
- Browse reusable components, the plugin home page (at exact 360×500 size), and every tool view with multiple states side by side
- Each tool state runs in an isolated iframe with mock data from `src/test-fixtures/` — no Figma needed
- Light/dark theme toggle included

### Tools
Mockup Markup Quick Apply
View Colors Chain
Print Color Usages
Variables Export Import
Rename Variables via JSON
Variables Create Linked Colors
Variables Replace Usages

#### Mockup Markup Quick Apply
Create text layer or apply to selected text layers text styles and colors from Mockup Markup library

#### View Colors Chain
Show the full colors chain for a variables in selection.
Swap main color with a chosen color in the chain.

#### Print Color Usages
Print unique colors as text labels near selection.

#### Variables Export Import
Export and import variables to a JSON file.

#### Rename Variables via JSON
Rename multiple variables at once via JSON file.

#### Variables Create Linked Colors
Create new color variables or rename existing ones in selection.

#### Variables Replace Usages
Replace variable bindings via JSON file.