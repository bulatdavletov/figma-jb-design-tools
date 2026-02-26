import { IconInteractionClickSmall24, Stack } from "@create-figma-plugin/ui"
import { h } from "preact"

import type { PrintColorUsagesPrintPreviewPayload } from "../../home/messages"
import { CopyIconButton } from "../../components/CopyIconButton"
import { DataList } from "../../components/DataList"
import { DataRow } from "../../components/DataRow"
import { State } from "../../components/State"

export function PrintTab(props: {
  printPreview: PrintColorUsagesPrintPreviewPayload | null
  selectionSize: number
}) {
  const { printPreview, selectionSize } = props

  if (selectionSize === 0) {
    return (
      <State
        icon={<IconInteractionClickSmall24 />}
        title="Select layers to print color usages."
      />
    )
  }

  if (!printPreview) {
    return <State loading={true}/>
  }

  if (printPreview.entries.length === 0) {
    return <State title="No colors found in selection" />
  }

  return (
    <Stack space="medium">
      <DataList header="Will be printed">
        {printPreview.entries.map((entry, index) => (
          <DataRow
            key={`${entry.layerName}-${index}`}
            primary={entry.label}
            secondary={entry.layerName}
            trailing={<CopyIconButton text={entry.layerName} title="Copy layer name" />}
          />
        ))}
      </DataList>
    </Stack>
  )
}
