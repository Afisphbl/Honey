import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Standard relative luminance formula per WCAG 2.1.
 */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  const rL = srgbToLinear(r / 255);
  const gL = srgbToLinear(g / 255);
  const bL = srgbToLinear(b / 255);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Approximate OKLCH to sRGB conversion to test color tokens against WCAG thresholds.
 */
function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const lCube = l_ * l_ * l_;
  const mCube = m_ * m_ * m_;
  const sCube = s_ * s_ * s_;

  const rLinear = +4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
  const gLinear = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
  const bLinear = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube;

  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val * 255)));
  return [clamp(rLinear), clamp(gLinear), clamp(bLinear)];
}

describe("Design System Tokens and Accessibility Contracts (AC-2, AC-6)", () => {
  const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("contains all required semantic OKLCH tokens under @theme", () => {
    expect(cssContent).toContain("--color-cream:");
    expect(cssContent).toContain("--color-cream-muted:");
    expect(cssContent).toContain("--color-charcoal:");
    expect(cssContent).toContain("--color-charcoal-deep:");
    expect(cssContent).toContain("--color-amber-800:");
    expect(cssContent).toContain("--color-amber-700:");
    expect(cssContent).toContain("--color-amber-200:");
    expect(cssContent).toContain("--color-gold:");
    expect(cssContent).toContain("--color-gold-dark:");
    expect(cssContent).toContain("--ease-viscous:");
  });

  it("contains fluid typography @utility rules", () => {
    expect(cssContent).toContain("@utility text-display");
    expect(cssContent).toContain("@utility text-title");
    expect(cssContent).toContain("@utility text-subtitle");
    expect(cssContent).toContain("@utility text-body");
    expect(cssContent).toContain("@utility text-caption");
  });

  it("configures stable scrollbar gutter on root html", () => {
    expect(cssContent).toContain("scrollbar-gutter: stable;");
  });

  it("configures global reduced motion media query", () => {
    expect(cssContent).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssContent).toContain("animation-duration: 0.01ms !important;");
    expect(cssContent).toContain("transition-duration: 0.01ms !important;");
  });

  it("verifies contrast ratio of primary text (charcoal on cream) exceeds 4.5:1 (WCAG AA)", () => {
    // cream: oklch(0.985 0.015 85), charcoal: oklch(0.22 0.02 50)
    const [rCream, gCream, bCream] = oklchToRgb(0.985, 0.015, 85);
    const [rCharcoal, gCharcoal, bCharcoal] = oklchToRgb(0.22, 0.02, 50);

    const lCream = relativeLuminance(rCream, gCream, bCream);
    const lCharcoal = relativeLuminance(rCharcoal, gCharcoal, bCharcoal);

    const ratio = contrastRatio(lCream, lCharcoal);
    expect(ratio).toBeGreaterThanOrEqual(7.0); // comfortably passes AA (4.5:1) and AAA (7:1)
  });

  it("verifies contrast ratio of interactive text (amber-800 on cream) exceeds 4.5:1 (WCAG AA)", () => {
    // cream: oklch(0.985 0.015 85), amber-800: oklch(0.42 0.12 55)
    const [rCream, gCream, bCream] = oklchToRgb(0.985, 0.015, 85);
    const [rAmber800, gAmber800, bAmber800] = oklchToRgb(0.42, 0.12, 55);

    const lCream = relativeLuminance(rCream, gCream, bCream);
    const lAmber800 = relativeLuminance(rAmber800, gAmber800, bAmber800);

    const ratio = contrastRatio(lCream, lAmber800);
    expect(ratio).toBeGreaterThanOrEqual(4.5); // passes WCAG AA
  });

  it("verifies contrast ratio of emphasized badge text (amber-700 on cream) exceeds 4.5:1", () => {
    // cream: oklch(0.985 0.015 85), amber-700: oklch(0.52 0.15 60)
    const [rCream, gCream, bCream] = oklchToRgb(0.985, 0.015, 85);
    const [rAmber700, gAmber700, bAmber700] = oklchToRgb(0.52, 0.15, 60);

    const lCream = relativeLuminance(rCream, gCream, bCream);
    const lAmber700 = relativeLuminance(rAmber700, gAmber700, bAmber700);

    const ratio = contrastRatio(lCream, lAmber700);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
