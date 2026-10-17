# Review, development, 2026-10-17

**Reviewed by**: Gemini Pro (author on Gemini Flash)
**Scope**: 22 files, branch vs main
**Verdict**: Changes requested

## Summary
This change set builds the full screen canvas hero stage, scroll scrubber, editorial header, and sequential featured buy box with reactive cart drawer integration. The visual polish, luxury styling, and end to end cart interaction work smoothly, and 156 unit tests pass alongside browser Cypress testing. One major performance issue in frame prefetching must be addressed, along with minor fixes for navigation anchor linking and checkout alerts before merge.

## Major

### 🟠 Sliding frame cache update placed inside cache miss branch causes scroll stutter, `src/components/hero/hero-canvas-scrubber.tsx:99`
**Problem**: In `drawFrame`, `cache.updateActiveWindow(index)` is only called inside the `else` block when an image is missing or incomplete. When a frame is already loaded, `updateActiveWindow` is skipped entirely.
**Why it matters**: The `updateActiveWindow` method is the only mechanism that evicts out of range frames to keep memory bounded, and it also triggers speculative prefetching for upcoming frames. Because it only executes on a cache miss, speculative loading halts while scrolling through cached frames. Shoppers will encounter frame drops and stutter at window boundaries, and expired frames linger in memory longer than necessary.
**Suggested fix**: Move `cache.updateActiveWindow(index)` outside the conditional check so that it executes whenever the active frame index updates, keeping speculative preloading and memory eviction continuous.

## Minor

### 🟡 Extraction Story navigation anchor points to non existent element identifier, `src/components/layout/storefront-header.tsx:69`
**Problem**: The navigation link uses `href="#harvest-story"`, but the hero section container defines `id="hero-scroll-track"`, and no element on the page carries `id="harvest-story"`.
**Why it matters**: Clicking the Extraction Story link in the sticky editorial navigation bar does not scroll to the harvest sequence because the anchor target does not exist in the document.
**Suggested fix**: Add `id="harvest-story"` to the hero section container in `StorefrontHeroSection`, or update the link in `StorefrontHeader` to match the existing element identifier.

### 🟡 Native alert dialog used for checkout placeholder in cart drawer, `src/components/cart/cart-drawer.tsx:217`
**Problem**: The Complete Reserve Order button executes a native browser `alert` call.
**Why it matters**: Native alert dialogs are blocking, pause the JavaScript execution thread, clash with luxury editorial design, and can break headless automated testing or embedded web views.
**Suggested fix**: Replace the native alert with a non blocking status notification, an accessible modal note, or a disabled button state with informative helper text until Slice 4 is implemented.

## Nits

- ⚪ `src/components/hero/hero-canvas-scrubber.tsx:16`, `HeroCanvasScrubberProps` defines `posterUrl` but the component implementation never destructures or uses this prop.
- ⚪ `src/components/ui/badge.tsx:5`, The new `size` prop supporting `sm`, `md`, and `lg` options was added without matching unit test assertions in `src/components/ui/__tests__/badge.test.tsx`.
- ⚪ `src/components/layout/storefront-header.tsx:1`, `StorefrontHeader` and `StorefrontFooter` are tested through `page.test.tsx` but lack dedicated test files beside their source files.

## Strengths

- The 300vh full viewport canvas stage and 150 frame extraction sequence deliver an immersive luxury experience without distracting frame number badges, satisfying AC-1 and AC-4.
- The `useScrollFrame` hook provides smooth 60fps dampening with passive scroll listeners, proper animation frame cancellation, and clean system reduced motion accommodations with an accessible manual range scrubber.
- The end to end integration from variant selection in the buy box to optimistic cart counter updates in the header and automatic cart drawer opening is seamless and verified by both unit and Cypress browser tests.

## Test coverage

The test coverage is solid and high signal, with 156 Vitest unit tests passing across 20 test files, plus a full Cypress browser test in `cypress/e2e/storefront-loop.cy.ts`. The test suite thoroughly validates canvas resolution scaling, device pixel ratio clamping, sliding frame eviction, scroll progress math, variant pricing switching, and cart store persistence. Minor test gaps include missing unit assertions for the new Badge size prop and the absence of co located unit test suites for layout header and footer components.
