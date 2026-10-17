import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BundleCard } from "../bundle-card";
import { ProductWithRelations } from "@/types/catalog";
import { useCartStore } from "@/lib/store/cart-store";

const mockBundle: ProductWithRelations = {
  id: "apiary-tasting-flight-bundle",
  slug: "apiary-tasting-flight-bundle",
  title: "Apiary Reserve Tasting Flight",
  subtitle: "Curated Trio of Single Origin Harvests",
  description:
    "A guided sensory journey featuring trio tasting jars of Raw Wildflower, Pure Acacia, and Mountain Lavender, packaged in a custom walnut gift box.",
  category: "bundle",
  harvestYear: 2026,
  batchNumber: "LOT-2026-BNDL-01",
  inventoryStatus: "in_stock",
  isFeatured: false,
  frameStartIndex: 0,
  frameEndIndex: 149,
  heroPosterUrl: "/frames/frame-001.webp",
  originId: "catskill-highlands",
  tastingProfileId: "taste-bundle-2026",
  includedProductIds: [
    "raw-wildflower-reserve",
    "pure-acacia-blossom",
    "mountain-lavender-infusion",
  ],
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
    id: "taste-bundle-2026",
    sweetnessScale: 4,
    intensityScale: 4,
    colorRating: "Spectrum from Pale Gold to Deep Amber",
    texture: "Trio of liquid silk, velvety crystallizing, and creamy spread",
    floralSources: ["Wildflower Pastures", "Acacia Groves", "Provençal Lavender"],
    flavorDescriptors: ["Comparative sensory progression"],
    pairedFoods: ["Comprehensive cheese board", "fine pastry pairings"],
  },
  includedProducts: [
    {
      id: "raw-wildflower-reserve",
      slug: "raw-wildflower-reserve",
      title: "Raw Wildflower Reserve",
      subtitle: "Late Summer Meadow Harvest",
      description: "Wildflower harvest",
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
    {
      id: "pure-acacia-blossom",
      slug: "pure-acacia-blossom",
      title: "Pure Acacia Blossom",
      subtitle: "Spring Mountain Canopy",
      description: "Acacia blossom",
      category: "single_origin",
      harvestYear: 2026,
      batchNumber: "LOT-2026-ACAC-01",
      inventoryStatus: "in_stock",
      isFeatured: false,
      frameStartIndex: 0,
      frameEndIndex: 149,
      heroPosterUrl: "/frames/frame-001.webp",
      originId: "black-forest-foothills",
      tastingProfileId: "taste-acacia-2026",
      createdAt: "2026-10-15T00:00:00.000Z",
      updatedAt: "2026-10-15T00:00:00.000Z",
    },
  ],
  variants: [
    {
      id: "apiary-flight-3x125g",
      productId: "apiary-tasting-flight-bundle",
      sku: "HNY-FL-375",
      title: "Curated 3 x 125g Flight Box",
      weightOz: 13.2,
      weightGrams: 375,
      volumeMl: 285,
      jarMaterial: "Walnut Case with 3 French Glass Jars",
      priceCents: 8800,
      compareAtPriceCents: 11400,
      isDefault: true,
      imageUrl: "/frames/frame-001.webp",
    },
  ],
};

describe("BundleCard component (satisfies AC-4, AC-7)", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().toggleCart(false);
  });

  it("renders gift box edition badge, title, and bundle savings (satisfies AC-7)", () => {
    render(<BundleCard product={mockBundle} />);

    expect(screen.getByText("Gift Box Edition")).toBeInTheDocument();
    expect(screen.getByText("Apiary Reserve Tasting Flight")).toBeInTheDocument();
    expect(screen.getByText("$88.00")).toBeInTheDocument();
    expect(screen.getByText("$114.00")).toBeInTheDocument();
    expect(screen.getByText(/save \$26\.00/i)).toBeInTheDocument();
  });

  it("displays included varietals preview chips (satisfies AC-7)", () => {
    render(<BundleCard product={mockBundle} />);

    expect(screen.getByText("Included Varietals In Box")).toBeInTheDocument();
    expect(screen.getByText("Raw Wildflower Reserve")).toBeInTheDocument();
    expect(screen.getByText("Pure Acacia Blossom")).toBeInTheDocument();
    expect(
      screen.getByText("Housed in Walnut Case with 3 French Glass Jars")
    ).toBeInTheDocument();
  });

  it("adds bundle to cart and opens the drawer on click (satisfies AC-4, AC-7)", () => {
    render(<BundleCard product={mockBundle} />);

    const button = screen.getByRole("button", {
      name: /add .* to bag/i,
    });
    fireEvent.click(button);

    const cart = useCartStore.getState();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].productId).toBe("apiary-tasting-flight-bundle");
    expect(cart.items[0].unitPriceCents).toBe(8800);
    expect(cart.isOpen).toBe(true);
  });

  it("renders flight lot batch number and harvest trio subheader (satisfies AC-7)", () => {
    render(<BundleCard product={mockBundle} />);

    expect(screen.getByText("LOT-2026-BNDL-01")).toBeInTheDocument();
    expect(screen.getByText("2026 Reserve Trio")).toBeInTheDocument();
  });

  it("toggles the flight sensory profile drawer (satisfies AC-5, AC-7)", () => {
    render(<BundleCard product={mockBundle} />);

    const trigger = screen.getByRole("button", {
      name: /inspect tasting profile/i,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    expect(
      screen.getByRole("button", { name: /hide sensory profile/i })
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Spectrum from Pale Gold to Deep Amber")
    ).toBeInTheDocument();
  });
});

