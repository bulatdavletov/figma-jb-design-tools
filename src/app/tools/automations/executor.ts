import type { Automation, ActionType } from "./types"
import { getActionDefinition } from "./types"
import type { AutomationContext, ActionHandler } from "./context"
import { createInitialContext } from "./context"
import { filterByType, filterByName, expandToChildren } from "./actions/selection-actions"
import { renameLayers, setFillColor, setFillVariable, setOpacity, notifyAction } from "./actions/property-actions"
import { sourceFromSelection, sourceFromPage } from "./actions/source-actions"
import { selectResults, logAction, countAction } from "./actions/output-actions"
import { setPipelineVariable, setPipelineVariableFromProperty } from "./actions/variable-actions"
import { MAIN_TO_UI } from "../../messages"

const ACTION_HANDLERS: Record<ActionType, ActionHandler> = {
  sourceFromSelection,
  sourceFromPage,
  filterByType,
  filterByName,
  expandToChildren,
  renameLayers,
  setFillColor,
  setFillVariable,
  setOpacity,
  notify: notifyAction,
  selectResults,
  log: logAction,
  count: countAction,
  setPipelineVariable,
  setPipelineVariableFromProperty,
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

  for (let i = 0; i < enabledSteps.length; i++) {
    if (stopRequested) {
      context.log.push({
        stepIndex: i,
        stepName: "(stopped)",
        message: `Stopped by user after step ${i}`,
        itemsIn: context.nodes.length,
        itemsOut: context.nodes.length,
        status: "error",
        error: "Stopped by user",
      })
      break
    }

    const step = enabledSteps[i]
    const definition = getActionDefinition(step.actionType)
    const stepName = definition?.label ?? step.actionType

    figma.ui.postMessage({
      type: MAIN_TO_UI.AUTOMATIONS_RUN_PROGRESS,
      progress: {
        automationName: automation.name,
        currentStep: i + 1,
        totalSteps: enabledSteps.length,
        stepName,
        status: "running" as const,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    const handler = ACTION_HANDLERS[step.actionType]
    if (!handler) {
      context.log.push({
        stepIndex: i,
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
      await handler(context, step.params)

      const lastLog = context.log[context.log.length - 1]
      if (lastLog && lastLog.stepIndex === -1) {
        lastLog.stepIndex = i
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      context.log.push({
        stepIndex: i,
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

  figma.currentPage.selection = context.nodes

  return context
}
