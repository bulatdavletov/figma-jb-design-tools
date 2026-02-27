import type { PipelineValue, PipelineListValue } from "./context"
import type { StepOutputPreview } from "../../messages"

const NODE_PREVIEW_CAP = 20

export function serializeStepOutput(
  nodes: SceneNode[],
  pipelineVars: Record<string, PipelineValue | PipelineListValue>,
  stepIndex: number,
): StepOutputPreview {
  const nodePreview = nodes.slice(0, NODE_PREVIEW_CAP).map((n) => ({
    id: n.id,
    name: n.name,
    type: n.type,
  }))

  const dataPreview: Record<string, string | number | boolean | (string | number | boolean)[]> = {}
  for (const [key, value] of Object.entries(pipelineVars)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      dataPreview[key] = value.slice(0, 10) as (string | number | boolean)[]
    } else {
      dataPreview[key] = value
    }
  }

  return {
    stepIndex,
    nodePreview,
    dataPreview,
    nodeCount: nodes.length,
  }
}
