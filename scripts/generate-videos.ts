/**
 * Generates the Veo clips for the video ads (app/data/ads.ts → videoClips).
 * Each clip is image-to-video from its generated 9:16 first frame, 8s, 1080p.
 *
 *   npm run videos -- --dry-run               # show clips and estimated cost
 *   npm run videos -- --tier draft            # Veo 3.1 Fast ($0.12/s)
 *   npm run videos -- --tier final            # Veo 3.1 ($0.40/s), for approved takes
 *   npm run videos -- --only A1 --force       # redo one clip
 *
 * Output: assets/video/<tier>/<clip>.mp4 + <clip>.json (prompt, model, cost).
 * build-videos uses the final take when present, otherwise the draft.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { VEO_NEGATIVE, videoClips } from "../app/data/ads.ts";
import {
  CLIP_SECONDS,
  VIDEO_PRICES,
  VIDEO_TIERS,
} from "../app/data/pricing.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const { values: args } = parseArgs({
  options: {
    tier: { type: "string", default: "draft" },
    only: { type: "string" },
    force: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
  },
});
const tier = args.tier as keyof typeof VIDEO_TIERS;
if (!(tier in VIDEO_TIERS)) {
  console.error(
    `--tier must be one of: ${Object.keys(VIDEO_TIERS).join(", ")}`,
  );
  process.exit(1);
}
const model = VIDEO_TIERS[tier];
const clipCost = VIDEO_PRICES[model]["1080p"] * CLIP_SECONDS;
const outDir = join(root, "assets/video", tier);

const todo = videoClips.filter(
  (c) =>
    (!args.only || c.id === args.only) &&
    (args.force || !existsSync(join(outDir, `${c.id}.mp4`))),
);
console.log(
  `${todo.length} clip(s) to generate with ${model} at 1080p (≈ $${(todo.length * clipCost).toFixed(2)}).`,
);
if (args["dry-run"] || !todo.length) {
  for (const c of todo) console.log(` · ${c.id} from ${c.firstFrame}`);
  process.exit(0);
}

const missing = todo.filter(
  (c) =>
    !existsSync(join(root, "app/assets/generated", `${c.firstFrame}.webp`)),
);
if (missing.length) {
  console.error(
    `Missing first frames: ${missing.map((c) => c.firstFrame).join(", ")}. Run \`npm run images\` first.`,
  );
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is missing. Add it to .env (see .env.example).",
  );
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });
mkdirSync(outDir, { recursive: true });

async function generateClip(clip: (typeof videoClips)[number]) {
  const frame = await sharp(
    join(root, "app/assets/generated", `${clip.firstFrame}.webp`),
  )
    .png()
    .toBuffer();
  let op = await ai.models.generateVideos({
    model,
    prompt: clip.prompt,
    image: { imageBytes: frame.toString("base64"), mimeType: "image/png" },
    config: {
      aspectRatio: "9:16",
      durationSeconds: CLIP_SECONDS,
      resolution: "1080p",
      personGeneration: "allow_adult",
      negativePrompt: VEO_NEGATIVE,
      numberOfVideos: 1,
    },
  });
  const started = Date.now();
  while (!op.done) {
    if (Date.now() - started > 10 * 60_000)
      throw new Error("timed out after 10 minutes");
    await new Promise((r) => setTimeout(r, 10_000));
    op = await ai.operations.getVideosOperation({ operation: op });
  }
  if (op.error) throw new Error(JSON.stringify(op.error));
  const video = op.response?.generatedVideos?.[0]?.video;
  if (!video) {
    const reasons =
      op.response?.raiMediaFilteredReasons?.join("; ") ?? "no video returned";
    throw new Error(`blocked or empty: ${reasons}`);
  }
  const file = join(outDir, `${clip.id}.mp4`);
  if (video.videoBytes)
    writeFileSync(file, Buffer.from(video.videoBytes, "base64"));
  else await ai.files.download({ file: video, downloadPath: file });
  return { file, seconds: Math.round((Date.now() - started) / 1000) };
}

let spent = 0;
let failed = 0;
for (const clip of todo) {
  process.stdout.write(`→ ${clip.id} (${tier}) … `);
  try {
    const { file, seconds } = await generateClip(clip);
    writeFileSync(
      file.replace(/\.mp4$/, ".json"),
      JSON.stringify(
        {
          id: clip.id,
          model,
          tier,
          firstFrame: clip.firstFrame,
          prompt: clip.prompt,
          negativePrompt: VEO_NEGATIVE,
          costUsd: clipCost,
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      ) + "\n",
    );
    spent += clipCost;
    console.log(`done in ${seconds}s ($${clipCost.toFixed(2)})`);
  } catch (err) {
    failed++;
    console.log(`failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
console.log(
  `Spent ≈ $${spent.toFixed(2)}.${failed ? ` ${failed} clip(s) failed.` : " Review every clip before building."}`,
);
process.exit(failed ? 1 : 0);
