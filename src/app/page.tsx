import React from "react";
import { getFeaturedProduct } from "@/lib/catalog/queries";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { StorefrontHeroSection } from "@/components/hero/storefront-hero-section";
import { FeaturedBuyBox } from "@/components/hero/featured-buy-box";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Droplets, Sparkles, Compass } from "lucide-react";

export default function Home() {
  const featuredProduct = getFeaturedProduct();

  if (!featuredProduct) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center p-8">
        <p className="font-serif text-xl text-charcoal">
          Featured reserve is currently updating. Please refresh momentarily.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-amber-200 selection:text-amber-950">
      {/* Floating Transparent Editorial Navigation Header */}
      <StorefrontHeader />

      <main className="flex-1 flex flex-col">
        {/* Full Viewport 300vh Interactive Canvas Hero Track (AC-1, AC-2, AC-3, AC-4) */}
        <StorefrontHeroSection product={featuredProduct} />

        {/* Sequential Featured Reserve Buy Box Section (AC-1, AC-5) */}
        <section
          id="featured-reserve"
          className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-cream border-t border-amber-200/50"
          aria-label="Featured reserve selection and purchase"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Terroir & Apiculture Harvest Narrative */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge variant="amber" size="sm">
                  Single Origin Reserve 2026
                </Badge>
                <span className="text-xs font-serif italic text-amber-900/80">
                  Direct from the Apiary
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-charcoal leading-[1.15] mb-6">
                Cold Spun Extraction at 680 Meters Elevation.
              </h2>

              <p className="font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed mb-6">
                The extraction sequence you just experienced captures our late summer Wildflower harvest. Spun cold below 95°F to preserve delicate basswood nectar aromatics, live invertase, and antioxidant polyphenols.
              </p>

              <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 mb-6 space-y-3">
                <h3 className="font-serif text-lg font-bold text-charcoal">
                  Reserve Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-charcoal/60 block">Apiary Terroir</span>
                    <span className="font-semibold text-charcoal">Catskill Highlands, NY</span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Harvest Date</span>
                    <span className="font-semibold text-charcoal">Late Summer 2026</span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Purity Standard</span>
                    <span className="font-semibold text-charcoal">100% Raw Unpasteurized</span>
                  </div>
                  <div>
                    <span className="text-charcoal/60 block">Vessel</span>
                    <span className="font-semibold text-charcoal">French UV Glass Jar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Reserve Buy Box */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <FeaturedBuyBox product={featuredProduct} />
            </div>
          </div>
        </section>

        {/* Narrative Section: The Viscosity Standard */}
        <section
          id="tasting-profile"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-amber-200/70"
        >
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Sensory Craft
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-2 mb-4">
              The Alchemy of Raw Viscosity
            </h2>
            <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed">
              Commercial honey is heated above 160 degrees to flow through industrial pumps,
              destroying live pollen enzymes. Our reserve is spun cold, retaining raw crystal vitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-6">
                <Droplets size={24} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
                Unpasteurized Purity
              </h3>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                Extracted strictly below 95 degrees Fahrenheit, the natural equilibrium temperature of the hive.
                Natural propolis, invertase, and antioxidant polyphenols remain intact.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-6">
                <Compass size={24} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
                Subalpine Terroir
              </h3>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                Positioned at 680 meters elevation across pristine New York Catskill pastures.
                Bees gather nectar from wild basswood canopies and goldenrod meadows.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-6">
                <ShieldCheck size={24} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
                Lot Verified Traceability
              </h3>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                Each jar is bottled in UV filtering French glass to protect amber hues from oxidation.
                Numbered lot labels trace every jar to individual hive yards.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Tasting & Pairings Radar */}
        <section
          id="purity-standard"
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full bg-cream-muted/50 rounded-3xl border border-amber-200/80 mb-16"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-4">
            <div className="max-w-md">
              <Badge variant="gold" size="sm" className="mb-3">
                Terroir Notes
              </Badge>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-3">
                {featuredProduct.tastingProfile.colorRating}
              </h3>
              <p className="text-sm text-charcoal/80 leading-relaxed mb-4">
                {featuredProduct.tastingProfile.texture}. Pairs exceptionally with{" "}
                {featuredProduct.tastingProfile.pairedFoods.join(", ")}.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
                <Sparkles size={14} className="text-amber-800" aria-hidden="true" />
                <span>Floral Sources: {featuredProduct.tastingProfile.floralSources.join(", ")}</span>
              </div>
            </div>

            <div className="w-full md:w-auto p-6 rounded-2xl bg-cream border border-amber-200/90 shadow-xs flex flex-col gap-3 min-w-[280px]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-charcoal">Natural Sweetness</span>
                <span className="font-mono text-amber-900">
                  {"★".repeat(featuredProduct.tastingProfile.sweetnessScale)}
                  {"☆".repeat(5 - featuredProduct.tastingProfile.sweetnessScale)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-charcoal">Aromatic Intensity</span>
                <span className="font-mono text-amber-900">
                  {"★".repeat(featuredProduct.tastingProfile.intensityScale)}
                  {"☆".repeat(5 - featuredProduct.tastingProfile.intensityScale)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-charcoal">Hive Location</span>
                <span className="font-mono text-amber-900">
                  {featuredProduct.origin.elevationMeters}m Elevation
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <StorefrontFooter />

      {/* Slide Over Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
