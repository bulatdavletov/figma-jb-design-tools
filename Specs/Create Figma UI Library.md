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