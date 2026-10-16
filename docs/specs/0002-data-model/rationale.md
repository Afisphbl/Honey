# Rationale: 0002. Honey Catalog and Commerce Data Model

**Date**: 2026-10-15

## Context

The Honey storefront requires rich domain modeling to showcase luxury single origin reserves, seasonal infusions, and raw comb cuts while supporting an interactive commerce loop. The catalog must capture detailed terroir details, floral sources, and sensory attributes such as sweetness scales, flavor notes, and crystallization textures. Customers also need flexible jar selections across weights, fluid ounces, and metric volumes, with transparent pricing and real time cart calculations.

Previous foundational work established Next.js App Router, React 19, and Tailwind CSS v4 alongside a Zustand cart store in `src/lib/store/cart-store.ts`. However, product variants and cart items currently rely on ad hoc types lacking validation, terroir relationships, or catalog linking. Without a centralized, validated data model, upcoming storefront slices, including the scroll hero sequence, tasting note filters, and checkout drawer, will duplicate entity shapes and suffer from interface drift.

Because the storefront is hosted on Vercel as a performant brand showcase, introducing an external database or heavy object relational mapping layer would add unnecessary latency, cold starts, and hosting maintenance. We need a lightweight, type safe data architecture that compiles cleanly at build time, validates inputs at runtime, and persists customer cart sessions and completed orders in browser storage.

## Options considered

### Option 1: TypeScript static dataset with Zod runtime schema assertions

Define domain types and seed records directly in TypeScript, accompanied by Zod schemas for runtime boundary parsing and route validation.

**Pros**:
- Zero database hosting cost, zero connection latency, and instant edge compilation.
- Complete type inference between runtime validation schemas and static TypeScript interfaces.
- Eliminates cloud cold starts while ensuring strict boundary safety for order submissions.

**Cons**:
- Catalog updates require a code commit and redeployment rather than a database write.

### Option 2: Embedded SQLite database with Prisma ORM

Store honey varieties, variants, and orders in a local SQLite file managed by Prisma.

**Pros**:
- Familiar relational query syntax with foreign key constraint enforcement.
- Allows dynamic server side mutations without redeployment.

**Cons**:
- Incompatible with serverless read only filesystems on edge deployments.
- Adds heavy binary dependencies and compilation overhead for static catalog data.

### Option 3: Headless e-commerce platform API integration

Integrate a third party commerce backend such as Shopify Storefront API.

**Pros**:
- Offloads inventory synchronization and checkout processing to an established service.
- Provides an external merchant dashboard for catalog editing.

**Cons**:
- Introduces third party API latency, rate limits, and authentication token requirements.
- Imposes rigid external schemas that complicate custom apiculture tasting scales and canvas scroll anchors.

## Rationale

Option 1 provides the highest performance and reliability for an artisanal brand experience. Because the honey collection represents curated seasonal harvests rather than a massive fast churn inventory, static compilation delivers immediate zero latency page loads with complete SEO metadata. Pairing static data with Zod gives us compile time confidence and server route validation without the operational burden or serverless file system restrictions of Option 2. It avoids the latency, configuration secrets, and inflexible schema constraints of Option 3, keeping our apiculture storytelling and interactive canvas scrubbing fully responsive.

## References

**Project sources**:
- Root configuration and architecture conventions in `AGENTS.md` (basis: project stack, Zustand persistence, TypeScript conventions)
- Foundational stack decision in `docs/specs/0001-stack-and-architecture/index.md` (basis: Next.js App Router, React 19, Zustand local storage guard)
- Storefront build roadmap in `docs/scope/scope.md` (basis: Feature 3 scope, Tracer Bullet approach)

**Practices & standards**:
- Schema declaration and runtime validation with TypeScript type inference (basis: Zod schema validation)
- Standardized HTTP request handling in Next.js App Router (basis: Next.js Route Handlers)
- Atomic client state with hydration guards for server rendered applications (basis: Zustand store persistence patterns)
- Deterministic integer currency representation avoiding floating point precision errors (basis: Martin Fowler Money pattern)

**Links**:
- [Zod TypeScript-first schema validation](https://zod.dev/)
- [Next.js App Router Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
