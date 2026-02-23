import type { MainToUiMessage } from "../app/messages"

export type Scenario = {
  id: string
  label: string
  /** Messages dispatched to simulate this state (in order). */
  messages: MainToUiMessage[]
  /** Extra props forwarded to the tool view component. */
  props?: {
    initialSelectionEmpty?: boolean
    initialTab?: string
  }
}
