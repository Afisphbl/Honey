# 0005. Product Catalog and Tasting Notes

**Date**: 2026-10-17
**Status**: Accepted

## Summary

This decision defines the dedicated product catalog route and interactive tasting notes explorer for Honey at `/catalog`. Visitors browse single origin reserves, seasonal batches, infusions, raw comb cuts, and gift bundles using tactile category filter tabs and sort controls synchronized with URL query parameters. Each variety card features variant selection pills, direct cart drawer integration, and an expandable sensory drawer revealing sweetness scales, aromatic intensity, floral sources, and artisanal cheese pairings. All variety records and tasting profiles render via static React Server Components with native Tailwind v4 CSS grid transitions, delivering zero layout shift and fast page loads without extra runtime libraries.

## Requirements

**User stories**:
- As a storefront customer, I want to explore all artisanal honey varieties on a dedicated catalog page so that I can discover unique seasonal harvests beyond the featured reserve.
- As a discerning culinary buyer, I want to filter honeys by category (Single Origin, Infusion, Seasonal Reserve, Tasting Flight) and sort by intensity or price so that I can quickly find the right flavor profile.
- As a visitor interested in apiculture, I want to expand an interactive tasting profile on each jar to inspect floral sources, elevation, harvest terroir, and food pairings without leaving the catalog grid.
- As a gift shopper, I want to inspect pre packed tasting flight boxes showing individual included jars, bundle savings, and single click addition to the cart.
- As a shopper ready to purchase, I want to choose my preferred jar size directly on the card and add it to my cart drawer with instant visual confirmation.
- As a user navigating with a keyboard or screen reader, I want accessible disclosure controls with proper aria attributes and reduced motion support so that browsing feels natural and comfortable.
- As an engineer, I want the catalog route to render statically with clean URL search parameters so that filtered views are easily shareable and search engine friendly.

**Acceptance criteria**:
- **AC-1**: The storefront provides a dedicated `/catalog` page accessible from header navigation and hero teaser links, featuring an editorial header with terroir manifesto, active category counts, and a responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile).
- **AC-2**: A sticky category filter bar enables instant filtering across All, Single Origin, Infusion, Seasonal Reserve, and Raw Comb, alongside a sort dropdown (Featured, Price Low to High, Price High to Low, Aromatic Intensity) and an In Stock Only toggle.
- **AC-3**: Filter selections synchronize with browser URL search parameters using shallow Next.js routing (such as `/catalog?category=infusion&sort=price_asc`), allowing direct bookmarking and shareable filtered links while silently normalizing unknown parameters to safe defaults.
- **AC-4**: Each product card displays the reserve title, harvest year, terroir subtitle, batch lot badge, starting price, variant weight selector pills (such as 250g and 500g), and a direct Add to Cart button that adds the selected variant and opens the slide over cart drawer.
- **AC-5**: Each product card includes an expandable tasting notes drawer toggled by an accessible button with explicit `aria-expanded` attributes, displaying 5 star sweetness rating, 5 star intensity rating, color rating, liquid texture description, floral nectar sources, and paired food recommendations.
- **AC-6**: Expanding and collapsing the tasting drawer animates smoothly using a native Tailwind CSS grid transition (`grid-template-rows` from `0fr` to `1fr`) with custom viscous easing, instantly snapping without motion when `prefers-reduced-motion` is active.
- **AC-7**: Pre packed bundles and tasting flights (such as Apiary Reserve Tasting Flight) render with distinct gift packaging badges, preview chips of included honey jars, bundled savings indicators, and one click cart addition.
- **AC-8**: When a filter combination yields zero products, an editorial empty state displays a gentle reassurance message and a single Reset Filters button that restores the default view in one click.

## Decision

**Chosen option**: Option 1: Dedicated `/catalog` route with React Server Component data rendering, shallow URL search parameter synchronization, and native CSS grid expandable tasting drawers

We build a dedicated full page catalog at `src/app/catalog/page.tsx` backed by static catalog queries. Filtering and sorting state lives in shallow URL query parameters managed by a client grid wrapper in `src/components/catalog/catalog-view.tsx`. Individual variety cards incorporate accessible variant size buttons, instant cart store integration, and zero dependency CSS grid tasting drawers.

**Implementation skills**: `impeccable` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/impeccable`) · `taste-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/taste-skill`) · `ui-ux-pro-max-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/ui-ux-pro-max-skill`) · `tailwind-4-docs` (`.agents/skills/tailwind-4-docs/`) · `zustand` (`.agents/skills/zustand/`) · `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)

## Feature design

**Data model sketch**:
The catalog consumes the static catalog domain established in spec 0002, joining products with their apiary origins, tasting profiles, and variant pricing:

- `Product`: `id`, `slug`, `title`, `subtitle`, `description`, `category`, `harvestYear`, `batchNumber`, `inventoryStatus`, `isFeatured`, `originId`, `tastingProfileId`, `includedProductIds`, `imageUrl`.
- `ProductVariant`: `id`, `productId`, `sku`, `title`, `weightOz`, `weightGrams`, `volumeMl`, `jarMaterial`, `priceCents`, `compareAtPriceCents`, `isDefault`, `imageUrl`.
- `ApiaryOrigin`: `id`, `region`, `elevationMeters`, `climate`, `beekeeperName`, `hiveCount`, `floraEcosystem`, `purityTested`, `coordinates`.
- `TastingProfile`: `id`, `sweetnessScale` (1 to 5), `intensityScale` (1 to 5), `colorRating`, `texture`, `floralSources`, `flavorDescriptors`, `pairedFoods`.
- `ProductWithRelations`: composite record holding `Product` along with resolved `origin: ApiaryOrigin`, `tastingProfile: TastingProfile`, `variants: ProductVariant[]`, and optional `includedProducts: Product[]`. Sourced from `getAllProducts()` in `src/lib/catalog/queries.ts`.
- `CatalogFilterState` (ephemeral client state synchronized with URL search params):
  - `activeCategory`: `ProductCategory | "all"`
  - `sortBy`: `"featured" | "price_asc" | "price_desc" | "intensity"`
  - `inStockOnly`: `boolean`

**State transitions**:
1. Catalog filter navigation:
   - `initial_load`: reads search params from URL (`category`, `sort`, `inStock`) -> normalizes invalid values to defaults -> renders filtered product list
   - `category_change`: user clicks category tab -> URL shallow updates (`/catalog?category=infusion`) -> filtered grid updates with zero page reload
   - `sort_change`: user selects sort option -> list reorders smoothly -> URL updates
   - `empty_filter`: filter matches 0 items -> renders `EmptyCatalogState` -> user clicks Reset Filters -> resets to `category=all` and default sort
2. Product card sensory expansion:
   - `collapsed`: drawer closed, button text "Inspect Tasting Profile", `aria-expanded="false"`, grid rows `0fr`
   - `expanding`: click trigger, `aria-expanded="true"`, transition grid rows to `1fr` with viscous ease
   - `expanded`: sensory stars, floral sources, and food pairing tags visible
3. Quick variant selection and cart add:
   - `variant_switched`: user selects 250g or 500g pill on card -> price display and savings badge update instantly
   - `added_to_cart`: user clicks Add to Cart -> variant added to `useCartStore` -> slide over `CartDrawer` opens

**API surface**:
| Surface | Type | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `/catalog` | Server Component Page | `searchParams: { category?, sort?, inStock? }` | HTML with initial static products | Public | 404 for invalid subroutes |
| `getAllProducts` | Pure Domain Query | `filter?: { category?, inStockOnly? }` | `ProductWithRelations[]` | None | Returns empty array if no match |
| `getProductBySlug` | Pure Domain Query | `slug: string` | `ProductWithRelations` or `null` | None | Returns null if not found |
| `useCartStore.addItem` | Client Store Mutation | `variantId: string, quantity: number` | Updated cart state | Public | Clamped to 10 max per variant |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Render catalog grid | Product title, subtitle, batch, harvest year | `Product` fields in `src/lib/catalog/data.ts` |
| Render card pricing | Unit price cents, compare at cents, weight | Default `ProductVariant` for the selected jar size |
| Render variant pills | Size options (250g, 500g, comb block) | `Product.variants` list resolved by query |
| Render tasting radar | Sweetness stars, intensity stars (1 to 5) | `Product.tastingProfile.sweetnessScale` and `intensityScale` |
| Render sensory notes | Color description, texture, flavor descriptors | `Product.tastingProfile` fields |
| Render pairing guide | Artisanal cheese and beverage pairings | `Product.tastingProfile.pairedFoods` array |
| Render terroir details | Apiary region name, elevation in meters | `Product.origin.region` and `elevationMeters` |
| Render bundle contents | Included jar chips and floral sources | `Product.includedProductIds` resolved to child records |
| Filter by category | Active filtered subset of products | Matching `Product.category` against `searchParams.category` |
| Sort catalog cards | Sorted card display order | Computed client side using price, intensity, or featured flag |
| Add to cart | Cart line item with image, title, price | Selected variant joined with product metadata |

**Key invariants**:
- Catalog browsing is completely deterministic and zero latency, using static in memory domain data.
- Product quantities added to cart are always clamped between 1 and 10 per variant, with total cart count capped at 30 items.
- Prices displayed on cards are integer cents in USD; no floating point numbers are used in pricing calculations.
- Invalid or unrecognized URL filter parameters are silently sanitized to valid defaults (`category=all`, `sort=featured`) without throwing errors.
- Out of stock items remain inspectable for educational discovery, with purchase controls disabled and clear status badges.

**Security model**:
- Public read access for all catalog pages and product data. No authentication or login is required.
- Cart additions operate in browser local storage via Zustand.
- Price integrity is guaranteed by revalidating line item prices on the server during order submission against static catalog definitions.
- No personally identifiable information is processed or stored on the catalog route.

**Configuration required**:
- None. The catalog uses static domain records and client state stores with zero external services or secret credentials.

**Critical test scenarios**:
- Happy path: Visitor navigates to `/catalog`, filters by "Infusion", sorts by "Price Low to High", expands tasting notes on Mountain Lavender, selects a 500g jar, and adds to cart; cart drawer opens with the correct subtotal, verifies **AC-1**, **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-6**.
- Bundle flow: Visitor selects "Tasting Flight" category, views Apiary Reserve Tasting Flight card with 3 preview jar chips, selects jar size, and clicks Add Bundle to Cart; all bundle details reflect accurately in cart, verifies **AC-2**, **AC-4**, **AC-7**.
- Empty filter state: Visitor selects an impossible filter combination resulting in 0 matches; empty state renders with friendly reset button; clicking reset restores all products, verifies **AC-8**.
- Edge case: Visitor enters malformed search params such as `/catalog?category=honeycomb&sort=cheapest`; catalog normalizes gracefully to default category and sort without breaking render, verifies **AC-3**.
- Accessibility & motion: Screen reader announces tasting drawer expansion state via `aria-expanded`; keyboard user navigates variant pills with Tab and Enter; animations instantly snap when `prefers-reduced-motion` is enabled, verifies **AC-5**, **AC-6**.

## Build plan

Following the project Tracer Bullet approach, we build thin end to end vertical slices connecting queries, UI components, URL routing, and cart state:

1. [x] Create helper query functions in `src/lib/catalog/queries.ts` to support bundle relation resolution (`includedProducts`) and multi category filtering, satisfies **AC-1**, **AC-2**
2. [x] Build accessible tasting drawer primitive `src/components/catalog/tasting-drawer.tsx` with Tailwind v4 CSS grid transition and `aria-expanded` toggle, satisfies **AC-5**, **AC-6**
3. [x] Build product card component `src/components/catalog/product-card.tsx` with variant size selector, price calculation, tasting drawer trigger, and cart drawer action, satisfies **AC-4**, **AC-5**
4. [x] Build bundle card component `src/components/catalog/bundle-card.tsx` with included jar chips, savings badge, and bundle buy box, satisfies **AC-4**, **AC-7**
5. [x] Build sticky filter bar `src/components/catalog/catalog-filter-bar.tsx` with category tabs, active count badges, sort dropdown, and in stock switch, satisfies **AC-2**
6. [x] Build empty state component `src/components/catalog/empty-catalog-state.tsx` with reset filters action, satisfies **AC-8**
7. [x] Build client catalog grid orchestrator `src/components/catalog/catalog-view.tsx` with URL search param sync and live filtering, satisfies **AC-1**, **AC-2**, **AC-3**
8. [x] Build dedicated page `src/app/catalog/page.tsx` with editorial header, terroir manifesto, and metadata for search discoverability, satisfies **AC-1**, **AC-3**
9. [x] Update storefront header navigation in `src/components/layout/storefront-header.tsx` with direct link to `/catalog`, satisfies **AC-1**
10. [x] Write Vitest component and query test suites in `src/components/catalog/__tests__/` covering filtering logic, drawer expansion, and cart addition, satisfies **AC-1**, **AC-2**, **AC-4**, **AC-5**

## Consequences

**Positive**:
- Dedicated `/catalog` route provides a comprehensive browsing experience for culinary customers seeking specific nectar origins.
- Eager static data resolution ensures instantaneous navigation and zero database latency.
- Native CSS grid transitions provide smooth viscous animations without adding heavy third party animation packages.
- Shareable URL search parameters support deep linking and organic social sharing of specific honey categories.

**Negative / tradeoffs**:
- Maintaining static catalog data requires code changes for new honey batches until a headless content management system or database is integrated.
- Adding a dedicated `/catalog` route introduces multi page routing to an experience that was previously focused on the home page hero sequence.

**Neutral**:
- Navigation header links now combine in page anchors (`#harvest-story`) with route links (`/catalog`), requiring clear visual indicator styling.

## Follow-up

- [ ] Connect individual variety card click to dedicated product detail pages (`/catalog/[slug]`) if deeper harvest storytelling is requested in a future slice.
- [ ] Add taste radar visual chart component using SVG when sensory flavor coordinates expand beyond 5 axis ratings.

## Rationale

Reasoning, options considered, and references: see [rationale.md](rationale.md).
