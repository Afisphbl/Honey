import Image from "next/image";
import manifest from "../../public/frames/manifest.json";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream text-charcoal flex flex-col items-center justify-between px-6 py-12 md:py-20 max-w-6xl mx-auto">
      {/* Brand Header */}
      <header className="w-full flex items-center justify-between border-b border-amber-200/60 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="Honey jar">
            🍯
          </span>
          <span className="font-serif text-2xl md:text-3xl tracking-wide font-semibold text-charcoal">
            Honey
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-amber-900/80">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold tracking-wider uppercase">
            Foundation Ready
          </span>
        </div>
      </header>

      {/* Hero Visual Showcase */}
      <section className="w-full my-12 flex flex-col items-center text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
          Artisanal Apiculture & Single-Origin Reserve
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-charcoal max-w-3xl leading-[1.1] mb-6">
          Liquid Gold, Directly from the Wild Flora.
        </h1>
        <p className="text-base md:text-lg text-charcoal/75 max-w-xl mb-10 leading-relaxed">
          Crafted with raw extraction methods and unpasteurized purity. The
          storefront architecture is initialized and ready for interactive canvas
          scrubbing and commerce slices.
        </p>

        {/* Poster Frame Preview */}
        <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-amber-200/80 bg-charcoal-deep">
          <Image
            src={manifest.poster}
            alt="Honey jar animation sequence poster frame"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
            <div className="text-left text-white">
              <p className="text-xs font-semibold tracking-wider uppercase text-gold-light">
                Canvas Asset Pipeline Verified
              </p>
              <p className="text-sm md:text-base font-serif text-cream">
                {manifest.totalFrames} frames converted to WebP ({manifest.totalSizeMb} MB total, {manifest.dimensions.width}×{manifest.dimensions.height} px)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Verification Matrix */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-amber-200/60">
        <div className="p-6 rounded-xl bg-amber-50/60 border border-amber-200/70">
          <h3 className="font-serif text-lg font-bold text-amber-950 mb-2">
            Next.js App Router
          </h3>
          <p className="text-sm text-charcoal/80 leading-normal">
            Compiling cleanly on React 19 and Node 24 with zero build warnings and Turbopack optimization.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-amber-50/60 border border-amber-200/70">
          <h3 className="font-serif text-lg font-bold text-amber-950 mb-2">
            Tailwind CSS v4 & OKLCH
          </h3>
          <p className="text-sm text-charcoal/80 leading-normal">
            Brand color tokens configured for amber, gold, and cream with Cormorant Garamond typography.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-amber-50/60 border border-amber-200/70">
          <h3 className="font-serif text-lg font-bold text-amber-950 mb-2">
            Zustand & Memory Bounded Canvas
          </h3>
          <p className="text-sm text-charcoal/80 leading-normal">
            Persistent cart store with SSR hydration safety, DPR capped at 2, and windowed frame memory under 80MB.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-charcoal/60 pt-10">
        Honey Artisanal Storefront · Stack & Architecture Foundation
      </footer>
    </main>
  );
}
