# Honey — Single-Origin Artisanal Honey Storefront

A luxury artisanal honey storefront featuring an interactive video-like canvas scroll hero sequence, floral origin storytelling, a sensory tasting catalog, and an in-drawer checkout experience.

Built with Next.js App Router (React 19), Tailwind CSS v4, HTML5 Canvas 2D, and Zustand.

---

## Features

### 1. Interactive Canvas Scroll Hero
- **Smooth 150-frame animation sequence** rendered directly to an HTML5 Canvas 2D element as the user scrolls.
- **Memory-bounded sliding frame cache**: caps browser memory under 80MB and device pixel ratio (DPR) at 2 to ensure 60fps performance across desktop and mobile devices.
- **Sticky storefront header**: transparent frosted-glass header with dynamic cart item badge and quick navigation.
- **Featured buy box**: synchronous jar size variant selector, real-time price updates, and one-click add to cart action.

### 2. Product Catalog & Tasting Notes Explorer (`/catalog`)
- **Terroir variety collection**: Raw Wildflower, Acacia, Lavender, and Comb honey varieties sourced from single-origin apiaries.
- **Tactile category filter bar**: filter between All, Raw Honey, Comb Honey, and Curated Reserve Bundles with shallow URL synchronization (`?category=...`).
- **Variety cards**: variant weight selectors (8 oz, 16 oz, 24 oz), batch metadata, floral sources, and immediate add-to-bag triggers.
- **Sliding tasting notes drawer**: zero-dependency CSS viscous transition revealing floral notes, sensory flavor profiles, texture characteristics, and pairing suggestions.

### 3. Brand Heritage & Apiary Story (`/about`)
- **Apiary Terroir Atlas**: interactive geographic explorer with altitude markers, regional botanical sources, and coordinate details for Pacific Northwest, Catskill Mountains, and Provence apiaries.
- **Seasonal Harvest Cycle**: visual blooming and extraction calendar mapping harvest periods across spring wildflower, summer acacia, and autumn lavender.
- **Laboratory Purity Verification**: certification grid verifying 100% raw unheated processing, zero synthetic additives, pollen integrity, and sustainable apiculture standards.
- **Ethical Beekeeping Pledges**: commitments to hive health, sustainable hive splitting, and winter reserve preservation.

### 4. Cart Drawer & Order Completion
- **Global slide-over drawer**: mounted in `src/app/layout.tsx` for immediate accessibility from any page or buy box action.
- **Complimentary delivery progress indicator**: dynamic visual meter tracking progress toward complimentary shipping at $50.00.
- **Artisanal gifting options**: toggle complimentary botanical gift packaging (amber wax seal and cotton ribbon) with a custom handwritten gift note and courier delivery instructions.
- **Multi-phase checkout flow**: seamless state transitions inside the drawer (`items` → `checkout` → `receipt` → `history`) without disruptive full-page redirects.
- **Authoritative server price revalidation**: checkout submits to `POST /api/orders` which revalidates line items, stock availability, and unit prices against catalog records before order confirmation.
- **Printable order receipts & order history**: formatted certificate confirmation with `window.print()` styling, order number clipboard copy, and chronological past orders inspection backed by browser local storage.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS v4 (OKLCH color system, fluid typography, `@theme` tokens) |
| **Canvas Engine** | HTML5 Canvas 2D with requestAnimationFrame and sliding frame cache |
| **Client State** | Zustand with `persist` middleware and explicit `hasHydrated` SSR guard |
| **Validation** | Zod schemas for products, variants, shipping addresses, and orders |
| **Icons** | Lucide React |
| **Unit Testing** | Vitest + Testing Library + Happy DOM (39 test suites, 281 tests) |
| **End-to-End** | Cypress |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/Afisphbl/Honey.git
cd Honey

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

```bash
# Run unit & component test suite (Vitest)
npm test

# Run linter
npm run lint

# Build production bundle
npm run build

# Start production server
npm start

# Run end-to-end browser tests (Cypress)
npx cypress open

# Optimize hero animation webp frames
npm run optimize:frames
```

---

## Project Structure

```text
src/
├── app/
│   ├── about/            # Brand heritage & terroir atlas route (/about)
│   ├── api/orders/       # Authoritative server order verification API route
│   ├── catalog/          # Dedicated product catalog route (/catalog)
│   ├── globals.css       # Tailwind v4 theme tokens, OKLCH palette, print CSS
│   ├── layout.tsx        # Root layout mounting fonts and global CartDrawer
│   └── page.tsx          # Storefront homepage featuring full-screen hero canvas
├── components/
│   ├── about/            # Terroir atlas, harvest cycle, purity grid, pledges
│   ├── cart/             # Slide-over cart drawer, checkout form, order receipt, history
│   ├── catalog/          # Product cards, bundle cards, filter bar, tasting drawer
│   ├── hero/             # Hero canvas scrubber, buy box, storefront hero orchestrator
│   ├── layout/           # Storefront header and footer
│   └── ui/               # Radix primitives (Drawer, Dialog, Tabs), Button, Badge, Card
├── lib/
│   ├── canvas/           # Canvas frame loader, scroll scrub hook, frame manifest
│   ├── catalog/          # Static catalog records, pricing math, query resolvers, Zod schemas
│   ├── store/            # Zustand cart store with localStorage persistence
│   └── utils.ts          # Class merging utility (clsx + tailwind-merge)
└── types/
    └── catalog.ts        # TypeScript domain interfaces and schema inferences
```

---

## Architectural Specifications

All architectural decisions and specifications are documented under `docs/specs/`:

* [0001: Stack and Architecture](docs/specs/0001-stack-and-architecture/index.md)
* [0002: Data Model and Validation](docs/specs/0002-data-model/index.md)
* [0003: Design System and UI Foundation](docs/specs/0003-design-system-and-ui-foundation/index.md)
* [0004: Core Storefront Loop and Scroll Hero](docs/specs/0004-core-storefront-loop-scroll-hero/index.md)
* [0005: Product Catalog and Tasting Notes](docs/specs/0005-product-catalog-and-tasting-notes/index.md)
* [0006: Brand Heritage and Apiary Story](docs/specs/0006-brand-heritage-and-apiary-story/index.md)
* [0007: Cart Drawer and Order Completion](docs/specs/0007-cart-drawer-and-order-completion/index.md)

---

## License

MIT © [Afisphbl](https://github.com/Afisphbl)
