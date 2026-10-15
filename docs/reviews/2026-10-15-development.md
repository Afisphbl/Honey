# Review, development, 2026-10-15

**Reviewed by**: review subagent (author on primary model)
**Scope**: 16 files, development vs main
**Verdict**: Changes requested

## Summary
You did great work setting up the data model for the honey storefront. The domain interfaces, runtime Zod validation, seed apiculture records, deterministic pricing math, and Next.js route handler are clean and well structured. We found two major issues around cart limits that you should address before merging. The quantity update action in the store allows exceeding the 30 jar limit, which causes total cart loss when reloading the page, and the order submission route does not enforce total jar limits or consolidate duplicate variants.

## Major

### 🟠 Cart quantity updates bypass total limit and trigger cart loss on refresh, `src/lib/store/cart-store.ts:171`
**Problem**: In `updateQuantity`, the logic clamps the requested item quantity to `MAX_QUANTITY_PER_VARIANT` (10 jars), but never checks the total cart cap `MAX_TOTAL_CART_ITEMS` (30 jars). If you have four items in your cart and adjust each to eight jars, the store accepts all 32 jars during your session. When you reload the page, `onRehydrateStorage` validates `totalQuantity > MAX_TOTAL_CART_ITEMS`, treats the stored state as corrupted, and calls `state.clearCart()`.
**Why it matters**: This leads to silent customer data loss upon browser refresh. A customer who adjusts quantities inside the cart drawer will lose their entire cart when they return or reload the page.
**Suggested fix**: You can calculate the sum of quantities across other items in `updateQuantity` before applying the update. Clamp the target quantity so the sum across all items stays within `MAX_TOTAL_CART_ITEMS`, or ignore the increase when the cart is full.

### 🟠 Order route handler accepts payloads exceeding cart limits and allows duplicate variants, `src/app/api/orders/route.ts:37`
**Problem**: The route handler processes `submission.items` without checking total jar capacity or grouping duplicate variant records. In `src/lib/catalog/schema.ts`, `OrderSubmissionSchema` applies `.max(30)` to the line items array length, not the total quantity of jars. Also, while `src/lib/catalog/pricing.ts` exports `validateCartLimits`, `route.ts` never calls it. An order containing multiple line items whose quantities sum to more than 30 jars, or duplicate line items for the same variant, passes validation and receives a confirmed receipt.
**Why it matters**: This bypasses the domain constraints specified in acceptance criteria `AC-4` and `AC-6`. It allows orders exceeding the 10 jar variant limit and the 30 jar total cap to commit to production receipts.
**Suggested fix**: You can consolidate line items by variant identifier, check that each consolidated count observes `MAX_QUANTITY_PER_VARIANT`, and call `validateCartLimits` to confirm the total jar count does not exceed `MAX_TOTAL_CART_ITEMS`. If limits are exceeded, you can return an HTTP 422 or HTTP 400 response.

## Minor

### 🟡 Direct state mutation during storage rehydration breaks store immutability, `src/lib/store/cart-store.ts:259`
**Problem**: In `onRehydrateStorage`, the helper function `setCartItems` executes `state.items = items` via direct property mutation rather than invoking a store action or `setState`.
**Why it matters**: Mutating state properties directly bypasses standard Zustand listener notifications. While `state.setHasHydrated(true)` happens to trigger a shallow copy immediately afterward, direct property mutation is an anti pattern that can lead to subtle UI render timing issues.
**Suggested fix**: You can define a store action or invoke `useCartStore.setState({ items })` so all state updates remain immutable and cleanly tracked.

### 🟡 Add item capacity check rejects valid additions to existing cart items, `src/lib/store/cart-store.ts:104`
**Problem**: In `addItem`, the guard `if (totalItemsCurrently + safeQuantity > MAX_TOTAL_CART_ITEMS)` evaluates the sum of current items and requested quantity before checking whether the item already exists in the cart. If a customer has 28 items in their cart and attempts to add 5 jars of an existing item that already has 8 jars, `safeQuantity` is 5, making the calculation 28 + 5 = 33 > 30. The function returns early, even though the existing item would have clamped at 10 jars (an increase of only 2 jars), which would bring the cart total to exactly 30 items.
**Why it matters**: Customers with carts near capacity may click to add a jar to an existing item and observe nothing happening, causing confusion.
**Suggested fix**: You can locate the existing item first. Determine the actual net quantity increase after variant clamping, and check whether that net increase fits within the remaining space up to `MAX_TOTAL_CART_ITEMS`.

### 🟡 Route handler inventory status rejection logic lacks test coverage, `src/app/api/orders/__tests__/route.test.ts:52`
**Problem**: In `src/app/api/orders/route.ts`, lines 52 to 63 check whether `product.inventoryStatus` is `out_of_season` or `sold_out`, returning HTTP 422 with a specific message. None of the nine test cases in `route.test.ts` exercise this rejection branch.
**Why it matters**: Under configured test runners, untested error handling branches are a coverage gap that can hide regressions during future catalog updates.
**Suggested fix**: You can add a test case in `route.test.ts` submitting an order for a product with status set to `out_of_season` or `sold_out`, confirming that the route returns HTTP 422 with the expected message.

## Nits

* ⚪ `src/lib/catalog/data.ts:259`, Consider applying TypeScript readonly or Object freeze to static catalog datasets to prevent accidental in memory modification in server processes.
* ⚪ `src/lib/catalog/schema.ts:188`, The error message Order cannot exceed 30 items total describes total jar count while the schema check only bounds the line items array length.
* ⚪ `src/lib/store/cart-store.ts:48`, The order receipts array in local storage grows without a limit cap, so you could consider retaining only the most recent 20 or 50 receipts.

## Strengths

* Domain interfaces and runtime Zod schemas provide complete type safety across apiculture metadata, coordinates, tasting scales, and postal address rules.
* Artisanal seed records in the catalog offer rich terroir details, realistic harvest batch numbers, and exact animation keyframe anchors.
* The Next.js order route handler recalculates prices authoritatively from catalog records, effectively preventing client price tampering.
* The test suite is extensive and fast, with 85 unit tests passing cleanly across schema validation, pricing arithmetic, store hydration, and query lookups.

## Test coverage

The testing suite provides strong coverage across domain logic, with 85 tests passing across nine test files. Schema invariants, shipping calculation thresholds, and catalog queries are thoroughly tested. We identified two areas where you could improve coverage: the route handler check for unavailable inventory status (`out_of_season` or `sold_out`) currently has no test in `route.test.ts`, and `cart-store.test.ts` does not test quantity updates on multiple items that push total cart jars beyond the 30 jar limit.
