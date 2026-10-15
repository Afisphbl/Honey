# Catalog Domain and Pricing Logic

Artisanal honey catalog entities, terroir origin records, sensory tasting profiles, deterministic pricing math, and runtime Zod validation schemas.

Governed by spec [0002-data-model](../../../docs/specs/0002-data-model/index.md).

## Structure

- `data.ts`: Static artisanal honey dataset with authentic harvest years, batch numbers, terroir origins, tasting profiles, and hero frame bounds
- `schema.ts`: Runtime Zod validation schemas for products, variants, shipping addresses, cart line items, and order submissions
- `pricing.ts`: Pure calculation helpers for line item totals, order subtotal cents, shipping fee tiers, and cart quantity limit validation
- `queries.ts`: Pure lookup functions for products, slugs, variants, and featured showcase honey
- `__tests__/`: Vitest test suites covering schema validation, pricing arithmetic, and catalog queries

## Rules and constraints

- All monetary amounts are integers representing positive cents in USD to avoid floating point rounding errors
- Quantities per variant are clamped to a minimum of 1 and a maximum of 10 jars
- Total cart items cannot exceed 30 items
- Orders over 5000 cents ($50.00) receive free shipping; otherwise standard shipping is 800 cents ($8.00)
- Empty cart calculations return zero cents across all total fields
- Catalog data in `data.ts` is static and treated as read only to ensure zero latency browsing

_Drafted by /sync from the introducing change, worth a quick human pass._
