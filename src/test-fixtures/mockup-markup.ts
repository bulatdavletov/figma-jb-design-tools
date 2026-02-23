import type { Scenario } from "./types"
import type { MainToUiMessage } from "../app/messages"

const COLOR_PREVIEWS: MainToUiMessage = {
  type: "MOCKUP_MARKUP_COLOR_PREVIEWS",
  previews: {
    text: { hex: "#0B0F14", opacityPercent: 100 },
    textSecondary: { hex: "#6C707A", opacityPercent: 100 },
    purple: { hex: "#7B61FF", opacityPercent: 100 },
  },
}

export const scenarios: Scenario[] = [
  {
    id: "idle-nothing-selected",
    label: "Nothing Selected",
    messages: [
      { type: "MOCKUP_MARKUP_STATE", state: { selectionSize: 0, textNodeCount: 0, hasSourceTextNode: false } },
      { type: "MOCKUP_MARKUP_STATUS", status: { status: "idle" } },
      COLOR_PREVIEWS,
    ],
  },
  {
    id: "text-selected",
    label: "Text Node Selected",
    messages: [
      { type: "MOCKUP_MARKUP_STATE", state: { selectionSize: 1, textNodeCount: 1, hasSourceTextNode: true } },
      { type: "MOCKUP_MARKUP_STATUS", status: { status: "idle" } },
      COLOR_PREVIEWS,
    ],
  },
  {
    id: "working",
    label: "Applying...",
    messages: [
      { type: "MOCKUP_MARKUP_STATE", state: { selectionSize: 1, textNodeCount: 1, hasSourceTextNode: true } },
      { type: "MOCKUP_MARKUP_STATUS", status: { status: "working", message: "Applying typography preset…" } },
      COLOR_PREVIEWS,
    ],
  },
]
