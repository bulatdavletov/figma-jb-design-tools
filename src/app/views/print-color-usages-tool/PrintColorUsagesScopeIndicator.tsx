import { Text } from "@create-figma-plugin/ui"
import { h } from "preact"
import { ScopeControl, type ScopeValue } from "../../components/ScopeControl"

type Props = {
  scope: ScopeValue
  hasSelection: boolean
  onScopeChange?: (scope: ScopeValue) => void
  candidates?: number
  changed?: number
  unchanged?: number
  skipped?: number
}

export function PrintColorUsagesScopeIndicator({
  scope,
  hasSelection,
  onScopeChange,
  candidates,
  changed,
  unchanged,
  skipped,
}: Props) {
  const hasTotals =
    typeof candidates === "number" &&
    typeof changed === "number" &&
    typeof unchanged === "number" &&
    typeof skipped === "number"
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <ScopeControl
        value={scope}
        hasSelection={hasSelection}
        onValueChange={onScopeChange}
        disabled={!onScopeChange}
      />
      {hasTotals ? (
        <Text style={{ color: "var(--figma-color-text-secondary)" }}>
          Candidates: {candidates} | Changes: {changed} | Unchanged: {unchanged} | Skipped: {skipped}
        </Text>
      ) : (
        <Text style={{ color: "var(--figma-color-text-secondary)" }}>
          Scope is based on current selection at check time.
        </Text>
      )}
    </div>
  )
}
