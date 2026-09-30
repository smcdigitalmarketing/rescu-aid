import { useState } from "react";
import {
  bundleCompareAt,
  bundlePrice,
  policy,
  product,
  type AddOn,
  type Offer,
} from "~/data/product";
import { useCartUrl, type CartLine, type PdpVariant } from "./cart";

/** Shared offer state so the buy box and sticky bar always agree. */
export function useOffer(offer: Offer, pdp: PdpVariant) {
  const [bundleId, setBundleId] = useState(offer.defaultId);
  const [addOnIds, setAddOnIds] = useState<ReadonlySet<AddOn["id"]>>(new Set());

  const bundle =
    offer.bundles.find((b) => b.id === bundleId) ?? offer.bundles[0];
  const addOns = (offer.addOns ?? []).filter((a) => addOnIds.has(a.id));
  const gift = offer.freeGift && bundle.kits > 1 ? offer.freeGift : undefined;

  const lines: CartLine[] = [
    { variantId: product.variantId, quantity: bundle.kits },
    ...addOns.map((a) => ({ variantId: a.variantId, quantity: 1 })),
    ...(gift ? [{ variantId: gift.variantId, quantity: 1 }] : []),
  ];

  const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0);
  const total = bundlePrice(bundle) + addOnTotal;
  const compareAt =
    bundleCompareAt(bundle) + addOnTotal + (gift?.compareAt ?? 0);

  const toggleAddOn = (id: AddOn["id"]) =>
    setAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return {
    pdp,
    offer,
    bundle,
    setBundleId,
    addOnIds,
    toggleAddOn,
    gift,
    total,
    compareAt,
    savings: compareAt - total,
    freeShipping: total >= policy.freeShippingMin,
    cartUrl: useCartUrl(lines, pdp),
  };
}

export type OfferState = ReturnType<typeof useOffer>;
