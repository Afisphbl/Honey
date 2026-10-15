# 0001 · Rationale · Adopt Next.js App Router and Canvas Asset Pipeline for Honey Storefront

## Context

The Honey storefront is a boutique e-commerce destination selling artisanal single origin honey varieties. The core brand experience centers on an interactive scroll hero where visitors scrub through a 150 frame cinematic honey jar sequence. Beyond the visual hero, the site requires a product catalog with tasting notes, floral origin details, jar variant selection, a sliding cart drawer, and customer order completion.

The immediate technical challenge is asset weight, browser memory pressure, and frame delivery. The raw animation sequence in the repository archive contains 150 uncompressed PNG files totaling over 119MB. Serving these images directly would saturate mobile network connections and trigger browser tab crashes. In memory, 150 raw RGBA frames decoded at 1280 by 720 resolution consume over 550MB of RAM, far exceeding the memory budgets of mobile devices. The architecture must deliver smooth 60 frames per second scrubbing while keeping total network payloads small and RAM usage under tight limits.

Additionally, the project requires an architecture that scales cleanly from a local single developer environment to production edge deployment on Vercel. Because Vercel serverless environments enforce a read only filesystem, order submissions cannot write to local disk files. We need server rendering for product discoverability, fast local build iteration with Node.js and npm, and robust testing for commerce logic such as variant pricing and cart totals. Failing to decide on a coherent stack now would result in fragmented component models and unoptimized media delivery across subsequent feature slices.

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

## Rationale

Next.js App Router solves both critical halves of the Honey storefront: high craft interactive storytelling and search discoverable commerce. Product catalog pages, harvest timelines, and tasting notes benefit directly from server rendering and automatic metadata generation, ensuring premium positioning on search engines without client hydration delay.

For the 150 frame animation sequence, isolating the canvas scrubber in a dedicated client component prevents React reconciliation overhead from competing with the browser render pipeline. Lenis provides momentum scrolling that feeds directly into the canvas `requestAnimationFrame` loop, ensuring continuous 60 frames per second scrubbing.

To address mobile memory limitations, the canvas scrubber implements two critical safeguards. First, it caps device pixel ratio at `Math.min(window.devicePixelRatio, 2)` and applies `object-fit: cover` centering, avoiding runaway buffer allocations on high density mobile screens. Second, rather than keeping all 150 decoded RGBA bitmaps in RAM simultaneously (which would consume over 550MB of memory), the runtime decodes frames on demand and retains only a window of active frames around the current scroll position, keeping total canvas memory consumption safely under 80MB.

On the data layer, Vercel serverless functions enforce a read only filesystem. Therefore, order submissions are processed via a Next.js route handler (`POST /api/orders`) that validates payloads in memory and returns a typed receipt object, while persistent order history is maintained in client local storage via Zustand.

Image preprocessing runs as a one time local script using Sharp (`npm run optimize:frames`), placing optimized WebP frames and a structured `manifest.json` into `public/frames/`. Committing these optimized assets ensures Vercel deployments remain fast and reliable without running heavy image conversions during CI builds.

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
