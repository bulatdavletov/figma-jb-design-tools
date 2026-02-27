import { Button, Container, Divider, IconHome16, IconButton, VerticalSpace } from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useRef, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  type MainToUiMessage,
  type PrintColorUsagesStatus,
  type PrintColorUsagesUpdatePreviewPayload,
  type PrintColorUsagesPrintPreviewPayload,
  type PrintColorUsagesUiSettings,
  UI_TO_MAIN,
} from "../../home/messages"
import { Page } from "../../components/Page"
import { useScope } from "../../components/ScopeControl"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"
import { ToolTabs } from "../../components/ToolTabs"
import { PrintTab } from "./PrintTab"
import { SettingsTab } from "./SettingsTab"
import { UpdateTab } from "./UpdateTab"
import { plural } from "../../utils/pluralize"

const DEFAULT_SETTINGS: PrintColorUsagesUiSettings = {
  textPosition: "right",
  showLinkedColors: true,
  showFolderNames: true,
  textTheme: "dark",
  checkByContent: false,
  checkNested: true,
  printDistance: 16,
  applyTextColor: true,
  applyTextStyle: true,
}

type TabValue = "Print" | "Update" | "Settings"

function toTabValue(value: string | undefined): TabValue {
  if (value === "Update" || value === "Settings") return value
  return "Print"
}

export function PrintColorUsagesToolView(props: { onBack: () => void; initialTab?: string }) {
  const [settings, setSettings] = useState<PrintColorUsagesUiSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<TabValue>(toTabValue(props.initialTab))
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<PrintColorUsagesStatus>({ status: "idle" })
  const {
    scope,
    setScope,
    selectionSize,
    hasSelection,
    updateSelectionSize,
  } = useScope(true)
  const [preview, setPreview] = useState<PrintColorUsagesUpdatePreviewPayload | null>(null)
  const [selectedPreviewNodeIds, setSelectedPreviewNodeIds] = useState<string[]>([])
  const [printPreview, setPrintPreview] = useState<PrintColorUsagesPrintPreviewPayload | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
        updateSelectionSize(msg.selectionSize)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS) {
        setSettings({ ...msg.settings, textTheme: "dark" })
        setLoaded(true)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION) {
        updateSelectionSize(msg.selectionSize)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS) {
        setStatus(msg.status)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_UPDATE_PREVIEW) {
        setPreview(msg.payload)
        setSelectedPreviewNodeIds(msg.payload.entries.map((entry) => entry.nodeId))
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_PRINT_PREVIEW) {
        setPrintPreview(msg.payload)
        return
      }
    }

    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const settingsChangedAfterLoad = useRef(false)
  useEffect(() => {
    if (!loaded) return
    if (!settingsChangedAfterLoad.current) {
      settingsChangedAfterLoad.current = true
      parent.postMessage(
        { pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS, settings } },
        "*"
      )
      return
    }
    setPreview(null)
    setSelectedPreviewNodeIds([])
    setPrintPreview(null)
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS, settings } },
      "*"
    )
  }, [loaded, settings])

  const isWorking = status.status === "working"
  const hasPreviewChanges = selectedPreviewNodeIds.length > 0
  const printTabShowsState = !hasSelection || !printPreview || printPreview.entries.length === 0
  const toolBodyMode = activeTab === "Print" && printTabShowsState ? "state" : "content"

  const applyLabel = useMemo(() => {
    const selectedCount = selectedPreviewNodeIds.length
    const targetLabel = plural(selectedCount, "change")
    const s = preview?.scope ?? scope
    if (s === "selection") return `Apply ${targetLabel} in Selection`
    if (s === "all_pages") return `Apply ${targetLabel} on All Pages`
    return `Apply ${targetLabel} on Page`
  }, [scope, preview, selectedPreviewNodeIds])

  const printLabel = useMemo(() => {
    const colorCount = printPreview?.entries.length ?? 0
    return `Print ${plural(colorCount, "color")}`
  }, [printPreview])

  return (
    <Page>
      <ToolHeader
        title="Print Color Usages"
        left={
          <IconButton onClick={props.onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <ToolTabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(toTabValue(value))}
          options={[
            { value: "Print" },
            { value: "Update" },
            { value: "Settings" },
          ]}
        />

        <ToolBody mode={toolBodyMode}>
          {activeTab === "Print" ? (
            <PrintTab printPreview={printPreview} selectionSize={selectionSize} />
          ) : null}

          {activeTab === "Update" ? (
            <UpdateTab
              settings={settings}
              setSettings={setSettings}
              isWorking={isWorking}
              status={status}
              hasSelection={hasSelection}
              preview={preview}
              setPreview={setPreview}
              selectedPreviewNodeIds={selectedPreviewNodeIds}
              setSelectedPreviewNodeIds={setSelectedPreviewNodeIds}
              scope={scope}
              setScope={setScope}
            />
          ) : null}

          {activeTab === "Settings" ? (
            <SettingsTab settings={settings} setSettings={setSettings} />
          ) : null}
        </ToolBody>

        {activeTab !== "Settings" && (
          <>
            <Divider />
            <Container space="small">
              <VerticalSpace space="small" />
              {activeTab === "Print" ? (
                <Button
                  fullWidth
                  loading={isWorking}
                  disabled={!hasSelection}
                  onClick={() =>
                    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT, settings } }, "*")
                  }
                >
                  {printLabel}
                </Button>
              ) : preview ? (
                <Button
                  fullWidth
                  loading={isWorking}
                  disabled={!hasPreviewChanges}
                  onClick={() =>
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE,
                          settings,
                          targetNodeIds: selectedPreviewNodeIds,
                        },
                      },
                      "*"
                    )
                  }
                >
                  {applyLabel}
                </Button>
              ) : (
                <Button
                  fullWidth
                  loading={isWorking}
                  onClick={() => {
                    setStatus({ status: "working", message: "Checking changes\u2026" })
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: UI_TO_MAIN.PRINT_COLOR_USAGES_PREVIEW_UPDATE,
                          settings,
                          scope,
                        },
                      },
                      "*"
                    )
                  }}
                >
                  Check changes
                </Button>
              )}
              <VerticalSpace space="small" />
            </Container>
          </>
        )}
      </div>
    </Page>
  )
}
