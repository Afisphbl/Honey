# Verify: Product catalog and tasting notes, spec 0005, updated 2026-10-17

Steps derived from spec 0005 acceptance criteria. /check verify runs these; /test locks the durable ones.

## UI and manual checks

- [x] Visit `/` and click "All Reserves & Catalog" in the header navigation to navigate to `/catalog` where the editorial terroir manifesto, purity badges, and responsive card grid render cleanly (AC-1)
- [x] In `/catalog`, click the "Infusions" category filter tab to verify shallow URL parameter updates to `/catalog?category=infusion` and the grid filters to Mountain Lavender Infusion (AC-2, AC-3)
- [x] Change the sort dropdown to "Price: Low to High" to verify the URL updates to `/catalog?sort=price_asc` and products reorder from lowest to highest price (AC-2, AC-3)
- [x] Toggle the "In Stock Only" switch to verify the URL updates to `/catalog?inStock=true` and out of season or sold out jars are filtered from view (AC-2, AC-3)
- [x] On the Raw Wildflower Reserve card, click the "500g" size pill to update the displayed price to $58.00, then click "Add to Bag" to open the slide over cart drawer with the updated item and subtotal (AC-4)
- [x] On the Mountain Lavender Infusion card, click "Inspect Tasting Profile" to expand the sensory drawer displaying 5 star sweetness and intensity meters, color rating, liquid texture, floral sources, and food pairings (AC-5, AC-6)
- [x] On the Apiary Reserve Tasting Flight card, verify the Gift Box Edition badge, the three included variety chips, and the bundle savings indicator, then click "Add Tasting Flight to Bag" to verify cart addition (AC-4, AC-7)
- [x] Apply an impossible filter combination to display the editorial empty state, then click "Reset All Filters" to restore all varieties (AC-8)
- [x] Manually enter `/catalog?category=unknown_terroir&sort=cheapest` into the browser address bar to verify the route normalizes cleanly to default filters without crashing (AC-3)

## Commands

- [x] `npm test` runs clean across all catalog and storefront suites (209 tests passing) (AC-1, AC-2, AC-4, AC-5)
- [x] `npm run build` compiles Next.js pages and generates the static `/catalog` route cleanly (AC-1, AC-3)
- [x] `npm run lint` completes with zero ESLint errors across the workspace (AC-1)

## Acceptance criteria coverage

- AC-1 covered by catalog page navigation check, terroir header verification, and `npm run build`
- AC-2 covered by category tab filter check, sort dropdown check, and in stock switch check
- AC-3 covered by shallow URL search param checks and invalid query parameter normalization check
- AC-4 covered by variant size switching check, dynamic pricing calculation, and cart drawer addition
- AC-5 covered by sensory rating meters check, floral nectar sources display, and food pairings inspection
- AC-6 covered by viscous grid transition expansion and reduced motion check
- AC-7 covered by tasting flight bundle card, gift packaging badge, and included jar chips check
- AC-8 covered by editorial empty state reassurance check and one click reset filters check
