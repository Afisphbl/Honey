# 0006. Brand Heritage and Apiary Story

**Date**: 2026-10-17
**Status**: Accepted

## Summary

This decision defines the dedicated brand heritage and apiary narrative route for Honey at `/about`. Visitors explore single origin terroirs across the Catskills, Black Forest, Provence, and Apalachicola using an interactive tabbed atlas displaying geographic coordinates, regional elevations, and flora ecosystems. An interactive seasonal harvest cycle details the annual apiculture rhythm across Spring, Summer, Autumn, and Winter, alongside laboratory purity verification badges and ethical hive stewardship pledges. All heritage records render on the server with React Server Components, while interactive origin and season selections synchronize through shallow URL search parameters, delivering rapid page loads, complete search engine visibility, and graceful fallbacks under reduced motion preferences.

## Requirements

**User stories**:
- As a customer who values food provenance, I want to explore the geographic regions where Honey harvests its nectar so that I can understand how local elevation, climate, and flora shape distinct flavor profiles.
- As an apiculture enthusiast, I want to inspect each apiary origin to learn about the lead beekeeper, active hive counts, and local floral canopies.
- As a discerning buyer, I want to examine an interactive seasonal harvest timeline so that I can anticipate when specific honeys are extracted and understand the winter dormancy period.
- As a conscious consumer, I want to verify laboratory purity testing standards (such as nuclear magnetic resonance spectroscopy and moisture content under 18 percent) so that I have absolute confidence in product purity.
- As an ethical shopper, I want to review the brand commitments to bee colony welfare and sustainable hive management.
- As a visitor sharing a specific terroir or seasonal story with friends, I want tab selections to update the browser URL search parameters without page reloads so that I can send a direct bookmarkable link.
- As a user with motor sensitivities or reduced motion settings, I want all tabs and disclosures to navigate via keyboard with instant transitions that respect my motion preferences.

**Acceptance criteria**:
- **AC-1**: The storefront provides a dedicated `/about` page route linked from the floating header navigation and the dark charcoal footer, featuring an editorial proclamation header, four core narrative sections, and a closing reserve honey tasting invitation.
- **AC-2**: An interactive Apiary Terroir Atlas renders tabbed origin profiles for Catskill Highlands, Black Forest Foothills, Valensole Plateau, and Apalachicola Basin, displaying regional elevation in meters, climate type, lead beekeeper name, hive count, flora ecosystem, geographic coordinates, and links to honeys harvested at that site.
- **AC-3**: An interactive Seasonal Harvest Cycle displays the four annual apiculture phases (Spring Awakening, Summer Nectar Flow, Autumn Harvest and Comb Pressing, Winter Colony Rest) with active month ranges, floral blooms, apiculture tasks, and seasonal honey availability badges.
- **AC-4**: A Laboratory Purity Verification section displays four verification badges (Nuclear Magnetic Resonance floral profiling, moisture content under 18 percent, zero synthetic pesticide residues, and raw unpasteurized certification) with verification metrics, testing methods, and issuing laboratory standards.
- **AC-5**: An Ethical Beekeeping Pledges section presents four foundational commitments (Hive Welfare, Raw Unheated Extraction, Terroir Conservation, Fair Trade Apiary Stewardship) with artisanal iconography and detailed commitment explanations.
- **AC-6**: Active origin and seasonal tab selections synchronize with browser URL search parameters (`/about?origin=catskill-highlands` and `/about?season=summer`) using shallow Next.js routing, falling back silently to the first origin and season if parameters are missing or invalid.
- **AC-7**: When an apiary origin or season has no currently available harvested honey jars, the interface renders a graceful artisanal badge reading `Resting for next harvest` with a direct link to explore the complete catalog at `/catalog`.
- **AC-8**: Tab controls support full keyboard navigation using arrow keys, space, and enter, with explicit ARIA roles (`role="tab"`, `aria-selected`, `role="tabpanel"`), and all visual transitions snap instantly without movement when `prefers-reduced-motion` is active.

## Decision

**Chosen option**: Option 1: Dedicated `/about` route with React Server Component data rendering, shallow URL search parameter synchronization, and composable artisanal UI primitives

We construct a dedicated editorial route at `src/app/about/page.tsx` backed by static catalog queries in `src/lib/catalog/queries.ts`. Interactive origin atlas and seasonal cycle components synchronize their active selection with URL query parameters via Next.js `useSearchParams`. The interface composes existing design system primitives (`Card`, `Badge`, `Tabs`, `Button`) with dedicated domain narrative components, styled using warm OKLCH amber tokens and editorial typography.

**Implementation skills**: `impeccable` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/impeccable`) · `taste-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/taste-skill`) · `ui-ux-pro-max-skill` (`C:/Users/YES-COMPUTER-ET/.gemini/config/skills/ui-ux-pro-max-skill`) · `tailwind-4-docs` (`.agents/skills/tailwind-4-docs/`) · `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`)

## Rationale

Reasoning, alternatives considered, and architectural tradeoffs: see [rationale.md](rationale.md).

## Feature design

**Data model sketch**:
The heritage narrative consumes the existing apiary origin domain from spec 0002, expanded with typed schemas for seasonal phases, purity standards, and ethical pledges:

- `ApiaryOrigin` (Existing): `id`, `region`, `elevationMeters`, `climate`, `beekeeperName`, `hiveCount`, `floraEcosystem`, `purityTested`, `coordinates: { latitude: number, longitude: number }`.
- `SeasonalCyclePhase` (New):
  - `id`: string (unique identifier, such as `spring-awakening`)
  - `season`: enum (`"spring"`, `"summer"`, `"autumn"`, `"winter"`)
  - `title`: string (such as `Early Spring Awakening & Linden Blossom`)
  - `timeframeMonths`: string (such as `April to May`)
  - `apicultureActivity`: string (such as `Brood chamber inspection, colony health checks, and comb building`)
  - `activeFlora`: string array (such as `["Basswood Linden", "Wild Apple Blossom", "Dandelion"]`)
  - `honeyAvailability`: enum (`"harvesting"`, `"aging"`, `"reserve"`, `"dormant"`)
  - `featuredProductIds`: optional string array referencing `Product.id`
  - `storyExcerpt`: string (editorial prose describing the seasonal terroir)
- `PurityStandard` (New):
  - `id`: string (such as `nmr-spectral-profiling`)
  - `name`: string (such as `Nuclear Magnetic Resonance Profiling`)
  - `verificationMetric`: string (such as `100% Botanical Pollen Concordance`)
  - `testingMethod`: string (such as `High resolution 400 MHz NMR Spectroscopy`)
  - `issuingAuthority`: string (such as `European Apiculture Purity Laboratory, QSI Bremen`)
  - `thresholdRequirement`: string (such as `Zero synthetic syrups, zero C4 sugar markers`)
  - `description`: string (thorough explanation of the chemical test)
  - `badgeIcon`: string (icon name, such as `"shield-check"`, `"microscope"`, `"dna"`, `"droplets"`)
- `BeekeepingPledge` (New):
  - `id`: string (such as `raw-unheated-extraction`)
  - `title`: string (such as `Raw Cold Extraction Guarantee`)
  - `category`: enum (`"hive_welfare"`, `"raw_purity"`, `"terroir_conservation"`, `"fair_trade"`)
  - `statement`: string (core pledge sentence)
  - `details`: string (expanded stewardship description)
  - `badgeIcon`: string (icon identifier, such as `"thermometer-snowflake"`, `"heart-handshake"`, `"sparkles"`, `"leaf"`)
- `ApiaryOriginDetail` (Derived View Record): composite type resolving `ApiaryOrigin` alongside its harvested `products: Product[]` retrieved from catalog queries.

**State transitions**:
1. Apiary Terroir Atlas tab navigation:
   - Initial load: page reads `?origin=<slug>` from URL search params. If absent or unmatched, falls back to `catskill-highlands`.
   - Origin tab switch: user clicks tab or presses arrow keys -> client router pushes shallow search param `/about?origin=valensole-plateau` -> active atlas view switches with viscous fade transition.
2. Seasonal Cycle selection:
   - Initial load: page reads `?season=<slug>` from URL search params. If absent or unmatched, falls back to `spring`.
   - Season pill switch: user clicks season pill or presses keyboard keys -> shallow search param updates `/about?season=summer` -> timeline details and active flora change smoothly.
3. Reduced motion behavior:
   - When `prefers-reduced-motion` is active, all tab panel transitions and pill indicator shifts snap instantly with zero animated translation or opacity interpolation.

**API surface**:
The heritage feature runs entirely through server side React Server Component data queries, with zero external network overhead:

| Function or Query | Type | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `getApiaryOrigins()` | Pure catalog query | None | `ApiaryOrigin[]` | Public | None (in memory static data) |
| `getApiaryOriginById(id)` | Pure catalog query | `id: string` | `ApiaryOrigin \| undefined` | Public | Returns `undefined` if ID not found |
| `getSeasonalCyclePhases()` | Pure catalog query | None | `SeasonalCyclePhase[]` | Public | None (in memory static data) |
| `getPurityStandards()` | Pure catalog query | None | `PurityStandard[]` | Public | None (in memory static data) |
| `getBeekeepingPledges()` | Pure catalog query | None | `BeekeepingPledge[]` | Public | None (in memory static data) |
| `getApiaryOriginDetails(id)` | Pure catalog query | `id: string` | `ApiaryOriginDetail \| undefined` | Public | Resolves origin with matching products |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Render page header | Editorial headline, subhead, and manifesto | Static editorial copy in `src/app/about/page.tsx` |
| Render Apiary Terroir Atlas | Elevation, coordinates, climate, beekeeper, flora | `ApiaryOrigin` records in `src/lib/catalog/data.ts` |
| Display apiary harvested honeys | Honey jar title, batch number, starting price | `Product` records resolved via `originId` in `src/lib/catalog/queries.ts` |
| Display empty harvest state | `Resting for next harvest` badge and catalog link | Fallback conditional in `ApiaryTerroirAtlas` component |
| Render Seasonal Harvest Cycle | Months, apiculture tasks, bloom list, honey status | `SeasonalCyclePhase` collection in `src/lib/catalog/data.ts` |
| Render Purity Verification Grid | Metric, testing method, threshold, issuing lab | `PurityStandard` collection in `src/lib/catalog/data.ts` |
| Render Ethical Pledges | Category, title, pledge statement, deep details | `BeekeepingPledge` collection in `src/lib/catalog/data.ts` |
| Synchronize URL search params | Current active `origin` and `season` query keys | Next.js `useSearchParams` in client island wrappers |
| Render tasting CTA | Direct link to `/catalog` or `/catalog#tasting-flight` | Static link with `Button asChild` component |

**Key invariants**:
- Botanical origin truth: every apiary record must correspond to real geographic coordinates, verifiable elevation meters, and genuine floral canopies.
- Chemical purity thresholds: laboratory standards must declare concrete testing methods (such as 400 MHz NMR spectroscopy) and quantifiable thresholds (such as moisture strictly under 18 percent).
- Graceful URL resilience: invalid or unrecognized `origin` and `season` query parameter strings must never trigger errors or white screens; they must silently normalize to default entries (`catskill-highlands` and `spring`).
- Motion accessibility: `prefers-reduced-motion` must disable all animated transitions across tab switches and accordion disclosures.

**Security model**:
- All heritage records are public and read only.
- No user authentication or session cookie is required to access `/about`.
- No customer personally identifiable information is processed or stored.
- All rendered text is static domain data, eliminating injection risks.

**Configuration required**:
- None. No new environment variables, external API tokens, or secrets are required.

**Critical test scenarios**:
- Happy path: visitor navigates to `/about`, reviews all four narrative sections, switches apiary tabs to Valensole Plateau, and clicks the reserve tasting CTA, verifying **AC-1**, **AC-2**, **AC-3**, **AC-4**, and **AC-5**.
- URL synchronization and bookmarking: visitor navigates directly to `/about?origin=black-forest-foothills&season=autumn`, verifying the correct apiary tab and seasonal cycle phase mount as active, verifying **AC-6**.
- Invalid URL parameter fallback: visitor enters `/about?origin=unknown_mountain&season=monsoon`, verifying the interface silently defaults to Catskill Highlands and Spring without runtime exceptions, verifying **AC-6**.
- Empty harvest state handling: visitor inspects an apiary with no active jars in stock, verifying the `Resting for next harvest` badge displays cleanly alongside the link to the catalog, verifying **AC-7**.
- Keyboard navigation and reduced motion: user navigates tab controls using arrow keys and triggers selection with space bar, verifying proper ARIA roles and instantaneous visual updates without motion under `prefers-reduced-motion`, verifying **AC-8**.

## Build plan

The build plan follows the project Tracer Bullet approach, standing up an end to end vertical thread through data schemas, query helpers, page routing, and interactive narrative components before polishing visual flourishes:

1. Define Zod schemas and TypeScript domain interfaces for `SeasonalCyclePhase`, `PurityStandard`, and `BeekeepingPledge` in `src/lib/catalog/schema.ts` and `src/types/catalog.ts`, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**.
2. Seed artisanal heritage records for all four seasons, laboratory verification standards, and ethical beekeeping pledges in `src/lib/catalog/data.ts`, satisfies **AC-3**, **AC-4**, **AC-5**.
3. Implement pure query helpers in `src/lib/catalog/queries.ts` (`getSeasonalCyclePhases`, `getPurityStandards`, `getBeekeepingPledges`, `getApiaryOriginDetails`), satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**.
4. Create the dedicated page shell at `src/app/about/page.tsx` with editorial hero header, section anchors, metadata export, and reserve tasting invitation, satisfies **AC-1**.
5. Build the interactive `ApiaryTerroirAtlas` component with tabbed origin selector, elevation badges, flora lists, and harvested product links, satisfies **AC-2**, **AC-6**, **AC-7**, **AC-8**.
6. Build the interactive `SeasonalHarvestCycle` component with seasonal phase selector, bloom calendar notes, and honey availability chips, satisfies **AC-3**, **AC-6**, **AC-8**.
7. Build the `PurityVerificationGrid` and `EthicalBeekeepingPledges` components displaying laboratory certificates and stewardship standards, satisfies **AC-4**, **AC-5**.
8. Connect global navigation links in the storefront header and footer to `/about`, satisfies **AC-1**.

## Consequences

**Positive**:
- Establishes a dedicated, immersive narrative home for Honey without cluttering the high performance scroll hero on the front page.
- Provides tangible proof of artisanal purity through concrete laboratory metrics, building trust with discerning gourmet customers.
- Shareable URL search parameters empower customers and food writers to bookmark and share specific terroirs or seasonal stories directly.
- Zero client side data fetching overhead ensures instant server rendered performance and flawless search engine crawling.

**Negative / tradeoffs**:
- Introduces another route to maintain alongside the catalog and home storefront.
- Requires keeping seasonal bloom schedules and beekeeper notes aligned with future product harvests.

**Neutral**:
- Reuses existing design system components and OKLCH color tokens, maintaining total visual harmony with the rest of the storefront.

## Follow-up

- [x] Update header navigation bar and footer components to link to `/about` once the page shell is established.
