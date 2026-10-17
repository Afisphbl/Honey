"use client";

import React, { useRef, useCallback } from "react";
import Link from "next/link";
import { Product, SeasonalCyclePhase } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Sparkles,
  Flower2,
  Clock,
  Hammer,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SeasonalHarvestCycleProps {
  phases: SeasonalCyclePhase[];
  activeSeason: string;
  onSelectSeason: (season: string) => void;
  products: Product[];
  className?: string;
}

const AVAILABILITY_LABELS: Record<string, { label: string; variant: "amber" | "gold" | "outline" | "cream" }> = {
  harvesting: { label: "Freshly Harvested", variant: "amber" },
  aging: { label: "Cellar Aging & Decanting", variant: "outline" },
  reserve: { label: "Limited Lot Reserve", variant: "gold" },
  dormant: { label: "Colony In Quiescence", variant: "cream" },
};

/**
 * Interactive Seasonal Harvest Cycle displaying annual apiculture rhythms,
 * floral bloom timetables, hive tasks, and seasonal jar availability.
 * Satisfies AC-3, AC-6, AC-7, and AC-8.
 */
export function SeasonalHarvestCycle({
  phases,
  activeSeason,
  onSelectSeason,
  products,
  className,
}: SeasonalHarvestCycleProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const activePhase =
    phases.find((p) => p.season === activeSeason) ?? phases[0];

  const featuredProducts = (activePhase.featuredProductIds ?? [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // Keyboard navigation for season selector tabs
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let nextIndex = currentIndex;
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % phases.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + phases.length) % phases.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = phases.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const nextPhase = phases[nextIndex];
      if (nextPhase) {
        onSelectSeason(nextPhase.season);
        const tabs = tabListRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]'
        );
        tabs?.[nextIndex]?.focus();
      }
    },
    [phases, onSelectSeason]
  );

  const availabilityMeta =
    AVAILABILITY_LABELS[activePhase.honeyAvailability] ?? {
      label: activePhase.honeyAvailability,
      variant: "amber",
    };

  return (
    <section
      id="seasonal-cycle"
      aria-labelledby="seasonal-cycle-heading"
      className={cn("w-full py-12 sm:py-16 bg-cream-muted/30 border-y border-amber-200/50", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 border border-amber-200/70">
              <Calendar size={18} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-900">
              Annual Apiculture Rhythm
            </span>
          </div>
          <h2
            id="seasonal-cycle-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal leading-[1.15]"
          >
            The Four Seasons of Pure Hive Alchemy
          </h2>
          <p className="mt-4 font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed">
            Authentic apiculture obeys the astronomical calendar and wild bloom cycles.
            Explore each season to discover the daily stewardship, flora canopies,
            and small batch extractions that define our reserve library.
          </p>
        </div>

        {/* Season Selector Tabs */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Apiculture seasonal harvest phases"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-amber-100/50 rounded-2xl border border-amber-200/60 max-w-2xl mb-8"
        >
          {phases.map((phase, index) => {
            const isSelected = phase.season === activePhase.season;
            return (
              <button
                key={phase.id}
                role="tab"
                id={`season-tab-${phase.season}`}
                aria-selected={isSelected}
                aria-controls={`season-panel-${phase.season}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelectSeason(phase.season)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "min-h-[44px] px-3 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold capitalize transition-all duration-200 ease-[var(--ease-viscous)] text-center",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2",
                  "motion-reduce:transition-none motion-reduce:transform-none",
                  isSelected
                    ? "bg-amber-900 text-cream shadow-sm"
                    : "text-charcoal/75 hover:text-amber-950 hover:bg-amber-200/40"
                )}
              >
                {phase.season}
              </button>
            );
          })}
        </div>

        {/* Active Seasonal Phase Panel */}
        <div
          key={activePhase.id}
          role="tabpanel"
          id={`season-panel-${activePhase.season}`}
          aria-labelledby={`season-tab-${activePhase.season}`}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-cream p-6 sm:p-8 lg:p-10 rounded-3xl border border-amber-200/80 shadow-xs"
        >
          {/* Left Column: Narrative & Apiculture Rhythm */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={availabilityMeta.variant} size="sm">
                  {availabilityMeta.label}
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200/60">
                  <Clock size={13} aria-hidden="true" />
                  {activePhase.timeframeMonths}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                {activePhase.title}
              </h3>
            </div>

            <p className="font-sans text-sm sm:text-base text-charcoal/85 leading-relaxed">
              {activePhase.storyExcerpt}
            </p>

            {/* Apiculture Stewardship Activity */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                <Hammer size={18} aria-hidden="true" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
                  Core Apiculture Stewardship
                </span>
                <p className="text-sm font-medium text-charcoal mt-0.5 leading-snug">
                  {activePhase.apicultureActivity}
                </p>
              </div>
            </div>

            {/* Active Floral Bloomed Canopies */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Flower2 size={16} className="text-amber-800" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal/80">
                  Active Floral Canopies
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activePhase.activeFlora.map((flora) => (
                  <span
                    key={flora}
                    className="inline-flex items-center text-xs font-medium text-amber-950 bg-amber-100/60 px-3 py-1 rounded-lg border border-amber-200/60"
                  >
                    {flora}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Seasonal Reserve Availability & Empty Fallback */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-amber-50/50 p-6 rounded-2xl border border-amber-200/60">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                Seasonal Honey Availability
              </span>
              <span className="text-xs text-charcoal/70 capitalize">
                {activePhase.season} Edition
              </span>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {featuredProducts.map((product) => (
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
                        <span>View Jar</span>
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
              /* AC-7 Resting State for Seasons with No Active Extraction */
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
                    During {activePhase.season}, colonies focus on survival and hive warmth.
                    No honey is removed during this dormancy period.
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
