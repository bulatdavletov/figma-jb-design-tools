import { SegmentedControl } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useCallback, useState } from "preact/hooks"

export type ScopeValue = "selection" | "page" | "all_pages"

/**
 * Hook that owns scope state + auto-sync rule.
 *
 * Call `updateSelectionSize(n)` whenever the main thread reports a new
 * selection size. The hook automatically switches scope:
 *   - selectionSize > 0  →  "selection"
 *   - selectionSize === 0 →  "page"
 *
 * `setScope` is still exposed so the user can override manually,
 * but the next `updateSelectionSize` call will re-sync.
 */
export function useScope(initialSelectionEmpty: boolean) {
  const [selectionSize, setSelectionSize] = useState(initialSelectionEmpty ? 0 : 1)
  const [scope, setScope] = useState<ScopeValue>(
    initialSelectionEmpty ? "page" : "selection"
  )

  const updateSelectionSize = useCallback((newSize: number) => {
    setSelectionSize(newSize)
    setScope(newSize > 0 ? "selection" : "page")
  }, [])

  return {
    scope,
    setScope,
    selectionSize,
    hasSelection: selectionSize > 0,
    updateSelectionSize,
  }
}

type Props = {
  value: ScopeValue
  hasSelection: boolean
  onValueChange?: (value: ScopeValue) => void
  disabled?: boolean
}

/**
 * Consistent scope selector used across all tools.
 *
 * Fixed options: "Selection" | "Current page" | "All pages"
 *
 * Behaviour:
 * - When hasSelection=false, "Selection" is disabled and cannot be picked.
 * - Labels are always the same everywhere.
 *
 * NOTE: The library SegmentedControl requires children to be plain strings
 * (not JSX) for proper padding via its internal `.text` CSS class.
 */
export function ScopeControl({
  value,
  hasSelection,
  onValueChange,
  disabled = false,
}: Props) {
  return (
    <div class="scope-control-stretch">
      <style>{`.scope-control-stretch > div { width: 100%; } .scope-control-stretch > div > label { flex: 1; text-align: center; }`}</style>
      <SegmentedControl
        value={value}
        disabled={disabled}
        onValueChange={(next) => {
          if (!onValueChange) return
          const nextScope = next as ScopeValue
          // Prevent selecting "selection" when nothing is selected
          if (nextScope === "selection" && !hasSelection) return
          onValueChange(nextScope)
        }}
        options={[
          {
            value: "selection",
            disabled: disabled || !hasSelection,
            children: "Selection",
          },
          {
            value: "page",
            disabled,
            children: "Current page",
          },
          {
            value: "all_pages",
            disabled,
            children: "All pages",
          },
        ]}
      />
    </div>
  )
}
