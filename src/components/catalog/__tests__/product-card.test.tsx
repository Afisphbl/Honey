import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "../product-card";
import { ProductWithRelations } from "@/types/catalog";
import { useCartStore } from "@/lib/store/cart-store";

const mockProduct: ProductWithRelations = {
  id: "raw-wildflower-reserve",
  slug: "raw-wildflower-reserve",
  title: "Raw Wildflower Reserve",
  subtitle: "Late Summer Meadow Harvest",
  description: "Harvested unheated from high altitude Catskill wildflower pastures.",
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
  imageUrl: "/frames/frame-001.webp",
  createdAt: "2026-10-15T00:00:00.000Z",
  updatedAt: "2026-10-15T00:00:00.000Z",
  origin: {
    id: "catskill-highlands",
    region: "Catskill Highlands, New York",
    elevationMeters: 680,
    climate: "Montane humid continental",
    beekeeperName: "Julian Thorne",
    hiveCount: 24,
    floraEcosystem: "Subalpine wildflower pastures",
    purityTested: true,
    coordinates: { latitude: 42.1584, longitude: -74.3211 },
  },
  tastingProfile: {
    id: "taste-wildflower-2026",
    sweetnessScale: 4,
    intensityScale: 3,
    colorRating: "Deep Warm Amber",
    texture: "Velvety smooth",
    floralSources: ["Basswood Blossom", "Goldenrod"],
    flavorDescriptors: ["Ripe apricot", "warm butter"],
    pairedFoods: ["Aged manchego", "sourdough toast"],
  },
  variants: [
    {
      id: "raw-wildflower-reserve-250g",
      productId: "raw-wildflower-reserve",
      sku: "HNY-RW-250",
      title: "250g Artisanal Tasting Jar",
      weightOz: 8.8,
      weightGrams: 250,
      volumeMl: 190,
      jarMaterial: "Amber UV Filtered French Glass",
      priceCents: 3400,
      compareAtPriceCents: 4000,
      isDefault: true,
      imageUrl: "/frames/frame-001.webp",
    },
    {
      id: "raw-wildflower-reserve-500g",
      productId: "raw-wildflower-reserve",
      sku: "HNY-RW-500",
      title: "500g Kitchen Reserve Jar",
      weightOz: 17.6,
      weightGrams: 500,
      volumeMl: 380,
      jarMaterial: "Amber UV Filtered French Glass",
      priceCents: 5800,
      compareAtPriceCents: 6800,
      isDefault: false,
      imageUrl: "/frames/frame-001.webp",
    },
  ],
};

describe("ProductCard component (satisfies AC-4, AC-5)", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().toggleCart(false);
  });

  it("renders reserve title, terroir, batch number, and harvest year (satisfies AC-4)", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Raw Wildflower Reserve")).toBeInTheDocument();
    expect(screen.getByText("Late Summer Meadow Harvest")).toBeInTheDocument();
    expect(screen.getByText("LOT-2026-WILD-04")).toBeInTheDocument();
    expect(screen.getByText("Harvest 2026")).toBeInTheDocument();
    expect(screen.getByText("680m elevation")).toBeInTheDocument();
    expect(
      screen.getByText("Catskill Highlands, New York")
    ).toBeInTheDocument();
  });

  it("switches variant weight pills and updates displayed price (satisfies AC-4)", () => {
    render(<ProductCard product={mockProduct} />);

    // Default 250g is $34.00
    expect(screen.getByText("$34.00")).toBeInTheDocument();
    expect(screen.getByText("$40.00")).toBeInTheDocument(); // compareAt
    expect(screen.getByText("Save 15%")).toBeInTheDocument();

    // Select 500g variant
    const pill500g = screen.getByRole("radio", { name: "500g" });
    fireEvent.click(pill500g);

    expect(screen.getByText("$58.00")).toBeInTheDocument();
    expect(screen.getByText("$68.00")).toBeInTheDocument();
    expect(screen.getByText("Save 15%")).toBeInTheDocument();
  });

  it("adds the selected variant to the cart store on click (satisfies AC-4)", () => {
    render(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole("button", {
      name: /add raw wildflower reserve .* to shopping bag/i,
    });
    fireEvent.click(addButton);

    const cartState = useCartStore.getState();
    expect(cartState.items.length).toBe(1);
    expect(cartState.items[0].productId).toBe("raw-wildflower-reserve");
    expect(cartState.items[0].variantId).toBe("raw-wildflower-reserve-250g");
    expect(cartState.items[0].unitPriceCents).toBe(3400);
    expect(cartState.isOpen).toBe(true);
  });

  it("disables purchase action when product is out of season or sold out (satisfies AC-4)", () => {
    const outOfSeasonProduct: ProductWithRelations = {
      ...mockProduct,
      inventoryStatus: "out_of_season",
    };

    render(<ProductCard product={outOfSeasonProduct} />);

    const button = screen.getByRole("button", { name: /out of season/i });
    expect(button).toBeDisabled();
    expect(
      screen.getAllByText("Out of Season").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("toggles the integrated tasting notes drawer (satisfies AC-5, AC-6)", () => {
    render(<ProductCard product={mockProduct} />);

    const drawerTrigger = screen.getByRole("button", {
      name: /inspect tasting profile/i,
    });
    expect(drawerTrigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(drawerTrigger);

    expect(
      screen.getByRole("button", { name: /hide sensory profile/i })
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Deep Warm Amber")).toBeInTheDocument();
  });

  it("exposes accessible radiogroup semantics for jar size selector (AC-4)", () => {
    render(<ProductCard product={mockProduct} />);

    const radioGroup = screen.getByRole("radiogroup", {
      name: /jar sizes for raw wildflower reserve/i,
    });
    expect(radioGroup).toBeInTheDocument();

    const pill250g = screen.getByRole("radio", { name: "250g" });
    const pill500g = screen.getByRole("radio", { name: "500g" });

    expect(pill250g).toHaveAttribute("aria-checked", "true");
    expect(pill500g).toHaveAttribute("aria-checked", "false");
  });

  it("links tasting profile trigger button to tasting panel via aria-controls (AC-5)", () => {
    render(<ProductCard product={mockProduct} />);

    const trigger = screen.getByRole("button", {
      name: /inspect tasting profile/i,
    });
    const panelId = trigger.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();

    const region = screen.getByRole("region", { hidden: true });
    expect(region).toHaveAttribute("id", panelId);
  });
});

