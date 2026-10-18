# Review, development, 2026-10-18

**Reviewed by**: Gemini (inline fresh read, author on Gemini Flash)
**Scope**: 23 files, uncommitted
**Verdict**: Changes requested

## Summary
You built an exceptional cart drawer and simulated checkout experience that feels fast, tactile, and natural for an artisanal storefront. The multi phase transitions work smoothly inside the slide over panel, the server revalidates prices against catalog data, and the test suite is thorough with 281 passing unit tests plus dedicated Cypress browser tests. We have one major correctness issue where duplicate variant items submitted to the order API route can bypass per variant quantity limits and create duplicate React keys on the receipt. We should consolidate duplicate items on the server before merging.

## Major
### 🟠 Duplicate item submissions in order API route bypass quantity caps and cause duplicate list keys, `src/app/api/orders/route.ts:37`
**Problem**: The order route loops through `submission.items` without consolidating duplicate variant identifiers. If a client submits multiple line items referencing the same variant identifier, each entry is validated independently against the maximum limit of 10 jars. The server then pushes multiple items with the identical `variant.id` into `validatedItems`.
**Why it matters**: A customer could bypass the 10 jar reserve limit by repeating the item entry in the payload. When the confirmed receipt displays those items with `key={item.id}`, React emits duplicate key warnings, and order totals may record distorted line items.
**Suggested fix**: Merge duplicate variants by summing their quantities before running validations, or call `validateCartLimits` from `src/lib/catalog/pricing.ts` to enforce variant and cart boundaries. Reject or consolidate payloads where any single variant exceeds 10 total jars.

## Minor
### 🟡 City and postal code validation errors lack individual accessible element associations, `src/components/cart/checkout-form.tsx:410`
**Problem**: The city, state, and postal code fields share a single error message block. When both city and ZIP code fail validation, only the first error string renders. Furthermore, neither input has an `aria-describedby` attribute pointing to this paragraph, so screen readers do not read the specific validation text when focusing the invalid inputs.
**Why it matters**: Visually impaired shoppers navigating via screen readers hear that the field is invalid via `aria-invalid`, but do not receive the corrective message explaining why the postal code or city was rejected.
**Suggested fix**: Provide dedicated error paragraph elements for `city` and `postalCode` with unique identifiers, and link them to their respective inputs using `aria-describedby`.

### 🟡 Fixed positioning and max width on drawer container constrain receipt print output, `src/app/globals.css:114`
**Problem**: The `@media print` rules apply `width: 100%` and `position: absolute` to `.print-receipt-container`, but its parent `DialogPrimitive.Content` in `src/components/ui/drawer.tsx` retains `fixed inset-y-0 right-0 sm:max-w-md` without print overrides.
**Why it matters**: When a customer clicks Print Receipt, the print layout can be constrained inside the 448 pixel side sheet column on standard paper rather than expanding across the printed page.
**Suggested fix**: In `src/app/globals.css`, add print rules for `[role="dialog"]` to reset `position: static`, `max-width: 100%`, and remove box shadows during printing.

### 🟡 Quantity updates in cart store do not check total cart item limits, `src/lib/store/cart-store.ts:165`
**Problem**: The `addItem` action prevents adding jars when total cart items exceed 30 units, but `updateQuantity` only clamps the individual variant quantity to 10 without verifying that the cumulative cart count remains within 30 units.
**Why it matters**: A customer with multiple distinct products in their bag could increase several quantities from 5 to 10, bringing the overall cart count above the 30 unit cap.
**Suggested fix**: Check the cumulative cart count in `updateQuantity` and prevent increments that push the cart total beyond `MAX_TOTAL_CART_ITEMS`.

## Nits
* ⚪ `src/components/cart/cart-drawer.tsx:79, 85`, import and use the canonical `FREE_SHIPPING_THRESHOLD_CENTS` constant from `src/lib/catalog/pricing.ts` instead of hardcoding 5000.
* ⚪ `src/components/cart/order-receipt.tsx:98`, update `aria-label` dynamically to "Order number copied" when clicked, or add an `aria-live` announcement for screen readers.
* ⚪ `src/components/cart/order-history.tsx:26`, add a confirmation check before clearing local storage history so customers do not accidentally erase past receipts.
* ⚪ `src/app/api/orders/route.ts:104`, use `crypto.randomUUID` or `crypto.getRandomValues` for generating unique order identifiers and receipt keys.

## Strengths
* Cohesive multi phase slide over experience navigating cleanly between items review, checkout, confirmed receipt, and historical orders with preserved form inputs.
* Authoritative server side price revalidation protecting the business from client tampering while handling stale prices gracefully with HTTP 422 warnings.
* Exemplary test coverage across unit and end to end tests, with 281 passing Vitest assertions and a comprehensive 287 line Cypress test suite covering all 9 acceptance criteria.

## Test coverage
Your test suite provides outstanding coverage for this slice. You added comprehensive Vitest unit tests for the cart drawer state machine, checkout form validation, receipt rendering, and historical order persistence. The API route tests cover happy paths, pricing mismatches, and schema rejections. The Cypress suite thoroughly tests real user browser flows across routes, including keyboard dismissal with Escape and print preview triggers.
