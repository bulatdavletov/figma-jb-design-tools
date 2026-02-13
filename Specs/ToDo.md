Push this repo to github
new repo name: figma-jb-design-tools

Print tool:
If I press update, show preview, what will be updated, before after, and only then apply.

Bug report: slack message to me. In header of tool? Bottom of home view?

Foldable instructions inside tools


Issues with border of ColorSwatch in Color Chain tool.

Need to design Table view
Is it possible to make window wider?
Cases, requirements.

~~Bug: No visible vertical spacing between primary and secondary text inside DataList/DataRow items.~~
✓ Fixed: Replaced `Text` component with plain `<div>` elements in DataRow and Print preview. The library's `Text` uses `::before { margin-top: -9px }` + `transform: translateY(4px)` which compressed layout heights (20px→12px, 16px→8px) and made text fill edge-to-edge, hiding the gap.

~~Preview print: click on the layer, see what will be printed, show the future layer name and provide an option to copy it~~ 
✓ Done: Print tab now shows live preview with variable name, future layer name, and copy button per row

Save states of tools even if i switch to another tool and back. Is it possible? Between tools and Tabs. And save settings even if i closed a plugin.

Print, bug: got-it-control-border   #FFFFFF 24% 24% - percantage printed 2 times

Refactor Print Color Usages tool, as it has separated Tabs, and too much code in one file.

ToolBody spacing: too much vertical space before/after content in compact views (e.g. Print Color Usages Settings disclosure). Root cause is ToolBody's `<VerticalSpace space="medium" />` top/bottom. Needs a proper solution (e.g. a `compact` prop or smaller default) without hacks like negative margins. Affects all tools using ToolBody.