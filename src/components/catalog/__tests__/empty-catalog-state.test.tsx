import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyCatalogState } from "../empty-catalog-state";

describe("EmptyCatalogState component (satisfies AC-8)", () => {
  it("renders status landmark with polite live region announcement (AC-8)", () => {
    render(<EmptyCatalogState onReset={vi.fn()} />);

    const statusRegion = screen.getByRole("status");
    expect(statusRegion).toBeInTheDocument();
    expect(statusRegion).toHaveAttribute("aria-live", "polite");
  });

  it("displays editorial heading and reassurance explanation copy (AC-8)", () => {
    render(<EmptyCatalogState onReset={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        name: /no reserves match these terroir criteria/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/our single origin harvests are strictly seasonal/i)
    ).toBeInTheDocument();
  });

  it("calls onReset callback when reset filters button is clicked (AC-8)", () => {
    const onReset = vi.fn();

    render(<EmptyCatalogState onReset={onReset} />);

    const resetButton = screen.getByRole("button", {
      name: /reset all filters/i,
    });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
