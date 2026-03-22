This tool should help to use Mockup markup library in Figma faster.

## Problem
I want to write a text in mockup, but i need to:
create text layer
find and set a color
find and set a text style
type text

## Solution
This tool should be able to:
Create text layer from scratch in my view area with right text style and color
Apply style and color to selected text layers

## Styles and colors
Styles and colors are hardcoded and fixed

## Text styles
Markup Paragraph text "S:a6d1706e317719d0750eae3655a3b4360ad2b9ef,1260:39" (default)
Markup Description text "S:d8195a8211b3819b1a888e4d1edf6218ff5d2fd5,1282:7"
Markup H1 "S:3e9bacca6574fd3bb647bc3f3fec124903d58931,1190:2"
Markup H2 "S:d8f137455e6ade1a64398ac113cf0a49c2991ff6,1190:1"
Markup H3 "S:a7abb8bbbf3b902fa8801548a013157907e75bc2,1260:33"

## Colors
type:"VARIABLE_ALIAS"
Markup Text "VariableID:35e0b230bbdc8fa1906c60a25117319e726f2bd7/1116:1" (default) 
Markup Text Secondary "VariableID:84f084bc9e1c3ed3add7febfe9326d633010f8a2/1260:12"
Markup Purple "VariableID:cefb32503d23428db2c20bac7615cff7b5feab07/1210:6"

I also want to set dark mode for colors one time, in the beginning.

## Markup Presets submenu (headless quick-actions)

Quick-actions that run without UI and close the plugin immediately.

### Text presets
Apply text style + color to selected text layers:
- Default Text (paragraph + text)
- Secondary Text (paragraph + text-secondary)
- Comment (paragraph + purple)
- H1, H2, H3 (heading style + text)

All presets use dark mode and no width override.

### Convert to Note
Replaces each selected text layer with a **Markup Note** component instance, preserving the original text content.

**Markup Note component** (from Mockup markup library):
- Component key: `a8606e7014b25f7d4b5825f6ab0949dbb3a985cb`
- Component ID: `26466:1678`
- Variant: `Color=Yellow, Hug=Yes, Title=No`
- Text child node name: `Text`

**Flow:**
1. Select one or more text layers
2. Run Int UI Tools → Markup Presets → Convert to Note
3. Each text layer is replaced with a Markup Note instance at the same position, with the same text content inside