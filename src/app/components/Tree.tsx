import { Fragment, h } from "preact"

import { IconChevronDown16 } from "./AppIcons"

export type TreeNode =
  | {
      kind?: "row"
      id: string
      title: string
      description?: string
      icon?: preact.ComponentChildren
      children?: Array<TreeNode>
      // If false, the node cannot be toggled (caret hidden) but children still render.
      collapsible?: boolean
      // Visual emphasis for main rows (e.g. variable name vs chain steps).
      titleStrong?: boolean
    }
  | {
      kind: "spacer"
      id: string
      height?: number
    }

type TreeProps = {
  nodes: Array<TreeNode>
  openById: Record<string, boolean>
  onToggle: (id: string) => void
}

function Caret(props: { open: boolean; showCaret: boolean }) {
  if (!props.showCaret) {
    return null
  }
  return (
    <div
      style={{
        width: 16,
        height: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--figma-color-icon)",
        // Use chevron-down rotated left when collapsed (like Disclosure)
        transform: props.open ? "rotate(0deg)" : "rotate(-90deg)",
        transformOrigin: "50% 50%",
      }}
    >
      <IconChevronDown16 />
    </div>
  )
}

function TreeRow(props: {
  level: number
  node: Extract<TreeNode, { kind?: "row" }>
  open: boolean
  onToggle: () => void
}) {
  const { node } = props
  const hasChildren = Array.isArray(node.children) && node.children.length > 0
  const isCollapsible = hasChildren && node.collapsible !== false

  const paddingLeft = props.level * 16
  const DEBUG_ROW_BOUNDS = false
  const BASE_SIDE_PADDING = 4

  const handleToggle = () => {
    if (!isCollapsible) return
    props.onToggle()
  }

  return (
    <div
      role={isCollapsible ? "button" : undefined}
      tabIndex={isCollapsible ? 0 : -1}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (!isCollapsible) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleToggle()
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 28,
        // ToolBody's Container provides the base inset.
        // Tree rows should only add indentation for nesting levels,
        // so top-level rows align with the header content.
        paddingLeft: `${BASE_SIDE_PADDING + paddingLeft}px`,
        paddingRight: `${BASE_SIDE_PADDING}px`,
        cursor: isCollapsible ? "pointer" : "default",
        userSelect: "none",
        backgroundColor: DEBUG_ROW_BOUNDS ? "rgba(255, 0, 0, 0.15)" : "transparent",
      }}
      title={isCollapsible ? "Click to expand" : undefined}
    >
      {isCollapsible ? <Caret open={props.open} showCaret={true} /> : null}

      <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {node.icon ?? null}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--figma-color-text)",
            fontWeight: node.titleStrong ? 600 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {node.title}
        </div>
      </div>

      {node.description ? (
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {node.description}
        </div>
      ) : null}
    </div>
  )
}

function TreeNodeView(props: {
  node: TreeNode
  level: number
  openById: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  if (props.node.kind === "spacer") {
    return <div style={{ height: props.node.height ?? 12 }} />
  }

  const hasChildren = Array.isArray(props.node.children) && props.node.children.length > 0
  const isCollapsible = hasChildren && props.node.collapsible !== false
  const open =
    isCollapsible && typeof props.openById[props.node.id] === "boolean"
      ? props.openById[props.node.id] === true
      : true

  return (
    <Fragment>
      <TreeRow level={props.level} node={props.node} open={open} onToggle={() => props.onToggle(props.node.id)} />
      {hasChildren && open
        ? props.node.children!.map((child) => (
            <TreeNodeView
              key={child.id}
              node={child}
              level={props.level + 1}
              openById={props.openById}
              onToggle={props.onToggle}
            />
          ))
        : null}
    </Fragment>
  )
}

export function Tree(props: TreeProps) {
  return (
    <Fragment>
      {props.nodes.map((node) => (
        <TreeNodeView key={node.id} node={node} level={0} openById={props.openById} onToggle={props.onToggle} />
      ))}
    </Fragment>
  )
}

