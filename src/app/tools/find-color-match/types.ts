import type {
  ResolvedColorVariable,
  LibraryCollectionInfo,
  CollectionMode,
  LoadProgress,
} from "../int-ui-kit-library/resolve"

export type { ResolvedColorVariable, LibraryCollectionInfo, CollectionMode, LoadProgress }

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

export type VariableCandidate = ResolvedColorVariable

export type ColorMatchResult = {
  found: FoundColor
  bestMatch: VariableCandidate | null
  matchPercent: number
  allMatches: Array<{ candidate: VariableCandidate; matchPercent: number }>
}

export type CollectionSource = {
  key: string
  name: string
  libraryName: string | null
  isLibrary: boolean
  modes: CollectionMode[]
}
