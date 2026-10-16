"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Drawer = DialogPrimitive.Root;

export const DrawerTrigger = DialogPrimitive.Trigger;

export const DrawerClose = DialogPrimitive.Close;

export const DrawerPortal = DialogPrimitive.Portal;

export const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-xs",
      "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
      "transition-opacity duration-300 ease-[var(--ease-viscous)]",
      "motion-reduce:transition-none motion-reduce:duration-0",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  accessibleTitleFallback?: string;
}

export const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, accessibleTitleFallback = "Side sheet panel", ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-cream shadow-2xl border-l border-amber-200/80 sm:max-w-md",
        "data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full",
        "transition-transform duration-300 ease-[var(--ease-viscous)]",
        "motion-reduce:transition-none motion-reduce:duration-0",
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
        aria-label="Close drawer"
        className={cn(
          "absolute right-4 top-4 rounded-xl p-2.5 text-charcoal/70 hover:text-charcoal hover:bg-amber-100/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
          "transition-all duration-150 ease-[var(--ease-viscous)] cursor-pointer"
        )}
      >
        <X size={20} strokeWidth={1.5} aria-hidden="true" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

export function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 border-b border-amber-100", className)}
      {...props}
    />
  );
}

export function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-6 border-t border-amber-100 bg-cream-muted/30", className)}
      {...props}
    />
  );
}

export const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-serif text-2xl font-semibold text-charcoal tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-charcoal/70 leading-relaxed", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";
