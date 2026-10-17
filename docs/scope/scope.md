# Scope: Honey Storefront

Premium artisanal honey brand website with an interactive video like scroll hero sequence, rich storytelling, and a full online storefront.

**Build approach:** Tracer Bullet (prove the whole pipe works with thin vertical slices through every layer).
**Workflow:** GA (after develop, check verify, test, fresh model check review, then document). The project default level of rigor. /architect is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. · GA) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | done |
| 2 | Coding standards & tooling | Foundation | planned |
| 3 | Data model | Foundation | done |
| 4 | Design system & UI foundation | Foundation | done |
| 5 | Core storefront loop & scroll hero | Slice 1 | done |
| 6 | Product catalog & tasting notes | Slice 2 | planned |
| 7 | Brand heritage & apiary story | Slice 3 | planned |
| 8 | Cart drawer & order completion | Slice 4 | planned |

## Foundations

### 1. Stack & architecture
spec [0001](../specs/0001-stack-and-architecture/index.md) · code in `src/`

Decide the web framework, asset build pipeline, and hosting target, then scaffold a runnable project so every later slice builds on working structure.
**Done when:** the stack is recorded in a spec and the scaffold boots locally, compiles cleanly, and serves assets.
- [x] Decide the stack (spec): `/architect stack & architecture`
- [x] Scaffold from the decision: `/develop stack & architecture`
- [x] Verify it: `/check verify stack & architecture`
- [x] Test it: `/test stack & architecture`
- [x] Review it (fresh model): `/check review stack & architecture`
- [x] Document it: `/document stack & architecture`

### 2. Coding standards & tooling
Capture conventions, then install linting, code formatting, and pre-commit checks from the real scaffolded project.
**Done when:** root `AGENTS.md` reflects the real stack, and lint and format checks run clean.
- [ ] Capture conventions + tooling choices: `/audit`

### 3. Data model
spec [0002](../specs/0002-data-model/index.md) · code in `src/lib/catalog/`

Define core honey catalog entities, product variants (weights and jar sizes), inventory status, and cart session state.
**Done when:** entities and relationships represent products, jar volumes, prices, and cart sessions without ambiguity.
- [x] Design it (spec): `/architect data model`
- [x] Build it: `/develop data model`
  - [x] TypeScript domain interfaces and Zod validation schemas (AC-1, AC-2)
  - [x] Artisanal catalog seed records and query functions (AC-3)
  - [x] Pure pricing utilities and cart store type unification (AC-4, AC-5)
  - [x] Order route handler and price revalidation (AC-6)
- [x] Verify it: `/check verify data model`
- [x] Test it: `/test data model`
- [x] Review it (fresh model): `/check review data model`
- [x] Document it: `/document data model`

### 4. Design system & UI foundation
spec [0003](../specs/0003-design-system-and-ui-foundation/index.md) · code in `src/components/ui/`

Artisanal honey visual language, warm amber and gold tones, rich typography, fluid spacing, and base interactive components, guided by the installed craft skills `impeccable`, `ui-ux-pro-max-skill`, and `taste-skill` located in `C:\Users\YES-COMPUTER-ET\.gemini\config\skills`.
**Done when:** `design.md` covers type, color tokens, layout primitives, and base components meet accessible contrast standards.
- [x] Design it (spec): `/architect design system & UI foundation`
- [x] Build it: `/develop design system & UI foundation`
  - [x] Visual system specification in `design.md` (AC-1)
  - [x] Tailwind v4 `@theme` OKLCH tokens, fluid typography utilities, and scrollbar gutter (AC-2)
  - [x] Class merging helper `cn` in `src/lib/utils.ts` (AC-3)
  - [x] Base interactive primitives: Button with asChild, Badge, Card, and QuantitySelector (AC-4)
  - [x] Accessible Radix UI overlay primitives: Drawer, Dialog, and Tabs (AC-5, AC-6)
- [x] Verify it: `/check verify design system & UI foundation`
- [x] Test it: `/test design system & UI foundation`
- [x] Review it (fresh model): `/check review design system & UI foundation`
- [x] Document it: `/document design system & UI foundation`


## Slice 1: Core storefront loop & scroll hero

### 5. Core storefront loop & scroll hero
spec [0004](../specs/0004-core-storefront-loop-scroll-hero/index.md) · code in `src/`

Interactive canvas scrubber displaying the 150 frame animation sequence on scroll, connected to a featured honey jar with variant selection, add to cart action, and cart state count. This slice serves as the walking skeleton proving the full pipeline works end to end.
**Done when:** visitor can scroll to scrub the 150 frames smoothly in a canvas, select a jar size, add to cart, and see the cart badge update.
- [x] Design it (spec): `/architect core storefront loop & scroll hero`
- [x] Build it: `/develop core storefront loop & scroll hero`
  - [x] Floating transparent storefront header with backdrop blur (AC-1)
  - [x] Full screen canvas scrubber with smooth scrubbing and hidden counter numbers (AC-1, AC-3, AC-4)
  - [x] Sequential featured buy box with variant selector and dynamic pricing (AC-5)
  - [x] Add to cart action and automatic cart drawer opening (AC-6)
- [x] Verify it: `/check verify core storefront loop & scroll hero`
- [x] Test it: `/test core storefront loop & scroll hero`
- [x] Review it (fresh model): `/check review core storefront loop & scroll hero`
- [x] Document it: `/document core storefront loop & scroll hero`

## Slice 2: Product catalog & tasting notes

### 6. Product catalog & tasting notes · needs a decision
Browse premium honey varieties (Raw Wildflower, Acacia, Lavender, Comb honey) with tasting profiles, harvest origins, and floral sources.
**Done when:** visitor can filter varieties, view tasting notes, inspect floral sources, and choose between single jars or bundles.
- [ ] Design it (spec): `/architect product catalog & tasting notes`

## Slice 3: Brand heritage & apiary story

### 7. Brand heritage & apiary story · needs a decision
Narrative journey highlighting sustainable beekeeping, ethical hive management, raw extraction purity badges, and seasonal harvest timeline.
**Done when:** visitor can read the harvest timeline, review purity test verification badges, and explore the apiary locations.
- [ ] Design it (spec): `/architect brand heritage & apiary story`

## Slice 4: Cart drawer & order completion

### 8. Cart drawer & order completion · needs a decision
Slide over cart drawer with line item adjustments, delivery notes, shipping cost estimate, customer order form, and checkout receipt summary.
**Done when:** customer can adjust quantities in the cart drawer, enter shipping details, submit an order, and see a confirmed receipt.
- [ ] Design it (spec): `/architect cart drawer & order completion`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Wholesale inquiry portal**: bulk order pricing calculator and retailer application form · needs a decision
- **Customer reviews & ratings**: verified buyer reviews with star ratings and photos · needs a decision
- **Honey club subscription**: recurring seasonal harvest delivery service · needs a decision · GA
- **Internationalization**: multi currency display and translation support · needs a decision

## References

### Project sources
- Project archive: `ezgif-15929baa46c6720a-png-split.zip` containing 150 animation frames for the hero section
- User design guidance: Impeccable craft rules, high taste UI standards, and rich visual presentation
- Installed craft skills: `impeccable`, `ui-ux-pro-max-skill`, and `taste-skill` in `C:\Users\YES-COMPUTER-ET\.gemini\config\skills` governing design tokens, typography, visual hierarchy, and component styling

### Practices & standards
- Foundations before features: stack, data model, and design tokens established before complex feature building
- Tracer Bullet development: thin vertical slices connecting UI, business logic, and state management early
- High performance image sequence rendering: HTML5 Canvas drawImage combined with window requestAnimationFrame (basis: Canvas optimization best practices)
- Motion accessibility: respect system preferences for reduced motion (basis: WCAG 2.1 guideline 2.3)
- Modern web vitals: fast initial render, smooth 60 frames per second scroll scrubbing, and lazy loading offscreen assets (basis: Google Web Vitals)

### Links
- [CanvasRenderingContext2D: drawImage() method](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [Window: requestAnimationFrame() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [prefers-reduced-motion CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Google Web Vitals](https://web.dev/articles/vitals)

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally, `Decide the stack (spec)` on Stack & architecture), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | **`/architect` at spec capture** | `Design it` ticked; spec linked; `Build it: /develop <feature>` + **2 to 5 milestones**; the tier's closing boxes (`Verify it` Alpha+, `Test it` Beta+, `Review it` + `Document it` GA); any surfaced follow-up enrolled |
| `in-progress` (building) | `/develop` | milestone sub-boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | **you, when you decide it is** (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; the tier's last stage (`Prototype` → after `/develop`; `Alpha` → after `/check verify`; `Beta`/`GA` → after `/test`) is the suggested point to call it done; `/sync` captures conventions |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards & tooling). The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre-workflow) and `dropped` (de-scoped, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag = inherits it.
- **Workflow tier tag** beside a heading (e.g. `· GA`, `· Prototype`) sets that one feature's rigor above or below the project default; no tag inherits the default. It decides the feature's check boxes and each skill's next suggestion.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing (trust develop's own build time self check); **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
