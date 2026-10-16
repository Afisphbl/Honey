# Verify: Design System and UI Foundation · spec 0003 · updated 2026-10-16
_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Render `Button` with default and custom variants (`primary`, `secondary`, `outline`, `ghost`, `link`) → verify color styling, hover brighten, 0.98 active press scale, and 44px touch target → AC-4
- [x] Render `Button` with `asChild` wrapping an anchor tag → verify anchor tag renders with href and button styling → AC-4
- [x] Render `Badge` with variants (`amber`, `cream`, `outline`, `gold`) → verify contrast and visual badges for tasting descriptors → AC-4
- [x] Render `Card` with header, title, description, content, and footer → verify rounded 2xl border, warm shadow, and typography → AC-4
- [x] Test `QuantitySelector` stepper → click plus and minus, verify value increments or decrements within [1, 10] range, and bounds disable controls → AC-4
- [x] Type numeric value into `QuantitySelector` and blur → verify input clamps to range and live region announces update → AC-4
- [x] Open `Drawer` sheet → verify right side sheet animation (`w-full sm:max-w-md`), backdrop blur, VisuallyHidden title fallback, escape key and close button dismissal → AC-5
- [x] Open `Dialog` modal → verify centered modal, focus trapping, backdrop blur, and dismiss action → AC-5
- [x] Select tabs in `Tabs` → verify switching between panels and keyboard navigation → AC-5
- [x] Enable `prefers-reduced-motion` in browser or system settings → verify all transitions and transform scalings collapse to 0ms → AC-6

## Commands
- [x] `npm test` → all unit tests pass across test files → AC-2, AC-4, AC-5, AC-6
- [x] `npx eslint src/components/ui` → passes with 0 errors and 0 warnings → AC-3, AC-4, AC-5
- [x] `npx tsc --noEmit` → TypeScript compiler completes with 0 errors → AC-3, AC-4, AC-5
- [x] `npm run build` → Next.js production build succeeds with static and dynamic routes compiled → AC-2, AC-3

## Acceptance-criteria coverage
- AC-1 (Design specification) covered by visual system specification in design.md
- AC-2 (Tailwind v4 OKLCH tokens and fluid typography) covered by npm test and token verification tests
- AC-3 (Class merging helper cn) covered by utils tests and build passing
- AC-4 (Interactive primitives Button, Badge, Card, QuantitySelector) covered by button, badge, card, and quantity selector tests
- AC-5 (Accessible Radix overlays Drawer, Dialog, Tabs) covered by overlay tests and manual verification steps
- AC-6 (Motion token utilities and reduced motion guardrails) covered by reduced motion assertions and manual verification steps
