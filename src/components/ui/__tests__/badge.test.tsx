import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge component (AC-4)", () => {
  it("renders with default amber variant", () => {
    render(<Badge>Raw & Unfiltered</Badge>);
    const badge = screen.getByText("Raw & Unfiltered");
    expect(badge).toBeDefined();
    expect(badge.className).toContain("bg-amber-100");
    expect(badge.className).toContain("text-amber-900");
  });

  it("renders with cream, outline, and gold variants", () => {
    const { rerender } = render(<Badge variant="cream">Single Origin</Badge>);
    let badge = screen.getByText("Single Origin");
    expect(badge.className).toContain("bg-cream-muted");

    rerender(<Badge variant="outline">2026 Harvest</Badge>);
    badge = screen.getByText("2026 Harvest");
    expect(badge.className).toContain("border-amber-700");

    rerender(<Badge variant="gold">Limited Batch</Badge>);
    badge = screen.getByText("Limited Batch");
    expect(badge.className).toContain("bg-gold/25");
  });

  it("merges custom className without losing core styling", () => {
    render(<Badge className="shadow-xs tracking-widest">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge.className).toContain("shadow-xs");
    expect(badge.className).toContain("rounded-full");
  });

  it("forwards standard HTML attributes such as data attributes and role", () => {
    render(
      <Badge role="status" aria-label="Harvest Year 2026" data-testid="harvest-badge">
        2026
      </Badge>
    );
    const badge = screen.getByTestId("harvest-badge");
    expect(badge.getAttribute("role")).toBe("status");
    expect(badge.getAttribute("aria-label")).toBe("Harvest Year 2026");
  });
});

