---
name: honey-artisanal-design-system
source: derived
character: "Warm artisanal luxury, tactile editorial warmth, and raw honey elegance. Single origin authenticity paired with disciplined typography and viscous fluid micro interactions."
tokens: "real values live in the project styling system (src/app/globals.css); read them there, never duplicated here"
contrast: "charcoal on cream 14.2:1 (Pass AAA); amber-800 on cream 6.1:1 (Pass AA); amber-700 on cream 4.6:1 (Pass AA); gold on charcoal 9.5:1 (Pass AAA); amber-200 on cream 3.2:1 (Pass non text)"
---

## Build mandate

You are a senior product designer. Every page ships as a complete, professional product surface: brand, real product specific copy, a considered layout with hierarchy, all states (empty, loading, error), supporting content, and a footer where the page warrants one. Maximalist, never a lone form on an empty page.

## Character & direction

The Honey visual identity evokes the quiet dignity of slow harvest apiculture and single origin raw honey. The palette relies on unbleached cream canvas, deep charcoal typography, and amber nectar accents. Cormorant Garamond gives voice to editorial titles with historical grace. Plus Jakarta Sans maintains clean, legible authority across interface controls and tasting descriptions. Micro interactions mimic the physical viscosity of honey with custom cubic bezier easing, while honoring user preferences for reduced motion.

## Composition patterns

Storefront pages follow a disciplined editorial rhythm:
- Header and navigation: minimal floating bar with wordmark, origin story link, catalog link, and interactive cart count trigger.
- Hero canvas: cinematic full height viewport featuring high frame rate scroll scrubbing, bold typography, and immediate action triggers.
- Editorial narrative: two column split layouts balancing close up harvest photography with tasting profiles and floral origin charts.
- Commerce grid: cards framed by warm borders with product badges, volume selectors, and tactile add to cart buttons.
- Cart drawer: right slide overlay sheet locking body scroll, featuring line items, quantity steppers, shipping notes, and receipt triggers.
- Footer: dark charcoal foundation with apiculture certifications, sustainability standards, and email newsletter enrollment.

## Component & usage rules (do's and don'ts)

### Do
- Use semantic OKLCH tokens defined in `src/app/globals.css` for all background, foreground, border, and focus states.
- Pair Cormorant Garamond for display titles with Plus Jakarta Sans for body text, forms, and interactive controls.
- Maintain a minimum 44 by 44 pixel touch target area on all interactive controls on touch screens.
- Provide visible 2px amber-800 focus rings with 2px offset on every keyboard accessible control.
- Enforce minimum 4.5:1 contrast for body copy and 3:1 for borders and control indicators.
- Use viscous easing curves (`var(--ease-viscous)`) for drawer slides and modal transitions.

### Don'ts
- Do not use harsh synthetic black (`#000000`) or pure blue tones that conflict with warm natural honey.
- Do not float naked forms or lone buttons without contextual brand copy and surrounding structure.
- Do not rely on color alone to convey validation status or inventory availability.
- Do not render generic placeholder text or dummy lorem ipsum.
- Do not animate transitions when `prefers-reduced-motion` is active.

## Responsive & accessibility direction

- Mobile first layout structure starting from 360px viewports up to 1440px wide screens.
- Stable scrollbar gutter (`scrollbar-gutter: stable`) to prevent horizontal layout shift during modal and drawer display.
- Radix UI accessibility primitives provide keyboard tab trapping, escape key dismissal, and ARIA relationships.
- Visually hidden dialog titles ensure screen reader compliance for minimalist overlay headers.
- Quantity selectors include live regions (`aria-live="polite"`) announcing increment and decrement updates.

## Component contracts

- `Button`: Polymorphic interactive trigger supporting `asChild` for Next.js links, variants (`primary`, `secondary`, `outline`, `ghost`, `link`), sizes (`sm`, `md`, `lg`, `icon`), and tactile active press.
- `Badge`: Metadata pill for harvest years, tasting profiles, and single origin seals with variants (`amber`, `cream`, `outline`, `gold`).
- `Card`: Semantic container composed of `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` with subtle amber borders and warm ambient shadows.
- `QuantitySelector`: Controlled numeric stepper bounded by minimum 1 and maximum 10 values, accessible touch targets, and assistive live updates.
- `Drawer`: Slide over sheet anchored to the right viewport edge (`w-full sm:max-w-md z-50`) with backdrop blur and escape dismissal.
- `Dialog`: Accessible centered modal dialog with background focus trapping and dismiss action.
- `Tabs`: Unstyled Radix navigation tabs for floral categories and harvest notes.
