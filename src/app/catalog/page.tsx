import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/catalog/queries";
import { CatalogView } from "@/components/catalog/catalog-view";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles, Compass, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Artisanal Product Catalog & Tasting Notes | Honey Single Origin Reserve",
  description:
    "Explore single origin raw wildflower, acacia, lavender infusion, honeycomb cuts, and tasting flight boxes. Inspect sensory scales, terroir origins, and food pairings.",
};

function CatalogLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
      <div className="h-14 bg-amber-100/50 rounded-2xl mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-96 rounded-2xl bg-amber-50/60 border border-amber-200/50"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Dedicated Product Catalog and Tasting Notes Explorer route.
 * Features an editorial header with the terroir manifesto, category filtering,
 * sensory drawers, and persistent cart drawer integration.
 * Satisfies AC-1, AC-2, and AC-3.
 */
export default function CatalogPage() {
  const products = getAllProducts();

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-amber-200 selection:text-amber-950">
      {/* Editorial Navigation Header */}
      <StorefrontHeader transparent={false} />

      <main className="flex-1 flex flex-col pt-18">
        {/* Editorial Terroir Manifesto Banner */}
        <section
          aria-label="Catalog introduction and terroir philosophy"
          className="relative bg-gradient-to-b from-amber-50/80 via-cream to-cream border-b border-amber-200/60 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Terroir Seal & Origin Meta */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <Badge variant="amber" size="sm">
                2026 Apiary Reserves
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-serif italic text-amber-900/90 bg-amber-100/60 px-3 py-0.5 rounded-full border border-amber-200/60">
                <Sparkles size={12} className="text-amber-700" aria-hidden="true" />
                Pure Cold Spun Harvests
              </span>
            </div>

            {/* Editorial Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.12] mb-4">
              Artisanal Honey Varieties & Tasting Profiles
            </h1>

            {/* Terroir Manifesto */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-charcoal/80 max-w-2xl leading-relaxed mb-6">
              Every jar reflects an unrepeatable snapshot of pristine botanical canopies,
              altitude terroirs, and unheated hive stewardship. Filter by varietal origin,
              inspect sensory sweetness and intensity meters, and discover culinary pairings below.
            </p>

            {/* Certifications and Purity Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-4 border-t border-amber-200/50 text-left">
              <div className="flex items-center gap-2 bg-cream/90 p-2.5 rounded-xl border border-amber-200/70 shadow-2xs">
                <ShieldCheck size={18} className="text-amber-800 shrink-0" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider leading-tight">
                    100% Raw
                  </span>
                  <span className="text-[10px] text-charcoal/70">Unpasteurized</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-cream/90 p-2.5 rounded-xl border border-amber-200/70 shadow-2xs">
                <Compass size={18} className="text-amber-800 shrink-0" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider leading-tight">
                    Single Origin
                  </span>
                  <span className="text-[10px] text-charcoal/70">Traceable Hives</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-cream/90 p-2.5 rounded-xl border border-amber-200/70 shadow-2xs">
                <Award size={18} className="text-amber-800 shrink-0" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider leading-tight">
                    Cold Spun
                  </span>
                  <span className="text-[10px] text-charcoal/70">Below 95°F Hive Temp</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-cream/90 p-2.5 rounded-xl border border-amber-200/70 shadow-2xs">
                <Sparkles size={18} className="text-amber-800 shrink-0" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider leading-tight">
                    UV Protected
                  </span>
                  <span className="text-[10px] text-charcoal/70">French Glass Vessels</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Interactive Catalog Grid with URL Synchronization */}
        <Suspense fallback={<CatalogLoadingSkeleton />}>
          <CatalogView initialProducts={products} />
        </Suspense>
      </main>

      {/* Editorial Footer */}
      <StorefrontFooter />

      {/* Slide Over Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
