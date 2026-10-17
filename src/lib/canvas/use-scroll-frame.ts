"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkPrefersReducedMotion } from "./frame-loader";

export interface UseScrollFrameOptions {
  totalFrames?: number;
  damping?: number;
  initialFrame?: number;
  disabled?: boolean;
}

export interface UseScrollFrameReturn {
  frameIndex: number;
  progress: number;
  targetFrame: number;
  isReducedMotion: boolean;
  setManualFrame: (frame: number) => void;
  setManualProgress: (progress: number) => void;
}

/**
 * Custom hook to synchronize HTML5 canvas animation frames with container scroll.
 * Uses requestAnimationFrame with lerp dampening for 60fps performance.
 * Bounded by totalFrames (default 150) and honors system reduced motion preferences.
 */
export function useScrollFrame(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseScrollFrameOptions = {}
): UseScrollFrameReturn {
  const {
    totalFrames = 150,
    damping = 0.12,
    initialFrame = 1,
    disabled = false,
  } = options;

  const [frameIndex, setFrameIndex] = useState<number>(initialFrame);
  const [progress, setProgress] = useState<number>(0);
  const [targetFrame, setTargetFrame] = useState<number>(initialFrame);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() =>
    checkPrefersReducedMotion()
  );

  const currentFrameRef = useRef<number>(initialFrame);
  const targetFrameRef = useRef<number>(initialFrame);
  const progressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isReducedMotionRef = useRef<boolean>(false);

  // Synchronize reduced motion state
  useEffect(() => {
    isReducedMotionRef.current = checkPrefersReducedMotion();

    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      isReducedMotionRef.current = e.matches;
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const setManualFrame = useCallback(
    (frame: number) => {
      const clamped = Math.max(1, Math.min(totalFrames, Math.round(frame)));
      const nextProgress = (clamped - 1) / Math.max(1, totalFrames - 1);

      currentFrameRef.current = clamped;
      targetFrameRef.current = clamped;
      progressRef.current = nextProgress;

      setFrameIndex(clamped);
      setTargetFrame(clamped);
      setProgress(nextProgress);
    },
    [totalFrames]
  );

  const setManualProgress = useCallback(
    (nextProgress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, nextProgress));
      const target = Math.round(1 + clampedProgress * (totalFrames - 1));
      setManualFrame(target);
    },
    [setManualFrame, totalFrames]
  );

  useEffect(() => {
    if (disabled || isReducedMotion) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    let isSubscribed = true;

    const tick = () => {
      if (!isSubscribed) return;

      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      const delta = target - current;

      if (Math.abs(delta) > 0.005) {
        const next = current + delta * damping;
        currentFrameRef.current = next;

        const rounded = Math.max(1, Math.min(totalFrames, Math.round(next)));
        setFrameIndex((prev) => (prev !== rounded ? rounded : prev));
        setProgress(progressRef.current);
        setTargetFrame(target);

        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        // Snapped to target
        currentFrameRef.current = target;
        setFrameIndex((prev) => (prev !== target ? target : prev));
        setProgress(progressRef.current);
        setTargetFrame(target);
        rafIdRef.current = null;
      }
    };

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight || 1;
      const maxScroll = container.offsetHeight - windowHeight;

      if (maxScroll <= 0) {
        progressRef.current = 0;
        targetFrameRef.current = 1;
      } else {
        const scrolledDistance = -rect.top;
        const rawProgress = scrolledDistance / maxScroll;
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));
        progressRef.current = clampedProgress;

        const nextTarget = Math.round(1 + clampedProgress * (totalFrames - 1));
        targetFrameRef.current = Math.max(1, Math.min(totalFrames, nextTarget));
      }

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    // Calculate initial frame position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      isSubscribed = false;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [containerRef, damping, disabled, isReducedMotion, totalFrames]);

  return {
    frameIndex,
    progress,
    targetFrame,
    isReducedMotion,
    setManualFrame,
    setManualProgress,
  };
}
