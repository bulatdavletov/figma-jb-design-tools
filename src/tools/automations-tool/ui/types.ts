export type Screen = "list" | "builder" | "runOutput"
export type RightPanel = "empty" | "picker" | "config" | "runOutput"
export type ChildBranch = "then" | "else"
export type StepPath = { index: number; childIndex?: number; childBranch?: ChildBranch }

export const BUILDER_WIDTH = 680
export const BUILDER_HEIGHT = 520
export const LIST_WIDTH = 360
export const LIST_HEIGHT = 500

export const ACTIONS_WITH_CHILDREN: string[] = [
  "repeatWithEach",
  "ifCondition",
  "mapList",
  "reduceList",
]
