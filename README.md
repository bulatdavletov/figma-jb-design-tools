## JetBrains Design Utilities (Dev) — setup

### What this is
- A Figma plugin that has:
  - **Utilities Home** (launcher)
  - **Variable Chain Inspector** (Flow A: inspect alias chain from selected layer’s bound variable)

### Is it safe to run?
Yes. Current implementation is **read-only**: it only reads your selection + variables and shows the chain. No edits are applied to your file.

### Install & build (once)
In Terminal, in this folder:

```bash
npm install
npm run build
```

### Run in Figma (Development)
1. In Figma: **Plugins → Development → Import plugin from manifest…**
2. Choose this file: `manifest.json` (in this folder).
3. Run it from the Plugins menu:
   - **Utilities Home**
   - **Variable Chain Inspector** (runs directly)

### If you saw console warnings before
If you previously saw a warning like `Unrecognized feature: 'local-network-access'`, re-import the plugin using the **new** `manifest.json` (we removed the network permissions block for compatibility).

### Development (optional)

```bash
npm run watch
```

### UI Framework
Create UI Figma
Storybook https://yuanqing.github.io/create-figma-plugin/storybook/?path=/story/index--index