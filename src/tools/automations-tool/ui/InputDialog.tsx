import { Button, Text, Textbox, TextboxMultiline, VerticalSpace } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useState } from "preact/hooks"

import type { AutomationsInputRequest } from "../../../home/messages"

export function InputDialog(props: {
  request: AutomationsInputRequest
  onSubmit: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(props.request.defaultValue ?? "")

  const handleSubmit = () => {
    props.onSubmit(value)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && props.request.inputType !== "textarea") {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      e.preventDefault()
      props.onCancel()
    }
  }

  const isSelect = props.request.inputType === "select"
  const options = props.request.options ?? []

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
        {isSelect && options.length > 0 ? (
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {options.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => setValue(opt)}
                style={{
                  padding: "6px 8px",
                  fontSize: 12,
                  cursor: "pointer",
                  borderRadius: 4,
                  background: value === opt
                    ? "var(--figma-color-bg-brand)"
                    : "transparent",
                  color: value === opt
                    ? "var(--figma-color-text-onbrand)"
                    : "var(--figma-color-text)",
                  marginBottom: 2,
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        ) : props.request.inputType === "textarea" ? (
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
