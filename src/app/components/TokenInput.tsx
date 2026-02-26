import { h } from "preact"
import { useRef, useEffect, useCallback, useState } from "preact/hooks"
import { Text } from "@create-figma-plugin/ui"
import { parseTokenSegments, classifyToken } from "./token-utils"
import { TokenText, neutralTokenCssText, selectedTokenCssText } from "./TokenPill"

export type Suggestion = {
  token: string
  label: string
  category?: string
}

const TOKEN_NODE_DATA_ATTR = "data-token"

const containerStyle: h.JSX.CSSProperties = {
  position: "relative",
  display: "block",
  width: "100%",
  minHeight: 24,
  padding: "0 7px",
  borderRadius: 4,
  backgroundColor: "var(--figma-color-bg-secondary)",
  color: "var(--figma-color-text)",
  font: "inherit",
  fontSize: 11,
  outline: "none",
  overflow: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}

const containerHoverStyle: h.JSX.CSSProperties = {
  border: "1px solid var(--figma-color-border)",
}

const containerFocusStyle: h.JSX.CSSProperties = {
  borderColor: "var(--figma-color-border-selected)",
}

const placeholderStyle: h.JSX.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 7,
  right: 7,
  lineHeight: "24px",
  fontSize: 11,
  color: "var(--figma-color-text-tertiary)",
  pointerEvents: "none",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}

export type TokenInputProps = {
  value: string
  onValueInput: (value: string) => void
  placeholder?: string
  suggestions?: Suggestion[]
}

/**
 * Get the character offset of the caret within the container (same order as serialized value).
 */
function getCaretCharacterOffset(container: HTMLDivElement): number {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return 0
  const range = sel.getRangeAt(0)
  if (!container.contains(range.startContainer)) return 0
  let offset = 0
  function walk(node: Node, targetNode: Node, targetOffset: number): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
      const len = (node.textContent ?? "").length
      if (node === targetNode) {
        offset += Math.min(targetOffset, len)
        return true
      }
      offset += len
      return false
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return false
    const el = node as HTMLElement
    const token = el.getAttribute(TOKEN_NODE_DATA_ATTR)
    if (token !== null) {
      if (node === targetNode) {
        offset += targetOffset > 0 ? token.length : 0
        return true
      }
      offset += token.length
      return false
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      if (walk(node.childNodes[i], targetNode, targetOffset)) return true
    }
    return false
  }
  walk(container, range.startContainer, range.startOffset)
  return offset
}

/**
 * Serialize contenteditable content to string. Walks child nodes:
 * text nodes -> append text; elements with data-token -> append attribute value.
 */
function serializeDomToValue(container: HTMLDivElement): string {
  const parts: string[] = []
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.textContent ?? "")
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const el = node as HTMLElement
    const token = el.getAttribute(TOKEN_NODE_DATA_ATTR)
    if (token !== null) {
      parts.push(token)
      return
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i])
    }
  }
  for (let i = 0; i < container.childNodes.length; i++) {
    walk(container.childNodes[i])
  }
  return parts.join("")
}

function createTokenSpan(container: HTMLDivElement, raw: string, label: string): HTMLSpanElement {
  const span = document.createElement("span")
  span.setAttribute("contenteditable", "false")
  span.setAttribute(TOKEN_NODE_DATA_ATTR, raw)
  span.className = "token-pill"
  span.style.cssText = neutralTokenCssText
  span.appendChild(document.createTextNode(label))
  return span
}

/**
 * Find the token pill element that the caret is touching (immediately before or after).
 */
function getTokenTouchedByCaret(container: HTMLDivElement): HTMLElement | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null
  const range = sel.getRangeAt(0)
  if (!range.collapsed || !container.contains(range.startContainer)) return null
  const startContainer = range.startContainer
  const startOffset = range.startOffset
  let before: Node | null = null
  let after: Node | null = null
  if (startContainer === container) {
    before = container.childNodes[startOffset - 1] ?? null
    after = container.childNodes[startOffset] ?? null
  } else if (startContainer.nodeType === Node.TEXT_NODE) {
    if (startOffset === 0) before = startContainer.previousSibling
    if (startOffset === (startContainer.textContent?.length ?? 0)) after = startContainer.nextSibling
  }
  const isToken = (n: Node | null) =>
    n?.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).getAttribute(TOKEN_NODE_DATA_ATTR) !== null
  if (isToken(before)) return before as HTMLElement
  if (isToken(after)) return after as HTMLElement
  return null
}

/**
 * Update which token pill is selected based on caret position. Call on selectionchange, input, keydown, click.
 */
function updateTokenSelectionState(container: HTMLDivElement) {
  const touched = getTokenTouchedByCaret(container)
  const pills = container.querySelectorAll<HTMLElement>("[data-token]")
  pills.forEach((el) => {
    el.style.cssText = el === touched ? selectedTokenCssText : neutralTokenCssText
  })
}

/**
 * Build DOM content from value and replace container's children.
 */
function buildDomFromValue(container: HTMLDivElement, value: string) {
  const segments = parseTokenSegments(value)
  container.innerHTML = ""
  for (const seg of segments) {
    if (seg.type === "text") {
      container.appendChild(document.createTextNode(seg.raw))
    } else {
      container.appendChild(createTokenSpan(container, seg.raw, seg.label))
    }
  }
  requestAnimationFrame(() => updateTokenSelectionState(container))
}

/**
 * Insert a token pill node at the current selection and return the new value.
 */
function insertTokenAtSelection(container: HTMLDivElement, tokenRaw: string): string {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return serializeDomToValue(container)

  const range = sel.getRangeAt(0)
  if (!container.contains(range.commonAncestorContainer)) return serializeDomToValue(container)

  const inner = tokenRaw.startsWith("{") && tokenRaw.endsWith("}") ? tokenRaw.slice(1, -1) : tokenRaw
  const { label } = classifyToken(inner)
  const span = createTokenSpan(container, tokenRaw, label)
  range.insertNode(span)
  range.setStartAfter(span)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
  return serializeDomToValue(container)
}

function SuggestionDropdown(props: {
  suggestions: Suggestion[]
  selectedIndex: number
  onSelect: (s: Suggestion) => void
}) {
  let lastCategory = ""
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 100,
        maxHeight: 200,
        overflowY: "auto",
        background: "var(--figma-color-bg)",
        border: "1px solid var(--figma-color-border)",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        marginTop: 2,
      }}
    >
      {props.suggestions.map((s, i) => {
        const showCategory = s.category && s.category !== lastCategory
        if (s.category) lastCategory = s.category
        return (
          <div key={s.token}>
            {showCategory && (
              <div
                style={{
                  padding: "4px 8px 2px 8px",
                  fontSize: 9,
                  fontWeight: 600,
                  color: "var(--figma-color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {s.category}
              </div>
            )}
            <div
              onMouseDown={(e) => {
                e.preventDefault()
                props.onSelect(s)
              }}
              style={{
                padding: "4px 8px",
                cursor: "pointer",
                background:
                  i === props.selectedIndex
                    ? "var(--figma-color-bg-selected)"
                    : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11 }}>
                <TokenText text={`{${s.token}}`} />
              </span>
              <Text
                style={{
                  fontSize: 10,
                  color: "var(--figma-color-text-secondary)",
                }}
              >
                {s.label}
              </Text>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function TokenInput(props: TokenInputProps) {
  const { value, onValueInput, placeholder, suggestions = [] } = props
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastEmittedValueRef = useRef<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [triggerStart, setTriggerStart] = useState(-1)

  const updateSuggestions = useCallback(
    (text: string, cursorPos: number) => {
      if (suggestions.length === 0) {
        setShowSuggestions(false)
        return
      }
      const lastOpen = text.lastIndexOf("{", cursorPos - 1)
      if (lastOpen === -1) {
        setShowSuggestions(false)
        return
      }
      const closeBetween = text.indexOf("}", lastOpen)
      if (closeBetween !== -1 && closeBetween < cursorPos) {
        setShowSuggestions(false)
        return
      }
      const partial = text.slice(lastOpen + 1, cursorPos).toLowerCase()
      setTriggerStart(lastOpen)
      const filtered = suggestions.filter((s) => {
        const full = s.token.toLowerCase()
        return full.startsWith(partial) || s.label.toLowerCase().includes(partial)
      })
      if (filtered.length === 0) {
        setShowSuggestions(false)
        return
      }
      setFilteredSuggestions(filtered)
      setSelectedIndex(0)
      setShowSuggestions(true)
    },
    [suggestions],
  )

  const syncValueToDom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (lastEmittedValueRef.current === value) {
      lastEmittedValueRef.current = null
      return
    }
    lastEmittedValueRef.current = null
    buildDomFromValue(el, value)
  }, [value])

  useEffect(syncValueToDom, [value, syncValueToDom])

  useEffect(() => {
    const onSelectionChange = () => {
      const el = containerRef.current
      if (!el) return
      updateTokenSelectionState(el)
    }
    document.addEventListener("selectionchange", onSelectionChange)
    return () => document.removeEventListener("selectionchange", onSelectionChange)
  }, [])

  const insertSuggestion = useCallback(
    (suggestion: Suggestion) => {
      const el = containerRef.current
      if (!el) return
      const tokenRaw = `{${suggestion.token}}`
      const newValue = insertTokenAtSelection(el, tokenRaw)
      lastEmittedValueRef.current = newValue
      onValueInput(newValue)
      setShowSuggestions(false)
    },
    [onValueInput],
  )

  const handleInput = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const serialized = serializeDomToValue(el)
    if (serialized !== value) {
      lastEmittedValueRef.current = serialized
      onValueInput(serialized)
    }
    if (suggestions.length > 0) {
      const cursorPos = getCaretCharacterOffset(el)
      updateSuggestions(serialized, cursorPos)
    }
    updateTokenSelectionState(el)
  }, [value, onValueInput, suggestions.length, updateSuggestions])

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      e.preventDefault()
      const el = containerRef.current
      if (!el) return
      const pasted = (e.clipboardData?.getData("text/plain") ?? "") as string
      const segments = parseTokenSegments(pasted)
      const doc = el.ownerDocument
      const sel = doc.getSelection()
      if (!sel || sel.rangeCount === 0) {
        buildDomFromValue(el, value + pasted)
        lastEmittedValueRef.current = value + pasted
        onValueInput(value + pasted)
        return
      }
      const range = sel.getRangeAt(0)
      range.deleteContents()
      for (const seg of segments) {
        if (seg.type === "text") {
          range.insertNode(doc.createTextNode(seg.raw))
          range.collapse(false)
        } else {
          const span = createTokenSpan(el, seg.raw, seg.label)
          range.insertNode(span)
          range.setStartAfter(span)
          range.collapse(true)
        }
      }
      sel.removeAllRanges()
      sel.addRange(range)
      const newValue = serializeDomToValue(el)
      lastEmittedValueRef.current = newValue
      onValueInput(newValue)
      requestAnimationFrame(() => updateTokenSelectionState(el))
    },
    [value, onValueInput],
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const el = containerRef.current
      if (!el) return
      if (showSuggestions && filteredSuggestions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1))
          return
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          return
        }
        if (e.key === "Enter" || e.key === "Tab") {
          const suggestion = filteredSuggestions[selectedIndex]
          if (suggestion) {
            e.preventDefault()
            insertSuggestion(suggestion)
          }
          return
        }
        if (e.key === "Escape") {
          setShowSuggestions(false)
          return
        }
      }
      if (e.key === "Backspace") {
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return
        const range = sel.getRangeAt(0)
        if (!range.collapsed) return
        let tokenNode: HTMLElement | null = null
        const startContainer = range.startContainer
        if (startContainer === el) {
          const idx = range.startOffset
          if (idx > 0) {
            const prevChild = el.childNodes[idx - 1]
            if (prevChild.nodeType === Node.ELEMENT_NODE) {
              const t = (prevChild as HTMLElement).getAttribute(TOKEN_NODE_DATA_ATTR)
              if (t !== null) tokenNode = prevChild as HTMLElement
            }
          }
        } else if (startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
          const prev = startContainer.previousSibling
          if (prev?.nodeType === Node.ELEMENT_NODE) {
            const t = (prev as HTMLElement).getAttribute(TOKEN_NODE_DATA_ATTR)
            if (t !== null) tokenNode = prev as HTMLElement
          }
        }
        if (tokenNode) {
          const token = tokenNode.getAttribute(TOKEN_NODE_DATA_ATTR)
          if (token !== null) {
            const full = serializeDomToValue(el)
            const idx = full.indexOf(token)
            if (idx !== -1) {
              const newValue = full.slice(0, idx) + full.slice(idx + token.length)
              buildDomFromValue(el, newValue)
              lastEmittedValueRef.current = newValue
              onValueInput(newValue)
              e.preventDefault()
            }
          }
        }
      }
    },
    [onValueInput, showSuggestions, filteredSuggestions, selectedIndex, insertSuggestion],
  )

  const containerStyles = {
    ...containerStyle,
    ...(isHovered ? containerHoverStyle : {}),
    ...(isFocused ? containerFocusStyle : {}),
  }

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
      {!value && placeholder && (
        <div style={placeholderStyle} aria-hidden>
          {placeholder}
        </div>
      )}
      <div
        ref={containerRef}
        contentEditable
        role="textbox"
        aria-placeholder={placeholder}
        style={containerStyles}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionDropdown
          suggestions={filteredSuggestions}
          selectedIndex={selectedIndex}
          onSelect={insertSuggestion}
        />
      )}
    </div>
  )
}
