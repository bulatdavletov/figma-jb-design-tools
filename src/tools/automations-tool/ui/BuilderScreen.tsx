import { Button, IconButton, Stack, Text, Textbox, IconPlus16 } from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"
import { useState } from "preact/hooks"

import { IconChevronLeft16 } from "../../../../custom-icons/generated"
import { ButtonWithIcon } from "../../../components/ButtonWithIcon"
import { Page } from "../../../components/Page"
import { ToolHeader } from "../../../components/ToolHeader"
import { ToolFooter } from "../../../components/ToolFooter"
import type { AutomationPayload, AutomationsRunProgress, AutomationsRunResult, StepOutputPreviewPayload, AutomationStepPayload } from "../../../home/messages"
import { ACTION_DEFINITIONS, collectOutputNames, generateDefaultOutputName, type ActionType } from "../types"
import { buildSuggestions } from "../helpers"
import { ActionPickerPanel } from "./ActionPickerPanel"
import { RunOutputPanel } from "./RunOutputPanel"
import { StepConfigPanel } from "./StepConfigPanel"
import { ChildrenBlock, StepRow } from "./StepList"
import { ACTIONS_WITH_CHILDREN, type ChildBranch, type RightPanel, type StepPath } from "./types"
import {
  stepsPathEqual,
  getStepAtPath,
  getParentStepAtPath,
  pathRoot,
  pathExtend,
  pathRootIndex,
  updateStepAtPath,
  insertChildAtPath,
  removeStepAtPath,
  moveStepAtPath,
  getChildArray,
} from "./utils"

export function BuilderScreen(props: {
  automation: AutomationPayload
  onBack: () => void
  onChange: (a: AutomationPayload) => void
  onRun: () => void
  onRunToStep: (stepIndex: number) => void
  onExport: () => void
  runProgress: AutomationsRunProgress | null
  runResult: AutomationsRunResult | null
  stepOutputs: StepOutputPreviewPayload[]
}) {
  const { automation, onChange, stepOutputs } = props
  const [selectedPath, setSelectedPath] = useState<StepPath | null>(null)
  const [rightPanel, setRightPanel] = useState<RightPanel>("empty")
  const [pickerParentPath, setPickerParentPath] = useState<StepPath | null>(null)
  const [pickerParentBranch, setPickerParentBranch] = useState<ChildBranch>("then")

  const selectedStep = selectedPath ? getStepAtPath(automation.steps, selectedPath) : null

  const addStep = (actionType: ActionType) => {
    const def = ACTION_DEFINITIONS.find((d) => d.type === actionType)
    if (!def) return

    const existingNames = collectOutputNames(automation.steps)
    const noOutputActions: ActionType[] = ["repeatWithEach", "ifCondition", "stopAndOutput"]
    const outputName = noOutputActions.includes(actionType)
      ? undefined
      : generateDefaultOutputName(actionType, existingNames)

    const params = { ...def.defaultParams }

    const parentStep = pickerParentPath ? getStepAtPath(automation.steps, pickerParentPath) : null
    const prevStep = pickerParentPath && parentStep
      ? getChildArray(parentStep, pickerParentBranch).at(-1) ?? parentStep
      : automation.steps.at(-1)

    if (prevStep?.outputName) {
      const prevDef = ACTION_DEFINITIONS.find((d) => d.type === prevStep.actionType)
      const prevIsData = prevDef?.producesData === true

      if (actionType === "splitText" && prevIsData) {
        params.sourceVar = prevStep.outputName
      }
      if (actionType === "repeatWithEach" && prevIsData) {
        params.source = prevStep.outputName
      }
      if ((actionType === "mapList" || actionType === "reduceList") && prevIsData) {
        params.source = prevStep.outputName
      }
      if (actionType === "chooseFromList" && prevIsData) {
        params.sourceVar = prevStep.outputName
      }
    }

    if (parentStep?.actionType === "repeatWithEach" || parentStep?.actionType === "mapList") {
      const itemVar = String(parentStep.params.itemVar ?? "item")
      if (actionType === "setCharacters") {
        params.characters = `{$${itemVar}}`
      }
    }

    const newStep: AutomationStepPayload = {
      id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      actionType,
      params,
      enabled: true,
      outputName,
    }

    if (pickerParentPath !== null) {
      const steps = insertChildAtPath(automation.steps, pickerParentPath, pickerParentBranch, newStep)
      const parent = getStepAtPath(steps, pickerParentPath)!
      const children = getChildArray(parent, pickerParentBranch)
      const newChildIndex = children.length - 1
      onChange({ ...automation, steps })
      setSelectedPath(pathExtend(pickerParentPath, newChildIndex, pickerParentBranch))
    } else {
      const newSteps = [...automation.steps, newStep]
      onChange({ ...automation, steps: newSteps })
      setSelectedPath(pathRoot(newSteps.length - 1))
    }
    setRightPanel("config")
    setPickerParentPath(null)
  }

  const removeStep = (path: StepPath) => {
    const steps = removeStepAtPath(automation.steps, path)
    onChange({ ...automation, steps })
    if (stepsPathEqual(selectedPath, path)) {
      setSelectedPath(null)
      setRightPanel("empty")
    }
  }

  const moveStep = (path: StepPath, direction: -1 | 1) => {
    const steps = moveStepAtPath(automation.steps, path, direction)
    onChange({ ...automation, steps })
    if (stepsPathEqual(selectedPath, path)) {
      const last = path[path.length - 1]
      if (last && "childIndex" in last) {
        setSelectedPath([...path.slice(0, -1), { ...last, childIndex: last.childIndex + direction }])
      } else if (last && "rootIndex" in last) {
        setSelectedPath([{ rootIndex: last.rootIndex + direction }])
      }
    }
  }

  const selectStep = (path: StepPath) => {
    setSelectedPath(path)
    setRightPanel("config")
  }

  const showPicker = (parentPath?: StepPath | null, branch?: ChildBranch) => {
    setSelectedPath(null)
    setPickerParentPath(parentPath ?? null)
    setPickerParentBranch(branch ?? "then")
    setRightPanel("picker")
  }

  const handleRunClick = () => {
    setSelectedPath(null)
    setRightPanel("runOutput")
    props.onRun()
  }

  const handleRunToStep = (stepIndex: number) => {
    setRightPanel("runOutput")
    props.onRunToStep(stepIndex)
  }

  const updateStepParam = (key: string, value: unknown) => {
    if (!selectedPath || !selectedStep) return
    const steps = updateStepAtPath(automation.steps, selectedPath, (s) => ({
      ...s,
      params: { ...s.params, [key]: value },
    }))
    onChange({ ...automation, steps })
  }

  const updateStepOutputName = (value: string) => {
    if (!selectedPath || !selectedStep) return
    const steps = updateStepAtPath(automation.steps, selectedPath, (s) => ({
      ...s,
      outputName: value || undefined,
    }))
    onChange({ ...automation, steps })
  }

  const updateStepInput = (value: string) => {
    if (!selectedPath || !selectedStep) return
    const steps = updateStepAtPath(automation.steps, selectedPath, (s) => ({
      ...s,
      input: value || undefined,
    }))
    onChange({ ...automation, steps })
  }

  return (
    <Page>
      <ToolHeader
        title={(
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <Textbox
              value={automation.emoji ?? ""}
              onValueInput={(value: string) => onChange({ ...automation, emoji: value })}
              placeholder="🤖"
              style={{ width: 32, textAlign: "center" }}
            />
            <Textbox
              value={automation.name}
              onValueInput={(value: string) => onChange({ ...automation, name: value })}
              placeholder="Automation name"
              style={{ width: 250}}
            />
          </div>
        )}
        left={
          <IconButton onClick={props.onBack}>
            <IconChevronLeft16
            />
          </IconButton>
        }
      />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            borderRight: "1px solid var(--figma-color-border)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "4px 12px 0 12px" }} />

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 8px" }}>
            {automation.steps.length === 0 ? (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--figma-color-text-secondary)",
                  textAlign: "center",
                  padding: "24px 8px",
                }}
              >
                No steps yet
              </div>
            ) : (
              <Stack space="extraSmall">
                {automation.steps.map((step, idx) => {
                  const stepPath = pathRoot(idx)
                  return (
                    <Fragment key={step.id}>
                      <StepRow
                        step={step}
                        index={idx}
                        total={automation.steps.length}
                        selected={stepsPathEqual(selectedPath, stepPath)}
                        stepOutput={stepOutputs.find((so) => so.stepId === step.id)}
                        onSelect={() => selectStep(stepPath)}
                        onRemove={() => removeStep(stepPath)}
                        onMoveUp={() => moveStep(stepPath, -1)}
                        onMoveDown={() => moveStep(stepPath, 1)}
                      />
                      {ACTIONS_WITH_CHILDREN.includes(step.actionType) && (
                        <Fragment>
                          {step.actionType === "ifCondition" && (
                            <Fragment>
                              <ChildrenBlock
                                parentPath={stepPath}
                                children={step.children ?? []}
                                selectedPath={selectedPath}
                                stepOutputs={stepOutputs}
                                branch="then"
                                label="Then"
                                onSelectStep={selectStep}
                                onRemoveStep={removeStep}
                                onMoveStep={moveStep}
                                onRequestAddChild={(p, b) => showPicker(p, b)}
                              />
                              <ChildrenBlock
                                parentPath={stepPath}
                                children={step.elseChildren ?? []}
                                selectedPath={selectedPath}
                                stepOutputs={stepOutputs}
                                branch="else"
                                label="Otherwise"
                                onSelectStep={selectStep}
                                onRemoveStep={removeStep}
                                onMoveStep={moveStep}
                                onRequestAddChild={(p, b) => showPicker(p, b)}
                              />
                            </Fragment>
                          )}
                          {step.actionType !== "ifCondition" && (
                            <ChildrenBlock
                              parentPath={stepPath}
                              children={step.children ?? []}
                              selectedPath={selectedPath}
                              stepOutputs={stepOutputs}
                              branch="then"
                              onSelectStep={selectStep}
                              onRemoveStep={removeStep}
                              onMoveStep={moveStep}
                              onRequestAddChild={(p, b) => showPicker(p, b)}
                            />
                          )}
                        </Fragment>
                      )}
                    </Fragment>
                  )
                })}
              </Stack>
            )}
          </div>

          <ToolFooter>
            <ButtonWithIcon icon={<IconPlus16 />} fullWidth secondary onClick={() => showPicker()}>
              Add step
            </ButtonWithIcon>
          </ToolFooter>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {rightPanel === "picker" && (
            <ActionPickerPanel onSelect={addStep} />
          )}
          {rightPanel === "config" && selectedStep && selectedPath && (() => {
            const parentStep = getParentStepAtPath(automation.steps, selectedPath) ?? undefined
            const stepOutput = stepOutputs.find((so) => so.stepId === selectedStep.id)
            return (
              <StepConfigPanel
                step={selectedStep}
                stepIndex={pathRootIndex(selectedPath)}
                allSteps={automation.steps}
                parentStep={parentStep}
                onUpdateParam={updateStepParam}
                onUpdateOutputName={updateStepOutputName}
                onUpdateInput={updateStepInput}
                onRunToStep={() => handleRunToStep(pathRootIndex(selectedPath))}
                stepOutput={stepOutput}
                suggestions={buildSuggestions(automation.steps, selectedPath)}
              />
            )
          })()}
          {rightPanel === "runOutput" && (
            <RunOutputPanel
              progress={props.runProgress}
              result={props.runResult}
            />
          )}
          {rightPanel === "empty" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: "var(--figma-color-text-tertiary)",
                  textAlign: "center",
                }}
              >
                Select a step to configure, or click "Add step" to browse available actions
              </Text>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--figma-color-border)",
          padding: "8px 12px",
          display: "flex",
          gap: 8,
        }}
      >
        <Button style={{ flex: 1 }} onClick={handleRunClick}>
          ▶ Run
        </Button>
        <Button style={{ flex: 1 }} secondary onClick={props.onExport}>
          Export JSON
        </Button>
      </div>
    </Page>
  )
}

 
