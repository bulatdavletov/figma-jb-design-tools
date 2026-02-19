import { MAIN_TO_UI, UI_TO_MAIN, type ActiveTool, type UiToMainMessage, type AutomationPayload } from "../../messages"
import { loadAutomations, saveAutomation, deleteAutomation, getAutomation } from "./storage"
import { executeAutomation, requestStop } from "./executor"
import type { Automation, AutomationStep, ActionType } from "./types"

export function registerAutomationsTool(getActiveTool: () => ActiveTool) {
  const sendList = async () => {
    if (getActiveTool() !== "automations-tool") return
    const automations = await loadAutomations()
    figma.ui.postMessage({
      type: MAIN_TO_UI.AUTOMATIONS_LIST,
      automations: automations.map((a) => ({
        id: a.id,
        name: a.name,
        stepCount: a.steps.length,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    })
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

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_RUN) {
        const automation = await getAutomation(msg.automationId)
        if (!automation) {
          figma.ui.postMessage({
            type: MAIN_TO_UI.AUTOMATIONS_RUN_RESULT,
            result: {
              success: false,
              message: "Automation not found",
              stepsCompleted: 0,
              totalSteps: 0,
              errors: ["Automation not found"],
            },
          })
          return true
        }

        const result = await executeAutomation(automation)
        figma.ui.postMessage({
          type: MAIN_TO_UI.AUTOMATIONS_RUN_RESULT,
          result: {
            ...result,
            totalSteps: automation.steps.filter((s) => s.enabled).length,
          },
        })

        if (result.success) {
          figma.notify(`${automation.name}: ${result.message}`)
        } else if (result.errors.length > 0) {
          figma.notify(`${automation.name}: ${result.errors[0]}`, { error: true })
        }
        return true
      }

      if (msg.type === UI_TO_MAIN.AUTOMATIONS_STOP) {
        requestStop()
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
    },
    onMessage,
  }
}

function payloadToAutomation(payload: AutomationPayload): Automation {
  return {
    id: payload.id,
    name: payload.name,
    steps: payload.steps.map((s) => ({
      id: s.id,
      actionType: s.actionType as ActionType,
      params: s.params,
      enabled: s.enabled,
    })),
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  }
}

function automationToPayload(automation: Automation): AutomationPayload {
  return {
    id: automation.id,
    name: automation.name,
    steps: automation.steps.map((s) => ({
      id: s.id,
      actionType: s.actionType,
      params: s.params,
      enabled: s.enabled,
    })),
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
  }
}
