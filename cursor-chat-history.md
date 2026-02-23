# Cursor Chat History

## Automations Tool — Phase 1.5 Context System

### 2026-02-23: Context pipeline architecture implemented

**Task:** Implement Phase 1.5 of Automations Tool — introduce Context model, expression tokens, property registry, action categories, run output log.

**What was done:**
- Created `AutomationContext` type (`nodes`, `variables`, `styles`, `log`, `pipelineVars`)
- Created property accessor registry (15 node properties: name, type, width, height, opacity, fillHex, etc.)
- Created expression token resolver supporting `{name}`, `{count}`, `{index}`, `{$pipelineVar}`
- Migrated all 8 existing actions from selection-based to context-based signatures
- Added 7 new actions: `sourceFromSelection`, `sourceFromPage`, `selectResults`, `log`, `count`, `setPipelineVariable`, `setPipelineVariableFromProperty`
- Added action categories (Source, Filter, Navigate, Transform, Pipeline Variables, Output)
- Renamed actions: `findByType` → `filterByType`, `selectByName` → `filterByName`
- Added storage migration for old action names
- Added Run Output screen showing step-by-step log
- Action picker now organized by category with headers

**Architecture decisions:**
- Actions receive `AutomationContext` and return modified context (unified signature)
- Token resolution is centralized in `tokens.ts` but called by actions when needed (per-node or per-context)
- Property accessors are a registry (`properties.ts`) used by tokens, pipeline variables, and future filter actions
- The executor creates initial context from selection, passes it through each step, then syncs back to Figma selection
- Each action adds its own log entries (the action knows best what it did)
- Old automations with `findByType`/`selectByName` are migrated transparently on load
