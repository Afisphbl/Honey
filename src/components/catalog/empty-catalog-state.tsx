"use client";

import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyCatalogStateProps {
  onReset: () => void;
  className?: string;
}

/**
 * Editorial empty state displayed when active filters yield zero products.
 * Provides thoughtful reassurance and a one-click Reset Filters action.
 * Satisfies AC-8.
 */
export function EmptyCatalogState({ onReset, className }: EmptyCatalogStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 sm:px-12 my-8 rounded-3xl",
        "bg-amber-50/50 border border-dashed border-amber-300/80 max-w-2xl mx-auto",
        className
      )}
    >
      {/* Decorative Icon */}
      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 mb-4 shadow-xs border border-amber-200">
        <Sparkles size={26} className="text-amber-800" aria-hidden="true" />
      </div>

      {/* Editorial Heading */}
      <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
        No Reserves Match These Terroir Criteria
      </h3>

      {/* Reassurance Copy */}
      <p className="text-sm sm:text-base text-charcoal/75 max-w-md mt-2.5 leading-relaxed">
        Our single origin harvests are strictly seasonal and bounded by natural flowering cycles.
        Adjust your category or stock filter to explore other wild nectars.
      </p>

      {/* One-click Reset Action */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className={cn(
            "h-11 px-6 rounded-xl flex items-center gap-2 text-xs font-semibold tracking-wider uppercase cursor-pointer",
            "bg-amber-800 text-cream hover:bg-amber-900 active:scale-[0.98] shadow-xs",
            "transition-all duration-150 ease-[var(--ease-viscous)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2"
          )}
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
}
