export interface StepLogEntry {
  stepIndex: number
  stepName: string
  message: string
  itemsIn: number
  itemsOut: number
  status: "success" | "skipped" | "error"
  error?: string
}

export interface AutomationContext {
  nodes: SceneNode[]
  variables: Variable[]
  styles: BaseStyle[]
  log: StepLogEntry[]
  pipelineVars: Record<string, string | number | boolean>
}

export type ActionHandler = (
  context: AutomationContext,
  params: Record<string, unknown>,
) => Promise<AutomationContext>

export function createInitialContext(): AutomationContext {
  return {
    nodes: [...figma.currentPage.selection],
    variables: [],
    styles: [],
    log: [],
    pipelineVars: {},
  }
}

export function cloneContext(ctx: AutomationContext): AutomationContext {
  return {
    nodes: [...ctx.nodes],
    variables: [...ctx.variables],
    styles: [...ctx.styles],
    log: [...ctx.log],
    pipelineVars: { ...ctx.pipelineVars },
  }
}
