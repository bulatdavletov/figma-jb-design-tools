import {
  Button,
  Container,
  Checkbox,
  Divider,
  Dropdown,
  FileUploadButton,
  IconButton,
  IconChevronDown16,
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
} from "../../messages"
import {
  ACTION_DEFINITIONS,
  type ActionType,
  type ActionDefinition,
  VALID_NODE_TYPES,
  MATCH_MODES,
} from "../../tools/automations/types"
import {
  createNewAutomation,
  automationToExportJson,
  parseImportJson,
} from "../../tools/automations/storage"

type Screen = "list" | "builder" | "step-config"

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
  const [editingStepIndex, setEditingStepIndex] = useState<number>(-1)
  const [runProgress, setRunProgress] = useState<AutomationsRunProgress | null>(null)
  const [runResult, setRunResult] = useState<AutomationsRunResult | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.AUTOMATIONS_LIST) {
        setAutomations(msg.automations)
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
  }, [])

  const handleEdit = useCallback((id: string) => {
    const item = automations.find((a) => a.id === id)
    if (!item) return
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD })
    const payload: AutomationPayload = {
      id: item.id,
      name: item.name,
      steps: [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
    setEditingAutomation(payload)
    setScreen("builder")
  }, [automations])

  const handleRun = useCallback((id: string) => {
    setRunResult(null)
    setRunProgress(null)
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_RUN, automationId: id })
  }, [])

  const handleDelete = useCallback((id: string) => {
    postMessage({ type: UI_TO_MAIN.AUTOMATIONS_DELETE, automationId: id })
  }, [])

  const handleExport = useCallback((id: string) => {
    const item = automations.find((a) => a.id === id)
    if (!item) return
    // We need full automation data for export -- we'll export from editingAutomation if available
    // For list export, we need to save/load first
    // For now, export a stub
  }, [automations])

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

  if (screen === "step-config" && editingAutomation && editingStepIndex >= 0) {
    const step = editingAutomation.steps[editingStepIndex]
    if (step) {
      return (
        <StepConfigScreen
          step={step}
          onBack={() => setScreen("builder")}
          onChange={(updated) => {
            const steps = [...editingAutomation.steps]
            steps[editingStepIndex] = updated
            setEditingAutomation({ ...editingAutomation, steps })
          }}
        />
      )
    }
  }

  if (screen === "builder" && editingAutomation) {
    return (
      <BuilderScreen
        automation={editingAutomation}
        onBack={() => {
          setScreen("list")
          setEditingAutomation(null)
          postMessage({ type: UI_TO_MAIN.AUTOMATIONS_LOAD })
        }}
        onChange={setEditingAutomation}
        onSave={handleSave}
        onExport={handleBuilderExport}
        onConfigStep={(idx) => {
          setEditingStepIndex(idx)
          setScreen("step-config")
        }}
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
// Builder Screen
// ============================================================================

function BuilderScreen(props: {
  automation: AutomationPayload
  onBack: () => void
  onChange: (a: AutomationPayload) => void
  onSave: () => void
  onExport: () => void
  onConfigStep: (idx: number) => void
}) {
  const { automation, onChange } = props
  const [showActionPicker, setShowActionPicker] = useState(false)

  const addStep = (actionType: ActionType) => {
    const def = ACTION_DEFINITIONS.find((d) => d.type === actionType)
    if (!def) return
    const newStep: AutomationStepPayload = {
      id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      actionType,
      params: { ...def.defaultParams },
      enabled: true,
    }
    onChange({ ...automation, steps: [...automation.steps, newStep] })
    setShowActionPicker(false)
  }

  const removeStep = (idx: number) => {
    const steps = [...automation.steps]
    steps.splice(idx, 1)
    onChange({ ...automation, steps })
  }

  const moveStep = (idx: number, direction: -1 | 1) => {
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= automation.steps.length) return
    const steps = [...automation.steps]
    const temp = steps[idx]
    steps[idx] = steps[newIdx]
    steps[newIdx] = temp
    onChange({ ...automation, steps })
  }

  const toggleStep = (idx: number) => {
    const steps = [...automation.steps]
    steps[idx] = { ...steps[idx], enabled: !steps[idx].enabled }
    onChange({ ...automation, steps })
  }

  return (
    <Page>
      <ToolHeader
        title="Edit Automation"
        left={
          <IconButton onClick={props.onBack}>
            <IconChevronRight16
              style={{ transform: "rotate(180deg)" }}
            />
          </IconButton>
        }
      />
      <ToolBody mode="content">
        <Textbox
          value={automation.name}
          onValueInput={(value: string) => onChange({ ...automation, name: value })}
          placeholder="Automation name"
        />
        <VerticalSpace space="medium" />

        {automation.steps.length === 0 ? (
          <Fragment>
            <div
              style={{
                fontSize: 11,
                color: "var(--figma-color-text-secondary)",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              No steps yet. Add your first step below.
            </div>
          </Fragment>
        ) : (
          <Stack space="extraSmall">
            {automation.steps.map((step, idx) => (
              <StepRow
                key={step.id}
                step={step}
                index={idx}
                total={automation.steps.length}
                onToggle={() => toggleStep(idx)}
                onConfigure={() => props.onConfigStep(idx)}
                onRemove={() => removeStep(idx)}
                onMoveUp={() => moveStep(idx, -1)}
                onMoveDown={() => moveStep(idx, 1)}
              />
            ))}
          </Stack>
        )}

        <VerticalSpace space="small" />
        {showActionPicker ? (
          <ActionPicker onSelect={addStep} onCancel={() => setShowActionPicker(false)} />
        ) : (
          <Button fullWidth secondary onClick={() => setShowActionPicker(true)}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <IconPlus16 />
              <Text>Add step</Text>
            </div>
          </Button>
        )}
      </ToolBody>

      <Divider />
      <Container space="medium">
        <VerticalSpace space="small" />
        <Stack space="extraSmall">
          <Button fullWidth onClick={props.onSave}>
            Save
          </Button>
          <Button fullWidth secondary onClick={props.onExport}>
            Export as JSON
          </Button>
        </Stack>
        <VerticalSpace space="small" />
      </Container>
    </Page>
  )
}

function StepRow(props: {
  step: AutomationStepPayload
  index: number
  total: number
  onToggle: () => void
  onConfigure: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const def = ACTION_DEFINITIONS.find((d) => d.type === props.step.actionType)
  const label = def?.label ?? props.step.actionType
  const paramSummary = getParamSummary(props.step)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 4px",
        borderRadius: 4,
        background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
        opacity: props.step.enabled ? 1 : 0.5,
      }}
    >
      <Checkbox
        value={props.step.enabled}
        onValueChange={props.onToggle}
      >
        <Text>{" "}</Text>
      </Checkbox>
      <div
        style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
        onClick={props.onConfigure}
      >
        <div style={{ fontSize: 11, color: "var(--figma-color-text)" }}>
          {props.index + 1}. {label}
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
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          {props.index > 0 && (
            <IconButton onClick={props.onMoveUp}>
              <IconChevronDown16 style={{ transform: "rotate(180deg)" }} />
            </IconButton>
          )}
          {props.index < props.total - 1 && (
            <IconButton onClick={props.onMoveDown}>
              <IconChevronDown16 />
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

function getParamSummary(step: AutomationStepPayload): string {
  const p = step.params
  switch (step.actionType) {
    case "selectByType":
      return String(p.nodeType ?? "")
    case "selectByName":
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
      return String(p.message ?? "")
    default:
      return ""
  }
}

function ActionPicker(props: { onSelect: (type: ActionType) => void; onCancel: () => void }) {
  return (
    <div
      style={{
        border: "1px solid var(--figma-color-border)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 8px",
          background: "var(--figma-color-bg-secondary)",
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: 11 }}>Choose an action</Text>
        <IconButton onClick={props.onCancel}>
          <IconClose16 />
        </IconButton>
      </div>
      {ACTION_DEFINITIONS.map((def) => (
        <ActionPickerRow key={def.type} def={def} onSelect={() => props.onSelect(def.type)} />
      ))}
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
        padding: "6px 8px",
        cursor: "pointer",
        background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
        borderTop: "1px solid var(--figma-color-border)",
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
// Step Configuration Screen
// ============================================================================

function StepConfigScreen(props: {
  step: AutomationStepPayload
  onBack: () => void
  onChange: (step: AutomationStepPayload) => void
}) {
  const { step, onChange } = props
  const def = ACTION_DEFINITIONS.find((d) => d.type === step.actionType)

  const updateParam = (key: string, value: unknown) => {
    onChange({ ...step, params: { ...step.params, [key]: value } })
  }

  return (
    <Page>
      <ToolHeader
        title={def?.label ?? step.actionType}
        left={
          <IconButton onClick={props.onBack}>
            <IconChevronRight16
              style={{ transform: "rotate(180deg)" }}
            />
          </IconButton>
        }
      />
      <ToolBody mode="content">
        {def && (
          <Fragment>
            <Text style={{ fontSize: 11, color: "var(--figma-color-text-secondary)" }}>
              {def.description}
            </Text>
            <VerticalSpace space="medium" />
          </Fragment>
        )}
        {renderStepParams(step, updateParam)}
      </ToolBody>
    </Page>
  )
}

function renderStepParams(
  step: AutomationStepPayload,
  updateParam: (key: string, value: unknown) => void
) {
  switch (step.actionType) {
    case "selectByType":
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Node type</Text>
          <VerticalSpace space="extraSmall" />
          <Dropdown
            value={String(step.params.nodeType ?? "TEXT")}
            options={VALID_NODE_TYPES.map((t) => ({ value: t }))}
            onValueChange={(v: string) => updateParam("nodeType", v)}
          />
        </Fragment>
      )

    case "selectByName":
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
          No parameters needed. This action replaces the current selection with all direct children
          of the selected nodes.
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
            placeholder="Replacement text..."
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
      return (
        <Fragment>
          <Text style={{ fontSize: 11 }}>Message</Text>
          <VerticalSpace space="extraSmall" />
          <Textbox
            value={String(step.params.message ?? "")}
            onValueInput={(v: string) => updateParam("message", v)}
            placeholder="Notification message..."
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
