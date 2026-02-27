export interface StepLogEntry {
  stepIndex: number
  stepName: string
  message: string
  itemsIn: number
  itemsOut: number
  status: "success" | "skipped" | "error"
  error?: string
}

export interface NodePreview {
  id: string
  name: string
  type: string
}

export interface StepOutputPreview {
  stepId: string
  stepIndex: number
  status: "success" | "error" | "skipped"
  nodesAfter: number
  nodeSample: NodePreview[]
  dataOutput?: PipelineValue | PipelineListValue
  pipelineVarsSnapshot: Record<string, string>
  savedNodeSetsCount: Record<string, number>
  durationMs: number
  message?: string
  error?: string
}

export type PipelineValue = string | number | boolean
export type PipelineListValue = PipelineValue[]

export interface AutomationContext {
  nodes: SceneNode[]
  variables: Variable[]
  styles: BaseStyle[]
  log: StepLogEntry[]
  pipelineVars: Record<string, PipelineValue | PipelineListValue>
  savedNodeSets: Record<string, SceneNode[]>
  stepOutputs: StepOutputPreview[]
  /** Inside repeat: variable name (e.g. "item") for {$item.property} token resolution. */
  repeatItemVar?: string
  /** Inside repeat nodes mode: reference to the current iteration's node. */
  repeatItemNode?: SceneNode
}

export type ActionResult = {
  context: AutomationContext
  output?: PipelineValue | PipelineListValue
}

export type ActionHandler = (
  context: AutomationContext,
  params: Record<string, unknown>,
) => Promise<AutomationContext | ActionResult>

export function isActionResult(value: AutomationContext | ActionResult): value is ActionResult {
  return "context" in value && "nodes" in (value as ActionResult).context
}

export function createInitialContext(): AutomationContext {
  return {
    nodes: [...figma.currentPage.selection],
    variables: [],
    styles: [],
    log: [],
    pipelineVars: {},
    savedNodeSets: {},
    stepOutputs: [],
  }
}

const NODE_SAMPLE_LIMIT = 20

export function captureNodeSample(nodes: SceneNode[]): NodePreview[] {
  return nodes.slice(0, NODE_SAMPLE_LIMIT).map((n) => ({
    id: n.id,
    name: n.name,
    type: n.type,
  }))
}

export function serializePipelineVars(
  vars: Record<string, PipelineValue | PipelineListValue>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(vars)) {
    if (Array.isArray(value)) {
      out[key] = `[${value.length} items]`
    } else {
      out[key] = String(value)
    }
  }
  return out
}

export function savedNodeSetsCounts(
  sets: Record<string, SceneNode[]>,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [key, nodes] of Object.entries(sets)) {
    out[key] = nodes.length
  }
  return out
}

export function cloneContext(ctx: AutomationContext): AutomationContext {
  const clonedVars: Record<string, PipelineValue | PipelineListValue> = {}
  for (const [key, value] of Object.entries(ctx.pipelineVars)) {
    clonedVars[key] = Array.isArray(value) ? [...value] : value
  }

  const clonedSets: Record<string, SceneNode[]> = {}
  for (const [key, nodes] of Object.entries(ctx.savedNodeSets)) {
    clonedSets[key] = [...nodes]
  }

  return {
    nodes: [...ctx.nodes],
    variables: [...ctx.variables],
    styles: [...ctx.styles],
    log: [...ctx.log],
    pipelineVars: clonedVars,
    savedNodeSets: clonedSets,
    stepOutputs: [...ctx.stepOutputs],
    repeatItemVar: ctx.repeatItemVar,
    repeatItemNode: ctx.repeatItemNode,
  }
}
