"use client";

import React, { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ApiaryOriginDetail,
  BeekeepingPledge,
  Product,
  PurityStandard,
  SeasonalCyclePhase,
} from "@/types/catalog";
import { ApiaryTerroirAtlas } from "./apiary-terroir-atlas";
import { SeasonalHarvestCycle } from "./seasonal-harvest-cycle";
import { PurityVerificationGrid } from "./purity-verification-grid";
import { EthicalBeekeepingPledges } from "./ethical-beekeeping-pledges";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AboutViewProps {
  origins: ApiaryOriginDetail[];
  phases: SeasonalCyclePhase[];
  standards: PurityStandard[];
  pledges: BeekeepingPledge[];
  products: Product[];
  className?: string;
}

/**
 * Main brand heritage and apiary story view orchestrator.
 * Synchronizes origin and seasonal tab selections with shallow URL search parameters.
 * Satisfies AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, and AC-8.
 */
export function AboutView({
  origins,
  phases,
  standards,
  pledges,
  products,
  className,
}: AboutViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Valid origin IDs and seasons for normalization
  const validOriginIds = useMemo(() => origins.map((o) => o.id), [origins]);
  const validSeasons = useMemo(() => phases.map((p) => p.season), [phases]);

  // Safe fallback to first items when missing or invalid (AC-6)
  const rawOrigin = searchParams.get("origin");
  const activeOriginId =
    rawOrigin && validOriginIds.includes(rawOrigin)
      ? rawOrigin
      : origins[0]?.id ?? "catskill-highlands";

  const rawSeason = searchParams.get("season");
  const activeSeason =
    rawSeason && (validSeasons as string[]).includes(rawSeason)
      ? rawSeason
      : phases[0]?.season ?? "spring";

  // Shallow URL updater preserving active parameters
  const updateQueryParams = useCallback(
    (updates: { origin?: string; season?: string }) => {
      const nextOrigin =
        updates.origin !== undefined ? updates.origin : activeOriginId;
      const nextSeason =
        updates.season !== undefined ? updates.season : activeSeason;

      const params = new URLSearchParams();

      // Only set if different from default, or persist explicitly for direct links
      if (nextOrigin) {
        params.set("origin", nextOrigin);
      }
      if (nextSeason) {
        params.set("season", nextSeason);
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(targetUrl, { scroll: false });
    },
    [router, pathname, activeOriginId, activeSeason]
  );

  const handleSelectOrigin = useCallback(
    (originId: string) => {
      updateQueryParams({ origin: originId });
    },
    [updateQueryParams]
  );

  const handleSelectSeason = useCallback(
    (season: string) => {
      updateQueryParams({ season });
    },
    [updateQueryParams]
  );

  return (
    <div className={cn("w-full flex flex-col", className)}>
      {/* 1. Apiary Terroir Atlas Section (AC-2, AC-6, AC-7, AC-8) */}
      <ApiaryTerroirAtlas
        origins={origins}
        activeOriginId={activeOriginId}
        onSelectOrigin={handleSelectOrigin}
      />

      {/* 2. Seasonal Harvest Cycle Section (AC-3, AC-6, AC-7, AC-8) */}
      <SeasonalHarvestCycle
        phases={phases}
        activeSeason={activeSeason}
        onSelectSeason={handleSelectSeason}
        products={products}
      />

      {/* 3. Laboratory Purity Verification Section (AC-4) */}
      <PurityVerificationGrid standards={standards} />

      {/* 4. Ethical Beekeeping Pledges Section (AC-5) */}
      <EthicalBeekeepingPledges pledges={pledges} />

      {/* 5. Closing Reserve Honey Tasting Flight Invitation (AC-1) */}
      <section
        id="reserve-invitation"
        aria-labelledby="reserve-invitation-heading"
        className="w-full py-16 sm:py-20 bg-gradient-to-b from-cream to-amber-100/60 border-t border-amber-200/70"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <Badge variant="gold" size="md" className="mb-4">
            <Sparkles size={14} className="mr-1.5" aria-hidden="true" />
            Sensory Flight Experience
          </Badge>

          <h2
            id="reserve-invitation-heading"
            className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-charcoal leading-[1.15] mb-4"
          >
            Experience Single Origin Terroirs at Your Table
          </h2>

          <p className="font-sans text-base sm:text-lg text-charcoal/80 max-w-2xl leading-relaxed mb-8">
            From the subalpine wildflower pastures of the Catskills to the sun drenched
            lavender plateaus of Provence, discover the sensory depth of pure, cold extracted
            honey in our curated tasting flights and numbered harvest lots.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" asChild className="group">
              <Link href="/catalog" className="flex items-center gap-2">
                <span>Explore the Reserve Catalog</span>
                <ArrowRight
                  size={16}
                  className="transform group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <Link href="/catalog?category=bundle">
                <span>Inspect Tasting Flight Gift Box</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
