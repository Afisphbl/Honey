# Hero and Storefront Scrubber

## Overview

This area powers the full screen hero presentation for the storefront. It combines a full viewport canvas scrubber with 150 extraction frames, a 300vh scroll container, and the sequential featured product buy box.

## Key files

| File | Owns |
|---|---|
| `src/components/hero/storefront-hero-section.tsx` | Sticky 300vh scroll container coordinating the canvas stage and buy box |
| `src/components/hero/hero-canvas-scrubber.tsx` | Full screen canvas rendering, frame prefetching, DPR clamping, and reduced motion controls |
| `src/components/hero/featured-buy-box.tsx` | Showcase product buy box, variant selection, price feedback, and add to cart action |
| `src/components/hero/__tests__/hero-canvas-scrubber.test.tsx` | Unit tests for canvas sizing, DPR clamping, and scrub progress |
| `src/components/hero/__tests__/featured-buy-box.test.tsx` | Unit tests for variant switching, quantity limits, and cart actions |

## Commands

```bash
# Run unit tests for hero components
npm test src/components/hero
```

## Conventions

- Render canvas across the full viewport beneath the floating transparent header.
- Omit frame counter numbers or index pills during video playback for a clean cinematic view.
- Clamp canvas device pixel ratio at 2 to conserve memory on high resolution displays.
- Advance the active frame index and trigger sliding frame cache eviction on every scroll step.
- Respect accessibility settings by presenting a static poster and a manual scrubber slider when `prefers-reduced-motion` is active.

## Related specs

- [0004 Core Storefront Loop and Scroll Hero](docs/specs/0004-core-storefront-loop-scroll-hero/index.md) (covers requirements AC-1 through AC-6)

_Drafted by /sync from the introducing change, worth a quick human pass._
