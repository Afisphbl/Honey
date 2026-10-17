import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../page";
import { useCartStore } from "@/lib/store/cart-store";

describe("Home Page Component (covers AC-1, AC-2, AC-4, AC-5, AC-6)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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

    useCartStore.getState().clearCart();
    useCartStore.getState().toggleCart(false);
  });

  it("renders the sticky editorial header with brand wordmark and cart bag (AC-1, AC-6)", () => {
    render(<Home />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getAllByText("Honey").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /Open shopping cart with 0 items/i })
    ).toBeInTheDocument();
  });

  it("renders the editorial hero headline and preamble", () => {
    render(<Home />);

    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: /Liquid Gold, Directly from the Wild Flora/i,
    });
    expect(mainHeading).toBeInTheDocument();
    expect(
      screen.getByText(/Harvested raw without pasteurization or fine pressure filtration/i)
    ).toBeInTheDocument();
  });

  it("renders the interactive canvas scrubber and featured reserve buy box (AC-1, AC-2, AC-5)", () => {
    render(<Home />);

    // Canvas scrubber
    expect(
      screen.getByRole("img", {
        name: /Interactive honey harvest animation frame 1 of 150/i,
      })
    ).toBeInTheDocument();

    // Featured product title & buy box
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Raw Wildflower Reserve",
      })
    ).toBeInTheDocument();

    // Default price
    expect(screen.getAllByText("$34.00").length).toBeGreaterThanOrEqual(1);
  });

  it("omits visible frame progression number pills from the canvas overlay (AC-4)", () => {
    render(<Home />);

    // Confirms that "001 / 150" or other counter badge numbers are not rendered
    expect(screen.queryByText(/001 \/ 150/)).not.toBeInTheDocument();
  });

  it("executes end-to-end add to cart loop and opens drawer (AC-5, AC-6)", () => {
    render(<Home />);

    // Click Add to Cart button in the featured buy box
    const addToCartButton = screen.getByRole("button", {
      name: /Add to Cart \(\$34\.00\)/i,
    });
    fireEvent.click(addToCartButton);

    // Verify cart state updated in store
    const cartState = useCartStore.getState();
    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0].productId).toBe("raw-wildflower-reserve");
    expect(cartState.isOpen).toBe(true);

    // Verify slide-over cart drawer is displayed with line item
    expect(screen.getByText("Your Reserve Bag")).toBeInTheDocument();
    expect(screen.getByText("1 jar in order")).toBeInTheDocument();
  });

  it("renders sensory notes and apiculture quality landmarks", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /The Alchemy of Raw Viscosity/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/Unpasteurized Purity/i)).toBeInTheDocument();
    expect(screen.getByText(/Subalpine Terroir/i)).toBeInTheDocument();
    expect(screen.getByText(/Lot Verified Traceability/i)).toBeInTheDocument();
  });

  it("renders semantic landmarks for accessible structure", () => {
    render(<Home />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
