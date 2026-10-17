# Product Catalog Components

## Overview

This directory houses the UI components powering the product catalog and sensory tasting notes explorer at `/catalog`. It includes variety product cards, bundle previews, sticky category filter controls, and accessible sensory tasting profile drawers.

## Key files

| File | Owns |
|---|---|
| `bundle-card.tsx` | Tasting flight and gift bundle cards with included jar chips, bundle savings tags, and direct cart addition |
| `catalog-filter-bar.tsx` | Sticky category filter tabs, result counts, sort dropdown, and in stock filter toggle |
| `catalog-view.tsx` | Client coordinator managing URL search parameter synchronization, filter counts, and responsive product grid |
| `empty-catalog-state.tsx` | Editorial empty state with comforting reassurance message and reset filters action |
| `product-card.tsx` | Single variety honey card with variant weight selector, live price feedback, cart drawer trigger, and tasting drawer toggle |
| `tasting-drawer.tsx` | Accessible sensory profile drawer with sweetness and intensity meters, floral sources, flavor notes, food pairings, and CSS grid transitions |
| `__tests__/` | Unit tests for catalog filtering, sorting logic, empty state recovery, and accessible disclosure interactions |

## Commands

```bash
# Run unit tests for catalog components
npm test src/components/catalog
```

## Conventions

- Synchronize filter category and sort order with URL query parameters for shareable links
- Animate sensory drawer expansion using native CSS grid template rows from `0fr` to `1fr` without external animation libraries
- Respect accessibility settings and disable drawer transition animations when `prefers-reduced-motion` is active
- Support keyboard navigation with explicit `aria-expanded` and `aria-controls` attributes on disclosure buttons
- Connect product and bundle cards directly with the global cart store, opening the cart drawer upon item addition

## Related specs

- [0005 Product Catalog and Tasting Notes](docs/specs/0005-product-catalog-and-tasting-notes/index.md) (covers requirements AC-1 through AC-8)

_Drafted by /sync from the introducing change, worth a quick human pass._
