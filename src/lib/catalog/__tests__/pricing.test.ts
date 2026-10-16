import { describe, it, expect } from "vitest";
import {
  calculateLineTotal,
  calculateOrderTotals,
  formatCurrencyCents,
  FREE_SHIPPING_THRESHOLD_CENTS,
  MAX_QUANTITY_PER_VARIANT,
  STANDARD_SHIPPING_FEE_CENTS,
  validateCartLimits,
} from "../pricing";

describe("Pricing and Shipping Calculations (satisfies AC-4)", () => {
  it("calculates accurate line total for single item and quantity", () => {
    expect(calculateLineTotal(3400, 1)).toBe(3400);
    expect(calculateLineTotal(3400, 3)).toBe(10200);
  });

  it("clamps quantity to MAX_QUANTITY_PER_VARIANT in calculateLineTotal", () => {
    expect(calculateLineTotal(2000, 15)).toBe(
      2000 * MAX_QUANTITY_PER_VARIANT
    );
  });

  it("throws error if unit price is negative", () => {
    expect(() => calculateLineTotal(-500, 1)).toThrow(
      "Unit price cannot be negative"
    );
  });

  it("returns strictly zero subtotal, shipping fee, and total for empty cart (AC-4)", () => {
    const totals = calculateOrderTotals([]);
    expect(totals).toEqual({
      subtotalCents: 0,
      shippingFeeCents: 0,
      totalCents: 0,
    });
  });

  it("adds standard shipping fee when subtotal is below $50 threshold", () => {
    // 1 jar of $34.00 = 3400 cents
    const totals = calculateOrderTotals([
      {
        unitPriceCents: 3400,
        quantity: 1,
      },
    ]);

    expect(totals.subtotalCents).toBe(3400);
    expect(totals.shippingFeeCents).toBe(STANDARD_SHIPPING_FEE_CENTS);
    expect(totals.totalCents).toBe(3400 + STANDARD_SHIPPING_FEE_CENTS);
  });

  it("grants free shipping when subtotal reaches or exceeds $50 threshold", () => {
    // 2 jars of $34.00 = 6800 cents >= 5000 cents
    const totals = calculateOrderTotals([
      {
        unitPriceCents: 3400,
        quantity: 2,
      },
    ]);

    expect(totals.subtotalCents).toBe(6800);
    expect(totals.shippingFeeCents).toBe(0);
    expect(totals.totalCents).toBe(6800);
  });

  it("grants free shipping at exact $50 threshold (5000 cents)", () => {
    const totals = calculateOrderTotals([
      {
        unitPriceCents: 2500,
        quantity: 2,
      },
    ]);

    expect(totals.subtotalCents).toBe(FREE_SHIPPING_THRESHOLD_CENTS);
    expect(totals.shippingFeeCents).toBe(0);
    expect(totals.totalCents).toBe(5000);
  });

  it("charges standard shipping fee at boundary of $49.99 (4999 cents) (covers AC-4)", () => {
    const totals = calculateOrderTotals([
      {
        unitPriceCents: 4999,
        quantity: 1,
      },
    ]);

    expect(totals.subtotalCents).toBe(4999);
    expect(totals.shippingFeeCents).toBe(STANDARD_SHIPPING_FEE_CENTS);
    expect(totals.totalCents).toBe(4999 + STANDARD_SHIPPING_FEE_CENTS);
  });

  it("falls back to variant priceCents when unitPriceCents is undefined (covers AC-4)", () => {
    const totals = calculateOrderTotals([
      {
        quantity: 2,
        variant: {
          priceCents: 1500,
        },
      },
    ]);

    expect(totals.subtotalCents).toBe(3000);
    expect(totals.shippingFeeCents).toBe(STANDARD_SHIPPING_FEE_CENTS);
    expect(totals.totalCents).toBe(3800);
  });

  it("returns zero shipping fee when calculated subtotal is zero (covers AC-4)", () => {
    const totals = calculateOrderTotals([
      {
        unitPriceCents: 0,
        quantity: 5,
      },
    ]);

    expect(totals.subtotalCents).toBe(0);
    expect(totals.shippingFeeCents).toBe(0);
    expect(totals.totalCents).toBe(0);
  });

  it("validates cart limits and detects out-of-range quantities (covers AC-4)", () => {
    // Valid item
    expect(validateCartLimits([{ quantity: 5 }]).valid).toBe(true);

    // Quantity zero or less
    expect(validateCartLimits([{ quantity: 0 }]).valid).toBe(false);

    // Quantity exceeding 10 per variant
    expect(validateCartLimits([{ quantity: 11 }]).valid).toBe(false);

    // Exact boundary of 30 items is valid
    const validBoundary = [
      { quantity: 10 },
      { quantity: 10 },
      { quantity: 10 },
    ];
    expect(validateCartLimits(validBoundary).valid).toBe(true);

    // Total cart items exceeding 30
    const items = [
      { quantity: 10 },
      { quantity: 10 },
      { quantity: 10 },
      { quantity: 1 },
    ];
    const result = validateCartLimits(items);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Cart cannot exceed 30 items total");
  });

  it("formats integer cents into formatted USD currency string (covers AC-4)", () => {
    expect(formatCurrencyCents(3400)).toBe("$34.00");
    expect(formatCurrencyCents(0)).toBe("$0.00");
    expect(formatCurrencyCents(850)).toBe("$8.50");
    expect(formatCurrencyCents(12500)).toBe("$125.00");
  });
});
