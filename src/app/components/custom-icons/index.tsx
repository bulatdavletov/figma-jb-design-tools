import { h } from "preact"

type SvgProps = {
  color?: string
  opacity?: number
  title?: string
}

function SvgIcon16(props: SvgProps & { pathD: string }) {
  const color = props.color ?? "currentColor"
  const opacity = props.opacity ?? 0.9
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label={props.title}>
      <path d={props.pathD} fill={color} fillOpacity={opacity} />
    </svg>
  )
}

// Arrow (stroke-line style)
export function IconArrowDown16(props: SvgProps) {
  return (
    <SvgIcon16
      {...props}
      pathD="M10.8523 10.8531C11.0475 10.6579 11.0476 10.3413 10.8523 10.1461C10.6571 9.95123 10.3404 9.95108 10.1453 10.1461L7.99978 12.2926L7.99978 2.49963C7.99958 2.22366 7.7758 1.99963 7.49978 1.99963C7.22386 1.99975 6.99998 2.22373 6.99978 2.49963L6.99978 12.2926L4.85232 10.1461C4.65706 9.95123 4.34044 9.95109 4.14529 10.1461C3.95019 10.3413 3.95038 10.6579 4.14529 10.8531L7.14627 13.8531C7.34154 14.0484 7.65807 14.0484 7.8533 13.8531L10.8523 10.8531Z"
    />
  )
}
export function IconArrowUp16(props: SvgProps) {
  // up = down rotated 180
  return (
    <span style={{ display: "flex", lineHeight: 0, transform: "rotate(180deg)" }}>
      <IconArrowDown16 {...props} />
    </span>
  )
}
export function IconArrowRight16(props: SvgProps) {
  // right = down rotated -90
  return (
    <span style={{ display: "flex", lineHeight: 0, transform: "rotate(-90deg)" }}>
      <IconArrowDown16 {...props} />
    </span>
  )
}
export function IconArrowLeft16(props: SvgProps) {
  // left = down rotated 90
  return (
    <span style={{ display: "flex", lineHeight: 0, transform: "rotate(90deg)" }}>
      <IconArrowDown16 {...props} />
    </span>
  )
}

// Chevron
export function IconChevronDown16(props: SvgProps) {
  return (
    <SvgIcon16
      {...props}
      pathD="M9.76731 6.76777C9.96257 6.5725 10.2801 6.5725 10.4753 6.76777C10.6702 6.96296 10.6702 7.2796 10.4753 7.4748L7.99973 9.94941L5.52512 7.4748C5.32986 7.27953 5.32986 6.96303 5.52512 6.76777C5.72039 6.5725 6.03689 6.5725 6.23216 6.76777L7.99973 8.53534L9.76731 6.76777Z"
    />
  )
}
export function IconChevronUp16(props: SvgProps) {
  return (
    <span style={{ display: "flex", lineHeight: 0, transform: "rotate(180deg)" }}>
      <IconChevronDown16 {...props} />
    </span>
  )
}
export function IconChevronRight16(props: SvgProps) {
  return (
    <span style={{ display: "flex", lineHeight: 0, transform: "rotate(-90deg)" }}>
      <IconChevronDown16 {...props} />
    </span>
  )
}
export function IconChevronLeft16(props: SvgProps) {
  return (
    <span style={{ display: "flex", lineHeight: 0, transform: "rotate(90deg)" }}>
      <IconChevronDown16 {...props} />
    </span>
  )
}

