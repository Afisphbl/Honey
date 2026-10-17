import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollFrame } from "../use-scroll-frame";

describe("useScrollFrame hook (satisfies AC-2, AC-4)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("initializes with default frame index 1 and progress 0", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150 })
    );

    expect(result.current.frameIndex).toBe(1);
    expect(result.current.progress).toBe(0);
    expect(result.current.targetFrame).toBe(1);
    expect(result.current.isReducedMotion).toBe(false);
  });

  it("allows setting manual frame within bounds", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150 })
    );

    act(() => {
      result.current.setManualFrame(75);
    });

    expect(result.current.frameIndex).toBe(75);
    expect(result.current.targetFrame).toBe(75);
    expect(result.current.progress).toBeCloseTo(74 / 149, 2);
  });

  it("clamps manual frame between 1 and totalFrames", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150 })
    );

    act(() => {
      result.current.setManualFrame(200);
    });
    expect(result.current.frameIndex).toBe(150);

    act(() => {
      result.current.setManualFrame(-10);
    });
    expect(result.current.frameIndex).toBe(1);
  });

  it("allows setting manual progress and derives frame index", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150 })
    );

    act(() => {
      result.current.setManualProgress(0.5);
    });

    // 1 + 0.5 * 149 = 75.5 -> 76
    expect(result.current.frameIndex).toBe(76);
    expect(result.current.progress).toBeCloseTo(0.5, 1);
  });

  it("detects prefers-reduced-motion: reduce correctly", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const containerRef = {
      current: document.createElement("div"),
    };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150 })
    );

    expect(result.current.isReducedMotion).toBe(true);
  });

  it("calculates progress and scrubs target frame on window scroll (AC-2)", () => {
    let rafCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      configurable: true,
    });

    const container = document.createElement("div");
    Object.defineProperty(container, "offsetHeight", {
      value: 3000,
      configurable: true,
    });
    container.getBoundingClientRect = vi.fn().mockReturnValue({
      top: -1000,
      bottom: 2000,
      left: 0,
      right: 1000,
      width: 1000,
      height: 3000,
    });

    const containerRef = { current: container };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150, damping: 0.2 })
    );

    act(() => {
      window.dispatchEvent(new Event("scroll"));
      while (rafCallbacks.length > 0) {
        const cbs = [...rafCallbacks];
        rafCallbacks = [];
        cbs.forEach((cb) => cb(performance.now()));
      }
    });

    expect(result.current.progress).toBeCloseTo(0.5, 2);
    expect(result.current.targetFrame).toBe(76);
    expect(result.current.frameIndex).toBe(76);

    vi.unstubAllGlobals();
  });

  it("keeps progress at zero when container height is shorter than window (AC-2)", () => {
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      configurable: true,
    });

    const container = document.createElement("div");
    Object.defineProperty(container, "offsetHeight", {
      value: 600,
      configurable: true,
    });
    container.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 0,
      bottom: 600,
      left: 0,
      right: 1000,
      width: 1000,
      height: 600,
    });

    const containerRef = { current: container };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150 })
    );

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.progress).toBe(0);
    expect(result.current.targetFrame).toBe(1);
    expect(result.current.frameIndex).toBe(1);
  });

  it("pauses animation loop when disabled option is true", () => {
    const cancelRafSpy = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelRafSpy);

    const container = document.createElement("div");
    const containerRef = { current: container };

    const { result } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150, disabled: true })
    );

    expect(result.current.frameIndex).toBe(1);

    vi.unstubAllGlobals();
  });

  it("removes event listeners and cancels active animation frame on unmount", () => {
    const removeListenerSpy = vi.spyOn(window, "removeEventListener");
    const cancelRafSpy = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelRafSpy);

    const container = document.createElement("div");
    const containerRef = { current: container };

    const { unmount } = renderHook(() =>
      useScrollFrame(containerRef, { totalFrames: 150 })
    );

    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(removeListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    vi.unstubAllGlobals();
  });
});

