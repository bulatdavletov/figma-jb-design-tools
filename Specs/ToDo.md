## Markup Tool:
Add Sticky Note
Convert text to sticky note and vise versa.

## Batch Rename Tool:
- [x] New name: Rename via JSON file.
Shoul I combine it somehow with Export Import tool?
Import as separate Tab.

## Export Tool
Fil name should contain project name.
Example: "Int UI Kit: Islands. Palette.json"

## Library Swap Tool:

Unmatched components:
Group by Sections.
Being able to print by component keys?
Print old, new, then match them.

Manual match as separate Tab.


## Inspector (new idea)
print anything by Variable ID or component key, maybe?.

## General

- [x] UI elements showcase page with custom components, example data, options, and descriptions (for future Figma library + Code Connect prep).

UI: Loader not aligned with text

Need md file with available Figma colors,  Figma API actions.

- [x]Push this repo to github
new repo name: figma-jb-design-tools

- [ ]Bug report: slack message to me. In header of tool? Bottom of home view?

- [ ]Foldable instructions inside tools

Need to design Table view - started
Is it possible to make window wider?
Cases, requirements.

~~Bug: No visible vertical spacing between primary and secondary text inside DataList/DataRow items.~~
✓ Fixed: Replaced `Text` component with plain `<div>` elements in DataRow and Print preview. The library's `Text` uses `::before { margin-top: -9px }` + `transform: translateY(4px)` which compressed layout heights (20px→12px, 16px→8px) and made text fill edge-to-edge, hiding the gap.

Idea: new component located in right and bottom part of ui, that allows to resize the window.
It should have delay, before hover, and then show the resize handle.

## Print tool:

If I press update, show preview, what will be updated, before after, and only then apply.

- [x] @src/app/views/print-color-usages-tool/UpdateTab.tsx:52-70 move this button to footer

- [x] @src/app/views/print-color-usages-tool/PrintTab.tsx Print button shouldn't be active, when there is no selection

### Update tool:
Sometimes I don't want to apply text style or color.
Only update layer name and content.

## Color Chain tool:
Issues with border of ColorSwatch in Color Chain tool.

~~Preview print: click on the layer, see what will be printed, show the future layer name and provide an option to copy it~~ 
✓ Done: Print tab now shows live preview with variable name, future layer name, and copy button per row

Save states of tools even if i switch to another tool and back. Is it possible? Between tools and Tabs. And save settings even if i closed a plugin.

Print, bug: got-it-control-border   #FFFFFF 24% 24% - percantage printed 2 times

Refactor Print Color Usages tool, as it has separated Tabs, and too much code in one file.

ToolBody spacing: too much vertical space before/after content in compact views (e.g. Print Color Usages Settings disclosure). Root cause is ToolBody's `<VerticalSpace space="medium" />` top/bottom. Needs a proper solution (e.g. a `compact` prop or smaller default) without hacks like negative margins. Affects all tools using ToolBody.

## Migrate to New UI Kit

- [ ] Manual pairs - make it as separate Tab