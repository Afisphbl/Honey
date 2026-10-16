"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  "aria-label"?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 10,
  step = 1,
  onChange,
  disabled = false,
  className,
  name = "quantity",
  id,
  "aria-label": ariaLabel = "Quantity",
}: QuantitySelectorProps) {
  const [typedValue, setTypedValue] = React.useState<string | null>(null);
  const [liveMessage, setLiveMessage] = React.useState<string>("");

  const displayValue = typedValue !== null ? typedValue : String(value);

  const updateValue = (nextVal: number) => {
    const clamped = Math.min(Math.max(nextVal, min), max);
    setTypedValue(null);
    onChange(clamped);
    setLiveMessage(`Quantity updated to ${clamped}`);
  };

  const handleDecrement = () => {
    if (disabled || value <= min) return;
    updateValue(value - step);
  };

  const handleIncrement = () => {
    if (disabled || value >= max) return;
    updateValue(value + step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedValue(e.target.value);
  };

  const handleBlur = () => {
    if (typedValue === null) return;
    const parsed = parseInt(typedValue, 10);
    if (Number.isNaN(parsed)) {
      setTypedValue(null);
      return;
    }
    updateValue(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-amber-200 bg-cream text-charcoal shadow-sm",
        disabled && "opacity-50 pointer-events-none cursor-not-allowed",
        className
      )}
      role="group"
      aria-label={ariaLabel}
    >
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </span>

      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-l-xl text-charcoal cursor-pointer",
          "hover:bg-amber-100/60 active:scale-95 transition-all duration-150 ease-[var(--ease-viscous)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-1 focus-visible:ring-offset-cream",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
      >
        <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        value={displayValue}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-11 w-12 text-center font-sans text-sm font-semibold text-charcoal bg-transparent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-1 focus-visible:ring-offset-cream rounded-sm",
          "disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-r-xl text-charcoal cursor-pointer",
          "hover:bg-amber-100/60 active:scale-95 transition-all duration-150 ease-[var(--ease-viscous)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-1 focus-visible:ring-offset-cream",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
      >
        <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
