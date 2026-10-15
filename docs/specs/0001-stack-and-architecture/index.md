# 0001. Adopt Next.js App Router and Canvas Asset Pipeline for Honey Storefront

**Date**: 2026-10-15
**Status**: Accepted

## Summary

This decision establishes Next.js App Router with TypeScript and Tailwind CSS v4 as the foundational web framework for the Honey storefront. We pair this with a local Node.js image pipeline using Sharp that converts 120MB of raw hero frames into lightweight WebP assets, driven by an HTML5 canvas and Lenis smooth scroll. This foundation gives you server rendering for search engine visibility, reliable client state with Zustand, mobile memory safeguards, and fluid 60 frames per second animation on desktop and mobile browsers.

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

## Decision

**Chosen option**: Option 1: Next.js App Router with React, Tailwind CSS v4, and Zustand

We adopt Next.js App Router as the unified web platform for the Honey storefront, combining server rendered catalog pages with client canvas animation, mobile memory safeguards, and Zustand state persistence.

**Implementation skills**: `nextjs-patterns` (`vercel-labs/agent-skills`, `.agents/skills/nextjs-patterns/`) · `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.agents/skills/tailwind-4-docs/`) · `vitest` (`antfu/skills`, `.agents/skills/vitest/`) · `zustand` (`lobehub/lobehub`, `.agents/skills/zustand/`) · `impeccable` (`C:\Users\YES-COMPUTER-ET\.gemini\config\skills\impeccable`) · `ui-ux-pro-max-skill` (`C:\Users\YES-COMPUTER-ET\.gemini\config\skills\ui-ux-pro-max-skill`) · `taste-skill` (`C:\Users\YES-COMPUTER-ET\.gemini\config\skills\taste-skill`)

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
- [x] Scaffold the project using Next.js App Router and verify local compilation (`/develop stack & architecture`).
- [x] Author the Node.js frame optimization script in `scripts/optimize-frames.mjs` using Sharp to unpack and convert `ezgif-15929baa46c6720a-png-split.zip` into `public/frames/`.
- [ ] Apply the installed craft skills (`impeccable`, `ui-ux-pro-max-skill`, and `taste-skill` in `C:\Users\YES-COMPUTER-ET\.gemini\config\skills`) to guide typography, luxury color tokens, visual hierarchy, and component polish.
- [ ] Consider connecting optional developer MCP servers (`next-devtools-mcp`, `tailwindcss-docs-mcp`, `vitest-mcp-server`) when deeper live inspection is desired.
