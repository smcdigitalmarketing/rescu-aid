/**
 * Every image on the PDPs is a named slot. The page shows the generated file
 * from app/assets/generated/<id>.webp when it exists, otherwise the
 * placeholder (a current product photo), otherwise nothing.
 *
 * `npm run images` reads this manifest (scripts/generate-images.ts). Keep this
 * file plain data with no imports so Node can run it directly.
 */

export type Placeholder =
  "kit" | "in-use-closeup" | "in-use-kitchen" | "device-masks";

/**
 * Files in assets/reference/. `device` is a clean single-device cutout made
 * from `kit` by `npm run images -- --reference`; every slot uses it so the
 * product looks the same everywhere without copying the kit photo's layout.
 */
export type Reference = "device" | "in-use-closeup";

export type ImageSlot = {
  id: string;
  alt: string;
  placeholder?: Placeholder;
  /** Omit to keep the slot placeholder-only (never generated). */
  prompt?: string;
  aspect?: "1:1" | "4:5" | "3:4" | "4:3" | "3:2" | "16:9";
  refs?: Reference[];
};

const DEVICE =
  "the RescUAid+ anti-choking device from the first reference image (a matte red anodized-aluminium handheld cylinder with knurled grip panels, a white square label with a red arrow that always points away from the mask toward the capped handle end, and a clear soft silicone face mask attached to one end)";

const RULES = [
  "Use the reference image only to match the device's exact shape, colour, label and mask. Do not copy its background, angle or composition.",
  "Show exactly one device unless the prompt asks for more.",
  "No leaflets, cards, packaging, pouches or printed paper. No text, captions, logos, badges, seals, certification marks or watermarks anywhere in the image.",
  "Photorealistic commercial photography, natural skin tones, anatomically correct hands.",
].join(" ");

export const imageSlots = {
  kit: {
    id: "kit",
    alt: "RescUAid+ kit: red suction device with adult and child masks",
    placeholder: "kit",
    prompt: `Top-down flat lay on a soft warm-white surface: ${DEVICE} lying diagonally, with one spare larger adult mask and one smaller child mask neatly placed beside it. Even, soft studio light, gentle shadows, generous negative space. ${RULES}`,
    aspect: "1:1",
    refs: ["device"],
  },
  demo: {
    id: "demo",
    alt: "Demonstration: RescUAid+ mask held over an adult volunteer's mouth and nose",
    placeholder: "in-use-closeup",
  },
  demoKitchen: {
    id: "demoKitchen",
    alt: "Demonstration of RescUAid+ in a home kitchen",
    placeholder: "in-use-kitchen",
  },
  deviceMasks: {
    id: "deviceMasks",
    alt: "RescUAid+ device with interchangeable adult and child masks",
    placeholder: "device-masks",
  },
  stepPlace: {
    id: "stepPlace",
    alt: "Step 1: place the mask over the mouth and nose",
    prompt: `Calm first-aid training demonstration. An instructor's hands gently place the clear mask of ${DEVICE} over the mouth and nose of a seated adult volunteer, who is calm and relaxed. The second reference image shows how the device is held; do not copy the people in it. Bright, clean training room, soft daylight, shallow depth of field, focus on the mask seal. ${RULES}`,
    aspect: "1:1",
    refs: ["device", "in-use-closeup"],
  },
  stepPress: {
    id: "stepPress",
    alt: "Step 2: press the handle down",
    prompt: `Close-up of an adult hand pressing the handle of ${DEVICE} toward the face, the mask sealed over a calm seated adult volunteer's mouth and nose, first-aid training setting. The second reference image shows how the device is held; do not copy the people in it. Clean, bright, soft daylight. ${RULES}`,
    aspect: "1:1",
    refs: ["device", "in-use-closeup"],
  },
  stepPull: {
    id: "stepPull",
    alt: "Step 3: pull the handle back",
    prompt: `Side-view close-up of an adult hand gripping the capped handle end of ${DEVICE} and pulling it straight back, away from the face, the mask still sealed over a calm seated adult volunteer's mouth and nose, first-aid training setting. The arrow on the label points away from the face, in the direction of the pull. The second reference image shows how the device is held; do not copy the people in it. Clean, bright, soft daylight. ${RULES}`,
    aspect: "1:1",
    refs: ["device", "in-use-closeup"],
  },

  v1Hero: {
    id: "v1Hero",
    alt: "RescUAid+ anti-choking device standing upright on its mask",
    placeholder: "kit",
    prompt: `Premium medical-product studio photograph: ${DEVICE}, standing upright on its attached mask, centred on a seamless very light cool-grey background with a subtle gradient and a soft reflection below. One small spare child mask rests beside it. Crisp, clinical, calm and trustworthy. Generous negative space. ${RULES}`,
    aspect: "1:1",
    refs: ["device"],
  },
  v1Valve: {
    id: "v1Valve",
    alt: "Close-up of the clear mask and one-way valve",
    placeholder: "device-masks",
    prompt: `Macro product photograph of the clear silicone mask and connector end of ${DEVICE}, showing the transparent chamber. Light cool-grey background, precise studio lighting, shallow depth of field, clinical and engineered feel. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },
  v1Caregiver: {
    id: "v1Caregiver",
    alt: "Adult daughter and her elderly father at a kitchen table, RescUAid+ within reach",
    placeholder: "in-use-kitchen",
    prompt: `Calm, warm lifestyle photograph: a woman in her forties sharing a meal with her father in his late seventies at a bright, tidy kitchen table, both relaxed and smiling. ${DEVICE} rests on the counter behind them, visible but not the focus. Soft morning window light, neutral palette, candid. Nobody is choking or distressed. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },

  v2Hero: {
    id: "v2Hero",
    alt: "Family dinner in a warm kitchen with RescUAid+ on the counter",
    placeholder: "in-use-kitchen",
    prompt: `Warm, candid lifestyle photograph of a multi-generational family (grandmother, two parents, a toddler around two years old in a high chair and a school-age child) sharing dinner in a cozy home kitchen at golden hour. In the foreground on the kitchen counter, in sharp focus, sits ${DEVICE} beside a fruit bowl. The family is slightly blurred behind, happy and relaxed. Cream, terracotta and warm wood tones. Nobody is choking or distressed. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },
  v2Grandparent: {
    id: "v2Grandparent",
    alt: "Grandfather feeding his toddler grandson, RescUAid+ on the table",
    prompt: `Tender candid photograph of a grandfather feeding his two-year-old grandson small pieces of fruit at a wooden table. ${DEVICE} lies on the table within easy reach. Warm afternoon light, cream and wood tones. Both are happy and calm. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },
  v2Car: {
    id: "v2Car",
    alt: "RescUAid+ stored in a car's centre console",
    prompt: `Lifestyle product photograph of ${DEVICE} tucked neatly into the open centre-console storage of a modern family car, a child's car seat softly visible in the back. Warm natural light through the windows. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },
  v2Nightstand: {
    id: "v2Nightstand",
    alt: "RescUAid+ on a bedside table",
    prompt: `Lifestyle product photograph of ${DEVICE} standing on a bedside table next to reading glasses, a glass of water and a small lamp, in a calm senior's bedroom with warm evening light and cream linen. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },
  v2Diaperbag: {
    id: "v2Diaperbag",
    alt: "RescUAid+ packed in a diaper bag",
    prompt: `Top-down lifestyle product photograph of an open canvas diaper bag on a cream bedspread, neatly packed with a snack container, a sippy cup, a pack of wipes and ${DEVICE} tucked in the side pocket. Soft daylight, warm tones. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },

  v3Hero: {
    id: "v3Hero",
    alt: "RescUAid+ anti-choking device on a bright yellow background",
    placeholder: "kit",
    prompt: `Bold direct-response product photograph: ${DEVICE}, angled dynamically at about 30 degrees, floating over a saturated sunny-yellow (#FFE14D) seamless background with a crisp soft shadow beneath. The entire device and the entire mask sit well inside the frame, with at least 12% empty yellow margin on every side; nothing touches or crosses the edges. High contrast, punchy, clean edges, centred. ${RULES}`,
    aspect: "1:1",
    refs: ["device"],
  },
  v3Bundle: {
    id: "v3Bundle",
    alt: "Three RescUAid+ kits side by side",
    placeholder: "kit",
    prompt: `Product photograph of exactly three identical units of ${DEVICE}, standing upright on their masks side by side in a neat row on a clean white surface, soft studio shadows, bright and crisp. ${RULES}`,
    aspect: "4:3",
    refs: ["device"],
  },
} satisfies Record<string, ImageSlot>;

export type SlotId = keyof typeof imageSlots;
