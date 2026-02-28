export const AUTOMATION_EMOJIS = [
  "🤖",
  "✨",
  "⚡",
  "🧩",
  "🛠",
  "🧪",
  "📦",
  "🧠",
  "🎛",
  "🧭",
  "🔁",
  "🧷",
]

export function getAutomationEmojiByIndex(index: number): string {
  if (AUTOMATION_EMOJIS.length === 0) return "🤖"
  const safeIndex = ((index % AUTOMATION_EMOJIS.length) + AUTOMATION_EMOJIS.length) % AUTOMATION_EMOJIS.length
  return AUTOMATION_EMOJIS[safeIndex] ?? "🤖"
}

export function getNextAutomationEmojiIndex(
  automations: { emoji?: string; createdAt: number }[],
): number {
  if (AUTOMATION_EMOJIS.length === 0) return 0
  if (!automations || automations.length === 0) return 0

  let latest = automations[0]
  for (let i = 1; i < automations.length; i += 1) {
    if (automations[i].createdAt > latest.createdAt) {
      latest = automations[i]
    }
  }

  const idx = typeof latest.emoji === "string" ? AUTOMATION_EMOJIS.indexOf(latest.emoji) : -1
  return idx >= 0 ? (idx + 1) % AUTOMATION_EMOJIS.length : 0
}
