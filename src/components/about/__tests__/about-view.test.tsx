import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AboutView } from "../about-view";
import {
  getApiaryOrigins,
  getApiaryOriginDetails,
  getSeasonalCyclePhases,
  getPurityStandards,
  getBeekeepingPledges,
  getAllProducts,
} from "@/lib/catalog/queries";

const mockReplace = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/about",
  useSearchParams: () => currentSearchParams,
}));

describe("AboutView orchestrator (satisfies AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8)", () => {
  const origins = getApiaryOrigins()
    .map((o) => getApiaryOriginDetails(o.id))
    .filter((d): d is NonNullable<typeof d> => d !== undefined);
  const phases = getSeasonalCyclePhases();
  const standards = getPurityStandards();
  const pledges = getBeekeepingPledges();
  const products = getAllProducts();

  beforeEach(() => {
    mockReplace.mockClear();
    currentSearchParams = new URLSearchParams();
  });

  it("renders all four narrative sections and closing tasting invitation (AC-1)", () => {
    render(
      <AboutView
        origins={origins}
        phases={phases}
        standards={standards}
        pledges={pledges}
        products={products}
      />
    );

    // Section 1: Terroir Atlas
    expect(
      screen.getByRole("heading", {
        name: /single origin microclimates & botanical sanctuaries/i,
      })
    ).toBeInTheDocument();

    // Section 2: Seasonal Harvest Cycle
    expect(
      screen.getByRole("heading", {
        name: /the four seasons of pure hive alchemy/i,
      })
    ).toBeInTheDocument();

    // Section 3: Purity Standards
    expect(
      screen.getByRole("heading", {
        name: /laboratory purity standards & chemical transparency/i,
      })
    ).toBeInTheDocument();

    // Section 4: Ethical Pledges
    expect(
      screen.getByRole("heading", {
        name: /ethical apiculture & regenerative stewardship/i,
      })
    ).toBeInTheDocument();

    // Section 5: Closing Invitation
    expect(
      screen.getByRole("heading", {
        name: /experience single origin terroirs at your table/i,
      })
    ).toBeInTheDocument();
  });

  it("defaults to Catskill Highlands and Spring when URL params are absent (AC-6)", () => {
    render(
      <AboutView
        origins={origins}
        phases={phases}
        standards={standards}
        pledges={pledges}
        products={products}
      />
    );

    const catskillTab = screen.getByRole("tab", { name: /catskill highlands/i });
    expect(catskillTab).toHaveAttribute("aria-selected", "true");

    const springTab = screen.getByRole("tab", { name: /spring/i });
    expect(springTab).toHaveAttribute("aria-selected", "true");
  });

  it("mounts requested origin and season from URL query parameters (AC-6)", () => {
    currentSearchParams = new URLSearchParams({
      origin: "valensole-plateau",
      season: "summer",
    });

    render(
      <AboutView
        origins={origins}
        phases={phases}
        standards={standards}
        pledges={pledges}
        products={products}
      />
    );

    const provenceTab = screen.getByRole("tab", { name: /plateau de valensole/i });
    expect(provenceTab).toHaveAttribute("aria-selected", "true");

    const summerTab = screen.getByRole("tab", { name: /summer/i });
    expect(summerTab).toHaveAttribute("aria-selected", "true");
  });

  it("updates shallow URL query parameter when origin tab is switched (AC-6)", () => {
    render(
      <AboutView
        origins={origins}
        phases={phases}
        standards={standards}
        pledges={pledges}
        products={products}
      />
    );

    const blackForestTab = screen.getByRole("tab", {
      name: /black forest foothills/i,
    });
    fireEvent.click(blackForestTab);

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("origin=black-forest-foothills"),
      { scroll: false }
    );
  });

  it("updates shallow URL query parameter when season tab is switched (AC-6)", () => {
    render(
      <AboutView
        origins={origins}
        phases={phases}
        standards={standards}
        pledges={pledges}
        products={products}
      />
    );

    const autumnTab = screen.getByRole("tab", { name: /autumn/i });
    fireEvent.click(autumnTab);

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining("season=autumn"),
      { scroll: false }
    );
  });

  it("silently normalizes unknown or invalid query parameters to safe defaults (AC-6)", () => {
    currentSearchParams = new URLSearchParams({
      origin: "unknown-mountain",
      season: "monsoon",
    });

    render(
      <AboutView
        origins={origins}
        phases={phases}
        standards={standards}
        pledges={pledges}
        products={products}
      />
    );

    const catskillTab = screen.getByRole("tab", { name: /catskill highlands/i });
    expect(catskillTab).toHaveAttribute("aria-selected", "true");

    const springTab = screen.getByRole("tab", { name: /spring/i });
    expect(springTab).toHaveAttribute("aria-selected", "true");
  });

  it("provides links to explore the catalog in closing invitation (AC-1)", () => {
    render(
      <AboutView
        origins={origins}
        phases={phases}
        standards={standards}
        pledges={pledges}
        products={products}
      />
    );

    const catalogLink = screen.getByRole("link", {
      name: /explore the reserve catalog/i,
    });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute("href", "/catalog");
  });
});
