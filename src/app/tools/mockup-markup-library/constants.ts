/**
 * Hardcoded IDs, keys, and name candidates for the "Mockup markup" library.
 * Single source of truth — used by Print Color Usages and Mockup Markup tools.
 */

export const MARKUP_LIBRARY_NAME = "Mockup markup"

// ---------------------------------------------------------------------------
// Color variables
// ---------------------------------------------------------------------------

export const MARKUP_COLOR_VARIABLE_RAW_IDS = {
  text: "VariableID:35e0b230bbdc8fa1906c60a25117319e726f2bd7/1116:1",
  textSecondary: "VariableID:84f084bc9e1c3ed3add7febfe9326d633010f8a2/1260:12",
  purple: "VariableID:cefb32503d23428db2c20bac7615cff7b5feab07/1210:6",
} as const

export const MARKUP_COLOR_VARIABLE_NAME_CANDIDATES: Record<keyof typeof MARKUP_COLOR_VARIABLE_RAW_IDS, string[]> = {
  text: ["markup-text", "Markup Text", "Text"],
  textSecondary: ["markup-text-secondary", "Markup Text Secondary", "Text Secondary", "Markup Text secondary", "Text secondary"],
  purple: ["markup-text-purple", "Markup Purple", "Purple"],
}

// ---------------------------------------------------------------------------
// Text styles
// ---------------------------------------------------------------------------

export const MARKUP_TEXT_STYLE_IDS = {
  h1: "S:3e9bacca6574fd3bb647bc3f3fec124903d58931,1190:2",
  h2: "S:d8f137455e6ade1a64398ac113cf0a49c2991ff6,1190:1",
  h3: "S:a7abb8bbbf3b902fa8801548a013157907e75bc2,1260:33",
  description: "S:d8195a8211b3819b1a888e4d1edf6218ff5d2fd5,1282:7",
  paragraph: "S:a6d1706e317719d0750eae3655a3b4360ad2b9ef,1260:39",
} as const
