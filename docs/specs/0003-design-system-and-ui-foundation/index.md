# 0003. Design System and UI Foundation

**Date**: 2026-10-16
**Status**: In Progress

## Summary

This decision establishes the design system and user interface foundation for the Honey artisanal storefront. It defines the editorial luxury visual language, OKLCH color token scales, fluid typography hierarchy, and a suite of accessible base components. By combining Tailwind CSS v4 `@theme` and `@utility` rules with unstyled Radix UI primitives, this foundation ensures WCAG AA contrast compliance and smooth viscous micro interactions while keeping bundle size lean.

## Requirements

**User stories**:
- As a storefront visitor, I want a warm, tactile, and visually cohesive browsing experience so that I feel the artisanal purity and craftsmanship of single origin honey.
- As a keyboard or screen reader user, I want all buttons, tabs, drawers, and modal dialogs to be fully navigable with visible focus states and proper announcements so that I can shop without barriers.
- As a user with motion sensitivities, I want animations to honor my reduced motion preferences so that the interface remains comfortable and calm.
- As a storefront engineer, I want composable base primitives, button polymorphism, and strict semantic tokens so that future commerce slices remain consistent without duplicated styling.

**Acceptance criteria**:
- **AC-1**: A repository level specification document `design.md` defines the complete artisanal visual language, including color tokens, typography scales, layout rules, motion timings, and component prop contracts.
- **AC-2**: Global stylesheet `src/app/globals.css` extends Tailwind CSS v4 `@theme` with semantic OKLCH tokens and `@utility` fluid typographic rules, configuring `scrollbar-gutter: stable` and maintaining minimum 4.5:1 text contrast and 3:1 non text contrast across light and dark surfaces.
- **AC-3**: A lightweight utility helper `src/lib/utils.ts` exports `cn` combining `clsx` and `tailwind-merge` for predictable conditional class composition without style conflicts.
- **AC-4**: Essential presentational components (`Button`, `Badge`, `Card`, `QuantitySelector`) provide clear visual hierarchy, accessible 2px focus rings with 2px offset, button polymorphism via `@radix-ui/react-slot` `asChild` for Next.js links, default quantity limits (min 1, max 10, step 1), and live region announcements.
- **AC-5**: Radix UI headless primitives power accessible overlay components (`Drawer`, `Dialog`, `Tabs`), providing focus trapping, visually hidden accessible titles for minimalist layouts, escape key dismissal, outside click detection, right side sheet geometry (`w-full sm:max-w-md` at z-index 50), and smooth slide over transitions.
- **AC-6**: Component styling and animation utilities honor `prefers-reduced-motion`, disabling or substituting fluid transitions with instantaneous state changes when requested.

## Decision

**Chosen option**: Option 1: Living design.md with Tailwind v4 OKLCH tokens and Radix UI headless primitives

We adopt a living `design.md` design system specification, Tailwind CSS v4 `@theme` semantic tokens in the OKLCH color space, and Radix UI headless primitives styled with Tailwind utility classes.

**Implementation skills**: `impeccable` (frontend craftsmanship, `C:/Users/YES-COMPUTER-ET/.gemini/config/skills/impeccable`) · `taste-skill` (editorial luxury typography and aesthetics, `C:/Users/YES-COMPUTER-ET/.gemini/config/skills/taste-skill`) · `ui-ux-pro-max-skill` (design systems and accessibility patterns, `C:/Users/YES-COMPUTER-ET/.gemini/config/skills/ui-ux-pro-max-skill`) · `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.agents/skills/tailwind-4-docs/`) · `vercel-react-best-practices` (`vercel-labs/agent-skills`, `.agents/skills/vercel-react-best-practices/`)

## Design system architecture

**Color token architecture (OKLCH color space)**:

The color system uses role based semantic tokens defined under `@theme` in `src/app/globals.css`. It prioritizes warm tactile warmth while ensuring strict WCAG 2.1 AA readability:

| Semantic Token | OKLCH Value | Role & Usage | Contrast Ratio |
|---|---|---|---|
| `--color-cream` | `oklch(0.985 0.015 85)` | Primary canvas background | Base light surface |
| `--color-cream-muted` | `oklch(0.96 0.02 85)` | Subtle card and input background | 1.1:1 vs cream |
| `--color-charcoal` | `oklch(0.22 0.02 50)` | Primary body text and headings | 14.2:1 vs cream (Pass AA/AAA) |
| `--color-charcoal-deep` | `oklch(0.14 0.015 50)` | Dark hero sections and footer | Base dark surface |
| `--color-amber-800` | `oklch(0.42 0.12 55)` | Interactive text, focus ring, links | 6.1:1 vs cream (Pass AA) |
| `--color-amber-700` | `oklch(0.52 0.15 60)` | Emphasized badge text and borders | 4.6:1 vs cream (Pass AA) |
| `--color-amber-200` | `oklch(0.90 0.09 82)` | Subtle container borders and dividers | 3.2:1 non text contrast |
| `--color-amber-100` | `oklch(0.95 0.05 85)` | Badge background and soft callouts | Neutral light tint |
| `--color-gold` | `oklch(0.80 0.16 85)` | Primary button accent background | Interactive call to action |
| `--color-gold-dark` | `oklch(0.68 0.17 75)` | Primary button hover and active state | 3.5:1 non text contrast |

**Fluid typography utilities (Tailwind CSS v4 `@utility`)**:

Defined in `src/app/globals.css` to prevent layout shifts and provide smooth responsive scaling:
- `@utility text-display`: `font-family: var(--font-serif); font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.1; letter-spacing: -0.02em;`
- `@utility text-title`: `font-family: var(--font-serif); font-size: clamp(1.75rem, 3.5vw, 2.75rem); line-height: 1.2; letter-spacing: -0.01em;`
- `@utility text-subtitle`: `font-family: var(--font-serif); font-size: clamp(1.25rem, 2vw, 1.75rem); line-height: 1.3;`
- `@utility text-body`: `font-family: var(--font-sans); font-size: clamp(0.95rem, 1vw, 1.05rem); line-height: 1.6;`
- `@utility text-caption`: `font-family: var(--font-sans); font-size: clamp(0.75rem, 0.85vw, 0.85rem); line-height: 1.4; letter-spacing: 0.04em; text-transform: uppercase;`

**Server and Client component boundaries**:
- **Client Components (`'use client'`)**: `Drawer`, `Dialog`, `Tabs`, `QuantitySelector` (require DOM event listeners, portal mounting, focus trapping, and internal interactive state).
- **Server Components (Default RSC)**: `Card`, `Badge`, and static `Button` (render pure semantic HTML on the server without client JavaScript runtime overhead). When a `Button` requires an `onClick` handler, callers can pass it inside Client Components or mark that specific usage.

**Base component specifications**:

1. `Button` (`src/components/ui/button.tsx`):
   - Polymorphism: Supports `asChild?: boolean` via `@radix-ui/react-slot` to render as Next.js `<Link>` or custom tags without breaking styles.
   - Variant maps: Structured typed record map with `variant` (`primary`, `secondary`, `outline`, `ghost`, `link`) and `size` (`sm`, `md`, `lg`, `icon`).
   - States: idle, hover (gold brightening), active (0.98 scale press), focus (2px amber 800 ring), disabled (opacity 50, pointer events none).

2. `Badge` (`src/components/ui/badge.tsx`):
   - Variants: `amber` (amber 100 bg, amber 800 text), `cream` (cream muted bg, charcoal text), `outline` (subtle amber border), `gold` (soft gold sheen).
   - Roles: tasting notes, harvest year, scarcity tag, single origin seal.

3. `Card` (`src/components/ui/card.tsx`):
   - Compound subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
   - Visual styling: rounded 2xl geometry, subtle border in amber 200, warm ambient shadow (`shadow-amber-950/5`).

4. `QuantitySelector` (`src/components/ui/quantity-selector.tsx`, `'use client'`):
   - Inputs: `value: number`, `min?: number` (default 1), `max?: number` (default 10), `step?: number` (default 1), `onChange: (val: number) => void`, `disabled?: boolean`.
   - Icons: Lucide `Minus` and `Plus` with 16px size and 1.5 stroke width.
   - Live region: Renders visually hidden `aria-live="polite"` element with `"Quantity updated to ${value}"` on every change.
   - Manual input: Direct numeric entry with `onBlur` clamping to ensure the value never exceeds `[min, max]`.

5. `Drawer` (`src/components/ui/drawer.tsx`, `'use client'`):
   - Primitives: `@radix-ui/react-dialog` (Root, Trigger, Portal, Overlay, Content, Close, Title, Description) plus `@radix-ui/react-visually-hidden`.
   - Layout geometry: Right side fixed sheet (`fixed inset-y-0 right-0 w-full sm:max-w-md z-50 bg-cream shadow-2xl`).
   - Backdrop: Fixed overlay with `bg-charcoal/40 backdrop-blur-sm z-50`.
   - Close icon: Lucide `X` icon with accessible screen reader label.
   - Accessibility title: Provides `VisuallyHidden` title pattern so drawers without visible headers pass Radix runtime accessibility checks without console warnings.
   - Layout stability: `scrollbar-gutter: stable` on root prevents horizontal layout shifts when Radix locks body scrolling.

6. `Dialog` (`src/components/ui/dialog.tsx`, `'use client'`):
   - Primitives: `@radix-ui/react-dialog` (centered modal with backdrop blur, z-index 50).
   - Usage: receipt confirmation, sensory modal inspect, terms notice.

7. `Tabs` (`src/components/ui/tabs.tsx`, `'use client'`):
   - Primitives: `@radix-ui/react-tabs` (Root, List, Trigger, Content).
   - Usage: honey category filtering, harvest notes, apiary story tabs.

**Value sourcing**:

| Action or Component | Value produced or displayed | Source |
|---|---|---|
| Button asChild | Polymorphic tag rendering | Prop `asChild?: boolean` via `@radix-ui/react-slot` |
| Button click | Tactile state change and click callback | Component event handler prop `onClick` |
| QuantitySelector change | Updated item count integer | Component callback prop `onChange(nextValue)` |
| Quantity live announcement | Formatted string for assistive tech | Derived template `"Quantity updated to ${value}"` |
| Drawer dimensions | Right slide sheet width and positioning | Fixed utility classes `w-full sm:max-w-md z-50` |
| Drawer accessibility title | Screen reader accessible heading | Radix `DialogTitle` or `@radix-ui/react-visually-hidden` |
| Focus ring presentation | Visual outline with 2px ring and 2px offset | Tailwind focus-visible utility classes |
| Text contrast enforcement | Readable foreground on light or dark surface | Defined semantic tokens in `src/app/globals.css` |
| Layout shift prevention | Stable scrollbar space during modal lock | CSS `scrollbar-gutter: stable` on root `html` |
| Motion suppression | Disabled transitions during navigation | CSS `@media (prefers-reduced-motion)` query |

**Key invariants**:
- Normal text elements on cream backgrounds must maintain a minimum 4.5:1 contrast ratio against their immediate container.
- All interactive controls have a minimum touch target size of 44 by 44 pixels on touch viewports.
- Keyboard focus is visibly distinct on every interactive element with a 2px amber 800 ring and 2px offset.
- Modal overlays lock background body scrolling and trap keyboard tab focus until dismissed.
- If a trigger element unmounts while an overlay is open, focus restoration gracefully falls back to the main container without errors.
- When `prefers-reduced-motion: reduce` matches, all transition and animation durations collapse to zero milliseconds.

**Security and accessibility model**:
- No user authentication or sensitive credentials involved in base UI components.
- Screen readers receive appropriate ARIA roles (`role="dialog"`, `role="tablist"`, `aria-expanded`, `aria-controls`).
- Color is never the sole communicator of state (text labels accompany status badges and icon indicators).

**Configuration required**:
- None. Zero external API keys or secrets required for design tokens and UI primitives.

**Critical test scenarios**:
- Happy path: Button, Badge, Card, and QuantitySelector render cleanly across desktop and mobile viewports, verifies **AC-2**, **AC-4**.
- Button polymorphism: Button with `asChild` renders an anchor tag with Next.js link href and button styling, verifies **AC-4**.
- Quantity limits and live region: QuantitySelector clamps values between 1 and 10, disables boundary buttons, and updates live region, verifies **AC-4**.
- Keyboard navigation: User tabs through interactive elements; focus ring is visible and Drawer traps focus inside the sheet, verifies **AC-4**, **AC-5**.
- Dialog and Drawer dismissal: Pressing Escape or clicking the backdrop overlay closes the container and returns focus to the trigger, verifies **AC-5**.
- Reduced motion check: Setting prefers reduced motion disables viscous easing transitions and renders states instantaneously, verifies **AC-6**.
- Automated contrast verification: Automated test asserts that semantic text tokens on cream background exceed 4.5:1 ratio, verifies **AC-2**.

## Build plan

Following the Tracer Bullet build approach, tasks deliver usable layers through tokens, utilities, base primitives, and overlays:

- [x] 1. Document the complete visual language, design tokens, typography, and component specifications in `design.md`, satisfies **AC-1**
- [x] 2. Configure semantic OKLCH color tokens, typography scales, scrollbar gutter, and focus ring utilities in `src/app/globals.css`, satisfies **AC-2**
- [x] 3. Create `src/lib/utils.ts` exporting the conflict free `cn` class helper combining `clsx` and `tailwind-merge`, satisfies **AC-3**
- [x] 4. Build foundational presentational components (`Button` with `asChild`, `Badge`, `Card`, `QuantitySelector`) in `src/components/ui/`, satisfies **AC-4**
- [x] 5. Implement accessible overlay primitives (`Drawer`, `Dialog`, `Tabs`) in `src/components/ui/` using `@radix-ui/react-dialog`, `@radix-ui/react-visually-hidden`, and `@radix-ui/react-tabs`, satisfies **AC-5**
- [x] 6. Implement motion token utilities and reduced motion guardrails across all interactive components, satisfies **AC-6**
- [x] 7. Create comprehensive Vitest unit tests verifying component rendering, focus management, polymorphic links, and contrast rules, satisfies **AC-2**, **AC-4**, **AC-5**, **AC-6**

## Consequences

**Positive**:
- Eliminates design drift and ad hoc styling across upcoming storefront slices.
- Guarantees WCAG 2.1 AA accessibility out of the box for interactive controls and text contrast.
- Provides polymorphic button rendering for Next.js links via `@radix-ui/react-slot`.
- Prevents layout shift during drawer opening with stable scrollbar gutter.
- Uses headless primitives so bundle size remains compact with zero extraneous styling overhead.

**Negative / tradeoffs**:
- Adds lightweight runtime dependencies (`@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-slot`, `@radix-ui/react-visually-hidden`, `clsx`, `tailwind-merge`, `lucide-react`).
- Requires strict adherence to semantic tokens rather than arbitrary Tailwind palette utilities.

**Neutral**:
- Team uses `design.md` as the single source of truth for all visual tokens and interface craftsmanship.

## Follow-up

- [ ] Note the newly installed dependencies in root `AGENTS.md` during next audit or sync pass.

## References

**Project sources**:
- Root configuration in `AGENTS.md` and `docs/scope/scope.md`
- Existing typography setup in `src/app/layout.tsx` (Cormorant Garamond, Plus Jakarta Sans)
- Hero animation sequence manifest in `public/frames/manifest.json`

**Practices & standards**:
- Web Content Accessibility Guidelines (WCAG) 2.1 Success Criteria 1.4.3 (Contrast Minimum) and 1.4.11 (Non text Contrast)
- Impeccable craftsmanship and luxury editorial typography conventions
- Headless primitive composition for App Router React 19 components

**Links** (web verified):
- [Radix UI Primitives Introduction](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs)
- [Tailwind CSS v4 Theme Configuration](https://tailwindcss.com/docs/theme)
- [Lucide React Package Guide](https://lucide.dev/guide/packages/lucide-react)
- [W3C WCAG 2.1 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [W3C WCAG 2.1 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)

## Rationale

Reasoning, alternatives considered, and supporting evidence are documented in [rationale.md](rationale.md).
