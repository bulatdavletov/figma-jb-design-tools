
# Object Types and Resources in Figma

This guide summarizes the main object node types and key reusable resources (such as Color Styles, Text Styles, and Variables) you may encounter when building Figma Automations or Plugins. For the full, canonical list and up-to-date definitions, refer to the official [Figma Plugin API documentation](https://www.figma.com/plugin-docs/api/properties/nodetype/).

---

## Node/Object Hierarchy (on Canvas)

- **DocumentNode** _(the root)_: Contains all Pages. “document”
- **PageNode**: Canvas workspace; contains Frames, Groups, etc. Only Pages are direct children of Document. “page”
- **FrameNode**: General-purpose container; can be artboards, groups, component set parents; nestable. “frame”
- **GroupNode**: Visual grouping; flattens transforms; mostly presentational. “group”
- **ComponentNode**: Defines a reusable base component; instances may be created. “component”
- **ComponentSetNode**: Represents a variant set organizing related ComponentNodes as variants. “component_set”
- **InstanceNode**: Instance of a ComponentNode or ComponentSetNode. “instance”

### Most Common Drawable/Leaf Node Types

- **RectangleNode** — “rectangle”
- **LineNode** — “line”
- **EllipseNode** — “ellipse”
- **PolygonNode** — “polygon”
- **StarNode** — “star”
- **VectorNode** _(arbitrary SVG path)_ — “vector”
- **TextNode** _(editable text content)_ — “text”
- **StickyNode** _(FigJam sticky note)_ — “sticky”

### Special/Other Nodes

- **BooleanOperationNode**: Boolean groups (Unions, Subtract, etc.) — “boolean_operation”
- **SliceNode**: Export slices — “slice”
- **SectionNode**: Visual sections for layouts — “section”
- **ConnectorNode**: FigJam sticky connectors — “connector”
- **WidgetNode**: Nodes created by Figma/Plugin widgets — “widget”
- **ShapeWithTextNode**: FigJam shapes with text — “shape_with_text”

---

## Node Type String Values

- `"DOCUMENT"`, `"PAGE"`, `"FRAME"`, `"GROUP"`, `"COMPONENT"`, `"COMPONENT_SET"`, `"INSTANCE"`, `"RECTANGLE"`, `"ELLIPSE"`, `"LINE"`, `"POLYGON"`, `"STAR"`, `"VECTOR"`, `"BOOLEAN_OPERATION"`, `"SLICE"`, `"TEXT"`, `"SECTION"`, `"STICKY"`, `"CONNECTOR"`, `"WIDGET"`, `"SHAPE_WITH_TEXT"`

Values above correspond to the `.type` property of nodes, which is always a string.

---

## Styles and Variables (Non-Node: Reusable Resources)

These are not nodes on the canvas, but document resources referenced by nodes:

### Color Style

- **PaintStyle** _(Color Style)_: Reusable named color, defined in the document. Holds paints (solid, linear/radial/diamond gradient, image). Nodes reference styles by `fillStyleId` or `strokeStyleId`.

### Text Style

- **TextStyle**: Stores font family/weight/size, etc. Nodes reference by `textStyleId`. Managed via the Styles panel.

### Effect Style

- **EffectStyle**: Reusable shadows, blurs, and layer effects. Nodes reference by `effectStyleId`.

### Grid Style

- **GridStyle**: Reusable layout grid presets. Nodes reference by `gridStyleId`.

### Variable

- **Variable**: A named, global value (Color, Number, Boolean, String). Part of a Variable Collection. Referenced by nodes using variable binding (e.g., `boundVariables` property).

For styles, use the corresponding `Style` type and reference by ID (see [Figma documentation - Styles](https://www.figma.com/plugin-docs/api/styles/)). For variables, use `variableId` and refer to [Figma documentation - Variables](https://www.figma.com/plugin-docs/api/variable/).

---

## Usage Notes

- To check if an object is a style or variable, query the styles/variables in the document via Figma's API (these are not part of node trees).
- Nodes reference styles by ID (e.g., `fillStyleId`, `textStyleId`) and variables by `boundVariables`.
- For most general plugin operations, focus on Frame, Group, Component, Instance, Rectangle, Text, and Vector nodes (these make up most UIs).
- FigJam-only types: WidgetNode, StickyNode, ConnectorNode, ShapeWithTextNode.

---

## Automation Tool & Plugin Considerations

- When building Automation UIs, distinctly show style and variable resources as separate from frame/node types.
- When configuring actions (especially in JSON), always use the correct `node.type` string or Style/Variable ID for compatibility with the Figma API.
- Filter available actions/context offerings to only relevant node types or resource types per operation.

_Always check the latest Figma Plugin API documentation for updates, especially as new node types or resource types are released._

