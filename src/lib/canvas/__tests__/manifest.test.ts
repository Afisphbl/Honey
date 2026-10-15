import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type { FrameManifest } from "../frame-loader";

describe("Hero frame asset manifest (covers AC-2)", () => {
  it("verifies manifest exists with 150 WebP frames and total size under 15MB (AC-2)", () => {
    const manifestPath = path.join(process.cwd(), "public", "frames", "manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const raw = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(raw) as FrameManifest;

    expect(manifest.totalFrames).toBe(150);
    expect(manifest.format).toBe("webp");
    expect(manifest.dimensions.width).toBe(1280);
    expect(manifest.dimensions.height).toBe(720);
    expect(manifest.frames).toHaveLength(150);
    expect(manifest.keyframes.length).toBeGreaterThan(5);

    // AC-2 requires total assets under 15MB
    const maxAllowedBytes = 15 * 1024 * 1024;
    expect(manifest.totalSizeBytes).toBeLessThan(maxAllowedBytes);

    // Verify first and last frame files exist on disk
    const frame1 = path.join(process.cwd(), "public", "frames", "frame-001.webp");
    const frame150 = path.join(process.cwd(), "public", "frames", "frame-150.webp");
    const poster = path.join(process.cwd(), "public", "frames", "poster.webp");

    expect(fs.existsSync(frame1)).toBe(true);
    expect(fs.existsSync(frame150)).toBe(true);
    expect(fs.existsSync(poster)).toBe(true);
  });
});
