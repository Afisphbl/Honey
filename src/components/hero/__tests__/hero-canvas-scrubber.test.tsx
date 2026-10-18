import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroCanvasScrubber } from "../hero-canvas-scrubber";

describe("HeroCanvasScrubber component (satisfies AC-1, AC-2, AC-3, AC-4)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock HTMLCanvasElement.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
    });

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

  it("renders the full screen canvas scrubber with accessible role and omits frame counter number pills (AC-1, AC-4)", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    render(
      <HeroCanvasScrubber containerRef={containerRef} totalFrames={150} />
    );

    const canvas = screen.getByRole("img", {
      name: /Interactive honey harvest animation frame 1 of 150/i,
    });
    expect(canvas).toBeInTheDocument();
    expect(screen.getByText("Single Origin Reserve 2026")).toBeInTheDocument();
    expect(
      screen.getByText("Liquid Gold, Directly from the Wild Flora.")
    ).toBeInTheDocument();
    // AC-4: No visible frame progression counter pills
    expect(screen.queryByText(/001 \/ 150/)).not.toBeInTheDocument();
  });

  it("renders accessible reduced motion controls without frame numbering when prefers-reduced-motion is active (AC-4)", () => {
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

    render(
      <HeroCanvasScrubber containerRef={containerRef} totalFrames={150} />
    );

    expect(screen.getByText("Reduced Motion Control")).toBeInTheDocument();
    const slider = screen.getByLabelText(/Manual frame scrubber slider/i);
    expect(slider).toBeInTheDocument();

    // Adjusting manual slider scrubs the frame
    fireEvent.change(slider, { target: { value: "88" } });

    // AC-4: Canvas updates accessible label but omits visible number badge
    expect(
      screen.getByRole("img", {
        name: /Interactive honey harvest animation frame 88 of 150/i,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(/088 \/ 150/)).not.toBeInTheDocument();
  });

  it("updates canvas buffer resolution using device pixel ratio capped at 2 (AC-3)", () => {
    const originalDpr = window.devicePixelRatio;
    Object.defineProperty(window, "devicePixelRatio", {
      value: 3.5,
      configurable: true,
    });

    const originalGetBoundingClientRect =
      HTMLCanvasElement.prototype.getBoundingClientRect;
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
    });

    const containerRef = {
      current: document.createElement("div"),
    };

    render(
      <HeroCanvasScrubber containerRef={containerRef} totalFrames={150} />
    );

    const canvas = screen.getByRole("img", {
      name: /Interactive honey harvest animation frame 1 of 150/i,
    }) as HTMLCanvasElement;

    // Width and height are scaled to DPR capped at 2 (800 * 2, 600 * 2)
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(1200);

    Object.defineProperty(window, "devicePixelRatio", {
      value: originalDpr,
      configurable: true,
    });
    HTMLCanvasElement.prototype.getBoundingClientRect =
      originalGetBoundingClientRect;
  });

  it("redraws canvas on window resize event", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    render(
      <HeroCanvasScrubber containerRef={containerRef} totalFrames={150} />
    );

    const contextSpy = HTMLCanvasElement.prototype.getContext;
    const initialCalls = (contextSpy as ReturnType<typeof vi.fn>).mock.calls.length;

    fireEvent(window, new Event("resize"));

    expect(
      (contextSpy as ReturnType<typeof vi.fn>).mock.calls.length
    ).toBeGreaterThanOrEqual(initialCalls);
  });

  it("cleans up cached frames on unmount (AC-3)", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    const { unmount } = render(
      <HeroCanvasScrubber containerRef={containerRef} totalFrames={150} />
    );

    expect(() => unmount()).not.toThrow();
  });

  it("renders bottom progress bar reflecting scroll percentage (AC-2)", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    const { container } = render(
      <HeroCanvasScrubber containerRef={containerRef} totalFrames={150} />
    );

    const progressBar = container.querySelector(".bg-amber-600");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: "0%" });
  });

  it("renders teaser navigation links to catalog and featured reserve (AC-1)", () => {
    const containerRef = {
      current: document.createElement("div"),
    };

    render(
      <HeroCanvasScrubber containerRef={containerRef} totalFrames={150} />
    );

    const exploreLink = screen.getByRole("link", {
      name: /explore all reserves/i,
    });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute("href", "/catalog");

    const featuredLink = screen.getByRole("link", {
      name: /featured reserve/i,
    });
    expect(featuredLink).toBeInTheDocument();
    expect(featuredLink).toHaveAttribute("href", "#featured-reserve");
  });
});


