"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  WindowedFrameCache,
  drawImageCover,
  getClampedDevicePixelRatio,
} from "@/lib/canvas/frame-loader";
import { useScrollFrame } from "@/lib/canvas/use-scroll-frame";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, Sparkles } from "lucide-react";

export interface HeroCanvasScrubberProps {
  containerRef: React.RefObject<HTMLElement | null>;
  totalFrames?: number;
  posterUrl?: string;
  className?: string;
}

/**
 * Sticky canvas scrubber component for the honey harvesting sequence.
 * - Scrubs 150 frames with lerp dampening
 * - Bounded sliding window cache under 80MB
 * - Clamps device pixel ratio to max 2
 * - Accessible reduced motion fallback with manual scrubber control
 */
export function HeroCanvasScrubber({
  containerRef,
  totalFrames = 150,
  className,
}: HeroCanvasScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cache] = useState(
    () => new WindowedFrameCache(totalFrames, 8, "/frames")
  );

  const {
    frameIndex,
    progress,
    isReducedMotion,
    setManualFrame,
  } = useScrollFrame(containerRef, {
    totalFrames,
    damping: 0.14,
  });

  // Preload initial frames (1 to 16) and poster on mount
  useEffect(() => {
    // Load initial eager window (frames 1 to 16)
    const preloadInitialWindow = async () => {
      const promises: Promise<HTMLImageElement>[] = [];
      const initialWindowSize = Math.min(16, totalFrames);

      for (let i = 1; i <= initialWindowSize; i++) {
        promises.push(cache.loadFrame(i).catch(() => new Image()));
      }

      await Promise.allSettled(promises);
    };

    preloadInitialWindow();

    return () => {
      cache.clear();
    };
  }, [cache, totalFrames]);

  // Render canvas frame
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = getClampedDevicePixelRatio(2);
      const rect = canvas.getBoundingClientRect();

      // Only resize canvas buffer if display dimensions or DPR changed
      const targetWidth = Math.round(
        (rect.width || (typeof window !== "undefined" && window.innerWidth ? window.innerWidth : 640)) * dpr
      );
      const targetHeight = Math.round(
        (rect.height || (typeof window !== "undefined" && window.innerHeight ? window.innerHeight : 640)) * dpr
      );

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const img = cache.getLoadedFrame(index);

      if (img && img.complete && img.naturalWidth > 0) {
        drawImageCover(ctx, img, canvas.width, canvas.height);
      } else {
        // Asynchronously load and then draw
        cache.updateActiveWindow(index);
        cache
          .loadFrame(index)
          .then((loadedImg) => {
            if (canvasRef.current === canvas && loadedImg.complete) {
              drawImageCover(ctx, loadedImg, canvas.width, canvas.height);
            }
          })
          .catch(() => {
            // Keep previous frame on temporary network error
          });
      }
    },
    [cache]
  );

  // Redraw when frameIndex changes
  useEffect(() => {
    drawFrame(frameIndex);
  }, [drawFrame, frameIndex]);

  // Redraw on window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(frameIndex);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame, frameIndex]);

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-screen overflow-hidden flex items-center justify-center bg-cream-muted",
        className
      )}
    >
      {/* Full viewport canvas element */}
      <canvas
        ref={canvasRef}
        aria-label={`Interactive honey harvest animation frame ${frameIndex} of ${totalFrames}`}
        role="img"
        className="absolute inset-0 w-full h-full object-cover block"
      />

      {/* Editorial Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pointer-events-none pt-28 pb-12 px-4 sm:px-6 text-center">
        {/* Editorial Headline & Preamble */}
        <div className="max-w-4xl mx-auto flex flex-col items-center mt-6 sm:mt-12 pointer-events-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cream/90 backdrop-blur-md text-amber-950 border border-amber-200/80 text-xs font-semibold uppercase tracking-wider shadow-xs">
              <Sparkles size={13} className="text-amber-700" aria-hidden="true" />
              <span>Single Origin Reserve 2026</span>
            </span>
            <span className="text-xs font-serif italic text-amber-950/80 bg-cream/80 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-200/50">
              Direct from the Apiary
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-charcoal leading-[1.08] mb-5">
            Liquid Gold, Directly from the Wild Flora.
          </h1>

          <p className="font-sans text-base sm:text-lg text-charcoal/80 max-w-2xl mx-auto leading-relaxed">
            Harvested raw without pasteurization or fine pressure filtration.
            Scroll below to inspect the extraction viscosity of our Catskill Wildflower reserve frame by frame.
          </p>
        </div>
      </div>

      {/* Bottom indicator bar showing scroll progress across the 150 frames */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none z-20"
        aria-hidden="true"
      >
        <div
          className="h-full bg-amber-600 transition-all duration-75 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Accessible Reduced Motion Fallback & Manual Scrubber */}
      {isReducedMotion && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 pointer-events-auto">
          <div className="p-4 rounded-2xl bg-cream/95 backdrop-blur-md border border-amber-200/90 shadow-lg text-charcoal">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
                <SlidersHorizontal size={14} className="text-amber-800" aria-hidden="true" />
                <span>Reduced Motion Control</span>
              </div>
            </div>
            <p className="text-xs text-charcoal/80 mb-3 leading-relaxed">
              Scroll scrubbing is paused to respect your motion preferences. Use this manual slider to inspect the extraction sequence at your own pace.
            </p>
            <label htmlFor="manual-reduced-motion-slider" className="sr-only">
              Manual frame scrubber slider
            </label>
            <input
              id="manual-reduced-motion-slider"
              type="range"
              min={1}
              max={totalFrames}
              value={frameIndex}
              onChange={(e) => setManualFrame(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer h-2 bg-amber-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
