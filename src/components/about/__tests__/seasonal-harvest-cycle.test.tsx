import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SeasonalHarvestCycle } from "../seasonal-harvest-cycle";
import { Product, SeasonalCyclePhase } from "@/types/catalog";

const MOCK_PHASES: SeasonalCyclePhase[] = [
  {
    id: "spring-awakening",
    season: "spring",
    title: "Spring Awakening & Early Blossom",
    timeframeMonths: "April to May",
    apicultureActivity: "Brood chamber inspection and wax foundation building",
    activeFlora: ["Basswood Linden", "Wild Apple Blossom"],
    honeyAvailability: "harvesting",
    featuredProductIds: ["prod-1"],
    storyExcerpt: "Spring colony awakening excerpt text.",
  },
  {
    id: "winter-colony-rest",
    season: "winter",
    title: "Winter Cluster & Apiary Slumber",
    timeframeMonths: "October to March",
    apicultureActivity: "Hive winterization and thermal monitoring",
    activeFlora: ["Dormant Highland Pine"],
    honeyAvailability: "dormant",
    featuredProductIds: [],
    storyExcerpt: "Winter apiary slumber excerpt text.",
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "prod-1",
    title: "Raw Wildflower Reserve",
    subtitle: "Spring Harvest",
    description: "Test description",
    category: "single_origin",
    harvestYear: 2026,
    batchNumber: "LOT-SPRING-01",
    inventoryStatus: "in_stock",
    isFeatured: false,
    frameStartIndex: 0,
    frameEndIndex: 149,
    heroPosterUrl: "/frames/frame-001.webp",
    originId: "catskill-highlands",
    tastingProfileId: "taste-1",
    createdAt: "2026-10-15T00:00:00.000Z",
    updatedAt: "2026-10-15T00:00:00.000Z",
  },
];

describe("SeasonalHarvestCycle component (satisfies AC-3, AC-6, AC-7, AC-8)", () => {
  it("renders seasonal selector tabs with proper accessibility attributes (AC-3, AC-8)", () => {
    const onSelectSeason = vi.fn();
    render(
      <SeasonalHarvestCycle
        phases={MOCK_PHASES}
        activeSeason="spring"
        onSelectSeason={onSelectSeason}
        products={MOCK_PRODUCTS}
      />
    );

    const tabList = screen.getByRole("tablist", {
      name: /apiculture seasonal harvest phases/i,
    });
    expect(tabList).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("displays seasonal activity, timeframe months, and active flora (AC-3)", () => {
    render(
      <SeasonalHarvestCycle
        phases={MOCK_PHASES}
        activeSeason="spring"
        onSelectSeason={vi.fn()}
        products={MOCK_PRODUCTS}
      />
    );

    expect(screen.getByText("Spring Awakening & Early Blossom")).toBeInTheDocument();
    expect(screen.getByText("April to May")).toBeInTheDocument();
    expect(
      screen.getByText(/Brood chamber inspection and wax foundation building/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Basswood Linden")).toBeInTheDocument();
    expect(screen.getByText("Wild Apple Blossom")).toBeInTheDocument();
    expect(screen.getByText("Freshly Harvested")).toBeInTheDocument();
    expect(screen.getByText("LOT-SPRING-01")).toBeInTheDocument();
  });

  it("calls onSelectSeason when tab is clicked (AC-3, AC-6)", () => {
    const onSelectSeason = vi.fn();
    render(
      <SeasonalHarvestCycle
        phases={MOCK_PHASES}
        activeSeason="spring"
        onSelectSeason={onSelectSeason}
        products={MOCK_PRODUCTS}
      />
    );

    const winterTab = screen.getByRole("tab", { name: /winter/i });
    fireEvent.click(winterTab);

    expect(onSelectSeason).toHaveBeenCalledWith("winter");
  });

  it("navigates seasonal tabs with keyboard arrow keys and home/end keys (AC-8)", () => {
    const onSelectSeason = vi.fn();
    render(
      <SeasonalHarvestCycle
        phases={MOCK_PHASES}
        activeSeason="spring"
        onSelectSeason={onSelectSeason}
        products={MOCK_PRODUCTS}
      />
    );

    const tabs = screen.getAllByRole("tab");

    // ArrowRight advances to next season
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(onSelectSeason).toHaveBeenCalledWith("winter");

    // ArrowLeft wraps backwards
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(onSelectSeason).toHaveBeenCalledWith("winter");

    // Home jumps to first season
    fireEvent.keyDown(tabs[1], { key: "Home" });
    expect(onSelectSeason).toHaveBeenCalledWith("spring");

    // End jumps to last season
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(onSelectSeason).toHaveBeenCalledWith("winter");
  });

  it("renders graceful 'Resting for next harvest' badge during winter dormancy (AC-7)", () => {
    render(
      <SeasonalHarvestCycle
        phases={MOCK_PHASES}
        activeSeason="winter"
        onSelectSeason={vi.fn()}
        products={MOCK_PRODUCTS}
      />
    );

    expect(screen.getByText("Colony In Quiescence")).toBeInTheDocument();
    expect(screen.getByText(/resting for next harvest/i)).toBeInTheDocument();
    expect(screen.getByText(/colonies focus on survival and hive warmth/i)).toBeInTheDocument();
  });
});
