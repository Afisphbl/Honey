# 0005. Product Catalog and Tasting Notes (Rationale)

**Date**: 2026-10-17

## Context

The Honey storefront launched with a focused hero sequence showcasing the flagship Raw Wildflower Reserve. While this provides an engaging introduction to the cold extraction process, customers visiting an artisanal apiary want to explore the full variety of harvests. Our apiaries produce distinct varietal honeys across diverse geographic regions, ranging from subalpine Catskill wildflowers and delicate Black Forest acacia canopies to fragrant Provençal lavender infusions and river basin tupelo blooms. Each harvest possesses distinct floral origins, crystallization tendencies, and flavor nuances that appeal to specific culinary uses.

Presenting this artisanal collection requires balancing immersive sensory storytelling with fast, utilitarian e commerce discovery. Discerning culinary buyers expect granular tasting profiles, sweetness ratings, aromatic intensity scales, and cheese pairing recommendations. At the same time, gift shoppers seek curated bundles and tasting flights that combine complimentary jars in keepsake packaging.

Several technical and architectural forces shape this design decision. First, the storefront must maintain rapid page loads and minimal JavaScript execution to honor our performance budget. Second, customers often share specific honey varieties or curated categories with friends, making shareable URLs with bookmarkable filter parameters a key capability. Third, sensory tasting notes must be readily inspectable without cluttering the visual hierarchy or requiring full page navigations for every jar. Finally, all interactive disclosures must satisfy accessible contrast standards and screen reader conventions.

## Options considered

### Option 1: Dedicated `/catalog` route with React Server Component data rendering, shallow URL search parameter synchronization, and native CSS grid expandable tasting drawers

This option establishes a dedicated full page catalog route at `/catalog`. Catalog records and tasting profiles are resolved statically on the server and passed to an interactive client grid. Active filter selections (category, sort order, and in stock status) synchronize directly with browser URL query parameters through shallow Next.js routing. Each variety card features a compact variant size pill selector and an expandable tasting drawer powered by native Tailwind CSS grid animations without third party motion libraries.

**Pros**:
- Dedicated URL route enables clean search engine indexing, social card metadata, and direct navigation from email campaigns or ads.
- Shallow URL search parameter sync creates bookmarkable, shareable links for filtered views without causing server round trips or layout flash.
- Native CSS grid transitions provide smooth viscous animations for tasting disclosures with zero additional bundle overhead.
- Card level jar size selectors allow immediate purchasing into the cart drawer without extra navigation steps.

**Cons**:
- Introduces multi page navigation to a storefront that initially presented as a single page scrolling narrative.
- Requires coordinating navigation links between home page section anchors and the new dedicated route.

### Option 2: Integrated home page section below hero buy box with modal dialog inspection

This option embeds the full honey variety catalog directly on the home page as a scrolling section positioned below the featured reserve buy box. Visitors filter varieties using tabbed buttons that update local component state. Clicking a variety card opens an accessible Radix Dialog modal displaying the full tasting radar, beekeeper profile, and floral source details.

**Pros**:
- Preserves the single page editorial narrative flow without routing transitions.
- Reuses the existing home page structure and header navigation anchors directly.

**Cons**:
- Significantly increases the home page DOM size and initial document weight with all product cards and tasting content.
- Filter selections cannot be shared or bookmarked because state is purely ephemeral component state.
- Modal dialogs interrupt the browsing rhythm by covering the catalog grid and requiring frequent open and close gestures.

### Option 3: Dedicated `/catalog` route with full client state filtering and external spring animation library

This option builds a dedicated catalog page where all product filtering, sorting, and tasting disclosures are managed entirely through client state in a Zustand store. Complex sensory drawer expansions and card reordering are animated using an external physics library such as Framer Motion or Motion One.

**Pros**:
- Allows physics based spring animations and layout animations during category filtering.
- Persists user filter preferences seamlessly across all browser tabs and subsequent visits.

**Cons**:
- Adds significant JavaScript bundle weight for animation runtime libraries that conflict with our lean performance goals.
- Bypasses standard browser navigation history, making the browser Back button fail to undo filter selections.
- Increases client memory usage on low end mobile devices during card list reordering.

## Rationale

We selected Option 1 because it directly satisfies our performance, accessibility, and merchandising goals with the cleanest architecture. Providing a dedicated `/catalog` route gives our variety collection the visual breathing room and editorial prominence expected of a luxury apiary brand, rather than squeezing six distinct reserves and gift bundles into the bottom of the home page.

Synchronizing filter selections with shallow URL search parameters gives customers shareable and bookmarkable links, which is essential for organic food recommendations and direct marketing campaigns. Because the underlying catalog data is static and pre bundled, the initial server render is instantaneous and fully accessible to search engine crawlers.

Leveraging modern CSS grid transitions (`grid-template-rows` from `0fr` to `1fr`) achieves the smooth viscous expansion motion specified in `design.md` with zero JavaScript animation libraries. This keeps browser execution light, memory well below our 80MB threshold, and fully honors `prefers-reduced-motion` settings.

Option 2 was rejected because overloading the home page degrades initial page weight and makes deep linking impossible. Option 3 was rejected because pulling in heavy third party animation packages violates our commitment to boring, dependable web standards and lightweight bundle delivery.

## References

**Project sources**:
- Project root context: `AGENTS.md` (Next.js App Router, React 19, Tailwind CSS v4, Zustand store conventions)
- Domain specification: `docs/specs/0002-data-model/index.md` (Product entities, tasting profiles, apiary origins, and pure pricing helpers)
- Design specification: `docs/specs/0003-design-system-and-ui-foundation/index.md` (Luxury amber tokens, fluid typography, and accessible UI primitives)
- Visual craft guidance: `design.md` (Editorial typography, viscous animation curves, and artisanal packaging standards)

**Practices & standards**:
- Tracer Bullet development: thin vertical slices connecting server rendering, client interaction, and state persistence early
- Zero dependency layout transitions: animating CSS grid rows for height disclosures without JavaScript measurement loops
- URL search parameters as single source of truth: keeping filter state in the address bar for shareable deep links and predictable history
- Accessible disclosure design: explicit `aria-expanded` attributes, accessible button labels, and reduced motion responsiveness

**Links**:
- [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [MDN CSS grid-template-rows animation](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows)
- [W3C WAI ARIA Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
