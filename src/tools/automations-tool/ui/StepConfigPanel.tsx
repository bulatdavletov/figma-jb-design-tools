import { Checkbox, Divider, Dropdown, Text, Textbox, TextboxMultiline, VerticalSpace } from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"

import { TokenInput, type Suggestion } from "../../../components/TokenInput"
import { TokenText } from "../../../components/TokenPill"
import { plural } from "../../../utils/pluralize"
import type { AutomationStepPayload, StepOutputPreviewPayload } from "../../../home/messages"
import {
  ACTION_DEFINITIONS,
  FILTER_FIELDS,
  VALID_NODE_TYPES,
  getOperatorsForField,
  getValueKindBgColor,
  getValueKindColor,
  getValueKindLabel,
  validateStep,
  type FilterCondition,
  type FilterField,
  type FilterLogic,
} from "../types"
import { buildInputSourceOptions, buildValueSourceOptions, renderInputContext } from "../helpers"
import { safeDropdownValue } from "./utils"
import { PROPERTY_REGISTRY } from "../properties"

export function StepConfigPanel(props: {
  step: AutomationStepPayload
  stepIndex: number
  allSteps: AutomationStepPayload[]
  parentStep?: AutomationStepPayload
  onUpdateParam: (key: string, value: unknown) => void
  onUpdateOutputName: (value: string) => void
  onUpdateTarget: (value: string) => void
  onRunToStep: () => void
  stepOutput?: StepOutputPreviewPayload
  suggestions: Suggestion[]
}) {
  const { step, stepIndex, allSteps, parentStep, onUpdateParam, onUpdateOutputName, onUpdateTarget, onRunToStep, stepOutput, suggestions } = props
  const def = ACTION_DEFINITIONS.find((d) => d.type === step.actionType)
  const showTargetDropdown = def && !["source", "output", "variables", "flow", "input"].includes(def.category)
  const targetOptions = buildInputSourceOptions(allSteps, stepIndex, false)
    .filter((o) => {
      const sDef = ACTION_DEFINITIONS.find((d) => d.type === allSteps.find((s) => s.outputName === o.value)?.actionType)
      return sDef?.producesData !== true
    })

  const validationIssues = validateStep(step, stepIndex, allSteps)

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
      {def && (
        <Fragment>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Text style={{ fontWeight: 600, fontSize: 12 }}>{def.label}</Text>
              {def.outputType && (
                <span
                  style={{
                    fontSize: 9,
                    color: getValueKindColor(def.outputType),
                    background: getValueKindBgColor(def.outputType),
                    padding: "1px 5px",
                    borderRadius: 3,
                    fontWeight: 500,
                  }}
                >
                  {getValueKindLabel(def.outputType)}
                </span>
              )}
            </div>
            <button
              onClick={onRunToStep}
              style={{
                background: "none",
                border: "1px solid var(--figma-color-border)",
                borderRadius: 4,
                padding: "2px 8px",
                cursor: "pointer",
                fontSize: 10,
                color: "var(--figma-color-text-secondary)",
                whiteSpace: "nowrap",
              }}
              title={`Run steps 1–${stepIndex + 1}`}
            >
              ▶ Run to here
            </button>
          </div>
          <VerticalSpace space="extraSmall" />
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            {def.description}
          </Text>
          {validationIssues.length > 0 && (
            <Fragment>
              <VerticalSpace space="small" />
              {validationIssues.map((issue, i) => (
                <div
                  key={i}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    marginBottom: 4,
                    background: issue.type === "error"
                      ? "var(--figma-color-bg-danger-tertiary, var(--figma-color-bg-secondary))"
                      : "var(--figma-color-bg-warning-tertiary, var(--figma-color-bg-secondary))",
                    border: `1px solid ${issue.type === "error"
                      ? "var(--figma-color-border-danger, var(--figma-color-border))"
                      : "var(--figma-color-border-warning, var(--figma-color-border))"}`,
                    color: issue.type === "error"
                      ? "var(--figma-color-text-danger)"
                      : "var(--figma-color-text-warning)",
                  }}
                >
                  {issue.message}
                </div>
              ))}
            </Fragment>
          )}
          <VerticalSpace space="medium" />
        </Fragment>
      )}
      {showTargetDropdown && targetOptions.length > 0 && (() => {
        const targetAllOptions = [{ value: "", text: "Previous step (default)" }, ...targetOptions]
        return (
          <Fragment>
            <Text style={{ fontSize: 11 }}>Target nodes</Text>
            <VerticalSpace space="extraSmall" />
            <Dropdown
              value={safeDropdownValue(step.target ?? "", targetAllOptions)}
              onValueChange={onUpdateTarget}
              options={targetAllOptions}
            />
            <VerticalSpace space="medium" />
          </Fragment>
        )
      })()}
      {renderStepParams(step, onUpdateParam, suggestions, allSteps, stepIndex, parentStep)}

      {!["repeatWithEach", "ifCondition", "stopAndOutput"].includes(step.actionType) && (
        <Fragment>
          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Output name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={step.outputName ?? ""}
            onValueInput={onUpdateOutputName}
            placeholder="Auto-generated if empty"
          />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)", marginTop: 4 }}>
            {def?.producesData
              ? "Saves the result as a data variable"
              : "Saves the current working set as a node snapshot"}
          </Text>
        </Fragment>
      )}
    </div>
    {stepOutput && (
      <StepOutputInspector output={stepOutput} />
    )}
    </div>
  )
}

function StepOutputInspector(props: { output: StepOutputPreviewPayload }) {
  const { output } = props
  const statusLabel =
    output.status === "success" ? "Success" :
    output.status === "error" ? "Error" :
    "Skipped"
  const statusColor =
    output.status === "success" ? "var(--figma-color-text-success)" :
    output.status === "error" ? "var(--figma-color-text-danger)" :
    "var(--figma-color-text-secondary)"

  const varEntries = Object.entries(output.pipelineVarsSnapshot)
  const setEntries = Object.entries(output.savedNodeSetsCount)

  return (
    <div
      style={{
        borderTop: "1px solid var(--figma-color-border)",
        flexShrink: 0,
        maxHeight: "50%",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "6px 12px",
          background: "var(--figma-color-bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: 11 }}>Last run output</Text>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: statusColor,
            }}
          />
          <Text style={{ fontSize: 10, color: statusColor }}>{statusLabel}</Text>
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            {output.durationMs}ms
          </Text>
        </div>
      </div>
      <div style={{ padding: "8px 12px" }}>
        {output.error && (
          <div style={{ fontSize: 10, color: "var(--figma-color-text-danger)", marginBottom: 6 }}>
            {output.error}
          </div>
        )}

        {output.message && !output.error && (
          <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)", marginBottom: 6 }}>
            <TokenText text={output.message} />
          </div>
        )}

        <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)", marginBottom: 4 }}>
          <b>{plural(output.nodesAfter, "node")}</b> in working set after this step
        </div>

        {output.nodeSample.length > 0 && (
          <div style={{
            background: "var(--figma-color-bg-secondary)",
            borderRadius: 4,
            padding: "4px 0",
            marginBottom: 6,
            maxHeight: 120,
            overflowY: "auto",
          }}>
            {output.nodeSample.map((node, i) => (
              <div
                key={node.id}
                style={{
                  padding: "2px 8px",
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{
                  color: "var(--figma-color-text-tertiary)",
                  fontSize: 9,
                  fontFamily: "monospace",
                  flexShrink: 0,
                }}>
                  {node.type}
                </span>
                <span style={{
                  color: "var(--figma-color-text)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {node.name}
                </span>
              </div>
            ))}
            {output.nodesAfter > output.nodeSample.length && (
              <div style={{
                padding: "2px 8px",
                fontSize: 10,
                color: "var(--figma-color-text-tertiary)",
                fontStyle: "italic",
              }}>
                + {output.nodesAfter - output.nodeSample.length} more
              </div>
            )}
          </div>
        )}

        {output.dataOutput !== undefined && (
          <Fragment>
            <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)", marginBottom: 2 }}>
              <b>Data output</b>
            </div>
            <div style={{
              background: "var(--figma-color-bg-secondary)",
              borderRadius: 4,
              padding: "4px 8px",
              marginBottom: 6,
              fontSize: 10,
              fontFamily: "monospace",
              wordBreak: "break-all",
              maxHeight: 80,
              overflowY: "auto",
              color: "var(--figma-color-text)",
            }}>
              {Array.isArray(output.dataOutput)
                ? output.dataOutput.map((v, i) => (
                    <div key={i}>{String(v)}</div>
                  ))
                : String(output.dataOutput)}
            </div>
          </Fragment>
        )}

        {varEntries.length > 0 && (
          <Fragment>
            <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)", marginBottom: 2 }}>
              <b>Variables</b>
            </div>
            <div style={{
              background: "var(--figma-color-bg-secondary)",
              borderRadius: 4,
              padding: "4px 8px",
              marginBottom: 6,
              fontSize: 10,
              maxHeight: 80,
              overflowY: "auto",
            }}>
              {varEntries.map(([key, val]) => (
                <div key={key} style={{ display: "flex", gap: 4 }}>
                  <span style={{ color: "var(--figma-color-text-brand)", flexShrink: 0 }}>
                    {key}
                  </span>
                  <span style={{
                    color: "var(--figma-color-text-tertiary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    = {val}
                  </span>
                </div>
              ))}
            </div>
          </Fragment>
        )}

        {setEntries.length > 0 && (
          <Fragment>
            <div style={{ fontSize: 10, color: "var(--figma-color-text-secondary)", marginBottom: 2 }}>
              <b>Snapshots</b>
            </div>
            <div style={{
              background: "var(--figma-color-bg-secondary)",
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 10,
            }}>
              {setEntries.map(([key, count]) => (
                <div key={key}>
                  {key}: {plural(count, "node")}
                </div>
              ))}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

function renderStepParams(
  step: AutomationStepPayload,
  updateParam: (key: string, value: unknown) => void,
  suggestions: Suggestion[] = [],
  allSteps: AutomationStepPayload[] = [],
  stepIndex: number = 0,
  parentStep?: AutomationStepPayload,
) {
  const inputCtx = renderInputContext(allSteps, stepIndex, parentStep)
  const inputCtxTokens = renderInputContext(allSteps, stepIndex, parentStep, { showTokens: true })

  switch (step.actionType) {
    case "sourceFromSelection":
      return (
        <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
          No parameters. Uses the current Figma selection as the working set.
        </Text>
      )

    case "sourceFromPage":
      return (
        <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
          No parameters. Loads all nodes from the current page (deep traversal).
        </Text>
      )

    case "sourceFromAllPages":
      return (
        <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
          No parameters. Loads all nodes from all pages in the document (deep traversal).
        </Text>
      )

    case "sourceFromPageByName":
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Page name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.pageName ?? "")}
            onValueInput={(v: string) => updateParam("pageName", v)}
            placeholder="Exact page name..."
          />
        </Fragment>
      )

    case "filter":
    case "filterByType":
    case "filterByName": {
      const logic = String(step.params.logic ?? "and") as FilterLogic
      const conditions = (step.params.conditions ?? []) as FilterCondition[]

      const updateCondition = (idx: number, field: string, value: unknown) => {
        const newConds = [...conditions]
        newConds[idx] = { ...newConds[idx], [field]: value }
        if (field === "field") {
          const fieldDef = FILTER_FIELDS.find((f) => f.key === value)
          const ops = getOperatorsForField(value as FilterField)
          newConds[idx].operator = ops[0].value
          if (fieldDef?.valueType === "boolean") newConds[idx].value = true
          else if (fieldDef?.valueType === "enum") newConds[idx].value = "TEXT"
          else if (fieldDef?.valueType === "number") newConds[idx].value = 0
          else newConds[idx].value = ""
        }
        updateParam("conditions", newConds)
      }
      const addCondition = () => {
        updateParam("conditions", [...conditions, { field: "name", operator: "contains", value: "" }])
      }
      const removeCondition = (idx: number) => {
        updateParam("conditions", conditions.filter((_: unknown, i: number) => i !== idx))
      }

      return (
        <Fragment>
          {renderInputContext(allSteps, stepIndex, parentStep, { nodesLabel: "Filtering" })}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: 600 }}>Match</Text>
            <Dropdown
              value={logic}
              options={[
                { value: "and", text: "ALL conditions (AND)" },
                { value: "or", text: "ANY condition (OR)" },
              ]}
              onValueChange={(v: string) => updateParam("logic", v)}
              style={{ flex: 1 }}
            />
          </div>
          {conditions.map((cond: FilterCondition, idx: number) => {
            const fieldDef = FILTER_FIELDS.find((f) => f.key === cond.field)
            const operators = getOperatorsForField(cond.field)
            return (
              <div key={idx} style={{
                display: "flex", gap: 4, alignItems: "flex-start", marginBottom: 4,
                padding: "4px 6px", background: "var(--figma-color-bg-secondary)", borderRadius: 4,
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Dropdown
                      value={cond.field}
                      options={FILTER_FIELDS.map((f) => ({ value: f.key, text: f.label }))}
                      onValueChange={(v: string) => updateCondition(idx, "field", v)}
                      style={{ flex: 1 }}
                    />
                    <Dropdown
                      value={cond.operator}
                      options={operators}
                      onValueChange={(v: string) => updateCondition(idx, "operator", v)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {fieldDef?.valueType === "enum" && cond.field === "type" ? (
                    <Dropdown
                      value={String(cond.value ?? "TEXT")}
                      options={VALID_NODE_TYPES.map((t) => ({ value: t }))}
                      onValueChange={(v: string) => updateCondition(idx, "value", v)}
                    />
                  ) : fieldDef?.valueType === "boolean" ? (
                    <Dropdown
                      value={String(cond.value ?? "true")}
                      options={[{ value: "true", text: "true" }, { value: "false", text: "false" }]}
                      onValueChange={(v: string) => updateCondition(idx, "value", v === "true")}
                    />
                  ) : (
                    <Textbox
                      value={String(cond.value ?? "")}
                      onValueInput={(v: string) => {
                        if (fieldDef?.valueType === "number") {
                          const n = Number(v)
                          updateCondition(idx, "value", isNaN(n) ? v : n)
                        } else {
                          updateCondition(idx, "value", v)
                        }
                      }}
                      placeholder={fieldDef?.valueType === "color" ? "#FF0000" : fieldDef?.valueType === "number" ? "0" : "Value..."}
                    />
                  )}
                </div>
                <button
                  onClick={() => removeCondition(idx)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
                    color: "var(--figma-color-text-tertiary)", fontSize: 14, lineHeight: 1,
                  }}
                  title="Remove condition"
                >
                  ×
                </button>
              </div>
            )
          })}
          <button
            onClick={addCondition}
            style={{
              background: "none", border: "1px dashed var(--figma-color-border)",
              borderRadius: 4, padding: "4px 8px", cursor: "pointer", width: "100%",
              color: "var(--figma-color-text-secondary)", fontSize: 11, marginTop: 4,
            }}
          >
            + Add condition
          </button>
        </Fragment>
      )
    }

    case "expandToChildren":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Replaces the working set with direct children of each node.
          </Text>
        </Fragment>
      )

    case "goToParent":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Replaces each node with its parent (deduplicated). Skips nodes at page root.
          </Text>
        </Fragment>
      )

    case "flattenDescendants":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Recursively collects all descendants into a flat list.
          </Text>
        </Fragment>
      )

    case "restoreNodes": {
      const snapshotOptions = buildInputSourceOptions(allSteps, stepIndex, false)
        .filter((o) => {
          const s = allSteps.find((st) => st.outputName === o.value)
          if (!s) return false
          const d = ACTION_DEFINITIONS.find((ad) => ad.type === s.actionType)
          return d?.producesData !== true
        })
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Input (node snapshot)</Text>
          <VerticalSpace space="extraSmall" />
          {(() => {
            if (snapshotOptions.length > 0) {
              const snapAllOptions = [{ value: "", text: "Select snapshot..." }, ...snapshotOptions]
              return (
                <Dropdown
                  value={safeDropdownValue(String(step.params.snapshotName ?? ""), snapAllOptions)}
                  options={snapAllOptions}
                  onValueChange={(v: string) => updateParam("snapshotName", v)}
                />
              )
            }
            return (
              <Textbox
                value={String(step.params.snapshotName ?? "")}
                onValueInput={(v: string) => updateParam("snapshotName", v)}
                placeholder="Name of saved node set"
              />
            )
          })()}
        </Fragment>
      )
    }

    case "renameLayers":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Find</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.find ?? "")}
            onValueInput={(v: string) => updateParam("find", v)}
            placeholder="Text to find..."
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Replace with</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.replace ?? "")}
            onValueInput={(v: string) => updateParam("replace", v)}
            placeholder="Replacement text... supports {name}, {index}"
            suggestions={suggestions}
          />
        </Fragment>
      )

    case "setFillColor":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Hex color</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.hex ?? "#000000")}
            onValueInput={(v: string) => updateParam("hex", v)}
            placeholder="#000000"
          />
        </Fragment>
      )

    case "setFillVariable":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.variableName ?? "")}
            onValueInput={(v: string) => updateParam("variableName", v)}
            placeholder="e.g. control-border-raised"
          />
        </Fragment>
      )

    case "setStrokeColor":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Hex color</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.hex ?? "#000000")}
            onValueInput={(v: string) => updateParam("hex", v)}
            placeholder="#000000"
          />
        </Fragment>
      )

    case "removeFills":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Clears all fills from nodes in the working set.
          </Text>
        </Fragment>
      )

    case "removeStrokes":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Clears all strokes from nodes in the working set.
          </Text>
        </Fragment>
      )

    case "setOpacity":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Opacity (%)</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.opacity ?? 100)}
            onValueInput={(v: string) => {
              const n = parseInt(v, 10)
              if (!isNaN(n)) updateParam("opacity", Math.max(0, Math.min(100, n)))
            }}
            placeholder="0–100"
          />
        </Fragment>
      )

    case "setVisibility":
      return (
        <Fragment>
          {inputCtx}
          <Dropdown
            value={step.params.visible === false ? "false" : "true"}
            options={[
              { value: "true", text: "Visible" },
              { value: "false", text: "Hidden" },
            ]}
            onValueChange={(v: string) => updateParam("visible", v === "true")}
          />
        </Fragment>
      )

    case "setLocked":
      return (
        <Fragment>
          {inputCtx}
          <Dropdown
            value={step.params.locked === false ? "false" : "true"}
            options={[
              { value: "true", text: "Locked" },
              { value: "false", text: "Unlocked" },
            ]}
            onValueChange={(v: string) => updateParam("locked", v === "true")}
          />
        </Fragment>
      )

    case "setName":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Name template</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.name ?? "")}
            onValueInput={(v: string) => updateParam("name", v)}
            placeholder="e.g. {type}/{name} or Item {index}"
            suggestions={suggestions}
          />
        </Fragment>
      )

    case "setRotation":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Degrees</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.degrees ?? "0")}
            onValueInput={(v: string) => updateParam("degrees", v)}
            placeholder="Rotation in degrees..."
            suggestions={suggestions}
          />
        </Fragment>
      )

    case "removeNode":
      return (
        <Fragment>
          {inputCtx}
          <div style={{
            padding: "6px 8px",
            background: "var(--figma-color-bg-danger-tertiary, var(--figma-color-bg-secondary))",
            border: "1px solid var(--figma-color-border-danger, var(--figma-color-border))",
            borderRadius: 4,
            color: "var(--figma-color-text-danger)",
            fontSize: 11,
          }}>
            Destructive action. Deleted nodes cannot be recovered within the automation. Use Figma's Undo (Ctrl+Z) if needed.
          </div>
        </Fragment>
      )

    case "cloneNode":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Duplicates each node. Working set becomes the new clones.
          </Text>
        </Fragment>
      )

    case "setCharacters": {
      const isInRepeat = parentStep?.actionType === "repeatWithEach"
      const repeatItemVar = isInRepeat ? String(parentStep.params.itemVar ?? "item") : null
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Text content</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.characters ?? "")}
            onValueInput={(v: string) => updateParam("characters", v)}
            placeholder={isInRepeat ? "Use current item token" : "Supports tokens from previous steps"}
            suggestions={suggestions}
          />
        </Fragment>
      )
    }

    case "setFontSize":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Size (px)</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.size ?? "16")}
            onValueInput={(v: string) => updateParam("size", v)}
            placeholder="Font size in pixels..."
            suggestions={suggestions}
          />
        </Fragment>
      )

    case "setFont":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Font family</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.family ?? "Inter")}
            onValueInput={(v: string) => updateParam("family", v)}
            placeholder="Inter"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Font style</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.style ?? "Regular")}
            onValueInput={(v: string) => updateParam("style", v)}
            placeholder="Regular"
          />
        </Fragment>
      )

    case "setTextAlignment":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Alignment</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.align ?? "LEFT")}
            options={[
              { value: "LEFT", text: "Left" },
              { value: "CENTER", text: "Center" },
              { value: "RIGHT", text: "Right" },
              { value: "JUSTIFIED", text: "Justified" },
            ]}
            onValueChange={(v: string) => updateParam("align", v)}
          />
        </Fragment>
      )

    case "setTextCase":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Text case</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.textCase ?? "ORIGINAL")}
            options={[
              { value: "ORIGINAL", text: "As typed" },
              { value: "UPPER", text: "UPPERCASE" },
              { value: "LOWER", text: "lowercase" },
              { value: "TITLE", text: "Title Case" },
            ]}
            onValueChange={(v: string) => updateParam("textCase", v)}
          />
        </Fragment>
      )

    case "setTextDecoration":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Decoration</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.decoration ?? "NONE")}
            options={[
              { value: "NONE", text: "None" },
              { value: "UNDERLINE", text: "Underline" },
              { value: "STRIKETHROUGH", text: "Strikethrough" },
            ]}
            onValueChange={(v: string) => updateParam("decoration", v)}
          />
        </Fragment>
      )

    case "setLineHeight":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Unit</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.unit ?? "AUTO")}
            options={[
              { value: "AUTO", text: "Auto" },
              { value: "PIXELS", text: "Pixels" },
              { value: "PERCENT", text: "Percent" },
            ]}
            onValueChange={(v: string) => updateParam("unit", v)}
          />
          {String(step.params.unit ?? "AUTO") !== "AUTO" && (
            <Fragment>
              <VerticalSpace space="small" />
              <Text style={{ fontSize: 11 }}>Value</Text>
              <VerticalSpace space="extraSmall" />
              <Textbox
                value={String(step.params.value ?? "")}
                onValueInput={(v: string) => updateParam("value", v)}
                placeholder={String(step.params.unit ?? "") === "PERCENT" ? "e.g. 150" : "e.g. 24"}
              />
            </Fragment>
          )}
        </Fragment>
      )

    case "resize": {
      const widthSrcOptions = buildValueSourceOptions(allSteps, stepIndex, "width")
      const heightSrcOptions = buildValueSourceOptions(allSteps, stepIndex, "height")
      const widthVal = String(step.params.width ?? "")
      const heightVal = String(step.params.height ?? "")
      const widthIsPreset = widthSrcOptions.some((o) => o.value !== "" && o.value === widthVal)
      const heightIsPreset = heightSrcOptions.some((o) => o.value !== "" && o.value === heightVal)
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Width</Text>
          <VerticalSpace space="extraSmall" />
          {widthSrcOptions.length > 1 && (
            <Fragment>
              <Dropdown
                value={widthIsPreset ? widthVal : ""}
                options={widthSrcOptions}
                onValueChange={(v: string) => updateParam("width", v)}
              />
              <VerticalSpace space="extraSmall" />
            </Fragment>
          )}
          {!widthIsPreset && (
            <TokenInput
              value={widthVal}
              onValueInput={(v: string) => updateParam("width", v)}
              placeholder="Leave empty to keep original"
              suggestions={suggestions}
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Height</Text>
          <VerticalSpace space="extraSmall" />
          {heightSrcOptions.length > 1 && (
            <Fragment>
              <Dropdown
                value={heightIsPreset ? heightVal : ""}
                options={heightSrcOptions}
                onValueChange={(v: string) => updateParam("height", v)}
              />
              <VerticalSpace space="extraSmall" />
            </Fragment>
          )}
          {!heightIsPreset && (
            <TokenInput
              value={heightVal}
              onValueInput={(v: string) => updateParam("height", v)}
              placeholder="Leave empty to keep original"
              suggestions={suggestions}
            />
          )}
        </Fragment>
      )
    }

    case "setPosition": {
      const xSrcOptions = buildValueSourceOptions(allSteps, stepIndex, "x")
      const ySrcOptions = buildValueSourceOptions(allSteps, stepIndex, "y")
      const xVal = String(step.params.x ?? "")
      const yVal = String(step.params.y ?? "")
      const xIsPreset = xSrcOptions.some((o) => o.value !== "" && o.value === xVal)
      const yIsPreset = ySrcOptions.some((o) => o.value !== "" && o.value === yVal)
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>X</Text>
          <VerticalSpace space="extraSmall" />
          {xSrcOptions.length > 1 && (
            <Fragment>
              <Dropdown
                value={xIsPreset ? xVal : ""}
                options={xSrcOptions}
                onValueChange={(v: string) => updateParam("x", v)}
              />
              <VerticalSpace space="extraSmall" />
            </Fragment>
          )}
          {!xIsPreset && (
            <TokenInput
              value={xVal}
              onValueInput={(v: string) => updateParam("x", v)}
              placeholder="Leave empty to keep original"
              suggestions={suggestions}
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Y</Text>
          <VerticalSpace space="extraSmall" />
          {ySrcOptions.length > 1 && (
            <Fragment>
              <Dropdown
                value={yIsPreset ? yVal : ""}
                options={ySrcOptions}
                onValueChange={(v: string) => updateParam("y", v)}
              />
              <VerticalSpace space="extraSmall" />
            </Fragment>
          )}
          {!yIsPreset && (
            <TokenInput
              value={yVal}
              onValueInput={(v: string) => updateParam("y", v)}
              placeholder="Leave empty to keep original"
              suggestions={suggestions}
            />
          )}
        </Fragment>
      )
    }

    case "wrapInFrame":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Auto layout (optional)</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.autoLayout ?? "")}
            options={[
              { value: "", text: "No auto layout" },
              { value: "VERTICAL", text: "Vertical" },
              { value: "HORIZONTAL", text: "Horizontal" },
            ]}
            onValueChange={(v: string) => updateParam("autoLayout", v)}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            Wraps each node in the working set into its own frame. The working set is replaced with the new frames.
          </Text>
        </Fragment>
      )

    case "wrapAllInFrame":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Frame name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.frameName ?? "Group")}
            onValueInput={(v: string) => updateParam("frameName", v)}
            placeholder="Group"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Auto layout</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.autoLayout ?? "VERTICAL")}
            options={[
              { value: "VERTICAL", text: "Vertical" },
              { value: "HORIZONTAL", text: "Horizontal" },
              { value: "", text: "None" },
            ]}
            onValueChange={(v: string) => updateParam("autoLayout", v)}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Item spacing</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.itemSpacing ?? "")}
            onValueInput={(v: string) => updateParam("itemSpacing", v)}
            placeholder="Leave empty for default"
          />
        </Fragment>
      )

    case "addAutoLayout":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Direction</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.direction ?? "VERTICAL")}
            options={[
              { value: "VERTICAL", text: "Vertical" },
              { value: "HORIZONTAL", text: "Horizontal" },
            ]}
            onValueChange={(v: string) => updateParam("direction", v)}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Item spacing (optional)</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.itemSpacing ?? "")}
            onValueInput={(v: string) => updateParam("itemSpacing", v)}
            placeholder="Leave empty for default"
          />
        </Fragment>
      )

    case "editAutoLayout":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)", marginBottom: 8 }}>
            Only affects nodes that already have auto layout. Leave fields empty to keep current values.
          </Text>
          <Text style={{ fontSize: 11 }}>Direction</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.direction ?? "")}
            options={[
              { value: "", text: "Keep current" },
              { value: "VERTICAL", text: "Vertical" },
              { value: "HORIZONTAL", text: "Horizontal" },
            ]}
            onValueChange={(v: string) => updateParam("direction", v)}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Item spacing</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.itemSpacing ?? "")}
            onValueInput={(v: string) => updateParam("itemSpacing", v)}
            placeholder="Leave empty to keep current"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Padding</Text>
          <VerticalSpace space="extraSmall" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            <Textbox
              value={String(step.params.paddingTop ?? "")}
              onValueInput={(v: string) => updateParam("paddingTop", v)}
              placeholder="Top"
            />
            <Textbox
              value={String(step.params.paddingRight ?? "")}
              onValueInput={(v: string) => updateParam("paddingRight", v)}
              placeholder="Right"
            />
            <Textbox
              value={String(step.params.paddingBottom ?? "")}
              onValueInput={(v: string) => updateParam("paddingBottom", v)}
              placeholder="Bottom"
            />
            <Textbox
              value={String(step.params.paddingLeft ?? "")}
              onValueInput={(v: string) => updateParam("paddingLeft", v)}
              placeholder="Left"
            />
          </div>
        </Fragment>
      )

    case "removeAutoLayout":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Removes auto layout from all frames and components in the working set.
          </Text>
        </Fragment>
      )

    case "detachInstance":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            No parameters. Converts instances to frames, detaching from their main component.
          </Text>
        </Fragment>
      )

    case "swapComponent":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Component name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.componentName ?? "")}
            onValueInput={(v: string) => updateParam("componentName", v)}
            placeholder="Target component name..."
          />
        </Fragment>
      )

    case "pasteComponentById":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Component ID / key</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.componentId ?? "")}
            onValueInput={(v: string) => updateParam("componentId", v)}
            placeholder="1:2 or library key, supports {$item}"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Position (optional)</Text>
          <VerticalSpace space="extraSmall" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            <Textbox
              value={String(step.params.x ?? "")}
              onValueInput={(v: string) => updateParam("x", v)}
              placeholder="X"
            />
            <Textbox
              value={String(step.params.y ?? "")}
              onValueInput={(v: string) => updateParam("y", v)}
              placeholder="Y"
            />
          </div>
        </Fragment>
      )

    case "askForInput": {
      const isMultiline = String(step.params.inputType ?? "text") === "textarea"
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Prompt label</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.label ?? "Enter text")}
            onValueInput={(v: string) => updateParam("label", v)}
            placeholder="Label shown to user"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Default value</Text>
          <VerticalSpace space="extraSmall" />
          {isMultiline ? (
            <TextboxMultiline
              value={String(step.params.defaultValue ?? "")}
              onValueInput={(v: string) => updateParam("defaultValue", v)}
              placeholder="Pre-filled value (optional)"
              rows={3}
            />
          ) : (
            <Textbox
              value={String(step.params.defaultValue ?? "")}
              onValueInput={(v: string) => updateParam("defaultValue", v)}
              placeholder="Pre-filled value (optional)"
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Placeholder</Text>
          <VerticalSpace space="extraSmall" />
          {isMultiline ? (
            <TextboxMultiline
              value={String(step.params.placeholder ?? "")}
              onValueInput={(v: string) => updateParam("placeholder", v)}
              placeholder="Placeholder text..."
              rows={3}
            />
          ) : (
            <Textbox
              value={String(step.params.placeholder ?? "")}
              onValueInput={(v: string) => updateParam("placeholder", v)}
              placeholder="Placeholder text..."
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Input type</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.inputType ?? "text")}
            options={[
              { value: "text", text: "Single line" },
              { value: "textarea", text: "Multi-line" },
            ]}
            onValueChange={(v: string) => updateParam("inputType", v)}
          />
        </Fragment>
      )
    }

    case "splitText": {
      const splitInputOptions = buildInputSourceOptions(allSteps, stepIndex, true)
      const splitAllOptions = [{ value: "", text: "Select input..." }, ...splitInputOptions]
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Input</Text>
          <VerticalSpace space="extraSmall" />
          {splitInputOptions.length > 0 ? (
            <Dropdown
              value={safeDropdownValue(String(step.params.sourceVar ?? ""), splitAllOptions)}
              options={splitAllOptions}
              onValueChange={(v: string) => updateParam("sourceVar", v)}
            />
          ) : (
            <Textbox
              value={String(step.params.sourceVar ?? "")}
              onValueInput={(v: string) => updateParam("sourceVar", v)}
              placeholder="Variable name (without $)"
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Delimiter</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.delimiter ?? "\\n")}
            options={[
              { value: "\\n", text: "Newline (\\n)" },
              { value: ",", text: "Comma (,)" },
              { value: ";", text: "Semicolon (;)" },
              { value: "\\t", text: "Tab (\\t)" },
            ]}
            onValueChange={(v: string) => updateParam("delimiter", v)}
          />
        </Fragment>
      )
    }

    case "math":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>X</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.x ?? "")}
            onValueInput={(v: string) => updateParam("x", v)}
            placeholder="Number or token"
            suggestions={suggestions}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Operation</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.operation ?? "add")}
            options={[
              { value: "add", text: "Plus (+)" },
              { value: "subtract", text: "Minus (−)" },
              { value: "multiply", text: "Multiply (×)" },
              { value: "divide", text: "Divide (÷)" },
            ]}
            onValueChange={(v: string) => updateParam("operation", v)}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Y</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.y ?? "")}
            onValueInput={(v: string) => updateParam("y", v)}
            placeholder="Number or token"
            suggestions={suggestions}
          />
        </Fragment>
      )

    case "repeatWithEach": {
      const repeatInputOptions = buildInputSourceOptions(allSteps, stepIndex, true)
      const repeatAllOptions = [{ value: "nodes", text: "Current nodes" }, ...repeatInputOptions]
      const source = safeDropdownValue(String(step.params.source ?? "nodes"), repeatAllOptions)
      const itemVar = String(step.params.itemVar ?? "item")
      const isListMode = source !== "nodes"
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Input</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={source}
            options={repeatAllOptions}
            onValueChange={(v: string) => updateParam("source", v)}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Item variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={itemVar}
            onValueInput={(v: string) => updateParam("itemVar", v)}
            placeholder="item"
          />
          {isListMode && (
            <Fragment>
              <VerticalSpace space="small" />
              <Text style={{ fontSize: 11 }}>On mismatch</Text>
              <VerticalSpace space="extraSmall" />
              <Dropdown
                value={String(step.params.onMismatch ?? "error")}
                options={[
                  { value: "error", text: "Error if different" },
                  { value: "repeatList", text: "Cycle list" },
                  { value: "skipExtra", text: "Skip extras" },
                ]}
                onValueChange={(v: string) => updateParam("onMismatch", v)}
              />
            </Fragment>
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Result after loop</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.resultMode ?? "originalNodes")}
            options={[
              { value: "originalNodes", text: "Keep original working set" },
              { value: "iterationResults", text: "Use iteration results" },
            ]}
            onValueChange={(v: string) => updateParam("resultMode", v)}
          />
          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            {isListMode ? (
              <Fragment>
                <b>List mode:</b> Pairs <TokenText text={`{$${source}}`} /> list items with working set nodes.
                Each iteration sets <TokenText text={`{$${itemVar}}`} /> to current list item and the
                working set to the paired node.
                <br /><br />
                Use <TokenText text={`{$${itemVar}}`} /> in child steps to access the current item value.
                <br />
                Use <TokenText text="{$repeatIndex}" /> for the current iteration index.
                <br /><br />
                <b>On mismatch</b> controls what happens when list size ≠ node count:
                <br />• Error — stops execution
                <br />• Cycle list — repeats list items from the start
                <br />• Skip extras — iterates min(list, nodes) times
              </Fragment>
            ) : (
              <Fragment>
                <b>Nodes mode:</b> Iterates each node in the working set one at a time.
                <br /><br />
                Use <TokenText text="{$repeatIndex}" /> for the current iteration index.
                <br />
                Use <TokenText text="{name}" />, <TokenText text="{type}" /> etc. in child steps to access current node properties.
              </Fragment>
            )}
          </Text>
        </Fragment>
      )
    }

    case "ifCondition": {
      const conditionOperators = [
        { value: "equals", text: "equals" },
        { value: "notEquals", text: "not equals" },
        { value: "greaterThan", text: "greater than" },
        { value: "lessThan", text: "less than" },
        { value: "greaterOrEqual", text: "greater or equal" },
        { value: "lessOrEqual", text: "less or equal" },
        { value: "contains", text: "contains" },
        { value: "notContains", text: "not contains" },
        { value: "isEmpty", text: "is empty" },
        { value: "isNotEmpty", text: "is not empty" },
      ]
      const operator = String(step.params.operator ?? "equals")
      const isUnary = operator === "isEmpty" || operator === "isNotEmpty"
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Left value</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.left ?? "")}
            onValueInput={(v: string) => updateParam("left", v)}
            placeholder="Value or token (e.g. {count})"
            suggestions={suggestions}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Operator</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={operator}
            options={conditionOperators}
            onValueChange={(v: string) => updateParam("operator", v)}
          />
          {!isUnary && (
            <Fragment>
              <VerticalSpace space="small" />
              <Text style={{ fontSize: 11 }}>Right value</Text>
              <VerticalSpace space="extraSmall" />
              <TokenInput
                value={String(step.params.right ?? "")}
                onValueInput={(v: string) => updateParam("right", v)}
                placeholder="Value or token"
                suggestions={suggestions}
              />
            </Fragment>
          )}
          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            Add child steps in the <b>Then</b> block (runs when condition is true)
            and optionally in the <b>Otherwise</b> block (runs when false).
            <br /><br />
            Tip: Use <TokenText text="{count}" /> for working set size,{" "}
            <TokenText text="{$variable}" /> for variables.
          </Text>
        </Fragment>
      )
    }

    case "chooseFromList": {
      const chooseInputOptions = buildInputSourceOptions(allSteps, stepIndex, true)
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Prompt</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.label ?? "Choose an option")}
            onValueInput={(v: string) => updateParam("label", v)}
            placeholder="Choose an option"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Source list variable</Text>
          <VerticalSpace space="extraSmall" />
          {chooseInputOptions.length > 0 ? (
            <Dropdown
              value={safeDropdownValue(String(step.params.sourceVar ?? ""), [{ value: "", text: "None" }, ...chooseInputOptions])}
              options={[{ value: "", text: "None" }, ...chooseInputOptions]}
              onValueChange={(v: string) => updateParam("sourceVar", v)}
            />
          ) : (
            <Textbox
              value={String(step.params.sourceVar ?? "")}
              onValueInput={(v: string) => updateParam("sourceVar", v)}
              placeholder="Variable name"
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Static options (comma-separated)</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.options ?? "")}
            onValueInput={(v: string) => updateParam("options", v)}
            placeholder="Option A, Option B, Option C"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            If a source list variable is set, its items are used as options.
            Otherwise, static options are used.
          </Text>
        </Fragment>
      )
    }

    case "mapList": {
      const mapInputOptions = buildInputSourceOptions(allSteps, stepIndex, true)
      const mapAllOptions = [...mapInputOptions]
      const mapSource = safeDropdownValue(String(step.params.source ?? ""), mapAllOptions.length > 0 ? mapAllOptions : [{ value: "", text: "No lists available" }])
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Source list</Text>
          <VerticalSpace space="extraSmall" />
          {mapAllOptions.length > 0 ? (
            <Dropdown
              value={mapSource}
              options={mapAllOptions}
              onValueChange={(v: string) => updateParam("source", v)}
            />
          ) : (
            <Textbox
              value={String(step.params.source ?? "")}
              onValueInput={(v: string) => updateParam("source", v)}
              placeholder="List variable name"
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Item variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.itemVar ?? "item")}
            onValueInput={(v: string) => updateParam("itemVar", v)}
            placeholder="item"
          />
          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            Runs child steps for each item in the list.
            The last data-producing child step's output is collected into a new list.
            <br /><br />
            Use <TokenText text={`{$${String(step.params.itemVar ?? "item")}}`} /> for the current item,{" "}
            <TokenText text="{$repeatIndex}" /> for the index.
          </Text>
        </Fragment>
      )
    }

    case "reduceList": {
      const reduceInputOptions = buildInputSourceOptions(allSteps, stepIndex, true)
      const reduceAllOptions = [...reduceInputOptions]
      const reduceSource = safeDropdownValue(String(step.params.source ?? ""), reduceAllOptions.length > 0 ? reduceAllOptions : [{ value: "", text: "No lists available" }])
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Source list</Text>
          <VerticalSpace space="extraSmall" />
          {reduceAllOptions.length > 0 ? (
            <Dropdown
              value={reduceSource}
              options={reduceAllOptions}
              onValueChange={(v: string) => updateParam("source", v)}
            />
          ) : (
            <Textbox
              value={String(step.params.source ?? "")}
              onValueInput={(v: string) => updateParam("source", v)}
              placeholder="List variable name"
            />
          )}
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Item variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.itemVar ?? "item")}
            onValueInput={(v: string) => updateParam("itemVar", v)}
            placeholder="item"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Accumulator variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.accumulatorVar ?? "result")}
            onValueInput={(v: string) => updateParam("accumulatorVar", v)}
            placeholder="result"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Initial value</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.initialValue ?? "0")}
            onValueInput={(v: string) => updateParam("initialValue", v)}
            placeholder="0"
            suggestions={suggestions}
          />
          <VerticalSpace space="medium" />
          <Divider />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            Iterates through the list, accumulating a single result.
            Use child steps (e.g. Math, Set variable) to update the accumulator each iteration.
            <br /><br />
            Use <TokenText text={`{$${String(step.params.itemVar ?? "item")}}`} /> for the current item,{" "}
            <TokenText text={`{$${String(step.params.accumulatorVar ?? "result")}}`} /> for the accumulator,{" "}
            <TokenText text="{$repeatIndex}" /> for the index.
          </Text>
        </Fragment>
      )
    }

    case "stopAndOutput":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Message</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.message ?? "")}
            onValueInput={(v: string) => updateParam("message", v)}
            placeholder="Optional stop message"
            suggestions={suggestions}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
            Stops the workflow immediately. Useful inside If blocks for early exit.
          </Text>
        </Fragment>
      )

    case "notify":
    case "log":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Message</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.message ?? "")}
            onValueInput={(v: string) => updateParam("message", v)}
            placeholder="Supports tokens from previous steps"
            suggestions={suggestions}
          />
        </Fragment>
      )

    case "count": {
      return (
        <Fragment>
          {renderInputContext(allSteps, stepIndex, parentStep, { nodesLabel: "Counting" })}
          <Text style={{ fontSize: 11 }}>Label</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.label ?? "Count")}
            onValueInput={(v: string) => updateParam("label", v)}
            placeholder="Count label"
          />
        </Fragment>
      )
    }

    case "selectResults":
      return (
        <Fragment>
          {renderInputContext(allSteps, stepIndex, parentStep, { nodesLabel: "Selecting" })}
          <Checkbox
            value={step.params.scrollTo !== false}
            onValueChange={(v: boolean) => updateParam("scrollTo", v)}
          >
            <Text>Scroll to results</Text>
          </Checkbox>
        </Fragment>
      )

    case "setPipelineVariable":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.variableName ?? "")}
            onValueInput={(v: string) => updateParam("variableName", v)}
            placeholder="myVar (without $)"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Value</Text>
          <VerticalSpace space="extraSmall" />
          <TokenInput
            value={String(step.params.value ?? "")}
            onValueInput={(v: string) => updateParam("value", v)}
            placeholder="Supports tokens from previous steps"
            suggestions={suggestions}
          />
        </Fragment>
      )

    case "setPipelineVariableFromProperty":
      return (
        <Fragment>
          {inputCtx}
          <Text style={{ fontSize: 11 }}>Variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.variableName ?? "")}
            onValueInput={(v: string) => updateParam("variableName", v)}
            placeholder="myVar (without $)"
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Property</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.property ?? "name")}
            options={PROPERTY_REGISTRY.map((p) => ({
              value: p.key,
              text: `${p.label} (${p.key})`,
            }))}
            onValueChange={(v: string) => updateParam("property", v)}
          />
        </Fragment>
      )

    default:
      return (
        <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
          Unknown action type: {step.actionType}
        </Text>
      )
  }
}
