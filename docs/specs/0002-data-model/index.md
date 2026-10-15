# 0002. Honey Catalog and Commerce Data Model

**Date**: 2026-10-15
**Status**: Accepted

## Summary

This decision defines the domain data model for the Honey artisanal storefront, spanning product varietals, jar packaging variants, terroir origins, tasting profiles, client cart sessions, and local order receipts. We structure the data layer as strongly typed TypeScript entities validated at runtime with Zod schemas, backed by a static artisanal dataset and deterministic pricing utilities. This setup delivers instant zero latency catalog browsing, prevents client price manipulation, and unifies the Zustand cart store with zero external database dependencies.

## Requirements

**User stories**:
- As a storefront visitor, I want to explore premium honey varieties with clear details on floral origin, beekeeper heritage, and sensory tasting notes so that I can discover unique seasonal harvests.
- As a customer, I want to select between distinct jar sizes and weights with accurate pricing so that I can choose the right quantity for my kitchen or gift giving.
- As a shopper, I want my cart selections and item totals to calculate reliably and persist across browser reloads so that my selections remain intact.
- As an apiculture brand, I want seasonal batches and harvest availability clearly indicated so that scarce reserves do not receive orders when out of stock.

**Acceptance criteria**:
- **AC-1**: Complete TypeScript interfaces define `Product`, `ProductVariant`, `ApiaryOrigin`, `TastingProfile`, `CartItem`, `OrderSummary`, `ShippingAddress`, and `ProductWithRelations` with strict typing, zero implicit any values, and exact relationship links.
- **AC-2**: Runtime Zod schemas validate product catalog entities, inventory status enums, cart line item payloads, customer shipping address fields, and checkout order submissions.
- **AC-3**: A dedicated artisanal seed dataset in `src/lib/catalog/data.ts` provides complete records for single origin varietals, seasonal reserves, tasting notes, packaging imagery, and canvas hero keyframe bounds (`frameStartIndex`, `frameEndIndex`, `heroPosterUrl`).
- **AC-4**: Deterministic pricing helper functions in `src/lib/catalog/pricing.ts` compute line totals, order subtotal cents, shipping fee calculations, enforce a 10 jar quantity limit per variant with a 30 item total cart cap, and return zero fees for an empty cart.
- **AC-5**: The existing Zustand store in `src/lib/store/cart-store.ts` unifies with the shared catalog types, preserving local storage persistence, validating rehydrated items against Zod schemas, capturing immutable variant snapshots, clearing cart upon order receipt confirmation, and guarding SSR hydration with `hasHydrated`.
- **AC-6**: A Next.js Route Handler `POST /api/orders` receives order submissions, revalidates item prices against the authoritative catalog using Zod, generates sequential order identifiers (`ORD-${timestamp}-${randomKey}`), returns HTTP 422 if client expected totals mismatch, and returns confirmed order receipts.

## Decision

**Chosen option**: Option 1: TypeScript static dataset with Zod runtime schema assertions

We adopt a statically compiled TypeScript catalog paired with Zod runtime validation, pure pricing helper utilities, and local storage order persistence.

**Implementation skills**: `zustand` (`lobehub/lobehub`, `.agents/skills/zustand/`) · `next-best-practices` (`pedronauck/skills`, `.agents/skills/next-best-practices/`) · `vitest` (`antfu/skills`, `.agents/skills/vitest/`)

## Feature design

**Data model sketch**:

```
Product (1) <---> (1) ApiaryOrigin
Product (1) <---> (1) TastingProfile
Product (1) <---> (N) ProductVariant

ProductWithRelations = Product & {
  origin: ApiaryOrigin;
  tastingProfile: TastingProfile;
  variants: ProductVariant[];
}

CartItem.id = ProductVariant.id (captures immutable snapshot)
OrderSummary contains Array of CartItem snapshots and ShippingAddress
```

**Entity field specifications**:

1. `Product`:
   - `id: string` (unique identifier, e.g. "raw-wildflower-reserve")
   - `slug: string` (URL friendly path, e.g. "raw-wildflower-reserve")
   - `title: string` (e.g. "Raw Wildflower Reserve")
   - `subtitle: string` (e.g. "Late Summer Meadow Harvest")
   - `description: string` (editorial narrative)
   - `category: 'single_origin' | 'seasonal_reserve' | 'infusion' | 'raw_comb' | 'bundle'`
   - `harvestYear: number` (e.g. 2026)
   - `batchNumber: string` (e.g. "LOT-2026-WILD-04")
   - `inventoryStatus: 'in_stock' | 'limited_reserve' | 'out_of_season' | 'sold_out'`
   - `isFeatured: boolean` (indicates hero showcase varietal)
   - `frameStartIndex: number` (canvas start frame index, 0 to 149)
   - `frameEndIndex: number` (canvas end frame index, 0 to 149)
   - `heroPosterUrl: string` (preview image, e.g. "/frames/frame-001.webp")
   - `originId: string` (foreign key to ApiaryOrigin)
   - `tastingProfileId: string` (foreign key to TastingProfile)
   - `includedProductIds?: string[]` (for bundle categories, references child product IDs)
   - `imageUrl?: string` (static jar photography asset)
   - `createdAt: string` (ISO 8601 timestamp)
   - `updatedAt: string` (ISO 8601 timestamp)

2. `ProductVariant`:
   - `id: string` (unique SKU identifier, e.g. "raw-wildflower-reserve-250g")
   - `productId: string` (foreign key referencing Product.id)
   - `sku: string` (e.g. "HNY-RW-250")
   - `title: string` (e.g. "250g Tasting Jar")
   - `weightOz: number` (e.g. 8.8)
   - `weightGrams: number` (e.g. 250)
   - `volumeMl: number` (e.g. 190)
   - `jarMaterial: string` (e.g. "Amber UV-filtered French Glass")
   - `priceCents: number` (e.g. 3400 for $34.00)
   - `compareAtPriceCents?: number` (optional retail comparison, e.g. 4000)
   - `isDefault: boolean` (true for the preselected variant on initial view)
   - `imageUrl?: string` (optional packaging asset specific to variant)

3. `ApiaryOrigin`:
   - `id: string` (e.g. "catskill-highlands")
   - `region: string` (e.g. "Catskill Highlands, New York")
   - `elevationMeters: number` (e.g. 680)
   - `climate: string` (e.g. "Montane humid continental")
   - `beekeeperName: string` (e.g. "Julian Thorne")
   - `hiveCount: number` (e.g. 24)
   - `floraEcosystem: string` (e.g. "Subalpine wildflower pastures and linden canopies")
   - `purityTested: boolean` (verified raw and unpasteurized)
   - `coordinates: { latitude: number, longitude: number }`

4. `TastingProfile`:
   - `id: string` (e.g. "taste-wildflower-2026")
   - `sweetnessScale: number` (integer 1 to 5)
   - `intensityScale: number` (integer 1 to 5)
   - `colorRating: string` (e.g. "Deep Warm Amber")
   - `texture: string` (e.g. "Velvety smooth, slow crystallization")
   - `floralSources: string[]` (e.g. ["Basswood Blossom", "Purple Loosestrife", "Goldenrod"])
   - `flavorDescriptors: string[]` (e.g. ["Ripe apricot", "warm butter", "subtle cedar finish"])
   - `pairedFoods: string[]` (e.g. ["Aged manchego", "sourdough toast", "earl grey tea"])

5. `CartItem`:
   - `id: string` (matches variantId)
   - `productId: string`
   - `variantId: string`
   - `title: string` (snapshot of product title at add time)
   - `variantTitle: string` (snapshot of variant title)
   - `unitPriceCents: number` (snapshot of variant unit price)
   - `weightOz: number` (snapshot of variant unit weight)
   - `imageUrl?: string` (preview image asset)
   - `quantity: number` (integer 1 to 10)
   - `addedAt: string` (ISO 8601 timestamp)

6. `ShippingAddress`:
   - `fullName: string` (minimum 2, maximum 100 characters, trimmed)
   - `email: string` (valid email format, lowercased)
   - `line1: string` (minimum 3, maximum 120 characters, street address)
   - `line2?: string` (optional apartment or suite, maximum 120 characters)
   - `city: string` (minimum 2, maximum 60 characters)
   - `state: string` (exact two letter uppercase United States state code)
   - `postalCode: string` (5 digit standard or 9 digit extended ZIP code)
   - `country: string` (defaults to "US")

7. `OrderSubmission`:
   - `customer: { name: string, email: string }`
   - `shippingAddress: ShippingAddress`
   - `items: Array<{ productId: string, variantId: string, quantity: number }>`
   - `expectedSubtotalCents?: number` (optional client total assertion)

8. `OrderSummary`:
   - `id: string` (format: `ORD-${Date.now()}-${randomKey}`)
   - `orderNumber: string` (customer visible code, e.g. "HNY-87421")
   - `customer: { name: string, email: string }`
   - `shippingAddress: ShippingAddress`
   - `items: CartItem[]`
   - `subtotalCents: number`
   - `shippingFeeCents: number`
   - `totalCents: number`
   - `status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled'`
   - `createdAt: string` (ISO 8601 timestamp)

**State transitions**:

Inventory Status lifecycle:
`in_stock` -> `limited_reserve` -> `out_of_season` -> `sold_out`
- Transitions are set in catalog data based on seasonal harvest availability.
- When status is `out_of_season` or `sold_out`, adding the product to the cart is disabled in UI components.

Order Status lifecycle:
`pending` -> `confirmed` -> `fulfilled` (or `cancelled`)
- `pending`: Order payload created during checkout submission.
- `confirmed`: Server Route Handler validates prices against the catalog, creates receipt, and returns confirmed state.
- `fulfilled`: Customer completes receipt acknowledgment.

**API surface**:

| Function or Endpoint | Invocation | Key inputs | Key outputs | Auth | Key errors / return on missing |
|---|---|---|---|---|---|
| getProductById(id) | TypeScript Call | id: string | ProductWithRelations or null | Public | Returns null if not found |
| getProductBySlug(slug) | TypeScript Call | slug: string | ProductWithRelations or null | Public | Returns null if not found |
| getAllProducts(filter?) | TypeScript Call | category?, inStockOnly? | ProductWithRelations[] | Public | Returns empty array if none match |
| getFeaturedProduct() | TypeScript Call | None | ProductWithRelations or null | Public | Returns null if none designated |
| calculateOrderTotals(items) | TypeScript Call | items: CartItem[] | { subtotalCents, shippingFeeCents, totalCents } | Public | Empty array yields all zeros; clamps 1 to 10 |
| POST /api/orders | HTTP Route Handler | OrderSubmission payload | { success: true, order: OrderSummary } | Public | 400 invalid schema, 422 price mismatch |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Browse product | Title, slug, description, harvest year, batch number, imageUrl | Product entity fields in `src/lib/catalog/data.ts` |
| View packaging options | Weight in ounces, grams, volume milliliters, price, variant imageUrl | ProductVariant record linked by productId |
| Inspect bundle items | Array of bundled child products | Product.includedProductIds mapped to Product records |
| Hero canvas sequence | Keyframe range and poster preview | Product `frameStartIndex`, `frameEndIndex`, `heroPosterUrl` |
| Inspect terroir | Region, elevation, beekeeper, floral ecosystem | ApiaryOrigin record linked by originId |
| Read tasting notes | Sweetness (1-5), intensity (1-5), pairings | TastingProfile record linked by tastingProfileId |
| Add item to cart | Unit price cents, variant title, item snapshot, imageUrl | ProductVariant at moment of user addition |
| View cart total | Subtotal cents | Calculated: sum of (`unitPriceCents * quantity`) |
| Estimate shipping | Shipping fee cents | Derived: 0 if empty or subtotal >= 5000 cents ($50), else 800 cents ($8) |
| Order placement | Final total cents | Calculated: `subtotalCents + shippingFeeCents` |
| Generate order receipt | Unique order number and id | Server generated: `ORD-${Date.now()}-${randomKey}` |
| Validate shipping | Validated customer address fields | Parsed via Zod ShippingAddressSchema on server |
| Receipt verification | Authoritative item prices | Recomputed against catalog records in `src/lib/catalog/data.ts` |

**Key invariants**:
- Every `Product` must have at least one associated `ProductVariant`.
- Exactly one `ProductVariant` per product must have `isDefault: true`.
- Exactly one `Product` in `src/lib/catalog/data.ts` must have `isFeatured: true`.
- If `category` is `bundle`, `includedProductIds` must be a non empty array referencing valid product IDs.
- Product and variant `imageUrl` fields default to `/frames/frame-001.webp` if no specific asset path is declared.
- All monetary amounts are non negative integers representing cents in USD.
- A line item quantity must be an integer between 1 and 10 inclusive, and total cart item count cannot exceed 30 items.
- If `items.length === 0`, `calculateOrderTotals` strictly returns `{ subtotalCents: 0, shippingFeeCents: 0, totalCents: 0 }`.
- Order submission at `POST /api/orders` recomputes all line item prices and shipping fees against the server catalog; client submitted prices are never trusted.
- If client sends `expectedSubtotalCents` and it does not match the server recomputed total, the route returns HTTP 422 Unprocessable Entity with a detailed message explaining that catalog prices have changed.
- Upon receiving a successful order receipt from `POST /api/orders`, `useCartStore` invokes `clearCart()` to empty the active cart, and appends the receipt to local storage under key `honey_orders`.
- On browser storage rehydration, `useCartStore` validates persisted items using `z.array(CartItemSchema).safeParse`. Corrupt or non compliant structures are purged safely to an empty array without crashing the application.

**Security model**:
- Catalog browsing, tasting notes, and variant inspection are entirely public read operations.
- Order submission at `POST /api/orders` is publicly accessible but protected against price tampering by server side recalculation against authoritative static records.
- Customer shipping addresses and email inputs are parsed and sanitized with strict Zod string constraints (valid email format, trimmed address lines, maximum character lengths).

**Configuration required**:
- None. All data structures, seed records, and schemas run within the local project build.

**Critical test scenarios**:
- Happy path: User queries featured wildflower product, inspects variants, adds a 250g jar to cart, verifies subtotal, and generates a valid order receipt, verifies **AC-1**, **AC-3**, **AC-4**, **AC-5**, **AC-6**.
- Failure case: Client submits order with tampered unit prices ($1.00 instead of $34.00); server route recalculates correctly from authoritative catalog or returns 422 on expected subtotal mismatch, verifies **AC-2**, **AC-6**.
- Address validation failure: Client submits shipping address with invalid email or missing street address; route returns 400 Bad Request with field level validation errors, verifies **AC-2**, **AC-6**.
- Empty cart edge case: `calculateOrderTotals([])` returns zero subtotal and zero shipping fee, verifies **AC-4**.
- Store hydration edge case: Local storage rehydration receives malformed JSON or obsolete schema fields; store catches error, resets cart safely to empty state, and sets `hasHydrated: true` without throwing unhandled exceptions, verifies **AC-5**.

## Build plan

- [x] 1. Define core domain types and interfaces (`Product`, `ProductVariant`, `ApiaryOrigin`, `TastingProfile`, `CartItem`, `OrderSummary`, `ShippingAddress`, `OrderSubmission`, `ProductWithRelations`) in `src/types/catalog.ts`, satisfies **AC-1**.
- [x] 2. Author Zod runtime schemas in `src/lib/catalog/schema.ts` for catalog validation, variant integrity, address parsing, and order submission parsing, satisfies **AC-2**.
- [x] 3. Create the artisanal seed dataset in `src/lib/catalog/data.ts` with authentic varietals (Raw Wildflower, Acacia, Lavender, Orange Blossom, Comb cut, Gift Bundle), terroir records, and canvas sequence frame links, satisfies **AC-3**.
- [x] 4. Implement pure catalog query functions (`getProductById`, `getProductBySlug`, `getAllProducts`, `getFeaturedProduct`) in `src/lib/catalog/queries.ts`, satisfies **AC-1**, **AC-3**.
- [x] 5. Implement deterministic pricing and shipping calculation utilities in `src/lib/catalog/pricing.ts` with empty cart guards and quantity limits, satisfies **AC-4**.
- [x] 6. Refactor the Zustand cart store in `src/lib/store/cart-store.ts` to consume unified catalog types, snapshot fields, Zod schema validation on rehydration, and cart clearing on receipt confirmation, satisfies **AC-5**.
- [x] 7. Create Next.js Route Handler `src/app/api/orders/route.ts` with server side price revalidation, mismatch detection (HTTP 422), and sequential receipt generation, satisfies **AC-2**, **AC-6**.
- [x] 8. Author Vitest unit tests in `src/lib/catalog/__tests__/` covering schema validation, pricing arithmetic, queries, and store integration, satisfies **AC-1**, **AC-2**, **AC-4**, **AC-5**.

## Consequences

**Positive**:
- Pure TypeScript and Zod structure yields sub millisecond query execution and zero external database infrastructure.
- Complete type unification between catalog and cart prevents property mismatches across downstream UI slices.
- Server side price revalidation eliminates client side checkout tampering risks.
- Deterministic pricing functions provide a single source of truth for line math, shipping tiers, and empty cart handling.
- Rich apiculture metadata (terroir, elevation, floral descriptors, packaging assets) enables compelling editorial storytelling.

**Negative / tradeoffs**:
- Modifying catalog items or adjusting variant prices requires committing changes to code and deploying.
- Client storage holds completed customer receipts locally without a centralized merchant database.

**Neutral**:
- Catalog imagery and keyframe anchors must stay aligned with the optimized canvas assets in `public/frames/`.
- Future wholesale or subscription models will require extending the variant schema with recurring billing attributes.

## Follow-up

- [ ] Connect the scroll hero canvas sequence in Slice 1 to the default featured product variant in `src/lib/catalog/data.ts`.
- [ ] Implement tasting note filter chips and terroir badges in Slice 2 using the structured `TastingProfile` and `ApiaryOrigin` queries.
- [ ] Connect the cart drawer in Slice 4 to `calculateOrderTotals` and `POST /api/orders` for order completion.
