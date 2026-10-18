import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OrderReceipt } from "../order-receipt";
import { OrderSummary } from "@/types/catalog";

const testOrder: OrderSummary = {
  id: "ORD-1760000000000-TESTKEY",
  orderNumber: "HNY-54321",
  customer: {
    name: "Julian Thorne",
    email: "julian@catskillapiary.org",
  },
  shippingAddress: {
    fullName: "Julian Thorne",
    email: "julian@catskillapiary.org",
    line1: "88 Hive Ridge Lane",
    line2: "Apt 4B",
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
      variantTitle: "250g Tasting Jar",
      unitPriceCents: 3400,
      weightOz: 8.8,
      quantity: 2,
      addedAt: "2026-10-17T00:00:00.000Z",
    },
  ],
  giftPackaging: true,
  giftNote: "With warmest seasonal harvest wishes.",
  deliveryInstructions: "Leave parcel in shaded porch box.",
  paymentMethod: "simulated_card",
  cardLast4: "4242",
  subtotalCents: 6800,
  shippingFeeCents: 0,
  totalCents: 6800,
  status: "confirmed",
  createdAt: "2026-10-17T12:00:00.000Z",
};

describe("OrderReceipt Component (satisfies AC-4, AC-8)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders confirmed order number, certificate banner, and delivery breakdown (AC-8)", () => {
    render(
      <OrderReceipt
        order={testOrder}
        onContinueExploring={vi.fn()}
      />
    );

    expect(screen.getByText("Reserve Order Confirmed")).toBeInTheDocument();
    expect(screen.getByText("HNY-54321")).toBeInTheDocument();
    expect(screen.getByText("Julian Thorne")).toBeInTheDocument();
    expect(screen.getByText("88 Hive Ridge Lane")).toBeInTheDocument();
    expect(screen.getByText(/Woodstock, NY 12498/)).toBeInTheDocument();
    expect(screen.getByText("Raw Wildflower Reserve")).toBeInTheDocument();
    expect(screen.getAllByText("$68.00").length).toBeGreaterThanOrEqual(1);
  });

  it("renders gift packaging badge and custom handwritten note (AC-4, AC-8)", () => {
    render(
      <OrderReceipt
        order={testOrder}
        onContinueExploring={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Complimentary Botanical Gift Packaging Selected/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/With warmest seasonal harvest wishes\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Leave parcel in shaded porch box\./i)
    ).toBeInTheDocument();
  });

  it("triggers window.print() when print button is clicked (AC-8)", () => {
    const printMock = vi.fn();
    window.print = printMock;

    render(
      <OrderReceipt
        order={testOrder}
        onContinueExploring={vi.fn()}
      />
    );

    const printBtn = screen.getByRole("button", { name: /Print Receipt/i });
    fireEvent.click(printBtn);

    expect(printMock).toHaveBeenCalledTimes(1);
  });

  it("copies order number to clipboard on copy action click (AC-8)", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });

    render(
      <OrderReceipt
        order={testOrder}
        onContinueExploring={vi.fn()}
      />
    );

    const copyBtn = screen.getByRole("button", { name: /Copy order number/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalledWith("HNY-54321");
  });
});
