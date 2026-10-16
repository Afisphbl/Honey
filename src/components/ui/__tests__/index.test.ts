import { describe, it, expect } from "vitest";
import * as UI from "../index";

describe("UI Foundation barrel exports (AC-4, AC-5)", () => {
  it("exports all foundational presentational components", () => {
    expect(UI.Button).toBeDefined();
    expect(UI.Badge).toBeDefined();
    expect(UI.Card).toBeDefined();
    expect(UI.CardHeader).toBeDefined();
    expect(UI.CardTitle).toBeDefined();
    expect(UI.CardDescription).toBeDefined();
    expect(UI.CardContent).toBeDefined();
    expect(UI.CardFooter).toBeDefined();
    expect(UI.QuantitySelector).toBeDefined();
  });

  it("exports all overlay and navigation primitives", () => {
    expect(UI.Drawer).toBeDefined();
    expect(UI.DrawerTrigger).toBeDefined();
    expect(UI.DrawerClose).toBeDefined();
    expect(UI.DrawerContent).toBeDefined();
    expect(UI.DrawerHeader).toBeDefined();
    expect(UI.DrawerFooter).toBeDefined();
    expect(UI.DrawerTitle).toBeDefined();
    expect(UI.DrawerDescription).toBeDefined();

    expect(UI.Dialog).toBeDefined();
    expect(UI.DialogTrigger).toBeDefined();
    expect(UI.DialogClose).toBeDefined();
    expect(UI.DialogContent).toBeDefined();
    expect(UI.DialogHeader).toBeDefined();
    expect(UI.DialogFooter).toBeDefined();
    expect(UI.DialogTitle).toBeDefined();
    expect(UI.DialogDescription).toBeDefined();

    expect(UI.Tabs).toBeDefined();
    expect(UI.TabsList).toBeDefined();
    expect(UI.TabsTrigger).toBeDefined();
    expect(UI.TabsContent).toBeDefined();
  });
});
