# 0004. Core Storefront Loop and Scroll Hero

**Date**: 2026-10-16
**Status**: Accepted

## Summary

This decision establishes the full screen storefront hero sequence and interactive scroll scrubber for Honey. The canvas expands across the entire header section and viewport, letting visitor scroll scrub through 150 extraction frames without distracting frame number badges. A transparent editorial navigation header floats at the top, while the featured Raw Wildflower Reserve buy box and tasting notes sit directly below the full canvas stage. Adding a jar variant updates the persistent client cart, updates the header count, and opens the cart drawer smoothly.

## Requirements

**User stories**:
- As a storefront visitor, I want the extraction animation to fill the entire header viewport so that I can immerse myself in the raw honey harvest visuals without visual clutter.
- As a storefront visitor, I want the frame number to remain hidden so that the experience feels like a pure cinematic presentation rather than a technical widget.
- As a storefront visitor, I want to scrub through 150 animation frames smoothly as I scroll through the hero section.
- As a customer, I want to scroll down from the full screen hero into the featured reserve buy box and choose jar sizes with immediate price feedback.
- As a customer, I want clicking Add to Cart to give instant feedback and open my cart drawer with my selected jar and subtotal.
- As a visitor who prefers reduced motion, I want a static poster view without forced scroll scrubbing, alongside an accessible manual slider without distracting counter text.
- As an engineer, I want browser memory bounded under 80MB and 60fps rendering so that mobile devices and laptops never stutter.

**Acceptance criteria**:
- **AC-1**: The storefront home page features a full screen canvas hero stage that spans the entire viewport width and height at the top of the page, beneath a floating transparent navigation header bar with backdrop blur. The featured product buy box and tasting notes sit in dedicated editorial sections positioned immediately below the full canvas hero stage.
- **AC-2**: A 300vh scroll track container drives interactive frame progression across all 150 WebP frames in `public/frames/`, synchronized smoothly at 60fps via a custom `useScrollFrame` hook using `requestAnimationFrame` with lerp damping and passive scroll listening.
- **AC-3**: Memory and canvas performance safeguards keep browser memory bounded under 80MB by loading the initial window (frames 1 to 16) eagerly and subsequent windows on demand, clamping device pixel ratio at 2, and cleaning up animation frames and canvas context on unmount.
- **AC-4**: The canvas overlay completely omits any visible frame progression number pills or index text (such as "001 / 150"), presenting an uncluttered cinematic visual sequence. When `prefers-reduced-motion` is enabled, the canvas displays the static poster frame without forced scroll scrubbing, accompanied by an accessible manual scrubber slider control without prominent frame numbering.
- **AC-5**: The featured honey buy box displays the primary showcase product (`Raw Wildflower Reserve`) with reactive variant selector buttons for 250g and 500g jars, updating unit price, compare at price, and savings badge dynamically without layout shift.
- **AC-6**: Clicking Add to Cart with a selected quantity (1 to 10) persists the line item into the Zustand store, triggers an optimistic cart badge update in the sticky editorial navigation header, and automatically opens the slide over cart `Drawer` displaying line items, subtotal, and free shipping progress.

## Decision

**Chosen option**: Option 2: Full screen canvas hero stage with floating transparent header, scroll scrubbed frames without counter numbers, and sequential buy box below

We build a full screen canvas hero stage taking the entire viewport width and height at the top of the page. The sticky storefront navigation header floats transparently above it with backdrop blur. As the visitor scrolls, 150 animation frames scrub smoothly via `requestAnimationFrame` without displaying frame numbers, and the featured reserve buy box and sensory tasting notes follow immediately below.

**Implementation skills**: `impeccable` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/impeccable`) · `taste-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/taste-skill`) · `ui-ux-pro-max-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/ui-ux-pro-max-skill`) · `tailwind-4-docs` (`.agents/skills/tailwind-4-docs/`) · `zustand` (`.agents/skills/zustand/`) · `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)

## Feature design

**Data model sketch**:
The storefront hero and loop consume existing domain structures from spec 0002 and client state stores:

- `ProductWithRelations`: `id`, `slug`, `title`, `subtitle`, `description`, `origin`, `tastingProfile`, `variants`. Sourced from `getFeaturedProduct()` in `src/lib/catalog/queries.ts`.
- `ProductVariant`: `id`, `productId`, `sku`, `title`, `weightOz`, `weightGrams`, `priceCents`, `compareAtPriceCents`, `isDefault`. Sourced from `src/lib/catalog/data.ts`.
- `CartItem`: `id` (`${productId}-${variantId}`), `productId`, `variantId`, `title`, `variantTitle`, `unitPriceCents`, `weightOz`, `quantity`, `imageUrl`. Managed in `useCartStore`.
- `HeroScrubberState` (ephemeral client state in `useScrollFrame`):
  - `currentFrame`: number (1 to 150)
  - `targetFrame`: number (1 to 150)
  - `progress`: number (0.0 to 1.0)
  - `isReducedMotion`: boolean
  - `isLoaded`: boolean

**State transitions**:
1. Full screen hero scroll sequence:
   - `idle` (top of page, frame 1, full screen canvas visible under floating header) -> `scrubbing` (user scrolling container, frames 1..150 via lerp, no frame numbers shown) -> `complete` (bottom of scroll track, frame 150) -> `scrolled_past` (content scrolls up to reveal buy box and tasting notes)
2. Buy box interaction:
   - `variant_selected` (250g or 500g chosen) -> `quantity_updated` (stepper clamped 1..10) -> `adding_to_cart` (button active state) -> `drawer_open` (cart drawer slides out, line item displayed)
3. Reduced motion state:
   - `reduced_motion_detected` -> `static_poster_shown` -> `manual_slider_dragged` (user scrubs timeline slider directly without number pill)

**API surface**:
The hero loop operates on pure client side interactions with static catalog queries and persistent Zustand state:

| Surface | Type | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `getFeaturedProduct()` | Server / Client query | none | `ProductWithRelations` | public | returns null if missing |
| `useScrollFrame()` | React hook | `containerRef`, `totalFrames: 150` | `frameIndex`, `progress`, `isReducedMotion` | public | out of bounds clamp |
| `useCartStore.getState().addItem()` | Client action | `CartInputItem`, `quantity` | updates state, recalculates totals | public | clamps quantity to 10 |
| `useCartStore.getState().toggleCart()` | Client action | `open: boolean` | updates `isOpen` | public | none |

**Value sourcing**:
Every value displayed or produced by this feature is traced directly to an authoritative source:

| Action | Value produced / displayed | Source |
|---|---|---|
| Render canvas frame | Active frame number (1 to 150) | Derived in `useScrollFrame` from container scroll progress |
| Scale canvas drawing | Canvas width and height in device pixels | Bounding rect of canvas element multiplied by clamped DPR (max 2) |
| Display product info | Title, subtitle, description, origin, batch | Loaded from `getFeaturedProduct()` in `src/lib/catalog/queries.ts` |
| Display variant options | Variant titles ("250g Artisanal Tasting Jar"), weights | `product.variants` from `src/lib/catalog/data.ts` |
| Display variant pricing | Price ($34.00, $58.00) and compare at price | `selectedVariant.priceCents` and `compareAtPriceCents` |
| Calculate discount badge | "Save 15%" badge text | Derived from `(compareAtPriceCents - priceCents) / compareAtPriceCents` |
| Add item to cart | Cart item identifier | Formatted as `${product.id}-${selectedVariant.id}` |
| Update cart line item | Item title, unit price, weight, quantity | Derived from selected product, selected variant, and stepper state |
| Render cart counter | Total count pill in header | Derived from `useCartStore.getState().getTotalItems()` |
| Render cart subtotal | Subtotal amount in cart drawer | Calculated by `calculateOrderTotals` from `src/lib/catalog/pricing.ts` |
| Free shipping progress | Shipping indicator ("Free Shipping unlocked" or "$X away") | Derived from `5000 - subtotalCents` threshold in `pricing.ts` |

**Key invariants**:
- Frame indices are strictly clamped integers between 1 and 150.
- No frame number counter pill or index text is rendered on the canvas overlay.
- Canvas device pixel ratio is strictly capped at 2 via `getClampedDevicePixelRatio(2)` to protect mobile GPU memory.
- Browser memory consumption for cached frames must remain strictly under 80MB.
- The sticky navigation header remains accessible above the full screen hero with `z-50` stacking and translucent backdrop blur.
- Variant quantities are clamped between 1 and 10 jars per addition.
- Total cart items cannot exceed 30 jars total.
- Prices are always calculated and persisted as positive integer cents.
- Reduced motion preference is checked before initiating scroll frame listeners.

**Security model**:
- All storefront browsing, frame scrubbing, and cart manipulation actions are public and client side.
- No personal data or financial credentials are collected in this vertical slice.
- Local storage persistence for cart items is validated with Zod runtime schemas on load.

**Configuration required**:
- None. All assets live under `public/frames/` and catalog data is statically bundled.

**Critical test scenarios**:
- Happy path: Visitor arrives at full screen canvas hero beneath floating header, scrolls through 300vh track, frames scrub from 1 to 150 without any visible frame number pills, scrolls down into buy box, selects 500g jar, clicks Add to Cart, cart drawer opens showing 500g jar at $58.00, and header badge reads 1, verifies **AC-1**, **AC-2**, **AC-4**, **AC-5**, **AC-6**.
- Reduced motion fallback: Visitor with `prefers-reduced-motion` enabled loads page, sees static poster frame without scroll scrub, adjusts manual slider without frame index text, and canvas draws matching frame, verifies **AC-4**.
- Memory and frame bounding: Rapid scrolling up and down does not leak memory or exceed 80MB, and sliding window evicts out of range frames, verifies **AC-3**.
- Variant and pricing switching: Toggling between 250g and 500g jars in the sequential buy box updates price display from $34.00 to $58.00 and adjusts compare at savings indicator, verifies **AC-5**.
- Layout continuity: Full viewport canvas stage smoothly releases sticky pinning when the 300vh track ends, letting the buy box and story sections scroll naturally into view, verifies **AC-1**.

## Build plan

Following the Tracer Bullet build approach (standing up an end to end vertical thread through every layer first, then polishing), the implementation steps are:

- [x] 1. Update the sticky storefront navigation header `src/components/layout/storefront-header.tsx` to support a floating transparent overlay mode with backdrop blur and border styling, satisfies **AC-1**.
- [x] 2. Update the canvas hero component `src/components/hero/hero-canvas-scrubber.tsx` to expand full screen, remove the frame number counter pill (`001 / 150`), and preserve memory bounds and DPR clamping, satisfies **AC-1**, **AC-3**, **AC-4**.
- [x] 3. Update the hero container `src/components/hero/storefront-hero-section.tsx` and home page `src/app/page.tsx` to establish a full viewport canvas stage over the 300vh track, followed immediately by the featured reserve buy box and story sections, satisfies **AC-1**, **AC-2**, **AC-5**.
- [x] 4. Refine the reduced motion controls in `HeroCanvasScrubber` to provide clean manual scrubbing without visible number indicators, satisfies **AC-4**.
- [x] 5. Verify the complete vertical loop from full screen canvas scrub to variant selection and cart drawer opening in `src/components/cart/cart-drawer.tsx`, satisfies **AC-5**, **AC-6**.
- [x] 6. Update and expand Vitest tests in `src/components/hero/__tests__/` and `src/app/__tests__/page.test.tsx` to verify the full screen layout, absence of frame number pills, and end to end cart interaction, satisfies **AC-1**, **AC-2**, **AC-4**, **AC-5**, **AC-6**.

## Consequences

**Positive**:
- Creates an immersive, cinematic visual entrance where raw honey viscosity fills the entire viewport.
- Eliminates distracting frame numbers for a luxury editorial brand aesthetic.
- Keeps navigation accessible via a floating transparent header with backdrop blur.
- Organizes the user journey naturally: visual intrigue first, followed by clear product storytelling and purchase controls.

**Negative / tradeoffs**:
- Full viewport hero requires visitors to scroll past the animation sequence to reach the buy box.
- Mobile devices must render a full screen canvas, though DPR clamping at 2 and sliding cache ensure memory remains bounded under 80MB.

**Neutral**:
- Lower page sections (terroir notes, sensory craft, footer) remain intact and connect directly beneath the buy box.

## Follow-up

- [ ] Add touch swipe gesture support for manual frame scrubbing on mobile devices in reduced motion mode.
- [ ] Connect full checkout order submission flow when Slice 4 (Cart drawer and order completion) is built.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
