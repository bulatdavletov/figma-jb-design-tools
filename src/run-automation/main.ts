import { loadAutomations, getAutomation } from "../app/tools/automations/storage"
import { executeAutomation } from "../app/tools/automations/executor"
import { setAutoRunAutomation } from "../app/tools/automations/main-thread"
import { plural } from "../app/utils/pluralize"
import { run } from "../app/run"

figma.parameters.on("input", async ({ query, key, result }: ParameterInputEvent) => {
  if (key === "automation") {
    const automations = await loadAutomations()
    const filtered = automations.filter((a) =>
      a.name.toLowerCase().includes(query.toLowerCase()),
    )
    result.setSuggestions(
      filtered.map((a) => ({ name: a.name, data: a.id })),
    )
  }
})

async function handleRun(parameters?: ParameterValues) {
  const automationId = parameters?.automation as string | undefined

  if (automationId) {
    const automation = await getAutomation(automationId)
    if (!automation) {
      figma.notify("Automation not found", { error: true })
      figma.closePlugin()
      return
    }

    const hasInput = automation.steps.some(
      (s) => s.enabled && (s.actionType === "askForInput" || s.children?.some((c) => c.enabled && c.actionType === "askForInput")),
    )

    if (hasInput) {
      setAutoRunAutomation(automationId)
      run("automations-tool")
      return
    }

    try {
      const result = await executeAutomation(automation)
      const context = "context" in result ? result.context : result
      const errors = context.log.filter((e: { status: string }) => e.status === "error")
      if (errors.length > 0) {
        const err = errors[0] as { error?: string; message?: string }
        figma.notify(`${automation.name}: ${err.error ?? err.message ?? "Error"}`, { error: true })
      } else {
        const completed = context.log.filter((e: { status: string }) => e.status === "success").length
        figma.notify(`${automation.name}: Completed ${plural(completed, "step")}`)
      }
    } catch (e) {
      figma.notify(e instanceof Error ? e.message : String(e), { error: true })
    }

    figma.closePlugin()
  } else {
    run("automations-tool")
  }
}

export default function () {
  figma.on("run", ({ parameters }: RunEvent) => {
    handleRun(parameters)
  })
}
