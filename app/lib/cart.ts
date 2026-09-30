import { useEffect, useState } from "react";
import { STORE_URL, discountCode } from "~/data/product";

export type PdpVariant = "v1" | "v2" | "v3";
export type CartLine = { variantId: number; quantity: number };

const PASSTHROUGH = /^(utm_[a-z]+|gclid|fbclid|ttclid)$/;

/**
 * Shopify cart permalink: /cart/{variant}:{qty},{variant}:{qty}?...
 * `attributes[pdp_variant]` lands on the order so sales can be split by PDP.
 */
export function buildCartUrl(
  lines: CartLine[],
  pdp: PdpVariant,
  search = "",
): string {
  const items = lines
    .filter((l) => l.quantity > 0)
    .map((l) => `${l.variantId}:${l.quantity}`)
    .join(",");
  const url = new URL(`/cart/${items}`, STORE_URL);
  url.searchParams.set("attributes[pdp_variant]", pdp);
  if (discountCode) url.searchParams.set("discount", discountCode);

  for (const [key, value] of new URLSearchParams(search)) {
    if (!PASSTHROUGH.test(key)) continue;
    url.searchParams.set(key, value);
    if (key.startsWith("utm_"))
      url.searchParams.set(`attributes[${key}]`, value);
  }
  return url.toString();
}

/**
 * Pages are prerendered, so the query string is only known after hydration.
 * The first client render matches the server HTML, then UTMs are added.
 */
export function useCartUrl(lines: CartLine[], pdp: PdpVariant): string {
  const [search, setSearch] = useState("");
  useEffect(() => setSearch(window.location.search), []);
  return buildCartUrl(lines, pdp, search);
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function trackAddToCart(
  pdp: PdpVariant,
  bundleId: string,
  value: number,
) {
  const w = window as DataLayerWindow;
  w.dataLayer?.push({
    event: "add_to_cart",
    pdp_variant: pdp,
    bundle: bundleId,
    value,
    currency: "USD",
  });
}
