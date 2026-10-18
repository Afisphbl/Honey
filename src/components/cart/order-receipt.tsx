"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OrderSummary } from "@/types/catalog";
import { formatCentsToDollars } from "@/lib/catalog/pricing";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Package,
  Gift,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  CreditCard,
} from "lucide-react";

export interface OrderReceiptProps {
  order: OrderSummary;
  onContinueExploring: () => void;
  onViewHistory?: () => void;
  isHistoricalView?: boolean;
  onBackToHistory?: () => void;
}

export function OrderReceipt({
  order,
  onContinueExploring,
  onViewHistory,
  isHistoricalView = false,
  onBackToHistory,
}: OrderReceiptProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(order.orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback: silence or ignore
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-full space-y-6 pb-6 text-charcoal print-receipt-container">
      {/* Historical Navigation Back Action */}
      {isHistoricalView && onBackToHistory && (
        <div className="no-print border-b border-amber-200/70 pb-3">
          <button
            type="button"
            onClick={onBackToHistory}
            className="text-xs font-semibold text-amber-900 hover:text-charcoal cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded px-1.5 py-1"
          >
            ← Back to Order History
          </button>
        </div>
      )}

      {/* Confirmation Seal and Order Number Banner */}
      <div className="text-center py-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 shadow-xs">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
          <CheckCircle2 size={28} className="text-amber-800" aria-hidden="true" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900/80 block">
          Official Harvest Certificate
        </span>
        <h3 className="font-serif text-2xl font-bold text-charcoal mt-0.5">
          Reserve Order Confirmed
        </h3>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="font-mono text-base font-bold text-amber-950 bg-white/90 px-3 py-1 rounded-lg border border-amber-200 shadow-xs">
            {order.orderNumber}
          </span>
          <button
            type="button"
            onClick={handleCopyOrderNumber}
            aria-label="Copy order number"
            className="no-print p-1.5 rounded-lg text-charcoal/70 hover:text-charcoal hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check size={16} className="text-amber-800" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-charcoal/70">
          <Clock size={12} className="text-amber-800" aria-hidden="true" />
          <span>Placed on {formattedDate}</span>
          <span>·</span>
          <span className="font-mono text-[10px] text-charcoal/50">{order.id}</span>
        </div>
      </div>

      {/* Delivery Recipient and Address Summary */}
      <div className="p-4 rounded-xl bg-white/80 border border-amber-200/80 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-charcoal">
          <MapPin size={14} className="text-amber-800" aria-hidden="true" />
          <span>Delivery Details</span>
        </div>
        <div className="text-charcoal/80 leading-relaxed pl-5">
          <p className="font-medium text-charcoal">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>
          <p className="text-[11px] text-charcoal/60 mt-1">{order.customer.email}</p>
        </div>
      </div>

      {/* Gifting and Courier Note (if present) */}
      {(order.giftPackaging || order.giftNote || order.deliveryInstructions) && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2.5">
          {order.giftPackaging && (
            <div className="flex items-center gap-2 text-amber-950 font-bold">
              <Gift size={14} className="text-amber-800" aria-hidden="true" />
              <span>Complimentary Botanical Gift Packaging Selected</span>
            </div>
          )}

          {order.giftNote && (
            <div className="border-l-2 border-amber-800/60 pl-3 py-0.5">
              <span className="text-[10px] font-semibold text-amber-900 block uppercase tracking-wider">
                Handwritten Note:
              </span>
              <p className="italic text-charcoal/90 text-xs mt-0.5">&ldquo;{order.giftNote}&rdquo;</p>
            </div>
          )}

          {order.deliveryInstructions && (
            <div className="pl-3 py-0.5 text-charcoal/70">
              <span className="text-[10px] font-semibold text-charcoal/90 block">
                Courier Instructions:
              </span>
              <p className="text-xs mt-0.5">{order.deliveryInstructions}</p>
            </div>
          )}
        </div>
      )}

      {/* Line Items Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal border-b border-amber-200/60 pb-2">
          <Package size={14} className="text-amber-800" aria-hidden="true" />
          <span>Harvested Jars ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
        </div>

        <ul className="divide-y divide-amber-100" role="list">
          {order.items.map((item) => (
            <li key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-muted border border-amber-200/80 shrink-0">
                  <Image
                    src={item.imageUrl || "/frames/frame-001.webp"}
                    alt={item.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-bold text-charcoal truncate">{item.title}</p>
                  <p className="text-[11px] text-charcoal/70">
                    {item.variantTitle} · Qty {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-mono font-medium text-charcoal shrink-0">
                {formatCentsToDollars(item.unitPriceCents * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Summary & Payment Badge */}
      <div className="p-4 rounded-xl bg-cream-muted/80 border border-amber-200/80 text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-charcoal/80">Subtotal</span>
          <span className="font-mono font-medium text-charcoal">
            {formatCentsToDollars(order.subtotalCents)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal/80">Insured Shipping</span>
          <span className="font-mono font-medium text-charcoal">
            {order.shippingFeeCents === 0
              ? "Complimentary ($0.00)"
              : formatCentsToDollars(order.shippingFeeCents)}
          </span>
        </div>
        <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-amber-200/70">
          <span className="font-serif text-base">Total Paid</span>
          <span className="font-serif text-base font-bold text-amber-950">
            {formatCentsToDollars(order.totalCents)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 text-[11px] text-charcoal/60">
          <div className="flex items-center gap-1.5">
            <CreditCard size={12} className="text-amber-800" />
            <span>
              {order.paymentMethod === "apiary_reserve_credit"
                ? "Apiary Reserve Credit"
                : `Simulated Card •••• ${order.cardLast4 || "4242"}`}
            </span>
          </div>
          <span className="text-emerald-800 font-semibold uppercase tracking-wider text-[10px]">
            Payment Settled
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="no-print space-y-2.5 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handlePrint}
            className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer size={15} aria-hidden="true" />
            <span>Print Receipt</span>
          </Button>

          {onViewHistory && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onViewHistory}
              className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock size={15} aria-hidden="true" />
              <span>Past Orders</span>
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onContinueExploring}
          className="w-full text-base font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
        >
          <span>Continue Exploring Reserves</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal/50 pt-1">
        <Sparkles size={11} className="text-amber-700" aria-hidden="true" />
        <span>Authentic Reserve Receipt · Archived to Device Storage</span>
      </div>
    </div>
  );
}
