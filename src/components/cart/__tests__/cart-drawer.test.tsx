import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartDrawer } from "../cart-drawer";
import { useCartStore, saveStoredOrderReceipt } from "@/lib/store/cart-store";
import { CartItem, OrderSummary } from "@/types/catalog";

const testItem1: CartItem = {
  id: "raw-wildflower-reserve-250g",
  productId: "raw-wildflower-reserve",
  variantId: "raw-wildflower-reserve-250g",
  title: "Raw Wildflower Reserve",
  variantTitle: "250g Artisanal Tasting Jar",
  unitPriceCents: 3400,
  weightOz: 8.8,
  quantity: 1,
  addedAt: "2026-10-17T00:00:00.000Z",
};

describe("CartDrawer Component (satisfies AC-1, AC-2, AC-3, AC-5)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useCartStore.getState().clearCart();
    useCartStore.getState().toggleCart(true);
  });

  it("renders empty state when cart has zero items (AC-2)", () => {
    render(<CartDrawer />);

    expect(screen.getByText("Your Bag Is Empty")).toBeInTheDocument();
    expect(
      screen.getByText(/Explore our raw wildflower and single origin harvests/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Discover Reserves/i })
    ).toBeInTheDocument();
  });

  it("renders line items with photography, quantity selector, and unit price (AC-2)", () => {
    useCartStore.getState().addItem(testItem1, 1);

    render(<CartDrawer />);

    expect(screen.getByText("Your Reserve Bag")).toBeInTheDocument();
    expect(screen.getByText("1 jar in order")).toBeInTheDocument();
    expect(screen.getByText("Raw Wildflower Reserve")).toBeInTheDocument();
    expect(screen.getByText("250g Artisanal Tasting Jar")).toBeInTheDocument();
    expect(screen.getAllByText("$34.00").length).toBeGreaterThanOrEqual(1);

    // Quantity selector buttons
    expect(
      screen.getByRole("button", { name: /Increase quantity/i })
    ).toBeInTheDocument();
  });

  it("updates item quantity and reflects in cart totals (AC-2)", () => {
    useCartStore.getState().addItem(testItem1, 1);

    render(<CartDrawer />);

    const increaseBtn = screen.getByRole("button", { name: /Increase quantity/i });
    fireEvent.click(increaseBtn);

    expect(useCartStore.getState().items[0].quantity).toBe(2);
    expect(screen.getAllByText("$68.00").length).toBeGreaterThanOrEqual(1);
  });

  it("removes an item when the trash button is clicked (AC-2)", () => {
    useCartStore.getState().addItem(testItem1, 1);

    render(<CartDrawer />);

    const removeBtn = screen.getByRole("button", {
      name: /Remove Raw Wildflower Reserve from cart/i,
    });
    fireEvent.click(removeBtn);

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(screen.getByText("Your Bag Is Empty")).toBeInTheDocument();
  });

  it("renders free shipping progress calculation towards $50 threshold (AC-3)", () => {
    // 1 jar = $34.00 ($16.00 remaining for free shipping)
    useCartStore.getState().addItem(testItem1, 1);

    render(<CartDrawer />);

    expect(screen.getByText(/Add \$16\.00 for free delivery/i)).toBeInTheDocument();
    expect(screen.getByText("68%")).toBeInTheDocument();

    // Increase to 2 jars = $68.00 (qualifies for free delivery)
    const increaseBtn = screen.getByRole("button", { name: /Increase quantity/i });
    fireEvent.click(increaseBtn);

    expect(
      screen.getByText(/Complimentary delivery unlocked/i)
    ).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("navigates from items review to checkout phase and back (AC-5)", () => {
    useCartStore.getState().addItem(testItem1, 1);

    render(<CartDrawer />);

    // Click Proceed to Checkout
    const checkoutBtn = screen.getByRole("button", {
      name: /Proceed to Checkout/i,
    });
    fireEvent.click(checkoutBtn);

    // Now in checkout phase
    expect(screen.getByText("Delivery Address")).toBeInTheDocument();
    expect(screen.getByLabelText(/Recipient Full Name/i)).toBeInTheDocument();

    // Click Back to Reserve Bag
    const backBtn = screen.getByRole("button", {
      name: /Back to Reserve Bag/i,
    });
    fireEvent.click(backBtn);

    // Returns to items phase
    expect(screen.getByText("Your Reserve Bag")).toBeInTheDocument();
    expect(screen.getByText("Raw Wildflower Reserve")).toBeInTheDocument();
  });

  it("navigates to past orders history view from drawer header trigger (AC-5, AC-9)", () => {
    render(<CartDrawer />);

    const pastOrdersBtn = screen.getByRole("button", { name: /Past Orders/i });
    fireEvent.click(pastOrdersBtn);

    expect(screen.getByText("Past Reserve Orders")).toBeInTheDocument();

    // Return to bag
    const returnBtn = screen.getByRole("button", {
      name: /Return to Reserve Bag/i,
    });
    fireEvent.click(returnBtn);

    expect(screen.getByText("Your Bag Is Empty")).toBeInTheDocument();
  });

  it("selects a historical order for receipt inspection and returns back to history (AC-5, AC-9)", () => {
    const historicalOrder: OrderSummary = {
      id: "ORD-999-KEY",
      orderNumber: "HNY-88888",
      customer: { name: "Julian Thorne", email: "julian@catskillapiary.org" },
      shippingAddress: {
        fullName: "Julian Thorne",
        email: "julian@catskillapiary.org",
        line1: "88 Hive Ridge Lane",
        city: "Woodstock",
        state: "NY",
        postalCode: "12498",
        country: "US",
      },
      items: [testItem1],
      subtotalCents: 3400,
      shippingFeeCents: 800,
      totalCents: 4200,
      status: "confirmed",
      createdAt: "2026-10-18T10:00:00.000Z",
    };

    saveStoredOrderReceipt(historicalOrder);

    render(<CartDrawer />);

    // Go to Past Orders
    const pastOrdersBtn = screen.getByRole("button", { name: /Past Orders/i });
    fireEvent.click(pastOrdersBtn);

    expect(screen.getByText("Past Reserve Orders")).toBeInTheDocument();

    // Click the historical order
    const orderItemBtn = screen.getByRole("button", { name: /HNY-88888/i });
    fireEvent.click(orderItemBtn);

    // Verify receipt view is displayed for this historical order
    expect(screen.getByText("Official Harvest Certificate")).toBeInTheDocument();
    expect(screen.getByText("HNY-88888")).toBeInTheDocument();

    // Click back to order history
    const backToHistoryBtn = screen.getByRole("button", { name: /Back to Order History/i });
    fireEvent.click(backToHistoryBtn);

    // Back in history view
    expect(screen.getByText("Past Reserve Orders")).toBeInTheDocument();
  });
});
