/**
 * Gemini API paid-tier prices in USD (ai.google.dev/gemini-api/docs/pricing,
 * checked 2026-09-30). Shared by the /ads cost table and the generator
 * scripts. Plain data, no imports, so Node can load it directly.
 */

export const PRICED_AT = "2026-09-30";

/** Per 1M tokens; perImage is the list price for a 1K/2K output image. */
export const IMAGE_PRICES: Record<
  string,
  { input: number; output: number; perImage: number }
> = {
  "gemini-3-pro-image": { input: 2, output: 120, perImage: 0.134 },
  "gemini-3.1-flash-image": { input: 0.5, output: 60, perImage: 0.101 },
  "gemini-3.1-flash-lite-image": { input: 0.25, output: 30, perImage: 0.034 },
};

/** What a Pro image actually cost us, including the reference-photo input tokens. */
export const OBSERVED_IMAGE_COST = 0.16;

/** Per second of generated video (audio included). */
export const VIDEO_PRICES: Record<string, Record<"720p" | "1080p", number>> = {
  "veo-3.1-generate-preview": { "720p": 0.4, "1080p": 0.4 },
  "veo-3.1-fast-generate-preview": { "720p": 0.1, "1080p": 0.12 },
  "veo-3.1-lite-generate-preview": { "720p": 0.05, "1080p": 0.08 },
};

/** Draft on Fast to iterate cheaply; render the chosen takes on the full model. */
export const VIDEO_TIERS = {
  draft: "veo-3.1-fast-generate-preview",
  final: "veo-3.1-generate-preview",
} as const;

/** Veo 3.1 at 1080p only produces 8-second clips. */
export const CLIP_SECONDS = 8;
