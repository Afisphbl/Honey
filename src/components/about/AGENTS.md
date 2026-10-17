# Brand Heritage and Apiary Components

## Overview

This directory contains the user interface components powering the brand heritage and apiary storytelling journey at `/about`. It includes the interactive apiary terroir atlas, seasonal harvest cycle, laboratory purity standards grid, and ethical beekeeping pledges.

## Key files

| File | Owns |
|---|---|
| `about-view.tsx` | Client coordinator managing shallow URL search parameter synchronization for origin and season selections |
| `apiary-terroir-atlas.tsx` | Interactive single origin apiary atlas displaying elevation, climate, lead beekeeper, flora ecosystem, coordinates, and harvested reserve jars |
| `seasonal-harvest-cycle.tsx` | Interactive seasonal apiculture timeline covering spring awakening, summer nectar flow, autumn comb pressing, and winter dormancy |
| `purity-verification-grid.tsx` | Laboratory purity credentials covering nuclear magnetic resonance testing, moisture content thresholds, zero pesticide residues, and raw enzyme vitality |
| `ethical-beekeeping-pledges.tsx` | Foundational commitments to bee colony welfare, cold gravity extraction, terroir conservation, and fair trade beekeeper equity |
| `__tests__/` | Unit test suites covering accessibility roles, tab state transitions, coordinate formatting, and fallback states |

## Commands

```bash
# Run unit tests for about components
npm test src/components/about
```

## Conventions

* Synchronize active origin and season tab selections with browser URL search parameters for direct bookmarking
* Preserve pre existing URL parameters such as newsletter campaign tags when updating selections
* Format geographic coordinates dynamically with north or south latitude and east or west longitude
* Provide an explicit resting badge when an apiary origin or season has no currently available harvested stock
* Maintain keyboard navigation across tab lists using arrow keys, space, and enter with explicit ARIA roles
* Disable visual transition animations when the user activates `prefers-reduced-motion`

## Related specs

* [0006 Brand Heritage and Apiary Story](docs/specs/0006-brand-heritage-and-apiary-story/index.md) (covers requirements AC-1 through AC-8)

_Drafted by /sync from the introducing change, worth a quick human pass._
