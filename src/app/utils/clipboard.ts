/**
 * Copies text to the system clipboard.
 * Uses the modern Clipboard API with a fallback to the legacy execCommand approach.
 * Returns `true` on success, `false` on failure.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      textarea.remove()
      return true
    } catch {
      return false
    }
  }
}
