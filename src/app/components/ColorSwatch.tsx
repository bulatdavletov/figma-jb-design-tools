import { Fragment, h } from "preact"
import { useMemo } from "preact/hooks"

/**
 * NOTE: This component is a small extracted copy/adaptation of the
 * `@create-figma-plugin/ui` `TextboxColor` “chit” preview (checkerboard + split preview for opacity).
 *
 * Source reference in that library:
 * - `components/textbox/textbox-color/textbox-color.js` renders 1–2 `.color` children inside `.chit`
 * - `components/textbox/textbox-color/textbox-color.module.css` defines the checkerboard background
 */

const CHECKERBOARD_BG_IMAGE =
  // Copied from `textbox-color.module.css` `.chit` background-image.
  "url('data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A')"

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

function isValidHex6(color: string | null): color is string {
  if (typeof color !== "string") return false
  return /^#[0-9A-F]{6}$/i.test(color.trim())
}

function formatHexWithOpacity(hex: string, opacityPercent: number | null): string {
  if (opacityPercent == null) return hex
  if (opacityPercent >= 100) return hex
  return `${hex} ${opacityPercent}%`
}

export function ColorSwatch(props: {
  hex: string | null
  opacityPercent?: number | null
  size?: number
  borderRadius?: number
}) {
  // Defaults match `TextboxColor` `.chit` exactly (see `textbox-color.module.css`).
  const size = typeof props.size === "number" ? props.size : 14
  const borderRadius = typeof props.borderRadius === "number" ? props.borderRadius : 3

  const opacityPercent = typeof props.opacityPercent === "number" ? props.opacityPercent : null
  const alpha = opacityPercent == null ? 1 : clamp01(opacityPercent / 100)
  const showTransparency = alpha < 1

  const hex = useMemo(() => (isValidHex6(props.hex) ? props.hex.trim() : null), [props.hex])
  const title = hex ? formatHexWithOpacity(hex, opacityPercent) : "N/A"

  return (
    <div
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius,
        overflow: "hidden",
        display: "flex",
        backgroundImage: CHECKERBOARD_BG_IMAGE,
        boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      {hex ? (
        <Fragment>
          <div style={{ flex: 1, backgroundColor: hex }} />
          {showTransparency ? <div style={{ flex: 1, backgroundColor: hex, opacity: alpha }} /> : null}
        </Fragment>
      ) : null}
    </div>
  )
}

