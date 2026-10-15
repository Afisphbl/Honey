import { describe, it, expect } from "vitest";
import { POST } from "../route";

describe("POST /api/orders Route Handler (satisfies AC-2, AC-6)", () => {
  it("processes a valid order submission, recomputes authoritative prices, and returns confirmed receipt (AC-6)", async () => {
    const payload = {
      customer: {
        name: "Julian Thorne",
        email: "julian@catskillapiary.org",
      },
      shippingAddress: {
        fullName: "Julian Thorne",
        email: "julian@catskillapiary.org",
        line1: "12 Meadow Lane",
        city: "Woodstock",
        state: "NY",
        postalCode: "12498",
        country: "US",
      },
      items: [
        {
          productId: "raw-wildflower-reserve",
          variantId: "raw-wildflower-reserve-250g", // $34.00 each
          quantity: 2,
        },
      ],
      expectedSubtotalCents: 6800, // 2 * 3400
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.order).toBeDefined();
    expect(data.order.id).toMatch(/^ORD-\d+-[A-Z0-9]+$/);
    expect(data.order.orderNumber).toMatch(/^HNY-\d{5}$/);
    expect(data.order.status).toBe("confirmed");
    expect(data.order.subtotalCents).toBe(6800);
    expect(data.order.shippingFeeCents).toBe(0); // Free shipping over $50
    expect(data.order.totalCents).toBe(6800);
    expect(data.order.items).toHaveLength(1);
    expect(data.order.items[0].title).toBe("Raw Wildflower Reserve");
    expect(data.order.items[0].unitPriceCents).toBe(3400);
  });

  it("calculates shipping fee when subtotal is below $50 threshold", async () => {
    const payload = {
      customer: {
        name: "Julian Thorne",
        email: "julian@catskillapiary.org",
      },
      shippingAddress: {
        fullName: "Julian Thorne",
        email: "julian@catskillapiary.org",
        line1: "12 Meadow Lane",
        city: "Woodstock",
        state: "NY",
        postalCode: "12498",
        country: "US",
      },
      items: [
        {
          productId: "raw-wildflower-reserve",
          variantId: "raw-wildflower-reserve-250g", // $34.00
          quantity: 1,
        },
      ],
      expectedSubtotalCents: 3400,
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.order.subtotalCents).toBe(3400);
    expect(data.order.shippingFeeCents).toBe(800);
    expect(data.order.totalCents).toBe(4200);
  });

  it("returns HTTP 422 when client submitted expected total mismatches server catalog prices (AC-6)", async () => {
    const tamperedPayload = {
      customer: {
        name: "Tamperer",
        email: "tamper@example.com",
      },
      shippingAddress: {
        fullName: "Tamperer",
        email: "tamper@example.com",
        line1: "123 Fraud Lane",
        city: "Albany",
        state: "NY",
        postalCode: "12207",
        country: "US",
      },
      items: [
        {
          productId: "raw-wildflower-reserve",
          variantId: "raw-wildflower-reserve-250g", // Actually 3400 cents
          quantity: 1,
        },
      ],
      expectedSubtotalCents: 100, // Attempting to pay $1.00
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tamperedPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(422);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Price mismatch detected");
    expect(data.serverSubtotalCents).toBe(3400);
    expect(data.expectedSubtotalCents).toBe(100);
  });

  it("returns HTTP 422 when submitting non-existent product or variant ID", async () => {
    const payload = {
      customer: {
        name: "Julian Thorne",
        email: "julian@catskillapiary.org",
      },
      shippingAddress: {
        fullName: "Julian Thorne",
        email: "julian@catskillapiary.org",
        line1: "12 Meadow Lane",
        city: "Woodstock",
        state: "NY",
        postalCode: "12498",
        country: "US",
      },
      items: [
        {
          productId: "raw-wildflower-reserve",
          variantId: "fake-variant-999",
          quantity: 1,
        },
      ],
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(422);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("was not found in the catalog");
  });

  it("returns HTTP 400 on malformed schema or invalid email (AC-2)", async () => {
    const invalidPayload = {
      customer: {
        name: "J", // Too short (min 2)
        email: "not-an-email",
      },
      shippingAddress: {
        fullName: "J",
        email: "not-an-email",
        line1: "1", // Too short (min 3)
        city: "W",
        state: "INVALID", // Not a 2 letter state
        postalCode: "99",
      },
      items: [], // Empty items
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.details).toBeDefined();
  });

  it("returns HTTP 400 on non-JSON body", async () => {
    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json-content",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid JSON request body");
  });

  it("returns HTTP 422 when variant ID belongs to a different product ID (covers AC-6)", async () => {
    const mismatchedPayload = {
      customer: {
        name: "Julian Thorne",
        email: "julian@catskillapiary.org",
      },
      shippingAddress: {
        fullName: "Julian Thorne",
        email: "julian@catskillapiary.org",
        line1: "12 Meadow Lane",
        city: "Woodstock",
        state: "NY",
        postalCode: "12498",
        country: "US",
      },
      items: [
        {
          productId: "pure-acacia-blossom", // Mismatched product
          variantId: "raw-wildflower-reserve-250g", // Belongs to raw-wildflower-reserve
          quantity: 1,
        },
      ],
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mismatchedPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(422);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("was not found in the catalog");
  });

  it("returns HTTP 400 when shipping address has an invalid two letter US state code (covers AC-2, AC-6)", async () => {
    const invalidStatePayload = {
      customer: {
        name: "Julian Thorne",
        email: "julian@catskillapiary.org",
      },
      shippingAddress: {
        fullName: "Julian Thorne",
        email: "julian@catskillapiary.org",
        line1: "12 Meadow Lane",
        city: "Woodstock",
        state: "ZZ", // Invalid state
        postalCode: "12498",
        country: "US",
      },
      items: [
        {
          productId: "raw-wildflower-reserve",
          variantId: "raw-wildflower-reserve-250g",
          quantity: 1,
        },
      ],
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidStatePayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.details).toBeDefined();
  });

  it("returns HTTP 400 when order item quantity exceeds maximum limit of 10 jars (covers AC-2, AC-6)", async () => {
    const excessiveQuantityPayload = {
      customer: {
        name: "Julian Thorne",
        email: "julian@catskillapiary.org",
      },
      shippingAddress: {
        fullName: "Julian Thorne",
        email: "julian@catskillapiary.org",
        line1: "12 Meadow Lane",
        city: "Woodstock",
        state: "NY",
        postalCode: "12498",
        country: "US",
      },
      items: [
        {
          productId: "raw-wildflower-reserve",
          variantId: "raw-wildflower-reserve-250g",
          quantity: 11, // Exceeds 10 limit
        },
      ],
    };

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(excessiveQuantityPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
  });
});
