import {
  IconAdjust16,
  IconFolder16,
  IconLibrary16,
  IconLink16,
  IconShapeText16,
  IconText16,
  IconVariable16,
  IconVariableColor16,
  IconPrototype16,
} from "@create-figma-plugin/ui"
import { h } from "preact"

import { IconTarget16 } from "../../custom-icons/generated"
import type { ToolRegistryEntry } from "./tools-registry"

const COMPONENTS = {
  IconAdjust16,
  IconFolder16,
  IconLibrary16,
  IconLink16,
  IconShapeText16,
  IconTarget16,
  IconText16,
  IconVariable16,
  IconVariableColor16,
  IconPrototype16,
}

export const TOOL_ICONS = Object.fromEntries(
  Object.entries(COMPONENTS).map(([name, Comp]) => [name, h(Comp as any, null)])
) as Record<ToolRegistryEntry["icon"], preact.ComponentChildren>
