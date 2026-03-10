import {
  Button,
  IconButton,
  IconHome16,
  Stack,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"

import { AutomationCard } from "../../../components/AutomationCard"
import { Page } from "../../../components/Page"
import { ToolBody } from "../../../components/ToolBody"
import { ToolFooter } from "../../../components/ToolFooter"
import { ToolHeader } from "../../../components/ToolHeader"
import { State } from "../../../components/State"
import type { AutomationListItem, AutomationsRunProgress, AutomationsRunResult } from "../../../home/messages"

function MoreMenu(props: {
  onImport: (files: File[]) => void
  onExportAll: () => void
  hasAutomations: boolean
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={triggerRef} style={{ position: "relative", flexShrink: 0 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          cursor: "pointer",
          background: open ? "var(--figma-color-bg-pressed)" : "transparent",
          color: "var(--figma-color-text-secondary)",
          fontSize: 14,
          fontWeight: "bold",
          letterSpacing: 1,
        }}
      >
        ···
      </div>
      {open && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            right: 0,
            background: "var(--figma-color-bg)",
            border: "1px solid var(--figma-color-border)",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 9999,
            minWidth: 140,
            overflow: "hidden",
            padding: "4px 0",
          }}
        >
          <div
            onClick={() => {
              setOpen(false)
              fileInputRef.current?.click()
            }}
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
            Import
          </div>
          <div
            onClick={() => {
              setOpen(false)
              props.onExportAll()
            }}
            style={{
              padding: "6px 12px",
              fontSize: 11,
              cursor: props.hasAutomations ? "pointer" : "default",
              color: props.hasAutomations ? "var(--figma-color-text)" : "var(--figma-color-text-disabled)",
              background: "transparent",
              pointerEvents: props.hasAutomations ? "auto" : "none",
            }}
            onMouseEnter={(e) => { if (props.hasAutomations) (e.currentTarget as HTMLElement).style.background = "var(--figma-color-bg-hover)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
          >
            Export all
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from((e.currentTarget as HTMLInputElement).files ?? [])
          if (files.length > 0) props.onImport(files)
          ;(e.currentTarget as HTMLInputElement).value = ""
        }}
      />
    </div>
  )
}

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
  onExport: (id: string) => void
  onImport: (files: File[]) => void
  onExportAll: () => void
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
          <Stack space="extraSmall">
            {props.automations.map((a) => (
              <AutomationCard
                key={a.id}
                title={a.name}
                emoji={a.emoji}
                onEdit={() => props.onEdit(a.id)}
                onRun={() => props.onRun(a.id)}
                onDelete={() => props.onDelete(a.id)}
                onDuplicate={() => props.onDuplicate(a.id)}
                onExport={() => props.onExport(a.id)}
              />
            ))}
          </Stack>
        </ToolBody>
      )}
      <ToolFooter>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <Button
              fullWidth
              onClick={props.onCreateNew}
            >
              New automation
            </Button>
          </div>
          <MoreMenu
            onImport={props.onImport}
            onExportAll={props.onExportAll}
            hasAutomations={props.automations.length > 0}
          />
        </div>
      </ToolFooter>
    </Page>
  )
}
