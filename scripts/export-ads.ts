/**
 * Screenshots every creative from /ads/render/* at native size.
 *
 *   npm run dev                                   # in another terminal
 *   npm run ads:export -- --base http://localhost:5173
 *
 * Output:
 *   app/assets/ads/<ad-id>.png                    image ads (shown and downloadable on /ads)
 *   assets/video/overlays/<video>.<overlay>.png   transparent caption layers for build-videos
 *   assets/video/overlays/<video>.end.png         end cards
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { chromium, type Browser } from "playwright-core";
import { FORMAT_PX, imageAds, videoAds } from "../app/data/ads.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const adsDir = join(root, "app/assets/ads");
const overlayDir = join(root, "assets/video/overlays");
mkdirSync(adsDir, { recursive: true });
mkdirSync(overlayDir, { recursive: true });

const { values: args } = parseArgs({
  options: {
    base: {
      type: "string",
      default: process.env.ADS_BASE_URL ?? "http://localhost:5173",
    },
  },
});
const base = args.base!.replace(/\/$/, "");

async function launch(): Promise<Browser> {
  // Prefer the installed Google Chrome; fall back to a Playwright-managed Chromium.
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return await chromium.launch();
  }
}

const browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
});

async function shoot(
  path: string,
  file: string,
  height: number,
  transparent: boolean,
) {
  const res = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  if (!res?.ok())
    throw new Error(
      `${path} returned ${res?.status()} (is the dev server running at ${base}?)`,
    );
  await page.setViewportSize({ width: 1080, height });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) =>
        i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)),
      ),
    );
  });
  await page
    .locator("#ad")
    .screenshot({ path: file, omitBackground: transparent });
  console.log(`✓ ${file.replace(root + "/", "")}`);
}

for (const ad of imageAds) {
  await shoot(
    `/ads/render/image/${ad.id}`,
    join(adsDir, `${ad.id}.png`),
    FORMAT_PX[ad.format][1],
    false,
  );
}
for (const video of videoAds) {
  for (const o of video.overlays) {
    await shoot(
      `/ads/render/overlay/${video.id}.${o.id}`,
      join(overlayDir, `${video.id}.${o.id}.png`),
      1920,
      true,
    );
  }
  await shoot(
    `/ads/render/end/${video.id}`,
    join(overlayDir, `${video.id}.end.png`),
    1920,
    false,
  );
}

await browser.close();
