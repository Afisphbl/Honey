# 0001. Adopt Next.js App Router and Canvas Asset Pipeline for Honey Storefront

**Date**: 2026-10-15
**Status**: Proposed

## Summary

This decision establishes Next.js App Router with TypeScript and Tailwind CSS v4 as the foundational web framework for the Honey storefront. We pair this with a local Node.js image pipeline using Sharp that converts 120MB of raw hero frames into lightweight WebP assets, driven by an HTML5 canvas and Lenis smooth scroll. This foundation gives you server rendering for search engine visibility, reliable client state with Zustand, mobile memory safeguards, and fluid 60 frames per second animation on desktop and mobile browsers.

## Context

The Honey storefront is a boutique e-commerce destination selling artisanal single origin honey varieties. The core brand experience centers on an interactive scroll hero where visitors scrub through a 150 frame cinematic honey jar sequence. Beyond the visual hero, the site requires a product catalog with tasting notes, floral origin details, jar variant selection, a sliding cart drawer, and customer order completion.

The immediate technical challenge is asset weight, browser memory pressure, and frame delivery. The raw animation sequence in the repository archive contains 150 uncompressed PNG files totaling over 119MB. Serving these images directly would saturate mobile network connections and trigger browser tab crashes. In memory, 150 raw RGBA frames decoded at 1280 by 720 resolution consume over 550MB of RAM, far exceeding the memory budgets of mobile devices. The architecture must deliver smooth 60 frames per second scrubbing while keeping total network payloads small and RAM usage under tight limits.

Additionally, the project requires an architecture that scales cleanly from a local single developer environment to production edge deployment on Vercel. Because Vercel serverless environments enforce a read only filesystem, order submissions cannot write to local disk files. We need server rendering for product discoverability, fast local build iteration with Node.js and npm, and robust testing for commerce logic such as variant pricing and cart totals. Failing to decide on a coherent stack now would result in fragmented component models and unoptimized media delivery across subsequent feature slices.

## Requirements

**User stories**:
- As a developer, I want a unified Next.js project structure so that I can build storefront slices on a clean, stable foundation.
- As a storefront visitor, I want the interactive honey jar animation to scrub smoothly at 60 frames per second without waiting for massive image downloads or crashing mobile browser tabs.
- As a customer, I want instant page navigation, clear tasting notes, and a persistent shopping cart that preserves my selections.
- As a user with motion sensitivity, I want the storefront to respect my system accessibility settings and provide a stable browsing experience.

**Acceptance criteria**:
- **AC-1**: The project scaffolds with Next.js App Router, React 19, and TypeScript, compiling cleanly with zero build errors under Node.js 24 and npm.
- **AC-2**: A dedicated local asset optimization script processes the 150 PNG frames into WebP files under 15MB total, generating `public/frames/manifest.json` with frame metadata, dimensions, and keyframe indices.
- **AC-3**: Tailwind CSS v4 is configured with OKLCH amber and gold brand tokens, with editorial serif typography loaded with zero layout shift.
- **AC-4**: Zustand provides client cart state with local storage persistence and an explicit hydration guard (`hasHydrated`), preventing server client hydration mismatches.
- **AC-5**: Vitest is configured with `happy-dom` and React Testing Library for unit and component testing, executing test suites cleanly within the project environment.
- **AC-6**: The canvas scrubber caps device pixel ratio at 2, employs windowed frame memory retention to keep browser RAM usage under 80MB, and honors `prefers-reduced-motion: reduce` by showing a static hero poster without scroll pinning.

## Options considered

### Option 1: Next.js App Router with React, Tailwind CSS v4, and Zustand

A full stack React architecture using Next.js App Router. Server components render static catalog content and metadata for search engines, while route handlers validate customer orders. The 150 frame animation is isolated in a dedicated client component using HTML5 Canvas, Lenis smooth scroll, and Motion.

**Pros**:
- Combines server rendering for catalog discoverability with rich client animation capabilities.
- Native TypeScript support, fast route handlers, and first party Vercel edge deployment.
- Zustand enables high performance state updates that bypass React re render cascades during canvas scrubbing.

**Cons**:
- Requires careful separation between server and client components to avoid accidental client bundle bloat.

### Option 2: Astro with React Islands, Nanostores, and Tailwind CSS v4

A content focused static site generator that outputs pure HTML by default, mounting interactive React components inside isolated islands.

**Pros**:
- Zero JavaScript baseline for product descriptions and apiary narrative sections.
- Excellent baseline Core Web Vitals scores.

**Cons**:
- Coordinating shared commerce state across separate islands requires external bridge stores.
- Managing server dynamic order flows and checkout state adds architectural complexity compared to a unified Next.js application.

### Option 3: Vite React Single Page Application with CSS Modules

A purely client side React application powered by Vite, with manual client side routing and scoped CSS modules.

**Pros**:
- Extremely fast local developer server boot times and hot module replacement.
- Simple deployment model consisting entirely of static files.

**Cons**:
- Lacks server rendering out of the box, hurting search engine indexing for artisanal honey varieties.
- Requires assembling separate routing, data fetching, and build pipelines manually.

## Decision

**Chosen option**: Option 1: Next.js App Router with React, Tailwind CSS v4, and Zustand

We adopt Next.js App Router as the unified web platform for the Honey storefront, combining server rendered catalog pages with client canvas animation, mobile memory safeguards, and Zustand state persistence.

**Implementation skills**: `nextjs-patterns` (`vercel-labs/agent-skills`, `.agents/skills/nextjs-patterns/`) · `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.agents/skills/tailwind-4-docs/`) · `vitest` (`antfu/skills`, `.agents/skills/vitest/`) · `zustand` (`lobehub/lobehub`, `.agents/skills/zustand/`) · `impeccable` (`C:\Users\YES-COMPUTER-ET\.gemini\config\skills\impeccable`) · `ui-ux-pro-max-skill` (`C:\Users\YES-COMPUTER-ET\.gemini\config\skills\ui-ux-pro-max-skill`) · `taste-skill` (`C:\Users\YES-COMPUTER-ET\.gemini\config\skills\taste-skill`)

## Rationale

Next.js App Router solves both critical halves of the Honey storefront: high craft interactive storytelling and search discoverable commerce. Product catalog pages, harvest timelines, and tasting notes benefit directly from server rendering and automatic metadata generation, ensuring premium positioning on search engines without client hydration delay.

For the 150 frame animation sequence, isolating the canvas scrubber in a dedicated client component prevents React reconciliation overhead from competing with the browser render pipeline. Lenis provides momentum scrolling that feeds directly into the canvas `requestAnimationFrame` loop, ensuring continuous 60 frames per second scrubbing.

To address mobile memory limitations, the canvas scrubber implements two critical safeguards. First, it caps device pixel ratio at `Math.min(window.devicePixelRatio, 2)` and applies `object-fit: cover` centering, avoiding runaway buffer allocations on high density mobile screens. Second, rather than keeping all 150 decoded RGBA bitmaps in RAM simultaneously (which would consume over 550MB of memory), the runtime decodes frames on demand and retains only a window of active frames around the current scroll position, keeping total canvas memory consumption safely under 80MB.

On the data layer, Vercel serverless functions enforce a read only filesystem. Therefore, order submissions are processed via a Next.js route handler (`POST /api/orders`) that validates payloads in memory and returns a typed receipt object, while persistent order history is maintained in client local storage via Zustand.

Image preprocessing runs as a one time local script using Sharp (`npm run optimize:frames`), placing optimized WebP frames and a structured `manifest.json` into `public/frames/`. Committing these optimized assets ensures Vercel deployments remain fast and reliable without running heavy image conversions during CI builds.

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript 5.x | Strong static types for catalog models, variant pricing, and canvas interfaces. |
| Framework | Next.js App Router (React 19) | Server rendering for product discovery with route handlers for customer orders. |
| Styling | Tailwind CSS v4 | CSS first configuration with OKLCH color tokens for luxury amber aesthetics. |
| Canvas & Motion | HTML5 Canvas 2D + Lenis + Motion | 60 frames per second scroll scrubbing with capped DPR, memory windowing, and reduced motion guard. |
| Asset Pipeline | Node.js script with Sharp (one time local run) | Preprocesses 150 raw PNG frames into WebP under 15MB with `public/frames/manifest.json`. |
| State Management | Zustand with persist and hydration guard | Atomic store updates outside React render loops protecting canvas frame rates and SSR hydration. |
| Data Layer | Typed static catalog + client local storage orders | Zero latency static catalog browsing with route handler validation and local storage persistence. |
| Testing | Vitest + happy-dom + React Testing Library | Fast ESM native test runner for cart math, variant logic, and catalog filters. |
| Fonts | Google Fonts via next/font | Self hosted Cormorant Garamond serif and Plus Jakarta Sans with zero layout shift. |
| Hosting | Vercel | Native App Router platform with global edge caching and asset distribution. |

## Consequences

**Positive**:
- Server components ensure fast first contentful paint and strong search engine indexing for honey varieties.
- Converting raw PNGs to WebP slashes network transfer size by over 85 percent.
- Windowed frame memory retention keeps browser memory under 80MB, eliminating mobile Safari tab crashes.
- Storing order receipts in client local storage avoids Vercel read only filesystem write failures.
- Pre generating assets locally prevents long build times and timeout risks on cloud deployment platforms.
- Supporting `prefers-reduced-motion` ensures full accessibility compliance.

**Negative / tradeoffs**:
- Committing optimized WebP assets adds approximately 10MB to the repository storage footprint.
- Client canvas scrubbing requires careful lifecycle management to clean up event listeners and animation frames on route transitions.

**Neutral**:
- Image preprocessing must run locally before pushing new sequence assets (`npm run optimize:frames`).
- Vercel deployment requires configuring asset caching headers so image frames cache permanently at edge nodes.

## Follow-up

- [ ] Install the confirmed community skills (`vercel-labs/agent-skills`, `lombiq/tailwind-agent-skills`, `antfu/skills`, `lobehub/lobehub`) into project agent tooling.
- [ ] Scaffold the project using Next.js App Router and verify local compilation (`/develop stack & architecture`).
- [ ] Author the Node.js frame optimization script in `scripts/optimize-frames.mjs` using Sharp to unpack and convert `ezgif-15929baa46c6720a-png-split.zip` into `public/frames/`.
- [ ] Apply the installed craft skills (`impeccable`, `ui-ux-pro-max-skill`, and `taste-skill` in `C:\Users\YES-COMPUTER-ET\.gemini\config\skills`) to guide typography, luxury color tokens, visual hierarchy, and component polish.
- [ ] Consider connecting optional developer MCP servers (`next-devtools-mcp`, `tailwindcss-docs-mcp`, `vitest-mcp-server`) when deeper live inspection is desired.

## References

**Project sources**:
- `docs/scope/scope.md`: Storefront requirements, build approach, and foundation scope. (basis: scope feature 1)
- `ezgif-15929baa46c6720a-png-split.zip`: Archive containing 150 high resolution animation frames for the hero section. (basis: hero asset specification)
- Installed design skills: `impeccable`, `ui-ux-pro-max-skill`, and `taste-skill` in `C:\Users\YES-COMPUTER-ET\.gemini\config\skills` governing luxury aesthetics, spacing, and craft standards. (basis: storefront craft guidance)

**Practices & standards**:
- Canvas drawImage optimization with requestAnimationFrame: High frame rate scroll scrubbing without DOM bloat. (basis: HTML5 Canvas rendering standards)
- Two tier progressive asset loading: Fetching initial frame for Largest Contentful Paint followed by background decoding. (basis: Web Vitals performance guidelines)
- Transient state subscriptions: Zustand subscriptions running outside React reconciliation trees. (basis: 60 frames per second animation best practices)
- Memory bounded canvas buffer: Capping device pixel ratio and windowing active bitmaps to avoid mobile tab termination. (basis: WebKit memory management guidelines)
- Reduced motion accommodation: Freezing scroll canvas on poster frame when accessibility preference is enabled. (basis: WCAG 2.1 guideline 2.3)

**Links**:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Lenis Smooth Scroll: https://lenis.dev
- Motion: https://motion.dev
- Zustand Documentation: https://zustand.docs.pmnd.rs
- Lucide Icons: https://lucide.dev
- Cloudflare Pages Documentation: https://developers.cloudflare.com/pages
- Vercel Documentation: https://vercel.com/docs
