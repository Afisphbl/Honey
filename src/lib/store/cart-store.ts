import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { z } from "zod";
import {
  CartItem,
  LegacyCartVariant,
  OrderSummary,
  OrderTotals,
} from "@/types/catalog";
import { CartItemSchema, OrderSummarySchema } from "@/lib/catalog/schema";
import {
  calculateOrderTotals,
  MAX_QUANTITY_PER_VARIANT,
  MAX_TOTAL_CART_ITEMS,
} from "@/lib/catalog/pricing";

export type { CartItem, LegacyCartVariant as CartVariant };

export const ORDERS_STORAGE_KEY = "honey_orders";

const dummyStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const safeStorage = createJSONStorage(() =>
  typeof window !== "undefined" ? window.localStorage : dummyStorage
);

export function getStoredOrderReceipts(): OrderSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const result = z.array(OrderSummarySchema).safeParse(parsed);
    return result.success ? (result.data as OrderSummary[]) : [];
  } catch {
    return [];
  }
}

export function saveStoredOrderReceipt(receipt: OrderSummary): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredOrderReceipts();
    const updated = [receipt, ...existing];
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to persist order receipt", err);
  }
}

export interface CartInputItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  unitPriceCents?: number;
  weightOz?: number;
  imageUrl?: string;
  addedAt?: string;
  variant?: LegacyCartVariant;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (item: CartInputItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  getTotalItems: () => number;
  getSubtotalCents: () => number;
  getOrderTotals: () => OrderTotals;
  confirmOrderReceipt: (receipt: OrderSummary) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (item: CartInputItem, quantity = 1) => {
        if (quantity <= 0) {
          return;
        }

        const { items } = get();
        const totalItemsCurrently = get().getTotalItems();

        const safeQuantity = Math.max(
          1,
          Math.min(quantity, MAX_QUANTITY_PER_VARIANT)
        );

        if (totalItemsCurrently + safeQuantity > MAX_TOTAL_CART_ITEMS) {
          return;
        }

        const variantId = item.variantId || item.id;
        const variantTitle =
          item.variantTitle || item.variant?.size || "Standard Jar";
        const unitPriceCents =
          item.unitPriceCents ?? item.variant?.priceCents ?? 0;
        const weightOz = item.weightOz ?? item.variant?.weightOz ?? 8;
        const imageUrl = item.imageUrl || "/frames/frame-001.webp";
        const addedAt = item.addedAt || new Date().toISOString();

        const existingIndex = items.findIndex((i) => i.id === item.id);

        if (existingIndex > -1) {
          const currentItem = items[existingIndex];
          const newQuantity = Math.min(
            MAX_QUANTITY_PER_VARIANT,
            currentItem.quantity + safeQuantity
          );

          const updated = [...items];
          updated[existingIndex] = {
            ...currentItem,
            quantity: newQuantity,
          };

          set({ items: updated, isOpen: true });
        } else {
          const newItem: CartItem = {
            id: item.id,
            productId: item.productId,
            variantId,
            title: item.title,
            variantTitle,
            unitPriceCents,
            weightOz,
            imageUrl,
            quantity: safeQuantity,
            addedAt,
            variant: item.variant ?? {
              size: variantTitle,
              weightOz,
              priceCents: unitPriceCents,
            },
          };

          set({
            items: [...items, newItem],
            isOpen: true,
          });
        }
      },

      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const clampedQuantity = Math.min(quantity, MAX_QUANTITY_PER_VARIANT);

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: clampedQuantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: (open?: boolean) => {
        set((state) => ({
          isOpen: typeof open === "boolean" ? open : !state.isOpen,
        }));
      },

      setHasHydrated: (hydrated: boolean) => {
        set({ hasHydrated: hydrated });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotalCents: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            (item.unitPriceCents ?? item.variant?.priceCents ?? 0) *
              item.quantity,
          0
        );
      },

      getOrderTotals: () => {
        return calculateOrderTotals(get().items);
      },

      confirmOrderReceipt: (receipt: OrderSummary) => {
        saveStoredOrderReceipt(receipt);
        get().clearCart();
      },
    }),
    {
      name: "honey-cart-storage",
      storage: safeStorage,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state, error) => {
        if (state) {
          if (error) {
            state.clearCart();
          } else if (Array.isArray(state.items)) {
            const validation = z.array(CartItemSchema).safeParse(state.items);
            if (!validation.success) {
              state.clearCart();
            } else {
              // Ensure cart limits are strictly observed
              let totalQuantity = 0;
              let isCorrupted = false;

              for (const item of validation.data) {
                if (item.quantity < 1 || item.quantity > MAX_QUANTITY_PER_VARIANT) {
                  isCorrupted = true;
                  break;
                }
                totalQuantity += item.quantity;
              }

              if (isCorrupted || totalQuantity > MAX_TOTAL_CART_ITEMS) {
                state.clearCart();
              } else {
                setCartItems(state, validation.data as CartItem[]);
              }
            }
          } else {
            state.clearCart();
          }

          state.setHasHydrated(true);
        }
      },
    }
  )
);

function setCartItems(state: CartState, items: CartItem[]) {
  state.items = items;
}
