"use client";

import React, { useId } from "react";
import { TastingProfile } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { ChevronDown, Droplets, Flower2, Utensils, Sparkles } from "lucide-react";

export interface TastingDrawerProps {
  tastingProfile: TastingProfile;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  triggerClassName?: string;
  id?: string;
}

interface SensoryRatingProps {
  label: string;
  value: number;
  max?: number;
  unitLabel?: string;
}

function SensoryRating({
  label,
  value,
  max = 5,
  unitLabel = "stars",
}: SensoryRatingProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs font-semibold text-charcoal/80">
        <span>{label}</span>
        <span className="font-mono text-amber-900 font-bold">
          {value}/{max}
        </span>
      </div>
      <div
        className="flex items-center gap-1.5"
        role="meter"
        aria-label={`${label}: ${value} out of ${max} ${unitLabel}`}
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={max}
      >
        {Array.from({ length: max }, (_, index) => {
          const filled = index < value;
          return (
            <span
              key={index}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors duration-200",
                filled
                  ? "bg-amber-600 shadow-xs"
                  : "bg-amber-200/50"
              )}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Expandable sensory tasting notes drawer.
 * Uses native CSS grid transitions (0fr to 1fr) with viscous easing and reduced motion support.
 * Satisfies AC-5 and AC-6.
 */
export function TastingDrawer({
  tastingProfile,
  isOpen,
  onToggle,
  className,
  triggerClassName,
  id,
}: TastingDrawerProps) {
  const generatedId = useId();
  const panelId = id || `tasting-panel-${generatedId}`;
  const buttonId = `tasting-trigger-${generatedId}`;

  return (
    <div className={cn("w-full border-t border-amber-200/60 pt-3", className)}>
      {/* Accessible Toggle Button */}
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "w-full flex items-center justify-between py-2 text-xs font-semibold tracking-wider uppercase text-amber-950/90",
          "hover:text-amber-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 rounded-sm",
          "cursor-pointer group",
          triggerClassName
        )}
      >
        <span className="flex items-center gap-2">
          <Sparkles
            size={14}
            className="text-amber-700 transition-transform duration-200 group-hover:rotate-12"
            aria-hidden="true"
          />
          {isOpen ? "Hide Sensory Profile" : "Inspect Tasting Profile"}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "text-amber-800 transition-transform duration-300 ease-[var(--ease-viscous)] motion-reduce:transition-none",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Expandable Grid Transition Panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-viscous)] motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden min-h-0">
          <div className="pt-3 pb-1 space-y-3.5 text-xs text-charcoal/90">
            {/* Sensory Rating Meters */}
            <div className="grid grid-cols-2 gap-3 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/50">
              <SensoryRating
                label="Sweetness"
                value={tastingProfile.sweetnessScale}
              />
              <SensoryRating
                label="Aroma Intensity"
                value={tastingProfile.intensityScale}
              />
            </div>

            {/* Color & Texture Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 bg-cream/70 p-2 rounded-md border border-amber-100">
                <Droplets size={14} className="text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-semibold block text-charcoal/90">Color Shade</span>
                  <span className="text-charcoal/70">{tastingProfile.colorRating}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-cream/70 p-2 rounded-md border border-amber-100">
                <Sparkles size={14} className="text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-semibold block text-charcoal/90">Liquid Texture</span>
                  <span className="text-charcoal/70">{tastingProfile.texture}</span>
                </div>
              </div>
            </div>

            {/* Floral Sources */}
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-charcoal/90 mb-1.5">
                <Flower2 size={13} className="text-amber-800" aria-hidden="true" />
                <span>Nectar & Floral Sources</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tastingProfile.floralSources.map((source, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100/70 text-amber-950 border border-amber-200/60"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Flavor Notes */}
            {tastingProfile.flavorDescriptors.length > 0 && (
              <div>
                <span className="font-semibold block text-charcoal/90 mb-1.5">
                  Flavor Descriptors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tastingProfile.flavorDescriptors.map((flavor, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-cream text-charcoal/80 border border-amber-200/70"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Artisanal Food Pairings */}
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-charcoal/90 mb-1.5">
                <Utensils size={13} className="text-amber-800" aria-hidden="true" />
                <span>Artisanal Food Pairings</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tastingProfile.pairedFoods.map((pairing, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/80"
                  >
                    {pairing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
