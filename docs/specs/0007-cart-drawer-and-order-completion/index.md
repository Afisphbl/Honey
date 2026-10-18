# 0007. Cart Drawer and Order Completion

**Date**: 2026-10-17
**Status**: Accepted

## Summary

This decision defines the slide over cart drawer and simulated order completion flow for Honey. The drawer mounts globally in the application root layout, opening reliably from any page header or buy box action. Customers review line items, adjust quantities, view progress toward complimentary delivery, and select optional botanical gift packaging with a personalized handwritten card note. The checkout experience transitions smoothly inside the slide over panel through an accessible multi phase state machine, collecting shipping details and simulating card payment without third party gateway dependencies. Order submissions submit to a server route that revalidates catalog prices against authoritative records, writes confirmed order receipts to browser local storage, and presents a printable order confirmation with recent order history access.

## Requirements

**User stories**:
* As a storefront visitor, I want to review my selected honey jars in a slide over drawer from any page so that I can inspect my reserve bag without losing my place.
* As a shopper adjusting my order, I want to increase, decrease, or remove jar quantities with instant price updates so that my bag reflects my exact preferences.
* As a culinary enthusiast ordering gifts, I want to request complimentary botanical gift packaging and write a custom handwritten note so that my order arrives ready for gifting.
* As a customer completing a purchase, I want to enter my shipping address and review my order total inside the drawer so that checkout feels fast, private, and effortless.
* As a buyer placing an order, I want clear feedback if an item is sold out or changed in price so that I never get charged unexpected totals.
* As a confirmed customer, I want an instant printable order receipt with an order number and the ability to review past orders in my browser so that I have proof of purchase.
* As a keyboard and screen reader user, I want focus trapped inside the drawer with escape key dismissal and clear field error announcements so that navigation remains fully accessible.

**Acceptance criteria**:
* **AC-1**: Global drawer mounting and accessibility. The cart drawer is mounted in `src/app/layout.tsx` so it opens from any header, buy box, or variety card across all routes (`/`, `/catalog`, `/about`). It traps keyboard focus while open, restores focus to the triggering element upon closure, dismisses on Escape key press, and disables motion transitions when `prefers-reduced-motion` is active.
* **AC-2**: Line item management and quantity limits. The drawer renders all active cart items with jar photography thumbnails, product title, variant weight, unit price, and item subtotal. Customers can increment or decrement quantities from 1 to 10 jars per variant via the `QuantitySelector`, remove items via a trash button, or view an empty state with a Discover Reserves button when zero items remain. Total cart items cannot exceed 30 units.
* **AC-3**: Complimentary delivery progress calculation. The drawer header renders a live shipping progress bar calculating progress toward complimentary insured shipping at $50.00 (5000 cents). The display updates dynamically showing the remaining dollar amount needed and percentage filled with viscous easing.
* **AC-4**: Artisanal gifting and courier notes. The drawer includes a toggle for complimentary botanical gift packaging (amber wax seal and organic cotton ribbon) and an expandable handwritten gift note textarea with a 150 character limit and live counter, plus an optional courier delivery instructions field with a 200 character limit.
* **AC-5**: Multi phase in drawer state machine. The drawer navigates smoothly between four distinct view phases: bag review (`items`), customer shipping and simulated payment form (`checkout`), confirmed order summary (`receipt`), and historical order receipts (`history`), with back navigation preserving customer inputs.
* **AC-6**: Client form validation and error alerts. The checkout form fields (fullName, email, line1, line2, city, state, postalCode) validate at runtime against Zod schemas. Invalid fields display accessible inline error messages with `aria-invalid` attributes, while the submission action displays a loading spinner and disables duplicate submissions.
* **AC-7**: Server authoritative price revalidation. Checkout submits payload to `POST /api/orders`. The server revalidates variant presence, availability, and prices against `src/lib/catalog/data.ts`. If client expected price mismatches server calculations, the server returns HTTP 422 with corrected values, and the checkout form displays an editorial warning banner while preserving user address input.
* **AC-8**: Order confirmation receipt and persistence. Upon successful order creation, the server returns an `OrderSummary` with a unique identifier (`ORD-${timestamp}-${randomKey}`) and display order number (`HNY-XXXXX`). The client saves this receipt to browser `localStorage` under `honey_orders`, clears the active cart, and displays an editorial confirmation with order breakdown, print receipt trigger (`window.print()`), and copy order number button.
* **AC-9**: Historical orders inspection drawer view. The drawer header includes a Past Orders trigger that switches to the `history` phase, rendering a chronological list of saved order receipts from `localStorage` with order date, total paid, item count, and full receipt inspection modal.

## Decision

**Chosen option**: Option 1: Unified in drawer multi phase checkout with simulated luxury payment, server catalog revalidation, and local storage receipt persistence

We build a cohesive slide over cart and checkout experience directly within `CartDrawer`, mounted globally in `src/app/layout.tsx`. The drawer alternates through distinct phases (`items`, `checkout`, `receipt`, `history`) without disruptive page redirects. Form inputs validate using lightweight client state and Zod schemas, while order completion submits to `POST /api/orders` for authoritative server price recalculation and returns printable receipts stored in browser local storage.

**Implementation skills**: `impeccable` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/impeccable`) · `taste-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/taste-skill`) · `ui-ux-pro-max-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/ui-ux-pro-max-skill`) · `zustand` (`.agents/skills/zustand/`) · `tailwind-4-docs` (`.agents/skills/tailwind-4-docs/`) · `next-best-practices` (`.agents/skills/next-best-practices/`)

## Rationale

Reasoning, alternatives considered, and architectural trade offs: see [rationale.md](rationale.md).

## Feature design

**Data model sketch**:

```
CartItem (existing in src/types/catalog.ts):
  id: string (matches variantId)
  productId: string
  variantId: string
  title: string
  variantTitle: string
  unitPriceCents: number
  weightOz: number
  imageUrl?: string
  quantity: number (1 to 10)
  addedAt: string (ISO 8601 timestamp)
  variant: { size: string, weightOz: number, priceCents: number }

ShippingAddress (existing in src/types/catalog.ts):
  fullName: string (2 to 100 characters)
  email: string (valid email format)
  line1: string (3 to 120 characters)
  line2?: string (optional, up to 120 characters)
  city: string (2 to 60 characters)
  state: string (2 letter uppercase US state code)
  postalCode: string (5 digit or 9 digit ZIP code)
  country: string (defaults to "US")

OrderSubmission (extended for Slice 4):
  customer: { name: string, email: string }
  shippingAddress: ShippingAddress
  items: Array<{ productId: string, variantId: string, quantity: number }>
  giftPackaging: boolean
  giftNote?: string (optional, maximum 150 characters)
  deliveryInstructions?: string (optional, maximum 200 characters)
  paymentMethod: "simulated_card" | "apiary_reserve_credit"
  cardLast4?: string (4 digits)
  expectedSubtotalCents?: number

OrderSummary (extended for Slice 4):
  id: string (format: ORD-${Date.now()}-${randomKey})
  orderNumber: string (format: HNY-${5-digit-number})
  customer: { name: string, email: string }
  shippingAddress: ShippingAddress
  items: CartItem[]
  giftPackaging: boolean
  giftNote?: string
  deliveryInstructions?: string
  paymentMethod: "simulated_card" | "apiary_reserve_credit"
  cardLast4?: string
  paymentStatus: "paid" | "pending"
  subtotalCents: number
  shippingFeeCents: number
  totalCents: number
  status: "confirmed" | "fulfilled" | "cancelled"
  createdAt: string (ISO 8601 timestamp)
```

**State transitions**:

Drawer view phase state machine:
`items` <---> `checkout` ---> `receipt`
  |
  +---> `history` ---> `receipt` (inspect selected past order)

* `items` phase: Shows line items, quantity adjustment, free delivery progress bar, gift packaging checkbox, and Proceed to Checkout button.
* `checkout` phase: Shows recipient name, email, street address, gift note textarea with live counter, optional delivery instructions, and simulated payment inputs. User can click Back to return to `items` without losing form fields.
* `receipt` phase: Shows confirmed order number, purchased jars summary, delivery address, paid total, print receipt button, and Continue Exploring button. Cart store is cleared upon reaching this phase.
* `history` phase: Displays list of stored receipts loaded from `localStorage`. Clicking an order opens its full receipt view.

**API surface**:

| Endpoint or Action | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `POST /api/orders` | POST | `OrderSubmission` payload with items, address, gift options, payment simulation | `{ success: true, order: OrderSummary }` | Public | 400 Invalid schema, 422 Price mismatch or out of stock, 500 Server error |
| `useCartStore.confirmOrderReceipt` | Store Action | `receipt: OrderSummary` | void (saves to `honey_orders` key in localStorage and clears active items) | Client Local | Silently logs error on storage quota failure |
| `getStoredOrderReceipts` | Storage Query | None | `OrderSummary[]` sorted descending by date | Client Local | Returns empty array on empty storage or corrupt JSON |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Display cart line item | Title, variant size, thumbnail, unit price, total | `CartItem` record snapshot from `useCartStore` |
| Complimentary delivery bar | Remaining cents and percentage | Computed from `subtotalCents` against $50.00 constant threshold |
| Form validation | Field errors for name, email, address, zip | Zod schema validation (`ShippingAddressSchema.safeParse`) |
| Order creation | Order identifier and friendly order number | Generated server side in `POST /api/orders` (`ORD-...` and `HNY-...`) |
| Price assertion | Authoritative unit prices and subtotal | Server queries `getVariantById` in `src/lib/catalog/queries.ts` |
| Receipt printing | Print preview with formatted typography | Browser native `window.print()` using CSS `@media print` rules |
| Historical orders list | Past order numbers, dates, and totals | Browser `localStorage` key `honey_orders` parsed via `z.array(OrderSummarySchema)` |

**Key invariants**:
* Authoritative pricing: The client never dictates final item prices; `POST /api/orders` always revalidates prices against `src/lib/catalog/data.ts`.
* Quantity boundaries: Each item variant is constrained between 1 and 10 units; the overall cart is capped at 30 items.
* Safe persistence: Corrupt local storage data is safely cleared without crashing client rehydration.
* Focus restoration: Closing the drawer returns keyboard focus to the triggering element.
* Print cleanliness: Printed receipts hide navigation, buttons, and drawer overlays, displaying only the formal invoice card.

**Security model**:
* Input sanitization: All string fields (fullName, street address, gift note, delivery instructions) are trimmed and validated with length limits via Zod before persistence.
* Zero actual card storage: Simulated payment inputs are never transmitted to external services, and only a masked four digit representation is stored in receipts.
* Rate limiting: In memory submission frequency guards prevent automated route abuse.

**Configuration required**:
* Zero new environment variables required. The checkout operates completely self contained using existing Next.js App Router API routes and client local storage.

**Critical test scenarios**:
* Happy path: Customer adds honey jars to cart, adjusts quantities, unlocks free shipping, fills checkout form with gift note, places simulated order, verifies confirmed receipt, and sees cart cleared (verifies AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8).
* Price change rejection: Submission with stale client prices returns HTTP 422 with server authoritative prices, displaying an editorial warning banner while preserving customer form entries (verifies AC-7).
* Validation error feedback: Submitting with missing required fields or invalid ZIP code triggers inline field error alerts without submitting network requests (verifies AC-6).
* Keyboard accessibility: Pressing Escape or clicking close button dismisses drawer and restores focus to triggering button (verifies AC-1).
* Past orders retrieval: Reopening drawer and navigating to Past Orders shows previously completed order receipts (verifies AC-8, AC-9).

## Build plan

1. [x] Extend schema definitions and domain types for gift packaging, gift note, delivery instructions, and simulated payment metadata in `src/types/catalog.ts` and `src/lib/catalog/schema.ts`, satisfies **AC-4**, **AC-7**.
2. [x] Mount `CartDrawer` globally in `src/app/layout.tsx` and verify drawer triggers function consistently across homepage, `/catalog`, and `/about`, satisfies **AC-1**.
3. [x] Implement in drawer multi phase state machine (`items`, `checkout`, `receipt`, `history`) with smooth slide transitions and back navigation in `src/components/cart/cart-drawer.tsx`, satisfies **AC-1**, **AC-5**.
4. [x] Build accessible Customer Shipping Form with real time Zod validation, gift packaging toggle, 150 character gift note with live counter, and simulated payment card inputs in `src/components/cart/checkout-form.tsx`, satisfies **AC-4**, **AC-5**, **AC-6**.
5. [x] Update Route Handler `POST /api/orders` in `src/app/api/orders/route.ts` to validate extended fields and enforce price revalidation error contracts, satisfies **AC-7**.
6. [x] Build confirmed Order Receipt and Past Orders history views with print media styles (`window.print()`), clipboard copy, and local storage persistence in `src/components/cart/order-receipt.tsx` and `src/components/cart/order-history.tsx`, satisfies **AC-8**, **AC-9**.
7. [x] Write comprehensive Vitest unit tests covering phase transitions, form validation, simulated checkout submission, and receipt rendering in `src/components/cart/__tests__/`, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**, **AC-7**, **AC-8**, **AC-9**.

## Consequences

**Positive**:
* Seamless purchasing experience: Shoppers complete reserve orders without disruptive full page redirects or external dependencies.
* Robust data protection: Authoritative server price verification prevents client total manipulation.
* Thoughtful brand touchpoints: Complimentary gift packaging and handwritten note options elevate the luxury artisanal feeling.
* Zero third party cost: Entire checkout operates locally with zero SaaS fees, API tokens, or external gateway downtimes.

**Negative / tradeoffs**:
* Simulated payments: Because payment is simulated for this portfolio demonstration, orders do not transfer real currency through credit card processors.
* Local storage receipts: Past orders live in browser storage, so clearing browser cache or switching devices will not retain historical receipts.

**Neutral**:
* Global layout mounting: Mounting `CartDrawer` in `src/app/layout.tsx` means the cart component is always part of the root React component tree, hydrated with client state.

## Follow-up

* [ ] Connect live Stripe Elements payment gateway if the brand transitions from artisanal showcase to commercial production.
* [ ] Consider adding automated customer confirmation emails via Resend or SendGrid when an external email provider is configured.
