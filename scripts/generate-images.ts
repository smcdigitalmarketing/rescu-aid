/**
 * Generates PDP imagery with Gemini image models from app/data/image-slots.ts.
 *
 *   npm run images                     # generate every missing slot
 *   npm run images -- --only v2        # slots whose id starts with "v2" (or an exact id)
 *   npm run images -- --force          # regenerate even if the file exists
 *   npm run images -- --model gemini-3-pro-image
 *   npm run images -- --dry-run        # print what would be generated
 *
 * Output: app/assets/generated/<id>.webp plus <id>.json (prompt + model), so
 * every image can be reproduced. Delete a .webp to fall back to the placeholder.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";
import { imageSlots, type ImageSlot } from "../app/data/image-slots.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "app/assets/generated");
const refDir = join(root, "assets/reference");

const { values: args } = parseArgs({
  options: {
    only: { type: "string" },
    force: { type: "boolean", default: false },
    model: { type: "string", default: "gemini-3.1-flash-image" },
    "dry-run": { type: "boolean", default: false },
  },
});

const slots = (Object.values(imageSlots) as ImageSlot[]).filter(
  (s) =>
    s.prompt &&
    (!args.only || s.id === args.only || s.id.startsWith(args.only)),
);
const todo = slots.filter(
  (s) => args.force || !existsSync(join(outDir, `${s.id}.webp`)),
);

console.log(
  `${slots.length} generatable slot(s), ${todo.length} to generate with ${args.model}.`,
);
if (args["dry-run"]) {
  for (const s of todo)
    console.log(
      ` · ${s.id} (${s.aspect ?? "1:1"}, ${s.size ?? "1K"}) refs=${s.refs?.join(",") ?? "-"}`,
    );
  process.exit(0);
}
if (!todo.length) process.exit(0);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is missing. Add it to .env (see .env.example).",
  );
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
mkdirSync(outDir, { recursive: true });

const refCache = new Map<string, string>();
const refData = (name: string) => {
  if (!refCache.has(name))
    refCache.set(
      name,
      readFileSync(join(refDir, `${name}.jpg`)).toString("base64"),
    );
  return refCache.get(name)!;
};

let failed = 0;
for (const slot of todo) {
  process.stdout.write(`→ ${slot.id} … `);
  try {
    const response = await ai.models.generateContent({
      model: args.model!,
      contents: [
        {
          role: "user",
          parts: [
            ...(slot.refs ?? []).map((r) => ({
              inlineData: { mimeType: "image/jpeg", data: refData(r) },
            })),
            { text: slot.prompt! },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
          aspectRatio: slot.aspect ?? "1:1",
          imageSize: slot.size ?? "1K",
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData?.data,
    );
    if (!part?.inlineData?.data) {
      const reason =
        response.candidates?.[0]?.finishReason ??
        response.promptFeedback?.blockReason ??
        "no image";
      throw new Error(`no image returned (${reason})`);
    }

    const file = join(outDir, `${slot.id}.webp`);
    await sharp(Buffer.from(part.inlineData.data, "base64"))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(file);
    writeFileSync(
      join(outDir, `${slot.id}.json`),
      JSON.stringify(
        {
          id: slot.id,
          model: args.model,
          aspect: slot.aspect,
          size: slot.size,
          refs: slot.refs,
          prompt: slot.prompt,
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      ) + "\n",
    );
    console.log("done");
  } catch (err) {
    failed++;
    console.log(`failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log(
  failed
    ? `${failed} slot(s) failed.`
    : "All done. Review every image before shipping.",
);
process.exit(failed ? 1 : 0);
