"use client";

import React, { useState } from "react";
import { ProductWithRelations, ProductVariant } from "@/types/catalog";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCentsToDollars } from "@/lib/catalog/pricing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn } from "@/lib/utils";
import { Check, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export interface FeaturedBuyBoxProps {
  product: ProductWithRelations;
  className?: string;
}

/**
 * Editorial buy box for the featured Raw Wildflower Reserve.
 * Provides reactive variant selection between 250g and 500g jars,
 * dynamic pricing and compare at calculation, and quantity stepping.
 * Satisfies AC-5 and connects directly to the persistent Zustand cart store.
 */
export function FeaturedBuyBox({ product, className }: FeaturedBuyBoxProps) {
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const addItem = useCartStore((state) => state.addItem);

  // Derive pricing values
  const unitPrice = selectedVariant.priceCents;
  const compareAt = selectedVariant.compareAtPriceCents || 0;
  const hasSavings = compareAt > unitPrice;
  const savingsPercent = hasSavings
    ? Math.round(((compareAt - unitPrice) / compareAt) * 100)
    : 0;

  const lineTotalPrice = unitPrice * quantity;
  const qualifiesForFreeShipping = lineTotalPrice >= 5000;

  const handleAddToCart = () => {
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
      quantity
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl p-6 sm:p-8 bg-cream border border-amber-200/80 shadow-[0_10px_35px_-10px_rgba(42,33,24,0.08)]",
        className
      )}
    >
      {/* Batch & Origin Meta Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="amber" size="sm">
          {product.batchNumber}
        </Badge>
        <span className="text-xs font-serif italic text-amber-900/80">
          Harvested {product.harvestYear} · {product.origin.region}
        </span>
      </div>

      {/* Product Title & Subtitle */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal leading-[1.15]">
        {product.title}
      </h1>
      <p className="font-serif text-lg text-amber-800/90 mt-1 italic">
        {product.subtitle}
      </p>

      {/* Description */}
      <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed mt-4">
        {product.description}
      </p>

      {/* Tasting Profile Highlights */}
      <div className="mt-5 pt-5 border-t border-amber-100 flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Sensory Notes
        </span>
        <div className="flex flex-wrap gap-1.5">
          {product.tastingProfile.flavorDescriptors.map((descriptor) => (
            <span
              key={descriptor}
              className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-950 text-xs border border-amber-200/60"
            >
              {descriptor}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-md bg-amber-100/70 text-amber-900 text-xs font-medium">
            {product.tastingProfile.colorRating}
          </span>
        </div>
      </div>

      {/* Dynamic Price Display */}
      <div className="mt-6 flex items-baseline gap-3">
        <span className="font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
          {formatCentsToDollars(unitPrice)}
        </span>
        {hasSavings && (
          <span className="text-lg text-charcoal/45 line-through font-serif">
            {formatCentsToDollars(compareAt)}
          </span>
        )}
        {hasSavings && (
          <Badge variant="gold" size="sm" className="font-semibold">
            Save {savingsPercent}%
          </Badge>
        )}
      </div>

      {/* Variant Selection Options */}
      <div className="mt-6 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Select Jar Size
          </span>
          <span className="text-xs text-charcoal/60">
            {selectedVariant.jarMaterial}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Jar size variants">
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
                  "flex flex-col p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 ease-[var(--ease-viscous)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2",
                  isSelected
                    ? "border-amber-700 bg-amber-50/90 shadow-xs"
                    : "border-amber-200/70 bg-cream-muted/40 hover:bg-amber-50/50 hover:border-amber-300"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-serif font-bold text-base text-charcoal">
                    {variant.weightGrams}g
                  </span>
                  <span className="text-xs font-mono font-medium text-amber-900">
                    {formatCentsToDollars(variant.priceCents)}
                  </span>
                </div>
                <span className="text-xs text-charcoal/70 mt-0.5 line-clamp-1">
                  {variant.title.replace(`${variant.weightGrams}g `, "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <label htmlFor="buy-box-quantity" className="sr-only">
            Quantity for {product.title}
          </label>
          <QuantitySelector
            id="buy-box-quantity"
            value={quantity}
            min={1}
            max={10}
            onChange={setQuantity}
            aria-label={`Quantity of ${selectedVariant.title}`}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 text-base font-semibold shadow-md active:scale-98 transition-transform cursor-pointer"
        >
          {isAdding ? (
            <>
              <Check size={18} className="animate-in fade-in" aria-hidden="true" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} aria-hidden="true" />
              <span>
                Add to Cart ({formatCentsToDollars(lineTotalPrice)})
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Assurances & Shipping Progress */}
      <div className="mt-6 pt-5 border-t border-amber-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal/80">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-amber-800 shrink-0" aria-hidden="true" />
          <span>Cold extracted, unpasteurized reserve</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-amber-800 shrink-0" aria-hidden="true" />
          <span>
            {qualifiesForFreeShipping
              ? "Free insured delivery unlocked"
              : "Complimentary shipping at $50"}
          </span>
        </div>
      </div>
    </div>
  );
}
