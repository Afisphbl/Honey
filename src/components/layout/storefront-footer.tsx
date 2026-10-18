import React from "react";
import Link from "next/link";
import { ShieldCheck, Leaf, HeartHandshake, Award } from "lucide-react";

/**
 * Editorial storefront footer with apiculture standards and ethical pledge.
 * Follows design.md charcoal foundation specifications.
 */
export function StorefrontFooter() {
  return (
    <footer className="w-full bg-charcoal text-cream-muted border-t border-amber-950/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-gold-light border border-amber-800/40">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-cream">
                100% Raw & Unheated
              </h4>
              <p className="text-xs text-cream-muted/70 mt-1 leading-relaxed">
                Extracted cold below natural hive temperatures to protect active live enzymes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-gold-light border border-amber-800/40">
              <Leaf size={20} aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-cream">
                Wild Pasture Foraged
              </h4>
              <p className="text-xs text-cream-muted/70 mt-1 leading-relaxed">
                Bees forage in subalpine Catskill wildflower meadows isolated from synthetic pesticides.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-gold-light border border-amber-800/40">
              <HeartHandshake size={20} aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-cream">
                Ethical Hive Stewardship
              </h4>
              <p className="text-xs text-cream-muted/70 mt-1 leading-relaxed">
                Hives are never stripped: honeybees retain ample surplus honey stores for winter survival.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-gold-light border border-amber-800/40">
              <Award size={20} aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-cream">
                Numbered Lot Reserve
              </h4>
              <p className="text-xs text-cream-muted/70 mt-1 leading-relaxed">
                Every jar bears its harvest year, lot number, and beekeeper validation certificate.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Information & Apiculture Note */}
        <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/10">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" role="img" aria-label="Honey jar">
                🍯
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream">
                Honey
              </span>
            </div>
            <p className="text-xs text-cream-muted/75 leading-relaxed">
              An artisanal apiculture collective dedicated to single origin honey preservation,
              transparent beekeeping traditions, and uncompromised sensory purity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-xs text-cream-muted/70">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-wider text-gold-light">
                Storefront
              </span>
              <Link
                href="/catalog"
                className="hover:text-gold-light transition-colors"
              >
                Reserves Catalog
              </Link>
              <Link
                href="/about"
                className="hover:text-gold-light transition-colors"
              >
                Brand Heritage & Apiaries
              </Link>
              <Link
                href="/about#terroir-atlas"
                className="hover:text-gold-light transition-colors"
              >
                Apiary Terroir Atlas
              </Link>
              <Link
                href="/about#purity-standards"
                className="hover:text-gold-light transition-colors"
              >
                Purity Verification
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-wider text-gold-light">
                Apiary Headquarters
              </span>
              <span>Catskill Highlands Region</span>
              <span>Elevation: 680 Meters</span>
              <span>New York, United States</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-wider text-gold-light">
                Reserve Certifications
              </span>
              <span>Raw Unpasteurized Honey</span>
              <span>Independent Purity Tested</span>
              <span>UV Protected French Glass</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-muted/60">
          <p>© 2026 Honey Artisanal Apiculture. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Sustainable Beekeeping</span>
            <span>Single Origin Purity</span>
            <span>Batch Traceability</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
