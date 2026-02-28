import { MAIN_TO_UI, UI_TO_MAIN, type ActiveTool, type UiToMainMessage, type AutomationPayload, type AutomationStepPayload } from "../../home/messages"
import { loadAutomations, saveAutomation, deleteAutomation, duplicateAutomation, getAutomation } from "./storage"
import { executeAutomation, requestStop } from "./executor"
import { resolveInput, cancelInput } from "./input-bridge"
import type { Automation, AutomationStep, ActionType } from "./types"
import { plural } from "../../utils/pluralize"

let pendingAutoRunId: string | null = null

export function setAutoRunAutomation(id: string): void {
  pendingAutoRunId = id
}

export function registerAutomationsTool(getActiveTool: () => ActiveTool) {
  const sendList = async () => {
    if (getActiveTool() !== "automations-tool") return
    const automations = await loadAutomations()
    figma.ui.postMessage({
      type: MAIN_TO_UI.AUTOMATIONS_LIST,
      automations: automations.map((a) => ({
        id: a.id,
        name: a.name,
        emoji: a.emoji,
        stepCount: a.steps.length,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    })
  }

  const runAutomationById = async (automationId: string, runToStepIndex?: number) => {
    const automation = await getAutomation(automationId)
    if (!automation) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.AUTOMATIONS_RUN_RESULT,
        result: {
          success: false,
          message: "Automation not found",
          stepsCompleted: 0,
          totalSteps: 0,
          errors: ["Workflow not found"],
          log: [],
        },
      })
      return
    }

    const options = runToStepIndex !== undefined ? { maxStepIndex: runToStepIndex } : undefined
    const context = await executeAutomation(automation, options)
    const enabledSteps = automation.steps.filter((s) => s.enabled)
    const totalSteps = runToStepIndex !== undefined
      ? Math.min(runToStepIndex + 1, enabledSteps.length)
      : enabledSteps.length
    const errors = context.log.filter((e) => e.status === "error").map((e) => e.message)
    const stepsCompleted = context.log.filter((e) => e.status === "success").length
    const success = errors.length === 0

    figma.ui.postMessage({
      type: MAIN_TO_UI.AUTOMATIONS_RUN_RESULT,
      result: {
        success,
        message: success
          ? `Completed ${plural(stepsCompleted, "step")} successfully`
          : `Completed with ${plural(errors.length, "error")}`,
        stepsCompleted,
        totalSteps,
        errors,
        log: context.log,
        stepOutputs: context.stepOutputs.map((so) => ({
          stepId: so.stepId,
          stepIndex: so.stepIndex,
          status: so.status,
          nodesAfter: so.nodesAfter,
          nodeSample: so.nodeSample,
          dataOutput: so.dataOutput,
          pipelineVarsSnapshot: so.pipelineVarsSnapshot,
          savedNodeSetsCount: so.savedNodeSetsCount,
          durationMs: so.durationMs,
          message: so.message,
          error: so.error,
        })),
      },
    })

    if (success) {
      figma.notify(`${automation.name}: Completed ${plural(stepsCompleted, "step")}`)
    } else if (errors.length > 0) {
      figma.notify(`${automation.name}: ${errors[0]}`, { error: true })
    }
  }

  const onMessage = async (msg: UiToMainMessage): Promise<boolean> => {
    try {
      if (msg.type === UI_TO_MAIN.AUTOMATIONS_LOAD) {
        await sendList()
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_GET) {
        const automation = await getAutomation(msg.automationId)
        figma.ui.postMessage({
          type: MAIN_TO_UI.AUTOMATIONS_FULL,
          automation: automation ? automationToPayload(automation) : null,
        })
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_SAVE) {
        const automation = payloadToAutomation(msg.automation)
        automation.updatedAt = Date.now()
        await saveAutomation(automation)
        figma.ui.postMessage({
          type: MAIN_TO_UI.AUTOMATIONS_SAVED,
          automation: automationToPayload(automation),
        })
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_DELETE) {
        await deleteAutomation(msg.automationId)
        await sendList()
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_DUPLICATE) {
        await duplicateAutomation(msg.automationId)
        await sendList()
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_RUN) {
        await runAutomationById(msg.automationId, msg.runToStepIndex)
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_STOP) {
        requestStop()
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_INPUT_RESPONSE) {
        if (msg.cancelled) {
          cancelInput()
        } else {
          resolveInput(msg.value)
        }
        return true
      }
    } catch (e) {
      figma.ui.postMessage({
        type: MAIN_TO_UI.ERROR,
        message: e instanceof Error ? e.message : String(e),
      })
    }
    return false
  }

  return {
    onActivate: async () => {
      await sendList()
      if (pendingAutoRunId) {
        const id = pendingAutoRunId
        pendingAutoRunId = null
        await runAutomationById(id)
      }
    },
    onMessage,
  }
}

function payloadToAutomation(payload: AutomationPayload): Automation {
  return {
    id: payload.id,
    name: payload.name,
    emoji: payload.emoji,
    steps: payload.steps.map(payloadStepToStep),
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  }
}

function payloadStepToStep(s: AutomationStepPayload): AutomationStep {
  const step: AutomationStep = {
    id: s.id,
    actionType: s.actionType as ActionType,
    params: s.params,
    enabled: s.enabled,
  }
  if (s.outputName) step.outputName = s.outputName
  if (s.input) step.input = s.input
  else if ((s as AutomationStepPayload & { target?: string }).target) step.input = (s as AutomationStepPayload & { target?: string }).target
  if (s.children && s.children.length > 0) {
    step.children = s.children.map(payloadStepToStep)
  }
  if (s.elseChildren && s.elseChildren.length > 0) {
    step.elseChildren = s.elseChildren.map(payloadStepToStep)
  }
  return step
}

function automationToPayload(automation: Automation): AutomationPayload {
  return {
    id: automation.id,
    name: automation.name,
    emoji: automation.emoji,
    steps: automation.steps.map(stepToPayloadStep),
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
  }
}

function stepToPayloadStep(s: AutomationStep): AutomationStepPayload {
  const payload: AutomationStepPayload = {
    id: s.id,
    actionType: s.actionType,
    params: s.params,
    enabled: s.enabled,
  }
  if (s.outputName) payload.outputName = s.outputName
  if (s.input) payload.input = s.input
  if (s.children && s.children.length > 0) {
    payload.children = s.children.map(stepToPayloadStep)
  }
  if (s.elseChildren && s.elseChildren.length > 0) {
    payload.elseChildren = s.elseChildren.map(stepToPayloadStep)
  }
  return payload
}
