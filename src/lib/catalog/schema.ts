import { z } from "zod";

export const US_STATE_CODES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC"
] as const;

export type USStateCode = (typeof US_STATE_CODES)[number];

export const ProductCategorySchema = z.enum([
  "single_origin",
  "seasonal_reserve",
  "infusion",
  "raw_comb",
  "bundle",
]);

export const InventoryStatusSchema = z.enum([
  "in_stock",
  "limited_reserve",
  "out_of_season",
  "sold_out",
]);

export const OrderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "fulfilled",
  "cancelled",
]);

export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const ApiaryOriginSchema = z.object({
  id: z.string().min(1, "Origin ID is required"),
  region: z.string().min(1, "Region is required"),
  elevationMeters: z.number().int().nonnegative(),
  climate: z.string().min(1, "Climate description is required"),
  beekeeperName: z.string().min(1, "Beekeeper name is required"),
  hiveCount: z.number().int().positive(),
  floraEcosystem: z.string().min(1, "Flora ecosystem is required"),
  purityTested: z.boolean(),
  coordinates: CoordinatesSchema,
});

export const TastingProfileSchema = z.object({
  id: z.string().min(1, "Tasting profile ID is required"),
  sweetnessScale: z.number().int().min(1).max(5),
  intensityScale: z.number().int().min(1).max(5),
  colorRating: z.string().min(1, "Color rating is required"),
  texture: z.string().min(1, "Texture description is required"),
  floralSources: z.array(z.string().min(1)).min(1, "At least one floral source is required"),
  flavorDescriptors: z.array(z.string().min(1)).min(1, "At least one flavor descriptor is required"),
  pairedFoods: z.array(z.string().min(1)).min(1, "At least one paired food is required"),
});

export const ProductVariantSchema = z.object({
  id: z.string().min(1, "Variant ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  sku: z.string().min(1, "SKU is required"),
  title: z.string().min(1, "Variant title is required"),
  weightOz: z.number().positive("Weight in ounces must be positive"),
  weightGrams: z.number().positive("Weight in grams must be positive"),
  volumeMl: z.number().positive("Volume in ml must be positive"),
  jarMaterial: z.string().min(1, "Jar material is required"),
  priceCents: z.number().int().nonnegative("Price in cents must be non negative"),
  compareAtPriceCents: z.number().int().nonnegative().optional(),
  isDefault: z.boolean(),
  imageUrl: z.string().optional(),
});

export const ProductSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  category: ProductCategorySchema,
  harvestYear: z.number().int().min(2000).max(2100),
  batchNumber: z.string().min(1, "Batch number is required"),
  inventoryStatus: InventoryStatusSchema,
  isFeatured: z.boolean(),
  frameStartIndex: z.number().int().min(0).max(149),
  frameEndIndex: z.number().int().min(0).max(149),
  heroPosterUrl: z.string().min(1, "Hero poster URL is required"),
  originId: z.string().min(1, "Origin ID is required"),
  tastingProfileId: z.string().min(1, "Tasting profile ID is required"),
  includedProductIds: z.array(z.string().min(1)).optional(),
  imageUrl: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const LegacyCartVariantSchema = z.object({
  size: z.string().min(1),
  weightOz: z.number().positive(),
  priceCents: z.number().int().nonnegative(),
});

export const CartItemSchema = z
  .object({
    id: z.string().min(1, "Cart item ID is required"),
    productId: z.string().min(1, "Product ID is required"),
    variantId: z.string().min(1, "Variant ID is required"),
    title: z.string().min(1, "Title is required"),
    variantTitle: z.string().min(1, "Variant title is required"),
    unitPriceCents: z.number().int().nonnegative("Unit price must be non negative"),
    weightOz: z.number().positive("Weight in ounces must be positive"),
    imageUrl: z.string().optional(),
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Quantity cannot exceed 10"),
    addedAt: z.string().min(1),
    variant: LegacyCartVariantSchema.optional(),
  })
  .transform((item) => ({
    ...item,
    variant: item.variant ?? {
      size: item.variantTitle,
      weightOz: item.weightOz,
      priceCents: item.unitPriceCents,
    },
  }));

export const ShippingAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .toLowerCase(),
  line1: z
    .string()
    .trim()
    .min(3, "Street address must be at least 3 characters")
    .max(120, "Street address cannot exceed 120 characters"),
  line2: z
    .string()
    .trim()
    .max(120, "Line 2 cannot exceed 120 characters")
    .optional(),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(60, "City cannot exceed 60 characters"),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .refine((val) => US_STATE_CODES.includes(val as USStateCode), {
      message: "State must be a valid two letter US state code",
    }),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Postal code must be a 5-digit ZIP or 9-digit ZIP+4 code"),
  country: z
    .string()
    .trim()
    .default("US"),
});

export const OrderSubmissionItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Quantity cannot exceed 10"),
});

export const OrderSubmissionSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Customer name must be at least 2 characters").max(100),
    email: z.string().trim().email("Invalid customer email address").toLowerCase(),
  }),
  shippingAddress: ShippingAddressSchema,
  items: z
    .array(OrderSubmissionItemSchema)
    .min(1, "Order must contain at least one item")
    .max(30, "Order cannot exceed 30 items total"),
  expectedSubtotalCents: z.number().int().nonnegative().optional(),
});

export const OrderSummarySchema = z.object({
  id: z.string().min(1, "Order ID is required"),
  orderNumber: z.string().min(1, "Order number is required"),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
  shippingAddress: ShippingAddressSchema,
  items: z.array(CartItemSchema),
  subtotalCents: z.number().int().nonnegative(),
  shippingFeeCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
  status: OrderStatusSchema,
  createdAt: z.string().min(1),
});
