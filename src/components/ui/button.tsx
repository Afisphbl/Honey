import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-charcoal hover:bg-gold-dark shadow-sm border border-gold-dark/20",
  secondary:
    "bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-200",
  outline:
    "border border-amber-800 text-amber-800 hover:bg-amber-100/60 bg-transparent",
  ghost:
    "text-charcoal hover:bg-amber-100/60 hover:text-amber-950 bg-transparent",
  link:
    "text-amber-800 underline-offset-4 hover:underline p-0 h-auto bg-transparent border-none shadow-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-7 text-base rounded-2xl gap-2.5",
  icon: "h-11 w-11 p-0 rounded-xl flex items-center justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium select-none cursor-pointer",
          "transition-all duration-200 ease-[var(--ease-viscous)]",
          "active:scale-[0.98] motion-reduce:active:scale-100 motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
