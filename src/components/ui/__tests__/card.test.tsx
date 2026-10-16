import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../card";

describe("Card component (AC-4)", () => {
  it("renders compound card structure with semantic elements", () => {
    render(
      <Card data-testid="honey-card">
        <CardHeader>
          <CardTitle as="h2">Wildflower Honey</CardTitle>
          <CardDescription>Raw summer harvest from alpine meadows</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tasting notes: floral, crisp pear, clover</p>
        </CardContent>
        <CardFooter>
          <button type="button">Add to Basket</button>
        </CardFooter>
      </Card>
    );

    const card = screen.getByTestId("honey-card");
    expect(card.className).toContain("rounded-2xl");
    expect(card.className).toContain("border-amber-200");

    const heading = screen.getByRole("heading", { level: 2, name: "Wildflower Honey" });
    expect(heading).toBeDefined();
    expect(heading.className).toContain("font-serif");

    expect(screen.getByText("Raw summer harvest from alpine meadows")).toBeDefined();
    expect(screen.getByText("Tasting notes: floral, crisp pear, clover")).toBeDefined();
    expect(screen.getByRole("button", { name: "Add to Basket" })).toBeDefined();
  });

  it("renders CardTitle as h3 by default when as prop is omitted", () => {
    render(<CardTitle>Tasting Flight</CardTitle>);
    const heading = screen.getByRole("heading", { level: 3, name: "Tasting Flight" });
    expect(heading).toBeDefined();
    expect(heading.tagName).toBe("H3");
  });

  it("merges custom classes onto Card and CardHeader", () => {
    render(
      <Card className="hover:shadow-md" data-testid="custom-card">
        <CardHeader className="bg-cream-muted" data-testid="custom-header">
          <CardTitle>Artisanal Jar</CardTitle>
        </CardHeader>
      </Card>
    );

    const card = screen.getByTestId("custom-card");
    expect(card.className).toContain("hover:shadow-md");
    expect(card.className).toContain("rounded-2xl");

    const header = screen.getByTestId("custom-header");
    expect(header.className).toContain("bg-cream-muted");
    expect(header.className).toContain("flex");
  });
});

