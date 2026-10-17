"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StorefrontHeaderProps {
  className?: string;
  transparent?: boolean;
}

/**
 * Floating transparent editorial navigation header with brand wordmark, origin tag,
 * and reactive cart badge trigger connected to useCartStore.
 * Satisfies AC-1 and AC-6.
 */
export function StorefrontHeader({
  className,
  transparent = true,
}: StorefrontHeaderProps) {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  // Render 0 before hydration to guarantee clean SSR markup match
  const displayCount = hasHydrated ? totalItems : 0;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-200",
        transparent
          ? "bg-cream/80 backdrop-blur-md border-b border-amber-200/50 shadow-xs"
          : "bg-cream/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Wordmark & Origin */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded-lg p-1 -ml-1"
        >
          <span
            className="text-2xl transform group-hover:scale-110 transition-transform duration-200 ease-[var(--ease-viscous)]"
            role="img"
            aria-label="Artisanal Honey"
          >
            🍯
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-charcoal leading-none">
              Honey
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-800/80 mt-0.5">
              Single Origin Reserve
            </span>
          </div>
        </Link>

        {/* Editorial Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal/80"
        >
          <a
            href="#harvest-story"
            className="hover:text-amber-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded-sm px-1 py-0.5"
          >
            Extraction Story
          </a>
          <a
            href="#featured-reserve"
            className="hover:text-amber-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded-sm px-1 py-0.5"
          >
            Featured Reserve
          </a>
          <a
            href="#tasting-profile"
            className="hover:text-amber-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded-sm px-1 py-0.5"
          >
            Tasting Notes
          </a>
          <a
            href="#purity-standard"
            className="hover:text-amber-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded-sm px-1 py-0.5"
          >
            Purity Standards
          </a>
        </nav>

        {/* Cart Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleCart(true)}
            aria-label={`Open shopping cart with ${displayCount} items`}
            className={cn(
              "relative flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-amber-300/80 bg-amber-50/80 text-charcoal cursor-pointer",
              "hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all duration-150 ease-[var(--ease-viscous)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            )}
          >
            <ShoppingBag size={18} className="text-amber-900" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
              Bag
            </span>
            <span
              className={cn(
                "inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold font-mono transition-colors",
                displayCount > 0
                  ? "bg-amber-800 text-cream"
                  : "bg-amber-200/80 text-amber-950"
              )}
            >
              {displayCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
