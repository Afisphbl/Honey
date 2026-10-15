/**
 * Windowed Frame Cache and Canvas Utilities for Honey Storefront
 *
 * Implements safeguards required by AC-6:
 * - Caps device pixel ratio at Math.min(window.devicePixelRatio, 2)
 * - Retains only an active sliding window of frames to bound browser RAM under 80MB
 * - Honors prefers-reduced-motion: reduce with static poster fallback
 */

export interface FrameManifest {
  version: string;
  totalFrames: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  totalSizeBytes: number;
  totalSizeMb: number;
  poster: string;
  keyframes: number[];
  frames: Array<{
    index: number;
    filename: string;
    path: string;
    sizeBytes: number;
    keyframe: boolean;
  }>;
}

export function getClampedDevicePixelRatio(maxDpr = 2): number {
  if (typeof window === "undefined") {
    return 1;
  }
  return Math.min(window.devicePixelRatio || 1, maxDpr);
}

export function checkPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export class WindowedFrameCache {
  private totalFrames: number;
  private windowRadius: number;
  private basePath: string;
  private cache: Map<number, HTMLImageElement> = new Map();
  private pendingLoads: Map<number, Promise<HTMLImageElement>> = new Map();

  constructor(totalFrames = 150, windowRadius = 8, basePath = "/frames") {
    this.totalFrames = totalFrames;
    this.windowRadius = windowRadius;
    this.basePath = basePath;
  }

  public getFramePath(frameIndex: number): string {
    const clamped = Math.max(1, Math.min(frameIndex, this.totalFrames));
    return `${this.basePath}/frame-${String(clamped).padStart(3, "0")}.webp`;
  }

  public getPosterPath(): string {
    return `${this.basePath}/poster.webp`;
  }

  public getLoadedFrame(frameIndex: number): HTMLImageElement | undefined {
    return this.cache.get(frameIndex);
  }

  public getCacheSize(): number {
    return this.cache.size;
  }

  public async loadFrame(frameIndex: number): Promise<HTMLImageElement> {
    const clamped = Math.max(1, Math.min(frameIndex, this.totalFrames));

    if (this.cache.has(clamped)) {
      return this.cache.get(clamped)!;
    }

    if (this.pendingLoads.has(clamped)) {
      return this.pendingLoads.get(clamped)!;
    }

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        this.cache.set(clamped, img);
        this.pendingLoads.delete(clamped);
        resolve(img);
      };
      img.onerror = (err) => {
        this.pendingLoads.delete(clamped);
        reject(new Error(`Failed to load frame ${clamped}: ${err}`));
      };
      img.src = this.getFramePath(clamped);
    });

    this.pendingLoads.set(clamped, loadPromise);
    return loadPromise;
  }

  public updateActiveWindow(currentFrame: number): void {
    const minKeep = Math.max(1, currentFrame - this.windowRadius);
    const maxKeep = Math.min(this.totalFrames, currentFrame + this.windowRadius);

    // Evict frames outside the window to enforce memory bound
    for (const [index] of this.cache) {
      if (index < minKeep || index > maxKeep) {
        this.cache.delete(index);
      }
    }

    // Speculatively load adjacent frames within window
    for (let i = minKeep; i <= maxKeep; i++) {
      if (!this.cache.has(i) && !this.pendingLoads.has(i)) {
        this.loadFrame(i).catch(() => {});
      }
    }
  }

  public clear(): void {
    this.cache.clear();
    this.pendingLoads.clear();
  }
}

/**
 * Draw image onto 2D canvas with cover aspect ratio fitting
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number
): void {
  const imgWidth = (img as HTMLImageElement).naturalWidth || img.width;
  const imgHeight = (img as HTMLImageElement).naturalHeight || img.height;

  if (!imgWidth || !imgHeight) return;

  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = imgWidth / imgHeight;

  let renderWidth = canvasWidth;
  let renderHeight = canvasHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    renderWidth = canvasHeight * imgRatio;
    offsetX = (canvasWidth - renderWidth) / 2;
  } else {
    renderHeight = canvasWidth / imgRatio;
    offsetY = (canvasHeight - renderHeight) / 2;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
}
