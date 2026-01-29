## Utility: Variable Chain Inspector (working name)

### Naming
Variable Chain Inspector

### What you want (MVP)
Show the **full alias chain** for a variable (or for a selected layer’s paint variable), and allow **simple chain edits**:
- Remove something “in between” (re-link around a middle variable)
- “Assign color in between as main color” (promote a chosen step to become the final / direct value)

### Why (current understanding)
- **Primary**: sometimes you just need to **see the chain** to understand what’s happening.
- **Secondary** (likely future): cleanup and migration (remove unnecessary alias layers, reduce confusion).

---

## Persona

**Primary**: **Design system maintainer**
Mamanging tokens: reorganization of variable values. Possible only in UI Kit project.

**Occasional**: **Product designer**
Read-only: “why is this color like that?”
Remove top layer, and replace color next in the chain. Like Nicely detach color variable.

---

## Core use cases
- **Debugging**: “This variable doesn’t look right in Dark mode—what’s the alias chain?”
- **Understand impact**: “If I change/remove this middle variable, what breaks?”
- **Cleanup**: “This chain is 5 steps; I want to remove redundant links.”

---

## User flows (MVP)

### Flow A — Inspect chain (read-only)
1. User selects:
   - a layer (plugin reads its bound variable for fill/stroke/text).
2. Plugin shows:
   - Variable name + collection + mode(s)
   - Chain: V1 → V2 → V3 → … → Final
   - Final resolved value (HEX) per mode
3. If a circular link exists: show “Circular reference detected” and stop at the loop.

### Flow B — Remove an intermediate link (“skip this step”)
1. User picks a middle step V2 in V1 → V2 → V3.
2. Plugin previews: “Set V1 to reference V3 instead of V2.”
3. Apply.

---

## Safety / requirements (must-have)
- **Preview before apply**: show exactly what will change (which variable(s), which mode(s)).
- **Mode awareness**: changes can be applied:
  - to the currently selected mode, or
  - to all modes (explicit toggle).
- **Impact hint** (lightweight): show “Used by N layers / M variables” if feasible.
- **Non-destructive messaging**: remind user they can immediately use **Figma Undo**.

---

