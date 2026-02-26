import {
  Button,
  Container,
  Checkbox,
  Divider,
  Dropdown,
  FileUploadButton,
  IconButton,
  IconChevronRight16,
  IconClose16,
  IconHome16,
  IconPlus16,
  Stack,
  Text,
  Textbox,
  TextboxMultiline,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"
import { useEffect, useState, useCallback, useRef } from "preact/hooks"

import { IconArrowUp16, IconArrowDown16, IconChevronLeft16 } from "../../../../custom-icons/generated"
import { Page } from "../../components/Page"
import { ToolHeader } from "../../components/ToolHeader"
import { ToolBody } from "../../components/ToolBody"
import { State } from "../../components/State"
import { DataList } from "../../components/DataList"
import { ToolFooter } from "../../components/ToolFooter"
import { copyTextToClipboard } from "../../utils/clipboard"
import { plural } from "../../utils/pluralize"
import {
  MAIN_TO_UI,
  UI_TO_MAIN,
  type MainToUiMessage,
  type AutomationListItem,
  type AutomationPayload,
  type AutomationStepPayload,
  type AutomationsRunProgress,
  type AutomationsRunResult,
  type AutomationsStepLog,
  type AutomationsInputRequest,
} from "../../messages"
import {
  ACTION_DEFINITIONS,
  ACTION_CATEGORIES,
  type ActionType,
  type ActionDefinition,
  type ActionCategory,
  type AutomationStep,
  type FilterCondition,
  type FilterField,
  type FilterLogic,
  VALID_NODE_TYPES,
  MATCH_MODES,
  FIND_SCOPES,
  FILTER_FIELDS,
  getActionsByCategory,
  getOperatorsForField,
  generateDefaultOutputName,
  collectOutputNames,
} from "../../tools/automations/types"
import { PROPERTY_REGISTRY } from "../../tools/automations/properties"
import { TextboxWithSuggestions, type Suggestion } from "../../components/TextboxWithSuggestions"
import { TokenInput } from "../../components/TokenInput"
import {
  createNewAutomation,
  automationToExportJson,
  parseImportJson,
} from "../../tools/automations/storage"
import { ButtonWithIcon } from "../../components/ButtonWithIcon"
import { TokenText, stripTokenSyntax } from "../../components/TokenPill"

type Screen = "list" | "builder" | "runOutput"

const BUILDER_WIDTH = 680
const BUILDER_HEIGHT = 520
const LIST_WIDTH = 360
const LIST_HEIGHT = 500

function postMessage(msg: object) {
  parent.postMessage({ pluginMessage: msg }, "*")
}

function safeDropdownValue(value: string, options: { value: string }[]): string {
  return options.some((o) => o.value === value) ? value : options[0]?.value ?? ""
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function stepToPayload(s: AutomationStep): AutomationStepPayload {
  const payload: AutomationStepPayload = {
    id: s.id,
    actionType: s.actionType,
    params: s.params,
    enabled: s.enabled,
  }
  if (s.outputName) payload.outputName = s.outputName
  if (s.target) payload.target = s.target
  if (s.children && s.children.length > 0) {
    payload.children = s.children.map(stepToPayload)
  }
  return payload
}

function payloadToStep(s: AutomationStepPayload): AutomationStep {
  const step: AutomationStep = {
    id: s.id,
    actionType: s.actionType as ActionType,
    params: s.params,
    enabled: s.enabled,
  }
  if (s.outputName) step.outputName = s.outputName
  if (s.target) step.target = s.target
  if (s.children && s.children.length > 0) {
    step.children = s.children.map(payloadToStep)
  }
  return step
}

function buildSuggestions(
  steps: AutomationStepPayload[],
  currentStepIndex: number,
  parentStep?: AutomationStepPayload,
  childIndex?: number,
): Suggestion[] {
  const suggestions: Suggestion[] = []

  suggestions.push(
    { token: "count", label: "Working set size", category: "Context" },
    { token: "index", label: "Position in set", category: "Context" },
  )

  for (const prop of PROPERTY_REGISTRY) {
    suggestions.push({
      token: prop.key,
      label: prop.label,
      category: "Properties",
    })
  }

  for (let i = 0; i < currentStepIndex && i < steps.length; i++) {
    const step = steps[i]
    if (!step.outputName) continue
    const def = ACTION_DEFINITIONS.find((d) => d.type === step.actionType)
    const isData = def?.producesData === true
    suggestions.push({
      token: isData ? `$${step.outputName}` : `#${step.outputName}`,
      label: `${def?.label ?? step.actionType} output`,
      category: "Step outputs",
    })
    if (!isData) {
      for (const prop of PROPERTY_REGISTRY) {
        suggestions.push({
          token: `#${step.outputName}.${prop.key}`,
          label: `${prop.label} from "${step.outputName}"`,
          category: step.outputName,
        })
      }
    }
  }

  if (parentStep?.actionType === "repeatWithEach") {
    const itemVar = String(parentStep.params.itemVar ?? "item")
    suggestions.push(
      { token: `$${itemVar}`, label: "Current loop item", category: "Loop" },
      { token: "$repeatIndex", label: "Current iteration index", category: "Loop" },
    )
    for (const prop of PROPERTY_REGISTRY) {
      suggestions.push({
        token: `$${itemVar}.${prop.key}`,
        label: `${prop.label} of current item`,
        category: "Loop item properties",
      })
    }

    // Sibling child step outputs (earlier children within the same repeat)
    const children = parentStep.children ?? []
    if (childIndex !== undefined) {
      for (let i = 0; i < childIndex && i < children.length; i++) {
        const child = children[i]
        if (!child.outputName) continue
        const def = ACTION_DEFINITIONS.find((d) => d.type === child.actionType)
        const isData = def?.producesData === true
        suggestions.push({
          token: isData ? `$${child.outputName}` : `#${child.outputName}`,
          label: `${def?.label ?? child.actionType} output`,
          category: "Step outputs",
        })
      }
    }
  }

  return suggestions
}

export function AutomationsToolView(props: { onBack: () => void }) {
  const [screen, setScreen] = useState<Screen>("list")
  const [automations, setAutomations] = useState<AutomationListItem[]>([])
  const [editingAutomation, setEditingAutomation] = useState<AutomationPayload | null>(null)
  const [runProgress, setRunProgress] = useState<AutomationsRunProgress | null>(null)
  const [runResult, setRunResult] = useState<AutomationsRunResult | null>(null)
  const [inputRequest, setInputRequest] = useState<AutomationsInputRequest | null>(null)

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
          onExport={handleBuilderExport}
          runProgress={runProgress}
          runResult={runResult}
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

// ============================================================================
// Input Dialog (overlay during askForInput execution)
// ============================================================================

function InputDialog(props: {
  request: AutomationsInputRequest
  onSubmit: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(props.request.defaultValue ?? "")

  const handleSubmit = () => {
    props.onSubmit(value)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && props.request.inputType === "text") {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      e.preventDefault()
      props.onCancel()
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        style={{
          background: "var(--figma-color-bg)",
          borderRadius: 8,
          padding: 16,
          width: 300,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: 600 }}>{props.request.label}</Text>
        <VerticalSpace space="small" />
        {props.request.inputType === "textarea" ? (
          <TextboxMultiline
            value={value}
            onValueInput={setValue}
            placeholder={props.request.placeholder || "Enter text..."}
            rows={6}
          />
        ) : (
          <Textbox
            value={value}
            onValueInput={setValue}
            onKeyDown={handleKeyDown}
            placeholder={props.request.placeholder || "Enter text..."}
          />
        )}
        <VerticalSpace space="small" />
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            style={{ flex: 1 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            style={{ flex: 1 }}
            secondary
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// List Screen
// ============================================================================

function ListScreen(props: {
  automations: AutomationListItem[]
  runProgress: AutomationsRunProgress | null
  runResult: AutomationsRunResult | null
  onBack: () => void
  onCreateNew: () => void
  onEdit: (id: string) => void
  onRun: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onImport: (files: File[]) => void
}) {
  return (
    <Page>
      <ToolHeader
        title="Automations"
        left={
          <IconButton onClick={props.onBack}>
            <IconHome16 />
          </IconButton>
        }
      />
      {props.automations.length === 0 ? (
        <ToolBody mode="state">
          <State
            title="No automations yet"
          />
        </ToolBody>
      ) : (
        <ToolBody mode="content">
          {props.runProgress && (
            <Fragment>
              <div
                style={{
                  padding: "8px 0",
                  fontSize: 11,
                  color: "var(--figma-color-text-secondary)",
                }}
              >
                Running "{props.runProgress.automationName}" — step {props.runProgress.currentStep}/
                {props.runProgress.totalSteps}: {props.runProgress.stepName}
              </div>
              <VerticalSpace space="small" />
            </Fragment>
          )}
          {props.runResult && (
            <Fragment>
              <div
                style={{
                  padding: "8px 0",
                  fontSize: 11,
                  color: props.runResult.success
                    ? "var(--figma-color-text-success)"
                    : "var(--figma-color-text-danger)",
                }}
              >
                {props.runResult.message}
                {props.runResult.errors.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    {props.runResult.errors.map((e, i) => (
                      <div key={i}>{e}</div>
                    ))}
                  </div>
                )}
              </div>
              <VerticalSpace space="small" />
            </Fragment>
          )}
          <DataList header={plural(props.automations.length, "automation")}>
            {props.automations.map((a) => (
              <AutomationRow
                key={a.id}
                automation={a}
                onEdit={() => props.onEdit(a.id)}
                onRun={() => props.onRun(a.id)}
                onDelete={() => props.onDelete(a.id)}
                onDuplicate={() => props.onDuplicate(a.id)}
              />
            ))}
          </DataList>
        </ToolBody>
      )}
      <ToolFooter>
        <Button
          fullWidth
          onClick={props.onCreateNew}
        >
          New automation
        </Button>
        <FileUploadButton
          acceptedFileTypes={["application/json", ".json"]}
          fullWidth
          onSelectedFiles={props.onImport}
          secondary
        >
          Import from JSON
        </FileUploadButton>
      </ToolFooter>
    </Page>
  )
}

function AutomationRow(props: {
  automation: AutomationListItem
  onEdit: () => void
  onRun: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const a = props.automation

  const menuOpen = menuPos !== null

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setMenuPos(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuPos(null)
      return
    }
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const menuHeight = 60
    const spaceBelow = window.innerHeight - rect.bottom
    const y = spaceBelow >= menuHeight + 4
      ? rect.bottom + 2
      : rect.top - menuHeight - 2
    setMenuPos({ x: rect.right, y })
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuPos(null) }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        gap: 8,
        background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
        borderRadius: 4,
        cursor: "pointer",
      }}
      onClick={props.onEdit}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--figma-color-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {a.name}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          flexShrink: 0,
          alignItems: "center",
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={props.onRun}
          style={{ fontSize: 10, padding: "2px 8px", minHeight: 0 }}
        >
          <Text>Run</Text>
        </Button>
        <div ref={triggerRef}>
          <div
            onClick={toggleMenu}
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "pointer",
              background: menuOpen ? "var(--figma-color-bg-pressed)" : "transparent",
              color: "var(--figma-color-text-secondary)",
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            ···
          </div>
        </div>
        {menuOpen && menuPos && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: menuPos.x,
              top: menuPos.y,
              transform: "translateX(-100%)",
              background: "var(--figma-color-bg)",
              border: "1px solid var(--figma-color-border)",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 9999,
              minWidth: 120,
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => { setMenuPos(null); props.onDuplicate() }}
              style={{
                padding: "6px 12px",
                fontSize: 11,
                cursor: "pointer",
                color: "var(--figma-color-text)",
                background: "transparent",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--figma-color-bg-hover)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              Duplicate
            </div>
            <div
              onClick={() => { setMenuPos(null); props.onDelete() }}
              style={{
                padding: "6px 12px",
                fontSize: 11,
                cursor: "pointer",
                color: "var(--figma-color-text-danger)",
                background: "transparent",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--figma-color-bg-hover)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Run Output Screen
// ============================================================================

function formatLogAsText(result: AutomationsRunResult): string {
  const lines: string[] = []
  lines.push(result.success ? "Completed successfully" : "Completed with errors")
  lines.push(`${result.stepsCompleted} of ${plural(result.totalSteps, "step")} completed`)
  lines.push("")
  if (result.log) {
    for (const entry of result.log) {
      const status = entry.status === "success" ? "OK" : entry.status === "error" ? "ERR" : "SKIP"
      lines.push(`[${status}] ${entry.stepIndex + 1}. ${entry.stepName}  (${entry.itemsIn} → ${entry.itemsOut})`)
      if (entry.message) lines.push(`     ${stripTokenSyntax(entry.message)}`)
    }
  }
  if (result.errors.length > 0) {
    lines.push("")
    lines.push("Errors:")
    for (const e of result.errors) lines.push(`  - ${e}`)
  }
  return lines.join("\n")
}

function RunOutputScreen(props: {
  result: AutomationsRunResult
  onBack: () => void
}) {
  const { result } = props
  const [copied, setCopied] = useState(false)

  const handleCopyLog = useCallback(async () => {
    const text = formatLogAsText(result)
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  return (
    <Page>
      <ToolHeader
        title="Run Output"
        left={
          <IconButton onClick={props.onBack}>
            <IconChevronLeft16/>
          </IconButton>
        }
      />
      <ToolBody mode="content">
        <div
          style={{
            padding: "8px 0 4px 0",
            fontSize: 11,
            fontWeight: 600,
            color: result.success
              ? "var(--figma-color-text-success)"
              : "var(--figma-color-text-danger)",
          }}
        >
          {result.success ? "Completed successfully" : "Completed with errors"}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            marginBottom: 8,
          }}
        >
          {result.stepsCompleted} of {plural(result.totalSteps, "step")} completed
        </div>

        {result.log && result.log.length > 0 && (
          <DataList header="Step log">
            {result.log.map((entry, i) => (
              <StepLogRow key={i} entry={entry} />
            ))}
          </DataList>
        )}
      </ToolBody>
      <div
        style={{
          borderTop: "1px solid var(--figma-color-border)",
          padding: "8px 12px",
          display: "flex",
          gap: 8,
        }}
      >
        <Button style={{ flex: 1 }} onClick={props.onBack}>
          Done
        </Button>
        <Button style={{ flex: 1 }} secondary onClick={handleCopyLog}>
          {copied ? "Copied!" : "Copy log"}
        </Button>
      </div>
    </Page>
  )
}

function StepLogRow(props: { entry: AutomationsStepLog }) {
  const { entry } = props
  const statusColor =
    entry.status === "success"
      ? "var(--figma-color-text-success)"
      : entry.status === "error"
        ? "var(--figma-color-text-danger)"
        : "var(--figma-color-text-secondary)"

  return (
    <div style={{ padding: "6px 8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: statusColor,
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: 11, color: "var(--figma-color-text)", flex: 1 }}>
          {entry.stepIndex + 1}. {entry.stepName}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            flexShrink: 0,
          }}
        >
          {entry.itemsIn} → {entry.itemsOut}
        </div>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--figma-color-text-secondary)",
          marginTop: 2,
          paddingLeft: 12,
        }}
      >
        {entry.message && <TokenText text={entry.message} />}
      </div>
    </div>
  )
}

// ============================================================================
// Builder Screen — Two-column layout
// ============================================================================

type RightPanel = "empty" | "picker" | "config" | "runOutput"
type StepPath = { index: number; childIndex?: number }

function stepsPathEqual(a: StepPath | null, b: StepPath | null): boolean {
  if (!a || !b) return a === b
  return a.index === b.index && a.childIndex === b.childIndex
}

function BuilderScreen(props: {
  automation: AutomationPayload
  onBack: () => void
  onChange: (a: AutomationPayload) => void
  onRun: () => void
  onExport: () => void
  runProgress: AutomationsRunProgress | null
  runResult: AutomationsRunResult | null
}) {
  const { automation, onChange } = props
  const [selectedPath, setSelectedPath] = useState<StepPath | null>(null)
  const [rightPanel, setRightPanel] = useState<RightPanel>("empty")
  const [pickerParentIndex, setPickerParentIndex] = useState<number | null>(null)

  const getSelectedStep = (): AutomationStepPayload | null => {
    if (!selectedPath) return null
    const topStep = automation.steps[selectedPath.index]
    if (!topStep) return null
    if (selectedPath.childIndex !== undefined) {
      return topStep.children?.[selectedPath.childIndex] ?? null
    }
    return topStep
  }

  const selectedStep = getSelectedStep()

  const addStep = (actionType: ActionType) => {
    const def = ACTION_DEFINITIONS.find((d) => d.type === actionType)
    if (!def) return

    const existingNames = collectOutputNames(automation.steps)
    const outputName = actionType === "repeatWithEach"
      ? undefined
      : generateDefaultOutputName(actionType, existingNames)

    const params = { ...def.defaultParams }

    const prevStep = pickerParentIndex !== null
      ? (automation.steps[pickerParentIndex].children ?? []).at(-1) ?? automation.steps[pickerParentIndex]
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
    }

    if (pickerParentIndex !== null) {
      const parentStep = automation.steps[pickerParentIndex]
      if (parentStep?.actionType === "repeatWithEach") {
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
      const children = [...(parent.children ?? []), newStep]
      parent.children = children
      steps[pickerParentIndex] = parent
      onChange({ ...automation, steps })
      setSelectedPath({ index: pickerParentIndex, childIndex: children.length - 1 })
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
      const parent = { ...steps[path.index] }
      const children = [...(parent.children ?? [])]
      children.splice(path.childIndex, 1)
      parent.children = children.length > 0 ? children : undefined
      steps[path.index] = parent
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
      const parent = { ...steps[path.index] }
      const children = [...(parent.children ?? [])]
      const newIdx = path.childIndex + direction
      if (newIdx < 0 || newIdx >= children.length) return
      const temp = children[path.childIndex]
      children[path.childIndex] = children[newIdx]
      children[newIdx] = temp
      parent.children = children
      steps[path.index] = parent
      onChange({ ...automation, steps })
      if (stepsPathEqual(selectedPath, path)) {
        setSelectedPath({ index: path.index, childIndex: newIdx })
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

  const toggleStep = (path: StepPath) => {
    const steps = [...automation.steps]
    if (path.childIndex !== undefined) {
      const parent = { ...steps[path.index] }
      const children = [...(parent.children ?? [])]
      children[path.childIndex] = { ...children[path.childIndex], enabled: !children[path.childIndex].enabled }
      parent.children = children
      steps[path.index] = parent
    } else {
      steps[path.index] = { ...steps[path.index], enabled: !steps[path.index].enabled }
    }
    onChange({ ...automation, steps })
  }

  const selectStep = (path: StepPath) => {
    setSelectedPath(path)
    setRightPanel("config")
  }

  const showPicker = (parentIndex?: number) => {
    setSelectedPath(null)
    setPickerParentIndex(parentIndex ?? null)
    setRightPanel("picker")
  }

  const handleRunClick = () => {
    setSelectedPath(null)
    setRightPanel("runOutput")
    props.onRun()
  }

  const updateStepParam = (key: string, value: unknown) => {
    if (!selectedPath || !selectedStep) return
    const steps = [...automation.steps]
    if (selectedPath.childIndex !== undefined) {
      const parent = { ...steps[selectedPath.index] }
      const children = [...(parent.children ?? [])]
      children[selectedPath.childIndex] = {
        ...children[selectedPath.childIndex],
        params: { ...children[selectedPath.childIndex].params, [key]: value },
      }
      parent.children = children
      steps[selectedPath.index] = parent
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
      const parent = { ...steps[selectedPath.index] }
      const children = [...(parent.children ?? [])]
      children[selectedPath.childIndex] = {
        ...children[selectedPath.childIndex],
        outputName: value || undefined,
      }
      parent.children = children
      steps[selectedPath.index] = parent
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
      const parent = { ...steps[selectedPath.index] }
      const children = [...(parent.children ?? [])]
      children[selectedPath.childIndex] = {
        ...children[selectedPath.childIndex],
        target: value || undefined,
      }
      parent.children = children
      steps[selectedPath.index] = parent
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
        title="Edit Automation"
        left={
          <IconButton onClick={props.onBack}>
            <IconChevronLeft16
            />
          </IconButton>
        }
      />

      {/* Two-column body */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left column — step list */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            borderRight: "1px solid var(--figma-color-border)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Name field */}
          <div style={{ padding: "8px 12px 0 12px" }}>
            <Textbox
              value={automation.name}
              onValueInput={(value: string) => onChange({ ...automation, name: value })}
              placeholder="Automation name"
            />
          </div>

          {/* Step list (scrollable) */}
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
                      onSelect={() => selectStep({ index: idx })}
                      onToggle={() => toggleStep({ index: idx })}
                      onRemove={() => removeStep({ index: idx })}
                      onMoveUp={() => moveStep({ index: idx }, -1)}
                      onMoveDown={() => moveStep({ index: idx }, 1)}
                    />
                    {step.actionType === "repeatWithEach" && (
                      <RepeatChildrenBlock
                        parentIndex={idx}
                        children={step.children ?? []}
                        selectedPath={selectedPath}
                        onSelectChild={(childIdx) => selectStep({ index: idx, childIndex: childIdx })}
                        onToggleChild={(childIdx) => toggleStep({ index: idx, childIndex: childIdx })}
                        onRemoveChild={(childIdx) => removeStep({ index: idx, childIndex: childIdx })}
                        onMoveChild={(childIdx, dir) => moveStep({ index: idx, childIndex: childIdx }, dir)}
                        onAddChild={() => showPicker(idx)}
                      />
                    )}
                  </Fragment>
                ))}
              </Stack>
            )}
          </div>

          {/* Add step button */}
          <ToolFooter>
            <ButtonWithIcon icon={<IconPlus16 />} fullWidth secondary onClick={() => showPicker()}>
                Add step
              </ButtonWithIcon>
          </ToolFooter>
        </div>

        {/* Right column — dynamic panel */}
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
            return (
              <StepConfigPanel
                step={selectedStep}
                stepIndex={selectedPath.index}
                allSteps={automation.steps}
                parentStep={parentStep}
                onUpdateParam={updateStepParam}
                onUpdateOutputName={updateStepOutputName}
                onUpdateTarget={updateStepTarget}
                suggestions={buildSuggestions(
                  automation.steps,
                  selectedPath.index,
                  parentStep,
                  selectedPath.childIndex,
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

      {/* Footer */}
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

// ============================================================================
// Step Row (left column)
// ============================================================================

function StepRow(props: {
  step: AutomationStepPayload
  index: number
  total: number
  selected: boolean
  onSelect: () => void
  onToggle: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  labelPrefix?: string
}) {
  const [hovered, setHovered] = useState(false)
  const def = ACTION_DEFINITIONS.find((d) => d.type === props.step.actionType)
  const label = def?.label ?? props.step.actionType
  const categoryLabel = def ? getCategoryBadge(def.category) : ""
  const paramSummary = getParamSummary(props.step)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={props.onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
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
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          value={props.step.enabled}
          onValueChange={props.onToggle}
        >
          <Text>{" "}</Text>
        </Checkbox>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--figma-color-text)" }}>
          <span>{props.labelPrefix ?? ""}{props.index + 1}. {label}</span>
          {categoryLabel && (
            <span
              style={{
                fontSize: 9,
                color: "var(--figma-color-text-tertiary)",
                background: "var(--figma-color-bg-secondary)",
                padding: "1px 4px",
                borderRadius: 3,
              }}
            >
              {categoryLabel}
            </span>
          )}
        </div>
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
        {(props.step.target || props.step.outputName) && (
          <div
            style={{
              fontSize: 9,
              color: "var(--figma-color-text-brand)",
              marginTop: 1,
              display: "flex",
              gap: 4,
            }}
          >
            {props.step.target && <span><TokenText text={`{#${props.step.target}}`} /> →</span>}
            {props.step.outputName && <span>→ <TokenText text={`{${def?.producesData ? "$" : "#"}${props.step.outputName}}`} /></span>}
          </div>
        )}
      </div>
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

function RepeatChildrenBlock(props: {
  parentIndex: number
  children: AutomationStepPayload[]
  selectedPath: StepPath | null
  onSelectChild: (childIdx: number) => void
  onToggleChild: (childIdx: number) => void
  onRemoveChild: (childIdx: number) => void
  onMoveChild: (childIdx: number, direction: -1 | 1) => void
  onAddChild: () => void
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
          {props.children.map((child, childIdx) => (
            <StepRow
              key={child.id}
              step={child}
              index={childIdx}
              total={props.children.length}
              selected={stepsPathEqual(props.selectedPath, { index: props.parentIndex, childIndex: childIdx })}
              onSelect={() => props.onSelectChild(childIdx)}
              onToggle={() => props.onToggleChild(childIdx)}
              onRemove={() => props.onRemoveChild(childIdx)}
              onMoveUp={() => props.onMoveChild(childIdx, -1)}
              onMoveDown={() => props.onMoveChild(childIdx, 1)}
              labelPrefix={`${props.parentIndex + 1}.`}
            />
          ))}
        </Stack>
      )}
      <div style={{ paddingTop: 4 }}>
        <Button
          secondary
          onClick={props.onAddChild}
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

function getCategoryBadge(category: ActionCategory): string {
  switch (category) {
    case "source": return "SRC"
    case "filter": return "FLT"
    case "navigate": return "NAV"
    case "transform": return "TRN"
    case "input": return "IN"
    case "variables": return "VAR"
    case "flow": return "FLW"
    case "output": return "OUT"
    default: return ""
  }
}

function getParamSummary(step: AutomationStepPayload): string {
  const p = step.params
  switch (step.actionType) {
    case "sourceFromSelection":
    case "sourceFromPage":
    case "sourceFromAllPages":
      return ""
    case "sourceFromPageByName":
      return String(p.pageName ?? "")
    case "filter":
    case "filterByType":
    case "filterByName": {
      const conditions = (p.conditions ?? []) as { field: string; operator: string; value: unknown }[]
      if (conditions.length === 0) {
        if (p.nodeType) return `type = ${p.nodeType}`
        if (p.pattern) return `name ~ "${p.pattern}"`
        return ""
      }
      const logic = String(p.logic ?? "and").toUpperCase()
      const parts = conditions.map((c) => {
        const opSymbol = c.operator === "contains" ? "~" : c.operator === "startsWith" ? "^" : c.operator === "endsWith" ? "$" : c.operator === "regex" ? "≈" : c.operator === "greaterThan" ? ">" : c.operator === "lessThan" ? "<" : c.operator === "is" || c.operator === "equals" ? "=" : c.operator === "isNot" || c.operator === "notEquals" ? "≠" : c.operator
        return `${c.field} ${opSymbol} ${String(c.value)}`
      })
      return conditions.length > 1 ? `${logic}: ${parts.join(", ")}` : parts[0]
    }
    case "expandToChildren":
      return ""
    case "renameLayers":
      return `"${p.find ?? ""}" → "${p.replace ?? ""}"`
    case "setName":
      return String(p.name ?? "")
    case "setFillColor":
    case "setStrokeColor":
      return String(p.hex ?? "")
    case "setFillVariable":
      return String(p.variableName ?? "")
    case "removeFills":
    case "removeStrokes":
      return ""
    case "setOpacity":
      return `${p.opacity ?? 100}%`
    case "setVisibility":
      return p.visible === false ? "hidden" : "visible"
    case "setLocked":
      return p.locked === false ? "unlocked" : "locked"
    case "setRotation":
      return `${p.degrees ?? "0"}°`
    case "removeNode":
      return ""
    case "cloneNode":
      return ""
    case "notify":
    case "log":
      return String(p.message ?? "")
    case "count":
      return String(p.label ?? "Count")
    case "selectResults":
      return ""
    case "setPipelineVariable":
      return p.variableName ? `{$${p.variableName}} = ${p.value ?? ""}` : ""
    case "setPipelineVariableFromProperty":
      return p.variableName ? `{$${p.variableName}} ← ${p.property ?? "name"}` : ""
    case "goToParent":
    case "flattenDescendants":
      return ""
    case "restoreNodes":
      return p.snapshotName ? `from {#${p.snapshotName}}` : ""
    case "setCharacters":
      return String(p.characters ?? "")
    case "setFontSize":
      return `${p.size ?? "16"}px`
    case "setFont":
      return `${p.family ?? "Inter"} ${p.style ?? "Regular"}`
    case "setTextAlignment":
      return String(p.align ?? "LEFT")
    case "setTextCase":
      return String(p.textCase ?? "ORIGINAL")
    case "setTextDecoration":
      return String(p.decoration ?? "NONE")
    case "setLineHeight": {
      const u = String(p.unit ?? "AUTO")
      if (u === "AUTO") return "AUTO"
      return `${p.value ?? ""}${u === "PERCENT" ? "%" : "px"}`
    }
    case "resize": {
      const parts: string[] = []
      if (p.width) parts.push(`W: ${p.width}`)
      if (p.height) parts.push(`H: ${p.height}`)
      return parts.join(", ")
    }
    case "setPosition": {
      const posParts: string[] = []
      if (p.x) posParts.push(`X: ${p.x}`)
      if (p.y) posParts.push(`Y: ${p.y}`)
      return posParts.join(", ")
    }
    case "wrapInFrame": {
      const al = String(p.autoLayout ?? "")
      return al ? `+ auto layout (${al})` : ""
    }
    case "wrapAllInFrame": {
      const al = String(p.autoLayout ?? "")
      const name = String(p.frameName ?? "Group")
      return al ? `${name}, auto layout (${al})` : name
    }
    case "addAutoLayout": {
      const dir = String(p.direction ?? "VERTICAL")
      const sp = p.itemSpacing ? `, spacing: ${p.itemSpacing}` : ""
      return `${dir}${sp}`
    }
    case "editAutoLayout": {
      const edits: string[] = []
      if (p.direction) edits.push(String(p.direction))
      if (p.itemSpacing) edits.push(`gap: ${p.itemSpacing}`)
      if (p.paddingTop || p.paddingRight || p.paddingBottom || p.paddingLeft) edits.push("padding")
      return edits.join(", ") || "no changes"
    }
    case "removeAutoLayout":
      return ""
    case "detachInstance":
      return ""
    case "swapComponent":
      return String(p.componentName ?? "")
    case "pasteComponentById":
      return String(p.componentId ?? "")
    case "askForInput":
      return String(p.label ?? "Enter text")
    case "splitText":
      return p.sourceVar ? `{$${p.sourceVar}}` : ""
    case "math": {
      const sym: Record<string, string> = { add: "+", subtract: "−", multiply: "×", divide: "÷" }
      const op = String(p.operation ?? "add")
      return `${p.x ?? "?"} ${sym[op] ?? "?"} ${p.y ?? "?"}`
    }
    case "repeatWithEach": {
      const src = String(p.source ?? "nodes")
      if (src === "nodes") return "nodes"
      return `{$${src}} → {$${p.itemVar ?? "item"}}`
    }
    default:
      return ""
  }
}

// ============================================================================
// Run Output Panel (right column)
// ============================================================================

function RunOutputPanel(props: {
  progress: AutomationsRunProgress | null
  result: AutomationsRunResult | null
}) {
  const { progress, result } = props

  if (progress) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            padding: "8px 12px",
            borderBottom: "1px solid var(--figma-color-border)",
            background: "var(--figma-color-bg-secondary)",
          }}
        >
          <Text style={{ fontWeight: 600, fontSize: 11 }}>Running…</Text>
        </div>
        <div style={{ padding: 12 }}>
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            Step {progress.currentStep}/{progress.totalSteps}: {progress.stepName}
          </Text>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
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
          Click ▶ Run to execute this automation
        </Text>
      </div>
    )
  }

  return (
    <RunOutputPanelWithResult result={result} />
  )
}

function RunOutputPanelWithResult(props: { result: AutomationsRunResult }) {
  const { result } = props
  const [copied, setCopied] = useState(false)

  const handleCopyLog = useCallback(async () => {
    const text = formatLogAsText(result)
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg-secondary)",
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: 11 }}>Run Output</Text>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        <div
          style={{
            padding: "4px 0",
            fontSize: 11,
            fontWeight: 600,
            color: result.success
              ? "var(--figma-color-text-success)"
              : "var(--figma-color-text-danger)",
          }}
        >
          {result.success ? "Completed successfully" : "Completed with errors"}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            marginBottom: 8,
          }}
        >
          {result.stepsCompleted} of {plural(result.totalSteps, "step")} completed
        </div>
        {result.log && result.log.length > 0 && (
          <div>
            {result.log.map((entry, i) => (
              <StepLogRow key={i} entry={entry} />
            ))}
          </div>
        )}
        {result.errors.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {result.errors.map((e, i) => (
              <div
                key={i}
                style={{
                  fontSize: 10,
                  color: "var(--figma-color-text-danger)",
                  padding: "2px 0",
                }}
              >
                {e}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          borderTop: "1px solid var(--figma-color-border)",
          padding: "8px",
          flexShrink: 0,
        }}
      >
        <Button fullWidth secondary onClick={handleCopyLog}>
          {copied ? "Copied!" : "Copy log"}
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// Action Picker Panel (right column) — organized by category
// ============================================================================

function ActionPickerPanel(props: { onSelect: (type: ActionType) => void }) {
  const [search, setSearch] = useState("")
  const query = search.toLowerCase().trim()

  const filteredCategories = ACTION_CATEGORIES.map((cat) => {
    const actions = getActionsByCategory(cat.key).filter(
      (def) =>
        !query ||
        def.label.toLowerCase().includes(query) ||
        def.description.toLowerCase().includes(query) ||
        def.type.toLowerCase().includes(query),
    )
    return { ...cat, actions }
  }).filter((cat) => cat.actions.length > 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg-secondary)",
        }}
      >
        <Textbox
          value={search}
          onValueInput={setSearch}
          placeholder="Search actions..."
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredCategories.length === 0 && (
          <div
            style={{
              padding: "24px 12px",
              fontSize: 11,
              color: "var(--figma-color-text-tertiary)",
              textAlign: "center",
            }}
          >
            No actions matching "{search}"
          </div>
        )}
        {filteredCategories.map((cat) => (
          <Fragment key={cat.key}>
            <div
              style={{
                padding: "8px 12px 4px 12px",
                fontSize: 10,
                fontWeight: 600,
                color: "var(--figma-color-text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {cat.label}
            </div>
            {cat.actions.map((def) => (
              <ActionPickerRow
                key={def.type}
                def={def}
                onSelect={() => props.onSelect(def.type)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function ActionPickerRow(props: { def: ActionDefinition; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={props.onSelect}
      style={{
        padding: "6px 12px",
        cursor: "pointer",
        background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--figma-color-text)" }}>{props.def.label}</div>
      <div
        style={{
          fontSize: 10,
          color: "var(--figma-color-text-secondary)",
          marginTop: 1,
        }}
      >
        {props.def.description}
      </div>
    </div>
  )
}

// ============================================================================
// Step Config Panel (right column)
// ============================================================================

function StepConfigPanel(props: {
  step: AutomationStepPayload
  stepIndex: number
  allSteps: AutomationStepPayload[]
  parentStep?: AutomationStepPayload
  onUpdateParam: (key: string, value: unknown) => void
  onUpdateOutputName: (value: string) => void
  onUpdateTarget: (value: string) => void
  suggestions: Suggestion[]
}) {
  const { step, stepIndex, allSteps, parentStep, onUpdateParam, onUpdateOutputName, onUpdateTarget, suggestions } = props
  const def = ACTION_DEFINITIONS.find((d) => d.type === step.actionType)
  const showTargetDropdown = def && !["source", "output", "variables", "flow", "input"].includes(def.category)
  const targetOptions = buildInputSourceOptions(allSteps, stepIndex, false)
    .filter((o) => {
      const sDef = ACTION_DEFINITIONS.find((d) => d.type === allSteps.find((s) => s.outputName === o.value)?.actionType)
      return sDef?.producesData !== true
    })

  return (
    <div style={{ padding: 12 }}>
      {def && (
        <Fragment>
          <Text style={{ fontWeight: 600, fontSize: 12 }}>{def.label}</Text>
          <VerticalSpace space="extraSmall" />
          <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
            {def.description}
          </Text>
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

      {step.actionType !== "repeatWithEach" && (
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
  )
}

function buildInputSourceOptions(
  steps: AutomationStepPayload[],
  currentStepIndex: number,
  dataOnly: boolean,
): { value: string; text: string }[] {
  const options: { value: string; text: string }[] = []
  for (let i = 0; i < currentStepIndex && i < steps.length; i++) {
    const s = steps[i]
    if (!s.outputName) continue
    const def = ACTION_DEFINITIONS.find((d) => d.type === s.actionType)
    const isData = def?.producesData === true
    if (dataOnly && !isData) continue
    options.push({
      value: s.outputName,
      text: `${s.outputName} (${def?.label ?? s.actionType})`,
    })
  }
  return options
}

function buildValueSourceOptions(
  steps: AutomationStepPayload[],
  currentStepIndex: number,
  propertyKey: string,
): { value: string; text: string }[] {
  const options: { value: string; text: string }[] = [
    { value: "", text: "Custom value" },
  ]
  const prop = PROPERTY_REGISTRY.find((p) => p.key === propertyKey)
  if (!prop || prop.valueType !== "number") return options

  for (let i = 0; i < currentStepIndex && i < steps.length; i++) {
    const s = steps[i]
    if (!s.outputName) continue
    const def = ACTION_DEFINITIONS.find((d) => d.type === s.actionType)
    if (def?.producesData) continue
    options.push({
      value: `{#${s.outputName}.${propertyKey}}`,
      text: `${prop.label} from ${s.outputName}`,
    })
  }
  return options
}

function renderInputContext(
  allSteps: AutomationStepPayload[],
  stepIndex: number,
  parentStep?: AutomationStepPayload,
  opts: { showTokens?: boolean; nodesLabel?: string } = {},
): h.JSX.Element | null {
  const { showTokens, nodesLabel = "Nodes from" } = opts
  const lines: h.JSX.Element[] = []

  if (stepIndex > 0) {
    const prev = allSteps[stepIndex - 1]
    if (prev) {
      const def = ACTION_DEFINITIONS.find((d) => d.type === prev.actionType)
      lines.push(
        <div key="prev">{nodesLabel}: <b>{def?.label ?? prev.actionType}</b></div>,
      )
    }
  }

  const isInRepeat = parentStep?.actionType === "repeatWithEach"
  if (isInRepeat) {
    const itemVar = String(parentStep!.params.itemVar ?? "item")
    const src = String(parentStep!.params.source ?? "nodes")
    lines.push(
      <div key="repeat">
        Inside <b>Repeat with each</b>
        {src !== "nodes" && (
          <Fragment> — use <TokenText text={`{$${itemVar}}`} /> for current item</Fragment>
        )}
      </div>,
    )
  }

  if (showTokens) {
    const tokenElements: h.JSX.Element[] = []
    for (let i = 0; i < stepIndex; i++) {
      const s = allSteps[i]
      if (!s.outputName) continue
      const def = ACTION_DEFINITIONS.find((d) => d.type === s.actionType)
      const raw = def?.producesData ? `{$${s.outputName}}` : `{#${s.outputName}}`
      tokenElements.push(<TokenText key={`t-${i}`} text={raw} />)
    }
    if (isInRepeat) {
      const itemVar = String(parentStep!.params.itemVar ?? "item")
      tokenElements.push(<TokenText key="t-item" text={`{$${itemVar}}`} />)
      tokenElements.push(<TokenText key="t-idx" text="{$repeatIndex}" />)
    }
    if (tokenElements.length > 0) {
      lines.push(
        <div key="tokens" style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
          Available: {tokenElements.reduce<(h.JSX.Element | string)[]>((acc, el, idx) => idx === 0 ? [el] : [...acc, " ", el], [])}
        </div>,
      )
    }
  }

  if (lines.length === 0) return null
  return (
    <Fragment>
      <Text style={{ fontSize: 11 }}>Input</Text>
      <VerticalSpace space="extraSmall" />
      <Text style={{ fontSize: 10, color: "var(--figma-color-text-tertiary)" }}>
        {lines}
      </Text>
      <VerticalSpace space="small" />
    </Fragment>
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
          <TextboxWithSuggestions
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
          <TextboxWithSuggestions
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
          <TextboxWithSuggestions
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
            padding: "6px 8px", background: "#fff1f2", border: "1px solid #fecdd3",
            borderRadius: 4, color: "#9f1239", fontSize: 11,
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
          <TextboxWithSuggestions
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
            <TextboxWithSuggestions
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
            <TextboxWithSuggestions
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
            <TextboxWithSuggestions
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
            <TextboxWithSuggestions
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
          <TextboxWithSuggestions
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
          <TextboxWithSuggestions
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

    case "notify":
    case "log":
      return (
        <Fragment>
          {inputCtxTokens}
          <Text style={{ fontSize: 11 }}>Message</Text>
          <VerticalSpace space="extraSmall" />
          <TextboxWithSuggestions
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
          <TextboxWithSuggestions
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
