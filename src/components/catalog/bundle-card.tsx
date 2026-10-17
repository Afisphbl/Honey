"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductWithRelations } from "@/types/catalog";
import { formatCentsToDollars } from "@/lib/catalog/pricing";
import { useCartStore } from "@/lib/store/cart-store";
import { Badge } from "@/components/ui/badge";
import { TastingDrawer } from "./tasting-drawer";
import { cn } from "@/lib/utils";
import { ShoppingBag, Check, Gift, Package, Sparkles } from "lucide-react";

export interface BundleCardProps {
  product: ProductWithRelations;
  className?: string;
  defaultExpanded?: boolean;
}

/**
 * Editorial bundle and tasting flight card.
 * Highlights curated gift packaging, included jar chips, bundle savings indicators,
 * and direct one click cart addition.
 * Satisfies AC-4 and AC-7.
 */
export function BundleCard({
  product,
  className,
  defaultExpanded = false,
}: BundleCardProps) {
  const variant = product.variants[0];
  const [isTastingOpen, setIsTastingOpen] = useState<boolean>(defaultExpanded);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const addItem = useCartStore((state) => state.addItem);

  const unitPrice = variant?.priceCents ?? 8800;
  const compareAt = variant?.compareAtPriceCents ?? 11400;
  const savingsCents = compareAt > unitPrice ? compareAt - unitPrice : 0;
  const savingsPercent =
    compareAt > unitPrice ? Math.round((savingsCents / compareAt) * 100) : 0;

  const handleAddToCart = () => {
    if (!variant) return;

    setIsAdding(true);
    addItem(
      {
        id: `${product.id}-${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantTitle: variant.title,
        unitPriceCents: variant.priceCents,
        weightOz: variant.weightOz,
        imageUrl: variant.imageUrl || product.imageUrl,
      },
      1
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <article
      aria-label={`${product.title} gift set`}
      className={cn(
        "flex flex-col h-full rounded-2xl bg-gradient-to-b from-amber-50/70 to-cream border-2 border-amber-300/80 shadow-md",
        "hover:shadow-lg hover:border-amber-400 transition-all duration-200",
        className
      )}
    >
      <div className="p-5 pb-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-800 text-cream shadow-xs">
              <Gift size={12} className="text-amber-200" aria-hidden="true" />
              Gift Box Edition
            </span>
            <Badge variant="amber" size="sm">
              {product.batchNumber}
            </Badge>
          </div>
          <span className="text-xs font-serif font-semibold text-amber-900/90">
            {product.harvestYear} Reserve Trio
          </span>
        </div>

        {/* Media Container */}
        <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-amber-100/40 border border-amber-300/50 mb-3 flex items-center justify-center">
          <Image
            src={variant?.imageUrl || product.imageUrl || "/frames/frame-001.webp"}
            alt={`${product.title} gift set presentation`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent pointer-events-none" />

          {/* Included Jar Count Badge */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cream/95 backdrop-blur-xs border border-amber-300 text-[11px] font-bold text-amber-950 shadow-xs">
            <Package size={13} className="text-amber-800" aria-hidden="true" />
            <span>3 x 125g Tasting Jars Included</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal leading-snug">
          {product.title}
        </h2>
        <p className="font-serif italic text-xs sm:text-sm text-amber-900/90 mt-0.5">
          {product.subtitle}
        </p>

        {/* Description */}
        <p className="text-xs text-charcoal/80 leading-relaxed mt-2.5">
          {product.description}
        </p>

        {/* Included Jars Preview Chips */}
        <div className="mt-4 pt-3 border-t border-amber-200/60">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-2">
            <Sparkles size={12} className="text-amber-700" aria-hidden="true" />
            <span>Included Varietals In Box</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {product.includedProducts && product.includedProducts.length > 0 ? (
              product.includedProducts.map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cream/90 border border-amber-200/70 text-xs"
                >
                  <span className="font-medium text-charcoal">{inc.title}</span>
                  <span className="text-[10px] text-amber-800/80 italic font-serif">
                    {inc.subtitle}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cream/90 border border-amber-200/70 text-xs">
                  <span className="font-medium text-charcoal">Raw Wildflower Reserve</span>
                  <span className="text-[10px] text-amber-800/80 italic font-serif">Catskill Highlands</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cream/90 border border-amber-200/70 text-xs">
                  <span className="font-medium text-charcoal">Pure Acacia Blossom</span>
                  <span className="text-[10px] text-amber-800/80 italic font-serif">Black Forest Canopy</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cream/90 border border-amber-200/70 text-xs">
                  <span className="font-medium text-charcoal">Mountain Lavender Infusion</span>
                  <span className="text-[10px] text-amber-800/80 italic font-serif">Provence Plateau</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Packaging Specification Note */}
        {variant?.jarMaterial && (
          <div className="mt-3 text-[11px] text-charcoal/70 flex items-center gap-1.5">
            <Package size={12} className="text-amber-800 shrink-0" aria-hidden="true" />
            <span>Housed in {variant.jarMaterial}</span>
          </div>
        )}
      </div>

      {/* Pricing & Cart Action */}
      <div className="px-5 pt-2 pb-4 mt-auto border-t border-amber-200/70 flex flex-col gap-3">
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-charcoal">
              {formatCentsToDollars(unitPrice)}
            </span>
            {compareAt > unitPrice && (
              <span className="text-xs text-charcoal/50 line-through">
                {formatCentsToDollars(compareAt)}
              </span>
            )}
          </div>

          {savingsCents > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-800 text-cream shadow-xs">
              Save {formatCentsToDollars(savingsCents)} ({savingsPercent}%)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label={`Add ${product.title} tasting flight to bag for ${formatCentsToDollars(unitPrice)}`}
          className={cn(
            "w-full h-11 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase cursor-pointer",
            "bg-amber-800 text-cream hover:bg-amber-900 active:scale-[0.98] shadow-sm",
            "transition-all duration-150 ease-[var(--ease-viscous)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2"
          )}
        >
          {isAdding ? (
            <>
              <Check size={16} className="text-cream" aria-hidden="true" />
              <span>Added Flight to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag size={16} className="text-amber-200" aria-hidden="true" />
              <span>Add Tasting Flight to Bag</span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Flight Sensory Profile */}
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
