import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../cart-store";

describe("useCartStore (covers AC-4)", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().setHasHydrated(false);
  });

  it("initializes with empty items and hydration flag false (AC-4)", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.hasHydrated).toBe(false);
    expect(state.isOpen).toBe(false);
  });

  it("updates hydration flag through setHasHydrated (AC-4)", () => {
    useCartStore.getState().setHasHydrated(true);
    expect(useCartStore.getState().hasHydrated).toBe(true);
  });

  it("adds an item and increments totals correctly", () => {
    const store = useCartStore.getState();
    store.addItem(
      {
        id: "jar-wildflower-16oz",
        productId: "wildflower-raw",
        title: "Raw Wildflower Honey",
        variant: {
          size: "16 oz",
          weightOz: 16,
          priceCents: 2400,
        },
      },
      2
    );

    const updated = useCartStore.getState();
    expect(updated.items).toHaveLength(1);
    expect(updated.items[0].quantity).toBe(2);
    expect(updated.getTotalItems()).toBe(2);
    expect(updated.getSubtotalCents()).toBe(4800);
    expect(updated.isOpen).toBe(true);
  });

  it("aggregates quantity when adding duplicate items", () => {
    const item = {
      id: "jar-lavender-12oz",
      productId: "lavender-infusion",
      title: "Mountain Lavender Honey",
      variant: {
        size: "12 oz",
        weightOz: 12,
        priceCents: 2800,
      },
    };

    useCartStore.getState().addItem(item, 1);
    useCartStore.getState().addItem(item, 2);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
    expect(state.getTotalItems()).toBe(3);
    expect(state.getSubtotalCents()).toBe(8400);
  });

  it("updates item quantity and removes on zero", () => {
    const item = {
      id: "jar-acacia-8oz",
      productId: "acacia-pure",
      title: "Pure Acacia Blossom Honey",
      variant: {
        size: "8 oz",
        weightOz: 8,
        priceCents: 1800,
      },
    };

    useCartStore.getState().addItem(item, 3);
    useCartStore.getState().updateQuantity("jar-acacia-8oz", 1);
    expect(useCartStore.getState().getTotalItems()).toBe(1);

    useCartStore.getState().updateQuantity("jar-acacia-8oz", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().getTotalItems()).toBe(0);
  });

  it("toggles cart open state", () => {
    useCartStore.getState().toggleCart(true);
    expect(useCartStore.getState().isOpen).toBe(true);
    useCartStore.getState().toggleCart(false);
    expect(useCartStore.getState().isOpen).toBe(false);
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it("removes a specific item by id and leaves others untouched", () => {
    const store = useCartStore.getState();
    store.addItem({
      id: "item-1",
      productId: "p1",
      title: "Clover Honey",
      variant: { size: "8 oz", weightOz: 8, priceCents: 1500 },
    });
    store.addItem({
      id: "item-2",
      productId: "p2",
      title: "Buckwheat Honey",
      variant: { size: "16 oz", weightOz: 16, priceCents: 2600 },
    });

    expect(useCartStore.getState().items).toHaveLength(2);
    useCartStore.getState().removeItem("item-1");

    const remaining = useCartStore.getState().items;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe("item-2");
  });

  it("safely handles removeItem on an id that does not exist in cart", () => {
    const store = useCartStore.getState();
    store.addItem({
      id: "item-1",
      productId: "p1",
      title: "Clover Honey",
      variant: { size: "8 oz", weightOz: 8, priceCents: 1500 },
    });

    useCartStore.getState().removeItem("non-existent-id");
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("calculates accurate subtotal across multiple distinct items and quantities", () => {
    const store = useCartStore.getState();
    store.addItem(
      {
        id: "item-1",
        productId: "p1",
        title: "Wildflower",
        variant: { size: "12 oz", weightOz: 12, priceCents: 2000 },
      },
      3
    ); // 6000 cents
    store.addItem(
      {
        id: "item-2",
        productId: "p2",
        title: "Tupelo",
        variant: { size: "16 oz", weightOz: 16, priceCents: 3500 },
      },
      2
    ); // 7000 cents

    expect(useCartStore.getState().getSubtotalCents()).toBe(13000);
    expect(useCartStore.getState().getTotalItems()).toBe(5);
  });

  it("clears all items and resets totals to zero with clearCart", () => {
    const store = useCartStore.getState();
    store.addItem({
      id: "item-1",
      productId: "p1",
      title: "Acacia",
      variant: { size: "8 oz", weightOz: 8, priceCents: 1800 },
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    useCartStore.getState().clearCart();

    const empty = useCartStore.getState();
    expect(empty.items).toHaveLength(0);
    expect(empty.getTotalItems()).toBe(0);
    expect(empty.getSubtotalCents()).toBe(0);
  });
});
