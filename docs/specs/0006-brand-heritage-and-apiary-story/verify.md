# Verify: brand heritage and apiary story · spec 0006 · updated 2026-10-17

_Steps derived from spec 0006 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Navigate to `/about` from header link "Brand Heritage & Apiaries" or footer link → renders editorial proclamation title "The Living Story of Our Apiaries & Terroirs", manifesto copy, four anchor pills, and all narrative sections → AC-1
- [x] Click "Plateau de Valensole" origin tab in Terroir Atlas → URL search params update to `/about?origin=valensole-plateau` shallowly without reload, displaying 590m elevation, Henri Martin lead beekeeper, and lavender flora canopy → AC-2, AC-6
- [x] Inspect an origin with empty harvest inventory such as Valensole Plateau or mock empty origin → displays artisanal badge reading "Resting for next harvest" with button linking to `/catalog` → AC-7
- [x] Click "Autumn" pill in Seasonal Harvest Cycle → URL search params update to `/about?season=autumn` without full page reload, displaying August to September timeframe, comb pressing tasks, and purple loosestrife blooms → AC-3, AC-6
- [x] Switch to "Winter" season pill → displays "Colony In Quiescence" badge and "Resting for next harvest" empty state card explaining winter cluster warmth → AC-3, AC-7
- [x] Inspect Laboratory Purity Verification section → verifies 4 badges: 100% botanical pollen concordance NMR profiling, 16.8% average moisture limit, 0.00 ppm zero synthetic pesticide screen, and raw living enzyme certification → AC-4
- [x] Inspect Ethical Beekeeping Pledges section → displays colony welfare commitment, raw cold extraction guarantee, wildflower conservation, and fair trade apiary stewardship → AC-5
- [x] Enter direct URL `/about?origin=unknown_peak&season=monsoon` → page normalizes query parameters gracefully to Catskill Highlands and Spring without runtime exceptions or blank screen → AC-6
- [x] Navigate origin tabs and seasonal pills with keyboard ArrowRight, ArrowLeft, Space, and Enter → focus moves smoothly with proper `role="tab"` and `aria-selected` attributes → AC-8
- [x] Enable reduced motion preference in system settings → tab switches and content disclosures snap immediately with zero animated translation or opacity shifting → AC-8
- [x] Click closing reserve invitation button "Explore the Reserve Catalog" → navigates cleanly to `/catalog` with full product collection → AC-1

## Commands
- [x] `npm test` → all 34 test suites and 243 tests pass cleanly → AC-1 through AC-8
- [x] `npm run build` → Next.js compiles static `/about` route and prerenders cleanly with zero errors → AC-1
- [x] `npm run lint` → ESLint and TypeScript report zero errors across all components and test files → AC-1

## Acceptance criteria coverage
- AC-1: Dedicated `/about` route, proclamation header, and closing reserve invitation covered by manual steps 1 and 11, command step 2
- AC-2: Interactive Apiary Terroir Atlas origin profiles covered by manual step 2, command step 1
- AC-3: Four season harvest cycle timeline and bloom notes covered by manual steps 4 and 5, command step 1
- AC-4: Laboratory purity verification badges and standards covered by manual step 6, command step 1
- AC-5: Ethical beekeeping pledges covered by manual step 7, command step 1
- AC-6: Shallow URL search parameter synchronization and invalid fallback covered by manual steps 2, 4, and 8, command step 1
- AC-7: Resting for next harvest badge fallback covered by manual steps 3 and 5, command step 1
- AC-8: Keyboard navigation and reduced motion behavior covered by manual steps 9 and 10, command step 1
