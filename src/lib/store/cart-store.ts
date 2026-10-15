import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartVariant {
  size: string;
  weightOz: number;
  priceCents: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  variant: CartVariant;
  quantity: number;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  getTotalItems: () => number;
  getSubtotalCents: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (item, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.id === item.id);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          set({ items: updated, isOpen: true });
        } else {
          set({
            items: [...items, { ...item, quantity }],
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
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
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
          (total, item) => total + item.variant.priceCents * item.quantity,
          0
        );
      },
    }),
    {
      name: "honey-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
