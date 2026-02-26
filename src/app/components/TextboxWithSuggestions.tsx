import { h } from "preact"
import { useState, useRef, useCallback, useEffect } from "preact/hooks"
import { Textbox, Text } from "@create-figma-plugin/ui"
import { TokenText } from "./TokenPill"

export type Suggestion = {
  token: string
  label: string
  category?: string
}

export type TextboxWithSuggestionsProps = {
  value: string
  onValueInput: (value: string) => void
  placeholder?: string
  suggestions: Suggestion[]
}

export function TextboxWithSuggestions(props: TextboxWithSuggestionsProps) {
  const { value, onValueInput, placeholder, suggestions } = props
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [triggerStart, setTriggerStart] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateSuggestions = useCallback(
    (text: string, cursorPos: number) => {
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

  const handleInput = useCallback(
    (newValue: string) => {
      onValueInput(newValue)
      updateSuggestions(newValue, newValue.length)
    },
    [onValueInput, updateSuggestions],
  )

  const insertSuggestion = useCallback(
    (suggestion: Suggestion) => {
      if (triggerStart === -1) return
      const before = value.slice(0, triggerStart)
      const after = value.slice(value.length)
      const newValue = `${before}{${suggestion.token}}${after}`
      onValueInput(newValue)
      setShowSuggestions(false)
    },
    [value, triggerStart, onValueInput],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showSuggestions) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (filteredSuggestions[selectedIndex]) {
          e.preventDefault()
          insertSuggestion(filteredSuggestions[selectedIndex])
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false)
      }
    },
    [showSuggestions, filteredSuggestions, selectedIndex, insertSuggestion],
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <Textbox
        value={value}
        onValueInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
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
