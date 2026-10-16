# UI Foundation and Design System Components

Accessible UI primitives, tactile buttons, badges, product cards, Radix overlays, and quantity stepper components styled with Tailwind CSS v4 OKLCH tokens.

Governed by spec [0003-design-system-and-ui-foundation](../../../docs/specs/0003-design-system-and-ui-foundation/index.md) and [design.md](../../../design.md).

## Structure

- `badge.tsx`: Artisanal tag badge supporting solid, outline, and subtle amber styles
- `button.tsx`: Polymorphic button component with asChild slot support, size scale, and tactile hover states
- `card.tsx`: Card container with header, title, description, content, and footer primitives
- `dialog.tsx`: Accessible Radix UI Dialog modal primitive with backdrop, portal, and close button
- `drawer.tsx`: Slide over drawer primitive built on Radix UI Dialog with smooth right sheet animation
- `quantity-selector.tsx`: Accessible integer stepper with increment, decrement, and min/max clamping
- `tabs.tsx`: Accessible Radix UI Tabs component with styled triggers and panels
- `index.ts`: Barrel export for all UI primitives
- `__tests__/`: Vitest component tests verifying rendering, keyboard navigation, and accessibility standards

## Rules and constraints

- Style with Tailwind CSS v4 OKLCH color tokens (`--color-amber-*`, `--color-cream-*`, `--color-charcoal-*`)
- All interactive overlays (dialogs, drawers) use Radix UI primitives with focus trapping and ESC dismissal
- Maintain accessible contrast standards (WCAG AA 4.5:1 for normal text, 3:1 for large text and UI boundaries)
- Interactive components carry the `'use client'` directive
- Motion transitions respect system `prefers-reduced-motion` settings

_Drafted by /sync from the introducing change, worth a quick human pass._
