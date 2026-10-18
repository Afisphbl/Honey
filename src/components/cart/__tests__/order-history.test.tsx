import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OrderHistory } from "../order-history";
import { saveStoredOrderReceipt, ORDERS_STORAGE_KEY } from "@/lib/store/cart-store";
import { OrderSummary } from "@/types/catalog";

const sampleSavedOrder: OrderSummary = {
  id: "ORD-1760000000000-KEY1",
  orderNumber: "HNY-11223",
  customer: {
    name: "Julian Thorne",
    email: "julian@catskillapiary.org",
  },
  shippingAddress: {
    fullName: "Julian Thorne",
    email: "julian@catskillapiary.org",
    line1: "88 Hive Ridge Lane",
    city: "Woodstock",
    state: "NY",
    postalCode: "12498",
    country: "US",
  },
  items: [
    {
      id: "raw-wildflower-reserve-250g",
      productId: "raw-wildflower-reserve",
      variantId: "raw-wildflower-reserve-250g",
      title: "Raw Wildflower Reserve",
      variantTitle: "250g Jar",
      unitPriceCents: 3400,
      weightOz: 8.8,
      quantity: 1,
      addedAt: "2026-10-17T00:00:00.000Z",
    },
  ],
  subtotalCents: 3400,
  shippingFeeCents: 800,
  totalCents: 4200,
  status: "confirmed",
  createdAt: "2026-10-17T12:00:00.000Z",
};

describe("OrderHistory Component (satisfies AC-9)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("renders empty state when no historical receipts are saved in localStorage (AC-9)", () => {
    render(
      <OrderHistory onBackToBag={vi.fn()} onSelectOrder={vi.fn()} />
    );

    expect(screen.getByText("No Previous Orders Found")).toBeInTheDocument();
    expect(
      screen.getByText(/When you complete a reserve harvest order/i)
    ).toBeInTheDocument();
  });

  it("renders chronological past order cards from localStorage (AC-9)", () => {
    saveStoredOrderReceipt(sampleSavedOrder);

    render(
      <OrderHistory onBackToBag={vi.fn()} onSelectOrder={vi.fn()} />
    );

    expect(screen.getByText("Past Reserve Orders")).toBeInTheDocument();
    expect(screen.getByText("HNY-11223")).toBeInTheDocument();
    expect(screen.getByText("$42.00")).toBeInTheDocument();
    expect(screen.getByText(/1 jar/i)).toBeInTheDocument();
    expect(screen.getByText(/Raw Wildflower Reserve/i)).toBeInTheDocument();
  });

  it("triggers onSelectOrder when an order card is clicked for receipt inspection (AC-9)", () => {
    saveStoredOrderReceipt(sampleSavedOrder);
    const onSelectMock = vi.fn();

    render(
      <OrderHistory onBackToBag={vi.fn()} onSelectOrder={onSelectMock} />
    );

    const orderCard = screen.getByRole("button", {
      name: /HNY-11223/i,
    });
    fireEvent.click(orderCard);

    expect(onSelectMock).toHaveBeenCalledWith(
      expect.objectContaining({ orderNumber: "HNY-11223" })
    );
  });

  it("clears order history when Clear History is clicked (AC-9)", () => {
    saveStoredOrderReceipt(sampleSavedOrder);

    render(
      <OrderHistory onBackToBag={vi.fn()} onSelectOrder={vi.fn()} />
    );

    expect(screen.getByText("HNY-11223")).toBeInTheDocument();

    const clearBtn = screen.getByRole("button", { name: /Clear History/i });
    fireEvent.click(clearBtn);

    expect(screen.getByText("No Previous Orders Found")).toBeInTheDocument();
    expect(window.localStorage.getItem(ORDERS_STORAGE_KEY)).toBeNull();
  });
});
