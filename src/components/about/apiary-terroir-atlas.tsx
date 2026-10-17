"use client";

import React, { useRef, useCallback } from "react";
import Link from "next/link";
import { ApiaryOriginDetail } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Mountain,
  Users,
  Sprout,
  SunMedium,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApiaryTerroirAtlasProps {
  origins: ApiaryOriginDetail[];
  activeOriginId: string;
  onSelectOrigin: (originId: string) => void;
  className?: string;
}

/**
 * Interactive Apiary Terroir Atlas with origin tabs, geographic elevation,
 * coordinate inspection, and direct links to harvested lot reserves.
 * Satisfies AC-2, AC-6, AC-7, and AC-8.
 */
export function ApiaryTerroirAtlas({
  origins,
  activeOriginId,
  onSelectOrigin,
  className,
}: ApiaryTerroirAtlasProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const activeOrigin =
    origins.find((o) => o.id === activeOriginId) ?? origins[0];

  // Accessible keyboard navigation for tabs (arrow keys)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex = currentIndex;
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % origins.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + origins.length) % origins.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = origins.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const nextOrigin = origins[nextIndex];
      if (nextOrigin) {
        onSelectOrigin(nextOrigin.id);
        const tabs = tabListRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]'
        );
        tabs?.[nextIndex]?.focus();
      }
    },
    [origins, onSelectOrigin]
  );

  return (
    <section
      id="terroir-atlas"
      aria-labelledby="terroir-atlas-heading"
      className={cn("w-full py-12 sm:py-16", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 border border-amber-200/70">
              <Compass size={18} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-900">
              Interactive Terroir Atlas
            </span>
          </div>
          <h2
            id="terroir-atlas-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal leading-[1.15]"
          >
            Single Origin Microclimates & Botanical Sanctuaries
          </h2>
          <p className="mt-4 font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed">
            Honey is never blended. Each harvest reflects the specific floral nectar,
            elevation, and seasonal humidity of its microclimate. Select an apiary to
            inspect the terroir profile and meeting of mountain slopes and bloom canopies.
          </p>
        </div>

        {/* Tab Navigation List */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Apiary origin terroirs"
          className="flex flex-wrap items-center gap-2.5 p-1.5 bg-amber-100/50 rounded-2xl border border-amber-200/60 max-w-fit mb-8"
        >
          {origins.map((origin, index) => {
            const isSelected = origin.id === activeOrigin.id;
            return (
              <button
                key={origin.id}
                role="tab"
                id={`origin-tab-${origin.id}`}
                aria-selected={isSelected}
                aria-controls={`origin-panel-${origin.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelectOrigin(origin.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "min-h-[44px] px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 ease-[var(--ease-viscous)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2",
                  "motion-reduce:transition-none motion-reduce:transform-none",
                  isSelected
                    ? "bg-amber-900 text-cream shadow-sm"
                    : "text-charcoal/75 hover:text-amber-950 hover:bg-amber-200/40"
                )}
              >
                {origin.region.split(",")[0]}
              </button>
            );
          })}
        </div>

        {/* Active Origin Display Panel */}
        <div
          key={activeOrigin.id}
          role="tabpanel"
          id={`origin-panel-${activeOrigin.id}`}
          aria-labelledby={`origin-tab-${activeOrigin.id}`}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-cream/95 p-6 sm:p-8 lg:p-10 rounded-3xl border border-amber-200/80 shadow-xs"
        >
          {/* Left Column: Geographic and Terroir Metrics */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="amber" size="sm">
                  {activeOrigin.elevationMeters}m Elevation
                </Badge>
                <Badge variant="outline" size="sm">
                  {activeOrigin.coordinates.latitude.toFixed(4)}° N,{" "}
                  {Math.abs(activeOrigin.coordinates.longitude).toFixed(4)}° W
                </Badge>
                {activeOrigin.purityTested && (
                  <Badge variant="gold" size="sm">
                    NMR Laboratory Verified
                  </Badge>
                )}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                {activeOrigin.region}
              </h3>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-200/50">
              <div className="flex items-start gap-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/40">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                  <Mountain size={18} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
                    Elevation & Relief
                  </span>
                  <p className="text-sm font-semibold text-charcoal mt-0.5">
                    {activeOrigin.elevationMeters} Meters above sea level
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/40">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                  <SunMedium size={18} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
                    Climate Profile
                  </span>
                  <p className="text-sm font-semibold text-charcoal mt-0.5">
                    {activeOrigin.climate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/40">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                  <Users size={18} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
                    Lead Beekeeper
                  </span>
                  <p className="text-sm font-semibold text-charcoal mt-0.5">
                    {activeOrigin.beekeeperName} ({activeOrigin.hiveCount} Hives)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/40">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                  <Sprout size={18} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
                    Flora Ecosystem
                  </span>
                  <p className="text-sm font-semibold text-charcoal mt-0.5">
                    {activeOrigin.floraEcosystem}
                  </p>
                </div>
              </div>
            </div>

            {/* Microclimate Philosophy Narrative */}
            <div className="bg-amber-100/30 p-4 sm:p-5 rounded-2xl border border-amber-200/60 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
              <span className="font-semibold text-amber-950 block mb-1">
                Terroir Note:
              </span>
              Colonies at this apiary enjoy strict isolation from commercial pesticides,
              nestled within deep nature preserves. Water source purity, barometric pressure,
              and native wildflower bloom duration directly establish the complex enzymes
              and delicate crystallization speed of each jar.
            </div>
          </div>

          {/* Right Column: Harvested Lot Reserves & Empty State */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-amber-50/60 p-6 rounded-2xl border border-amber-200/60">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                Harvested Lot Reserves
              </span>
              <span className="text-xs text-charcoal/70">
                {activeOrigin.products.length} Varietal
                {activeOrigin.products.length === 1 ? "" : "s"}
              </span>
            </div>

            {activeOrigin.products.length > 0 ? (
              <div className="flex flex-col gap-3">
                {activeOrigin.products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 bg-cream rounded-xl border border-amber-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-800">
                        {product.batchNumber}
                      </span>
                      <h4 className="font-serif text-base font-bold text-charcoal">
                        {product.title}
                      </h4>
                      <p className="text-xs text-charcoal/70 mt-0.5">
                        {product.subtitle}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="shrink-0 group"
                    >
                      <Link
                        href={`/catalog?category=${product.category}`}
                        className="flex items-center gap-1.5"
                      >
                        <span>Inspect Reserve</span>
                        <ArrowRight
                          size={14}
                          className="transform group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              /* AC-7 Graceful Empty Harvest State */
              <div
                role="status"
                aria-live="polite"
                className="py-8 px-4 text-center flex flex-col items-center gap-3 bg-cream/70 rounded-xl border border-dashed border-amber-300"
              >
                <div className="p-3 rounded-full bg-amber-100 text-amber-800">
                  <Sparkles size={22} aria-hidden="true" />
                </div>
                <div>
                  <Badge variant="amber" size="md">
                    Resting for next harvest
                  </Badge>
                  <p className="text-xs text-charcoal/75 max-w-xs mt-2 leading-relaxed">
                    Hives at this site are currently resting during their dormant cycle.
                    No active jars are bottled from this batch at this time.
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="mt-1">
                  <Link href="/catalog" className="flex items-center gap-1.5">
                    <span>Explore Current Catalog</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
