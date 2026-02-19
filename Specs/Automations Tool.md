I want to create Automation tool, where I can create automations, like Apple Shortcuts, but for Figma.

The thing is: I don't want to search for plugin every time.
I want to create my own automations.

Let's think how to do it. What i need for that.

List of actions from Figma API

List of Object types

List of actions in Automations tool

Automations should be exportable/importable as JSON files (for sharing between team members or across devices).

[Plan](../.cursor/plans/automations_tool_409706d6.plan.md)

UI:
This tool requires lot's of space, but our plugin is quite narrow.
We need to come up with the way to resize plugin window, to increase it.

Several columns, Like apple shortcuts:
Left side for steps. Right side is dynamic: if nothing selected - for available actions. If step selected - for parameters.

When plugin finishes - there should be way to show output inside plugin window.