import { Tabs } from "@create-figma-plugin/ui"
import { h } from "preact"
import type { ComponentChildren } from "preact"

export interface ToolTabsOption {
  value: string
  children: ComponentChildren
}

interface ToolTabsProps {
  value: string | null
  onValueChange: (value: string) => void
  options: ToolTabsOption[]
}

/**
 * Wraps the library Tabs component with left padding so that tab labels
 * align with ToolHeader's Container space="small" (12px inset).
 * Tabs first-child already has 8px padding-left; this adds the missing 4px.
 * The library's bottom border is removed via a scoped style override.
 */
export function ToolTabs({ value, onValueChange, options }: ToolTabsProps) {
  return (
    <div style={{ paddingLeft: 4 }} data-tool-tabs>
      <Tabs value={value} onValueChange={onValueChange} options={options} />
      <style>{`[data-tool-tabs] > div:first-child { border-bottom: none; }`}</style>
    </div>
  )
}
