/**
 * Paid-social creatives: 5 image ads and 2 video ads, each tied to a PDP
 * variant. Visual text is rendered in HTML (app/components/ads) so it stays
 * sharp, editable and typo-free; only the photography is generated.
 *
 * Copy rules (same as the PDPs): no FDA / "Made in USA" / stats claims unless
 * enabled in claims.ts; always position RescUAid+ after back blows and
 * abdominal thrusts; never address the viewer's age, health or living
 * situation directly (Meta personal-attributes policy): say "for anyone who
 * lives alone", not "Do you live alone?".
 */
import type { SlotId } from "./image-slots";

export type AdFormat = "4:5" | "1:1" | "9:16";

export const FORMAT_PX: Record<AdFormat, [number, number]> = {
  "4:5": [1080, 1350],
  "1:1": [1080, 1080],
  "9:16": [1080, 1920],
};

export const FORMAT_LABEL: Record<AdFormat, string> = {
  "4:5": "Feed 4:5 · 1080×1350",
  "1:1": "Feed 1:1 · 1080×1080",
  "9:16": "Stories / Reels / TikTok 9:16 · 1080×1920",
};

export type AdCopy = {
  /** Meta primary text. Two variants to test; keep the hook in the first 125 characters. */
  primary: [string, string];
  /** Meta headline, ~40 characters. */
  headline: string;
  /** Meta description, ~27 characters. */
  description: string;
  cta: "Shop Now" | "Learn More";
  /** TikTok ad text, max 100 characters. */
  tiktok: string;
};

type Landing = "v1" | "v2" | "v3";
/** PDP theme whose fonts and colours the creative borrows. */
export type AdTheme = "v1" | "v2" | "v3";

export type ImageAd = {
  id: string;
  name: string;
  angle: string;
  format: AdFormat;
  theme: AdTheme;
  bg: SlotId;
  landing: Landing;
  copy: AdCopy;
};

export type VideoClip = {
  id: string;
  /** Generated 9:16 first frame (image-to-video keeps the product accurate). */
  firstFrame: SlotId;
  /** Optional last frame; pinning both ends stops Veo from redesigning the product mid-motion. */
  lastFrame?: SlotId;
  prompt: string;
};

export type Overlay = {
  id: string;
  kicker?: string;
  title: string;
  sub?: string;
};

export type VideoAd = {
  id: string;
  name: string;
  angle: string;
  theme: AdTheme;
  landing: Landing;
  copy: AdCopy;
  /** Each segment trims one 8s Veo clip and shows overlays over it in order. */
  segments: {
    clip: string;
    trim: [number, number];
    overlays: { overlay: string; from: number; to: number }[];
  }[];
  overlays: Overlay[];
  /** Seconds the branded end card is held. */
  endCard: number;
};

export const imageAds: ImageAd[] = [
  {
    id: "ad-backup",
    theme: "v1",
    name: "The backup plan",
    angle: "Clarity & trust: correct first-aid order, product as the next step",
    format: "4:5",
    bg: "adBackup",
    landing: "v1",
    copy: {
      primary: [
        "Back blows and abdominal thrusts always come first. But if they aren't working, what's your next step?\n\nRescUAid+ is a simple place, press, pull backup, with adult and child masks in every kit. No batteries, no expiry unless used.",
        "Most of us hope we'll never need it. RescUAid+ is the backup to recognized choking first aid: place, press, pull. Covered by a 90-day money-back guarantee.",
      ],
      headline: "The backup plan for choking emergencies",
      description: "Adult + child masks included",
      cta: "Shop Now",
      tiktok:
        "Back blows first. If they aren't working: place, press, pull. The RescUAid+ backup plan.",
    },
  },
  {
    id: "ad-every-room",
    theme: "v2",
    name: "Every room, every age",
    angle: "Family story + one kit per room (drives multi-kit bundles)",
    format: "4:5",
    bg: "adEveryRoom",
    landing: "v2",
    copy: {
      primary: [
        "Choking can happen at any age, anywhere there's food. Keep a RescUAid+ kit in the kitchen, the car and at the grandparents'.\n\nBuy 2, get the 3rd free: one for every floor.",
        "From high chairs to Sunday dinners at Grandma's, keep a backup within reach of every table. Adult and child masks in every kit.",
      ],
      headline: "Buy 2, get 1 free: one for every floor",
      description: "Adult + child masks included",
      cta: "Shop Now",
      tiktok:
        "High chairs, Sunday dinners, road-trip snacks. One RescUAid+ for every table. Buy 2, get 1 free.",
    },
  },
  {
    id: "ad-offer",
    theme: "v3",
    name: "Buy 2, get 1 free",
    angle: "Offer-first for retargeting and warm audiences",
    format: "1:1",
    bg: "adOffer",
    landing: "v3",
    copy: {
      primary: [
        "Buy 2, get 1 free, plus a free Choking Response Handbook. 3 RescUAid+ kits for $119.98, with adult and child masks in every kit.",
        "Still thinking about it? 3 kits for the price of 2, plus a free handbook. Ships from the US in 1–2 business days, with a 90-day money-back guarantee.",
      ],
      headline: "3 kits for the price of 2",
      description: "Free handbook included",
      cta: "Shop Now",
      tiktok:
        "3 RescUAid+ kits for the price of 2 + a free Choking Response Handbook.",
    },
  },
  {
    id: "ad-alone",
    theme: "v2",
    name: "When no one else is there",
    angle:
      "Self-rescue: designed to be self-applied (third person, policy-safe)",
    format: "4:5",
    bg: "adAlone",
    landing: "v2",
    copy: {
      primary: [
        "For anyone who lives alone, a choking emergency is a frightening thought. RescUAid+ is designed to be self-applied: place, press, pull.\n\nCall 911 first if you can, then follow standard first aid.",
        "A thoughtful addition to a parent's kitchen, especially if they live on their own. Designed to be self-applied, with adult and child masks in every kit.",
      ],
      headline: "Designed for when no one else is there",
      description: "Self-applied in 3 steps",
      cta: "Shop Now",
      tiktok:
        "Designed to be self-applied in 3 steps. A thoughtful addition to any kitchen.",
    },
  },
  {
    id: "ad-gift",
    theme: "v2",
    name: "The gift for Grandma's kitchen",
    angle: "Seasonal gifting for Q4 (Stories / Reels / TikTok)",
    format: "9:16",
    bg: "adGift",
    landing: "v3",
    copy: {
      primary: [
        "The gift they'll hope they never use. RescUAid+ for Grandma's kitchen, with a child mask for when the grandkids visit.",
        "Buy 2, get 1 free: one for your home, one for theirs, one for the car.",
      ],
      headline: "A gift for Grandma's kitchen",
      description: "Buy 2, get 1 free",
      cta: "Shop Now",
      tiktok:
        "The gift they'll hope they never use. RescUAid+ for Grandma's kitchen. Buy 2, get 1 free.",
    },
  },
];

const VEO_RULES =
  "The red device must keep exactly the same shape, colour, white arrow label and clear mask as in the first frame throughout. No dialogue, no voiceover, no music; quiet natural room tone only. No on-screen text.";

/**
 * Visual exclusions only. Sound words ("choking, coughing, gagging") here made
 * Veo's audio filter reject the quieter clips; the prompts themselves keep
 * every scene calm.
 */
export const VEO_NEGATIVE =
  "text, captions, subtitles, logos, watermark, distorted hands, extra fingers, extra devices, morphing product";

export const videoClips: VideoClip[] = [
  {
    id: "A1",
    firstFrame: "vidA1",
    lastFrame: "vidA2",
    prompt: `Calm first-aid training demonstration. The instructor steadily moves the red device forward and places its clear mask over the seated volunteer's mouth and nose with a secure seal, while the camera slowly pushes in to a close-up of the mask, the device and her hand. Steady, unhurried movements. ${VEO_RULES}`,
  },
  {
    id: "A2",
    firstFrame: "vidA2",
    prompt: `Close-up. Keeping the mask sealed, the instructor pulls the handle of the red device straight back, away from the volunteer's face, in one smooth motion, then lowers the device. The volunteer takes a relaxed breath and gives a small thumbs up. Calm training setting. ${VEO_RULES}`,
  },
  {
    id: "B1",
    firstFrame: "vidB1",
    prompt: `Slow cinematic dolly-in past the family laughing over dinner, ending on the red device on the kitchen counter, centred and in sharp focus. Warm golden-hour light, gentle kitchen sounds and soft laughter. ${VEO_RULES}`,
  },
  {
    id: "B2",
    firstFrame: "vidB2",
    prompt: `The hand gently sets the red device down into the open centre console and withdraws, leaving the device resting there in clear view while the camera slowly pushes in on it. Warm late-afternoon light through the car windows. Audio: a soft click as the device settles into the console, gentle car-interior ambience and faint birdsong outside. The red device must keep exactly the same shape, colour, white arrow label and clear mask as in the first frame throughout. No dialogue, no voiceover, no music. No on-screen text.`,
  },
];

export const videoAds: VideoAd[] = [
  {
    id: "video-backup",
    theme: "v3",
    name: "Place. Press. Pull.",
    angle: "Product demo: correct first-aid order, then the 3 steps",
    landing: "v1",
    overlays: [
      {
        id: "a1",
        kicker: "In a choking emergency",
        title: "Call 911. Back blows and abdominal thrusts first.",
      },
      { id: "a2", title: "If they aren't working:", sub: "RescUAid+" },
      {
        id: "a3",
        kicker: "1 · 2 · 3",
        title: "Place. Press. Pull.",
        sub: "Adult + child masks in every kit",
      },
    ],
    segments: [
      {
        clip: "A1",
        trim: [0.5, 7],
        overlays: [
          { overlay: "a1", from: 0, to: 3.2 },
          { overlay: "a2", from: 3.2, to: 6.5 },
        ],
      },
      {
        clip: "A2",
        trim: [0.5, 7],
        overlays: [{ overlay: "a3", from: 0, to: 6.5 }],
      },
    ],
    endCard: 2.5,
    copy: {
      primary: [
        "Back blows and abdominal thrusts first. If they aren't working: place, press, pull. RescUAid+ is the backup, with adult and child masks in every kit.",
        "See how RescUAid+ works in 3 steps. Designed to be simple under stress, and backed by a 90-day money-back guarantee.",
      ],
      headline: "See how it works in 3 steps",
      description: "Buy 2, get 1 free",
      cta: "Shop Now",
      tiktok:
        "Back blows first. If they aren't working: place, press, pull. #firstaid #familysafety",
    },
  },
  {
    id: "video-every-table",
    theme: "v2",
    name: "Within reach of every table",
    angle: "Lifestyle: every age, every room (bundle driver)",
    landing: "v2",
    overlays: [
      {
        id: "b1",
        title: "Choking can happen at any age.",
        sub: "Every second counts.",
      },
      {
        id: "b2",
        kicker: "Keep one where they eat",
        title: "Kitchen. Car. Grandma's house.",
      },
    ],
    segments: [
      {
        clip: "B1",
        trim: [0.5, 7],
        overlays: [{ overlay: "b1", from: 0.3, to: 6.5 }],
      },
      {
        clip: "B2",
        trim: [0.5, 7],
        overlays: [{ overlay: "b2", from: 0.3, to: 6.5 }],
      },
    ],
    endCard: 2.5,
    copy: {
      primary: [
        "Choking can happen at any age. Keep a RescUAid+ within reach of every table: the kitchen, the car and the grandparents'. Buy 2, get the 3rd free.",
        "The backup to back blows and abdominal thrusts, with adult and child masks in every kit. One for every floor.",
      ],
      headline: "Ready in every room they eat in",
      description: "Buy 2, get 1 free",
      cta: "Shop Now",
      tiktok:
        "Keep one where they eat: kitchen, car, Grandma's. Buy 2, get 1 free. #familysafety",
    },
  },
];

export const videoDuration = (v: VideoAd) =>
  v.segments.reduce((s, seg) => s + (seg.trim[1] - seg.trim[0]), 0) + v.endCard;

/** Landing URL with UTMs so each creative shows up on the order (via the PDP's cart attributes). */
export const landingUrl = (
  landing: Landing,
  adId: string,
  source: "meta" | "tiktok" = "meta",
) =>
  `/${landing}?utm_source=${source}&utm_medium=paid_social&utm_campaign=rescuaid_pdp_test&utm_content=${adId}`;

export const findImageAd = (id: string) => imageAds.find((a) => a.id === id);
export const findVideoAd = (id: string) => videoAds.find((a) => a.id === id);
