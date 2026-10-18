import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "amber" | "cream" | "outline" | "gold";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  amber: "bg-amber-100 text-amber-900 border-amber-200",
  cream: "bg-cream-muted text-charcoal border-amber-200",
  outline: "border-amber-700 text-amber-800 bg-transparent",
  gold: "bg-gold/25 text-amber-950 border-gold-dark/30",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
  lg: "px-3.5 py-1.5 text-sm",
};

export function Badge({
  className,
  variant = "amber",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium tracking-wide uppercase rounded-full border",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
