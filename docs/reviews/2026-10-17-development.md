# Review, development, 2026-10-17

**Reviewed by**: Gemini Pro (author on Gemini Flash)
**Scope**: 25 files, branch vs main
**Verdict**: Blocked

## Summary
The change introduces a dedicated product catalog route at `/catalog` with responsive grid layouts, category filtering tabs, URL search parameter synchronization, and expandable tasting drawers with native CSS grid transitions. Overall implementation quality, sensory visual polish, and accessibility semantics are strong. However, a type mismatch in `src/components/layout/__tests__/storefront-header.test.tsx` causes `next build` type checking to fail, blocking production deployment until corrected.

## Blockers
### 🔴 Invalid addItem parameter breaks build type check, `src/components/layout/__tests__/storefront-header.test.tsx:56`
**Problem**: The test passes a raw string literal (`"raw-wildflower-reserve-250g"`) to `useCartStore.getState().addItem(...)` instead of an object satisfying the `CartInputItem` contract.
**Why it matters**: When running `next build` or `tsc --noEmit`, TypeScript fails with error TS2345. This halts the production build step and prevents deployment.
**Suggested fix**: Update the test call to pass a valid `CartInputItem` object containing `id`, `productId`, `variantId`, `title`, and `unitPriceCents`.

## Major
### 🟠 Hardcoded fallback domain data and prices in bundle card, `src/components/catalog/bundle-card.tsx:143`
**Problem**: The bundle card embeds hardcoded fallback JSX with three specific honey products (Raw Wildflower, Pure Acacia, Mountain Lavender) and fallback price numbers (8800 and 11400) if relations are not resolved.
**Why it matters**: If a new tasting flight or bundle is added without pre populating `includedProducts` or variant pricing, the UI displays false product items and incorrect prices to customers rather than failing safely or displaying an honest empty state.
**Suggested fix**: Remove the hardcoded varietal chips and prices. Derive displayed items strictly from `product.includedProducts`, and render an appropriate empty state or omit the section when no child products are linked.

## Minor
### 🟡 Missing group utility class on product card container, `src/components/catalog/product-card.tsx:123`
**Problem**: The product jar `Image` component specifies `group-hover:scale-105`, but neither the wrapping `article` nor the image container defines the Tailwind `group` class.
**Why it matters**: The subtle zoom micro interaction on product jar hover does not trigger, leaving the visual presentation static during mouse hover.
**Suggested fix**: Add `group` to the parent `article` or the immediate image container element so hover events propagate to the image.

### 🟡 Filter updates purge non catalog query parameters from URL, `src/components/catalog/catalog-view.tsx:80`
**Problem**: The `updateQueryParam` helper constructs a brand new `URLSearchParams()` object from scratch on every change instead of reading existing parameters from the current URL.
**Why it matters**: If a shopper lands on `/catalog` with marketing campaign parameters such as UTM tags or referral tokens, clicking any category filter or sort option purges all tracking parameters from the URL.
**Suggested fix**: Initialize `URLSearchParams` with `searchParams.toString()`, then update or delete only `category`, `sort`, and `inStock`.

### 🟡 Repetitive price computation in sort comparator loop, `src/lib/catalog/queries.ts:98`
**Problem**: In `filterAndSortProducts`, the comparator functions for `price_asc` and `price_desc` invoke `getProductDisplayPrice` on every pair comparison inside the sorting loop.
**Why it matters**: Calling helper functions that iterate over variant arrays on every comparison adds unnecessary CPU work and object allocations during sorting.
**Suggested fix**: Precompute default prices or read `defaultVariant.priceCents` directly during sorting.

## Nits
- ⚪ `src/components/catalog/bundle-card.tsx:105`, The badge text `3 x 125g Tasting Jars Included` is hardcoded and should be computed from the included items length.
- ⚪ `src/components/catalog/product-card.tsx:48`, Reading `selectedVariant.priceCents` without optional chaining or fallback could throw a runtime exception if a product has an empty variants collection.

## Strengths
- Comprehensive accessibility semantics across all interactive surfaces, including `role="tablist"` on category filters, `role="switch"` on in stock toggles, `role="radiogroup"` on variant sizes, and `role="meter"` on sensory ratings.
- Smooth zero dependency sensory drawer expansion built on native Tailwind CSS grid transitions (`grid-template-rows: 0fr` to `1fr`) with full support for `prefers-reduced-motion`.
- Resilient URL search parameter normalization in `CatalogView` that silently cleans invalid categories or sort keys to safe defaults without runtime crashes.
- Extensive test coverage with 209 passing Vitest unit and component tests plus Cypress end to end browser journeys.

## Test coverage
Vitest test suites cover all newly created catalog components, query functions, pricing logic, and routing orchestrators. 209 unit tests pass across 28 test suites. The only test flaw is the type signature misuse in `src/components/layout/__tests__/storefront-header.test.tsx:56`, which was caught during TypeScript build compilation rather than Vitest execution.
