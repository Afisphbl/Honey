import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FeaturedBuyBox } from "../featured-buy-box";
import { getFeaturedProduct } from "@/lib/catalog/queries";
import { useCartStore } from "@/lib/store/cart-store";

describe("FeaturedBuyBox component (satisfies AC-5, AC-6)", () => {
  const featured = getFeaturedProduct()!;

  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().toggleCart(false);
  });

  it("renders product title, subtitle, batch number, and harvest year", () => {
    render(<FeaturedBuyBox product={featured} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Raw Wildflower Reserve" })
    ).toBeInTheDocument();
    expect(screen.getByText("Late Summer Meadow Harvest")).toBeInTheDocument();
    expect(screen.getByText("LOT-2026-WILD-04")).toBeInTheDocument();
    expect(
      screen.getByText(/Harvested 2026 · Catskill Highlands, New York/i)
    ).toBeInTheDocument();
  });

  it("displays default 250g jar variant pricing and savings badge", () => {
    render(<FeaturedBuyBox product={featured} />);

    // Default 250g jar is $34.00 (appears in headline price and variant pill)
    expect(screen.getAllByText("$34.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("$40.00")).toBeInTheDocument();
    expect(screen.getByText("Save 15%")).toBeInTheDocument();
  });

  it("updates price and details when selecting 500g kitchen reserve jar", () => {
    render(<FeaturedBuyBox product={featured} />);

    // Click 500g variant radio button
    const variant500gButton = screen.getByRole("radio", {
      name: /500g \$58\.00 Kitchen Reserve Jar/i,
    });
    fireEvent.click(variant500gButton);

    // Dynamic price updates to $58.00 and compare at to $68.00
    expect(screen.getAllByText("$58.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("$68.00")).toBeInTheDocument();
  });

  it("updates quantity and multiplies total on Add to Cart button", () => {
    render(<FeaturedBuyBox product={featured} />);

    const incrementButton = screen.getByRole("button", {
      name: "Increase quantity",
    });
    fireEvent.click(incrementButton); // quantity = 2

    // $34.00 * 2 = $68.00
    expect(
      screen.getByRole("button", { name: /Add to Cart \(\$68\.00\)/i })
    ).toBeInTheDocument();
  });

  it("adds item to cart store and opens drawer upon click (AC-6)", () => {
    render(<FeaturedBuyBox product={featured} />);

    const addToCartButton = screen.getByRole("button", {
      name: /Add to Cart \(\$34\.00\)/i,
    });
    fireEvent.click(addToCartButton);

    const cartState = useCartStore.getState();
    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].productId).toBe("raw-wildflower-reserve");
    expect(cartState.items[0].variantId).toBe("raw-wildflower-reserve-250g");
    expect(cartState.items[0].quantity).toBe(1);
    expect(cartState.isOpen).toBe(true);
  });
});
