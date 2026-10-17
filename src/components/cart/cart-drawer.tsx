"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCentsToDollars } from "@/lib/catalog/pricing";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, Truck, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartDrawerProps {
  className?: string;
}

/**
 * Slide over cart drawer connected to useCartStore.
 * Displays line items, quantity adjustment, subtotal, free shipping progress,
 * and order checkout CTA. Satisfies AC-6.
 */
export function CartDrawer({ className }: CartDrawerProps) {
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getOrderTotals = useCartStore((state) => state.getOrderTotals);

  const totals = getOrderTotals();
  const subtotalFormatted = formatCentsToDollars(totals.subtotalCents);
  const totalFormatted = formatCentsToDollars(totals.totalCents);
  const qualifiesForFreeShipping = totals.shippingFeeCents === 0 && totals.subtotalCents > 0;
  const remainingForFreeShipping = Math.max(0, 5000 - totals.subtotalCents);
  const shippingFormatted = qualifiesForFreeShipping
    ? "Free"
    : formatCentsToDollars(totals.shippingFeeCents);

  // Free shipping threshold progress (5000 cents = $50.00)
  const shippingThresholdCents = 5000;
  const progressRatio = Math.min(1, totals.subtotalCents / shippingThresholdCents);
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <Drawer open={isOpen} onOpenChange={toggleCart}>
      <DrawerContent
        accessibleTitleFallback="Artisanal Honey Shopping Bag"
        className={cn("flex flex-col h-full bg-cream", className)}
      >
        {/* Drawer Header */}
        <DrawerHeader className="border-b border-amber-200/70 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-800" aria-hidden="true" />
            <DrawerTitle className="font-serif text-2xl font-bold text-charcoal">
              Your Reserve Bag
            </DrawerTitle>
          </div>
          <p className="text-xs text-charcoal/70">
            {items.length === 0
              ? "No reserve jars selected"
              : `${items.reduce((acc, item) => acc + item.quantity, 0)} jar${
                  items.reduce((acc, item) => acc + item.quantity, 0) === 1 ? "" : "s"
                } in order`}
          </p>

          {/* Free Shipping Progress Indicator */}
          <div className="mt-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/70">
            <div className="flex items-center justify-between text-xs font-medium text-amber-950 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-amber-800" aria-hidden="true" />
                <span>
                  {qualifiesForFreeShipping
                    ? "Complimentary delivery unlocked"
                    : `Add ${formatCentsToDollars(
                        remainingForFreeShipping
                      )} for free delivery`}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-900">
                {progressPercent}%
              </span>
            </div>
            <div
              className="w-full h-1.5 rounded-full bg-amber-200/70 overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full bg-amber-700 transition-all duration-300 ease-[var(--ease-viscous)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </DrawerHeader>

        {/* Drawer Body: Line Items or Empty State */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-4">
                <ShoppingBag size={28} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-1">
                Your Bag Is Empty
              </h3>
              <p className="text-xs text-charcoal/70 max-w-xs mb-6 leading-relaxed">
                Explore our raw wildflower and single origin harvests to begin your reserve order.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleCart(false)}
                className="text-xs cursor-pointer"
              >
                Discover Reserves
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-amber-100" role="list">
              {items.map((item) => {
                const lineItemTotal =
                  (item.unitPriceCents || item.variant?.priceCents || 0) *
                  item.quantity;

                return (
                  <li key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    {/* Item Thumbnail */}
                    <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-cream-muted border border-amber-200/80 shrink-0">
                      <Image
                        src={item.imageUrl || "/frames/frame-001.webp"}
                        alt={item.title}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-base font-bold text-charcoal leading-tight line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-amber-900/80 mt-0.5 line-clamp-1">
                            {item.variantTitle || item.variant?.size}
                          </p>
                        </div>
                        <span className="font-serif text-sm font-bold text-charcoal shrink-0">
                          {formatCentsToDollars(lineItemTotal)}
                        </span>
                      </div>

                      {/* Stepper & Remove Action */}
                      <div className="flex items-center justify-between mt-3">
                        <QuantitySelector
                          value={item.quantity}
                          min={1}
                          max={10}
                          onChange={(newQty) => updateQuantity(item.id, newQty)}
                          aria-label={`Quantity for ${item.title}`}
                          className="scale-90 origin-left"
                        />

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                          className="p-1.5 rounded-lg text-charcoal/50 hover:text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Drawer Footer: Totals and Checkout CTA */}
        {items.length > 0 && (
          <DrawerFooter className="border-t border-amber-200/70 bg-cream-muted/50 p-6 space-y-3">
            <div className="space-y-1.5 text-xs text-charcoal/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-charcoal">
                  {subtotalFormatted}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span className="font-mono font-medium text-charcoal">
                  {shippingFormatted}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-amber-200/60">
                <span className="font-serif text-base">Estimated Total</span>
                <span className="font-serif text-base font-bold text-amber-950">
                  {totalFormatted}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-semibold shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => {
                // Checkout hook will connect in full Slice 4
                alert("Order completion will be finalized in Slice 4: Cart drawer & order completion.");
              }}
            >
              <span>Complete Reserve Order</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal/60 pt-1">
              <Sparkles size={12} className="text-amber-700" aria-hidden="true" />
              <span>Small batch raw honey · Guaranteed safe transit</span>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
