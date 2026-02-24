import type { Automation, AutomationStep, ActionType } from "./types"
import { getActionDefinition, actionProducesData } from "./types"
import type { AutomationContext, ActionHandler, PipelineValue, PipelineListValue } from "./context"
import { createInitialContext, isActionResult } from "./context"
import { filterByType, filterByName, expandToChildren, goToParent, flattenDescendants } from "./actions/selection-actions"
import { renameLayers, setFillColor, setFillVariable, setOpacity, setCharacters, resizeAction, wrapInFrame, addAutoLayout, editAutoLayout, removeAutoLayout, notifyAction } from "./actions/property-actions"
import { sourceFromSelection, sourceFromPage } from "./actions/source-actions"
import { selectResults, logAction, countAction } from "./actions/output-actions"
import { setPipelineVariable, setPipelineVariableFromProperty, splitText } from "./actions/variable-actions"
import { restoreNodes } from "./actions/navigate-actions"
import { askForInput } from "./actions/input-actions"
import { InputCancelledError } from "./input-bridge"
import { MAIN_TO_UI } from "../../messages"

const ACTION_HANDLERS: Partial<Record<ActionType, ActionHandler>> = {
  sourceFromSelection,
  sourceFromPage,
  filterByType,
  filterByName,
  expandToChildren,
  goToParent,
  flattenDescendants,
  restoreNodes,
  renameLayers,
  setFillColor,
  setFillVariable,
  setOpacity,
  setCharacters,
  resize: resizeAction,
  wrapInFrame,
  addAutoLayout,
  editAutoLayout,
  removeAutoLayout,
  notify: notifyAction,
  selectResults,
  log: logAction,
  count: countAction,
  setPipelineVariable,
  setPipelineVariableFromProperty,
  splitText,
  askForInput,
}

let stopRequested = false

export function requestStop() {
  stopRequested = true
}

export async function executeAutomation(
  automation: Automation,
): Promise<AutomationContext> {
  stopRequested = false
  const context = createInitialContext()

  const enabledSteps = automation.steps.filter((s) => s.enabled)
  if (enabledSteps.length === 0) {
    context.log.push({
      stepIndex: 0,
      stepName: "(none)",
      message: "No enabled steps to run",
      itemsIn: 0,
      itemsOut: 0,
      status: "skipped",
    })
    return context
  }

  await executeSteps(enabledSteps, context, automation.name, 0)

  figma.currentPage.selection = context.nodes

  return context
}

async function executeSteps(
  steps: AutomationStep[],
  context: AutomationContext,
  automationName: string,
  baseIndex: number,
): Promise<void> {
  for (let i = 0; i < steps.length; i++) {
    if (stopRequested) {
      context.log.push({
        stepIndex: baseIndex + i,
        stepName: "(stopped)",
        message: `Stopped by user after step ${baseIndex + i}`,
        itemsIn: context.nodes.length,
        itemsOut: context.nodes.length,
        status: "error",
        error: "Stopped by user",
      })
      break
    }

    const step = steps[i]
    const definition = getActionDefinition(step.actionType)
    const stepName = definition?.label ?? step.actionType
    const stepIndex = baseIndex + i

    try {
      figma.ui.postMessage({
        type: MAIN_TO_UI.AUTOMATIONS_RUN_PROGRESS,
        progress: {
          automationName,
          currentStep: stepIndex + 1,
          totalSteps: steps.length + baseIndex,
          stepName,
          status: "running" as const,
        },
      })
    } catch {
      // No UI available (e.g. running headlessly via Quick Actions)
    }

    await new Promise((resolve) => setTimeout(resolve, 0))

    if (step.actionType === "repeatWithEach") {
      await executeRepeatWithEach(step, context, automationName, stepIndex)
      continue
    }

    const handler = ACTION_HANDLERS[step.actionType]
    if (!handler) {
      context.log.push({
        stepIndex,
        stepName,
        message: `Unknown action type "${step.actionType}"`,
        itemsIn: context.nodes.length,
        itemsOut: context.nodes.length,
        status: "error",
        error: `Unknown action type "${step.actionType}"`,
      })
      continue
    }

    const itemsBefore = context.nodes.length

    try {
      const result = await handler(context, step.params)

      let dataOutput: PipelineValue | PipelineListValue | undefined

      if (isActionResult(result)) {
        Object.assign(context, result.context)
        dataOutput = result.output
      }

      const lastLog = context.log[context.log.length - 1]
      if (lastLog && lastLog.stepIndex === -1) {
        lastLog.stepIndex = stepIndex
      }

      if (step.outputName) {
        saveStepOutput(context, step, dataOutput)
      }
    } catch (e) {
      if (e instanceof InputCancelledError) {
        context.log.push({
          stepIndex,
          stepName,
          message: "Cancelled by user",
          itemsIn: itemsBefore,
          itemsOut: context.nodes.length,
          status: "skipped",
        })
        stopRequested = true
        break
      }
      const errorMsg = e instanceof Error ? e.message : String(e)
      context.log.push({
        stepIndex,
        stepName,
        message: errorMsg,
        itemsIn: itemsBefore,
        itemsOut: context.nodes.length,
        status: "error",
        error: errorMsg,
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

function saveStepOutput(
  context: AutomationContext,
  step: AutomationStep,
  dataOutput?: PipelineValue | PipelineListValue,
): void {
  if (!step.outputName) return

  if (actionProducesData(step.actionType) && dataOutput !== undefined) {
    context.pipelineVars[step.outputName] = dataOutput
  } else if (actionProducesData(step.actionType)) {
    // Data action but no output — skip
  } else {
    context.savedNodeSets[step.outputName] = [...context.nodes]
  }
}

async function executeRepeatWithEach(
  step: AutomationStep,
  context: AutomationContext,
  automationName: string,
  stepIndex: number,
): Promise<void> {
  const source = String(step.params.source ?? "nodes")
  const itemVar = String(step.params.itemVar ?? "item")
  const onMismatch = String(step.params.onMismatch ?? "error") as "error" | "repeatList" | "skipExtra"
  const children = (step.children ?? []).filter((c) => c.enabled)

  if (children.length === 0) {
    context.log.push({
      stepIndex,
      stepName: "Repeat with each",
      message: "No child steps — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return
  }

  const savedNodes = [...context.nodes]

  if (source === "nodes") {
    await executeRepeatNodesMode(context, children, savedNodes, itemVar, automationName, stepIndex)
  } else {
    await executeRepeatListMode(context, children, savedNodes, source, itemVar, onMismatch, automationName, stepIndex)
  }

  context.nodes = savedNodes
}

async function executeRepeatNodesMode(
  context: AutomationContext,
  children: AutomationStep[],
  savedNodes: SceneNode[],
  itemVar: string,
  automationName: string,
  stepIndex: number,
): Promise<void> {
  if (savedNodes.length === 0) {
    context.log.push({
      stepIndex,
      stepName: "Repeat with each",
      message: "Working set is empty — skipped",
      itemsIn: 0,
      itemsOut: 0,
      status: "skipped",
    })
    return
  }

  context.log.push({
    stepIndex,
    stepName: "Repeat with each",
    message: `Iterating ${savedNodes.length} node(s)`,
    itemsIn: savedNodes.length,
    itemsOut: savedNodes.length,
    status: "success",
  })

  for (let i = 0; i < savedNodes.length; i++) {
    if (stopRequested) break

    context.nodes = [savedNodes[i]]
    context.pipelineVars["repeatIndex"] = i

    context.log.push({
      stepIndex,
      stepName: "Repeat with each",
      message: `Repeat ${i + 1}/${savedNodes.length}: node "${savedNodes[i].name}"`,
      itemsIn: 1,
      itemsOut: 1,
      status: "success",
    })

    await executeSteps(children, context, automationName, stepIndex + 1)
  }
}

async function executeRepeatListMode(
  context: AutomationContext,
  children: AutomationStep[],
  savedNodes: SceneNode[],
  source: string,
  itemVar: string,
  onMismatch: "error" | "repeatList" | "skipExtra",
  automationName: string,
  stepIndex: number,
): Promise<void> {
  const listValue = context.pipelineVars[source]
  if (!Array.isArray(listValue)) {
    context.log.push({
      stepIndex,
      stepName: "Repeat with each",
      message: `Variable "$${source}" is not a list`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Variable "$${source}" is not a list`,
    })
    return
  }

  const list = listValue as PipelineListValue
  if (list.length === 0) {
    context.log.push({
      stepIndex,
      stepName: "Repeat with each",
      message: "List is empty — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return
  }

  const nodeCount = savedNodes.length
  const listCount = list.length

  if (nodeCount !== listCount && onMismatch === "error") {
    context.log.push({
      stepIndex,
      stepName: "Repeat with each",
      message: `List has ${listCount} item(s) but working set has ${nodeCount} node(s) (onMismatch: error)`,
      itemsIn: nodeCount,
      itemsOut: nodeCount,
      status: "error",
      error: `List/node count mismatch: ${listCount} vs ${nodeCount}`,
    })
    return
  }

  const iterationCount = onMismatch === "skipExtra"
    ? Math.min(listCount, nodeCount)
    : nodeCount

  context.log.push({
    stepIndex,
    stepName: "Repeat with each",
    message: `Iterating ${iterationCount} time(s) with $${source} (${listCount} item(s), ${nodeCount} node(s))`,
    itemsIn: nodeCount,
    itemsOut: nodeCount,
    status: "success",
  })

  for (let i = 0; i < iterationCount; i++) {
    if (stopRequested) break

    const listItem = onMismatch === "repeatList"
      ? list[i % listCount]
      : list[i]
    const nodeItem = i < nodeCount ? savedNodes[i] : savedNodes[nodeCount - 1]

    context.pipelineVars[itemVar] = listItem !== undefined ? listItem : ""
    context.pipelineVars["repeatIndex"] = i
    context.nodes = [nodeItem]

    context.log.push({
      stepIndex,
      stepName: "Repeat with each",
      message: `Repeat ${i + 1}/${iterationCount}: $${itemVar} = "${String(listItem)}"`,
      itemsIn: 1,
      itemsOut: 1,
      status: "success",
    })

    await executeSteps(children, context, automationName, stepIndex + 1)
  }
}
