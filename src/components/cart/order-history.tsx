"use client";

import React, { useState } from "react";
import { OrderSummary } from "@/types/catalog";
import { getStoredOrderReceipts, ORDERS_STORAGE_KEY } from "@/lib/store/cart-store";
import { formatCentsToDollars } from "@/lib/catalog/pricing";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ArrowLeft,
  ChevronRight,
  Package,
  Calendar,
  ShoppingBag,
  Trash2,
} from "lucide-react";

export interface OrderHistoryProps {
  onBackToBag: () => void;
  onSelectOrder: (order: OrderSummary) => void;
}

export function OrderHistory({ onBackToBag, onSelectOrder }: OrderHistoryProps) {
  const [orders, setOrders] = useState<OrderSummary[]>(() => getStoredOrderReceipts());

  const handleClearHistory = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ORDERS_STORAGE_KEY);
      setOrders([]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-5 pb-6 text-charcoal">
      {/* Header Navigation */}
      <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
        <button
          type="button"
          onClick={onBackToBag}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded px-1.5 py-1 cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to Reserve Bag</span>
        </button>

        {orders.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="text-[11px] text-charcoal/60 hover:text-red-700 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded px-1.5 py-0.5 cursor-pointer"
          >
            <Trash2 size={12} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Clock size={18} className="text-amber-800" aria-hidden="true" />
        <h3 className="font-serif text-2xl font-bold text-charcoal">Past Reserve Orders</h3>
      </div>

      {/* Orders List or Empty State */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-4">
              <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h4 className="font-serif text-lg font-bold text-charcoal mb-1">
              No Previous Orders Found
            </h4>
            <p className="text-xs text-charcoal/70 max-w-xs mb-6 leading-relaxed">
              When you complete a reserve harvest order, your confirmed receipts are archived locally on this browser.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToBag}
              className="text-xs cursor-pointer"
            >
              Return to Reserve Bag
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-charcoal/70">
              Showing {orders.length} archived order{orders.length === 1 ? "" : "s"} on this device.
            </p>

            <ul className="space-y-2.5" role="list">
              {orders.map((order) => {
                const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const totalJars = order.items.reduce((acc, item) => acc + item.quantity, 0);

                return (
                  <li key={order.id}>
                    <button
                      type="button"
                      onClick={() => onSelectOrder(order)}
                      className="w-full p-4 rounded-2xl bg-white/80 hover:bg-white border border-amber-200/80 hover:border-amber-400 text-left transition-all shadow-xs flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-charcoal">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Confirmed
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-charcoal/70">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-amber-800" />
                            <span>{orderDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package size={12} className="text-amber-800" />
                            <span>
                              {totalJars} jar{totalJars === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-charcoal/60 truncate">
                          {order.items.map((i) => i.title).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-serif text-base font-bold text-amber-950">
                          {formatCentsToDollars(order.totalCents)}
                        </span>
                        <ChevronRight size={16} className="text-amber-800" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="pt-2 border-t border-amber-200/70">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBackToBag}
          className="w-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Return to Active Bag</span>
        </Button>
      </div>
    </div>
  );
}
