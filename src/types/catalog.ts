/**
 * Domain entity types and interfaces for the Honey artisanal catalog and commerce.
 * Defined in spec 0002: docs/specs/0002-data-model.md
 */

export type ProductCategory =
  | "single_origin"
  | "seasonal_reserve"
  | "infusion"
  | "raw_comb"
  | "bundle";

export type InventoryStatus =
  | "in_stock"
  | "limited_reserve"
  | "out_of_season"
  | "sold_out";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "fulfilled"
  | "cancelled";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ApiaryOrigin {
  id: string;
  region: string;
  elevationMeters: number;
  climate: string;
  beekeeperName: string;
  hiveCount: number;
  floraEcosystem: string;
  purityTested: boolean;
  coordinates: Coordinates;
}

export interface TastingProfile {
  id: string;
  sweetnessScale: number; // 1 to 5
  intensityScale: number; // 1 to 5
  colorRating: string;
  texture: string;
  floralSources: string[];
  flavorDescriptors: string[];
  pairedFoods: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  weightOz: number;
  weightGrams: number;
  volumeMl: number;
  jarMaterial: string;
  priceCents: number;
  compareAtPriceCents?: number;
  isDefault: boolean;
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  harvestYear: number;
  batchNumber: string;
  inventoryStatus: InventoryStatus;
  isFeatured: boolean;
  frameStartIndex: number;
  frameEndIndex: number;
  heroPosterUrl: string;
  originId: string;
  tastingProfileId: string;
  includedProductIds?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithRelations extends Product {
  origin: ApiaryOrigin;
  tastingProfile: TastingProfile;
  variants: ProductVariant[];
  includedProducts?: Product[];
}

export interface LegacyCartVariant {
  size: string;
  weightOz: number;
  priceCents: number;
}

export interface CartItem {
  id: string; // Matches variantId
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  unitPriceCents: number;
  weightOz: number;
  imageUrl?: string;
  quantity: number;
  addedAt: string;
  // Optional backwards compatibility property for existing components
  variant?: LegacyCartVariant;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderSubmissionItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface OrderSubmission {
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: ShippingAddress;
  items: OrderSubmissionItem[];
  giftPackaging?: boolean;
  giftNote?: string;
  deliveryInstructions?: string;
  paymentMethod?: "simulated_card" | "apiary_reserve_credit";
  cardLast4?: string;
  expectedSubtotalCents?: number;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: ShippingAddress;
  items: CartItem[];
  giftPackaging?: boolean;
  giftNote?: string;
  deliveryInstructions?: string;
  paymentMethod?: "simulated_card" | "apiary_reserve_credit";
  cardLast4?: string;
  paymentStatus?: "paid" | "pending";
  subtotalCents: number;
  shippingFeeCents: number;
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderTotals {
  subtotalCents: number;
  shippingFeeCents: number;
  totalCents: number;
}

export type HarvestSeason = "spring" | "summer" | "autumn" | "winter";

export type HoneyAvailabilityStatus =
  | "harvesting"
  | "aging"
  | "reserve"
  | "dormant";

export interface SeasonalCyclePhase {
  id: string;
  season: HarvestSeason;
  title: string;
  timeframeMonths: string;
  apicultureActivity: string;
  activeFlora: string[];
  honeyAvailability: HoneyAvailabilityStatus;
  featuredProductIds?: string[];
  storyExcerpt: string;
}

export interface PurityStandard {
  id: string;
  name: string;
  verificationMetric: string;
  testingMethod: string;
  issuingAuthority: string;
  thresholdRequirement: string;
  description: string;
  badgeIcon: string;
}

export type PledgeCategory =
  | "hive_welfare"
  | "raw_purity"
  | "terroir_conservation"
  | "fair_trade";

export interface BeekeepingPledge {
  id: string;
  title: string;
  category: PledgeCategory;
  statement: string;
  details: string;
  badgeIcon: string;
}

export interface ApiaryOriginDetail extends ApiaryOrigin {
  products: Product[];
}
