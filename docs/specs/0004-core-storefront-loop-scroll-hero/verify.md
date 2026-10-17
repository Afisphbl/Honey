# Verify: core storefront loop & scroll hero · spec 0004 · updated 2026-10-16
_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Load the homepage at `/` → observe sticky navigation header with Honey wordmark and Bag count pill showing 0 → AC-1, AC-6
- [x] Scroll down through the 300vh scroll container → canvas smoothly scrubs frames 1 through 150 at 60fps with lerp dampening → AC-2
- [x] Inspect frame cache memory in browser DevTools → browser memory consumption stays bounded under 80MB and device pixel ratio clamps to 2 → AC-3
- [x] Emulate `prefers-reduced-motion: reduce` in browser rendering settings → scroll scrubbing pauses, static poster frame displays, and manual timeline slider scrubs frames smoothly → AC-4
- [x] In Featured Buy Box, click 500g variant radio button → unit price updates from $34.00 to $58.00 and compare at updates to $68.00 with Save 15% badge without layout shift → AC-5
- [x] Increase quantity stepper to 2, click Add to Cart → header cart badge increments to 2, slide over cart drawer opens displaying 2 jars, subtotal $116.00, and complimentary delivery unlocked → AC-5, AC-6
- [x] In cart drawer, decrement quantity to 1 → subtotal recalculates to $58.00 → AC-6
- [x] Check active frame value source → derived in `useScrollFrame` from container scroll progress clamped between 1 and 150 → AC-2
- [x] Check canvas scaling value source → bounding rect of canvas element multiplied by clamped DPR (max 2) → AC-3
- [x] Check product information value source → loaded from `getFeaturedProduct()` in `src/lib/catalog/queries.ts` → AC-5
- [x] Check variant pricing value source → loaded from `selectedVariant.priceCents` ($34.00, $58.00) in `src/lib/catalog/data.ts` → AC-5
- [x] Check discount badge calculation source → calculated as `(compareAt - price) / compareAt` (15%) → AC-5
- [x] Check cart count pill value source → derived from `useCartStore.getState().getTotalItems()` → AC-6
- [x] Check cart subtotal value source → calculated by `calculateOrderTotals` from `src/lib/catalog/pricing.ts` → AC-6
- [x] Check free shipping indicator source → derived from `5000 - subtotalCents` threshold in `src/lib/catalog/pricing.ts` → AC-6

## Commands
- [x] `npm test` → 20 test files and 144 unit and component tests pass cleanly with zero failures → AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
- [x] `npm run build` → Next.js Turbopack build and TypeScript type check pass cleanly with zero errors → AC-1, AC-2, AC-5
- [x] `npx eslint src/` → ESLint executes cleanly across all source files with zero errors and zero warnings → AC-1

## Acceptance-criteria coverage
- AC-1 (sticky split view hero and editorial layout) · covered by manual header check, canvas layout check, and test suite
- AC-2 (300vh scroll track and 150 frame lerp scrubbing) · covered by scroll scrub check and `use-scroll-frame.test.ts`
- AC-3 (bounded memory under 80MB and DPR clamped at 2) · covered by DevTools performance check and `frame-loader.test.ts`
- AC-4 (accessible reduced motion fallback with manual slider) · covered by reduced motion emulation check and `hero-canvas-scrubber.test.tsx`
- AC-5 (featured buy box with reactive 250g and 500g variant selection) · covered by variant switching check and `featured-buy-box.test.tsx`
- AC-6 (add to cart action, reactive header badge, and slide over cart drawer) · covered by drawer add to cart check, header counter check, and `cart-store.test.ts`
