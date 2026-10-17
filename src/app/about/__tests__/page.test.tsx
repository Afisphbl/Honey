import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import AboutPage, { metadata } from "../page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
  usePathname: () => "/about",
  useSearchParams: () => new URLSearchParams(),
}));

describe("AboutPage Route Component (satisfies AC-1)", () => {
  it("exports page metadata for SEO and social sharing (AC-1)", () => {
    expect(metadata.title).toBe(
      "Brand Heritage & Apiary Story | Honey Single Origin Reserve"
    );
    expect(metadata.description).toContain(
      "Explore our single origin terroirs across the Catskills, Black Forest, Provence, and Apalachicola"
    );
  });

  it("renders editorial heritage proclamation header, in-page navigation anchors, and core sections (AC-1)", () => {
    render(<AboutPage />);

    // Editorial proclamation title
    expect(
      screen.getByRole("heading", {
        name: /the living story of our apiaries & terroirs/i,
      })
    ).toBeInTheDocument();

    // Narrative manifesto
    expect(
      screen.getByText(/we practice slow apiculture: never microfiltered/i)
    ).toBeInTheDocument();

    // In-page navigation anchors scoped to proclamation header
    const proclamationSection = screen.getByRole("region", {
      name: /brand heritage proclamation/i,
    });

    expect(
      within(proclamationSection).getByRole("link", { name: /terroir atlas/i })
    ).toHaveAttribute("href", "#terroir-atlas");
    expect(
      within(proclamationSection).getByRole("link", {
        name: /seasonal harvest/i,
      })
    ).toHaveAttribute("href", "#seasonal-cycle");
    expect(
      within(proclamationSection).getByRole("link", {
        name: /purity standards/i,
      })
    ).toHaveAttribute("href", "#purity-standards");
    expect(
      within(proclamationSection).getByRole("link", {
        name: /ethical pledges/i,
      })
    ).toHaveAttribute("href", "#ethical-pledges");

    // Global layout presence and navigation links (AC-1)
    const header = screen.getByRole("banner");
    expect(
      within(header).getByRole("link", {
        name: /brand heritage & apiaries/i,
      })
    ).toHaveAttribute("href", "/about");

    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", {
        name: /brand heritage & apiaries/i,
      })
    ).toHaveAttribute("href", "/about");
  });
});

