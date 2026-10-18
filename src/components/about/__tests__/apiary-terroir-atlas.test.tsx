import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApiaryTerroirAtlas } from "../apiary-terroir-atlas";
import { ApiaryOriginDetail } from "@/types/catalog";

const MOCK_ORIGINS: ApiaryOriginDetail[] = [
  {
    id: "catskill-highlands",
    region: "Catskill Highlands, New York",
    elevationMeters: 680,
    climate: "Montane humid continental",
    beekeeperName: "Julian Thorne",
    hiveCount: 24,
    floraEcosystem: "Subalpine wildflower pastures and linden canopies",
    purityTested: true,
    coordinates: { latitude: 42.1584, longitude: -74.3211 },
    products: [
      {
        id: "raw-wildflower-reserve",
        slug: "raw-wildflower-reserve",
        title: "Raw Wildflower Reserve",
        subtitle: "Late Summer Meadow Harvest",
        description: "Test description",
        category: "single_origin",
        harvestYear: 2026,
        batchNumber: "LOT-2026-WILD-04",
        inventoryStatus: "in_stock",
        isFeatured: true,
        frameStartIndex: 0,
        frameEndIndex: 149,
        heroPosterUrl: "/frames/frame-001.webp",
        originId: "catskill-highlands",
        tastingProfileId: "taste-wildflower-2026",
        createdAt: "2026-10-15T00:00:00.000Z",
        updatedAt: "2026-10-15T00:00:00.000Z",
      },
    ],
  },
  {
    id: "valensole-plateau",
    region: "Plateau de Valensole, Provence",
    elevationMeters: 590,
    climate: "Mediterranean highland",
    beekeeperName: "Henri Martin",
    hiveCount: 32,
    floraEcosystem: "Fragrant lavender fields and wild thyme undergrowth",
    purityTested: true,
    coordinates: { latitude: 43.8378, longitude: 5.9844 },
    products: [], // Empty harvest testing AC-7
  },
];

describe("ApiaryTerroirAtlas component (satisfies AC-2, AC-6, AC-7, AC-8)", () => {
  it("renders origin tabs with proper ARIA accessibility roles (AC-2, AC-8)", () => {
    const onSelectOrigin = vi.fn();
    render(
      <ApiaryTerroirAtlas
        origins={MOCK_ORIGINS}
        activeOriginId="catskill-highlands"
        onSelectOrigin={onSelectOrigin}
      />
    );

    const tabList = screen.getByRole("tablist", {
      name: /apiary origin terroirs/i,
    });
    expect(tabList).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("displays geographic elevation, climate, beekeeper, and flora details (AC-2)", () => {
    render(
      <ApiaryTerroirAtlas
        origins={MOCK_ORIGINS}
        activeOriginId="catskill-highlands"
        onSelectOrigin={vi.fn()}
      />
    );

    expect(screen.getByText(/680m elevation/i)).toBeInTheDocument();
    expect(screen.getByText(/Catskill Highlands, New York/i)).toBeInTheDocument();
    expect(screen.getByText(/Julian Thorne \(24 Hives\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Montane humid continental/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Subalpine wildflower pastures and linden canopies/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/LOT-2026-WILD-04/i)).toBeInTheDocument();
  });

  it("calls onSelectOrigin when tab is clicked (AC-2, AC-6)", () => {
    const onSelectOrigin = vi.fn();
    render(
      <ApiaryTerroirAtlas
        origins={MOCK_ORIGINS}
        activeOriginId="catskill-highlands"
        onSelectOrigin={onSelectOrigin}
      />
    );

    const provenceTab = screen.getByRole("tab", { name: /Plateau de Valensole/i });
    fireEvent.click(provenceTab);

    expect(onSelectOrigin).toHaveBeenCalledWith("valensole-plateau");
  });

  it("navigates tabs using arrow keys and home/end keys (AC-8)", () => {
    const onSelectOrigin = vi.fn();
    render(
      <ApiaryTerroirAtlas
        origins={MOCK_ORIGINS}
        activeOriginId="catskill-highlands"
        onSelectOrigin={onSelectOrigin}
      />
    );

    const tabs = screen.getAllByRole("tab");

    // ArrowRight advances to next tab
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(onSelectOrigin).toHaveBeenCalledWith("valensole-plateau");

    // ArrowLeft wraps around backwards
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(onSelectOrigin).toHaveBeenCalledWith("valensole-plateau");

    // Home jumps to first tab
    fireEvent.keyDown(tabs[1], { key: "Home" });
    expect(onSelectOrigin).toHaveBeenCalledWith("catskill-highlands");

    // End jumps to last tab
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(onSelectOrigin).toHaveBeenCalledWith("valensole-plateau");
  });

  it("renders graceful 'Resting for next harvest' badge when origin has no products (AC-7)", () => {
    render(
      <ApiaryTerroirAtlas
        origins={MOCK_ORIGINS}
        activeOriginId="valensole-plateau"
        onSelectOrigin={vi.fn()}
      />
    );

    expect(screen.getByText(/resting for next harvest/i)).toBeInTheDocument();
    const catalogLink = screen.getByRole("link", {
      name: /explore current catalog/i,
    });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute("href", "/catalog");
  });
});
