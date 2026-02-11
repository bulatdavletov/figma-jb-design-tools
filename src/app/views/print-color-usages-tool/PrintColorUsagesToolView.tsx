import { Button, Checkbox, Columns, Container, Divider, IconHome16, IconButton, RadioButtons, Text, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  type MainToUiMessage,
  type PrintColorUsagesStatus,
  type PrintColorUsagesUiSettings,
  UI_TO_MAIN,
} from "../../messages"
import { Page } from "../../components/Page"
import { ToolBody } from "../../components/ToolBody"
import { ToolHeader } from "../../components/ToolHeader"

const DEFAULT_SETTINGS: PrintColorUsagesUiSettings = {
  textPosition: "right",
  showLinkedColors: true,
  hideFolderNames: true,
  textTheme: "dark",
}

export function PrintColorUsagesToolView(props: { onBack: () => void }) {
  const [settings, setSettings] = useState<PrintColorUsagesUiSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<PrintColorUsagesStatus>({ status: "idle" })
  const [selectionSize, setSelectionSize] = useState<number>(0)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.BOOTSTRAPPED) {
        setSelectionSize(msg.selectionSize)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SETTINGS) {
        // Theme is not exposed in UI. We lock fallback to "dark" (white text) for consistency.
        setSettings({ ...msg.settings, textTheme: "dark" })
        setLoaded(true)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_SELECTION) {
        setSelectionSize(msg.selectionSize)
        return
      }

      if (msg.type === MAIN_TO_UI.PRINT_COLOR_USAGES_STATUS) {
        setStatus(msg.status)
        return
      }
    }

    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_LOAD_SETTINGS } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Persist settings whenever they change after initial load.
  useEffect(() => {
    if (!loaded) return
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_SAVE_SETTINGS, settings } },
      "*"
    )
  }, [loaded, settings])

  const isWorking = status.status === "working"
  const updateLabel = selectionSize > 0 ? "Update Prints in Selection" : "Update Prints on Page"

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
        <ToolBody mode="content">
          <VerticalSpace space="small" />

          <Text>Position</Text>
          <VerticalSpace space="extraSmall" />
          <RadioButtons
            direction="horizontal"
            value={settings.textPosition}
            onValueChange={(value) =>
              setSettings((s) => ({
                ...s,
                textPosition: value === "left" || value === "right" ? value : "right",
              }))
            }
            options={[
              { value: "left", children: <Text>Left</Text> },
              { value: "right", children: <Text>Right</Text> },
            ]}
          />

          <VerticalSpace space="large" />
          <Checkbox
            value={settings.showLinkedColors}
            onValueChange={(value) => setSettings((s) => ({ ...s, showLinkedColors: value }))}
          >
            <Text>Show linked colors</Text>
          </Checkbox>

          <VerticalSpace space="extraSmall" />
          <Checkbox
            value={settings.hideFolderNames}
            onValueChange={(value) => setSettings((s) => ({ ...s, hideFolderNames: value }))}
          >
            <Text>Hide folder prefixes (after “/”)</Text>
          </Checkbox>

          <VerticalSpace space="large" />
          <Text style={{ color: "var(--figma-color-text-secondary)" }}>
            Text color is from Mockup markup
          </Text>

          <VerticalSpace space="large" />
        </ToolBody>

        {/* Fixed bottom actions */}
        <Divider />
        <Container space="small">
          <VerticalSpace space="small" />
          <Columns space="small">
            <Button
              fullWidth
              loading={isWorking}
              onClick={() =>
                parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_PRINT, settings } }, "*")
              }
            >
              Print
            </Button>
            <Button
              fullWidth
              secondary
              loading={isWorking}
              onClick={() =>
                parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.PRINT_COLOR_USAGES_UPDATE, settings } }, "*")
              }
            >
              {updateLabel}
            </Button>
          </Columns>
          <VerticalSpace space="small" />
        </Container>
      </div>
    </Page>
  )
}

