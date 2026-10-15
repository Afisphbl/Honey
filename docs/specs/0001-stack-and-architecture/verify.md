# Verify: Stack & architecture · spec 0001 · updated 2026-10-15
_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [x] Visit `http://localhost:3000` → verify editorial Cormorant Garamond serif headers, Plus Jakarta Sans body, and OKLCH amber background render with zero layout shift → AC-3
- [x] Inspect hero poster image on home page → verify `public/frames/poster.webp` displays honey jar asset preview crisply → AC-2
- [x] Simulate mobile viewport and device pixel ratio 3 in developer tools → verify canvas utilities clamp DPR at 2 → AC-6
- [x] Enable system accessibility setting `prefers-reduced-motion: reduce` → verify reduced motion check resolves true and static poster displays without pinning → AC-6

## Commands
- [x] `npm run build` → Next.js compiles with zero errors and generates static routes with TypeScript and Turbopack → AC-1
- [x] `npm test` → Vitest executes with happy-dom and passes all store, canvas memory, and manifest test suites cleanly → AC-5
- [x] `npm run lint` → ESLint completes with zero errors or warnings → AC-1
- [x] `npm run optimize:frames` → Sharp processes 150 raw PNG frames into WebP under 15MB total and outputs `public/frames/manifest.json` → AC-2
- [x] Node execution inspects Zustand store hydration guard → `hasHydrated` initializes false and toggles true upon rehydration without SSR mismatch → AC-4

## Acceptance-criteria coverage
- AC-1 (Next.js App Router, React 19, TS compilation under Node 24) covered by `npm run build` and `npm run lint`
- AC-2 (Sharp image pipeline under 15MB and manifest.json generation) covered by `npm run optimize:frames` and manifest test
- AC-3 (Tailwind CSS v4 with OKLCH amber tokens and serif typography) covered by manual UI inspection and build
- AC-4 (Zustand client cart store with localStorage persistence and hydration guard) covered by cart store test suite
- AC-5 (Vitest test runner with happy-dom and RTL) covered by `npm test`
- AC-6 (Canvas DPR capped at 2, windowed memory under 80MB, reduced motion accommodation) covered by frame loader test suite and manual UI inspection
