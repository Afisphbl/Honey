import { describe, it, expect } from "vitest";
import {
  getAllProducts,
  getFeaturedProduct,
  getProductById,
  getProductBySlug,
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
});
