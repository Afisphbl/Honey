"use client";

import React, { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ProductWithRelations,
  ProductCategory,
} from "@/types/catalog";
import {
  CatalogSortOption,
  filterAndSortProducts,
} from "@/lib/catalog/queries";
import { CatalogFilterBar } from "./catalog-filter-bar";
import { ProductCard } from "./product-card";
import { BundleCard } from "./bundle-card";
import { EmptyCatalogState } from "./empty-catalog-state";
import { cn } from "@/lib/utils";

const VALID_CATEGORIES: (ProductCategory | "all")[] = [
  "all",
  "single_origin",
  "seasonal_reserve",
  "infusion",
  "raw_comb",
  "bundle",
];

const VALID_SORTS: CatalogSortOption[] = [
  "featured",
  "price_asc",
  "price_desc",
  "intensity",
];

export interface CatalogViewProps {
  initialProducts: ProductWithRelations[];
  className?: string;
}

/**
 * Main catalog view orchestrator with live filtering, sorting,
 * and shallow URL search parameter synchronization.
 * Satisfies AC-1, AC-2, and AC-3.
 */
export function CatalogView({
  initialProducts,
  className,
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse and normalize URL search parameters to safe defaults (satisfies AC-3)
  const rawCategory = searchParams.get("category");
  const activeCategory: ProductCategory | "all" =
    rawCategory && (VALID_CATEGORIES as string[]).includes(rawCategory)
      ? (rawCategory as ProductCategory | "all")
      : "all";

  const rawSort = searchParams.get("sort");
  const sortBy: CatalogSortOption =
    rawSort && (VALID_SORTS as string[]).includes(rawSort)
      ? (rawSort as CatalogSortOption)
      : "featured";

  const rawInStock = searchParams.get("inStock");
  const inStockOnly = rawInStock === "true" || rawInStock === "1";

  // URL search parameter updater using shallow Next.js routing
  const updateQueryParam = useCallback(
    (updates: {
      category?: ProductCategory | "all";
      sort?: CatalogSortOption;
      inStock?: boolean;
    }) => {
      const nextCategory = updates.category !== undefined ? updates.category : activeCategory;
      const nextSort = updates.sort !== undefined ? updates.sort : sortBy;
      const nextInStock = updates.inStock !== undefined ? updates.inStock : inStockOnly;

      const params = new URLSearchParams();

      if (nextCategory && nextCategory !== "all") {
        params.set("category", nextCategory);
      }

      if (nextSort && nextSort !== "featured") {
        params.set("sort", nextSort);
      }

      if (nextInStock) {
        params.set("inStock", "true");
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(targetUrl, { scroll: false });
    },
    [router, pathname, activeCategory, sortBy, inStockOnly]
  );

  const handleCategoryChange = useCallback(
    (category: ProductCategory | "all") => {
      updateQueryParam({ category });
    },
    [updateQueryParam]
  );

  const handleSortChange = useCallback(
    (sort: CatalogSortOption) => {
      updateQueryParam({ sort });
    },
    [updateQueryParam]
  );

  const handleInStockChange = useCallback(
    (inStock: boolean) => {
      updateQueryParam({ inStock });
    },
    [updateQueryParam]
  );

  const handleResetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Compute active category counts based on current inStockOnly toggle
  const categoryCounts = useMemo(() => {
    const base = inStockOnly
      ? initialProducts.filter(
          (p) =>
            p.inventoryStatus === "in_stock" ||
            p.inventoryStatus === "limited_reserve"
        )
      : initialProducts;

    const counts: Record<ProductCategory | "all", number> = {
      all: base.length,
      single_origin: 0,
      seasonal_reserve: 0,
      infusion: 0,
      raw_comb: 0,
      bundle: 0,
    };

    for (const p of base) {
      if (p.category in counts) {
        counts[p.category]++;
      }
    }

    return counts;
  }, [initialProducts, inStockOnly]);

  // Filter and sort the displayed product subset
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(initialProducts, {
      category: activeCategory,
      sortBy,
      inStockOnly,
    });
  }, [initialProducts, activeCategory, sortBy, inStockOnly]);

  return (
    <div className={cn("w-full flex flex-col", className)}>
      {/* Sticky Category and Sorting Filter Bar */}
      <CatalogFilterBar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        inStockOnly={inStockOnly}
        onInStockChange={handleInStockChange}
        counts={categoryCounts}
        totalResults={filteredProducts.length}
      />

      {/* Product Grid or Empty State Container */}
      <section
        id="catalog-product-grid"
        aria-label="Honey variety catalog results"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full"
      >
        {filteredProducts.length === 0 ? (
          <EmptyCatalogState onReset={handleResetFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) =>
              product.category === "bundle" ? (
                <BundleCard key={product.id} product={product} />
              ) : (
                <ProductCard key={product.id} product={product} />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
