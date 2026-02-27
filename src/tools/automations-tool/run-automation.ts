import { loadAutomations, getAutomation } from "./storage"
import { executeAutomation } from "./executor"
import { setAutoRunAutomation } from "./main-thread"
import { plural } from "../../utils/pluralize"
import { run } from "../../home/run"

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
      const context = await executeAutomation(automation)
      const errors = context.log.filter((e) => e.status === "error")
      if (errors.length > 0) {
        figma.notify(`${automation.name}: ${errors[0].message}`, { error: true })
      } else {
        const completed = context.log.filter((e) => e.status === "success").length
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
