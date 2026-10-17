import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CatalogPage, { metadata } from "../page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
  usePathname: () => "/catalog",
  useSearchParams: () => new URLSearchParams(),
}));

describe("CatalogPage Route Component (satisfies AC-1, AC-3)", () => {
  it("exports valid metadata for search discoverability", () => {
    expect(metadata.title).toContain("Catalog");
    expect(metadata.description).toContain("single origin");
  });

  it("renders editorial terroir manifesto, purity badges, and product cards (satisfies AC-1)", () => {
    render(<CatalogPage />);

    // Editorial Header & Manifesto
    expect(
      screen.getByRole("heading", {
        name: /artisanal honey varieties & tasting profiles/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText("2026 Apiary Reserves")).toBeInTheDocument();
    expect(
      screen.getByText(/every jar reflects an unrepeatable snapshot/i)
    ).toBeInTheDocument();

    // Purity standards badges
    expect(screen.getByText("100% Raw")).toBeInTheDocument();
    expect(screen.getAllByText("Single Origin").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Cold Spun")).toBeInTheDocument();
    expect(screen.getByText("UV Protected")).toBeInTheDocument();

    // Product cards present
    expect(
      screen.getByRole("heading", { name: "Raw Wildflower Reserve" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Apiary Reserve Tasting Flight" })
    ).toBeInTheDocument();
  });
});
