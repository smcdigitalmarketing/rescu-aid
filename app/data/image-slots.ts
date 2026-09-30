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

export type Reference = "kit" | "in-use-closeup" | "in-use-kitchen";

export type ImageSlot = {
  id: string;
  alt: string;
  placeholder?: Placeholder;
  /** Omit to keep the slot placeholder-only (never generated). */
  prompt?: string;
  aspect?: "1:1" | "4:5" | "3:4" | "4:3" | "3:2" | "16:9";
  size?: "1K" | "2K";
  refs?: Reference[];
};

const DEVICE =
  "the RescUAid+ anti-choking device exactly as it appears in the reference photos: a matte red cylindrical handheld suction device about 20 cm long with a knurled grip, a white square label printed with a red arrow, and a clear soft silicone face mask on one end";

const RULES =
  "Photorealistic commercial photography. Keep the device's shape, colour, label and mask identical to the reference photos. No added text, captions, logos, badges, seals, certification marks or watermarks. Natural skin tones, realistic hands.";

export const imageSlots = {
  kit: {
    id: "kit",
    alt: "RescUAid+ kit: red suction device with adult and child masks",
    placeholder: "kit",
    prompt: `Top-down flat lay on a soft warm-white surface of ${DEVICE}, beside a second, larger adult mask and a smaller child mask, and a folded instruction card. Even, soft studio light, gentle shadows, generous negative space around the items. ${RULES}`,
    aspect: "1:1",
    size: "2K",
    refs: ["kit"],
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
    prompt: `Calm first-aid training demonstration. An adult instructor's hands gently place the clear mask of ${DEVICE} over the mouth and nose of a seated adult volunteer, who is calm and relaxed. Bright, clean training room, soft daylight, shallow depth of field, focus on the mask seal. ${RULES}`,
    aspect: "1:1",
    size: "1K",
    refs: ["in-use-closeup", "kit"],
  },
  stepPress: {
    id: "stepPress",
    alt: "Step 2: press the handle down",
    prompt: `Close-up of an adult hand pressing down on the handle of ${DEVICE}, the mask sealed over a calm seated adult volunteer's mouth and nose in a first-aid training setting. Slight motion emphasis on the downward push. Clean, bright, soft daylight. ${RULES}`,
    aspect: "1:1",
    size: "1K",
    refs: ["in-use-closeup", "kit"],
  },
  stepPull: {
    id: "stepPull",
    alt: "Step 3: pull the handle back",
    prompt: `Close-up of an adult hand pulling the handle of ${DEVICE} back and away from the face, the mask still sealed over a calm seated adult volunteer's mouth and nose, first-aid training setting. Clean, bright, soft daylight. ${RULES}`,
    aspect: "1:1",
    size: "1K",
    refs: ["in-use-closeup", "kit"],
  },

  v1Hero: {
    id: "v1Hero",
    alt: "RescUAid+ anti-choking device standing upright with its mask",
    placeholder: "kit",
    prompt: `Premium medical-product studio photograph of ${DEVICE}, standing upright on its mask on a seamless very light cool-grey background with a subtle gradient and a soft reflection. Crisp, clinical, calm and trustworthy. Spare adult and child masks rest beside it. Centered composition with generous negative space. ${RULES}`,
    aspect: "1:1",
    size: "2K",
    refs: ["kit"],
  },
  v1Valve: {
    id: "v1Valve",
    alt: "Close-up of the clear mask and one-way valve",
    placeholder: "device-masks",
    prompt: `Macro product photograph of the clear silicone mask and connector of ${DEVICE}, showing the transparent chamber and the one-way valve. Light cool-grey background, precise studio lighting, shallow depth of field, clinical and engineered feel. ${RULES}`,
    aspect: "4:3",
    size: "1K",
    refs: ["kit"],
  },
  v1Caregiver: {
    id: "v1Caregiver",
    alt: "Adult daughter and her elderly father at a kitchen table, RescUAid+ within reach",
    placeholder: "in-use-kitchen",
    prompt: `Warm but calm lifestyle photograph: a woman in her forties sharing a meal with her father in his late seventies at a bright, tidy kitchen table, both relaxed and smiling. ${DEVICE} rests on the counter in the background, visible but not the focus. Soft morning window light, neutral palette, candid. Nobody is choking or distressed. ${RULES}`,
    aspect: "4:3",
    size: "2K",
    refs: ["kit"],
  },

  v2Hero: {
    id: "v2Hero",
    alt: "Family dinner in a warm kitchen with RescUAid+ on the counter",
    placeholder: "in-use-kitchen",
    prompt: `Warm, candid lifestyle photograph of a multi-generational family (grandmother, two parents, a toddler around two years old in a high chair and a school-age child) sharing dinner in a cozy home kitchen at golden hour. In the foreground on the kitchen counter, in sharp focus, sits ${DEVICE} beside a fruit bowl. The family is blurred slightly behind, happy and relaxed. Cream, terracotta and warm wood tones. Nobody is choking or distressed. ${RULES}`,
    aspect: "4:3",
    size: "2K",
    refs: ["kit"],
  },
  v2Grandparent: {
    id: "v2Grandparent",
    alt: "Grandfather feeding his toddler grandson, RescUAid+ on the table",
    
    prompt: `Tender candid photograph of a grandfather feeding his two-year-old grandson small pieces of fruit at a wooden table. ${DEVICE} sits on the table within easy reach. Warm afternoon light, cream and wood tones. Both are happy and calm. ${RULES}`,
    aspect: "4:3",
    size: "1K",
    refs: ["kit"],
  },
  v2Car: {
    id: "v2Car",
    alt: "RescUAid+ stored in a car's centre console",
    prompt: `Lifestyle product photograph of ${DEVICE} tucked neatly into the open centre-console storage of a modern family car, a child's car seat softly visible in the back. Warm natural light through the windows. ${RULES}`,
    aspect: "4:3",
    size: "1K",
    refs: ["kit"],
  },
  v2Nightstand: {
    id: "v2Nightstand",
    alt: "RescUAid+ on a bedside table",
    prompt: `Lifestyle product photograph of ${DEVICE} standing on a bedside table next to reading glasses, a glass of water and a small lamp, in a calm senior's bedroom with warm evening light and cream linen. ${RULES}`,
    aspect: "4:3",
    size: "1K",
    refs: ["kit"],
  },
  v2Diaperbag: {
    id: "v2Diaperbag",
    alt: "RescUAid+ packed in a diaper bag",
    prompt: `Lifestyle product photograph, top-down, of an open canvas diaper bag on a cream bedspread, neatly packed with a snack container, a sippy cup, wipes, and ${DEVICE} tucked in the side pocket. Soft daylight, warm tones. ${RULES}`,
    aspect: "4:3",
    size: "1K",
    refs: ["kit"],
  },

  v3Hero: {
    id: "v3Hero",
    alt: "RescUAid+ anti-choking device on a bright yellow background",
    placeholder: "kit",
    prompt: `Bold direct-response product photograph of ${DEVICE}, angled dynamically at 30 degrees, floating over a saturated sunny-yellow seamless background with a crisp soft shadow beneath. Spare adult and child masks beside it. High contrast, punchy, clean edges, centered with room around the product. ${RULES}`,
    aspect: "1:1",
    size: "2K",
    refs: ["kit"],
  },
  v3Bundle: {
    id: "v3Bundle",
    alt: "Three RescUAid+ kits side by side",
    placeholder: "kit",
    prompt: `Product photograph of three identical units of ${DEVICE} standing upright side by side in a neat row on a clean white surface, each with its mask, soft studio shadows, bright and crisp. ${RULES}`,
    aspect: "4:3",
    size: "1K",
    refs: ["kit"],
  },
} satisfies Record<string, ImageSlot>;

export type SlotId = keyof typeof imageSlots;
