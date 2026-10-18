# 0006. Brand Heritage and Apiary Story (Rationale)

**Date**: 2026-10-17

## Context

Artisanal food brands face a critical challenge in modern e commerce: conveying genuine provenance and culinary integrity in a digital medium dominated by mass produced commodities. Honey harvests raw, unpasteurized honey across four distinct microclimates in North America and Western Europe: the subalpine Catskill Highlands, the ancient acacia groves of the Black Forest foothills, the sun drenched lavender plateaus of Provence, and the subtropical wetlands of the Apalachicola River basin. Each of these terroirs imparts distinct mineral, floral, and enzymatic qualities into the nectar. Customers seeking luxury single origin honey require deep contextual proof that the honey in their jar originates from ethical, chemical free hives and certified beekeepers.

Without a dedicated brand heritage experience, visitors are left to evaluate honeys purely by price, volume, and jar photography. The storefront runs the risk of feeling transactional rather than artisanal. Furthermore, consumer skepticism around commercial honey adulteration (such as corn syrup dilution, high temperature pasteurization that destroys beneficial enzymes, and ultra filtration that strips natural pollens) demands radical transparency. Discerning buyers want to inspect verifiable laboratory standards, including Nuclear Magnetic Resonance profiling, pollen counts, and moisture thresholds.

Technical and UX forces also shape this decision. The storefront core hero features a 150 frame canvas animation designed for high performance visual impact, while the `/catalog` route provides streamlined commercial exploration. Squeezing long form apiculture essays, harvest calendars, and laboratory certificates into either existing surface would overwhelm the interface and damage page performance. The narrative experience must live where it has room to breathe, while maintaining immediate accessibility, rapid initial load speeds, and shareable URL state for individual harvest stories.

## Options considered

### Option 1: Dedicated `/about` route with React Server Component data rendering, shallow URL search parameter synchronization, and composable artisanal UI primitives

This option establishes a dedicated full page narrative route at `/about`. Narrative records for the apiary atlas, seasonal harvest timeline, laboratory purity standards, and ethical pledges are resolved on the server via pure catalog query functions and rendered as accessible Server Components. Interactive tabbed atlas views and seasonal timeline steps synchronize with browser URL query parameters (`?origin=catskill-highlands` and `?season=summer`) via shallow Next.js routing, enabling direct sharing and bookmarking without client side fetch latency or layout shift.

**Pros**:
- Dedicated URL route provides dedicated space for immersive editorial storytelling without distracting from the commercial checkout funnel.
- Shallow URL search parameter synchronization gives customers and culinary writers direct links to specific apiaries or seasonal phases.
- Server side rendering delivers instantaneous first contentful paint and complete search engine indexability for brand storytelling.
- Reuses existing design system components (`Card`, `Badge`, `Tabs`, `Button`) and OKLCH color tokens with zero additional JavaScript libraries.

**Cons**:
- Introduces another route to maintain in the site navigation structure.
- Requires coordinating cross route links between the catalog, home hero, and the heritage page.

### Option 2: Embedded story narrative sections directly on the home page below the scroll hero and catalog

This option appends the brand heritage narrative, apiary cards, seasonal timeline, and laboratory badges directly onto the single page home storefront below the interactive canvas scrubber.

**Pros**:
- Keeps the entire brand experience contained within a single scrolling page.
- Avoids creating an additional route file in the Next.js app directory.

**Cons**:
- Significantly increases the initial document object model size and byte weight of the home page, degrading performance.
- Dilutes the immediate impact of the canvas hero and the featured product buy box.
- Makes individual apiary origins and harvest seasons impossible to bookmark or share directly via unique URLs.

### Option 3: Heavy interactive WebGL 3D globe and animated canvas apiculture journey

This option constructs a bespoke 3D visualization using Three.js or WebGL, allowing visitors to spin a virtual globe, zoom into satellite apiary coordinates, and watch simulated bee flight paths through animated camera movements.

**Pros**:
- Provides high visual novelty and impressive technological demonstration.
- Creates memorable visceral engagement during initial visits.

**Cons**:
- Substantially inflates JavaScript bundle size and memory consumption, exceeding our 80MB browser memory ceiling.
- Severely impairs accessibility for screen readers and keyboard only navigators.
- Fails on low power mobile devices and consumes excessive battery life.
- Slows down initial page loading times, directly contradicting our performance principles.

## Rationale

We selected Option 1 because it achieves the ideal balance of editorial luxury, uncompromising performance, and web accessibility. Establishing a dedicated `/about` route gives our apiculture narrative the deliberate pacing and dignity expected of a heritage food producer, rather than forcing the story to compete with commerce triggers on the home page.

Using server rendered React Server Components guarantees that every beekeeper profile, elevation measurement, and laboratory purity certificate is immediately readable by search engines and assistive technology, with zero client side network requests. Synchronizing the active origin atlas and seasonal cycle with shallow URL search parameters allows food writers, partners, and customers to share deep links directly to specific harvest stories (such as the Valensole lavender bloom or the Black Forest acacia flow).

Option 2 was rejected because it would overload the home page document and compromise the smooth performance of our canvas scroll scrubber. Option 3 was rejected because a heavy 3D globe would violate our strict 80MB memory budget, penalize mobile visitors, and create severe accessibility barriers for assistive devices. Option 1 delivers artisanal beauty while keeping our architecture lean, resilient, and fast.
