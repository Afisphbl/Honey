"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductWithRelations, ProductVariant } from "@/types/catalog";
import { formatCentsToDollars } from "@/lib/catalog/pricing";
import { useCartStore } from "@/lib/store/cart-store";
import { Badge } from "@/components/ui/badge";
import { TastingDrawer } from "./tasting-drawer";
import { cn } from "@/lib/utils";
import { ShoppingBag, Check, MapPin, Mountain } from "lucide-react";

export interface ProductCardProps {
  product: ProductWithRelations;
  className?: string;
  defaultExpanded?: boolean;
}

/**
 * Editorial catalog variety card.
 * Features variant weight selection, dynamic pricing, direct cart drawer action,
 * and integrated accessible tasting notes drawer.
 * Satisfies AC-4, AC-5, and AC-6.
 */
export function ProductCard({
  product,
  className,
  defaultExpanded = false,
}: ProductCardProps) {
  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(defaultVariant);
  const [isTastingOpen, setIsTastingOpen] = useState<boolean>(defaultExpanded);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const addItem = useCartStore((state) => state.addItem);

  const isAvailable =
    product.inventoryStatus === "in_stock" ||
    product.inventoryStatus === "limited_reserve";

  const isLimited = product.inventoryStatus === "limited_reserve";
  const isOutOfSeason = product.inventoryStatus === "out_of_season";
  const isSoldOut = product.inventoryStatus === "sold_out";

  const unitPrice = selectedVariant.priceCents;
  const compareAt = selectedVariant.compareAtPriceCents ?? 0;
  const hasSavings = compareAt > unitPrice;
  const savingsPercent = hasSavings
    ? Math.round(((compareAt - unitPrice) / compareAt) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!isAvailable) return;

    setIsAdding(true);
    addItem(
      {
        id: `${product.id}-${selectedVariant.id}`,
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        variantTitle: selectedVariant.title,
        unitPriceCents: selectedVariant.priceCents,
        weightOz: selectedVariant.weightOz,
        imageUrl: selectedVariant.imageUrl || product.imageUrl,
      },
      1
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <article
      aria-label={`${product.title} catalog entry`}
      className={cn(
        "flex flex-col h-full rounded-2xl bg-cream border border-amber-200/80 shadow-xs",
        "hover:shadow-md hover:border-amber-300 transition-all duration-200",
        className
      )}
    >
      {/* Top Media & Origin Section */}
      <div className="p-5 pb-3">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="amber" size="sm">
              {product.batchNumber}
            </Badge>
            {isLimited && (
              <Badge variant="gold" size="sm">
                Limited Reserve
              </Badge>
            )}
            {isOutOfSeason && (
              <Badge variant="cream" size="sm">
                Out of Season
              </Badge>
            )}
            {isSoldOut && (
              <Badge variant="cream" size="sm">
                Sold Out
              </Badge>
            )}
          </div>
          <span className="text-xs font-serif font-semibold text-amber-900/80">
            Harvest {product.harvestYear}
          </span>
        </div>

        {/* Jar Visual Representation */}
        <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-amber-50/60 border border-amber-200/40 mb-3 flex items-center justify-center">
          <Image
            src={selectedVariant.imageUrl || product.imageUrl || "/frames/frame-001.webp"}
            alt={`${product.title} ${selectedVariant.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-[var(--ease-viscous)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent pointer-events-none" />

          {/* Terroir Elevation Pill */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-cream/90 backdrop-blur-xs border border-amber-200/60 text-[11px] font-medium text-charcoal/90">
            <Mountain size={12} className="text-amber-800" aria-hidden="true" />
            <span>{product.origin.elevationMeters}m elevation</span>
          </div>
        </div>

        {/* Terroir Region */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-900/80 mb-1">
          <MapPin size={11} className="text-amber-700 shrink-0" aria-hidden="true" />
          <span className="truncate">{product.origin.region}</span>
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal leading-snug">
          {product.title}
        </h2>
        <p className="font-serif italic text-xs sm:text-sm text-amber-900/85 mt-0.5">
          {product.subtitle}
        </p>

        {/* Product Description */}
        <p className="text-xs text-charcoal/75 leading-relaxed mt-2.5 line-clamp-3">
          {product.description}
        </p>
      </div>

      {/* Middle Section: Variant Pills & Pricing */}
      <div className="px-5 pt-2 pb-4 mt-auto border-t border-amber-100 flex flex-col gap-3">
        {/* Variant Weight Selector */}
        {product.variants.length > 1 && (
          <div>
            <span className="block text-[11px] font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wider">
              Select Size
            </span>
            <div
              role="radiogroup"
              aria-label={`Jar sizes for ${product.title}`}
              className="flex flex-wrap gap-1.5"
            >
              {product.variants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150 cursor-pointer",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800",
                      isSelected
                        ? "bg-amber-800 text-cream border-amber-800 shadow-xs font-semibold"
                        : "bg-cream/90 text-charcoal/80 border-amber-200 hover:bg-amber-100/60"
                    )}
                  >
                    {variant.weightGrams}g
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Savings Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-charcoal">
              {formatCentsToDollars(unitPrice)}
            </span>
            {hasSavings && (
              <span className="text-xs text-charcoal/50 line-through">
                {formatCentsToDollars(compareAt)}
              </span>
            )}
          </div>

          {hasSavings && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
              Save {savingsPercent}%
            </span>
          )}
        </div>

        {/* Add to Cart Action */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          aria-label={
            isAvailable
              ? `Add ${product.title} (${selectedVariant.title}) to shopping bag for ${formatCentsToDollars(unitPrice)}`
              : undefined
          }
          className={cn(
            "w-full h-11 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase cursor-pointer",
            "transition-all duration-150 ease-[var(--ease-viscous)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2",
            isAvailable
              ? "bg-amber-800 text-cream hover:bg-amber-900 active:scale-[0.98] shadow-xs"
              : "bg-amber-200/50 text-charcoal/40 cursor-not-allowed border border-amber-200/60"
          )}
        >
          {isAdding ? (
            <>
              <Check size={16} className="text-cream" aria-hidden="true" />
              <span>Added to Bag</span>
            </>
          ) : isAvailable ? (
            <>
              <ShoppingBag size={16} className="text-amber-200" aria-hidden="true" />
              <span>Add to Bag</span>
            </>
          ) : (
            <span>{isSoldOut ? "Sold Out" : "Out of Season"}</span>
          )}
        </button>
      </div>

      {/* Bottom Section: Expandable Tasting Notes Drawer */}
      <div className="px-5 pb-4">
        <TastingDrawer
          tastingProfile={product.tastingProfile}
          isOpen={isTastingOpen}
          onToggle={() => setIsTastingOpen((prev) => !prev)}
        />
      </div>
    </article>
  );
}
