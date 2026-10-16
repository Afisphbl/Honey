# Canvas and Frame Cache

## Overview

This area powers the interactive hero sequence for the Honey storefront. It loads optimized WebP animation frames from `public/frames` and renders them to an HTML5 canvas during user scrolling.

## Key files

| File | Owns |
|---|---|
| `src/lib/canvas/frame-loader.ts` | Sliding window cache, device pixel ratio clamping, and reduced motion detection |
| `src/lib/canvas/__tests__/frame-loader.test.ts` | Unit tests for cache eviction, device pixel ratio, and bounds |
| `src/lib/canvas/__tests__/manifest.test.ts` | Validation tests for `public/frames/manifest.json` metadata |
| `public/frames/manifest.json` | Total frame counts, dimensions, keyframe indices, and poster path |

## Commands

```bash
# Run unit tests for canvas and frame loader
npm test src/lib/canvas
```

## Conventions

- Bound memory by keeping device pixel ratio capped at 2 via `getClampedDevicePixelRatio`.
- Maintain a sliding window of frames around the current position, defaulting to a radius of 8 frames.
- Honor user motion preferences with `checkPrefersReducedMotion` to display a static poster frame instead of scroll scrubbing.
- Fit canvas dimensions with cover aspect ratio using `drawImageCover`.

## Gotchas

- Fast scrubbing can dispatch asynchronous loads that resolve after the active window shifts. Make sure any completed load validates that the frame index still sits inside the active window before inserting into cache.
- Calling clear must cancel or invalidate in flight image loads using an active generation counter so late responses do not repopulate memory.
- In Vitest with `happy-dom`, `HTMLImageElement` does not load assets automatically. Unit tests must mock or simulate loaded states to verify window eviction.

## Related specs

- [0001 Stack and Architecture](docs/specs/0001-stack-and-architecture/index.md) (covers AC-6 memory safeguards and canvas requirements)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
