import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CheckoutForm } from "../checkout-form";
import { useCartStore } from "@/lib/store/cart-store";
import { CartItem } from "@/types/catalog";

const sampleCartItem: CartItem = {
  id: "raw-wildflower-reserve-250g",
  productId: "raw-wildflower-reserve",
  variantId: "raw-wildflower-reserve-250g",
  title: "Raw Wildflower Reserve",
  variantTitle: "250g Jar",
  unitPriceCents: 3400,
  weightOz: 8.8,
  quantity: 2,
  addedAt: "2026-10-17T00:00:00.000Z",
};

describe("CheckoutForm Component (satisfies AC-4, AC-5, AC-6, AC-7)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem(sampleCartItem, 2);
  });

  it("renders all required shipping and payment inputs (AC-6)", () => {
    render(<CheckoutForm onBack={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByLabelText(/Recipient Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email for Order Receipt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZIP Code/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Complimentary Botanical Gift Packaging/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Personalized Handwritten Card Note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Courier Delivery Instructions/i)).toBeInTheDocument();

    expect(screen.getByText("Simulated Card")).toBeInTheDocument();
    expect(screen.getByText("Apiary Credit")).toBeInTheDocument();
  });

  it("populates form fields cleanly with Quick Fill Demo button (AC-4, AC-6)", () => {
    render(<CheckoutForm onBack={vi.fn()} onSuccess={vi.fn()} />);

    const quickFillBtn = screen.getByRole("button", { name: /Quick Fill Demo/i });
    fireEvent.click(quickFillBtn);

    expect(screen.getByLabelText(/Recipient Full Name/i)).toHaveValue("Julian Thorne");
    expect(screen.getByLabelText(/Email for Order Receipt/i)).toHaveValue(
      "julian@catskillapiary.org"
    );
    expect(screen.getByLabelText(/Street Address/i)).toHaveValue("88 Hive Ridge Lane");
    expect(screen.getByLabelText(/City/i)).toHaveValue("Woodstock");
    expect(screen.getByLabelText(/ZIP Code/i)).toHaveValue("12498");

    const giftCheckbox = screen.getByRole("checkbox");
    expect(giftCheckbox).toBeChecked();
  });

  it("displays accessible validation error messages when submitted with invalid fields (AC-6)", async () => {
    render(<CheckoutForm onBack={vi.fn()} onSuccess={vi.fn()} />);

    const submitBtn = screen.getByRole("button", {
      name: /Authorize & Place Reserve Order/i,
    });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Full name must be at least 2 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Invalid email address/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Street address must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it("submits order payload and calls onSuccess upon server HTTP 201 response (AC-7)", async () => {
    const onSuccessMock = vi.fn();

    const mockOrder = {
      id: "ORD-1760000000000-TESTKEY",
      orderNumber: "HNY-54321",
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
      items: [sampleCartItem],
      subtotalCents: 6800,
      shippingFeeCents: 0,
      totalCents: 6800,
      status: "confirmed",
      createdAt: "2026-10-17T12:00:00.000Z",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ success: true, order: mockOrder }),
    } as Response);

    render(<CheckoutForm onBack={vi.fn()} onSuccess={onSuccessMock} />);

    // Fill valid data via Quick Fill
    fireEvent.click(screen.getByRole("button", { name: /Quick Fill Demo/i }));

    // Submit
    const submitBtn = screen.getByRole("button", {
      name: /Authorize & Place Reserve Order/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/orders", expect.any(Object));
      expect(onSuccessMock).toHaveBeenCalledWith(mockOrder);
    });
  });

  it("displays price change warning notice when server returns HTTP 422 price mismatch (AC-7)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        success: false,
        error: "Catalog prices were recently updated. Expected subtotal does not match server calculations.",
        serverSubtotalCents: 7200,
      }),
    } as Response);

    render(<CheckoutForm onBack={vi.fn()} onSuccess={vi.fn()} />);

    // Fill valid data
    fireEvent.click(screen.getByRole("button", { name: /Quick Fill Demo/i }));

    // Submit
    const submitBtn = screen.getByRole("button", {
      name: /Authorize & Place Reserve Order/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(/Price Update Notice: Catalog prices were recently updated/i)
      ).toBeInTheDocument();
    });

    // Verify user address entries were preserved
    expect(screen.getByLabelText(/Recipient Full Name/i)).toHaveValue("Julian Thorne");
    expect(screen.getByLabelText(/Street Address/i)).toHaveValue("88 Hive Ridge Lane");
  });

  it("allows switching payment method between card and apiary reserve credit (AC-5)", () => {
    render(<CheckoutForm onBack={vi.fn()} onSuccess={vi.fn()} />);

    const apiaryCreditBtn = screen.getByRole("button", { name: /Apiary Credit/i });
    fireEvent.click(apiaryCreditBtn);

    expect(
      screen.getByText(/Complimentary Member Credit Applied/i)
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/Card Number/i)).not.toBeInTheDocument();

    const cardBtn = screen.getByRole("button", { name: /Simulated Card/i });
    fireEvent.click(cardBtn);

    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
  });

  it("updates character counter as user types into gift note and delivery instructions (AC-4, AC-6)", () => {
    render(<CheckoutForm onBack={vi.fn()} onSuccess={vi.fn()} />);

    const noteInput = screen.getByLabelText(/Personalized Handwritten Card Note/i);
    fireEvent.change(noteInput, { target: { value: "Harvest greetings" } });

    expect(screen.getByText("17 / 150")).toBeInTheDocument();

    const instructionsInput = screen.getByLabelText(/Courier Delivery Instructions/i);
    fireEvent.change(instructionsInput, { target: { value: "Gate code 1234" } });

    expect(screen.getByText("14 / 200")).toBeInTheDocument();
  });

  it("displays network error alert when fetch encounters network failure (AC-6, AC-7)", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network connection dropped"));

    render(<CheckoutForm onBack={vi.fn()} onSuccess={vi.fn()} />);

    // Fill valid data
    fireEvent.click(screen.getByRole("button", { name: /Quick Fill Demo/i }));

    // Submit
    const submitBtn = screen.getByRole("button", {
      name: /Authorize & Place Reserve Order/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(/Network connection interrupted\. Please verify your connection and try again\./i)
      ).toBeInTheDocument();
    });
  });
});
