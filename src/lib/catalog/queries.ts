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

export type CatalogSortOption =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "intensity";

export interface CatalogFilterOptions {
  category?: ProductCategory | "all";
  categories?: ProductCategory[];
  inStockOnly?: boolean;
  sortBy?: CatalogSortOption;
}

function attachRelations(product: Product): ProductWithRelations | null {
  const origin = APIARY_ORIGINS.find((o) => o.id === product.originId);
  const tastingProfile = TASTING_PROFILES.find(
    (t) => t.id === product.tastingProfileId
  );
  const variants = PRODUCT_VARIANTS.filter((v) => v.productId === product.id);

  if (!origin || !tastingProfile) {
    return null;
  }

  const includedProducts = product.includedProductIds
    ? PRODUCTS.filter((p) => product.includedProductIds?.includes(p.id))
    : undefined;

  return {
    ...product,
    origin,
    tastingProfile,
    variants,
    includedProducts,
  };
}

export function getProductDisplayPrice(product: ProductWithRelations): {
  minPriceCents: number;
  maxPriceCents: number;
  defaultPriceCents: number;
  compareAtPriceCents?: number;
} {
  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const prices = product.variants.map((v) => v.priceCents);
  const minPriceCents = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPriceCents = prices.length > 0 ? Math.max(...prices) : 0;
  const defaultPriceCents = defaultVariant ? defaultVariant.priceCents : 0;
  const compareAtPriceCents = defaultVariant?.compareAtPriceCents;

  return {
    minPriceCents,
    maxPriceCents,
    defaultPriceCents,
    compareAtPriceCents,
  };
}

export function filterAndSortProducts(
  products: ProductWithRelations[],
  filter?: CatalogFilterOptions
): ProductWithRelations[] {
  let matched = [...products];

  if (filter?.category && filter.category !== "all") {
    matched = matched.filter((p) => p.category === filter.category);
  }

  if (filter?.categories && filter.categories.length > 0) {
    matched = matched.filter((p) => filter.categories?.includes(p.category));
  }

  if (filter?.inStockOnly) {
    matched = matched.filter(
      (p) =>
        p.inventoryStatus === "in_stock" ||
        p.inventoryStatus === "limited_reserve"
    );
  }

  if (filter?.sortBy) {
    switch (filter.sortBy) {
      case "price_asc":
        matched.sort((a, b) => {
          const priceA = getProductDisplayPrice(a).defaultPriceCents;
          const priceB = getProductDisplayPrice(b).defaultPriceCents;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        matched.sort((a, b) => {
          const priceA = getProductDisplayPrice(a).defaultPriceCents;
          const priceB = getProductDisplayPrice(b).defaultPriceCents;
          return priceB - priceA;
        });
        break;
      case "intensity":
        matched.sort((a, b) => {
          const diff =
            b.tastingProfile.intensityScale - a.tastingProfile.intensityScale;
          if (diff !== 0) return diff;
          return (
            b.tastingProfile.sweetnessScale - a.tastingProfile.sweetnessScale
          );
        });
        break;
      case "featured":
      default:
        matched.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
        break;
    }
  }

  return matched;
}

export function getAllProducts(
  filter?: CatalogFilterOptions
): ProductWithRelations[] {
  const withRelations = PRODUCTS.map((product) => attachRelations(product)).filter(
    (p): p is ProductWithRelations => p !== null
  );

  return filterAndSortProducts(withRelations, filter);
}

export function getCategoryCounts(options?: {
  inStockOnly?: boolean;
}): Record<ProductCategory | "all", number> {
  const all = getAllProducts({ inStockOnly: options?.inStockOnly });

  const counts: Record<ProductCategory | "all", number> = {
    all: all.length,
    single_origin: 0,
    seasonal_reserve: 0,
    infusion: 0,
    raw_comb: 0,
    bundle: 0,
  };

  for (const product of all) {
    if (product.category in counts) {
      counts[product.category]++;
    }
  }

  return counts;
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
