import { describe, it, expect, vi } from "vitest";
import {
  getClampedDevicePixelRatio,
  checkPrefersReducedMotion,
  WindowedFrameCache,
  drawImageCover,
} from "../frame-loader";

describe("Canvas safeguards and WindowedFrameCache (covers AC-6)", () => {
  it("caps device pixel ratio at maximum value 2 (AC-6)", () => {
    const originalDpr = window.devicePixelRatio;

    // Test low DPR
    Object.defineProperty(window, "devicePixelRatio", {
      value: 1,
      configurable: true,
    });
    expect(getClampedDevicePixelRatio(2)).toBe(1);

    // Test high DPR capped at 2
    Object.defineProperty(window, "devicePixelRatio", {
      value: 3.5,
      configurable: true,
    });
    expect(getClampedDevicePixelRatio(2)).toBe(2);

    // Restore
    Object.defineProperty(window, "devicePixelRatio", {
      value: originalDpr,
      configurable: true,
    });
  });

  it("checks prefers-reduced-motion media query correctly (AC-6)", () => {
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = ((query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })) as unknown as typeof window.matchMedia;

    expect(checkPrefersReducedMotion()).toBe(true);

    window.matchMedia = originalMatchMedia;
  });

  it("formats frame and poster paths correctly", () => {
    const cache = new WindowedFrameCache(150, 8, "/frames");

    expect(cache.getFramePath(1)).toBe("/frames/frame-001.webp");
    expect(cache.getFramePath(45)).toBe("/frames/frame-045.webp");
    expect(cache.getFramePath(150)).toBe("/frames/frame-150.webp");
    expect(cache.getPosterPath()).toBe("/frames/poster.webp");

    // Clamps out of bounds frame indices
    expect(cache.getFramePath(0)).toBe("/frames/frame-001.webp");
    expect(cache.getFramePath(999)).toBe("/frames/frame-150.webp");
  });

  it("bounds frame cache window and clears memory cleanly (AC-6)", () => {
    const cache = new WindowedFrameCache(150, 4, "/frames");

    expect(cache.getCacheSize()).toBe(0);
    cache.updateActiveWindow(10);
    // Speculatively requests frames inside window [6, 14]
    cache.clear();
    expect(cache.getCacheSize()).toBe(0);
  });

  it("returns undefined for frames not yet loaded into cache", () => {
    const cache = new WindowedFrameCache(150, 4, "/frames");
    expect(cache.getLoadedFrame(1)).toBeUndefined();
    expect(cache.getLoadedFrame(75)).toBeUndefined();
  });

  it("draws image with cover aspect ratio when image is wider than canvas", () => {
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const ctx = {
      clearRect,
      drawImage,
    } as unknown as CanvasRenderingContext2D;

    const img = {
      naturalWidth: 1600,
      naturalHeight: 900,
    } as unknown as HTMLImageElement;

    // Canvas 800x600 has ratio 1.333, image ratio is 1.777 (wider)
    drawImageCover(ctx, img, 800, 600);

    expect(clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(drawImage).toHaveBeenCalledTimes(1);

    const [drawnImg, offsetX, offsetY, renderWidth, renderHeight] =
      drawImage.mock.calls[0];
    expect(drawnImg).toBe(img);
    expect(renderHeight).toBe(600);
    expect(renderWidth).toBeCloseTo(600 * (1600 / 900), 1);
    expect(offsetX).toBeLessThan(0);
    expect(offsetY).toBe(0);
  });

  it("draws image with cover aspect ratio when canvas is wider than image", () => {
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const ctx = {
      clearRect,
      drawImage,
    } as unknown as CanvasRenderingContext2D;

    const img = {
      naturalWidth: 600,
      naturalHeight: 1200,
    } as unknown as HTMLImageElement;

    // Canvas 800x400 has ratio 2.0, image ratio is 0.5 (taller)
    drawImageCover(ctx, img, 800, 400);

    expect(clearRect).toHaveBeenCalledWith(0, 0, 800, 400);
    expect(drawImage).toHaveBeenCalledTimes(1);

    const [drawnImg, offsetX, offsetY, renderWidth, renderHeight] =
      drawImage.mock.calls[0];
    expect(drawnImg).toBe(img);
    expect(renderWidth).toBe(800);
    expect(renderHeight).toBeCloseTo(800 / (600 / 1200), 1);
    expect(offsetX).toBe(0);
    expect(offsetY).toBeLessThan(0);
  });

  it("handles images with zero dimensions gracefully without drawing", () => {
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const ctx = {
      clearRect,
      drawImage,
    } as unknown as CanvasRenderingContext2D;

    const zeroImg = {
      naturalWidth: 0,
      naturalHeight: 0,
    } as unknown as HTMLImageElement;

    drawImageCover(ctx, zeroImg, 800, 600);

    expect(clearRect).not.toHaveBeenCalled();
    expect(drawImage).not.toHaveBeenCalled();
  });
});
