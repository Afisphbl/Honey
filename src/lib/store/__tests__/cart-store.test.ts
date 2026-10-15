import { describe, it, expect, beforeEach } from "vitest";
import {
  useCartStore,
  getStoredOrderReceipts,
  ORDERS_STORAGE_KEY,
} from "../cart-store";
import { OrderSummary } from "@/types/catalog";

describe("useCartStore (satisfies AC-4, AC-5)", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().setHasHydrated(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ORDERS_STORAGE_KEY);
    }
  });

  it("initializes with empty items and hydration flag false (AC-4, AC-5)", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.hasHydrated).toBe(false);
    expect(state.isOpen).toBe(false);
  });

  it("updates hydration flag through setHasHydrated (AC-5)", () => {
    useCartStore.getState().setHasHydrated(true);
    expect(useCartStore.getState().hasHydrated).toBe(true);
  });

  it("adds an item and increments totals correctly with snapshots (AC-5)", () => {
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
    expect(updated.items[0].unitPriceCents).toBe(2400);
    expect(updated.items[0].variantTitle).toBe("16 oz");
    expect(updated.items[0].weightOz).toBe(16);
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

  it("enforces maximum 10 jars per variant limit", () => {
    const item = {
      id: "jar-lavender-12oz",
      productId: "lavender-infusion",
      title: "Mountain Lavender Honey",
      unitPriceCents: 2800,
      weightOz: 12,
    };

    useCartStore.getState().addItem(item, 8);
    useCartStore.getState().addItem(item, 5); // Exceeds 10

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(10);
  });

  it("ignores addItem with non positive quantity", () => {
    const item = {
      id: "jar-clover-8oz",
      productId: "clover",
      title: "Clover Honey",
      unitPriceCents: 1500,
      weightOz: 8,
    };

    useCartStore.getState().addItem(item, 0);
    useCartStore.getState().addItem(item, -2);

    expect(useCartStore.getState().items).toHaveLength(0);
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

  it("calculates accurate subtotal and order totals", () => {
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

    const totals = useCartStore.getState().getOrderTotals();
    expect(totals.subtotalCents).toBe(13000);
    expect(totals.shippingFeeCents).toBe(0); // Free shipping over $50
    expect(totals.totalCents).toBe(13000);
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

  it("clears cart and persists confirmed order receipt on confirmOrderReceipt (AC-5)", () => {
    const store = useCartStore.getState();
    store.addItem({
      id: "raw-wildflower-reserve-250g",
      productId: "raw-wildflower-reserve",
      title: "Raw Wildflower Reserve",
      unitPriceCents: 3400,
      weightOz: 8.8,
    });

    expect(useCartStore.getState().items).toHaveLength(1);

    const receipt: OrderSummary = {
      id: "ORD-1729000000-XYZ123",
      orderNumber: "HNY-54321",
      customer: {
        name: "Clara Oswald",
        email: "clara@tardis.org",
      },
      shippingAddress: {
        fullName: "Clara Oswald",
        email: "clara@tardis.org",
        line1: "76 Coal Hill Road",
        city: "London",
        state: "NY",
        postalCode: "10001",
        country: "US",
      },
      items: useCartStore.getState().items,
      subtotalCents: 3400,
      shippingFeeCents: 800,
      totalCents: 4200,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    useCartStore.getState().confirmOrderReceipt(receipt);

    // Cart is now cleared
    expect(useCartStore.getState().items).toHaveLength(0);

    // Order receipt is persisted in local storage
    const storedReceipts = getStoredOrderReceipts();
    expect(storedReceipts).toHaveLength(1);
    expect(storedReceipts[0].id).toBe("ORD-1729000000-XYZ123");
  });

  it("enforces maximum 30 total items cap across variants in cart (covers AC-4, AC-5)", () => {
    const store = useCartStore.getState();

    // Add 10 items of variant 1
    store.addItem(
      {
        id: "variant-1",
        productId: "p1",
        title: "Honey 1",
        unitPriceCents: 2000,
        weightOz: 8,
      },
      10
    );

    // Add 10 items of variant 2
    store.addItem(
      {
        id: "variant-2",
        productId: "p2",
        title: "Honey 2",
        unitPriceCents: 2000,
        weightOz: 8,
      },
      10
    );

    // Add 8 items of variant 3 (Total = 28)
    store.addItem(
      {
        id: "variant-3",
        productId: "p3",
        title: "Honey 3",
        unitPriceCents: 2000,
        weightOz: 8,
      },
      8
    );

    expect(useCartStore.getState().getTotalItems()).toBe(28);

    // Attempt to add 3 items of variant 4 (28 + 3 = 31 > 30 limit)
    store.addItem(
      {
        id: "variant-4",
        productId: "p4",
        title: "Honey 4",
        unitPriceCents: 2000,
        weightOz: 8,
      },
      3
    );

    // Should remain 28 items because 31 exceeds the 30 total items limit
    expect(useCartStore.getState().getTotalItems()).toBe(28);
    expect(useCartStore.getState().items).toHaveLength(3);

    // Adding 2 items reaches exact boundary of 30
    store.addItem(
      {
        id: "variant-4",
        productId: "p4",
        title: "Honey 4",
        unitPriceCents: 2000,
        weightOz: 8,
      },
      2
    );

    expect(useCartStore.getState().getTotalItems()).toBe(30);
    expect(useCartStore.getState().items).toHaveLength(4);
  });

  it("clamps quantity to 10 when updating quantity past variant limit (covers AC-4, AC-5)", () => {
    const store = useCartStore.getState();
    store.addItem({
      id: "jar-clover",
      productId: "clover",
      title: "Clover Honey",
      unitPriceCents: 1500,
      weightOz: 8,
    });

    store.updateQuantity("jar-clover", 25);
    expect(useCartStore.getState().items[0].quantity).toBe(10);
  });

  it("safely handles corrupted receipt storage without throwing (covers AC-5)", () => {
    if (typeof window !== "undefined") {
      // Malformed JSON string
      window.localStorage.setItem(ORDERS_STORAGE_KEY, "invalid-json-string{");
      expect(getStoredOrderReceipts()).toEqual([]);

      // Invalid schema items
      window.localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify([{ invalidField: 123 }])
      );
      expect(getStoredOrderReceipts()).toEqual([]);
    }
  });
});
