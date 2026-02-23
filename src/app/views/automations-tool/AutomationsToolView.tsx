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
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"
import { useEffect, useState, useCallback } from "preact/hooks"

import { IconArrowUp16, IconArrowDown16, IconChevronLeft16 } from "../../../../custom-icons/generated"
import { Page } from "../../components/Page"
import { ToolHeader } from "../../components/ToolHeader"
import { ToolBody } from "../../components/ToolBody"
import { State } from "../../components/State"
import { DataList } from "../../components/DataList"
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
} from "../../messages"
import {
  ACTION_DEFINITIONS,
  ACTION_CATEGORIES,
  type ActionType,
  type ActionDefinition,
  type ActionCategory,
  VALID_NODE_TYPES,
  MATCH_MODES,
  FIND_SCOPES,
  getActionsByCategory,
} from "../../tools/automations/types"
import { PROPERTY_REGISTRY } from "../../tools/automations/properties"
import {
  createNewAutomation,
  automationToExportJson,
  parseImportJson,
} from "../../tools/automations/storage"

type Screen = "list" | "builder" | "runOutput"

const BUILDER_WIDTH = 680
const BUILDER_HEIGHT = 520
const LIST_WIDTH = 360
const LIST_HEIGHT = 500

function postMessage(msg: object) {
  parent.postMessage({ pluginMessage: msg }, "*")
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

export function AutomationsToolView(props: { onBack: () => void }) {
  const [screen, setScreen] = useState<Screen>("list")
  const [automations, setAutomations] = useState<AutomationListItem[]>([])
  const [editingAutomation, setEditingAutomation] = useState<AutomationPayload | null>(null)
  const [runProgress, setRunProgress] = useState<AutomationsRunProgress | null>(null)
  const [runResult, setRunResult] = useState<AutomationsRunResult | null>(null)

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
        postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD })
      }
      if (msg.type === MAIN_TO_UI.AUTOMATIONS_RUN_PROGRESS) {
        setRunProgress(msg.progress)
      }
      if (msg.type === MAIN_TO_UI.AUTOMATIONS_RUN_RESULT) {
        setRunResult(msg.result)
        setRunProgress(null)
        if (msg.result.log && msg.result.log.length > 0) {
          setScreen("runOutput")
          postMessage({ type: UI_TO_MAIN.RESIZE_WINDOW, width: BUILDER_WIDTH, height: BUILDER_HEIGHT })
        }
      }
    }
    window.addEventListener("message", handleMessage)
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD })
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handleCreateNew = useCallback(() => {
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
        steps: automation.steps.map((s) => ({
          id: s.id,
          actionType: s.actionType,
          params: s.params,
          enabled: s.enabled,
        })),
        createdAt: automation.createdAt,
        updatedAt: automation.updatedAt,
      }
      postMessage({ type: UI_TO_MAIN.AUTOMATIONS_SAVE, automation: payload })
    }
    reader.readAsText(files[0])
  }, [])

  const handleSave = useCallback(() => {
    if (!editingAutomation) return
    postMessage({
      type: UI_TO_MAIN.AUTOMATIONS_SAVE,
      automation: { ...editingAutomation, updatedAt: Date.now() },
    })
  }, [editingAutomation])

  const handleBuilderExport = useCallback(() => {
    if (!editingAutomation) return
    const automation = {
      id: editingAutomation.id,
      name: editingAutomation.name,
      steps: editingAutomation.steps.map((s) => ({
        id: s.id,
        actionType: s.actionType as ActionType,
        params: s.params,
        enabled: s.enabled,
      })),
      createdAt: editingAutomation.createdAt,
      updatedAt: editingAutomation.updatedAt,
    }
    const json = automationToExportJson(automation)
    const filename = `${editingAutomation.name.replace(/[^a-zA-Z0-9-_ ]/g, "").replace(/\s+/g, "-")}.json`
    downloadTextFile(filename, json)
  }, [editingAutomation])

  const goToList = useCallback(() => {
    if (editingAutomation) {
      postMessage({
        type: UI_TO_MAIN.AUTOMATIONS_SAVE,
        automation: { ...editingAutomation, updatedAt: Date.now() },
      })
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
      <BuilderScreen
        automation={editingAutomation}
        onBack={goToList}
        onChange={setEditingAutomation}
        onSave={handleSave}
        onExport={handleBuilderExport}
      />
    )
  }

  return (
    <ListScreen
      automations={automations}
      runProgress={runProgress}
      runResult={runResult}
      onBack={props.onBack}
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onRun={handleRun}
      onDelete={handleDelete}
      onImport={handleImport}
    />
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
            description="Create your first automation or import one from a JSON file"
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
          <DataList header={`${props.automations.length} automation(s)`}>
            {props.automations.map((a) => (
              <AutomationRow
                key={a.id}
                automation={a}
                onEdit={() => props.onEdit(a.id)}
                onRun={() => props.onRun(a.id)}
                onDelete={() => props.onDelete(a.id)}
              />
            ))}
          </DataList>
        </ToolBody>
      )}
      <Divider />
      <Container space="medium">
        <VerticalSpace space="small" />
        <Stack space="extraSmall">
          <Button fullWidth onClick={props.onCreateNew}>
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
        </Stack>
        <VerticalSpace space="small" />
      </Container>
    </Page>
  )
}

function AutomationRow(props: {
  automation: AutomationListItem
  onEdit: () => void
  onRun: () => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const a = props.automation

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        <div
          style={{
            fontSize: 10,
            color: "var(--figma-color-text-secondary)",
            marginTop: 1,
          }}
        >
          {a.stepCount} step(s)
        </div>
      </div>
      {hovered && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={props.onRun}
            style={{ fontSize: 10, padding: "2px 8px", minHeight: 0 }}
          >
            <Text>Run</Text>
          </Button>
          <Button
            onClick={props.onDelete}
            secondary
            style={{ fontSize: 10, padding: "2px 8px", minHeight: 0 }}
          >
            <Text>Delete</Text>
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Run Output Screen
// ============================================================================

function RunOutputScreen(props: {
  result: AutomationsRunResult
  onBack: () => void
}) {
  const { result } = props

  return (
    <Page>
      <ToolHeader
        title="Run Output"
        left={
          <IconButton onClick={props.onBack}>
            <IconChevronRight16 style={{ transform: "rotate(180deg)" }} />
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
          {result.stepsCompleted} of {result.totalSteps} step(s) completed
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
        }}
      >
        <Button fullWidth onClick={props.onBack}>
          Done
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
        {entry.message}
      </div>
    </div>
  )
}

// ============================================================================
// Builder Screen — Two-column layout
// ============================================================================

type RightPanel = "empty" | "picker" | "config"

function BuilderScreen(props: {
  automation: AutomationPayload
  onBack: () => void
  onChange: (a: AutomationPayload) => void
  onSave: () => void
  onExport: () => void
}) {
  const { automation, onChange } = props
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null)
  const [rightPanel, setRightPanel] = useState<RightPanel>("empty")

  const selectedStep =
    selectedStepIndex !== null && automation.steps[selectedStepIndex]
      ? automation.steps[selectedStepIndex]
      : null

  const addStep = (actionType: ActionType) => {
    const def = ACTION_DEFINITIONS.find((d) => d.type === actionType)
    if (!def) return
    const newStep: AutomationStepPayload = {
      id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      actionType,
      params: { ...def.defaultParams },
      enabled: true,
    }
    const newSteps = [...automation.steps, newStep]
    onChange({ ...automation, steps: newSteps })
    setSelectedStepIndex(newSteps.length - 1)
    setRightPanel("config")
  }

  const removeStep = (idx: number) => {
    const steps = [...automation.steps]
    steps.splice(idx, 1)
    onChange({ ...automation, steps })
    if (selectedStepIndex === idx) {
      setSelectedStepIndex(null)
      setRightPanel("empty")
    } else if (selectedStepIndex !== null && selectedStepIndex > idx) {
      setSelectedStepIndex(selectedStepIndex - 1)
    }
  }

  const moveStep = (idx: number, direction: -1 | 1) => {
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= automation.steps.length) return
    const steps = [...automation.steps]
    const temp = steps[idx]
    steps[idx] = steps[newIdx]
    steps[newIdx] = temp
    onChange({ ...automation, steps })
    if (selectedStepIndex === idx) {
      setSelectedStepIndex(newIdx)
    } else if (selectedStepIndex === newIdx) {
      setSelectedStepIndex(idx)
    }
  }

  const toggleStep = (idx: number) => {
    const steps = [...automation.steps]
    steps[idx] = { ...steps[idx], enabled: !steps[idx].enabled }
    onChange({ ...automation, steps })
  }

  const selectStep = (idx: number) => {
    setSelectedStepIndex(idx)
    setRightPanel("config")
  }

  const showPicker = () => {
    setSelectedStepIndex(null)
    setRightPanel("picker")
  }

  const updateStepParam = (key: string, value: unknown) => {
    if (selectedStepIndex === null || !selectedStep) return
    const steps = [...automation.steps]
    steps[selectedStepIndex] = {
      ...steps[selectedStepIndex],
      params: { ...steps[selectedStepIndex].params, [key]: value },
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
                  <StepRow
                    key={step.id}
                    step={step}
                    index={idx}
                    total={automation.steps.length}
                    selected={selectedStepIndex === idx}
                    onSelect={() => selectStep(idx)}
                    onToggle={() => toggleStep(idx)}
                    onRemove={() => removeStep(idx)}
                    onMoveUp={() => moveStep(idx, -1)}
                    onMoveDown={() => moveStep(idx, 1)}
                  />
                ))}
              </Stack>
            )}
          </div>

          {/* Add step button */}
          <div style={{ padding: "4px 8px 8px 8px" }}>
            <Button fullWidth secondary onClick={showPicker}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <IconPlus16 />
                <Text>Add step</Text>
              </div>
            </Button>
          </div>
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
          {rightPanel === "config" && selectedStep && (
            <StepConfigPanel step={selectedStep} onUpdateParam={updateStepParam} />
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
        <Button style={{ flex: 1 }} onClick={props.onSave}>
          Save
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
          <span>{props.index + 1}. {label}</span>
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
            {paramSummary}
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

function getCategoryBadge(category: ActionCategory): string {
  switch (category) {
    case "source": return "SRC"
    case "filter": return "FLT"
    case "navigate": return "NAV"
    case "transform": return "TRN"
    case "variables": return "VAR"
    case "output": return "OUT"
    default: return ""
  }
}

function getParamSummary(step: AutomationStepPayload): string {
  const p = step.params
  switch (step.actionType) {
    case "sourceFromSelection":
    case "sourceFromPage":
      return ""
    case "filterByType": {
      const scope = p.scope ? String(p.scope) : ""
      const scopeLabel = scope === "page" ? "on page" : scope === "all_pages" ? "in all pages" : ""
      return `${p.nodeType ?? "TEXT"}${scopeLabel ? ` ${scopeLabel}` : ""}`
    }
    case "filterByName":
      return `${p.matchMode ?? "contains"}: "${p.pattern ?? ""}"`
    case "expandToChildren":
      return ""
    case "renameLayers":
      return `"${p.find ?? ""}" → "${p.replace ?? ""}"`
    case "setFillColor":
      return String(p.hex ?? "")
    case "setFillVariable":
      return String(p.variableName ?? "")
    case "setOpacity":
      return `${p.opacity ?? 100}%`
    case "notify":
    case "log":
      return String(p.message ?? "")
    case "count":
      return String(p.label ?? "Count")
    case "selectResults":
      return ""
    case "setPipelineVariable":
      return p.variableName ? `$${p.variableName} = ${p.value ?? ""}` : ""
    case "setPipelineVariableFromProperty":
      return p.variableName ? `$${p.variableName} ← ${p.property ?? "name"}` : ""
    default:
      return ""
  }
}

// ============================================================================
// Action Picker Panel (right column) — organized by category
// ============================================================================

function ActionPickerPanel(props: { onSelect: (type: ActionType) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg-secondary)",
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: 11 }}>Choose an action</Text>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {ACTION_CATEGORIES.map((cat) => {
          const actions = getActionsByCategory(cat.key)
          if (actions.length === 0) return null
          return (
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
              {actions.map((def) => (
                <ActionPickerRow
                  key={def.type}
                  def={def}
                  onSelect={() => props.onSelect(def.type)}
                />
              ))}
            </Fragment>
          )
        })}
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
  onUpdateParam: (key: string, value: unknown) => void
}) {
  const { step, onUpdateParam } = props
  const def = ACTION_DEFINITIONS.find((d) => d.type === step.actionType)

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
      {renderStepParams(step, onUpdateParam)}
    </div>
  )
}

function renderStepParams(
  step: AutomationStepPayload,
  updateParam: (key: string, value: unknown) => void
) {
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

    case "filterByType":
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Node type</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.nodeType ?? "TEXT")}
            options={VALID_NODE_TYPES.map((t) => ({ value: t }))}
            onValueChange={(v: string) => updateParam("nodeType", v)}
          />
          {step.params.scope && (
            <Fragment>
              <VerticalSpace space="small" />
              <Text style={{ fontSize: 11 }}>Scope (legacy)</Text>
              <VerticalSpace space="extraSmall" />
              <Dropdown
                value={String(step.params.scope ?? "selection")}
                options={FIND_SCOPES.map((s) => ({
                  value: s,
                  text: s === "selection" ? "Working set" : s === "page" ? "Current page" : "All pages",
                }))}
                onValueChange={(v: string) => updateParam("scope", v)}
              />
            </Fragment>
          )}
        </Fragment>
      )

    case "filterByName":
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Match mode</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.matchMode ?? "contains")}
            options={MATCH_MODES.map((m) => ({ value: m }))}
            onValueChange={(v: string) => updateParam("matchMode", v)}
          />
          <VerticalSpace space="small" />
          <Text style={{ fontSize: 11 }}>Pattern</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.pattern ?? "")}
            onValueInput={(v: string) => updateParam("pattern", v)}
            placeholder="Enter pattern..."
          />
        </Fragment>
      )

    case "expandToChildren":
      return (
        <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
          No parameters. Replaces the working set with direct children of each node.
        </Text>
      )

    case "renameLayers":
      return (
        <Fragment>
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
          <Textbox
            value={String(step.params.replace ?? "")}
            onValueInput={(v: string) => updateParam("replace", v)}
            placeholder="Replacement text... supports {name}, {index}"
          />
        </Fragment>
      )

    case "setFillColor":
      return (
        <Fragment>
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
          <Text style={{ fontSize: 11 }}>Variable name</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.variableName ?? "")}
            onValueInput={(v: string) => updateParam("variableName", v)}
            placeholder="e.g. control-border-raised"
          />
        </Fragment>
      )

    case "setOpacity":
      return (
        <Fragment>
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

    case "notify":
    case "log":
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Message</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.message ?? "")}
            onValueInput={(v: string) => updateParam("message", v)}
            placeholder="Supports {count}, {$var} tokens..."
          />
        </Fragment>
      )

    case "count":
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Label</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.label ?? "Count")}
            onValueInput={(v: string) => updateParam("label", v)}
            placeholder="Count label"
          />
        </Fragment>
      )

    case "selectResults":
      return (
        <Fragment>
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
          <Textbox
            value={String(step.params.value ?? "")}
            onValueInput={(v: string) => updateParam("value", v)}
            placeholder="Supports {count}, {name} tokens..."
          />
        </Fragment>
      )

    case "setPipelineVariableFromProperty":
      return (
        <Fragment>
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
