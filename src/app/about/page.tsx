import React, { Suspense } from "react";
import type { Metadata } from "next";
import {
  getApiaryOrigins,
  getApiaryOriginDetails,
  getSeasonalCyclePhases,
  getPurityStandards,
  getBeekeepingPledges,
  getAllProducts,
} from "@/lib/catalog/queries";
import { AboutView } from "@/components/about/about-view";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Compass,
  Calendar,
  FlaskConical,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Brand Heritage & Apiary Story | Honey Single Origin Reserve",
  description:
    "Explore our single origin terroirs across the Catskills, Black Forest, Provence, and Apalachicola. Discover our four season apiculture rhythm, NMR laboratory purity testing, and ethical beekeeping pledges.",
};

function AboutLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse">
      <div className="h-10 bg-amber-100/60 rounded-2xl w-48 mb-6" />
      <div className="h-64 bg-amber-50/70 rounded-3xl border border-amber-200/50 mb-12" />
      <div className="h-64 bg-amber-50/70 rounded-3xl border border-amber-200/50" />
    </div>
  );
}

/**
 * Dedicated Brand Heritage and Apiary Story narrative route.
 * Combines server rendered domain data with shallow URL search parameter synchronization.
 * Satisfies AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, and AC-8.
 */
export default function AboutPage() {
  const originList = getApiaryOrigins();
  const originDetails = originList
    .map((o) => getApiaryOriginDetails(o.id))
    .filter((detail): detail is NonNullable<typeof detail> => detail !== undefined);

  const phases = getSeasonalCyclePhases();
  const standards = getPurityStandards();
  const pledges = getBeekeepingPledges();
  const products = getAllProducts();

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-amber-200 selection:text-amber-950">
      {/* Editorial Navigation Header */}
      <StorefrontHeader transparent={false} />

      <main className="flex-1 flex flex-col pt-18">
        {/* Editorial Heritage Proclamation Header */}
        <section
          aria-label="Brand heritage proclamation"
          className="relative bg-gradient-to-b from-amber-50/80 via-cream to-cream border-b border-amber-200/60 py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Editorial Seal */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <Badge variant="amber" size="sm">
                Apiculture Heritage & Terroir
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-serif italic text-amber-900/90 bg-amber-100/60 px-3 py-0.5 rounded-full border border-amber-200/60">
                <Sparkles size={12} className="text-amber-700" aria-hidden="true" />
                Slow Harvest Philosophy
              </span>
            </div>

            {/* Editorial Proclamation Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.12] mb-5">
              The Living Story of Our Apiaries & Terroirs
            </h1>

            {/* Narrative Manifesto */}
            <p className="font-sans text-base sm:text-lg lg:text-xl text-charcoal/80 max-w-2xl leading-relaxed mb-8">
              We practice slow apiculture: never microfiltered, never flash heated,
              and never blended across regions. Step inside our mountain origins,
              trace the annual seasonal harvest cycle, and inspect our uncompromising
              laboratory purity standards.
            </p>

            {/* In-page Anchor Links for Effortless Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <a
                href="#terroir-atlas"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream border border-amber-200/80 text-xs font-medium text-charcoal hover:text-amber-950 hover:bg-amber-100/50 transition-colors shadow-2xs"
              >
                <Compass size={14} className="text-amber-800" aria-hidden="true" />
                <span>Terroir Atlas</span>
              </a>
              <a
                href="#seasonal-cycle"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream border border-amber-200/80 text-xs font-medium text-charcoal hover:text-amber-950 hover:bg-amber-100/50 transition-colors shadow-2xs"
              >
                <Calendar size={14} className="text-amber-800" aria-hidden="true" />
                <span>Seasonal Harvest</span>
              </a>
              <a
                href="#purity-standards"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream border border-amber-200/80 text-xs font-medium text-charcoal hover:text-amber-950 hover:bg-amber-100/50 transition-colors shadow-2xs"
              >
                <FlaskConical size={14} className="text-amber-800" aria-hidden="true" />
                <span>Purity Standards</span>
              </a>
              <a
                href="#ethical-pledges"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream border border-amber-200/80 text-xs font-medium text-charcoal hover:text-amber-950 hover:bg-amber-100/50 transition-colors shadow-2xs"
              >
                <Shield size={14} className="text-amber-800" aria-hidden="true" />
                <span>Ethical Pledges</span>
              </a>
            </div>
          </div>
        </section>

        {/* Client Interactive Narrative View */}
        <Suspense fallback={<AboutLoadingSkeleton />}>
          <AboutView
            origins={originDetails}
            phases={phases}
            standards={standards}
            pledges={pledges}
            products={products}
          />
        </Suspense>
      </main>

      {/* Editorial Storefront Footer */}
      <StorefrontFooter />

      {/* Slide Over Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
