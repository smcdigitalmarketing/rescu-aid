import { imageSlots, type SlotId } from "~/data/image-slots";

const generated = import.meta.glob<string>("../assets/generated/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
const placeholders = import.meta.glob<string>("../assets/placeholder/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

export type ResolvedImage = {
  src: string;
  alt: string;
  generated: boolean;
};

/** Generated asset if it exists, else the slot's placeholder, else null. */
export function img(id: SlotId): ResolvedImage | null {
  const slot = imageSlots[id];
  const gen = generated[`../assets/generated/${slot.id}.webp`];
  if (gen) return { src: gen, alt: slot.alt, generated: true };
  const ph =
    "placeholder" in slot
      ? placeholders[`../assets/placeholder/${slot.placeholder}.webp`]
      : undefined;
  if (ph) return { src: ph, alt: slot.alt, generated: false };
  return null;
}

/** Resolves several slots, dropping missing ones and duplicate placeholders. */
export function imgs(ids: SlotId[]): ResolvedImage[] {
  const seen = new Set<string>();
  return ids
    .map(img)
    .filter(
      (x): x is ResolvedImage =>
        x !== null && !seen.has(x.src) && !!seen.add(x.src),
    );
}
