src/
├── app
│   ├── components
│   │   ├── AppIcons.tsx
│   │   ├── ButtonWithIcon.tsx
│   │   ├── ColorRow.tsx
│   │   ├── ColorSwatch.tsx
│   │   ├── CopyIconButton.tsx
│   │   ├── DataList.tsx
│   │   ├── DataRow.tsx
│   │   ├── DataTable.tsx
│   │   ├── InlineTextDiff.tsx
│   │   ├── LibraryCacheStatusBar.tsx
│   │   ├── NodeTypeIcon.tsx
│   │   ├── Page.tsx
│   │   ├── ScopeControl.tsx
│   │   ├── SegmentedControlWithWidth.tsx
│   │   ├── State.tsx
│   │   ├── TokenInput.tsx
│   │   ├── TokenPill.tsx
│   │   ├── ToolBody.tsx
│   │   ├── ToolCard.tsx
│   │   ├── ToolFooter.tsx
│   │   ├── ToolHeader.tsx
│   │   ├── ToolTabs.tsx
│   │   ├── Tree.tsx
│   │   └── token-utils.ts
│   ├── messages.ts
│   ├── run.ts
│   ├── tool-registry-icons-import.tsx
│   ├── tools
│   │   ├── automations
│   │   │   ├── actions
│   │   │   │   ├── component-actions.ts
│   │   │   │   ├── filter-actions.ts
│   │   │   │   ├── input-actions.ts
│   │   │   │   ├── navigate-actions.ts
│   │   │   │   ├── output-actions.ts
│   │   │   │   ├── property-actions.ts
│   │   │   │   ├── selection-actions.ts
│   │   │   │   ├── source-actions.ts
│   │   │   │   ├── text-actions.ts
│   │   │   │   └── variable-actions.ts
│   │   │   ├── context.ts
│   │   │   ├── executor.ts
│   │   │   ├── input-bridge.ts
│   │   │   ├── main-thread.ts
│   │   │   ├── properties.ts
│   │   │   ├── storage.ts
│   │   │   ├── tokens.ts
│   │   │   └── types.ts
│   │   ├── color-chain-tool
│   │   │   └── main-thread.ts
│   │   ├── find-color-match
│   │   │   ├── Int UI Kit  Islands. Color palette.json
│   │   │   ├── Int UI Kit  Islands. Semantic colors.json
│   │   │   ├── apply.ts
│   │   │   ├── hardcoded-data.ts
│   │   │   ├── main-thread.ts
│   │   │   ├── match.ts
│   │   │   ├── scan.ts
│   │   │   ├── types.ts
│   │   │   └── variables.ts
│   │   ├── int-ui-kit-library
│   │   │   ├── constants.ts
│   │   │   └── resolve.ts
│   │   ├── library-swap
│   │   │   ├── default-icon-mapping.json
│   │   │   ├── default-uikit-mapping.json
│   │   │   ├── main-thread.ts
│   │   │   ├── mapping-types.test.ts
│   │   │   ├── mapping-types.ts
│   │   │   ├── scan-legacy.ts
│   │   │   └── swap-logic.ts
│   │   ├── mockup-markup-library
│   │   │   ├── constants.ts
│   │   │   └── resolve.ts
│   │   ├── mockup-markup-quick-apply-tool
│   │   │   ├── apply.ts
│   │   │   ├── color-previews.ts
│   │   │   ├── create.ts
│   │   │   ├── import-once.ts
│   │   │   ├── main-thread.ts
│   │   │   ├── presets.ts
│   │   │   ├── resolve.ts
│   │   │   └── utils.ts
│   │   ├── print-color-usages
│   │   │   ├── analyze.ts
│   │   │   ├── main-thread.ts
│   │   │   ├── markup-kit.ts
│   │   │   ├── print.ts
│   │   │   ├── settings.ts
│   │   │   ├── shared.test.ts
│   │   │   ├── shared.ts
│   │   │   └── update.ts
│   │   ├── variables-batch-rename
│   │   │   └── main-thread.ts
│   │   ├── variables-create-linked-colors
│   │   │   └── main-thread.ts
│   │   ├── variables-export-import
│   │   │   └── main-thread.ts
│   │   ├── variables-replace-usages
│   │   │   └── main-thread.ts
│   │   └── variables-shared
│   │       ├── caching.ts
│   │       ├── index.ts
│   │       ├── json-parsers.test.ts
│   │       ├── json-parsers.ts
│   │       ├── node-utils.test.ts
│   │       ├── node-utils.ts
│   │       └── types.ts
│   ├── tools-registry-data.json
│   ├── tools-registry.ts
│   ├── ui.tsx
│   ├── utils
│   │   ├── clipboard.ts
│   │   ├── component-name.test.ts
│   │   ├── component-name.ts
│   │   └── pluralize.ts
│   ├── variable-chain.test.ts
│   ├── variable-chain.ts
│   └── views
│       ├── automations-tool
│       │   ├── AutomationsToolView.tsx
│       │   └── helpers.tsx
│       ├── color-chain-tool
│       │   └── ColorChainToolView.tsx
│       ├── find-color-match-tool
│       │   └── FindColorMatchToolView.tsx
│       ├── home
│       │   └── HomeView.tsx
│       ├── library-swap-tool
│       │   ├── LibrarySwapToolView.tsx
│       │   └── ManualPairsTab.tsx
│       ├── mockup-markup-tool
│       │   └── MockupMarkupToolView.tsx
│       ├── print-color-usages-tool
│       │   ├── PrintColorUsagesScopeIndicator.tsx
│       │   ├── PrintColorUsagesToolView.tsx
│       │   ├── PrintTab.tsx
│       │   ├── SettingsTab.tsx
│       │   └── UpdateTab.tsx
│       ├── variables-batch-rename-tool
│       │   └── VariablesBatchRenameToolView.tsx
│       ├── variables-create-linked-colors-tool
│       │   └── VariablesCreateLinkedColorsToolView.tsx
│       ├── variables-export-import-tool
│       │   └── VariablesExportImportToolView.tsx
│       └── variables-replace-usages-tool
│           └── VariablesReplaceUsagesToolView.tsx
├── automations-tool
│   └── main.ts
├── color-chain-tool
│   └── main.ts
├── find-color-match-tool
│   └── main.ts
├── home
│   └── main.ts
├── library-swap-tool
│   └── main.ts
├── mockup-markup-tool
│   └── main.ts
├── preview
│   ├── IsolatedToolView.tsx
│   ├── ToolPreview.tsx
│   ├── index.html
│   ├── main.tsx
│   ├── mock-message-bus.ts
│   ├── preview-app.tsx
│   └── tool-registry.ts
├── print-color-usages-tool
│   └── main.ts
├── run-automation
│   └── main.ts
├── test-fixtures
│   ├── automations.ts
│   ├── color-chain.ts
│   ├── figma-fakes.ts
│   ├── find-color-match.ts
│   ├── library-swap.ts
│   ├── mockup-markup.ts
│   ├── print-color-usages.ts
│   ├── types.ts
│   ├── variables-batch-rename.ts
│   ├── variables-create-linked-colors.ts
│   ├── variables-export-import.ts
│   └── variables-replace-usages.ts
├── tools
│   └── migrate-to-islands-uikit-tool
├── variables-batch-rename-tool
│   └── main.ts
├── variables-create-linked-colors-tool
│   └── main.ts
├── variables-export-import-tool
│   └── main.ts
└── variables-replace-usages-tool
└── main.ts