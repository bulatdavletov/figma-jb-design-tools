export interface StepLogEntry {
  stepIndex: number
  stepName: string
  message: string
  itemsIn: number
  itemsOut: number
  status: "success" | "skipped" | "error"
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
  }
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
  }
}
