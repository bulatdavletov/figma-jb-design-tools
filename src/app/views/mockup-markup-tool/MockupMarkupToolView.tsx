import {
  Button,
  Checkbox,
  Container,
  Divider,
  IconHome16,
  IconButton,
  RadioButtons,
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

  const hint = useMemo(() => {
    if (state.textNodeCount === 0) return "No text layers found in selection."
    return null
  }, [state.selectionSize, state.textNodeCount])

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
        title="Mockup markup quick apply"
        left={
          <IconButton onClick={props.onBack} title="Home">
            <IconHome16 />
          </IconButton>
        }
      />

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
          <Container space="small">
            <VerticalSpace space="small" />

            <Text style={{ color: "var(--figma-color-text-secondary)" }}>
              {state.selectionSize > 0
                ? `Selection: ${state.selectionSize} layer(s), ${state.textNodeCount} text layer(s)`
                : "Selection: none"}
            </Text>
            <VerticalSpace space="extraSmall" />
            <Text style={{ color: "var(--figma-color-text-secondary)" }}>
              {state.textNodeCount > 0 ? `Preview: will apply to ${state.textNodeCount} text layer(s)` : "Preview: will create 1 text layer"}
            </Text>

            <VerticalSpace space="large" />
            <Text>Text style</Text>
            <VerticalSpace space="extraSmall" />
            <RadioButtons
              value={request.presetTypography}
              onValueChange={(value) =>
                setRequest((r) => ({
                  ...r,
                  presetTypography:
                    value === "paragraph" || value === "description" || value === "h1" || value === "h2" || value === "h3"
                      ? (value as MockupMarkupTypographyPreset)
                      : "paragraph",
                }))
              }
              options={(["paragraph", "description", "h1", "h2", "h3"] as const).map((p) => ({
                value: p,
                children: <Text>{getTypographyPresetLabel(p)}</Text>,
              }))}
            />

            <VerticalSpace space="large" />
            <Text>Color</Text>
            <VerticalSpace space="extraSmall" />
            <RadioButtons
              value={request.presetColor}
              onValueChange={(value) =>
                setRequest((r) => ({
                  ...r,
                  presetColor: value === "text-secondary" || value === "purple" ? (value as MockupMarkupColorPreset) : "text",
                }))
              }
              options={[
                {
                  value: "text",
                  children: (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ColorSwatch hex={colorPreviews.text.hex} opacityPercent={colorPreviews.text.opacityPercent} />
                      <Text>{getColorPresetLabel("text")}</Text>
                    </div>
                  ),
                },
                {
                  value: "text-secondary",
                  children: (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ColorSwatch
                        hex={colorPreviews.textSecondary.hex}
                        opacityPercent={colorPreviews.textSecondary.opacityPercent}
                      />
                      <Text>{getColorPresetLabel("text-secondary")}</Text>
                    </div>
                  ),
                },
                {
                  value: "purple",
                  children: (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ColorSwatch hex={colorPreviews.purple.hex} opacityPercent={colorPreviews.purple.opacityPercent} />
                      <Text>{getColorPresetLabel("purple")}</Text>
                    </div>
                  ),
                },
              ]}
            />

            <VerticalSpace space="large" />
            <Checkbox
              value={request.forceModeName === "dark"}
              onValueChange={(value) => setRequest((r) => ({ ...r, forceModeName: value ? "dark" : "none" }))}
            >
              <Text>Dark mode</Text>
            </Checkbox>

            <VerticalSpace space="extraSmall" />
            <Checkbox
              value={request.width400}
              onValueChange={(value) => setRequest((r) => ({ ...r, width400: value }))}
            >
              <Text>Width 400</Text>
            </Checkbox>

            {hint ? (
              <>
                <VerticalSpace space="large" />
                <Text style={{ color: "var(--figma-color-text-secondary)" }}>{hint}</Text>
              </>
            ) : null}

            <VerticalSpace space="large" />
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

