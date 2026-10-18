"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCentsToDollars } from "@/lib/catalog/pricing";
import { ShippingAddressSchema, US_STATE_CODES } from "@/lib/catalog/schema";
import { OrderSummary, ShippingAddress } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Truck,
  Gift,
  ArrowLeft,
  Lock,
  Loader2,
  AlertCircle,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: (order: OrderSummary) => void;
  initialValues?: Partial<ShippingAddress>;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  cardNumber?: string;
  cardExp?: string;
  cardCvc?: string;
}

export function CheckoutForm({ onBack, onSuccess, initialValues }: CheckoutFormProps) {
  const items = useCartStore((state) => state.items);
  const getOrderTotals = useCartStore((state) => state.getOrderTotals);
  const totals = getOrderTotals();

  // Address fields
  const [fullName, setFullName] = useState(initialValues?.fullName || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [line1, setLine1] = useState(initialValues?.line1 || "");
  const [line2, setLine2] = useState(initialValues?.line2 || "");
  const [city, setCity] = useState(initialValues?.city || "");
  const [stateCode, setStateCode] = useState(initialValues?.state || "NY");
  const [postalCode, setPostalCode] = useState(initialValues?.postalCode || "");

  // Gifting and Courier instructions
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  // Payment simulation
  const [paymentMethod, setPaymentMethod] = useState<"simulated_card" | "apiary_reserve_credit">("simulated_card");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  // State management
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick test fill helper for effortless review and test driving
  const handleQuickFill = () => {
    setFullName("Julian Thorne");
    setEmail("julian@catskillapiary.org");
    setLine1("88 Hive Ridge Lane");
    setLine2("Apt 4B");
    setCity("Woodstock");
    setStateCode("NY");
    setPostalCode("12498");
    setGiftPackaging(true);
    setGiftNote("Complimentary wild lavender honey reserve for your seasonal culinary table.");
    setDeliveryInstructions("Please place parcel carefully in shaded cedar porch bin.");
    setCardNumber("4242 4242 4242 4242");
    setCardExp("12/28");
    setCardCvc("888");
    setErrors({});
    setServerError(null);
  };

  const validateForm = (): boolean => {
    const addressData = {
      fullName,
      email,
      line1,
      line2: line2 || undefined,
      city,
      state: stateCode,
      postalCode,
      country: "US",
    };

    const result = ShippingAddressSchema.safeParse(addressData);
    const newErrors: FormErrors = {};

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      if (fieldErrors.fullName?.[0]) newErrors.fullName = fieldErrors.fullName[0];
      if (fieldErrors.email?.[0]) newErrors.email = fieldErrors.email[0];
      if (fieldErrors.line1?.[0]) newErrors.line1 = fieldErrors.line1[0];
      if (fieldErrors.city?.[0]) newErrors.city = fieldErrors.city[0];
      if (fieldErrors.state?.[0]) newErrors.state = fieldErrors.state[0];
      if (fieldErrors.postalCode?.[0]) newErrors.postalCode = fieldErrors.postalCode[0];
    }

    if (paymentMethod === "simulated_card") {
      const cleanCard = cardNumber.replace(/\s+/g, "");
      if (cleanCard.length < 13 || cleanCard.length > 19) {
        newErrors.cardNumber = "Valid 16-digit card required";
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
        newErrors.cardExp = "Use MM/YY format";
      }
      if (!/^\d{3,4}$/.test(cardCvc)) {
        newErrors.cardCvc = "3 or 4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setServerError("Your cart is empty. Please add honey reserves before checking out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanDigits = cardNumber.replace(/\D/g, "");
      const cardLast4 = paymentMethod === "simulated_card" ? cleanDigits.slice(-4) || "4242" : undefined;

      const payload = {
        customer: {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
        },
        shippingAddress: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          line1: line1.trim(),
          line2: line2.trim() || undefined,
          city: city.trim(),
          state: stateCode.trim().toUpperCase(),
          postalCode: postalCode.trim(),
          country: "US",
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || item.id,
          quantity: item.quantity,
        })),
        giftPackaging,
        giftNote: giftNote.trim() || undefined,
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        paymentMethod,
        cardLast4,
        expectedSubtotalCents: totals.subtotalCents,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setServerError(
            `Price Update Notice: ${data.error || "Catalog prices were recently updated."} Your shipping details have been preserved.`
          );
        } else {
          setServerError(data.error || "An unexpected error occurred while placing your order.");
        }
        setIsSubmitting(false);
        return;
      }

      if (data.success && data.order) {
        onSuccess(data.order);
      } else {
        setServerError("Invalid order receipt returned by server.");
      }
    } catch {
      setServerError("Network connection interrupted. Please verify your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full space-y-6 pb-6 text-charcoal">
      {/* Top Navigation & Test Helper */}
      <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded px-1.5 py-1 cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to Reserve Bag</span>
        </button>

        <button
          type="button"
          onClick={handleQuickFill}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 px-2.5 py-1 rounded-full cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800"
        >
          <Sparkles size={11} aria-hidden="true" />
          <span>Quick Fill Demo</span>
        </button>
      </div>

      {/* Server Warning / Error Banner (AC-7) */}
      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs leading-relaxed"
        >
          <AlertCircle size={18} className="text-amber-800 shrink-0 mt-0.5" aria-hidden="true" />
          <div>{serverError}</div>
        </div>
      )}

      {/* Recipient and Shipping Address */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-amber-800" aria-hidden="true" />
          <h4 className="font-serif text-lg font-bold text-charcoal">Delivery Address</h4>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-charcoal/90 mb-1">
            Recipient Full Name <span className="text-amber-800">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Julian Thorne"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl bg-white/80 border text-sm text-charcoal focus:bg-white transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-1",
              errors.fullName ? "border-red-600 bg-red-50/20" : "border-amber-200 hover:border-amber-400"
            )}
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-[11px] text-red-700 mt-1 font-medium">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-charcoal/90 mb-1">
            Email for Order Receipt <span className="text-amber-800">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="julian@apiculture.org"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl bg-white/80 border text-sm text-charcoal focus:bg-white transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-1",
              errors.email ? "border-red-600 bg-red-50/20" : "border-amber-200 hover:border-amber-400"
            )}
          />
          {errors.email && (
            <p id="email-error" className="text-[11px] text-red-700 mt-1 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="line1" className="block text-xs font-semibold text-charcoal/90 mb-1">
            Street Address <span className="text-amber-800">*</span>
          </label>
          <input
            id="line1"
            type="text"
            required
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="88 Hive Ridge Lane"
            aria-invalid={!!errors.line1}
            aria-describedby={errors.line1 ? "line1-error" : undefined}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl bg-white/80 border text-sm text-charcoal focus:bg-white transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-1",
              errors.line1 ? "border-red-600 bg-red-50/20" : "border-amber-200 hover:border-amber-400"
            )}
          />
          {errors.line1 && (
            <p id="line1-error" className="text-[11px] text-red-700 mt-1 font-medium">
              {errors.line1}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="line2" className="block text-xs font-semibold text-charcoal/80 mb-1">
            Apartment, Suite, or Unit <span className="text-charcoal/50 text-[10px]">(Optional)</span>
          </label>
          <input
            id="line2"
            type="text"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Apt 4B"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-amber-200 hover:border-amber-400 text-sm text-charcoal focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 transition-all"
          />
        </div>

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-12 gap-2.5">
          <div className="col-span-5">
            <label htmlFor="city" className="block text-xs font-semibold text-charcoal/90 mb-1">
              City <span className="text-amber-800">*</span>
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Woodstock"
              aria-invalid={!!errors.city}
              className={cn(
                "w-full px-3 py-2 rounded-xl bg-white/80 border text-sm text-charcoal focus:bg-white transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800",
                errors.city ? "border-red-600 bg-red-50/20" : "border-amber-200 hover:border-amber-400"
              )}
            />
          </div>

          <div className="col-span-3">
            <label htmlFor="stateCode" className="block text-xs font-semibold text-charcoal/90 mb-1">
              State <span className="text-amber-800">*</span>
            </label>
            <select
              id="stateCode"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full px-2 py-2 rounded-xl bg-white/80 border border-amber-200 hover:border-amber-400 text-sm font-medium text-charcoal focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 cursor-pointer"
            >
              {US_STATE_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-4">
            <label htmlFor="postalCode" className="block text-xs font-semibold text-charcoal/90 mb-1">
              ZIP Code <span className="text-amber-800">*</span>
            </label>
            <input
              id="postalCode"
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="12498"
              aria-invalid={!!errors.postalCode}
              className={cn(
                "w-full px-3 py-2 rounded-xl bg-white/80 border text-sm text-charcoal focus:bg-white transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800",
                errors.postalCode ? "border-red-600 bg-red-50/20" : "border-amber-200 hover:border-amber-400"
              )}
            />
          </div>
        </div>
        {(errors.city || errors.state || errors.postalCode) && (
          <p className="text-[11px] text-red-700 font-medium">
            {errors.city || errors.state || errors.postalCode}
          </p>
        )}
      </div>

      {/* Gifting & Delivery Notes (AC-4) */}
      <div className="space-y-3.5 pt-2 border-t border-amber-200/70">
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-amber-800" aria-hidden="true" />
          <h4 className="font-serif text-lg font-bold text-charcoal">Artisanal Gifting Options</h4>
        </div>

        {/* Complimentary Botanical Gift Packaging Toggle */}
        <label className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 cursor-pointer hover:bg-amber-100/50 transition-colors">
          <input
            type="checkbox"
            checked={giftPackaging}
            onChange={(e) => setGiftPackaging(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-amber-300 text-amber-800 focus:ring-amber-800 cursor-pointer"
          />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-950 block">
              Complimentary Botanical Gift Packaging
            </span>
            <span className="text-charcoal/70 leading-relaxed block mt-0.5">
              Hand wrapped in unbleached parchment with an amber beeswax seal and organic cotton ribbon.
            </span>
          </div>
        </label>

        {/* Expandable Handwritten Gift Note */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="giftNote" className="text-xs font-semibold text-charcoal/90">
              Personalized Handwritten Card Note
            </label>
            <span
              className={cn(
                "text-[10px] font-mono",
                giftNote.length > 140 ? "text-amber-800 font-bold" : "text-charcoal/60"
              )}
            >
              {giftNote.length} / 150
            </span>
          </div>
          <textarea
            id="giftNote"
            rows={2}
            maxLength={150}
            value={giftNote}
            onChange={(e) => setGiftNote(e.target.value)}
            placeholder="With warmest seasonal harvest wishes..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-amber-200 hover:border-amber-400 text-xs text-charcoal focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 transition-all resize-none"
          />
        </div>

        {/* Courier Delivery Instructions */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="deliveryInstructions" className="text-xs font-semibold text-charcoal/80">
              Courier Delivery Instructions <span className="text-charcoal/50 text-[10px]">(Optional)</span>
            </label>
            <span
              className={cn(
                "text-[10px] font-mono",
                deliveryInstructions.length > 180 ? "text-amber-800 font-bold" : "text-charcoal/60"
              )}
            >
              {deliveryInstructions.length} / 200
            </span>
          </div>
          <textarea
            id="deliveryInstructions"
            rows={2}
            maxLength={200}
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            placeholder="Gate code, shaded porch placement, or reception desk note..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-amber-200 hover:border-amber-400 text-xs text-charcoal focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 transition-all resize-none"
          />
        </div>
      </div>

      {/* Simulated Luxury Payment Method (AC-5, AC-6) */}
      <div className="space-y-3.5 pt-2 border-t border-amber-200/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-amber-800" aria-hidden="true" />
            <h4 className="font-serif text-lg font-bold text-charcoal">Simulated Payment</h4>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
            <ShieldCheck size={12} className="text-amber-800" />
            Test Sandbox
          </span>
        </div>

        {/* Method Picker */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("simulated_card")}
            className={cn(
              "p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between cursor-pointer transition-all",
              paymentMethod === "simulated_card"
                ? "bg-amber-100/80 border-amber-800/80 text-charcoal shadow-xs"
                : "bg-white/70 border-amber-200 text-charcoal/70 hover:bg-white"
            )}
          >
            <span>Simulated Card</span>
            {paymentMethod === "simulated_card" && <Check size={14} className="text-amber-800" />}
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("apiary_reserve_credit")}
            className={cn(
              "p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between cursor-pointer transition-all",
              paymentMethod === "apiary_reserve_credit"
                ? "bg-amber-100/80 border-amber-800/80 text-charcoal shadow-xs"
                : "bg-white/70 border-amber-200 text-charcoal/70 hover:bg-white"
            )}
          >
            <span>Apiary Credit</span>
            {paymentMethod === "apiary_reserve_credit" && <Check size={14} className="text-amber-800" />}
          </button>
        </div>

        {paymentMethod === "simulated_card" ? (
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
            <div>
              <label htmlFor="cardNumber" className="block text-[11px] font-semibold text-charcoal/90 mb-1">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                aria-invalid={!!errors.cardNumber}
                className={cn(
                  "w-full px-3 py-2 rounded-xl bg-white border text-xs font-mono text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800",
                  errors.cardNumber ? "border-red-600 bg-red-50/20" : "border-amber-200"
                )}
              />
              {errors.cardNumber && (
                <p className="text-[10px] text-red-700 mt-0.5">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="cardExp" className="block text-[11px] font-semibold text-charcoal/90 mb-1">
                  Expires (MM/YY)
                </label>
                <input
                  id="cardExp"
                  type="text"
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  placeholder="12/28"
                  aria-invalid={!!errors.cardExp}
                  className={cn(
                    "w-full px-3 py-2 rounded-xl bg-white border text-xs font-mono text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800",
                    errors.cardExp ? "border-red-600 bg-red-50/20" : "border-amber-200"
                  )}
                />
              </div>

              <div>
                <label htmlFor="cardCvc" className="block text-[11px] font-semibold text-charcoal/90 mb-1">
                  Security Code
                </label>
                <input
                  id="cardCvc"
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="888"
                  aria-invalid={!!errors.cardCvc}
                  className={cn(
                    "w-full px-3 py-2 rounded-xl bg-white border text-xs font-mono text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800",
                    errors.cardCvc ? "border-red-600 bg-red-50/20" : "border-amber-200"
                  )}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-charcoal/80 leading-relaxed">
            <span className="font-semibold text-amber-950 block">Complimentary Member Credit Applied</span>
            Your seasonal tasting membership credit covers the entire subtotal and transit fees. Zero external charges required.
          </div>
        )}
      </div>

      {/* Order Totals Summary & Submit Button */}
      <div className="pt-4 border-t border-amber-200/80 space-y-3">
        <div className="space-y-1.5 text-xs text-charcoal/80 bg-cream-muted/60 p-3.5 rounded-xl border border-amber-200/70">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono font-medium">{formatCentsToDollars(totals.subtotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span>Insured Shipping</span>
            <span className="font-mono font-medium">
              {totals.shippingFeeCents === 0 ? "Complimentary" : formatCentsToDollars(totals.shippingFeeCents)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-charcoal pt-1.5 border-t border-amber-200/60">
            <span className="font-serif text-base">Authorized Total</span>
            <span className="font-serif text-base text-amber-950">
              {formatCentsToDollars(totals.totalCents)}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting || items.length === 0}
          className="w-full text-base font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin text-charcoal" aria-hidden="true" />
              <span>Verifying Reserve Order...</span>
            </>
          ) : (
            <>
              <Lock size={16} aria-hidden="true" />
              <span>Authorize & Place Reserve Order</span>
            </>
          )}
        </Button>

        <p className="text-center text-[11px] text-charcoal/60">
          Direct from the Catskills apiaries · Guaranteed authentic raw honey
        </p>
      </div>
    </form>
  );
}
