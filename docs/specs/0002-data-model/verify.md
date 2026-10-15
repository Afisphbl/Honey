# Verify: Data model · spec 0002 · updated 2026-10-15

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Inspect catalog seed varietals in queries → all six honey varietals (Raw Wildflower, Pure Acacia, Mountain Lavender, Apalachicola Tupelo, Raw Comb Cut, and Apiary Tasting Flight) return valid linked terroir origin and tasting profile records → AC-1, AC-3
- [x] Query default featured varietal → `getFeaturedProduct()` resolves `raw-wildflower-reserve` with frame bounds 0 to 149 and hero preview poster `/frames/frame-001.webp` → AC-3
- [x] Query variant weights and packaging → each product variant displays accurate weights in ounces, grams, metric volume, and USD pricing → AC-1, AC-3
- [x] Add item to Zustand cart store → store captures snapshot of variant title, unit price cents, and weight in ounces, opening the drawer state → AC-5
- [x] Adjust cart quantity past limits → store caps quantity at 10 jars per variant and caps total cart items at 30 jars → AC-4, AC-5
- [x] Calculate empty cart totals → `calculateOrderTotals([])` returns strictly zero subtotal, zero shipping fee, and zero total → AC-4
- [x] Calculate standard shipping fee → subtotal under $50 (5000 cents) automatically incurs an $8.00 (800 cents) delivery charge → AC-4
- [x] Calculate free shipping tier → subtotal equal to or exceeding $50 grants zero shipping charge → AC-4
- [x] Submit valid order payload to `POST /api/orders` → server recalculates prices from authoritative catalog, returns HTTP 201 with confirmed status, unique receipt identifier, and order number → AC-2, AC-6
- [x] Submit tampered price order payload to `POST /api/orders` → route detects price mismatch against catalog and returns HTTP 422 with explanation → AC-2, AC-6
- [x] Submit malformed shipping address to `POST /api/orders` → Zod validation catches invalid state code or bad email and returns HTTP 400 with field errors → AC-2, AC-6
- [x] Confirm receipt in cart store → store invokes `confirmOrderReceipt`, clears active cart items, and appends receipt to local storage under key `honey_orders` → AC-5
- [x] Rehydrate cart with corrupted storage → safe schema parsing purges non compliant items to an empty array and sets `hasHydrated` flag to true without throwing → AC-5

## Commands

- [x] `npm test` → all unit test suites across schema validation, pricing arithmetic, catalog queries, store persistence, and order route handler pass cleanly → AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
- [x] `npm run lint` → ESLint verifies zero TypeScript lint or syntax errors across new catalog files → AC-1, AC-2
- [x] `npm run build` → Next.js compiles production bundle and registers dynamic Route Handler `POST /api/orders` without build errors → AC-1, AC-6

## Acceptance criteria coverage

- AC-1 (Domain interfaces and types): covered by schema tests, query tests, and type checking in `npm run build`
- AC-2 (Runtime Zod validation): covered by schema tests and route handler validation tests
- AC-3 (Artisanal seed dataset): covered by query tests, invariant assertions, and featured product lookup
- AC-4 (Deterministic pricing utilities): covered by pricing arithmetic tests and free shipping threshold tests
- AC-5 (Zustand cart store unification): covered by store unit tests, quantity limit tests, and receipt confirmation tests
- AC-6 (Next.js Order Route Handler): covered by route handler tests testing valid orders, price tampering detection, and schema errors
