import { STORE_URL, product } from "~/data/product";

export const fontHref = (families: string) =>
  `https://fonts.googleapis.com/css2?${families}&display=swap`;

/**
 * PDP variants are paid-traffic test pages: noindex, canonical to the live
 * product page, plus Product structured data. aggregateRating is left out
 * until claims.aggregateRating is substantiated.
 */
export function pdpMeta({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  const canonical = `${STORE_URL}/products/${product.handle}`;
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex, follow" },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:type", content: "product" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...(image ? [{ property: "og:image", content: image }] : []),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        brand: { "@type": "Brand", name: "RescUAid" },
        description,
        url: canonical,
        offers: {
          "@type": "Offer",
          price: product.price.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: canonical,
        },
      },
    },
  ];
}
