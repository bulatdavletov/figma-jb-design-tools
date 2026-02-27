import { SegmentedControl } from "@create-figma-plugin/ui"
import type { ComponentChildren } from "preact"
import { h } from "preact"

export type SegmentedControlOption = {
  value: string
  disabled?: boolean
  children?: ComponentChildren
}

export type SegmentedControlWithWidthProps = {
  value: string
  options: SegmentedControlOption[]
  onValueChange?: (value: string) => void
  onChange?: (event: Event) => void
  disabled?: boolean
  /** When true (default), control and segments use full width. When false, control hugs content. */
  fullWidth?: boolean
}

const WRAPPER_CLASS = "segmented-control-with-width"

/**
 * Segmented control with optional full-width behavior.
 * - fullWidth = true (default): wrapper and segment labels stretch to full width.
 * - fullWidth = false: control hugs content (natural width).
 */
export function SegmentedControlWithWidth({
  value,
  options,
  onValueChange,
  onChange,
  disabled = false,
  fullWidth = true,
}: SegmentedControlWithWidthProps) {
  return (
    <div
      class={WRAPPER_CLASS}
      data-full-width={fullWidth ? "true" : "false"}
      style={{
        width: fullWidth ? "100%" : undefined,
        display: "inline-flex",
        minWidth: 0,
      }}
    >
      <style>
        {`.${WRAPPER_CLASS}[data-full-width="true"] > div { width: 100%; }
.${WRAPPER_CLASS}[data-full-width="true"] > div > label { flex: 1; min-width: 0; text-align: center; }`}
      </style>
      <SegmentedControl
        value={value}
        options={options}
        disabled={disabled}
        onValueChange={onValueChange}
        onChange={onChange}
      />
    </div>
  )
}
