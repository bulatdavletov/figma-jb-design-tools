import { h, Fragment } from "preact"
import { useEffect, useState, useCallback, useRef } from "preact/hooks"

import type {
  AutomationListItem,
  AutomationPayload,
  AutomationsInputRequest,
  AutomationsRunProgress,
  AutomationsRunResult,
  MainToUiMessage,
  StepOutputPreviewPayload,
} from "../../home/messages"
import { MAIN_TO_UI, UI_TO_MAIN } from "../../home/messages"
import { createNewAutomation, automationToExportJson, parseImportJson } from "./storage"
import { BuilderScreen } from "./ui/BuilderScreen"
import { InputDialog } from "./ui/InputDialog"
import { ListScreen } from "./ui/ListScreen"
import { RunOutputScreen } from "./ui/RunOutputScreen"
import { BUILDER_HEIGHT, BUILDER_WIDTH, LIST_HEIGHT, LIST_WIDTH, type Screen } from "./ui/types"
import { downloadTextFile, payloadToStep, postMessage, stepToPayload } from "./ui/utils"

export function AutomationsToolView(props: { onBack: () => void }) {
  const [screen, setScreen] = useState<Screen>("list")
  const [automations, setAutomations] = useState<AutomationListItem[]>([])
  const [editingAutomation, setEditingAutomation] = useState<AutomationPayload | null>(null)
  const [runProgress, setRunProgress] = useState<AutomationsRunProgress | null>(null)
  const [runResult, setRunResult] = useState<AutomationsRunResult | null>(null)
  const [inputRequest, setInputRequest] = useState<AutomationsInputRequest | null>(null)
  const [stepOutputs, setStepOutputs] = useState<StepOutputPreviewPayload[]>([])

  const autoSaveTimerRef = useRef<number | null>(null)
  const lastSavedRef = useRef<string>("")
  const screenRef = useRef<Screen>(screen)
  useEffect(() => { screenRef.current = screen }, [screen])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.AUTOMATIONS_LIST) {
        setAutomations(msg.automations)
      }
      if (msg.type === MAIN_TO_UI.AUTOMATIONS_FULL) {
        if (msg.automation) {
          setEditingAutomation(msg.automation)
          setScreen("builder")
          postMessage({ type: UI_TO_MAIN.RESIZE_WINDOW, width: BUILDER_WIDTH, height: BUILDER_HEIGHT })
        }
      }
      if (msg.type === MAIN_TO_UI.AUTOMATIONS_SAVED) {
        setEditingAutomation(msg.automation)
        lastSavedRef.current = JSON.stringify(msg.automation)
        postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD })
      }
      if (msg.type === MAIN_TO_UI.AUTOMATIONS_RUN_PROGRESS) {
        setRunProgress(msg.progress)
      }
      if (msg.type === MAIN_TO_UI.AUTOMATIONS_RUN_RESULT) {
        setRunResult(msg.result)
        setRunProgress(null)
        setInputRequest(null)
        if (msg.result.stepOutputs) {
          setStepOutputs(msg.result.stepOutputs)
        }
        if (screenRef.current !== "builder" && msg.result.log && msg.result.log.length > 0) {
          setScreen("runOutput")
          postMessage({ type: UI_TO_MAIN.RESIZE_WINDOW, width: BUILDER_WIDTH, height: BUILDER_HEIGHT })
        }
      }
      if (msg.type === MAIN_TO_UI.AUTOMATIONS_INPUT_REQUEST) {
        setInputRequest(msg.request)
      }
    }
    window.addEventListener("message", handleMessage)
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD })
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    if (!editingAutomation || screen !== "builder") return
    const currentJson = JSON.stringify(editingAutomation)
    if (currentJson === lastSavedRef.current) return

    if (autoSaveTimerRef.current !== null) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = window.setTimeout(() => {
      postMessage({
        type: UI_TO_MAIN.AUTOMATIONS_SAVE,
        automation: { ...editingAutomation, updatedAt: Date.now() },
      })
      autoSaveTimerRef.current = null
    }, 800) as unknown as number

    return () => {
      if (autoSaveTimerRef.current !== null) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [editingAutomation, screen])

  const handleCreateNew = useCallback(() => {
    setRunResult(null)
    setRunProgress(null)
    setStepOutputs([])
    const auto = createNewAutomation()
    const payload: AutomationPayload = {
      id: auto.id,
      name: auto.name,
      steps: [],
      createdAt: auto.createdAt,
      updatedAt: auto.updatedAt,
    }
    setEditingAutomation(payload)
    setScreen("builder")
    postMessage({ type: UI_TO_MAIN.RESIZE_WINDOW, width: BUILDER_WIDTH, height: BUILDER_HEIGHT })
  }, [])

  const handleEdit = useCallback((id: string) => {
    setRunResult(null)
    setRunProgress(null)
    setStepOutputs([])
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_GET, automationId: id })
  }, [])

  const handleRun = useCallback((id: string) => {
    setRunResult(null)
    setRunProgress(null)
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_RUN, automationId: id })
  }, [])

  const handleDelete = useCallback((id: string) => {
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_DELETE, automationId: id })
  }, [])

  const handleDuplicate = useCallback((id: string) => {
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_DUPLICATE, automationId: id })
  }, [])

  const handleImport = useCallback((files: File[]) => {
    if (files.length === 0) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const automation = parseImportJson(text)
      if (!automation) {
        return
      }
      const payload: AutomationPayload = {
        id: automation.id,
        name: automation.name,
        steps: automation.steps.map(stepToPayload),
        createdAt: automation.createdAt,
        updatedAt: automation.updatedAt,
      }
      postMessage({ type: UI_TO_MAIN.AUTOMATIONS_SAVE, automation: payload })
    }
    reader.readAsText(files[0])
  }, [])

  const handleInputSubmit = useCallback((value: string) => {
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_INPUT_RESPONSE, value })
    setInputRequest(null)
  }, [])

  const handleInputCancel = useCallback(() => {
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_INPUT_RESPONSE, value: "", cancelled: true })
    setInputRequest(null)
  }, [])

  const handleSave = useCallback(() => {
    if (!editingAutomation) return
    postMessage({
      type: UI_TO_MAIN.AUTOMATIONS_SAVE,
      automation: { ...editingAutomation, updatedAt: Date.now() },
    })
  }, [editingAutomation])

  const handleBuilderRun = useCallback(() => {
    if (!editingAutomation) return
    if (autoSaveTimerRef.current !== null) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
    const updated = { ...editingAutomation, updatedAt: Date.now() }
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_SAVE, automation: updated })
    lastSavedRef.current = JSON.stringify(updated)
    setRunResult(null)
    setRunProgress(null)
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_RUN, automationId: editingAutomation.id })
  }, [editingAutomation])

  const handleBuilderRunToStep = useCallback((stepIndex: number) => {
    if (!editingAutomation) return
    if (autoSaveTimerRef.current !== null) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
    const updated = { ...editingAutomation, updatedAt: Date.now() }
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_SAVE, automation: updated })
    lastSavedRef.current = JSON.stringify(updated)
    setRunResult(null)
    setRunProgress(null)
    postMessage({
      type: UI_TO_MAIN.AUTOMATIONS_RUN,
      automationId: editingAutomation.id,
      runToStepIndex: stepIndex,
    })
  }, [editingAutomation])

  const handleBuilderExport = useCallback(() => {
    if (!editingAutomation) return
    const automation = {
      id: editingAutomation.id,
      name: editingAutomation.name,
      steps: editingAutomation.steps.map(payloadToStep),
      createdAt: editingAutomation.createdAt,
      updatedAt: editingAutomation.updatedAt,
    }
    const json = automationToExportJson(automation)
    const filename = `${editingAutomation.name.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-")}.json`
    downloadTextFile(filename, json)
  }, [editingAutomation])

  const goToList = useCallback(() => {
    if (autoSaveTimerRef.current !== null) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
    if (editingAutomation) {
      const updated = { ...editingAutomation, updatedAt: Date.now() }
      postMessage({ type: UI_TO_MAIN.AUTOMATIONS_SAVE, automation: updated })
      lastSavedRef.current = JSON.stringify(updated)
    }
    setScreen("list")
    setEditingAutomation(null)
    setRunResult(null)
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD })
    postMessage({ type: UI_TO_MAIN.RESIZE_WINDOW, width: LIST_WIDTH, height: LIST_HEIGHT })
  }, [editingAutomation])

  if (screen === "runOutput" && runResult) {
    return (
      <RunOutputScreen
        result={runResult}
        onBack={goToList}
      />
    )
  }

  if (screen === "builder" && editingAutomation) {
    return (
      <Fragment>
        <BuilderScreen
          automation={editingAutomation}
          onBack={goToList}
          onChange={setEditingAutomation}
          onRun={handleBuilderRun}
          onRunToStep={handleBuilderRunToStep}
          onExport={handleBuilderExport}
          runProgress={runProgress}
          runResult={runResult}
          stepOutputs={stepOutputs}
        />
        {inputRequest && (
          <InputDialog
            request={inputRequest}
            onSubmit={handleInputSubmit}
            onCancel={handleInputCancel}
          />
        )}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <ListScreen
        automations={automations}
        runProgress={runProgress}
        runResult={runResult}
        onBack={props.onBack}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onRun={handleRun}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onImport={handleImport}
      />
      {inputRequest && (
        <InputDialog
          request={inputRequest}
          onSubmit={handleInputSubmit}
          onCancel={handleInputCancel}
        />
      )}
    </Fragment>
  )
}
