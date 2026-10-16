import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuantitySelector } from "../quantity-selector";

describe("QuantitySelector component (AC-4)", () => {
  it("renders with initial value and accessible labels", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={2} onChange={handleChange} />);

    const decBtn = screen.getByRole("button", { name: "Decrease quantity" });
    const incBtn = screen.getByRole("button", { name: "Increase quantity" });
    const spinbutton = screen.getByRole("spinbutton");

    expect(decBtn).toBeDefined();
    expect(incBtn).toBeDefined();
    expect(spinbutton).toBeDefined();
    expect(spinbutton.getAttribute("aria-valuenow")).toBe("2");
    expect((spinbutton as HTMLInputElement).value).toBe("2");
  });

  it("increments value on plus button click and updates live region", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={2} onChange={handleChange} />);

    const incBtn = screen.getByRole("button", { name: "Increase quantity" });
    fireEvent.click(incBtn);

    expect(handleChange).toHaveBeenCalledWith(3);
    const liveRegion = screen.getByText("Quantity updated to 3");
    expect(liveRegion).toBeDefined();
    expect(liveRegion.getAttribute("aria-live")).toBe("polite");
  });

  it("decrements value on minus button click", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={3} onChange={handleChange} />);

    const decBtn = screen.getByRole("button", { name: "Decrease quantity" });
    fireEvent.click(decBtn);

    expect(handleChange).toHaveBeenCalledWith(2);
    expect(screen.getByText("Quantity updated to 2")).toBeDefined();
  });

  it("disables minus button when value equals min boundary", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={1} min={1} max={10} onChange={handleChange} />);

    const decBtn = screen.getByRole("button", { name: "Decrease quantity" });
    expect(decBtn).toBeDisabled();
    fireEvent.click(decBtn);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("disables plus button when value equals max boundary", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={10} min={1} max={10} onChange={handleChange} />);

    const incBtn = screen.getByRole("button", { name: "Increase quantity" });
    expect(incBtn).toBeDisabled();
    fireEvent.click(incBtn);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("handles keyboard ArrowUp and ArrowDown interactions", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={5} onChange={handleChange} />);

    const spinbutton = screen.getByRole("spinbutton");
    fireEvent.keyDown(spinbutton, { key: "ArrowUp" });
    expect(handleChange).toHaveBeenCalledWith(6);

    fireEvent.keyDown(spinbutton, { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("clamps out of bounds typed values on blur", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={5} min={1} max={10} onChange={handleChange} />);

    const spinbutton = screen.getByRole("spinbutton");
    fireEvent.change(spinbutton, { target: { value: "99" } });
    fireEvent.blur(spinbutton);

    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it("disables input and buttons when disabled prop is true", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={5} disabled onChange={handleChange} />);

    const decBtn = screen.getByRole("button", { name: "Decrease quantity" });
    const incBtn = screen.getByRole("button", { name: "Increase quantity" });
    const spinbutton = screen.getByRole("spinbutton");

    expect(decBtn).toBeDisabled();
    expect(incBtn).toBeDisabled();
    expect(spinbutton).toBeDisabled();

    fireEvent.click(incBtn);
    fireEvent.click(decBtn);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("increments and decrements by custom step amount", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={2} step={2} onChange={handleChange} />);

    const incBtn = screen.getByRole("button", { name: "Increase quantity" });
    fireEvent.click(incBtn);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("reverts non numeric typed input on blur without invoking onChange", () => {
    const handleChange = vi.fn();
    render(<QuantitySelector value={3} onChange={handleChange} />);

    const spinbutton = screen.getByRole("spinbutton");
    fireEvent.change(spinbutton, { target: { value: "invalid" } });
    fireEvent.blur(spinbutton);

    expect(handleChange).not.toHaveBeenCalled();
  });
});

