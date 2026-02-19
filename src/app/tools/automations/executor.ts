import type { Automation, ActionType } from "./types"
import { getActionDefinition } from "./types"
import { selectByType, selectByName, expandToChildren } from "./actions/selection-actions"
import { renameLayers, setFillColor, setFillVariable, setOpacity, notifyAction } from "./actions/property-actions"
import { MAIN_TO_UI } from "../../messages"

type ActionRunner = (params: Record<string, unknown>) => Promise<string>

const ACTION_RUNNERS: Record<ActionType, ActionRunner> = {
  selectByType,
  selectByName,
  expandToChildren,
  renameLayers,
  setFillColor,
  setFillVariable,
  setOpacity,
  notify: notifyAction,
}

let stopRequested = false

export function requestStop() {
  stopRequested = true
}

export async function executeAutomation(
  automation: Automation,
): Promise<{ success: boolean; message: string; stepsCompleted: number; errors: string[] }> {
  stopRequested = false

  const enabledSteps = automation.steps.filter((s) => s.enabled)
  if (enabledSteps.length === 0) {
    return { success: true, message: "No enabled steps to run", stepsCompleted: 0, errors: [] }
  }

  const errors: string[] = []
  let stepsCompleted = 0

  for (let i = 0; i < enabledSteps.length; i++) {
    if (stopRequested) {
      return {
        success: false,
        message: `Stopped after ${stepsCompleted} of ${enabledSteps.length} steps`,
        stepsCompleted,
        errors,
      }
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

    const runner = ACTION_RUNNERS[step.actionType]
    if (!runner) {
      errors.push(`Step ${i + 1} (${stepName}): Unknown action type "${step.actionType}"`)
      continue
    }

    try {
      await runner(step.params)
      stepsCompleted++
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      errors.push(`Step ${i + 1} (${stepName}): ${errorMsg}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  const success = errors.length === 0
  const message = success
    ? `Completed ${stepsCompleted} step(s) successfully`
    : `Completed with ${errors.length} error(s)`

  return { success, message, stepsCompleted, errors }
}
