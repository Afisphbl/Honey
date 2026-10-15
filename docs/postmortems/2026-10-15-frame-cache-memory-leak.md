# Postmortem: Frame Cache Memory Leak on Fast Scrubbing (2026-10-15)

| | |
|---|---|
| **Severity** | SEV2 (major defect discovered during code review before production release) |
| **Duration** | 16:06 UTC+3 to 16:47 UTC+3 (41 minutes) |
| **User impact** | Storefront visitors on mobile Safari and lower memory devices would experience tab crashes when rapidly scrubbing through the 150 hero animation frames because browser memory exceeded the 80MB safety ceiling. |
| **Status** | Monitoring |

## Summary

During the code review gate for the foundational stack and architecture slice, a memory leak was discovered in the sliding frame cache. As a visitor quickly scrubbed the hero canvas, frame requests were dispatched asynchronously, but older frames completed loading after the active sliding window had already moved forward. The completion callback inserted those overdue images directly into the cache without checking whether they were still within the active window boundaries, causing total memory to expand past 150MB instead of staying bounded under 80MB. Additionally, the unit test suite passed without catching this defect because the mock test runner did not simulate asynchronous image load events. The review flagged the defect before merge, prompting an active window boundary check in the load callback and a generation counter to invalidate in flight image loads.

## Timeline

_All times UTC+3._

- **16:06**: Initial canvas frame loader implementation completed in `src/lib/canvas/frame-loader.ts` to satisfy acceptance criterion AC-6.
- **16:16**: Verification test suite executed, where all unit tests passed including `bounds frame cache window and clears memory cleanly`.
- **16:47**: Senior code review completed by a fresh model in `docs/reviews/2026-10-15-main.md`, identifying that late resolving image loads bypassed sliding window bounds and that the test asserted zero equals zero without populating frames.
- **16:55**: Remediation plan created to add active window containment checks in the image load callback and to test mock cache eviction directly.

## Root cause

The windowed cache relies on `updateActiveWindow` to evict frames outside a radius of eight images from the current scroll position. However, `loadFrame` initiates an asynchronous browser image load and stores the promise in a pending map. When a visitor scrolls rapidly, `updateActiveWindow` evicts cached frames, but unresolved background image loads continue executing in the background. When those delayed image loads eventually succeed, the `onload` handler unconditionally calls `this.cache.set(clamped, img)`. Because the handler did not verify whether `clamped` still fell within the current active window radius, every loaded frame accumulated in memory over time.

## Contributing factors

- The unit test in `src/lib/canvas/__tests__/frame-loader.test.ts` ran under `happy-dom`, which does not fire real image load events synchronously, leaving the cache empty during test assertions.
- The test asserted cache size before and after clearing without verifying actual window eviction or boundary checks.
- Image loading lifecycle management lacked a generation token or cancellation signal to ignore obsolete in flight network requests.

## What went well

- The multi model code review gate caught the memory leak before any code reached production or the main deployment branch.
- The architectural specification in `docs/specs/0001-stack-and-architecture/index.md` explicitly defined the 80MB memory boundary criterion (AC-6), making the defect clear and verifiable.
- Clear separation between the canvas render component and the frame loader class simplified localization and testing.

## Action items

| Action | Type | Owner | Priority |
|---|---|---|---|
| Add active window validation in image `onload` callback and discard frames outside the current window radius | Prevent | Frontend Team | P0 |
| Introduce an active generation counter in `WindowedFrameCache` to cancel in flight loads on cache clear | Prevent | Frontend Team | P0 |
| Update frame loader unit tests to simulate populated cache entries and verify window eviction logic | Detect | Frontend Team | P1 |
| Add memory profiling checks in mobile browser end to end tests | Detect | QA Team | P2 |

## Lessons

Unit tests that assert memory boundaries must simulate real populated state rather than checking empty defaults. Relying on asynchronous side effects without cancellation tokens or boundary validation allows stale data to pollute memory caches. Running a fresh model review before merging foundational code proves invaluable for identifying subtle concurrency and memory leaks.
