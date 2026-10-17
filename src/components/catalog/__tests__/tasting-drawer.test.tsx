import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TastingDrawer } from "../tasting-drawer";
import { TastingProfile } from "@/types/catalog";

const mockTastingProfile: TastingProfile = {
  id: "taste-test-01",
  sweetnessScale: 4,
  intensityScale: 3,
  colorRating: "Luminous Amber Gold",
  texture: "Velvety slow crystallizing",
  floralSources: ["Basswood Blossom", "Wild Clover"],
  flavorDescriptors: ["Ripe apricot", "warm butter"],
  pairedFoods: ["Aged manchego", "sourdough bread"],
};

describe("TastingDrawer component (satisfies AC-5, AC-6)", () => {
  it("renders accessible toggle button with explicit aria-expanded state", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <TastingDrawer
        tastingProfile={mockTastingProfile}
        isOpen={false}
        onToggle={onToggle}
      />
    );

    const button = screen.getByRole("button", {
      name: /inspect tasting profile/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    // Rerender as open
    rerender(
      <TastingDrawer
        tastingProfile={mockTastingProfile}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    const openButton = screen.getByRole("button", {
      name: /hide sensory profile/i,
    });
    expect(openButton).toHaveAttribute("aria-expanded", "true");
  });

  it("renders sweetness and intensity meters with aria attributes (satisfies AC-5)", () => {
    render(
      <TastingDrawer
        tastingProfile={mockTastingProfile}
        isOpen={true}
        onToggle={vi.fn()}
      />
    );

    const meters = screen.getAllByRole("meter");
    expect(meters.length).toBe(2);

    expect(meters[0]).toHaveAttribute("aria-valuenow", "4");
    expect(meters[0]).toHaveAttribute(
      "aria-label",
      "Sweetness: 4 out of 5 stars"
    );

    expect(meters[1]).toHaveAttribute("aria-valuenow", "3");
    expect(meters[1]).toHaveAttribute(
      "aria-label",
      "Aroma Intensity: 3 out of 5 stars"
    );
  });

  it("renders sensory descriptions, floral sources, and food pairings (satisfies AC-5)", () => {
    render(
      <TastingDrawer
        tastingProfile={mockTastingProfile}
        isOpen={true}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText("Luminous Amber Gold")).toBeInTheDocument();
    expect(
      screen.getByText("Velvety slow crystallizing")
    ).toBeInTheDocument();

    expect(screen.getByText("Basswood Blossom")).toBeInTheDocument();
    expect(screen.getByText("Wild Clover")).toBeInTheDocument();

    expect(screen.getByText("Ripe apricot")).toBeInTheDocument();
    expect(screen.getByText("warm butter")).toBeInTheDocument();

    expect(screen.getByText("Aged manchego")).toBeInTheDocument();
    expect(screen.getByText("sourdough bread")).toBeInTheDocument();
  });

  it("sets gridTemplateRows to 1fr when expanded and 0fr when closed (satisfies AC-6)", () => {
    const { rerender } = render(
      <TastingDrawer
        tastingProfile={mockTastingProfile}
        isOpen={false}
        onToggle={vi.fn()}
      />
    );

    const region = screen.getByRole("region", { hidden: true });
    expect(region).toHaveStyle({ gridTemplateRows: "0fr" });

    rerender(
      <TastingDrawer
        tastingProfile={mockTastingProfile}
        isOpen={true}
        onToggle={vi.fn()}
      />
    );

    expect(region).toHaveStyle({ gridTemplateRows: "1fr" });
  });

  it("links trigger button and region using accessible id attributes (satisfies AC-5)", () => {
    render(
      <TastingDrawer
        tastingProfile={mockTastingProfile}
        isOpen={true}
        onToggle={vi.fn()}
        id="custom-tasting-panel"
      />
    );

    const button = screen.getByRole("button", {
      name: /hide sensory profile/i,
    });
    expect(button).toHaveAttribute("aria-controls", "custom-tasting-panel");

    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("id", "custom-tasting-panel");
    expect(region).toHaveAttribute("aria-labelledby", button.id);
  });

  it("handles profile with empty flavor descriptors gracefully (satisfies AC-5)", () => {
    const profileNoFlavors: TastingProfile = {
      ...mockTastingProfile,
      flavorDescriptors: [],
    };

    render(
      <TastingDrawer
        tastingProfile={profileNoFlavors}
        isOpen={true}
        onToggle={vi.fn()}
      />
    );

    expect(screen.queryByText("Flavor Descriptors")).not.toBeInTheDocument();
    expect(screen.getByText("Basswood Blossom")).toBeInTheDocument();
  });
});

