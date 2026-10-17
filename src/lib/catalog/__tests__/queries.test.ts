import { describe, it, expect } from "vitest";
import {
  filterAndSortProducts,
  getAllProducts,
  getCategoryCounts,
  getFeaturedProduct,
  getProductById,
  getProductBySlug,
  getProductDisplayPrice,
  getVariantById,
} from "../queries";

describe("Catalog Queries (satisfies AC-1, AC-3)", () => {
  it("fetches product by ID with full relations", () => {
    const product = getProductById("raw-wildflower-reserve");
    expect(product).not.toBeNull();
    expect(product?.title).toBe("Raw Wildflower Reserve");
    expect(product?.origin).toBeDefined();
    expect(product?.origin.region).toContain("Catskill");
    expect(product?.tastingProfile).toBeDefined();
    expect(product?.tastingProfile.flavorDescriptors.length).toBeGreaterThan(0);
    expect(product?.variants.length).toBeGreaterThanOrEqual(2);
  });

  it("returns null when fetching non-existent product ID", () => {
    const product = getProductById("non-existent-product");
    expect(product).toBeNull();
  });

  it("fetches product by slug with full relations", () => {
    const product = getProductBySlug("pure-acacia-blossom");
    expect(product).not.toBeNull();
    expect(product?.slug).toBe("pure-acacia-blossom");
    expect(product?.origin.beekeeperName).toBe("Astrid Hoffmann");
  });

  it("fetches the single featured product", () => {
    const featured = getFeaturedProduct();
    expect(featured).not.toBeNull();
    expect(featured?.isFeatured).toBe(true);
    expect(featured?.id).toBe("raw-wildflower-reserve");
  });

  it("filters all products by category", () => {
    const singleOrigins = getAllProducts({ category: "single_origin" });
    expect(singleOrigins.length).toBeGreaterThanOrEqual(2);
    for (const item of singleOrigins) {
      expect(item.category).toBe("single_origin");
    }

    const bundles = getAllProducts({ category: "bundle" });
    expect(bundles).toHaveLength(1);
    expect(bundles[0].id).toBe("apiary-tasting-flight-bundle");
  });

  it("filters products by inStockOnly", () => {
    const inStock = getAllProducts({ inStockOnly: true });
    expect(inStock.length).toBeGreaterThan(0);
    for (const item of inStock) {
      expect(
        item.inventoryStatus === "in_stock" ||
          item.inventoryStatus === "limited_reserve"
      ).toBe(true);
    }
  });

  it("retrieves variant by ID with parent product (covers AC-1, AC-3)", () => {
    const result = getVariantById("mountain-lavender-infusion-250g");
    expect(result).not.toBeNull();
    expect(result?.variant.sku).toBe("HNY-LV-250");
    expect(result?.product.id).toBe("mountain-lavender-infusion");
  });

  it("returns null for non-existent variant ID (covers AC-1)", () => {
    const result = getVariantById("unknown-variant");
    expect(result).toBeNull();
  });

  it("resolves default featured varietal with frame bounds and hero preview poster (covers AC-3)", () => {
    const featured = getFeaturedProduct();
    expect(featured).not.toBeNull();
    expect(featured?.id).toBe("raw-wildflower-reserve");
    expect(featured?.frameStartIndex).toBe(0);
    expect(featured?.frameEndIndex).toBe(149);
    expect(featured?.heroPosterUrl).toBe("/frames/frame-001.webp");
  });

  it("verifies all catalog varietals return valid linked terroir origin and tasting profile records (covers AC-1, AC-3)", () => {
    const allProducts = getAllProducts();
    expect(allProducts.length).toBeGreaterThanOrEqual(6);

    for (const product of allProducts) {
      expect(product.origin).toBeDefined();
      expect(product.origin.id).toBe(product.originId);
      expect(product.origin.region).toBeTruthy();
      expect(product.tastingProfile).toBeDefined();
      expect(product.tastingProfile.id).toBe(product.tastingProfileId);
      expect(product.variants.length).toBeGreaterThanOrEqual(1);

      for (const variant of product.variants) {
        expect(variant.weightOz).toBeGreaterThan(0);
        expect(variant.weightGrams).toBeGreaterThan(0);
        expect(variant.volumeMl).toBeGreaterThan(0);
        expect(variant.priceCents).toBeGreaterThan(0);
        expect(variant.jarMaterial).toBeTruthy();
      }
    }
  });

  it("supports compound filtering by both category and inStockOnly (covers AC-3)", () => {
    const filtered = getAllProducts({
      category: "single_origin",
      inStockOnly: true,
    });

    expect(filtered.length).toBeGreaterThan(0);
    for (const product of filtered) {
      expect(product.category).toBe("single_origin");
      expect(
        product.inventoryStatus === "in_stock" ||
          product.inventoryStatus === "limited_reserve"
      ).toBe(true);
    }
  });

  it("resolves includedProducts relation on bundle records (satisfies AC-1, AC-7)", () => {
    const bundle = getProductById("apiary-tasting-flight-bundle");
    expect(bundle).not.toBeNull();
    expect(bundle?.includedProducts).toBeDefined();
    expect(bundle?.includedProducts?.length).toBe(3);
    const titles = bundle?.includedProducts?.map((p) => p.title);
    expect(titles).toContain("Raw Wildflower Reserve");
    expect(titles).toContain("Pure Acacia Blossom");
    expect(titles).toContain("Mountain Lavender Infusion");
  });

  it("calculates category counts correctly (satisfies AC-1, AC-2)", () => {
    const counts = getCategoryCounts();
    expect(counts.all).toBeGreaterThanOrEqual(6);
    expect(counts.single_origin).toBeGreaterThanOrEqual(2);
    expect(counts.infusion).toBeGreaterThanOrEqual(1);
    expect(counts.seasonal_reserve).toBeGreaterThanOrEqual(1);
    expect(counts.raw_comb).toBeGreaterThanOrEqual(1);
    expect(counts.bundle).toBeGreaterThanOrEqual(1);
  });

  it("sorts products by price ascending and descending (satisfies AC-2)", () => {
    const asc = getAllProducts({ sortBy: "price_asc" });
    for (let i = 0; i < asc.length - 1; i++) {
      const priceA = asc[i].variants.find((v) => v.isDefault)?.priceCents ?? 0;
      const priceB = asc[i + 1].variants.find((v) => v.isDefault)?.priceCents ?? 0;
      expect(priceA).toBeLessThanOrEqual(priceB);
    }

    const desc = getAllProducts({ sortBy: "price_desc" });
    for (let i = 0; i < desc.length - 1; i++) {
      const priceA = desc[i].variants.find((v) => v.isDefault)?.priceCents ?? 0;
      const priceB = desc[i + 1].variants.find((v) => v.isDefault)?.priceCents ?? 0;
      expect(priceA).toBeGreaterThanOrEqual(priceB);
    }
  });

  it("sorts products by intensity (satisfies AC-2)", () => {
    const byIntensity = getAllProducts({ sortBy: "intensity" });
    for (let i = 0; i < byIntensity.length - 1; i++) {
      expect(
        byIntensity[i].tastingProfile.intensityScale
      ).toBeGreaterThanOrEqual(byIntensity[i + 1].tastingProfile.intensityScale);
    }
  });

  it("calculates product display prices correctly (satisfies AC-4)", () => {
    const product = getProductById("raw-wildflower-reserve");
    expect(product).not.toBeNull();
    if (product) {
      const prices = getProductDisplayPrice(product);
      expect(prices.minPriceCents).toBe(3400);
      expect(prices.maxPriceCents).toBe(5800);
      expect(prices.defaultPriceCents).toBe(3400);
      expect(prices.compareAtPriceCents).toBe(4000);
    }
  });

  it("handles category 'all' by returning all products (satisfies AC-2)", () => {
    const all = getAllProducts({ category: "all" });
    const baseline = getAllProducts();
    expect(all.length).toBe(baseline.length);
  });

  it("supports multi category filtering with categories array (satisfies AC-2)", () => {
    const multi = getAllProducts({
      categories: ["single_origin", "infusion"],
    });
    expect(multi.length).toBeGreaterThanOrEqual(3);
    for (const item of multi) {
      expect(["single_origin", "infusion"]).toContain(item.category);
    }
  });

  it("returns empty array when filterAndSortProducts is given an empty list", () => {
    const result = filterAndSortProducts([]);
    expect(result).toEqual([]);
  });

  it("calculates category counts filtering by inStockOnly (satisfies AC-2)", () => {
    const countsInStock = getCategoryCounts({ inStockOnly: true });
    expect(countsInStock.all).toBeGreaterThan(0);
    expect(
      countsInStock.single_origin +
        countsInStock.infusion +
        countsInStock.seasonal_reserve +
        countsInStock.raw_comb +
        countsInStock.bundle
    ).toBe(countsInStock.all);
  });

  it("sorts by featured placing featured products at the top (satisfies AC-2)", () => {
    const sorted = getAllProducts({ sortBy: "featured" });
    expect(sorted.length).toBeGreaterThan(0);
    expect(sorted[0].isFeatured).toBe(true);
  });
});

