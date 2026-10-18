import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  CatalogFilterBar,
  CATALOG_CATEGORIES,
} from "../catalog-filter-bar";
import { ProductCategory } from "@/types/catalog";

const mockCounts: Record<ProductCategory | "all", number> = {
  all: 6,
  single_origin: 3,
  infusion: 1,
  seasonal_reserve: 1,
  raw_comb: 1,
  bundle: 1,
};

describe("CatalogFilterBar component (satisfies AC-2)", () => {
  it("renders category tabs with tablist semantics and count badges (AC-2)", () => {
    render(
      <CatalogFilterBar
        activeCategory="all"
        onCategoryChange={vi.fn()}
        sortBy="featured"
        onSortChange={vi.fn()}
        inStockOnly={false}
        onInStockChange={vi.fn()}
        counts={mockCounts}
        totalResults={6}
      />
    );

    const tablist = screen.getByRole("tablist", {
      name: /honey variety categories/i,
    });
    expect(tablist).toBeInTheDocument();

    for (const category of CATALOG_CATEGORIES) {
      const tab = screen.getByRole("tab", { name: new RegExp(category.label, "i") });
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveAttribute(
        "aria-selected",
        category.id === "all" ? "true" : "false"
      );
    }
  });

  it("calls onCategoryChange when a category tab is clicked (AC-2)", () => {
    const onCategoryChange = vi.fn();

    render(
      <CatalogFilterBar
        activeCategory="all"
        onCategoryChange={onCategoryChange}
        sortBy="featured"
        onSortChange={vi.fn()}
        inStockOnly={false}
        onInStockChange={vi.fn()}
        counts={mockCounts}
        totalResults={6}
      />
    );

    const singleOriginTab = screen.getByRole("tab", { name: /single origin/i });
    fireEvent.click(singleOriginTab);

    expect(onCategoryChange).toHaveBeenCalledTimes(1);
    expect(onCategoryChange).toHaveBeenCalledWith("single_origin");
  });

  it("handles in stock toggle switch interactions (AC-2)", () => {
    const onInStockChange = vi.fn();

    const { rerender } = render(
      <CatalogFilterBar
        activeCategory="all"
        onCategoryChange={vi.fn()}
        sortBy="featured"
        onSortChange={vi.fn()}
        inStockOnly={false}
        onInStockChange={onInStockChange}
        counts={mockCounts}
        totalResults={6}
      />
    );

    const switchControl = screen.getByRole("switch", {
      name: /in stock only/i,
    });
    expect(switchControl).toHaveAttribute("aria-checked", "false");

    fireEvent.click(switchControl);
    expect(onInStockChange).toHaveBeenCalledTimes(1);
    expect(onInStockChange).toHaveBeenCalledWith(true);

    rerender(
      <CatalogFilterBar
        activeCategory="all"
        onCategoryChange={vi.fn()}
        sortBy="featured"
        onSortChange={vi.fn()}
        inStockOnly={true}
        onInStockChange={onInStockChange}
        counts={mockCounts}
        totalResults={5}
      />
    );

    expect(switchControl).toHaveAttribute("aria-checked", "true");
  });

  it("calls onSortChange when selecting a different sort option (AC-2)", () => {
    const onSortChange = vi.fn();

    render(
      <CatalogFilterBar
        activeCategory="all"
        onCategoryChange={vi.fn()}
        sortBy="featured"
        onSortChange={onSortChange}
        inStockOnly={false}
        onInStockChange={vi.fn()}
        counts={mockCounts}
        totalResults={6}
      />
    );

    const sortSelect = screen.getByRole("combobox", {
      name: /sort catalog results/i,
    });
    expect(sortSelect).toHaveValue("featured");

    fireEvent.change(sortSelect, { target: { value: "price_asc" } });
    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith("price_asc");
  });

  it("displays singular and plural total results text accurately", () => {
    const { rerender } = render(
      <CatalogFilterBar
        activeCategory="all"
        onCategoryChange={vi.fn()}
        sortBy="featured"
        onSortChange={vi.fn()}
        inStockOnly={false}
        onInStockChange={vi.fn()}
        counts={mockCounts}
        totalResults={1}
      />
    );

    const singleSummary = screen.getByText((_, el) => {
      return el?.tagName.toLowerCase() === "span" && el.textContent?.trim() === "1 variety";
    });
    expect(singleSummary).toBeInTheDocument();

    rerender(
      <CatalogFilterBar
        activeCategory="all"
        onCategoryChange={vi.fn()}
        sortBy="featured"
        onSortChange={vi.fn()}
        inStockOnly={false}
        onInStockChange={vi.fn()}
        counts={mockCounts}
        totalResults={4}
      />
    );

    const pluralSummary = screen.getByText((_, el) => {
      return el?.tagName.toLowerCase() === "span" && el.textContent?.trim() === "4 varieties";
    });
    expect(pluralSummary).toBeInTheDocument();
  });
});
