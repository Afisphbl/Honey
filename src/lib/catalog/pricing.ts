import { OrderTotals } from "@/types/catalog";

export const MAX_QUANTITY_PER_VARIANT = 10;
export const MAX_TOTAL_CART_ITEMS = 30;
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // $50.00
export const STANDARD_SHIPPING_FEE_CENTS = 800; // $8.00

export interface LineItemPricingInput {
  unitPriceCents?: number;
  quantity: number;
  variant?: {
    priceCents: number;
  };
}

/**
 * Computes line total cents for an item quantity.
 * Clamps quantity to maximum allowable per variant (10).
 */
export function calculateLineTotal(
  unitPriceCents: number,
  quantity: number
): number {
  if (unitPriceCents < 0) {
    throw new Error("Unit price cannot be negative");
  }
  const safeQuantity = Math.max(0, Math.min(quantity, MAX_QUANTITY_PER_VARIANT));
  return Math.round(unitPriceCents * safeQuantity);
}

/**
 * Validates whether the item quantities observe individual and total cart bounds.
 */
export function validateCartLimits(
  items: Array<{ quantity: number }>
): { valid: boolean; error?: string } {
  let totalCount = 0;

  for (const item of items) {
    if (item.quantity < 1) {
      return {
        valid: false,
        error: "Item quantity must be at least 1",
      };
    }
    if (item.quantity > MAX_QUANTITY_PER_VARIANT) {
      return {
        valid: false,
        error: `Cannot exceed ${MAX_QUANTITY_PER_VARIANT} jars per item`,
      };
    }
    totalCount += item.quantity;
  }

  if (totalCount > MAX_TOTAL_CART_ITEMS) {
    return {
      valid: false,
      error: `Cart cannot exceed ${MAX_TOTAL_CART_ITEMS} items total`,
    };
  }

  return { valid: true };
}

/**
 * Computes deterministic order totals: subtotal, shipping fee, and total.
 * Returns zeros across all fields if items array is empty.
 */
export function calculateOrderTotals(
  items: LineItemPricingInput[]
): OrderTotals {
  if (!items || items.length === 0) {
    return {
      subtotalCents: 0,
      shippingFeeCents: 0,
      totalCents: 0,
    };
  }

  let subtotalCents = 0;

  for (const item of items) {
    const price = item.unitPriceCents ?? item.variant?.priceCents ?? 0;
    const lineTotal = calculateLineTotal(price, item.quantity);
    subtotalCents += lineTotal;
  }

  if (subtotalCents === 0) {
    return {
      subtotalCents: 0,
      shippingFeeCents: 0,
      totalCents: 0,
    };
  }

  const shippingFeeCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
      ? 0
      : STANDARD_SHIPPING_FEE_CENTS;

  const totalCents = subtotalCents + shippingFeeCents;

  return {
    subtotalCents,
    shippingFeeCents,
    totalCents,
  };
}

/**
 * Formats integer cents into standard USD string representation.
 * e.g. 3400 -> "$34.00"
 */
export function formatCurrencyCents(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

export const formatCentsToDollars = formatCurrencyCents;
