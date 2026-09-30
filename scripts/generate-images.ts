/**
 * Generates PDP imagery with Gemini image models from app/data/image-slots.ts.
 *
 *   npm run images -- --reference        # step 1: make assets/reference/device.jpg from kit.jpg
 *   npm run images                       # generate every missing slot
 *   npm run images -- --only v2          # slots whose id starts with "v2" (or an exact id)
 *   npm run images -- --force            # regenerate even if the file exists
 *   npm run images -- --model gemini-3.1-flash-image
 *   npm run images -- --dry-run          # list what would be generated and the estimated cost
 *
 * Output: app/assets/generated/<id>.webp plus <id>.json (prompt, model, cost),
 * so every image can be reproduced. Delete a .webp to fall back to the placeholder.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  GoogleGenAI,
  Modality,
  type GenerateContentResponse,
} from "@google/genai";
import sharp from "sharp";
import { imageSlots, type ImageSlot } from "../app/data/image-slots.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "app/assets/generated");
const refDir = join(root, "assets/reference");

/** USD per 1M tokens, paid tier (ai.google.dev/gemini-api/docs/pricing, 2026-09-30). */
const PRICES: Record<
  string,
  { input: number; output: number; perImage: number }
> = {
  "gemini-3-pro-image": { input: 2, output: 120, perImage: 0.134 },
  "gemini-3.1-flash-image": { input: 0.5, output: 60, perImage: 0.101 },
  "gemini-3.1-flash-lite-image": { input: 0.25, output: 30, perImage: 0.034 },
};

const REFERENCE_PROMPT =
  "Edit this photo. Keep only the single red handheld suction device with its attached clear face mask, exactly as it is: same shape, colour, knurling, white arrow label and mask. Remove everything else: the pouch, the leaflets and cards, and the loose masks. Place the device on a plain pure-white background, lying diagonally, fully in frame with even margins and a soft natural shadow. Do not add anything.";

const { values: args } = parseArgs({
  options: {
    reference: { type: "boolean", default: false },
    only: { type: "string" },
    force: { type: "boolean", default: false },
    model: { type: "string", default: "gemini-3-pro-image" },
    "dry-run": { type: "boolean", default: false },
  },
});
const model = args.model!;
const price = PRICES[model];

const slots = (Object.values(imageSlots) as ImageSlot[]).filter(
  (s) =>
    s.prompt &&
    (!args.only || s.id === args.only || s.id.startsWith(args.only)),
);
const todo = args.reference
  ? []
  : slots.filter(
      (s) => args.force || !existsSync(join(outDir, `${s.id}.webp`)),
    );

if (!args.reference) {
  const estimate = price
    ? ` (≈ $${(todo.length * price.perImage).toFixed(2)})`
    : "";
  console.log(
    `${slots.length} generatable slot(s), ${todo.length} to generate with ${model}${estimate}.`,
  );
  if (args["dry-run"]) {
    for (const s of todo)
      console.log(
        ` · ${s.id} (${s.aspect ?? "1:1"}) refs=${s.refs?.join(",") ?? "-"}`,
      );
    process.exit(0);
  }
  if (!todo.length) process.exit(0);
  const missing = [...new Set(todo.flatMap((s) => s.refs ?? []))].filter(
    (r) => !existsSync(join(refDir, `${r}.jpg`)),
  );
  if (missing.length) {
    console.error(
      `Missing reference image(s): ${missing.join(", ")}. Run \`npm run images -- --reference\` first.`,
    );
    process.exit(1);
  }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is missing. Add it to .env (see .env.example).",
  );
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });

const refData = (name: string) =>
  readFileSync(join(refDir, `${name}.jpg`)).toString("base64");

function costOf(res: GenerateContentResponse) {
  const u = res.usageMetadata;
  if (!price || !u) return undefined;
  return (
    ((u.promptTokenCount ?? 0) * price.input +
      (u.candidatesTokenCount ?? 0) * price.output) /
    1e6
  );
}

async function generate(prompt: string, refs: string[], aspect: string) {
  const res = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          ...refs.map((r) => ({
            inlineData: { mimeType: "image/jpeg", data: refData(r) },
          })),
          { text: prompt },
        ],
      },
    ],
    config: {
      responseModalities: [Modality.IMAGE],
      imageConfig: { aspectRatio: aspect, imageSize: "2K" },
    },
  });
  const part = res.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.data,
  );
  if (!part?.inlineData?.data) {
    const reason =
      res.candidates?.[0]?.finishReason ??
      res.promptFeedback?.blockReason ??
      "no image";
    throw new Error(`no image returned (${reason})`);
  }
  return {
    image: Buffer.from(part.inlineData.data, "base64"),
    cost: costOf(res),
    usage: res.usageMetadata,
  };
}

const fmt = (n?: number) => (n === undefined ? "" : ` ($${n.toFixed(3)})`);
let spent = 0;
let failed = 0;

if (args.reference) {
  process.stdout.write("→ device reference … ");
  const { image, cost } = await generate(REFERENCE_PROMPT, ["kit"], "1:1");
  await sharp(image).jpeg({ quality: 92 }).toFile(join(refDir, "device.jpg"));
  console.log(
    `done${fmt(cost)} → assets/reference/device.jpg. Review it before generating slots.`,
  );
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
for (const slot of todo) {
  process.stdout.write(`→ ${slot.id} … `);
  try {
    const { image, cost, usage } = await generate(
      slot.prompt!,
      slot.refs ?? [],
      slot.aspect ?? "1:1",
    );
    await sharp(image)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(outDir, `${slot.id}.webp`));
    writeFileSync(
      join(outDir, `${slot.id}.json`),
      JSON.stringify(
        {
          id: slot.id,
          model,
          aspect: slot.aspect ?? "1:1",
          refs: slot.refs,
          prompt: slot.prompt,
          usage: {
            input: usage?.promptTokenCount,
            output: usage?.candidatesTokenCount,
          },
          costUsd: cost,
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      ) + "\n",
    );
    spent += cost ?? 0;
    console.log(`done${fmt(cost)}`);
  } catch (err) {
    failed++;
    console.log(`failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log(
  `Spent ≈ $${spent.toFixed(2)}.${failed ? ` ${failed} slot(s) failed.` : " Review every image before shipping."}`,
);
process.exit(failed ? 1 : 0);
