"use client";

import React, { useRef } from "react";
import { ProductWithRelations } from "@/types/catalog";
import { HeroCanvasScrubber } from "./hero-canvas-scrubber";

export interface StorefrontHeroSectionProps {
  product: ProductWithRelations;
}

/**
 * Full screen hero section driving 150 frame canvas animation over a 300vh track.
 * Pinning sticky in viewport while scroll scrubbing through extraction sequence.
 * Satisfies AC-1, AC-2, AC-3, AC-4.
 */
export function StorefrontHeroSection({ product }: StorefrontHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300vh] bg-cream"
      id="hero-scroll-track"
      aria-label="Interactive harvest animation"
    >
      {/* Full screen sticky viewport container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <HeroCanvasScrubber
          containerRef={containerRef}
          totalFrames={150}
          posterUrl={product.heroPosterUrl || "/frames/poster.webp"}
        />
      </div>
    </section>
  );
}
