import type { ActionHandler } from "../context"

export const restoreNodes: ActionHandler = async (context, params) => {
  const snapshotName = String(params.snapshotName ?? "").trim()

  if (!snapshotName) {
    context.log.push({
      stepIndex: -1,
      stepName: "Restore nodes",
      message: "No snapshot name specified — skipped",
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "skipped",
    })
    return context
  }

  const saved = context.savedNodeSets[snapshotName]
  if (!saved) {
    context.log.push({
      stepIndex: -1,
      stepName: "Restore nodes",
      message: `Snapshot "${snapshotName}" not found`,
      itemsIn: context.nodes.length,
      itemsOut: context.nodes.length,
      status: "error",
      error: `Snapshot "${snapshotName}" not found`,
    })
    return context
  }

  const before = context.nodes.length
  context.nodes = [...saved]

  context.log.push({
    stepIndex: -1,
    stepName: "Restore nodes",
    message: `Restored ${saved.length} node(s) from "${snapshotName}"`,
    itemsIn: before,
    itemsOut: saved.length,
    status: "success",
  })

  return context
}
