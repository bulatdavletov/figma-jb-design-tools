export const INT_UI_KIT_LIBRARY_NAME = "Int UI Kit: Islands"

export type ColorType = "FILL" | "STROKE" | "TEXT"

export type FoundColor = {
  hex: string
  r: number
  g: number
  b: number
  opacity: number
  nodeId: string
  nodeName: string
  colorType: ColorType
  paintIndex: number
}

export type VariableCandidate = {
  variableId: string
  variableKey: string
  variableName: string
  collectionKey: string
  collectionName: string
  hex: string
  r: number
  g: number
  b: number
  opacityPercent: number
}

export type ColorMatchResult = {
  found: FoundColor
  bestMatch: VariableCandidate | null
  diffPercent: number
  allMatches: Array<{ candidate: VariableCandidate; diffPercent: number }>
}

export type CollectionSource = {
  key: string
  name: string
  libraryName: string | null
  isLibrary: boolean
  modes: Array<{ modeId: string; modeName: string }>
}

export type FindColorMatchProgress = {
  current: number
  total: number
  message: string
}
