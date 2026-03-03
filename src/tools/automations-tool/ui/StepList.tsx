import {
  Button,
  IconButton,
  IconCheck16,
  IconClose16,
  IconFrame16,
  IconGroup16,
  IconNumber16,
  IconPlus16,
  IconText16,
  Stack,
  Text,
} from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"
import { useState } from "preact/hooks"

import { IconArrowDown16, IconArrowUp16 } from "../../../../custom-icons/generated"
import { TokenText } from "../../../components/TokenPill"
import type { StepOutputPreviewPayload } from "../../../home/messages"
import type { AutomationStepPayload } from "../../../home/messages"
import { getParamSummary } from "../helpers"
/**/import { ACTION_DEFINITIONS, getValueKindBgColor, getValueKindColor, type ValueKind } from "../types"
import type { StepPath, ChildBranch } from "./types"
import { ACTIONS_WITH_CHILDREN } from "./types"
import { stepsPathEqual, pathExtend } from "./utils"

export function StepRow(props: {
  step: AutomationStepPayload
  index: number
  total: number
  selected: boolean
  stepOutput?: StepOutputPreviewPayload
  onSelect: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const def = ACTION_DEFINITIONS.find((d) => d.type === props.step.actionType)
  const label = def?.label ?? props.step.actionType
  const paramSummary = getParamSummary(props.step)
  const so = props.stepOutput

  const statusColor = so?.status === "success"
    ? "var(--figma-color-text-success)"
    : so?.status === "error"
      ? "var(--figma-color-text-danger)"
      : so?.status === "skipped"
        ? "var(--figma-color-text-secondary)"
        : undefined

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={props.onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 4px",
        borderRadius: 4,
        background: props.selected
          ? "var(--figma-color-bg-selected)"
          : hovered
            ? "var(--figma-color-bg-hover)"
            : "transparent",
        opacity: props.step.enabled ? 1 : 0.5,
        cursor: "pointer",
      }}
    >
      {/* Output type icon column */}
      <div
        style={{
          width: 16,
          flexShrink: 0,
          alignSelf: "flex-start",
          paddingTop: 1,
        }}
      >
        {def?.outputType ? (
          <span
            style={{
              width: 16,
              height: 16,
              color: getValueKindColor(def.outputType),
              background: getValueKindBgColor(def.outputType),
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            <ValueKindIcon kind={def.outputType} />
          </span>
        ) : (
          <span style={{ width: 16, height: 16, display: "inline-block" }} />
        )}
      </div>
      {/* Run status dot */}
      {statusColor && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: statusColor,
            flexShrink: 0,
          }}
          title={so ? `${so.status} — ${so.nodesAfter} nodes, ${so.durationMs}ms` : ""}
        />
      )}
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "start", gap: 8, fontSize: 11, color: "var(--figma-color-text)" }}>
          <span>{label}</span>
          {so && (
            <span style={{ fontSize: 9, color: "var(--figma-color-text-tertiary)" }}>
              {so.nodesAfter} {so.nodesAfter === 1 ? "node" : "nodes"}
            </span>
          )}
        </div>
        {/* Param summary */}
        {paramSummary && (
          <div
            style={{
              fontSize: 10,
              color: "var(--figma-color-text-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: 1,
            }}
          >
            <TokenText text={paramSummary} />
          </div>
        )}
        {/* Target/output chips */}
        {(props.step.input || props.step.outputName) && (
          <div
            style={{
              fontSize: 9,
              color: "var(--figma-color-text-brand)",
              marginTop: 1,
              display: "flex",
              gap: 4,
            }}
          >
            {props.step.input && <span><TokenText text={`{#${props.step.input}}`} /> →</span>}
            {props.step.outputName && <span>→ <TokenText text={`{${def?.producesData ? "$" : "#"}${props.step.outputName}}`} /></span>}
          </div>
        )}
      </div>
      {/* Row actions */}
      {hovered && (
        <div
          style={{ display: "flex", gap: 2, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {props.index > 0 && (
            <IconButton onClick={props.onMoveUp}>
              <IconArrowUp16 />
            </IconButton>
          )}
          {props.index < props.total - 1 && (
            <IconButton onClick={props.onMoveDown}>
              <IconArrowDown16 />
            </IconButton>
          )}
          <IconButton onClick={props.onRemove}>
            <IconClose16 />
          </IconButton>
        </div>
      )}
    </div>
  )
}

function ValueKindIcon(props: { kind: ValueKind }) {
  switch (props.kind) {
    case "nodes":
      return <IconFrame16 />
    case "text":
      return <IconText16 />
    case "number":
      return <IconNumber16 />
    case "boolean":
      return <IconCheck16 />
    case "list":
      return <IconGroup16 />
    default:
      return null
  }
}

export function ChildrenBlock(props: {
  parentPath: StepPath
  children: AutomationStepPayload[]
  selectedPath: StepPath | null
  stepOutputs: StepOutputPreviewPayload[]
  branch: ChildBranch
  label?: string
  onSelectStep: (path: StepPath) => void
  onRemoveStep: (path: StepPath) => void
  onMoveStep: (path: StepPath, direction: -1 | 1) => void
  onRequestAddChild: (parentPath: StepPath, branch: ChildBranch) => void
}) {
  return (
    <div
      style={{
        marginLeft: 16,
        borderLeft: "2px solid var(--figma-color-border)",
        paddingLeft: 8,
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      {props.label && (
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--figma-color-text-secondary)",
            padding: "2px 4px 4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {props.label}
        </div>
      )}
      {props.children.length === 0 ? (
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-tertiary)",
            padding: "4px 4px",
          }}
        >
          No child steps
        </div>
      ) : (
        <Stack space="extraSmall">
          {props.children.map((child, childIdx) => {
            const childPath = pathExtend(props.parentPath, childIdx, props.branch)
            return (
              <Fragment key={child.id}>
                <StepRow
                  step={child}
                  index={childIdx}
                  total={props.children.length}
                  selected={stepsPathEqual(props.selectedPath, childPath)}
                  stepOutput={props.stepOutputs.find((so) => so.stepId === child.id)}
                  onSelect={() => props.onSelectStep(childPath)}
                  onRemove={() => props.onRemoveStep(childPath)}
                  onMoveUp={() => props.onMoveStep(childPath, -1)}
                  onMoveDown={() => props.onMoveStep(childPath, 1)}
                />
                {ACTIONS_WITH_CHILDREN.includes(child.actionType) && (
                  <>
                    {child.actionType === "ifCondition" && (
                      <>
                        <ChildrenBlock
                          parentPath={childPath}
                          children={child.children ?? []}
                          selectedPath={props.selectedPath}
                          stepOutputs={props.stepOutputs}
                          branch="then"
                          label="Then"
                          onSelectStep={props.onSelectStep}
                          onRemoveStep={props.onRemoveStep}
                          onMoveStep={props.onMoveStep}
                          onRequestAddChild={props.onRequestAddChild}
                        />
                        <ChildrenBlock
                          parentPath={childPath}
                          children={child.elseChildren ?? []}
                          selectedPath={props.selectedPath}
                          stepOutputs={props.stepOutputs}
                          branch="else"
                          label="Otherwise"
                          onSelectStep={props.onSelectStep}
                          onRemoveStep={props.onRemoveStep}
                          onMoveStep={props.onMoveStep}
                          onRequestAddChild={props.onRequestAddChild}
                        />
                      </>
                    )}
                    {child.actionType !== "ifCondition" && (
                      <ChildrenBlock
                        parentPath={childPath}
                        children={child.children ?? []}
                        selectedPath={props.selectedPath}
                        stepOutputs={props.stepOutputs}
                        branch="then"
                        onSelectStep={props.onSelectStep}
                        onRemoveStep={props.onRemoveStep}
                        onMoveStep={props.onMoveStep}
                        onRequestAddChild={props.onRequestAddChild}
                      />
                    )}
                  </>
                )}
              </Fragment>
            )
          })}
        </Stack>
      )}
      <div style={{ paddingTop: 4 }}>
        <Button
          secondary
          onClick={() => props.onRequestAddChild(props.parentPath, props.branch)}
          style={{ fontSize: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <IconPlus16 />
            <Text>Add child step</Text>
          </div>
        </Button>
      </div>
    </div>
  )
}
