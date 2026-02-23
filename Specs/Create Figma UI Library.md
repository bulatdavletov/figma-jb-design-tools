Spacings:
- extraSmall: 4px
- small: 8px
- medium: 12px
- large: 16px
- extraLarge: 32px


Problem: The Text component from @create-figma-plugin/ui uses ::before { margin-top: -9px } and transform: translateY(4px) for font-metric alignment. This compressed layout heights (20px to 12px, 16px to 8px) and made text fill each box edge-to-edge, rendering the 4px flex gap invisible.
Fix: Replaced the library's Text component with plain <div> elements in two files:
src/app/components/DataRow.tsx — for primary/secondary/tertiary/alert text
src/app/views/print-color-usages-tool/PrintColorUsagesToolView.tsx — for print preview rows
Also removed the now-unnecessary overflow: hidden wrappers and reduced the explicit gap from 4px to 2px (natural line-height provides sufficient breathing room).
Key pattern to remember: Avoid using the library's Text component when vertical spacing between stacked text items matters.


## Stack vs VerticalSpace — never nest together

`Stack` and `VerticalSpace` are two alternative ways to add vertical spacing. **Never use VerticalSpace inside a Stack** — it causes double spacing.

**How Stack works:** Wraps each child in a `.child` div and adds `margin-top` to every child except the first.
```css
.small > .child:not(:first-child) { margin-top: var(--space-small); }
```

**How VerticalSpace works:** Renders an empty div with a fixed `height`.
```css
.small { height: var(--space-small); }
```

**The bug:** When VerticalSpace is inside a Stack, you get margin-top (from Stack) + height (from VerticalSpace) = double the intended gap.

**Rule:**
- Use `Stack` when you want uniform spacing between a group of children (preferred).
- Use `VerticalSpace` only in non-Stack contexts where you need manual spacing between specific elements.
- Mixing them always produces larger gaps than intended.