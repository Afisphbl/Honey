import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home Page Component (covers AC-1, AC-3, AC-6)", () => {
  it("renders the brand header with title and foundation badge (AC-1)", () => {
    render(<Home />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Honey")).toBeInTheDocument();
    expect(screen.getByText("Foundation Ready")).toBeInTheDocument();
  });

  it("renders the editorial hero headline and subtitle (AC-3)", () => {
    render(<Home />);

    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: /Liquid Gold, Directly from the Wild Flora/i,
    });
    expect(mainHeading).toBeInTheDocument();

    expect(
      screen.getByText(/Artisanal Apiculture & Single-Origin Reserve/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Crafted with raw extraction methods and unpasteurized purity/i)
    ).toBeInTheDocument();
  });

  it("renders the hero sequence poster preview with accessible alt text (AC-6)", () => {
    render(<Home />);

    const posterImg = screen.getByAltText(
      "Honey jar animation sequence poster frame"
    );
    expect(posterImg).toBeInTheDocument();
    expect(
      screen.getByText(/Canvas Asset Pipeline Verified/i)
    ).toBeInTheDocument();
  });

  it("displays the architecture verification feature cards (AC-1)", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Next.js App Router" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Tailwind CSS v4 & OKLCH" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Zustand & Memory Bounded Canvas",
      })
    ).toBeInTheDocument();
  });

  it("renders semantic landmarks for accessible structure", () => {
    render(<Home />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
