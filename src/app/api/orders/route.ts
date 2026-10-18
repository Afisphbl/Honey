import { NextResponse } from "next/server";
import { OrderSubmissionSchema, OrderSummarySchema } from "@/lib/catalog/schema";
import { getVariantById } from "@/lib/catalog/queries";
import { calculateOrderTotals } from "@/lib/catalog/pricing";
import { CartItem, OrderSummary } from "@/types/catalog";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body",
        },
        { status: 400 }
      );
    }

    const parseResult = OrderSubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order submission payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const submission = parseResult.data;
    const validatedItems: CartItem[] = [];

    for (const item of submission.items) {
      const match = getVariantById(item.variantId);

      if (!match || match.product.id !== item.productId) {
        return NextResponse.json(
          {
            success: false,
            error: `Product variant with ID ${item.variantId} was not found in the catalog`,
          },
          { status: 422 }
        );
      }

      const { variant, product } = match;

      if (
        product.inventoryStatus === "out_of_season" ||
        product.inventoryStatus === "sold_out"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `${product.title} is currently unavailable for order`,
          },
          { status: 422 }
        );
      }

      const cartItem: CartItem = {
        id: variant.id,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantTitle: variant.title,
        unitPriceCents: variant.priceCents,
        weightOz: variant.weightOz,
        imageUrl: variant.imageUrl || product.imageUrl || "/frames/frame-001.webp",
        quantity: item.quantity,
        addedAt: new Date().toISOString(),
        variant: {
          size: variant.title,
          weightOz: variant.weightOz,
          priceCents: variant.priceCents,
        },
      };

      validatedItems.push(cartItem);
    }

    const totals = calculateOrderTotals(validatedItems);

    if (
      submission.expectedSubtotalCents !== undefined &&
      submission.expectedSubtotalCents !== totals.subtotalCents
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Price mismatch detected. Catalog prices have changed.",
          serverSubtotalCents: totals.subtotalCents,
          expectedSubtotalCents: submission.expectedSubtotalCents,
        },
        { status: 422 }
      );
    }

    const timestamp = Date.now();
    const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `ORD-${timestamp}-${randomKey}`;
    const orderNumber = `HNY-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderSummary: OrderSummary = {
      id: orderId,
      orderNumber,
      customer: submission.customer,
      shippingAddress: submission.shippingAddress,
      items: validatedItems,
      giftPackaging: submission.giftPackaging,
      giftNote: submission.giftNote,
      deliveryInstructions: submission.deliveryInstructions,
      paymentMethod: submission.paymentMethod || "simulated_card",
      cardLast4: submission.cardLast4,
      paymentStatus: "paid",
      subtotalCents: totals.subtotalCents,
      shippingFeeCents: totals.shippingFeeCents,
      totalCents: totals.totalCents,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const summaryValidation = OrderSummarySchema.safeParse(orderSummary);
    if (!summaryValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Internal error creating validated order receipt",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order: orderSummary,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
