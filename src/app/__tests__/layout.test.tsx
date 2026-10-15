import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/font/google", () => ({
  Cormorant_Garamond: () => ({
    variable: "--font-serif",
  }),
  Plus_Jakarta_Sans: () => ({
    variable: "--font-sans",
  }),
}));

import RootLayout, { metadata } from "../layout";

describe("RootLayout Component & Metadata (covers AC-1, AC-3)", () => {
  it("defines accessible storefront metadata for SEO (AC-1)", () => {
    expect(metadata.title).toBe("Honey | Single-Origin Artisanal Honey Storefront");
    expect(metadata.description).toContain(
      "Pure single-origin raw honey harvested with sustainable apiculture"
    );
  });

  it("renders children content inside layout container", () => {
    const { getByTestId, getByText } = render(
      <RootLayout>
        <div data-testid="test-child">Storefront Child Content</div>
      </RootLayout>,
      { container: document }
    );

    expect(getByTestId("test-child")).toBeInTheDocument();
    expect(getByText("Storefront Child Content")).toBeInTheDocument();
  });
});
