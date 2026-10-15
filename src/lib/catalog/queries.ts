import {
  APIARY_ORIGINS,
  PRODUCTS,
  PRODUCT_VARIANTS,
  TASTING_PROFILES,
} from "./data";
import {
  Product,
  ProductCategory,
  ProductVariant,
  ProductWithRelations,
} from "@/types/catalog";

function attachRelations(product: Product): ProductWithRelations | null {
  const origin = APIARY_ORIGINS.find((o) => o.id === product.originId);
  const tastingProfile = TASTING_PROFILES.find(
    (t) => t.id === product.tastingProfileId
  );
  const variants = PRODUCT_VARIANTS.filter((v) => v.productId === product.id);

  if (!origin || !tastingProfile) {
    return null;
  }

  return {
    ...product,
    origin,
    tastingProfile,
    variants,
  };
}

export function getProductById(id: string): ProductWithRelations | null {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return null;
  return attachRelations(product);
}

export function getProductBySlug(slug: string): ProductWithRelations | null {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  return attachRelations(product);
}

export function getAllProducts(filter?: {
  category?: ProductCategory;
  inStockOnly?: boolean;
}): ProductWithRelations[] {
  let matched = PRODUCTS;

  if (filter?.category) {
    matched = matched.filter((p) => p.category === filter.category);
  }

  if (filter?.inStockOnly) {
    matched = matched.filter(
      (p) =>
        p.inventoryStatus === "in_stock" ||
        p.inventoryStatus === "limited_reserve"
    );
  }

  return matched
    .map((product) => attachRelations(product))
    .filter((p): p is ProductWithRelations => p !== null);
}

export function getFeaturedProduct(): ProductWithRelations | null {
  const featured = PRODUCTS.find((p) => p.isFeatured);
  if (!featured) return null;
  return attachRelations(featured);
}

export function getVariantById(
  variantId: string
): { variant: ProductVariant; product: Product } | null {
  const variant = PRODUCT_VARIANTS.find((v) => v.id === variantId);
  if (!variant) return null;

  const product = PRODUCTS.find((p) => p.id === variant.productId);
  if (!product) return null;

  return { variant, product };
}
