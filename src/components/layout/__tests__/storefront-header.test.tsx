import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StorefrontHeader } from "../storefront-header";
import { useCartStore } from "@/lib/store/cart-store";

describe("StorefrontHeader component (satisfies AC-1, AC-6)", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().toggleCart(false);
    useCartStore.setState({ hasHydrated: true });
  });

  it("renders header banner and navigation landmarks (AC-1)", () => {
    render(<StorefrontHeader />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeInTheDocument();
  });

  it("links to /catalog with All Reserves & Catalog text (AC-1)", () => {
    render(<StorefrontHeader />);

    const catalogLink = screen.getByRole("link", {
      name: /all reserves & catalog/i,
    });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute("href", "/catalog");
  });

  it("renders brand logo linking to home", () => {
    render(<StorefrontHeader />);

    const homeLink = screen.getByRole("link", {
      name: /honey single origin reserve/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("opens cart drawer when cart trigger button is clicked", () => {
    render(<StorefrontHeader />);

    const cartButton = screen.getByRole("button", {
      name: /open shopping cart with 0 items/i,
    });
    expect(cartButton).toBeInTheDocument();

    fireEvent.click(cartButton);
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it("displays updated cart count badge when items are present", () => {
    useCartStore.getState().addItem(
      {
        id: "raw-wildflower-reserve-250g",
        productId: "raw-wildflower-reserve",
        title: "Raw Wildflower Reserve",
        unitPriceCents: 3800,
      },
      2
    );

    render(<StorefrontHeader />);

    const cartButton = screen.getByRole("button", {
      name: /open shopping cart with 2 items/i,
    });
    expect(cartButton).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
