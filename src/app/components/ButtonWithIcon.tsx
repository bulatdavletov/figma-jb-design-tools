import { Button, type ButtonProps } from "@create-figma-plugin/ui"
import { h } from "preact"

export function ButtonWithIcon(
  props: Omit<ButtonProps, "children"> & {
    icon: preact.ComponentChildren
    children: preact.ComponentChildren
  }
) {
  const { icon, children, ...buttonProps } = props
  return (
    <Button {...buttonProps}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            display: "flex",
            width: 16,
            height: 16,
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0, // prevent inline baseline offsets
          }}
        >
          {icon}
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>{children}</span>
      </span>
    </Button>
  )
}

