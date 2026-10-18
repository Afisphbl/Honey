"use client";

import React from "react";
import { ProductCategory } from "@/types/catalog";
import { CatalogSortOption } from "@/lib/catalog/queries";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export interface CatalogCategoryOption {
  id: ProductCategory | "all";
  label: string;
}

export const CATALOG_CATEGORIES: CatalogCategoryOption[] = [
  { id: "all", label: "All Reserves" },
  { id: "single_origin", label: "Single Origin" },
  { id: "infusion", label: "Infusions" },
  { id: "seasonal_reserve", label: "Seasonal Reserve" },
  { id: "raw_comb", label: "Raw Comb" },
  { id: "bundle", label: "Tasting Flights" },
];

export interface CatalogFilterBarProps {
  activeCategory: ProductCategory | "all";
  onCategoryChange: (category: ProductCategory | "all") => void;
  sortBy: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  counts: Record<ProductCategory | "all", number>;
  totalResults: number;
  className?: string;
}

/**
 * Sticky category filter bar with active count badges, sort dropdown, and in-stock toggle.
 * Satisfies AC-2.
 */
export function CatalogFilterBar({
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onInStockChange,
  counts,
  totalResults,
  className,
}: CatalogFilterBarProps) {
  return (
    <aside
      aria-label="Product catalog filters and sorting"
      className={cn(
        "sticky top-18 z-40 w-full bg-cream/95 backdrop-blur-md border-y border-amber-200/80 shadow-xs transition-colors",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Honey variety categories"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {CATALOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = counts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                role="tab"
                id={`tab-${cat.id}`}
                aria-selected={isActive}
                aria-controls="catalog-product-grid"
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800",
                  isActive
                    ? "bg-amber-800 text-cream shadow-xs font-bold"
                    : "bg-amber-100/60 text-charcoal/80 hover:bg-amber-200/60 hover:text-charcoal border border-amber-200/60"
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-mono font-bold",
                    isActive
                      ? "bg-amber-900/80 text-amber-100"
                      : "bg-amber-200/70 text-amber-950"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls: Sort Dropdown & In-Stock Switch */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-1 md:pt-0 border-t border-amber-200/40 md:border-t-0">
          {/* Results Summary */}
          <span className="text-xs text-charcoal/70 font-medium hidden sm:inline">
            <span className="font-semibold text-charcoal font-mono">{totalResults}</span>{" "}
            {totalResults === 1 ? "variety" : "varieties"}
          </span>

          {/* In Stock Only Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-charcoal/85">
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                role="switch"
                aria-checked={inStockOnly}
                checked={inStockOnly}
                onChange={(e) => onInStockChange(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "w-8 h-4.5 bg-amber-200/80 rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-amber-800",
                  "peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
                  "after:bg-white after:border-amber-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all",
                  "peer-checked:bg-amber-800 transition-colors"
                )}
              />
            </div>
            <span className="whitespace-nowrap">In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 relative">
            <ArrowUpDown
              size={14}
              className="text-amber-800 shrink-0 hidden xs:inline"
              aria-hidden="true"
            />
            <label htmlFor="catalog-sort-select" className="sr-only">
              Sort Honey Catalog
            </label>
            <div className="relative">
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as CatalogSortOption)}
                aria-label="Sort catalog results"
                className={cn(
                  "h-8.5 pl-2.5 pr-8 rounded-lg text-xs font-medium text-charcoal bg-amber-50/90 border border-amber-300/80 cursor-pointer appearance-none",
                  "hover:bg-amber-100/70 hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 transition-colors"
                )}
              >
                <option value="featured">Featured Reserves</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="intensity">Aromatic Intensity</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-800">
                <SlidersHorizontal size={12} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
