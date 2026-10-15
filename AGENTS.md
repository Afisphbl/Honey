<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Build approach
Tracer Bullet (prove the whole pipe works with thin vertical slices through every layer).

## Stack
Next.js App Router (React 19), TypeScript, Tailwind CSS v4, HTML5 Canvas 2D, Zustand with local storage persistence, Vitest, Cypress, Vercel.

## Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint

# Optimize frames
npm run optimize:frames
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title/index.md`.

## Rules

- Use Server Components by default; mark interactive components with `'use client'`
- Import modules with `@/*` mapping to `./src/*`
- Keep browser memory bounded under 80MB during canvas animations and cap DPR at 2
- Zustand stores persist state with an explicit `hasHydrated` guard against SSR hydration mismatch
- Honor accessibility settings and `prefers-reduced-motion` across animations
- Unit tests live beside source files or inside `__tests__/` and run via Vitest

## UI / UX design
For all UI and UX design work across the storefront (visual hierarchy, art direction, luxury color tokens, editorial typography, motion, and component polish), always use and follow these design craft skills:
- [impeccable](file:///C:/Users/YES-COMPUTER-ET/.gemini/config/skills/impeccable): Frontend interface craftsmanship, critique, design systems, spacing, and micro-interactions
- [taste-skill](file:///C:/Users/YES-COMPUTER-ET/.gemini/config/skills/taste-skill): Visual taste, editorial aesthetics, luxury typography, and spatial composition
- [ui-ux-pro-max-skill](file:///C:/Users/YES-COMPUTER-ET/.gemini/config/skills/ui-ux-pro-max-skill): Comprehensive UI/UX patterns, interaction design, accessibility, and component styling

## Agent skills
- [next-best-practices](.agents/skills/next-best-practices/): `pedronauck/skills`, Next.js App Router and server component patterns
- [vercel-react-best-practices](.agents/skills/vercel-react-best-practices/): `vercel-labs/agent-skills`, React and Next.js composition patterns
- [tailwind-4-docs](.agents/skills/tailwind-4-docs/): `lombiq/tailwind-agent-skills`, Tailwind CSS v4 rules and tokens
- [vitest](.agents/skills/vitest/): `antfu/skills`, Vitest unit and component testing conventions
- [zustand](.agents/skills/zustand/): `lobehub/lobehub`, Zustand client state store patterns
- [cypress-docs](.agents/skills/cypress-docs/): `cypress-io/ai-toolkit`, Cypress end to end browser testing guidance
- [zod](.agents/skills/zod/): `pproenca/dot-skills`, Zod runtime validation and schema definition patterns

## Context files

- [src/lib/canvas/AGENTS.md](src/lib/canvas/AGENTS.md) (Canvas rendering, sliding frame cache, and memory limits)
- [src/lib/catalog/AGENTS.md](src/lib/catalog/AGENTS.md) (Artisanal honey catalog data, Zod validation schemas, and pricing calculations)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
