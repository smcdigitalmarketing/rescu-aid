/**
 * Single source of truth for product facts, offers and policy copy.
 * Routes never hard-code prices, variant IDs or policy terms.
 */

export const STORE_URL = "https://www.rescuaid.com";

export const product = {
  name: "RescUAid+",
  title: "RescUAid+ Anti-Choking Device for Adults & Children",
  handle: "rescuaid-anti-choking-device-for-adult-children",
  variantId: 48008650260728,
  price: 59.99,
  minAge: "12 months",
  childMaskMin: "22 lb (10 kg)",
  support: {
    email: "hello@rescuaid.com",
    phone: "(307) 316-6168",
    hours: "Mon–Fri, 9am–5pm ET",
  },
} as const;

/**
 * Policy terms shown on the pages. These MUST match the store's published
 * policies before launch. As of 2026-09-30 the live refund policy says a
 * 30-day window for unused items, and the shipping policy says shipping is
 * calculated at checkout, while the live PDP advertises a 90-day guarantee
 * and free shipping over $60.
 */
export const policy = {
  guaranteeDays: 90,
  freeShippingMin: 60,
  dispatch: "1–2 business days",
  delivery: "3–7 business days",
  shipsFrom: "our US warehouse",
} as const;

/** Buy 2 Get 1 Free. If Shopify needs a code rather than an automatic discount, set it here. */
export const discountCode: string | undefined = undefined;

export type AddOn = {
  id: "practice-mask" | "mask-set" | "handbook";
  variantId: number;
  title: string;
  blurb: string;
  price: number;
  compareAt?: number;
};

export const addOns = {
  practiceMask: {
    id: "practice-mask",
    variantId: 47642040926456,
    title: "2× Practice Masks",
    blurb:
      "Rehearse place–press–pull so the motion is automatic if you ever need it.",
    price: 9.99,
  },
  maskSet: {
    id: "mask-set",
    variantId: 47642041450744,
    title: "Spare Mask Set (adult + child)",
    blurb:
      "Masks should be inspected and replaced every 2–3 years. Keep a spare set ready.",
    price: 19.99,
  },
  handbook: {
    id: "handbook",
    variantId: 47642041090296,
    title: "Choking Response Handbook",
    blurb:
      "A quick-reference guide to the recognized choking steps for every age.",
    price: 0,
    compareAt: 4.95,
  },
} satisfies Record<string, AddOn>;

export type Bundle = {
  id: string;
  kits: number;
  /** Kits the customer pays for. Kits above this are the B2G1 free units. */
  paidKits: number;
  label: string;
  sub?: string;
  badge?: string;
};

export const bundlePrice = (b: Bundle) => b.paidKits * product.price;
export const bundleCompareAt = (b: Bundle) => b.kits * product.price;
export const bundleSavings = (b: Bundle) => bundleCompareAt(b) - bundlePrice(b);
export const perKit = (b: Bundle) => bundlePrice(b) / b.kits;

export type Offer = {
  defaultId: string;
  bundles: Bundle[];
  addOns?: AddOn[];
  /** Added free to multi-kit orders. */
  freeGift?: AddOn;
};

/** Per-variant offers. Each PDP tests a different offer presentation. */
export const offers = {
  v1: {
    defaultId: "1",
    bundles: [
      { id: "1", kits: 1, paidKits: 1, label: "1 kit", sub: "For one home" },
      { id: "2", kits: 2, paidKits: 2, label: "2 kits", sub: "Home + car" },
      {
        id: "3",
        kits: 3,
        paidKits: 2,
        label: "3 kits",
        sub: "3rd kit free with Buy 2 Get 1",
      },
    ],
  },
  v2: {
    defaultId: "3",
    bundles: [
      { id: "1", kits: 1, paidKits: 1, label: "1 Kit", sub: "The kitchen" },
      {
        id: "3",
        kits: 3,
        paidKits: 2,
        label: "3 Kits",
        sub: "One for every floor",
        badge: "Recommended",
      },
      {
        id: "6",
        kits: 6,
        paidKits: 4,
        label: "6 Kits",
        sub: "Home, car & grandparents",
        badge: "Most coverage",
      },
    ],
    addOns: [addOns.practiceMask, addOns.maskSet],
  },
  v3: {
    defaultId: "3",
    bundles: [
      {
        id: "3",
        kits: 3,
        paidKits: 2,
        label: "Buy 2, Get 1 Free",
        sub: "3 kits + free Choking Response Handbook",
      },
      { id: "1", kits: 1, paidKits: 1, label: "Just 1 kit" },
    ],
    freeGift: addOns.handbook,
  },
} satisfies Record<string, Offer>;

export const boxContents = [
  {
    title: "RescUAid+ suction device",
    detail: "Easy-grip handle with a one-way valve",
  },
  { title: "Adult mask", detail: "Teens, adults and seniors" },
  {
    title: "Child mask",
    detail: `Children ${product.minAge}+ and ${product.childMaskMin}+`,
  },
  {
    title: "Step-by-step instructions",
    detail: "Illustrated, readable under stress",
  },
];

export const steps = [
  {
    title: "Place",
    body: "Fit the mask over the mouth and nose for a secure seal.",
  },
  {
    title: "Press",
    body: "Push the handle down. The one-way valve lets air out, never into the airway.",
  },
  {
    title: "Pull",
    body: "Pull the handle back firmly to create suction. Repeat if needed.",
  },
];

export const usageNotice = {
  title: "Important safety information",
  body: [
    `RescUAid+ is for choking emergencies in people ${product.minAge} and older. It is not for infants under 12 months.`,
    "Always call 911 first, then follow recognized first-aid steps (Red Cross / AHA back blows and abdominal thrusts). If the airway is still blocked, use RescUAid+ as directed.",
    "Get medical attention after any choking incident, even if the blockage clears.",
  ],
};

export type Faq = { q: string; a: string };

export const faqs: Record<string, Faq> = {
  firstAid: {
    q: "Should I use RescUAid+ instead of back blows or the Heimlich?",
    a: "No. Call 911 and follow the recognized steps first: back blows and abdominal thrusts. RescUAid+ is your next step if those aren't working, if you can't perform them (for example the person is much larger than you), or if you're alone.",
  },
  self: {
    q: "Can I use it on myself?",
    a: "Yes. RescUAid+ is designed so you can place, press and pull on your own when no one else is around. If you can, call 911 first, even on speaker.",
  },
  ages: {
    q: "What ages is it for?",
    a: `Each kit includes two masks: a child mask for children ${product.minAge} and older who weigh at least ${product.childMaskMin}, and an adult mask for teens, adults and seniors. It is not for infants under 12 months.`,
  },
  how: {
    q: "How does it work?",
    a: "Pressing the handle pushes air out through a one-way valve, so no air is forced into the airway. Pulling the handle back creates suction through the sealed mask to help dislodge the blockage. You can repeat the motion until the airway clears or help arrives.",
  },
  reuse: {
    q: "Can it be used more than once?",
    a: "During an emergency you can repeat the motion as many times as needed. After a rescue the unit should be replaced for hygiene reasons. Contact us and we'll replace it free of charge.",
  },
  expiry: {
    q: "Does it expire?",
    a: "There are no batteries and no expiry date unless it's used. Inspect the masks periodically and replace them every 2–3 years.",
  },
  howMany: {
    q: "How many do I need?",
    a: "One within reach of wherever people eat: the kitchen, the dining room, the car and grandparents' homes. Seconds spent searching are seconds lost.",
  },
  learnFirstAid: {
    q: "Do I still need to learn first aid?",
    a: "Yes, and we encourage it. RescUAid+ is a backup, not a substitute for recognized first aid. A Red Cross or AHA choking course takes about an hour.",
  },
  shipping: {
    q: "How fast will it arrive?",
    a: `Orders ship from ${policy.shipsFrom} within ${policy.dispatch}, then arrive in ${policy.delivery}. You'll get tracking by email.`,
  },
  guarantee: {
    q: "What if it's not right for me?",
    a: `You're covered by our ${policy.guaranteeDays}-day guarantee. Contact ${product.support.email} and we'll make it right.`,
  },
};

export const money = (n: number) =>
  n === 0 ? "FREE" : `$${n.toFixed(2).replace(/\.00$/, "")}`;
