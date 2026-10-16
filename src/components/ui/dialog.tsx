"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-xs",
      "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
      "transition-opacity duration-200 ease-[var(--ease-viscous)]",
      "motion-reduce:transition-none motion-reduce:duration-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  accessibleTitleFallback?: string;
}

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, accessibleTitleFallback = "Modal dialog", ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4",
        "rounded-2xl border border-amber-200 bg-cream p-6 shadow-2xl duration-200",
        "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        "data-[state=open]:scale-100 data-[state=closed]:scale-95",
        "transition-all duration-200 ease-[var(--ease-viscous)]",
        "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:duration-0",
        "focus:outline-none",
        className
      )}
      {...props}
    >
      <VisuallyHiddenPrimitive.Root asChild>
        <DialogPrimitive.Title>{accessibleTitleFallback}</DialogPrimitive.Title>
      </VisuallyHiddenPrimitive.Root>
      {children}
      <DialogPrimitive.Close
        aria-label="Close dialog"
        className={cn(
          "absolute right-4 top-4 rounded-xl p-2 text-charcoal/70 hover:text-charcoal hover:bg-amber-100/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
          "transition-all duration-150 ease-[var(--ease-viscous)] cursor-pointer"
        )}
      >
        <X size={18} strokeWidth={1.5} aria-hidden="true" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-amber-100/60",
        className
      )}
      {...props}
    />
  );
}

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-serif text-2xl font-semibold leading-none tracking-tight text-charcoal",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-charcoal/70 leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
