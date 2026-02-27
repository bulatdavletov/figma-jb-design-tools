import { Button, IconButton, IconClose16, Inline, Stack, Text } from "@create-figma-plugin/ui"
import { h } from "preact"

import type { ManualPair } from "../../messages"
import { DataTable, type DataTableColumn } from "../../components/DataTable"
import { SegmentedControlWithWidth } from "../../components/SegmentedControlWithWidth"

type Props = {
  capturedOldName: string | null
  capturedNewName: string | null
  manualPairs: ManualPair[]
  manualPairsExportTarget: "uikit" | "icons"
  onExportTargetChange: (value: "uikit" | "icons") => void
  selectionSize: number
  isBusy: boolean
  onCaptureOld: () => void
  onCaptureNew: () => void
  onRemovePair: (oldKey: string) => void
  onExportMapping: () => void
}

const PAIRS_COLUMNS: DataTableColumn[] = [
  { label: "Old component", width: "42%" },
  { label: "New component", width: "42%" },
  { label: "", width: "16%" },
]

const CELL_STYLE: h.JSX.CSSProperties = {
  padding: "6px 8px",
  fontSize: 11,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

export function ManualPairsTab({
  capturedOldName,
  capturedNewName,
  manualPairs,
  manualPairsExportTarget,
  onExportTargetChange,
  selectionSize,
  isBusy,
  onCaptureOld,
  onCaptureNew,
  onRemovePair,
  onExportMapping,
}: Props) {
  return (
    <Stack space="small">
      <Text style={{ fontWeight: 600 }}>Manual pairs</Text>

      <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
        <Text
          style={{
            fontSize: 11,
            color: capturedOldName ? "var(--figma-color-text)" : "var(--figma-color-text-tertiary)",
          }}
        >
          Old: {capturedOldName ?? "—"}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: capturedNewName ? "var(--figma-color-text)" : "var(--figma-color-text-tertiary)",
          }}
        >
          New: {capturedNewName ?? "—"}
        </Text>
      </div>

      <Inline space="extraSmall">
        <Button
          secondary
          onClick={onCaptureOld}
          disabled={selectionSize === 0 || isBusy}
        >
          Capture Old
        </Button>
        <Button
          secondary
          onClick={onCaptureNew}
          disabled={selectionSize === 0 || isBusy}
        >
          Capture New
        </Button>
      </Inline>

      {manualPairs.length > 0 ? (
        <DataTable
          header="Recorded pairs"
          summary={`${manualPairs.length} pair${manualPairs.length !== 1 ? "s" : ""}`}
          columns={PAIRS_COLUMNS}
        >
          {manualPairs.map((pair) => (
            <tr key={pair.oldKey}>
              <td style={CELL_STYLE}>{pair.oldName}</td>
              <td style={CELL_STYLE}>{pair.newName}</td>
              <td style={{ ...CELL_STYLE, textAlign: "center" }}>
                <IconButton onClick={() => onRemovePair(pair.oldKey)} title="Remove pair">
                  <IconClose16 />
                </IconButton>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <Text style={{ fontSize: 11, color: "var(--figma-color-text-tertiary)" }}>
          No pairs recorded yet
        </Text>
      )}

      <SegmentedControlWithWidth
        value={manualPairsExportTarget}
        fullWidth={false}
        onValueChange={(v) => onExportTargetChange(v as "uikit" | "icons")}
        options={[
          { value: "uikit", children: "UI Kit" },
          { value: "icons", children: "Icons" },
        ]}
      />
      <Button
        secondary
        onClick={onExportMapping}
        disabled={manualPairs.length === 0}
      >
        Export mapping
      </Button>
    </Stack>
  )
}
