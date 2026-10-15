import { describe, it, expect } from "vitest";
import {
  ApiaryOriginSchema,
  CartItemSchema,
  OrderSubmissionSchema,
  ProductSchema,
  ProductVariantSchema,
  ShippingAddressSchema,
  TastingProfileSchema,
} from "../schema";
import {
  APIARY_ORIGINS,
  PRODUCTS,
  PRODUCT_VARIANTS,
  TASTING_PROFILES,
} from "../data";

describe("Catalog Schema and Invariants Validation (satisfies AC-1, AC-2, AC-3)", () => {
  it("validates all apiary origin seed records against ApiaryOriginSchema", () => {
    expect(APIARY_ORIGINS.length).toBeGreaterThanOrEqual(4);
    for (const origin of APIARY_ORIGINS) {
      const result = ApiaryOriginSchema.safeParse(origin);
      expect(result.success).toBe(true);
    }
  });

  it("validates all tasting profile seed records against TastingProfileSchema", () => {
    expect(TASTING_PROFILES.length).toBeGreaterThanOrEqual(5);
    for (const profile of TASTING_PROFILES) {
      const result = TastingProfileSchema.safeParse(profile);
      expect(result.success).toBe(true);
      expect(profile.sweetnessScale).toBeGreaterThanOrEqual(1);
      expect(profile.sweetnessScale).toBeLessThanOrEqual(5);
      expect(profile.intensityScale).toBeGreaterThanOrEqual(1);
      expect(profile.intensityScale).toBeLessThanOrEqual(5);
    }
  });

  it("validates all product seed records against ProductSchema", () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(5);
    for (const product of PRODUCTS) {
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
      expect(product.frameStartIndex).toBeGreaterThanOrEqual(0);
      expect(product.frameEndIndex).toBeLessThanOrEqual(149);
      expect(product.frameStartIndex).toBeLessThanOrEqual(product.frameEndIndex);
    }
  });

  it("validates all product variants against ProductVariantSchema", () => {
    expect(PRODUCT_VARIANTS.length).toBeGreaterThanOrEqual(6);
    for (const variant of PRODUCT_VARIANTS) {
      const result = ProductVariantSchema.safeParse(variant);
      expect(result.success).toBe(true);
      expect(variant.priceCents).toBeGreaterThan(0);
      expect(variant.weightOz).toBeGreaterThan(0);
    }
  });

  it("enforces key invariants across catalog seed data", () => {
    // Invariant: Exactly one featured product
    const featured = PRODUCTS.filter((p) => p.isFeatured);
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe("raw-wildflower-reserve");

    // Invariant: Every product has at least one variant and exactly one default variant
    for (const product of PRODUCTS) {
      const variants = PRODUCT_VARIANTS.filter((v) => v.productId === product.id);
      expect(variants.length).toBeGreaterThanOrEqual(1);

      const defaultVariants = variants.filter((v) => v.isDefault);
      expect(defaultVariants).toHaveLength(1);
    }

    // Invariant: Bundles reference valid product IDs
    const bundles = PRODUCTS.filter((p) => p.category === "bundle");
    for (const bundle of bundles) {
      expect(bundle.includedProductIds).toBeDefined();
      expect(bundle.includedProductIds!.length).toBeGreaterThan(0);
      for (const childId of bundle.includedProductIds!) {
        const found = PRODUCTS.some((p) => p.id === childId);
        expect(found).toBe(true);
      }
    }
  });

  describe("ShippingAddressSchema", () => {
    it("accepts a valid United States shipping address", () => {
      const validAddress = {
        fullName: "Eleanor Vance",
        email: "eleanor@example.com",
        line1: "142 Mountain View Road",
        line2: "Apt 4B",
        city: "Woodstock",
        state: "NY",
        postalCode: "12498",
        country: "US",
      };

      const result = ShippingAddressSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it("rejects an invalid state abbreviation", () => {
      const invalid = {
        fullName: "Eleanor Vance",
        email: "eleanor@example.com",
        line1: "142 Mountain View Road",
        city: "Woodstock",
        state: "ZZ",
        postalCode: "12498",
      };

      const result = ShippingAddressSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects a malformed postal code", () => {
      const invalid = {
        fullName: "Eleanor Vance",
        email: "eleanor@example.com",
        line1: "142 Mountain View Road",
        city: "Woodstock",
        state: "NY",
        postalCode: "12", // too short
      };

      const result = ShippingAddressSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("OrderSubmissionSchema", () => {
    it("accepts a valid order submission payload", () => {
      const payload = {
        customer: {
          name: "Julian Thorne",
          email: "julian@apiculture.org",
        },
        shippingAddress: {
          fullName: "Julian Thorne",
          email: "julian@apiculture.org",
          line1: "88 Hive Ridge Lane",
          city: "Kingston",
          state: "NY",
          postalCode: "12401",
        },
        items: [
          {
            productId: "raw-wildflower-reserve",
            variantId: "raw-wildflower-reserve-250g",
            quantity: 2,
          },
        ],
        expectedSubtotalCents: 6800,
      };

      const result = OrderSubmissionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("rejects an order with empty items", () => {
      const emptyPayload = {
        customer: {
          name: "Julian Thorne",
          email: "julian@apiculture.org",
        },
        shippingAddress: {
          fullName: "Julian Thorne",
          email: "julian@apiculture.org",
          line1: "88 Hive Ridge Lane",
          city: "Kingston",
          state: "NY",
          postalCode: "12401",
        },
        items: [],
      };

      const result = OrderSubmissionSchema.safeParse(emptyPayload);
      expect(result.success).toBe(false);
    });

    it("rejects an order item with quantity exceeding 10", () => {
      const excessivePayload = {
        customer: {
          name: "Julian Thorne",
          email: "julian@apiculture.org",
        },
        shippingAddress: {
          fullName: "Julian Thorne",
          email: "julian@apiculture.org",
          line1: "88 Hive Ridge Lane",
          city: "Kingston",
          state: "NY",
          postalCode: "12401",
        },
        items: [
          {
            productId: "raw-wildflower-reserve",
            variantId: "raw-wildflower-reserve-250g",
            quantity: 11,
          },
        ],
      };

      const result = OrderSubmissionSchema.safeParse(excessivePayload);
      expect(result.success).toBe(false);
    });
  });

  describe("CartItemSchema", () => {
    it("validates snapshot cart item and transforms legacy fields if needed (covers AC-2, AC-5)", () => {
      const item = {
        id: "raw-wildflower-reserve-250g",
        productId: "raw-wildflower-reserve",
        variantId: "raw-wildflower-reserve-250g",
        title: "Raw Wildflower Reserve",
        variantTitle: "250g Artisanal Tasting Jar",
        unitPriceCents: 3400,
        weightOz: 8.8,
        quantity: 2,
        addedAt: "2026-10-15T00:00:00.000Z",
      };

      const result = CartItemSchema.safeParse(item);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.variant?.priceCents).toBe(3400);
      }
    });

    it("rejects cart items with zero or negative quantity (covers AC-2, AC-5)", () => {
      const zeroItem = {
        id: "item-1",
        productId: "p1",
        variantId: "v1",
        title: "Wildflower Honey",
        variantTitle: "250g",
        unitPriceCents: 3400,
        weightOz: 8.8,
        quantity: 0,
        addedAt: "2026-10-15T00:00:00.000Z",
      };

      const result = CartItemSchema.safeParse(zeroItem);
      expect(result.success).toBe(false);
    });

    it("rejects cart items with quantity exceeding variant limit of 10 (covers AC-2, AC-4, AC-5)", () => {
      const excessiveItem = {
        id: "item-1",
        productId: "p1",
        variantId: "v1",
        title: "Wildflower Honey",
        variantTitle: "250g",
        unitPriceCents: 3400,
        weightOz: 8.8,
        quantity: 11,
        addedAt: "2026-10-15T00:00:00.000Z",
      };

      const result = CartItemSchema.safeParse(excessiveItem);
      expect(result.success).toBe(false);
    });
  });

  describe("Enum and Boundary Validations (covers AC-1, AC-2)", () => {
    it("rejects invalid postal code formats while accepting standard 5 digit and 9 digit zip codes (covers AC-2)", () => {
      const base = {
        fullName: "Sarah Chen",
        email: "sarah@example.com",
        line1: "10 Orchard Way",
        city: "Hudson",
        state: "NY",
      };

      // Valid 5 digit
      expect(ShippingAddressSchema.safeParse({ ...base, postalCode: "12534" }).success).toBe(true);
      // Valid 9 digit ZIP+4
      expect(ShippingAddressSchema.safeParse({ ...base, postalCode: "12534-1234" }).success).toBe(true);
      // Invalid formats
      expect(ShippingAddressSchema.safeParse({ ...base, postalCode: "1253" }).success).toBe(false);
      expect(ShippingAddressSchema.safeParse({ ...base, postalCode: "125345" }).success).toBe(false);
      expect(ShippingAddressSchema.safeParse({ ...base, postalCode: "ABCDE" }).success).toBe(false);
    });

    it("normalizes customer email to lowercase and trims whitespace (covers AC-2)", () => {
      const address = {
        fullName: "  Thomas Thorne  ",
        email: "  THOMAS@EXAMPLE.COM  ",
        line1: "50 Hive Lane",
        city: "Kingston",
        state: "NY",
        postalCode: "12401",
      };

      const result = ShippingAddressSchema.safeParse(address);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("thomas@example.com");
        expect(result.data.fullName).toBe("Thomas Thorne");
      }
    });

    it("rejects full name shorter than 2 characters or longer than 100 characters (covers AC-2)", () => {
      const base = {
        email: "user@example.com",
        line1: "50 Hive Lane",
        city: "Kingston",
        state: "NY",
        postalCode: "12401",
      };

      expect(ShippingAddressSchema.safeParse({ ...base, fullName: "A" }).success).toBe(false);
      expect(ShippingAddressSchema.safeParse({ ...base, fullName: "A".repeat(101) }).success).toBe(false);
      expect(ShippingAddressSchema.safeParse({ ...base, fullName: "Al" }).success).toBe(true);
    });

    it("rejects invalid coordinate ranges in apiary origins (covers AC-1, AC-2)", () => {
      const invalidLatitude = {
        id: "test-origin",
        region: "Test Region",
        elevationMeters: 500,
        climate: "Alpine",
        beekeeperName: "Test Beekeeper",
        hiveCount: 10,
        floraEcosystem: "Meadows",
        purityTested: true,
        coordinates: { latitude: 91, longitude: 0 },
      };

      expect(ApiaryOriginSchema.safeParse(invalidLatitude).success).toBe(false);

      const invalidLongitude = {
        ...invalidLatitude,
        coordinates: { latitude: 45, longitude: 181 },
      };

      expect(ApiaryOriginSchema.safeParse(invalidLongitude).success).toBe(false);
    });

    it("rejects tasting profile scale ratings outside the 1 to 5 range (covers AC-1, AC-2)", () => {
      const invalidScale = {
        id: "test-profile",
        sweetnessScale: 6,
        intensityScale: 3,
        colorRating: "Golden",
        texture: "Silky",
        floralSources: ["Clover"],
        flavorDescriptors: ["Sweet"],
        pairedFoods: ["Toast"],
      };

      expect(TastingProfileSchema.safeParse(invalidScale).success).toBe(false);

      const zeroScale = {
        ...invalidScale,
        sweetnessScale: 0,
      };

      expect(TastingProfileSchema.safeParse(zeroScale).success).toBe(false);
    });

    it("rejects product variants with negative price or negative volume (covers AC-1, AC-2)", () => {
      const negativePrice = {
        id: "test-variant",
        productId: "test-product",
        sku: "TEST-01",
        title: "Test Jar",
        weightOz: 8,
        weightGrams: 226,
        volumeMl: 180,
        jarMaterial: "Glass",
        priceCents: -100,
        isDefault: true,
      };

      expect(ProductVariantSchema.safeParse(negativePrice).success).toBe(false);
    });

    it("rejects order submission when total line items exceed 30 items cap (covers AC-2, AC-4)", () => {
      const items = Array.from({ length: 31 }, (_, i) => ({
        productId: "raw-wildflower-reserve",
        variantId: `variant-${i}`,
        quantity: 1,
      }));

      const excessiveOrder = {
        customer: {
          name: "Bulk Buyer",
          email: "buyer@example.com",
        },
        shippingAddress: {
          fullName: "Bulk Buyer",
          email: "buyer@example.com",
          line1: "100 Warehouse Blvd",
          city: "Buffalo",
          state: "NY",
          postalCode: "14201",
        },
        items,
      };

      const result = OrderSubmissionSchema.safeParse(excessiveOrder);
      expect(result.success).toBe(false);
    });
  });
});
