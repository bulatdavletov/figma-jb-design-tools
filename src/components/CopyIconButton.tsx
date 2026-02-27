import { h } from "preact"
import { useState, useRef, useCallback } from "preact/hooks"
import { IconButton, IconCheck16 } from "@create-figma-plugin/ui"
import { copyTextToClipboard } from "../utils/clipboard"

/**
 * An icon button that copies `text` to the clipboard.
 *
 * - Shows a small copy icon by default.
 * - On click: copies text, icon changes to a checkmark for 1.5 s, then reverts.
 */
export function CopyIconButton(props: {
  text: string
  title?: string
  onCopied?: (text: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = useCallback(
    (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      void copyTextToClipboard(props.text).then((ok) => {
        if (!ok) return
        setCopied(true)
        props.onCopied?.(props.text)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setCopied(false)
          timerRef.current = null
        }, 1500)
      })
    },
    [props.text],
  )

  return (
    <IconButton title={copied ? "Copied!" : `${props.text}`} onClick={handleCopy}>
      {copied ? (
        <IconCheck16 />
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M5.5 3.5H4.5C3.94772 3.5 3.5 3.94772 3.5 4.5V12.5C3.5 13.0523 3.94772 13.5 4.5 13.5H10.5C11.0523 13.5 11.5 13.0523 11.5 12.5V11.5"
            stroke="currentColor"
            stroke-linecap="round"
          />
          <rect x="5.5" y="2.5" width="7" height="9" rx="1" stroke="currentColor" />
        </svg>
      )}
    </IconButton>
  )
}
