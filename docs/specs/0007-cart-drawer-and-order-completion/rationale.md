# 0007. Cart Drawer and Order Completion: Rationale

**Date**: 2026-10-17

## Context

Honey offers premium artisanal honey harvests, single origin reserves, and curated tasting flights. In earlier foundational slices and feature slices, we established the domain data model in spec 0002, the luxury design tokens in spec 0003, the canvas hero sequence in spec 0004, the interactive variety catalog in spec 0005, and the brand terroir atlas in spec 0006.

Slice 4 completes the storefront conversion loop by enabling visitors to inspect their reserve bag, adjust jar quantities, request complimentary botanical gift packaging, enter delivery details, and complete an order with verified receipts. In previous slices, a basic walking skeleton drawer existed in `src/components/cart/cart-drawer.tsx`, but its checkout action was a placeholder alert. Furthermore, the drawer was mounted only on the homepage, leaving other pages unable to display cart line items when visitors clicked the header shopping bag.

The architectural challenge is providing an elegant, distraction free checkout experience that matches the brand art direction while maintaining complete security, accurate pricing recalculation, accessibility compliance, and zero external third party gateway lock in for this portfolio showcase.

## Options considered

### Option 1: Unified in drawer multi phase checkout with simulated luxury payment and local storage receipts

This option expands the existing slide over drawer into a cohesive four phase experience (`items`, `checkout`, `receipt`, and `history`). Shoppers review their bag, proceed to an in drawer shipping and gift note form, simulate payment with masked card inputs, and receive an instant printable receipt without leaving the page. All order receipts persist in browser local storage, and the server authoritative endpoint revalidates prices against catalog data.

**Pros**:
* Keeps the shopper in their browsing context without disrupting page state or scroll position.
* Delivers an intimate boutique purchasing atmosphere suited to luxury goods.
* Requires zero external billing provider accounts, API secrets, or webhook configurations.
* Preserves complete data persistence across browser reloads via local storage.

**Cons**:
* Requires careful in drawer state management to handle phase navigation and back button behavior.
* Form layout must remain compact to fit comfortably inside the slide over panel on mobile screens.

### Option 2: Dedicated checkout page route at /checkout and /checkout/success

This option redirects visitors from the cart drawer to a traditional full page ecommerce checkout route at `/checkout`, followed by a confirmation page at `/checkout/success`.

**Pros**:
* Provides abundant screen space for expansive multi column address forms and shipping option selectors.
* Matches standard mass market ecommerce conventions familiar to general online shoppers.

**Cons**:
* Creates jarring context breaks, pulling customers away from the immersive storytelling of the catalog or hero section.
* Adds routing overhead and state synchronization complexity across page transitions.
* Feels excessively corporate and generic for an exclusive small batch apiculture reserve.

### Option 3: Slide over cart drawer paired with separate modal dialog for checkout

This option keeps the cart drawer for items review, but clicking checkout closes the drawer and opens a separate centered Radix modal dialog for the shipping form and receipt.

**Pros**:
* Separates bag review concerns from checkout form concerns into distinct component files.
* Dialog provides wider horizontal space on desktop screens than a slide over panel.

**Cons**:
* Layering or swapping overlays (drawer closing while dialog opens) creates visual flickering and focus management hazards.
* Clutters the DOM with multiple concurrent overlay portals.
* Degrades mobile user experience where modal dialogs take up the entire screen anyway.

## Rationale

We chose Option 1: Unified in drawer multi phase checkout.

Luxury artisanal brands thrive on fluid, uninterrupted digital experiences. Forcing shoppers onto a sterile checkout page breaks the sensory immersion established by the warm editorial typography, apiary photography, and viscous animations. An in drawer multi phase flow keeps the customer anchored in the brand world while offering a swift, effortless path to order completion.

Mounting the drawer globally in `src/app/layout.tsx` eliminates the previous inconsistency where cart actions were only available on the homepage. By maintaining a clear state machine inside the drawer, customers can move forward to checkout or return to item adjustments without losing their entered address data.

Server side price revalidation in `POST /api/orders` provides robust security against price manipulation, guaranteeing that client state remains subordinate to authoritative catalog records. Providing client local storage persistence for completed receipts satisfies the user requirement for verifiable order history while keeping the storefront entirely self contained with zero recurring SaaS costs.

## References

**Project sources** (verifiable, in this repo):
* `docs/scope/scope.md`: Feature 8 specification requirements for Slice 4 (basis: project roadmap)
* `docs/specs/0002-data-model/index.md`: Domain interfaces, Zod schemas, pricing calculations, and order persistence design (basis: data model specification)
* `docs/specs/0003-design-system-and-ui-foundation/index.md`: Radix UI overlay primitives, fluid typography, and OKLCH amber palette tokens (basis: UI foundation)
* `src/lib/store/cart-store.ts`: Zustand client cart store with localStorage synchronization and rehydration guard (basis: client state management)
* `src/lib/catalog/pricing.ts`: Pure pricing calculation utilities, quantity limits, and shipping fee thresholds (basis: financial invariants)

**Practices & standards**:
* WAI ARIA Dialog (Modal) pattern: Focus trapping within overlays, Escape key dismissal, and trigger focus restoration upon exit (basis: WCAG 2.1 guideline 2.1)
* Server authoritative price verification: Recalculating item subtotals and shipping fees on the server to prevent client total tampering (basis: secure ecommerce transaction principles)
* CSS media print optimization: Hiding interactive controls and drawer chrome during print actions to generate clean physical receipts (basis: Web printing standards)
* Zero runtime dependency state machines: Managing view transitions through explicit union states rather than external statechart libraries (basis: minimal software complexity)

**Links** (web verified only):
* [Radix UI Dialog Documentation](https://www.radix-ui.com/primitives/docs/components/dialog)
* [MDN Web Docs: CSS Printing and @media print](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/print)
* [MDN Web Docs: Window.print()](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)
