/**
 * Returns `"1 node"` or `"5 nodes"` — picks singular/plural form based on count.
 * For irregular plurals pass the plural form explicitly: `plural(1, "child", "children")`.
 */
export function plural(count: number, singular: string, pluralForm?: string): string {
  const word = count === 1 ? singular : (pluralForm ?? `${singular}s`)
  return `${count} ${word}`
}
