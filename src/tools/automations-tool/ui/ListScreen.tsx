import {
  Button,
  FileUploadButton,
  IconButton,
  IconHome16,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"

import { Page } from "../../../components/Page"
import { ToolBody } from "../../../components/ToolBody"
import { ToolFooter } from "../../../components/ToolFooter"
import { ToolHeader } from "../../../components/ToolHeader"
import { State } from "../../../components/State"
import { DataList } from "../../../components/DataList"
import type { AutomationListItem, AutomationsRunProgress, AutomationsRunResult } from "../../../home/messages"

export function ListScreen(props: {
  automations: AutomationListItem[]
  runProgress: AutomationsRunProgress | null
  runResult: AutomationsRunResult | null
  onBack: () => void
  onCreateNew: () => void
  onEdit: (id: string) => void
  onRun: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onImport: (files: File[]) => void
}) {
  return (
    <Page>
      <ToolHeader
        title="Automations"
        left={
          <IconButton onClick={props.onBack}>
            <IconHome16 />
          </IconButton>
        }
      />
      {props.automations.length === 0 ? (
        <ToolBody mode="state">
          <State
            title="No automations yet"
          />
        </ToolBody>
      ) : (
        <ToolBody mode="content">
          {props.runProgress && (
            <Fragment>
              <div
                style={{
                  padding: "8px 0",
                  fontSize: 11,
                  color: "var(--figma-color-text-secondary)",
                }}
              >
                Running "{props.runProgress.automationName}" — step {props.runProgress.currentStep}/
                {props.runProgress.totalSteps}: {props.runProgress.stepName}
              </div>
              <VerticalSpace space="small" />
            </Fragment>
          )}
          {props.runResult && (
            <Fragment>
              <div
                style={{
                  padding: "8px 0",
                  fontSize: 11,
                  color: props.runResult.success
                    ? "var(--figma-color-text-success)"
                    : "var(--figma-color-text-danger)",
                }}
              >
                {props.runResult.message}
                {props.runResult.errors.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    {props.runResult.errors.map((e, i) => (
                      <div key={i}>{e}</div>
                    ))}
                  </div>
                )}
              </div>
              <VerticalSpace space="small" />
            </Fragment>
          )}
          <DataList>
            {props.automations.map((a) => (
              <AutomationRow
                key={a.id}
                automation={a}
                onEdit={() => props.onEdit(a.id)}
                onRun={() => props.onRun(a.id)}
                onDelete={() => props.onDelete(a.id)}
                onDuplicate={() => props.onDuplicate(a.id)}
              />
            ))}
          </DataList>
        </ToolBody>
      )}
      <ToolFooter>
        <Button
          fullWidth
          onClick={props.onCreateNew}
        >
          New automation
        </Button>
        <FileUploadButton
          acceptedFileTypes={["application/json", ".json"]}
          fullWidth
          onSelectedFiles={props.onImport}
          secondary
        >
          Import from JSON
        </FileUploadButton>
      </ToolFooter>
    </Page>
  )
}

function AutomationRow(props: {
  automation: AutomationListItem
  onEdit: () => void
  onRun: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const a = props.automation

  const menuOpen = menuPos !== null

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
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        gap: 8,
        background: hovered ? "var(--figma-color-bg-hover)" : "transparent",
        borderRadius: 4,
        cursor: "pointer",
      }}
      onClick={props.onEdit}
    >
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
          {a.name}
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
