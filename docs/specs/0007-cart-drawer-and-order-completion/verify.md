# Verify: Cart drawer and order completion · spec 0007 · updated 2026-10-17
_Steps derived from spec 0007 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Visit `/`, `/catalog`, and `/about`, clicking the header shopping bag icon on each route to confirm the cart drawer opens seamlessly across all pages → AC-1
- [x] Add honey jars to the cart and use the QuantitySelector to increment, decrement, and clamp quantities between 1 and 10 jars per variant, verifying total units cannot exceed 30 → AC-2
- [x] Remove an item using the trash button and verify subtotal recalculates instantly; remove all items to verify the empty bag illustration and Discover Reserves action appear → AC-2
- [x] Add items totaling under $50.00 and check the complimentary delivery progress bar; add items exceeding $50.00 to verify the bar fills completely and shipping displays Complimentary → AC-3
- [x] Toggle the complimentary botanical gift packaging checkbox and type a personalized message in the handwritten gift note textarea, verifying the character counter enforces the 150 character limit → AC-4
- [x] Click Proceed to Checkout to transition from the items review phase to the customer shipping form phase without page navigation → AC-5
- [x] Attempt to submit an empty checkout form to verify inline field validation errors highlight invalid inputs with accessible error descriptions → AC-6
- [x] Fill valid recipient and shipping address details, enter simulated card numbers, and submit the order to confirm the loading indicator displays and duplicate clicks are ignored → AC-6, AC-7
- [x] Verify successful order submission displays the confirmed order receipt with a unique order number (`HNY-XXXXX`), itemized receipt, delivery address, and paid total → AC-8
- [x] Click Print Receipt to trigger the browser print preview, verifying print styles display a clean document without drawer controls or navigation → AC-8
- [x] Open the drawer header navigation to select Past Orders, verifying the newly placed order displays in the historical orders list and can be inspected → AC-9
- [x] Press Escape while the drawer is open to verify the drawer closes and keyboard focus returns to the triggering button → AC-1

## Commands
- [x] `npm test` → all 39 test suites and 270 unit tests pass cleanly → AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9
- [x] `npm run build` → Next.js App Router production build and TypeScript check pass cleanly → AC-1, AC-7
- [x] `npm run lint` → ESLint completes with zero errors → AC-1

## Acceptance-criteria coverage
- AC-1 covered by global drawer opening check, focus restoration check, and `npm run build`
- AC-2 covered by quantity stepper clamp check, trash removal check, and empty bag state check
- AC-3 covered by complimentary delivery progress calculation check and threshold unlocked check
- AC-4 covered by botanical gift packaging toggle check and 150 character gift note counter check
- AC-5 covered by in drawer phase transition checks and back navigation preserving form data
- AC-6 covered by client Zod validation error checks and submission loading indicator check
- AC-7 covered by server authoritative price revalidation and `POST /api/orders` test suite
- AC-8 covered by order receipt confirmation view, print media preview check, and cart reset check
- AC-9 covered by historical orders drawer view and localStorage persistence inspection check
