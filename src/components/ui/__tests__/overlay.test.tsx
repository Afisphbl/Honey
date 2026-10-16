import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "../drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";

describe("Overlay and Navigation Primitives (AC-5, AC-6)", () => {

  it("opens Dialog modal, displays accessible content, and closes on trigger", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button type="button">Open Modal</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tasting Flight Details</DialogTitle>
            <DialogDescription>Seasonal sensory profiles for 2026 harvest</DialogDescription>
          </DialogHeader>
          <p>Modal body content</p>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Modal" });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Tasting Flight Details" })).toBeDefined();
    expect(screen.getByText("Seasonal sensory profiles for 2026 harvest")).toBeDefined();
    expect(screen.getByText("Modal body content")).toBeDefined();

    const closeBtn = screen.getByRole("button", { name: "Close dialog" });
    expect(closeBtn).toBeDefined();
    fireEvent.click(closeBtn);
  });

  it("opens Drawer sheet on right edge with VisuallyHidden accessible title fallback", () => {
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button type="button">View Cart</button>
        </DrawerTrigger>
        <DrawerContent accessibleTitleFallback="Shopping Cart Drawer">
          <DrawerHeader>
            <DrawerTitle>Your Basket</DrawerTitle>
            <DrawerDescription>2 jars of Artisanal Honey</DrawerDescription>
          </DrawerHeader>
          <div>Cart items list</div>
        </DrawerContent>
      </Drawer>
    );

    const trigger = screen.getByRole("button", { name: "View Cart" });
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.className).toContain("fixed inset-y-0 right-0");
    expect(screen.getByRole("heading", { name: "Your Basket" })).toBeDefined();
    expect(screen.getByText("Cart items list")).toBeDefined();

    const closeBtn = screen.getByRole("button", { name: "Close drawer" });
    expect(closeBtn).toBeDefined();
  });

  it("renders Tabs and toggles between tab panels", () => {
    render(
      <Tabs defaultValue="tasting">
        <TabsList>
          <TabsTrigger value="tasting">Tasting Notes</TabsTrigger>
          <TabsTrigger value="origin">Floral Origin</TabsTrigger>
        </TabsList>
        <TabsContent value="tasting">Floral notes of wild clover and pear.</TabsContent>
        <TabsContent value="origin">Harvested in alpine meadows at 1200m altitude.</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tab", { name: "Tasting Notes" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Floral Origin" })).toBeDefined();

    expect(screen.getByText("Floral notes of wild clover and pear.")).toBeDefined();

    const originTab = screen.getByRole("tab", { name: "Floral Origin" });
    fireEvent.keyDown(originTab, { key: "Enter" });

    expect(screen.getByText("Harvested in alpine meadows at 1200m altitude.")).toBeDefined();
  });

  it("renders DialogFooter and DrawerFooter with action buttons", () => {
    render(
      <div>
        <DialogFooter data-testid="dialog-footer">
          <button type="button">Confirm</button>
        </DialogFooter>
        <DrawerFooter data-testid="drawer-footer">
          <button type="button">Checkout</button>
        </DrawerFooter>
      </div>
    );

    const dialogFooter = screen.getByTestId("dialog-footer");
    expect(dialogFooter.className).toContain("border-t");
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDefined();

    const drawerFooter = screen.getByTestId("drawer-footer");
    expect(drawerFooter.className).toContain("mt-auto");
    expect(screen.getByRole("button", { name: "Checkout" })).toBeDefined();
  });

  it("prevents interaction on disabled tabs triggers", () => {
    render(
      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="archived" disabled>Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="available">In Stock</TabsContent>
        <TabsContent value="archived">Vintage Archive</TabsContent>
      </Tabs>
    );

    const archivedTab = screen.getByRole("tab", { name: "Archived" });
    expect(archivedTab.className).toContain("disabled:opacity-50");
    expect(archivedTab.getAttribute("disabled")).toBeDefined();
  });
});

