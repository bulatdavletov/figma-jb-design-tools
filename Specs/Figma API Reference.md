# Figma Plugin API Reference

Comprehensive reference of Figma object types and available API actions for plugin development. For the canonical, up-to-date definitions, always check the official [Figma Plugin API docs](https://www.figma.com/plugin-docs/).

> This file supersedes the simpler `Object types in Figma.md` and adds full API action coverage.

---

## Table of Contents

1. [Object Type Hierarchy](#object-type-hierarchy)
2. [Node Types in Detail](#node-types-in-detail)
3. [Non-Node Resources](#non-node-resources-styles-variables-libraries)
4. [API Actions by Category](#api-actions-by-category)
5. [Node Properties (Common)](#node-properties-common)
6. [Quick Reference Table](#quick-reference-table)

---

## Object Type Hierarchy

```
DocumentNode (figma.root)
 └── PageNode (figma.currentPage)
      ├── FrameNode
      │    ├── GroupNode
      │    ├── ComponentNode
      │    ├── ComponentSetNode (variant container)
      │    ├── InstanceNode
      │    ├── SectionNode
      │    └── BooleanOperationNode
      ├── RectangleNode
      ├── EllipseNode
      ├── LineNode
      ├── PolygonNode
      ├── StarNode
      ├── VectorNode
      ├── TextNode
      ├── SliceNode
      ├── StickyNode (FigJam)
      ├── ConnectorNode (FigJam)
      ├── ShapeWithTextNode (FigJam)
      └── WidgetNode (FigJam/Plugin widgets)
```

---

## Node Types in Detail

### Document & Page

| Node | `.type` string | Description |
|------|---------------|-------------|
| **DocumentNode** | `"DOCUMENT"` | Root node. Access via `figma.root`. Contains all pages. |
| **PageNode** | `"PAGE"` | Canvas workspace. Direct children of Document. Access via `figma.currentPage`. |

### Container / Structural Nodes

| Node | `.type` string | Description |
|------|---------------|-------------|
| **FrameNode** | `"FRAME"` | General-purpose container. Can be artboards, auto-layout frames. Nestable. |
| **GroupNode** | `"GROUP"` | Visual grouping. Flattens transforms, mostly presentational. |
| **SectionNode** | `"SECTION"` | Visual sections for organizing layouts on the canvas. |
| **ComponentNode** | `"COMPONENT"` | Defines a reusable base component. Instances can be created from it. |
| **ComponentSetNode** | `"COMPONENT_SET"` | Variant set container. Organizes related ComponentNodes as variants. |
| **InstanceNode** | `"INSTANCE"` | Instance of a Component or ComponentSet. Supports overrides. |
| **BooleanOperationNode** | `"BOOLEAN_OPERATION"` | Boolean groups (Union, Subtract, Intersect, Exclude). |

### Drawable / Leaf Nodes

| Node | `.type` string | Description |
|------|---------------|-------------|
| **RectangleNode** | `"RECTANGLE"` | Rectangle shape. Supports corner radius. |
| **EllipseNode** | `"ELLIPSE"` | Ellipse/circle shape. Supports arc data. |
| **LineNode** | `"LINE"` | Line segment. |
| **PolygonNode** | `"POLYGON"` | Regular polygon. |
| **StarNode** | `"STAR"` | Star shape. |
| **VectorNode** | `"VECTOR"` | Arbitrary SVG-style vector path. |
| **TextNode** | `"TEXT"` | Editable text content. Requires font loading before edits. |

### Special / Export Nodes

| Node | `.type` string | Description |
|------|---------------|-------------|
| **SliceNode** | `"SLICE"` | Export region, does not render visually. |

### FigJam-Only Nodes

| Node | `.type` string | Description |
|------|---------------|-------------|
| **StickyNode** | `"STICKY"` | FigJam sticky note. |
| **ConnectorNode** | `"CONNECTOR"` | FigJam connector between objects. |
| **ShapeWithTextNode** | `"SHAPE_WITH_TEXT"` | FigJam shape with embedded text. |
| **WidgetNode** | `"WIDGET"` | Node created by Figma/FigJam widgets. |

---

## Non-Node Resources (Styles, Variables, Libraries)

These are document-level resources, not part of the node tree. Nodes reference them by ID.

### Styles

| Resource | Description | Node Reference Property |
|----------|-------------|------------------------|
| **PaintStyle** (Color Style) | Reusable named paint (solid, gradient, image). | `fillStyleId`, `strokeStyleId` |
| **TextStyle** | Font family, weight, size, line height, etc. | `textStyleId` |
| **EffectStyle** | Shadows, blurs, layer effects. | `effectStyleId` |
| **GridStyle** | Layout grid presets. | `gridStyleId` |

### Variables

| Resource | Description |
|----------|-------------|
| **Variable** | Named global value (Color, Number, Boolean, String). Part of a VariableCollection. Supports alias chains (variable referencing another variable). |
| **VariableCollection** | Group of related variables. Has modes (e.g., Light/Dark). |

Nodes reference variables via `boundVariables` property. Paints reference color variables via the variable alias in the paint's `color` field.

### Team Library Resources

| Resource | Description |
|----------|-------------|
| **LibraryVariableCollection** | Published variable collection from a team library. |
| **LibraryVariable** | Published variable from a team library. |
| **LibraryComponent** | Published component from a team library. |

---

## API Actions by Category

### 1. Document & Page Access

| Action | API | Returns |
|--------|-----|---------|
| Get document root | `figma.root` | `DocumentNode` |
| Get current page | `figma.currentPage` | `PageNode` |
| Get all pages | `figma.root.children` | `PageNode[]` |
| Set current page | `figma.setCurrentPageAsync(page)` | `Promise<void>` |
| Load all pages | `figma.loadAllPagesAsync()` | `Promise<void>` — required before traversing non-current pages |
| Get document name | `figma.root.name` | `string` |

### 2. Node Lookup & Search

| Action | API | Returns |
|--------|-----|---------|
| Get node by ID | `figma.getNodeByIdAsync(id)` | `Promise<BaseNode \| null>` |
| Find all in page | `figma.currentPage.findAll(callback?)` | `SceneNode[]` |
| Find one in page | `figma.currentPage.findOne(callback)` | `SceneNode \| null` |
| Find by type criteria | `page.findAllWithCriteria({ types: [...] })` | `SceneNode[]` — efficient type-based search |
| Find children | `node.findChildren(callback?)` | `SceneNode[]` |
| Find child | `node.findChild(callback)` | `SceneNode \| null` |

### 3. Selection & Viewport

| Action | API | Returns |
|--------|-----|---------|
| Get selection | `figma.currentPage.selection` | `readonly SceneNode[]` |
| Set selection | `figma.currentPage.selection = [nodes]` | — |
| Listen to selection changes | `figma.on("selectionchange", callback)` | — |
| Scroll & zoom to nodes | `figma.viewport.scrollAndZoomIntoView(nodes)` | — |
| Get viewport center | `figma.viewport.center` | `{ x: number, y: number }` |
| Get/set viewport zoom | `figma.viewport.zoom` | `number` |

### 4. Node Creation

| Action | API | Returns |
|--------|-----|---------|
| Create frame | `figma.createFrame()` | `FrameNode` |
| Create rectangle | `figma.createRectangle()` | `RectangleNode` |
| Create ellipse | `figma.createEllipse()` | `EllipseNode` |
| Create line | `figma.createLine()` | `LineNode` |
| Create polygon | `figma.createPolygon()` | `PolygonNode` |
| Create star | `figma.createStar()` | `StarNode` |
| Create vector | `figma.createVector()` | `VectorNode` |
| Create text | `figma.createText()` | `TextNode` — requires `loadFontAsync` before setting characters |
| Create component | `figma.createComponent()` | `ComponentNode` |
| Create component set | `figma.combineAsVariants(components, parent)` | `ComponentSetNode` |
| Create boolean operation | `figma.createBooleanOperation()` | `BooleanOperationNode` |
| Create slice | `figma.createSlice()` | `SliceNode` |
| Create page | `figma.createPage()` | `PageNode` |

### 5. Node Manipulation

| Action | API | Notes |
|--------|-----|-------|
| Append child | `parent.appendChild(node)` | Moves node into parent |
| Insert before | `parent.insertChild(index, node)` | Insert at specific position |
| Remove node | `node.remove()` | Deletes from document |
| Clone node | `node.clone()` | Deep copy, added to same parent |
| Resize | `node.resize(width, height)` | Respects constraints |
| Resize without constraints | `node.resizeWithoutConstraints(w, h)` | Ignores constraints |
| Move (position) | `node.x = ...`, `node.y = ...` | Relative to parent |
| Set rotation | `node.rotation = degrees` | In degrees |
| Set visibility | `node.visible = bool` | Show/hide |
| Lock/unlock | `node.locked = bool` | Prevent editing |
| Set name | `node.name = "..."` | Rename in layers panel |
| Set opacity | `node.opacity = 0..1` | Transparency |

### 6. Paint & Color Operations

| Action | API | Notes |
|--------|-----|-------|
| Set fills | `node.fills = [paint]` | Array of `Paint` objects |
| Set strokes | `node.strokes = [paint]` | Array of `Paint` objects |
| Get fill style ID | `node.fillStyleId` | `string` or `typeof figma.mixed` |
| Set fill style | `node.fillStyleId = styleId` | Apply a PaintStyle |
| Get stroke style ID | `node.strokeStyleId` | `string` |
| Bind variable to paint | `figma.variables.setBoundVariableForPaint(paint, "color", variable)` | Returns new paint with variable bound |
| Check for mixed | `value === figma.mixed` | Text nodes can have mixed fills |

**Paint object structure:**
```
{
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND" | "IMAGE",
  color: { r: 0-1, g: 0-1, b: 0-1 },   // for SOLID
  opacity: 0-1,
  visible: boolean,
  boundVariables?: { color: VariableAlias }
}
```

### 7. Text Operations

| Action | API | Notes |
|--------|-----|-------|
| Load font (required before edits) | `figma.loadFontAsync({ family, style })` | Must await before changing text |
| Set text content | `textNode.characters = "..."` | Requires font loaded |
| Set font size | `textNode.fontSize = n` | Number in px |
| Set font name | `textNode.fontName = { family, style }` | Requires font loaded |
| Set text decoration | `textNode.textDecoration = "UNDERLINE"` | `"NONE"`, `"UNDERLINE"`, `"STRIKETHROUGH"` |
| Set text case | `textNode.textCase = "UPPER"` | `"ORIGINAL"`, `"UPPER"`, `"LOWER"`, `"TITLE"` |
| Set line height | `textNode.lineHeight = { value, unit }` | `unit`: `"PIXELS"`, `"PERCENT"`, `"AUTO"` |
| Set letter spacing | `textNode.letterSpacing = { value, unit }` | `unit`: `"PIXELS"`, `"PERCENT"` |
| Set text align | `textNode.textAlignHorizontal = "LEFT"` | `"LEFT"`, `"CENTER"`, `"RIGHT"`, `"JUSTIFIED"` |
| Set text style | `textNode.textStyleId = styleId` | Apply a TextStyle |
| Get/set range styles | `textNode.setRangeFontSize(start, end, size)` | Per-character styling |

### 8. Component & Instance Operations

| Action | API | Notes |
|--------|-----|-------|
| Create instance | `component.createInstance()` | From a ComponentNode |
| Swap instance | `instance.swapComponent(newComponent)` | Replace underlying component |
| Get main component | `instance.mainComponent` | Returns `ComponentNode \| null` |
| Get component properties | `instance.componentProperties` | Read overrides |
| Set component properties | `instance.setProperties(props)` | Apply overrides |
| Detach instance | `instance.detachInstance()` | Converts to FrameNode |
| Import component by key | `figma.importComponentByKeyAsync(key)` | Import from team library |
| Get overrides | `instance.overrides` | Array of field overrides (fills, strokes, text, etc.) |

### 9. Style Operations

| Action | API | Returns |
|--------|-----|---------|
| Get style by ID | `figma.getStyleByIdAsync(id)` | `Promise<BaseStyle \| null>` |
| Get local paint styles | `figma.getLocalPaintStylesAsync()` | `Promise<PaintStyle[]>` |
| Get local text styles | `figma.getLocalTextStylesAsync()` | `Promise<TextStyle[]>` |
| Get local effect styles | `figma.getLocalEffectStylesAsync()` | `Promise<EffectStyle[]>` |
| Get local grid styles | `figma.getLocalGridStylesAsync()` | `Promise<GridStyle[]>` |
| Create paint style | `figma.createPaintStyle()` | `PaintStyle` |
| Create text style | `figma.createTextStyle()` | `TextStyle` |
| Create effect style | `figma.createEffectStyle()` | `EffectStyle` |
| Create grid style | `figma.createGridStyle()` | `GridStyle` |
| Import style by key | `figma.importStyleByKeyAsync(key)` | Import from team library |
| Delete style | `style.remove()` | — |
| Set style name | `style.name = "..."` | — |
| Set style paints | `paintStyle.paints = [paint]` | — |

### 10. Variable Operations

| Action | API | Returns |
|--------|-----|---------|
| Get local variable collections | `figma.variables.getLocalVariableCollectionsAsync()` | `Promise<VariableCollection[]>` |
| Get collection by ID | `figma.variables.getVariableCollectionByIdAsync(id)` | `Promise<VariableCollection \| null>` |
| Get variable by ID | `figma.variables.getVariableByIdAsync(id)` | `Promise<Variable \| null>` |
| Get local variables (by type) | `figma.variables.getLocalVariablesAsync(type?)` | `Promise<Variable[]>` — type: `"BOOLEAN"`, `"FLOAT"`, `"STRING"`, `"COLOR"` |
| Create variable | `figma.variables.createVariable(name, collection, resolvedType)` | `Variable` |
| Create variable collection | `figma.variables.createVariableCollection(name)` | `VariableCollection` |
| Set variable value for mode | `variable.setValueForMode(modeId, value)` | — value can be literal or `VariableAlias` |
| Remove variable | `variable.remove()` | — |
| Remove collection | `collection.remove()` | — |
| Rename variable | `variable.name = "..."` | — |
| Bind variable to paint color | `figma.variables.setBoundVariableForPaint(paint, "color", variable)` | New `Paint` with bound variable |
| Import variable by key | `figma.variables.importVariableByKeyAsync(key)` | Import from team library |
| Get bound variables on node | `node.boundVariables` | Object with variable bindings per property |

**Variable alias (referencing another variable):**
```
{
  type: "VARIABLE_ALIAS",
  id: "VariableID:..."
}
```

**Variable resolved types:** `"BOOLEAN"`, `"FLOAT"`, `"STRING"`, `"COLOR"`

### 11. Team Library Operations

| Action | API | Returns |
|--------|-----|---------|
| Get available library variable collections | `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` | `Promise<LibraryVariableCollection[]>` |
| Get variables in library collection | `figma.teamLibrary.getVariablesInLibraryCollectionAsync(key)` | `Promise<LibraryVariable[]>` |
| Import variable by key | `figma.variables.importVariableByKeyAsync(key)` | `Promise<Variable>` |
| Import component by key | `figma.importComponentByKeyAsync(key)` | `Promise<ComponentNode>` |
| Import style by key | `figma.importStyleByKeyAsync(key)` | `Promise<BaseStyle>` |

### 12. Variable Modes

| Action | API | Notes |
|--------|-----|-------|
| Get collection modes | `collection.modes` | `Array<{ modeId: string, name: string }>` |
| Add mode | `collection.addMode(name)` | Returns `string` (modeId) |
| Remove mode | `collection.removeMode(modeId)` | — |
| Rename mode | `collection.renameMode(modeId, name)` | — |
| Set explicit mode on page | `page.setExplicitVariableModeForCollection(collection, modeId)` | Force a mode on a page |
| Clear explicit mode | `page.clearExplicitVariableModeForCollection(collection)` | — |

### 13. Auto Layout

| Action | API | Notes |
|--------|-----|-------|
| Set layout mode | `frame.layoutMode = "HORIZONTAL" \| "VERTICAL" \| "NONE"` | Enable/disable auto layout |
| Set padding | `frame.paddingTop/Right/Bottom/Left = n` | In pixels |
| Set item spacing | `frame.itemSpacing = n` | Gap between children |
| Set counter axis sizing | `frame.counterAxisSizingMode = "FIXED" \| "AUTO"` | — |
| Set primary axis sizing | `frame.primaryAxisSizingMode = "FIXED" \| "AUTO"` | — |
| Set alignment | `frame.primaryAxisAlignItems`, `frame.counterAxisAlignItems` | `"MIN"`, `"CENTER"`, `"MAX"`, `"SPACE_BETWEEN"` |
| Set layout align (child) | `child.layoutAlign = "STRETCH" \| "INHERIT"` | Child alignment |
| Set layout grow (child) | `child.layoutGrow = 0 \| 1` | Fill container |

### 14. Effects & Blending

| Action | API | Notes |
|--------|-----|-------|
| Set effects | `node.effects = [effect]` | Array of `Effect` objects |
| Set blend mode | `node.blendMode = "NORMAL"` | `"MULTIPLY"`, `"SCREEN"`, `"OVERLAY"`, etc. |
| Set effect style | `node.effectStyleId = styleId` | Apply an EffectStyle |

**Effect types:** `"DROP_SHADOW"`, `"INNER_SHADOW"`, `"LAYER_BLUR"`, `"BACKGROUND_BLUR"`

### 15. Export

| Action | API | Returns |
|--------|-----|---------|
| Export node as bytes | `node.exportAsync(settings?)` | `Promise<Uint8Array>` |
| Export settings | `{ format: "PNG" \| "JPG" \| "SVG" \| "PDF", constraint?: { type, value } }` | — |
| Get export settings | `node.exportSettings` | Configured exports |

### 16. UI & Communication (Plugin ↔ UI)

| Action | API | Notes |
|--------|-----|-------|
| Show UI | `figma.showUI(html, options?)` | Opens the plugin UI panel |
| Post message to UI | `figma.ui.postMessage(data)` | Main thread → UI |
| Listen to UI messages | `figma.ui.onmessage = (msg) => {}` | UI → Main thread |
| Resize UI | `figma.ui.resize(width, height)` | — |
| Close plugin | `figma.closePlugin(message?)` | — |

### 17. Notifications & User Feedback

| Action | API | Notes |
|--------|-----|-------|
| Show notification | `figma.notify(message, options?)` | Toast notification. Options: `{ timeout, error, button }` |
| Get current user | `figma.currentUser` | `{ id, name, photoUrl, color }` or `null` |

### 18. Client Storage (Persistent Data)

| Action | API | Returns |
|--------|-----|---------|
| Get stored value | `figma.clientStorage.getAsync(key)` | `Promise<any>` — per-plugin, per-user persistent storage |
| Set stored value | `figma.clientStorage.setAsync(key, value)` | `Promise<void>` |
| Delete stored value | `figma.clientStorage.deleteAsync(key)` | `Promise<void>` |
| Get all keys | `figma.clientStorage.keysAsync()` | `Promise<string[]>` |

### 19. Timer / Parameters / Misc

| Action | API | Notes |
|--------|-----|-------|
| Listen to run event | `figma.on("run", callback)` | Plugin launch |
| Listen to close event | `figma.on("close", callback)` | Plugin closing |
| Listen to selection change | `figma.on("selectionchange", callback)` | Selection updated |
| Listen to page change | `figma.on("currentpagechange", callback)` | Page switched |
| Listen to document change | `figma.on("documentchange", callback)` | Any document mutation |
| Listen to timer | `figma.on("timer", callback)` | Timer ticks |
| Set relaunch data | `node.setRelaunchData({ command: description })` | Quick-action button on nodes |
| Get file key | `figma.fileKey` | `string \| null` |

---

## Node Properties (Common)

Properties available on most `SceneNode` types:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique node identifier |
| `name` | `string` | Layer name |
| `type` | `string` | Node type string (see tables above) |
| `visible` | `boolean` | Visibility |
| `locked` | `boolean` | Lock state |
| `opacity` | `number` | 0–1 |
| `x`, `y` | `number` | Position relative to parent |
| `width`, `height` | `number` | Dimensions (read-only — use `resize()`) |
| `rotation` | `number` | Rotation in degrees |
| `fills` | `Paint[]` | Fill paints |
| `strokes` | `Paint[]` | Stroke paints |
| `effects` | `Effect[]` | Drop shadow, blur, etc. |
| `constraints` | `Constraints` | Horizontal/vertical constraints |
| `layoutAlign` | `string` | Auto layout alignment |
| `layoutGrow` | `number` | Auto layout grow |
| `parent` | `BaseNode \| null` | Parent node |
| `children` | `SceneNode[]` | Child nodes (container nodes only) |
| `fillStyleId` | `string` | Bound PaintStyle ID |
| `strokeStyleId` | `string` | Bound PaintStyle ID |
| `textStyleId` | `string` | Bound TextStyle ID (TextNode) |
| `effectStyleId` | `string` | Bound EffectStyle ID |
| `boundVariables` | `object` | Variable bindings per property |
| `componentPropertyReferences` | `object` | Component property refs (InstanceNode) |
| `overrides` | `array` | Override data (InstanceNode) |
| `mainComponent` | `ComponentNode` | Main component reference (InstanceNode) |
| `absoluteTransform` | `Transform` | Absolute position matrix |
| `absoluteRenderBounds` | `Rect \| null` | Bounding box in absolute coords |

---

## Quick Reference Table

All `.type` string values:

| String | Node Type |
|--------|-----------|
| `"DOCUMENT"` | DocumentNode |
| `"PAGE"` | PageNode |
| `"FRAME"` | FrameNode |
| `"GROUP"` | GroupNode |
| `"COMPONENT"` | ComponentNode |
| `"COMPONENT_SET"` | ComponentSetNode |
| `"INSTANCE"` | InstanceNode |
| `"RECTANGLE"` | RectangleNode |
| `"ELLIPSE"` | EllipseNode |
| `"LINE"` | LineNode |
| `"POLYGON"` | PolygonNode |
| `"STAR"` | StarNode |
| `"VECTOR"` | VectorNode |
| `"BOOLEAN_OPERATION"` | BooleanOperationNode |
| `"TEXT"` | TextNode |
| `"SLICE"` | SliceNode |
| `"SECTION"` | SectionNode |
| `"STICKY"` | StickyNode |
| `"CONNECTOR"` | ConnectorNode |
| `"SHAPE_WITH_TEXT"` | ShapeWithTextNode |
| `"WIDGET"` | WidgetNode |

---

## Usage in This Plugin

Our tools use these APIs extensively:

- **Variable operations** — batch rename, export/import, replace usages, create linked colors, view color chains
- **Style operations** — scan for legacy paint styles, get style info for color usages
- **Node traversal** — `findAll`, `findAllWithCriteria`, selection-based scoping
- **Component operations** — library swap uses `importComponentByKeyAsync`, `swapComponent`, overrides
- **Team library** — importing variables and components from published libraries
- **UI communication** — all tools use `postMessage`/`onmessage` for main-thread ↔ UI data flow
- **Client storage** — persisting user settings and import caches across sessions

_Always check the latest [Figma Plugin API documentation](https://www.figma.com/plugin-docs/) for updates, especially as new node types, properties, or API methods are released._
