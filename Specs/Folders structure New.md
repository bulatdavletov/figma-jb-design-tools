# Changes from Old Structure

## Major reorganizations:

### 1. Flattened `src/app/` structure
- Moved `src/app/components/` → `src/components/`
- Moved `src/app/views/home/HomeView.tsx` → `src/home/HomeView.tsx`
- Moved `src/app/utils/` → `src/utils/`
- Moved `src/app/tools-registry*` → `src/tools-registry/`
- Moved `src/preview/` → `src/ui-showcase/`

### 2. Consolidated all tools under `src/tools/`
Each tool now contains both logic and views together:
- **automations-tool**: Combined `src/app/tools/automations/` + `src/app/views/automations-tool/` + added `main.ts` and `run-automation.ts`
- **color-chain-tool**: Combined `src/app/tools/color-chain-tool/` + `src/app/views/color-chain-tool/` + moved `variable-chain.ts` here + added `main.ts`
- **find-color-match-tool**: Combined `src/app/tools/find-color-match/` + `src/app/views/find-color-match-tool/` + added `main.ts`
- **migrate-to-islands-uikit-tool**: Combined `src/app/tools/library-swap/` + `src/app/views/library-swap-tool/` + renamed + added `main.ts`
- **mockup-markup-quick-apply-tool**: Combined `src/app/tools/mockup-markup-quick-apply-tool/` + `src/app/views/mockup-markup-tool/` + added `main.ts`
- **print-color-usages-tool**: Combined `src/app/tools/print-color-usages/` + `src/app/views/print-color-usages-tool/` + added `main.ts`
- **variables-rename-tool**: Renamed from `variables-batch-rename-tool`, combined logic + view + added `main.ts`
- **variables-create-linked-colors-tool**: Combined logic + view + added `main.ts`
- **variables-export-import-tool**: Combined logic + view + added `main.ts`
- **variables-replace-usages-tool**: Combined logic + view + added `main.ts`

### 3. Moved shared utilities
- `src/app/tools/variables-shared/` → `src/utils/variables-shared/`
- `src/app/tools/int-ui-kit-library/` → `src/utils/int-ui-kit-library/`
- `src/app/tools/mockup-markup-library/` → `src/utils/mockup-markup-library/`

### 4. Simplified test fixtures
- Moved `src/app/variable-chain.test.ts` → `src/test-fixtures/variable-chain.test.ts`

### 5. Removed separate tool entry points
- Deleted individual tool folders like `src/automations-tool/`, `src/color-chain-tool/`, etc. (each previously contained only `main.ts`)
- All tool entry points now live within their respective tool folders under `src/tools/`

---

# New Structure

src
├── components
│   ├── AppIcons.tsx
│   ├── ButtonWithIcon.tsx
│   ├── ColorRow.tsx
│   ├── ColorSwatch.tsx
│   ├── CopyIconButton.tsx
│   ├── DataList.tsx
│   ├── DataRow.tsx
│   ├── DataTable.tsx
│   ├── InlineTextDiff.tsx
│   ├── LibraryCacheStatusBar.tsx
│   ├── NodeTypeIcon.tsx
│   ├── Page.tsx
│   ├── ScopeControl.tsx
│   ├── SegmentedControlWithWidth.tsx
│   ├── State.tsx
│   ├── TokenInput.tsx
│   ├── TokenPill.tsx
│   ├── ToolBody.tsx
│   ├── ToolCard.tsx
│   ├── ToolFooter.tsx
│   ├── ToolHeader.tsx
│   ├── ToolTabs.tsx
│   ├── Tree.tsx
│   └── token-utils.ts
├── home
│   ├── HomeView.tsx
│   ├── main.ts
│   ├── messages.ts
│   ├── run.ts
│   └── ui.tsx
├── test-fixtures
│   ├── automations.ts
│   ├── color-chain.ts
│   ├── figma-fakes.ts
│   ├── find-color-match.ts
│   ├── library-swap.ts
│   ├── mockup-markup.ts
│   ├── print-color-usages.ts
│   ├── types.ts
│   ├── variable-chain.test.ts
│   ├── variables-batch-rename.ts
│   ├── variables-create-linked-colors.ts
│   ├── variables-export-import.ts
│   └── variables-replace-usages.ts
├── tools
│   ├── automations-tool
│   │   ├── AutomationsToolView.tsx
│   │   ├── actions
│   │   │   ├── component-actions.ts
│   │   │   ├── filter-actions.ts
│   │   │   ├── input-actions.ts
│   │   │   ├── navigate-actions.ts
│   │   │   ├── output-actions.ts
│   │   │   ├── property-actions.ts
│   │   │   ├── selection-actions.ts
│   │   │   ├── source-actions.ts
│   │   │   ├── text-actions.ts
│   │   │   └── variable-actions.ts
│   │   ├── context.ts
│   │   ├── executor.ts
│   │   ├── helpers.tsx
│   │   ├── input-bridge.ts
│   │   ├── main-thread.ts
│   │   ├── main.ts
│   │   ├── properties.ts
│   │   ├── run-automation.ts
│   │   ├── storage.ts
│   │   ├── tokens.ts
│   │   └── types.ts
│   ├── color-chain-tool
│   │   ├── ColorChainToolView.tsx
│   │   ├── main-thread.ts
│   │   ├── main.ts
│   │   └── variable-chain.ts
│   ├── find-color-match-tool
│   │   ├── FindColorMatchToolView.tsx
│   │   ├── Int UI Kit  Islands. Color palette.json
│   │   ├── Int UI Kit  Islands. Semantic colors.json
│   │   ├── apply.ts
│   │   ├── hardcoded-data.ts
│   │   ├── main-thread.ts
│   │   ├── main.ts
│   │   ├── match.ts
│   │   ├── scan.ts
│   │   ├── types.ts
│   │   └── variables.ts
│   ├── migrate-to-islands-uikit-tool
│   │   ├── ManualPairsTab.tsx
│   │   ├── MigrateToIslandsUIKitToolView.tsx
│   │   ├── default-icon-mapping.json
│   │   ├── default-uikit-mapping.json
│   │   ├── main-thread.ts
│   │   ├── main.ts
│   │   ├── mapping-types.test.ts
│   │   ├── mapping-types.ts
│   │   ├── scan-legacy.ts
│   │   └── swap-logic.ts
│   ├── mockup-markup-quick-apply-tool
│   │   ├── MockupMarkupToolView.tsx
│   │   ├── apply.ts
│   │   ├── color-previews.ts
│   │   ├── create.ts
│   │   ├── import-once.ts
│   │   ├── main-thread.ts
│   │   ├── main.ts
│   │   ├── presets.ts
│   │   ├── resolve.ts
│   │   └── utils.ts
│   ├── print-color-usages-tool
│   │   ├── PrintColorUsagesScopeIndicator.tsx
│   │   ├── PrintColorUsagesToolView.tsx
│   │   ├── PrintTab.tsx
│   │   ├── SettingsTab.tsx
│   │   ├── UpdateTab.tsx
│   │   ├── analyze.ts
│   │   ├── main-thread.ts
│   │   ├── main.ts
│   │   ├── markup-kit.ts
│   │   ├── print.ts
│   │   ├── settings.ts
│   │   ├── shared.test.ts
│   │   ├── shared.ts
│   │   └── update.ts
│   ├── variables-create-linked-colors-tool
│   │   ├── VariablesCreateLinkedColorsToolView.tsx
│   │   ├── main-thread.ts
│   │   └── main.ts
│   ├── variables-export-import-tool
│   │   ├── VariablesExportImportToolView.tsx
│   │   ├── main-thread.ts
│   │   └── main.ts
│   ├── variables-rename-tool
│   │   ├── VariablesBatchRenameToolView.tsx
│   │   ├── main-thread.ts
│   │   └── main.ts
│   └── variables-replace-usages-tool
│       ├── VariablesReplaceUsagesToolView.tsx
│       ├── main-thread.ts
│       └── main.ts
├── tools-registry
│   ├── tools-registry-data.json
│   ├── tools-registry-icons-import.tsx
│   └── tools-registry.ts
├── ui-showcase
│   ├── IsolatedToolView.tsx
│   ├── ToolPreview.tsx
│   ├── index.html
│   ├── main.tsx
│   ├── mock-message-bus.ts
│   ├── preview-app.tsx
│   └── tool-registry.ts
└── utils
    ├── clipboard.ts
    ├── component-name.test.ts
    ├── component-name.ts
    ├── int-ui-kit-library
    │   ├── constants.ts
    │   └── resolve.ts
    ├── mockup-markup-library
    │   ├── constants.ts
    │   └── resolve.ts
    ├── pluralize.ts
    └── variables-shared
        ├── caching.ts
        ├── index.ts
        ├── json-parsers.test.ts
        ├── json-parsers.ts
        ├── node-utils.test.ts
        ├── node-utils.ts
        └── types.ts

22 directories, 150 files
