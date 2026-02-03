import {
  Button,
  Checkbox,
  Container,
  Divider,
  IconHome16,
  IconButton,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { Fragment, h } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

import {
  MAIN_TO_UI,
  type MainToUiMessage,
  type MockupMarkupColorPreviews,
  type MockupMarkupApplyRequest,
  type MockupMarkupColorPreset,
  type MockupMarkupTypographyPreset,
  type MockupMarkupState,
  type MockupMarkupStatus,
  UI_TO_MAIN,
} from "../../messages"
import { Page } from "../../components/Page"
import { ColorSwatch } from "../../components/ColorSwatch"
import { ToolHeader } from "../../components/ToolHeader"
import { getColorPresetLabel, getTypographyPresetLabel } from "../../tools/mockup-markup/presets"

function TextStylePresetGrid(props: {
  value: MockupMarkupTypographyPreset
  onChange: (value: MockupMarkupTypographyPreset) => void
}) {
  const Option = (p: {
    value: MockupMarkupTypographyPreset
    label: string
  }) => {
    const selected = props.value === p.value
    return (
      <button
        type="button"
        onClick={() => props.onChange(p.value)}
        style={{
          width: "100%",
          padding: "8px 8px",
          borderRadius: 8,
          border: selected ? "1px solid var(--figma-color-border-selected)" : "1px solid var(--figma-color-border)",
          background: selected ? "var(--figma-color-bg-selected)" : "var(--figma-color-bg)",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <Text>{p.label}</Text>
      </button>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        <Option value="paragraph" label="Paragraph" />
        <Option value="description" label="Description" />
      </div>
      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        <Option value="h1" label="H1" />
        <Option value="h2" label="H2" />
        <Option value="h3" label="H3" />
      </div>
    </div>
  )
}

function ColorPresetGrid(props: {
  value: MockupMarkupColorPreset
  previews: MockupMarkupColorPreviews
  onChange: (value: MockupMarkupColorPreset) => void
}) {
  const Option = (p: {
    value: MockupMarkupColorPreset
    label: string
    swatch: { hex: string | null; opacityPercent: number | null }
  }) => {
    const selected = props.value === p.value
    return (
      <button
        type="button"
        onClick={() => props.onChange(p.value)}
        style={{
          width: "100%",
          padding: "8px 8px",
          borderRadius: 8,
          border: selected ? "1px solid var(--figma-color-border-selected)" : "1px solid var(--figma-color-border)",
          background: selected ? "var(--figma-color-bg-selected)" : "var(--figma-color-bg)",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ColorSwatch hex={p.swatch.hex} opacityPercent={p.swatch.opacityPercent} />
        <Text>{p.label}</Text>
      </button>
    )
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
      <Option value="text" label={getColorPresetLabel("text")} swatch={props.previews.text} />
      <Option value="text-secondary" label={getColorPresetLabel("text-secondary")} swatch={props.previews.textSecondary} />
      <Option value="purple" label={getColorPresetLabel("purple")} swatch={props.previews.purple} />
    </div>
  )
}

function ModeSegmented(props: { value: "dark" | "light"; onChange: (value: "dark" | "light") => void }) {
  const Item = (p: { value: "dark" | "light"; label: string }) => {
    const selected = props.value === p.value
    return (
      <button
        type="button"
        onClick={() => props.onChange(p.value)}
        style={{
          flex: 1,
          height: 24,
          borderRadius: 6,
          border: selected ? "1px solid var(--figma-color-border)" : "1px solid transparent",
          background: selected ? "var(--figma-color-bg)" : "transparent",
          color: selected ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8px",
        }}
      >
        <Text>{p.label}</Text>
      </button>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        padding: 2,
        gap: 2,
        borderRadius: 8,
        background: "var(--figma-color-bg-secondary)",
      }}
    >
      <Item value="dark" label="Dark" />
      <Item value="light" label="Light" />
    </div>
  )
}

const DEFAULT_REQUEST: MockupMarkupApplyRequest = {
  presetColor: "text",
  presetTypography: "paragraph",
  forceModeName: "dark",
  width400: false,
}

export function MockupMarkupToolView(props: { onBack: () => void }) {
  const [request, setRequest] = useState<MockupMarkupApplyRequest>(DEFAULT_REQUEST)
  const [state, setState] = useState<MockupMarkupState>({ selectionSize: 0, textNodeCount: 0, hasSourceTextNode: false })
  const [status, setStatus] = useState<MockupMarkupStatus>({ status: "idle" })
  const [colorPreviews, setColorPreviews] = useState<MockupMarkupColorPreviews>({
    text: { hex: null, opacityPercent: null },
    textSecondary: { hex: null, opacityPercent: null },
    purple: { hex: null, opacityPercent: null },
  })

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUiMessage | undefined
      if (!msg) return

      if (msg.type === MAIN_TO_UI.MOCKUP_MARKUP_STATE) {
        setState(msg.state)
        return
      }

      if (msg.type === MAIN_TO_UI.MOCKUP_MARKUP_STATUS) {
        setStatus(msg.status)
        return
      }

      if (msg.type === MAIN_TO_UI.MOCKUP_MARKUP_COLOR_PREVIEWS) {
        setColorPreviews(msg.previews)
        return
      }
    }

    window.addEventListener("message", handleMessage)
    parent.postMessage({ pluginMessage: { type: UI_TO_MAIN.MOCKUP_MARKUP_LOAD_STATE } }, "*")
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Refresh color swatches when dark mode toggle changes.
  useEffect(() => {
    parent.postMessage(
      { pluginMessage: { type: UI_TO_MAIN.MOCKUP_MARKUP_GET_COLOR_PREVIEWS, forceModeName: request.forceModeName } },
      "*"
    )
  }, [request.forceModeName])

  const isWorking = status.status === "working"

  const primaryAction = useMemo((): {
    label: string
    disabled: boolean
    messageType: typeof UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT | typeof UI_TO_MAIN.MOCKUP_MARKUP_APPLY
  } => {
    // If there's any text in selection, user intent is "apply".
    if (state.textNodeCount > 0) {
      return { label: "Apply to selection", disabled: isWorking, messageType: UI_TO_MAIN.MOCKUP_MARKUP_APPLY }
    }
    // Otherwise, user intent is "create".
    return { label: "Create text", disabled: isWorking, messageType: UI_TO_MAIN.MOCKUP_MARKUP_CREATE_TEXT }
  }, [isWorking, state.textNodeCount])

  return (
    <Page>
      <ToolHeader
        title="Mockup Markup Quick Apply"
        left={
          <IconButton onClick={props.onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
          <Container space="small">
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
              <VerticalSpace space="medium" />

              <Text>Color</Text>
              <VerticalSpace space="extraSmall" />
              <ColorPresetGrid
                value={request.presetColor}
                previews={colorPreviews}
                onChange={(value) => setRequest((r) => ({ ...r, presetColor: value }))}
              />

              <VerticalSpace space="large" />
              <Text>Text style</Text>
              <VerticalSpace space="extraSmall" />
              <TextStylePresetGrid
                value={request.presetTypography}
                onChange={(value) => setRequest((r) => ({ ...r, presetTypography: value }))}
              />

              <VerticalSpace space="large" />
              <Checkbox
                value={request.width400}
                onValueChange={(value) => setRequest((r) => ({ ...r, width400: value }))}
              >
                <Text>Width 400px</Text>
              </Checkbox>

              <div style={{ flex: 1 }} />

              <VerticalSpace space="large" />
              <ModeSegmented
                value={request.forceModeName}
                onChange={(value) => setRequest((r) => ({ ...r, forceModeName: value }))}
              />

              <VerticalSpace space="medium" />
            </div>
          </Container>
        </div>

        <Divider />
        <Container space="small">
          <VerticalSpace space="small" />
          <Button
            fullWidth
            loading={isWorking}
            disabled={primaryAction.disabled || (primaryAction.messageType === UI_TO_MAIN.MOCKUP_MARKUP_APPLY && state.textNodeCount === 0)}
            onClick={() =>
              parent.postMessage(
                {
                  pluginMessage: {
                    type: primaryAction.messageType,
                    request,
                  },
                },
                "*"
              )
            }
          >
            {primaryAction.label}
          </Button>
          <VerticalSpace space="small" />
        </Container>
      </div>
    </Page>
  )
}

