import {
  Button,
  FileUploadButton,
  IconButton,
  IconHome16,
  Stack,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { h, Fragment } from "preact"

import { AutomationCard } from "../../../components/AutomationCard"
import { Page } from "../../../components/Page"
import { ToolBody } from "../../../components/ToolBody"
import { ToolFooter } from "../../../components/ToolFooter"
import { ToolHeader } from "../../../components/ToolHeader"
import { State } from "../../../components/State"
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
              />
            ))}
          </Stack>
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
