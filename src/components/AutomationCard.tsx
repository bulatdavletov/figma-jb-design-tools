import { Button, Text } from "@create-figma-plugin/ui"
import { h } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"

import { AUTOMATION_EMOJIS } from "../tools/automations-tool/emoji"
export function AutomationCard(props: {
  title: string
  emoji?: string
  onEdit: () => void
  onRun: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const menuOpen = menuPos !== null
  const fallbackEmoji = AUTOMATION_EMOJIS[0] ?? "🤖"
  const emoji = props.emoji && props.emoji.trim().length > 0 ? props.emoji : fallbackEmoji

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setMenuPos(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuPos(null)
      return
    }
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const menuHeight = 60
    const spaceBelow = window.innerHeight - rect.bottom
    const y = spaceBelow >= menuHeight + 4
      ? rect.bottom + 2
      : rect.top - menuHeight - 2
    setMenuPos({ x: rect.right, y })
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuPos(null) }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px 4px 4px",
        borderRadius: 6,
        background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
        cursor: "pointer",
      }}
      onClick={props.onEdit}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "var(--figma-color-bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
          fontSize: 16,
        }}
        aria-hidden="true"
      >
        {emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--figma-color-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          flexShrink: 0,
          alignItems: "center",
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={props.onRun}
          style={{ fontSize: 10, padding: "2px 8px", minHeight: 0 }}
        >
          <Text>Run</Text>
        </Button>
        <div ref={triggerRef}>
          <div
            onClick={toggleMenu}
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "pointer",
              background: menuOpen ? "var(--figma-color-bg-pressed)" : "transparent",
              color: "var(--figma-color-text-secondary)",
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            ···
          </div>
        </div>
        {menuOpen && menuPos && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: menuPos.x,
              top: menuPos.y,
              transform: "translateX(-100%)",
              background: "var(--figma-color-bg)",
              border: "1px solid var(--figma-color-border)",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 9999,
              minWidth: 120,
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => { setMenuPos(null); props.onDuplicate() }}
              style={{
                padding: "6px 12px",
                fontSize: 11,
                cursor: "pointer",
                color: "var(--figma-color-text)",
                background: "transparent",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--figma-color-bg-hover)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              Duplicate
            </div>
            <div
              onClick={() => { setMenuPos(null); props.onDelete() }}
              style={{
                padding: "6px 12px",
                fontSize: 11,
                cursor: "pointer",
                color: "var(--figma-color-text-danger)",
                background: "transparent",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--figma-color-bg-hover)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
