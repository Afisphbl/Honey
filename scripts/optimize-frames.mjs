import fs from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import sharp from "sharp";

const ROOT_DIR = process.cwd();
const ZIP_PATH = path.join(ROOT_DIR, "ezgif-15929baa46c6720a-png-split.zip");
const TEMP_RAW_DIR = path.join(ROOT_DIR, "temp-raw-frames");
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "frames");
const TOTAL_FRAMES = 150;
const WEBP_QUALITY = 82;

async function ensureRawFrames() {
  if (existsSync(TEMP_RAW_DIR)) {
    const existing = await fs.readdir(TEMP_RAW_DIR);
    if (existing.length >= TOTAL_FRAMES) {
      console.log(`Found ${existing.length} raw frames in temporary directory.`);
      return;
    }
  }

  if (!existsSync(ZIP_PATH)) {
    throw new Error(`Zip archive not found at ${ZIP_PATH}`);
  }

  if (!existsSync(TEMP_RAW_DIR)) {
    mkdirSync(TEMP_RAW_DIR, { recursive: true });
  }

  console.log("Extracting raw PNG frames from archive...");
  execSync(`tar -xf "${ZIP_PATH}" -C "${TEMP_RAW_DIR}"`, { stdio: "inherit" });
}

async function optimizeFrames() {
  console.log("Starting frame optimization pipeline...");
  await ensureRawFrames();

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = (await fs.readdir(TEMP_RAW_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort();

  if (files.length === 0) {
    throw new Error("No PNG frames found to optimize");
  }

  console.log(`Processing ${files.length} frames with Sharp into WebP...`);

  let totalBytes = 0;
  const frameRecords = [];
  const keyframes = [];

  // Inspect first frame for metadata
  const firstFramePath = path.join(TEMP_RAW_DIR, files[0]);
  const sampleMeta = await sharp(firstFramePath).metadata();
  const width = sampleMeta.width ?? 1280;
  const height = sampleMeta.height ?? 720;

  // Process frames in batches of 6 for fast parallel conversion without memory spikes
  const concurrency = 6;
  for (let i = 0; i < files.length; i += concurrency) {
    const chunk = files.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async (filename, chunkIndex) => {
        const frameIndex = i + chunkIndex + 1;
        const inputPath = path.join(TEMP_RAW_DIR, filename);
        const outputFilename = `frame-${String(frameIndex).padStart(3, "0")}.webp`;
        const outputPath = path.join(OUTPUT_DIR, outputFilename);

        const isKeyframe = frameIndex === 1 || frameIndex % 15 === 0 || frameIndex === TOTAL_FRAMES;
        if (isKeyframe) {
          keyframes.push(frameIndex);
        }

        const buffer = await sharp(inputPath)
          .webp({ quality: WEBP_QUALITY, effort: 4 })
          .toBuffer();

        await fs.writeFile(outputPath, buffer);
        totalBytes += buffer.length;

        frameRecords.push({
          index: frameIndex,
          filename: outputFilename,
          path: `/frames/${outputFilename}`,
          sizeBytes: buffer.length,
          keyframe: isKeyframe,
        });

        // Also save poster WebP from frame 1
        if (frameIndex === 1) {
          const posterPath = path.join(OUTPUT_DIR, "poster.webp");
          await fs.writeFile(posterPath, buffer);
        }
      })
    );
    process.stdout.write(`\rConverted ${Math.min(i + concurrency, files.length)} / ${files.length} frames...`);
  }

  console.log("\nSorting manifest records...");
  frameRecords.sort((a, b) => a.index - b.index);
  keyframes.sort((a, b) => a - b);

  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`Total WebP asset size: ${totalMb} MB (${totalBytes} bytes)`);

  const manifest = {
    version: "1.0.0",
    totalFrames: frameRecords.length,
    format: "webp",
    dimensions: {
      width,
      height,
      aspectRatio: Number((width / height).toFixed(4)),
    },
    totalSizeBytes: totalBytes,
    totalSizeMb: Number(totalMb),
    poster: "/frames/poster.webp",
    keyframes,
    frames: frameRecords,
  };

  const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Wrote manifest to ${manifestPath}`);

  // Clean up temporary raw frames folder to keep disk clean
  try {
    await fs.rm(TEMP_RAW_DIR, { recursive: true, force: true });
    console.log("Cleaned up temporary raw frames directory.");
  } catch (err) {
    console.warn("Could not remove temp raw frames directory:", err.message);
  }

  console.log("Frame optimization complete!");
}

optimizeFrames().catch((err) => {
  console.error("Frame optimization failed:", err);
  process.exit(1);
});
