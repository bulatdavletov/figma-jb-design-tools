## Figma Utilities Plugin — Product Spec (draft)

### Goal
Make a single “Swiss‑army” Figma plugin that bundles several practical utilities (mostly variables/tokens + colors + icon/component swapping) into one **cohesive, safe, and easy-to-discover** tool.

### Problem
Right now the utilities are spread across multiple plugins/repos, each with its own UI and release cycle. That makes them harder to discover, harder to maintain, and increases “tool switching” during design work.

### Target users (personas)
- **Design system maintainer**: manages tokens/variables, migrations, and consistency.
- **Product designer**: wants quick fixes (swap icons/components, clean up colors).
- **Design ops / platform**: cares about reliability, rollback, and repeatable processes.

---

## Key product questions (your questions answered)

### Is it a good idea to gather all utilities into one single plugin?
**Yes, if you design it as a “tool launcher” with modular utilities**, not a single giant workflow.

- **Why it’s a good idea**
  - One place to look (“Utilities”), fewer installs, consistent UI.
  - Shared foundations: selection parsing, notifications, progress UI, dry-run, logging.
  - One release train: fixes + improvements ship together.

- **When it’s a bad idea**
  - If utilities are unrelated and force everyone to download a big plugin they rarely use.
  - If the UI becomes cluttered and users can’t quickly find the one thing they need.

### What are the risks? (and how to mitigate)
- **Scope creep / messy UI**
  - Mitigation: a **Home screen** with search + categories + “recent tools”.
- **Breaking changes on update**
  - Mitigation: versioned “behavior notes”, internal “safe mode”, and a test file checklist.
- **Performance**
  - Mitigation: load only the selected tool’s code path; avoid scanning entire files by default.
- **Trust / safety**
  - Mitigation: every “writer” tool offers **Preview (dry-run)** + “what will change” summary.
- **Maintenance**
  - Mitigation: enforce a shared “utility contract” (inputs/outputs, errors, analytics/logging).

### Will it break any existing functionality?
If you keep the old plugins around, **nothing breaks**. If you replace them and users switch, then:
- Risk is mostly in **behavior differences** (edge cases, naming, selection rules).
- Mitigation is **compatibility mode** per tool (“match old plugin behavior” toggle) and explicit changelogs.

### How will main user flow change?
- Before: install/open a specific plugin → run it → repeat for other tasks.
- After: open one plugin → search/choose a tool → run → return to Home (recent tools).

---

## Product shape (what the plugin feels like)

### Navigation
- **Home / Command palette**
  - Search (“swap icons”, “rename variables”, “print color usage”)
  - Categories (Icons, Components, Variables/Tokens, Colors, Diagnostics)
  - Recent tools
- **Tool screens**
  - Inputs (what selection is required)
  - Options (toggles)
  - Preview / Run
  - Results (counts, warnings, copyable report)

### UI framework
Use `create-figma-plugin` UI framework (per your note) to keep screens consistent and easy to build.

---

## Utility catalog (initial)

### 1) Icon library swap (existing)
**Problem**: move from old icon set to new icon set across a file.
- **User story**: “As a designer, I want to replace old icons with new icons without manually updating hundreds of instances.”
- **Inputs**: selection or scope (page, selection, entire file).
- **Options**: mapping source (name rules / CSV / JSON), match by name, match by component key, preserve size/constraints.
- **Safety**: preview count + list of unmatched icons.
- **Output**: swapped instances + report.

### 2) Variables rename helper (existing)
**Problem**: token naming changes need bulk renames.
- **User story**: “As a DS maintainer, I want to rename variables by rule and not break references.”
- **Inputs**: variable collection(s).
- **Options**: find/replace, regex (optional), case transforms, prefix/suffix, dry-run.
- **Safety**: preview old → new, detect collisions.
- **Output**: renamed variables + report.

### 3) Print color usages (existing)
**Problem**: understand where colors are used before changing/removing tokens.
- **User story**: “As a DS maintainer, I want a report of where a color/token is used.”
- **Inputs**: scope (selection/page/file) + what to analyze (fills/strokes/effects/text).
- **Output**: copyable report (counts, nodes list, maybe grouped by style/variable).

### 4) Find color matches (existing `ds-colors-cursor`)
**Problem**: detect near-duplicate colors / map raw colors to DS palette.
- **User story**: “As a designer, I want to find the closest DS color for a picked color.”
- **Inputs**: a color (picked) or scan scope.
- **Options**: distance metric, threshold, show top N matches.
- **Output**: suggestions + optional “apply replacements” mode (separate step).

### 5) “Variables helper” (unknown)
**Action**: define what it does (we’ll spec after we inspect that repo or you recall).
- **Placeholder**: “Token chain inspector” or “variable cleanup” until clarified.

### 6) “Nicely detach color variable” (uncertain)
**Problem**: detach only the top layer of a variable reference chain.
- **User story**: “As a designer, I want to detach one level of indirection without losing final color.”
- **Inputs**: selection with variable-bound paints.
- **Safety**: preview which nodes change and what they become.

### 7) New: swap components and preserve overrides
**Problem**: migrating component libraries is painful when overrides reset.
- **User story**: “As a DS maintainer, I want to swap old components to new ones and keep overrides as much as possible.”
- **Inputs**: mapping old → new.
- **Options**: strategy for prop mapping, text/visibility overrides, layout constraints.
- **Safety**: preview + unmatched/unsafe cases.

### 8) New: token chain viewer/manager
**Problem**: token aliases create chains; hard to see where values come from.
- **User story**: “As a DS maintainer, I want to see the full variable alias chain and fix broken links.”
- **Outputs**: chain graph/list, broken link detection, “jump to variable”, export.

---

## MVP definition (what to build first)
**MVP = Home launcher + 2–3 highest-confidence tools** with excellent safety/preview.

Recommended MVP tools (because you already have them):
- Icon library swap
- Variables rename helper
- Print color usages

Everything else becomes “Later” until the foundation is solid.

---

## Non-goals (for now)
- Full “apply across org/team libraries automatically” (too risky/complex early)
- Automatic prop mapping for components without explicit mapping rules

---

## Reliability & testing (so updates don’t break things)

### Testing strategy (practical for a non-developer workflow)
- **Golden test file**: keep a dedicated Figma file with:
  - sample icons/components (old/new)
  - variables collections with alias chains
  - mixed fills/strokes/effects/text usage
  - edge cases (missing mappings, locked layers, nested instances)
- **Manual test checklist per release**
  - Run each MVP tool in preview → verify counts
  - Run “apply” → verify expected changes
  - Confirm no crashes on empty selection / wrong selection
  - Confirm report exports work (copy/download)
- **Release notes**
  - “Behavior changes” section per tool
  - Known limitations

### Safety features (product requirements)
- **Preview mode** for every tool that modifies the file
- **Scope control**: Selection / Page / File
- **Results report**: changed count + warnings + unmatched list
- **“Undo guidance”**: remind users to use Figma Undo immediately after a run if needed

---

## Open questions (need answers to finalize)
- What exactly does `Variables helper` do today?
- Do you want “one plugin” distribution, or “one repo / many plugins” with shared code?
- Should the plugin support batch actions across pages, or only selection/page at first?

