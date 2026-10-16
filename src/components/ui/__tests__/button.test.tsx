import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button component (AC-4, AC-6)", () => {
  it("renders with default primary variant and md size", () => {
    render(<Button>Harvest Honey</Button>);
    const button = screen.getByRole("button", { name: "Harvest Honey" });
    expect(button).toBeDefined();
    expect(button.className).toContain("bg-gold");
    expect(button.className).toContain("h-11");
  });

  it("supports variant and size styling", () => {
    render(
      <Button variant="outline" size="sm">
        Small Outline
      </Button>
    );
    const button = screen.getByRole("button", { name: "Small Outline" });
    expect(button.className).toContain("border-amber-800");
    expect(button.className).toContain("text-amber-800");
    expect(button.className).toContain("h-9");
  });

  it("supports polymorphism via asChild with an anchor element", () => {
    render(
      <Button asChild variant="secondary">
        <a href="/catalog">Explore Catalog</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: "Explore Catalog" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/catalog");
    expect(link.className).toContain("bg-amber-100");
    expect(link.className).toContain("h-11");
  });

  it("fires onClick handler when active", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables click interactions when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Action
      </Button>
    );
    const button = screen.getByRole("button", { name: "Disabled Action" });
    expect(button).toBeDisabled();
    expect(button.className).toContain("disabled:opacity-50");
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("includes focus visible ring classes and reduced motion guards", () => {
    render(<Button>Accessible Focus</Button>);
    const button = screen.getByRole("button", { name: "Accessible Focus" });
    expect(button.className).toContain("focus-visible:ring-amber-800");
    expect(button.className).toContain("motion-reduce:transition-none");
    expect(button.className).toContain("motion-reduce:active:scale-100");
  });

  it("supports ghost and link variants and icon size", () => {
    const { rerender } = render(<Button variant="ghost">Ghost Action</Button>);
    let button = screen.getByRole("button", { name: "Ghost Action" });
    expect(button.className).toContain("hover:bg-amber-100/60");

    rerender(<Button variant="link">Terms</Button>);
    button = screen.getByRole("button", { name: "Terms" });
    expect(button.className).toContain("underline-offset-4");

    rerender(<Button size="icon" aria-label="Cart Icon">Icon</Button>);
    button = screen.getByRole("button", { name: "Cart Icon" });
    expect(button.className).toContain("w-11");
    expect(button.className).toContain("h-11");
  });

  it("forwards ref to the underlying DOM button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Target</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Ref Target");
  });
});

