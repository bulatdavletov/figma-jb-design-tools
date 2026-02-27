import { Checkbox, IconSpacingHorizontalSmall24, RadioButtons, Stack, Text, TextboxNumeric } from "@create-figma-plugin/ui"
import { h } from "preact"

import type { PrintColorUsagesUiSettings } from "../../home/messages"

export function SettingsTab(props: {
  settings: PrintColorUsagesUiSettings
  setSettings: (fn: (s: PrintColorUsagesUiSettings) => PrintColorUsagesUiSettings) => void
}) {
  const { settings, setSettings } = props

  return (
    <Stack space="small">

      {/* Position */}
      <Stack space="extraSmall">
        <Text>Position</Text>
        <div style={{ height: 24, display: "flex", alignItems: "center" }}>
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
        </div>
      </Stack>

      {/* Distance */}
      <Stack space="extraSmall" style={{ marginBottom: 20 }}>
        <Text>Distance</Text>
        <div style={{ width: 80 }}>
          <TextboxNumeric icon={<IconSpacingHorizontalSmall24 />}
            value={String(settings.printDistance)}
            onNumericValueInput={(value) =>
              setSettings((s) => ({ ...s, printDistance: value ?? 16 }))
            }
            minimum={0}
            integer
            suffix=" px"
          />
        </div>
      </Stack>

      {/* Checkboxes */}
      <Stack space="small">

        <Checkbox
          value={settings.showLinkedColors}
          onValueChange={(value) => setSettings((s) => ({ ...s, showLinkedColors: value }))}
        >
          <Text>Show linked colors</Text>
        </Checkbox>

        <Checkbox
          value={settings.showFolderNames}
          onValueChange={(value) => setSettings((s) => ({ ...s, showFolderNames: value }))}
        >
          <Text>Show folder name (before slash)</Text>
        </Checkbox>

        <Checkbox
          value={settings.checkNested}
          onValueChange={(value) => setSettings((s) => ({ ...s, checkNested: value }))}
        >
          <Text>Check colors of nested items</Text>
        </Checkbox>

        <Checkbox
          value={settings.applyTextColor}
          onValueChange={(value) => setSettings((s) => ({ ...s, applyTextColor: value }))}
        >
          <Text>Apply text color from Mockup Markup</Text>
        </Checkbox>

        <Checkbox
          value={settings.applyTextStyle}
          onValueChange={(value) => setSettings((s) => ({ ...s, applyTextStyle: value }))}
        >
          <Text>Apply text style from Mockup Markup</Text>
        </Checkbox>

      </Stack>

    </Stack>
  )
}
