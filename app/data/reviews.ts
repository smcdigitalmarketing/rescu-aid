/**
 * Testimonials reused from the live rescuaid.com PDP (some trimmed for
 * length, wording unchanged). The client confirmed on 2026-09-30 that they
 * are genuine. The Facebook-style
 * decoration from the live page (like counts, "11h" timestamps,
 * "48.3k others") is intentionally not reproduced.
 */

export type Review = {
  id: string;
  name: string;
  /** Shown under the name, e.g. "Active EMT" or "Verified purchase". */
  meta: string;
  quote: string;
  rating?: number;
  kind: "expert" | "story" | "customer";
};

export const reviews: Review[] = [
  {
    id: "jessica-k",
    name: "Jessica K.",
    meta: "Active EMT · Verified buyer",
    rating: 5,
    kind: "expert",
    quote:
      "As an EMT, RescUAid is one of the most practical choking rescue tools I've seen. It's compact, simple to use under stress, and includes both adult and child masks. I keep one at home and recommend having one anywhere people eat.",
  },
  {
    id: "anthoni-b",
    name: "Anthoni B.",
    meta: "Verified purchase · RescUAid Bundle",
    kind: "story",
    quote:
      "We were at a family BBQ when my dad suddenly began choking. Within seconds, RescUAid was used and it worked exactly as intended. He was taken to the hospital afterward and fully checked out — but without RescUAid nearby, the outcome could have been very different. We are incredibly grateful for this device.",
  },
  {
    id: "sarah-m",
    name: "Sarah M.",
    meta: "Verified purchase · RescUAid Bundle",
    kind: "story",
    quote:
      "The day my RescUAid arrived turned out to be the day I needed it. While taking medication, one became lodged in my throat. I live alone, and in that moment, RescUAid saved my life. I cannot recommend this product enough — it works, and it could save yours or a loved one's life too.",
  },
  {
    id: "chandra",
    name: "Chandra",
    meta: "Verified purchase · RescUAid Bundle",
    kind: "customer",
    quote:
      "I purchased RescUAid for my household and hope we never need it — but knowing it's there brings real comfort. As someone with medical training, I appreciate that RescUAid is thoughtfully designed, intuitive, and well-made. It feels like a smart addition to any home safety plan.",
  },
  {
    id: "linda-martinez",
    name: "Linda Martinez",
    meta: "Customer · via Facebook",
    kind: "story",
    quote:
      "I'm so grateful for this brand — it saved my grandson's life. He started choking on a small toy, and in a moment of panic, I grabbed the device. It worked instantly, and he was breathing again within seconds.",
  },
  {
    id: "mary-thompson",
    name: "Mary Thompson",
    meta: "Customer · via Facebook",
    kind: "customer",
    quote:
      "RescUAid gives us the peace of mind we never knew we needed. With small kids at home, choking is always a worry, but having this on hand makes me feel ready for anything.",
  },
  {
    id: "susan-reynolds",
    name: "Susan Reynolds",
    meta: "Customer · via Facebook",
    kind: "customer",
    quote:
      "We decided to get it after hearing how vital it is to act fast in choking emergencies. This device is simple, reliable, and has quickly become an essential part of our safety plan.",
  },
];

export const reviewById = (id: string) => {
  const r = reviews.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown review: ${id}`);
  return r;
};
