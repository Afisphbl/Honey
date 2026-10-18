import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CatalogView } from "../catalog-view";
import { getAllProducts } from "@/lib/catalog/queries";

const mockReplace = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/catalog",
  useSearchParams: () => currentSearchParams,
}));

describe("CatalogView orchestrator (satisfies AC-1, AC-2, AC-3, AC-8)", () => {
  const allProducts = getAllProducts();

  beforeEach(() => {
    mockReplace.mockClear();
    currentSearchParams = new URLSearchParams();
  });

  it("renders all products by default with responsive grid and counts (satisfies AC-1, AC-2)", () => {
    render(<CatalogView initialProducts={allProducts} />);

    // Check all category tabs are present
    expect(screen.getByRole("tab", { name: /all reserves/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /single origin/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /infusions/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /seasonal reserve/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /raw comb/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /tasting flights/i })).toBeInTheDocument();

    // Products render in the grid
    expect(
      screen.getByRole("heading", { name: "Raw Wildflower Reserve" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pure Acacia Blossom" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mountain Lavender Infusion" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Apiary Reserve Tasting Flight" })
    ).toBeInTheDocument();
  });

  it("updates shallow URL query parameter when category tab is clicked (satisfies AC-2, AC-3)", () => {
    render(<CatalogView initialProducts={allProducts} />);

    const infusionTab = screen.getByRole("tab", { name: /infusions/i });
    fireEvent.click(infusionTab);

    expect(mockReplace).toHaveBeenCalledWith(
      "/catalog?category=infusion",
      { scroll: false }
    );
  });

  it("updates sort query parameter when sort dropdown is changed (satisfies AC-2, AC-3)", () => {
    render(<CatalogView initialProducts={allProducts} />);

    const sortSelect = screen.getByLabelText(/sort catalog results/i);
    fireEvent.change(sortSelect, { target: { value: "price_asc" } });

    expect(mockReplace).toHaveBeenCalledWith(
      "/catalog?sort=price_asc",
      { scroll: false }
    );
  });

  it("toggles inStock query param when in-stock switch is clicked (satisfies AC-2, AC-3)", () => {
    render(<CatalogView initialProducts={allProducts} />);

    const inStockSwitch = screen.getByRole("switch", {
      name: /in stock only/i,
    });
    fireEvent.click(inStockSwitch);

    expect(mockReplace).toHaveBeenCalledWith(
      "/catalog?inStock=true",
      { scroll: false }
    );
  });

  it("filters product display based on URL query params (satisfies AC-3)", () => {
    currentSearchParams = new URLSearchParams("category=infusion");
    render(<CatalogView initialProducts={allProducts} />);

    expect(screen.getByText("Mountain Lavender Infusion")).toBeInTheDocument();
    expect(screen.queryByText("Raw Wildflower Reserve")).not.toBeInTheDocument();
    expect(screen.queryByText("Pure Acacia Blossom")).not.toBeInTheDocument();
  });

  it("renders empty state when filter combination yields zero products (satisfies AC-8)", () => {
    render(<CatalogView initialProducts={[]} />);

    expect(
      screen.getByText(/no reserves match these terroir criteria/i)
    ).toBeInTheDocument();

    const resetButton = screen.getByRole("button", {
      name: /reset all filters/i,
    });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(mockReplace).toHaveBeenCalledWith("/catalog", { scroll: false });
  });

  it("normalizes unknown URL parameters to safe defaults without crashing (satisfies AC-3)", () => {
    currentSearchParams = new URLSearchParams(
      "category=invalid_cat&sort=unrecognized&inStock=maybe"
    );

    render(<CatalogView initialProducts={allProducts} />);

    // Should default to all products
    expect(
      screen.getByRole("heading", { name: "Raw Wildflower Reserve" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pure Acacia Blossom" })
    ).toBeInTheDocument();
  });

  it("filters to bundle when Tasting Flights category tab is clicked (satisfies AC-2, AC-7)", () => {
    currentSearchParams = new URLSearchParams("category=bundle");
    render(<CatalogView initialProducts={allProducts} />);

    expect(
      screen.getByRole("heading", { name: "Apiary Reserve Tasting Flight" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Raw Wildflower Reserve" })
    ).not.toBeInTheDocument();
  });

  it("sorts products by intensity when sort query parameter is intensity (satisfies AC-2, AC-3)", () => {
    currentSearchParams = new URLSearchParams("sort=intensity");
    render(<CatalogView initialProducts={allProducts} />);

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBe(allProducts.length);
    expect(headings[0].textContent).toBe("Apalachicola Tupelo Reserve");
  });
});

