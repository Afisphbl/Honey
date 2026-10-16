import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn class merging utility (AC-3)", () => {
  it("combines multiple class string arguments", () => {
    const result = cn("font-serif", "text-xl", "text-charcoal");
    expect(result).toBe("font-serif text-xl text-charcoal");
  });

  it("handles conditional boolean expressions, undefined, and null values", () => {
    const isPrimary = true;
    const isMuted = false;
    const extra = undefined;
    const note = null;

    const result = cn(
      "base-class",
      isPrimary && "bg-gold",
      isMuted && "opacity-50",
      extra,
      note
    );

    expect(result).toBe("base-class bg-gold");
  });

  it("resolves Tailwind utility conflicts by keeping the last occurrence", () => {
    const paddingConflict = cn("p-4", "p-2");
    expect(paddingConflict).toBe("p-2");

    const colorConflict = cn("text-amber-800", "text-charcoal");
    expect(colorConflict).toBe("text-charcoal");

    const bgConflict = cn("bg-gold", "bg-cream");
    expect(bgConflict).toBe("bg-cream");
  });

  it("handles object input syntax from clsx", () => {
    const result = cn({
      "font-serif": true,
      "text-charcoal": true,
      hidden: false,
    });

    expect(result).toBe("font-serif text-charcoal");
  });

  it("handles array arguments with nested values", () => {
    const result = cn(["px-4", "py-2"], ["rounded-xl", ["shadow-sm"]]);
    expect(result).toBe("px-4 py-2 rounded-xl shadow-sm");
  });

  it("returns an empty string when called with no arguments or falsy inputs", () => {
    expect(cn()).toBe("");
    expect(cn(null, undefined, false, "")).toBe("");
  });
});
