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
import { stepsPathEqual } from "./utils"

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
  const [pickerParentIndex, setPickerParentIndex] = useState<number | null>(null)
  const [pickerParentBranch, setPickerParentBranch] = useState<ChildBranch>("then")

  const getChildArray = (parent: AutomationStepPayload, branch: ChildBranch): AutomationStepPayload[] =>
    branch === "else" ? (parent.elseChildren ?? []) : (parent.children ?? [])

  const setChildArray = (parent: AutomationStepPayload, branch: ChildBranch, arr: AutomationStepPayload[]): AutomationStepPayload =>
    branch === "else"
      ? { ...parent, elseChildren: arr.length > 0 ? arr : undefined }
      : { ...parent, children: arr.length > 0 ? arr : undefined }

  const getSelectedStep = (): AutomationStepPayload | null => {
    if (!selectedPath) return null
    const topStep = automation.steps[selectedPath.index]
    if (!topStep) return null
    if (selectedPath.childIndex !== undefined) {
      const arr = selectedPath.childBranch === "else" ? topStep.elseChildren : topStep.children
      return arr?.[selectedPath.childIndex] ?? null
    }
    return topStep
  }

  const selectedStep = getSelectedStep()

  const addStep = (actionType: ActionType) => {
    const def = ACTION_DEFINITIONS.find((d) => d.type === actionType)
    if (!def) return

    const existingNames = collectOutputNames(automation.steps)
    const noOutputActions: ActionType[] = ["repeatWithEach", "ifCondition", "stopAndOutput"]
    const outputName = noOutputActions.includes(actionType)
      ? undefined
      : generateDefaultOutputName(actionType, existingNames)

    const params = { ...def.defaultParams }

    const prevStep = pickerParentIndex !== null
      ? getChildArray(automation.steps[pickerParentIndex], pickerParentBranch).at(-1) ?? automation.steps[pickerParentIndex]
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

    if (pickerParentIndex !== null) {
      const parentStep = automation.steps[pickerParentIndex]
      if (parentStep?.actionType === "repeatWithEach" || parentStep?.actionType === "mapList") {
        const itemVar = String(parentStep.params.itemVar ?? "item")
        if (actionType === "setCharacters") {
          params.characters = `{$${itemVar}}`
        }
      }
    }

    const newStep: AutomationStepPayload = {
      id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      actionType,
      params,
      enabled: true,
      outputName,
    }

    if (pickerParentIndex !== null) {
      const steps = [...automation.steps]
      const parent = { ...steps[pickerParentIndex] }
      const branch = pickerParentBranch
      const children = [...getChildArray(parent, branch), newStep]
      steps[pickerParentIndex] = setChildArray(parent, branch, children)
      onChange({ ...automation, steps })
      setSelectedPath({ index: pickerParentIndex, childIndex: children.length - 1, childBranch: branch })
    } else {
      const newSteps = [...automation.steps, newStep]
      onChange({ ...automation, steps: newSteps })
      setSelectedPath({ index: newSteps.length - 1 })
    }
    setRightPanel("config")
    setPickerParentIndex(null)
  }

  const removeStep = (path: StepPath) => {
    const steps = [...automation.steps]
    if (path.childIndex !== undefined) {
      const branch = path.childBranch ?? "then"
      const parent = { ...steps[path.index] }
      const children = [...getChildArray(parent, branch)]
      children.splice(path.childIndex, 1)
      steps[path.index] = setChildArray(parent, branch, children)
    } else {
      steps.splice(path.index, 1)
    }
    onChange({ ...automation, steps })
    if (stepsPathEqual(selectedPath, path)) {
      setSelectedPath(null)
      setRightPanel("empty")
    }
  }

  const moveStep = (path: StepPath, direction: -1 | 1) => {
    const steps = [...automation.steps]
    if (path.childIndex !== undefined) {
      const branch = path.childBranch ?? "then"
      const parent = { ...steps[path.index] }
      const children = [...getChildArray(parent, branch)]
      const newIdx = path.childIndex + direction
      if (newIdx < 0 || newIdx >= children.length) return
      const temp = children[path.childIndex]
      children[path.childIndex] = children[newIdx]
      children[newIdx] = temp
      steps[path.index] = setChildArray(parent, branch, children)
      onChange({ ...automation, steps })
      if (stepsPathEqual(selectedPath, path)) {
        setSelectedPath({ index: path.index, childIndex: newIdx, childBranch: branch })
      }
    } else {
      const newIdx = path.index + direction
      if (newIdx < 0 || newIdx >= steps.length) return
      const temp = steps[path.index]
      steps[path.index] = steps[newIdx]
      steps[newIdx] = temp
      onChange({ ...automation, steps })
      if (stepsPathEqual(selectedPath, path)) {
        setSelectedPath({ index: newIdx })
      }
    }
  }

  const selectStep = (path: StepPath) => {
    setSelectedPath(path)
    setRightPanel("config")
  }

  const showPicker = (parentIndex?: number, branch?: ChildBranch) => {
    setSelectedPath(null)
    setPickerParentIndex(parentIndex ?? null)
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
    const steps = [...automation.steps]
    if (selectedPath.childIndex !== undefined) {
      const branch = selectedPath.childBranch ?? "then"
      const parent = { ...steps[selectedPath.index] }
      const children = [...getChildArray(parent, branch)]
      children[selectedPath.childIndex] = {
        ...children[selectedPath.childIndex],
        params: { ...children[selectedPath.childIndex].params, [key]: value },
      }
      steps[selectedPath.index] = setChildArray(parent, branch, children)
    } else {
      steps[selectedPath.index] = {
        ...steps[selectedPath.index],
        params: { ...steps[selectedPath.index].params, [key]: value },
      }
    }
    onChange({ ...automation, steps })
  }

  const updateStepOutputName = (value: string) => {
    if (!selectedPath || !selectedStep) return
    const steps = [...automation.steps]
    if (selectedPath.childIndex !== undefined) {
      const branch = selectedPath.childBranch ?? "then"
      const parent = { ...steps[selectedPath.index] }
      const children = [...getChildArray(parent, branch)]
      children[selectedPath.childIndex] = {
        ...children[selectedPath.childIndex],
        outputName: value || undefined,
      }
      steps[selectedPath.index] = setChildArray(parent, branch, children)
    } else {
      steps[selectedPath.index] = {
        ...steps[selectedPath.index],
        outputName: value || undefined,
      }
    }
    onChange({ ...automation, steps })
  }

  const updateStepTarget = (value: string) => {
    if (!selectedPath || !selectedStep) return
    const steps = [...automation.steps]
    if (selectedPath.childIndex !== undefined) {
      const branch = selectedPath.childBranch ?? "then"
      const parent = { ...steps[selectedPath.index] }
      const children = [...getChildArray(parent, branch)]
      children[selectedPath.childIndex] = {
        ...children[selectedPath.childIndex],
        target: value || undefined,
      }
      steps[selectedPath.index] = setChildArray(parent, branch, children)
    } else {
      steps[selectedPath.index] = {
        ...steps[selectedPath.index],
        target: value || undefined,
      }
    }
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
                {automation.steps.map((step, idx) => (
                  <Fragment key={step.id}>
                    <StepRow
                      step={step}
                      index={idx}
                      total={automation.steps.length}
                      selected={stepsPathEqual(selectedPath, { index: idx })}
                      stepOutput={stepOutputs.find((so) => so.stepId === step.id)}
                      onSelect={() => selectStep({ index: idx })}
                      onRemove={() => removeStep({ index: idx })}
                      onMoveUp={() => moveStep({ index: idx }, -1)}
                      onMoveDown={() => moveStep({ index: idx }, 1)}
                    />
                    {ACTIONS_WITH_CHILDREN.includes(step.actionType) && (
                      <Fragment>
                        {step.actionType === "ifCondition" && (
                          <Fragment>
                            <ChildrenBlock
                              parentIndex={idx}
                              children={step.children ?? []}
                              selectedPath={selectedPath}
                              stepOutputs={stepOutputs}
                              branch="then"
                              label="Then"
                              onSelectChild={(childIdx) => selectStep({ index: idx, childIndex: childIdx, childBranch: "then" })}
                              onRemoveChild={(childIdx) => removeStep({ index: idx, childIndex: childIdx, childBranch: "then" })}
                              onMoveChild={(childIdx, dir) => moveStep({ index: idx, childIndex: childIdx, childBranch: "then" }, dir)}
                              onAddChild={() => showPicker(idx, "then")}
                            />
                            <ChildrenBlock
                              parentIndex={idx}
                              children={step.elseChildren ?? []}
                              selectedPath={selectedPath}
                              stepOutputs={stepOutputs}
                              branch="else"
                              label="Otherwise"
                              onSelectChild={(childIdx) => selectStep({ index: idx, childIndex: childIdx, childBranch: "else" })}
                              onRemoveChild={(childIdx) => removeStep({ index: idx, childIndex: childIdx, childBranch: "else" })}
                              onMoveChild={(childIdx, dir) => moveStep({ index: idx, childIndex: childIdx, childBranch: "else" }, dir)}
                              onAddChild={() => showPicker(idx, "else")}
                            />
                          </Fragment>
                        )}
                        {step.actionType !== "ifCondition" && (
                          <ChildrenBlock
                            parentIndex={idx}
                            children={step.children ?? []}
                            selectedPath={selectedPath}
                            stepOutputs={stepOutputs}
                            branch="then"
                            onSelectChild={(childIdx) => selectStep({ index: idx, childIndex: childIdx })}
                            onRemoveChild={(childIdx) => removeStep({ index: idx, childIndex: childIdx })}
                            onMoveChild={(childIdx, dir) => moveStep({ index: idx, childIndex: childIdx }, dir)}
                            onAddChild={() => showPicker(idx)}
                          />
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                ))}
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
            const parentStep = selectedPath.childIndex !== undefined
              ? automation.steps[selectedPath.index]
              : undefined
            const stepOutput = stepOutputs.find((so) => so.stepId === selectedStep.id)
            return (
              <StepConfigPanel
                step={selectedStep}
                stepIndex={selectedPath.index}
                allSteps={automation.steps}
                parentStep={parentStep}
                onUpdateParam={updateStepParam}
                onUpdateOutputName={updateStepOutputName}
                onUpdateTarget={updateStepTarget}
                onRunToStep={() => handleRunToStep(selectedPath.index)}
                stepOutput={stepOutput}
                suggestions={buildSuggestions(
                  automation.steps,
                  selectedPath.index,
                  parentStep,
                  selectedPath.childIndex,
                  selectedPath.childBranch,
                )}
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

 
