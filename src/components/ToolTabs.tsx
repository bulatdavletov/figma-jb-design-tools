import { Tabs } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useMemo } from "preact/hooks"

export interface ToolTabsOption {
  value: string
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
 *
 * NOTE: The underlying Tabs component has a `children` property on each
 * option that renders extra content below the tab label. We intentionally
 * strip it here (forced to null) because ToolTabs is a pure navigation
 * bar — tab content is rendered separately by each tool view.
 */
export function ToolTabs({ value, onValueChange, options }: ToolTabsProps) {
  const tabOptions = useMemo(
    () => options.map((o) => ({ value: o.value, children: null })),
    [options]
  )
  return (
    <div data-tool-tabs>
      <Tabs value={value} onValueChange={onValueChange} options={tabOptions} />
      <style>{`[data-tool-tabs] > div:first-child { border-bottom: none; }`}</style>
    </div>
  )
}
