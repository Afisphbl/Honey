import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StorefrontFooter } from "../storefront-footer";

describe("StorefrontFooter component (satisfies AC-1, AC-4, AC-5)", () => {
  it("renders contentinfo footer landmark and brand mission statement", () => {
    render(<StorefrontFooter />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByText(/an artisanal apiculture collective dedicated to single origin honey preservation/i)
    ).toBeInTheDocument();
  });

  it("renders navigation links to catalog and about sections (AC-1)", () => {
    render(<StorefrontFooter />);

    const catalogLink = screen.getByRole("link", {
      name: /reserves catalog/i,
    });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute("href", "/catalog");

    const aboutLink = screen.getByRole("link", {
      name: /brand heritage & apiaries/i,
    });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");

    const terroirLink = screen.getByRole("link", {
      name: /apiary terroir atlas/i,
    });
    expect(terroirLink).toBeInTheDocument();
    expect(terroirLink).toHaveAttribute("href", "/about#terroir-atlas");

    const purityLink = screen.getByRole("link", {
      name: /purity verification/i,
    });
    expect(purityLink).toBeInTheDocument();
    expect(purityLink).toHaveAttribute("href", "/about#purity-standards");
  });

  it("displays apiculture value proposition badges and stewardship commitments (AC-4, AC-5)", () => {
    render(<StorefrontFooter />);

    expect(screen.getByText("100% Raw & Unheated")).toBeInTheDocument();
    expect(screen.getByText("Wild Pasture Foraged")).toBeInTheDocument();
    expect(screen.getByText("Ethical Hive Stewardship")).toBeInTheDocument();
    expect(screen.getByText("Numbered Lot Reserve")).toBeInTheDocument();
  });

  it("displays apiary headquarters and reserve certification specifications", () => {
    render(<StorefrontFooter />);

    expect(screen.getByText("Catskill Highlands Region")).toBeInTheDocument();
    expect(screen.getByText("Elevation: 680 Meters")).toBeInTheDocument();
    expect(screen.getByText("Raw Unpasteurized Honey")).toBeInTheDocument();
    expect(screen.getByText("Independent Purity Tested")).toBeInTheDocument();
  });
});
