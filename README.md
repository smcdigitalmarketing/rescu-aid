# rescu-aid

Three test product pages (PDPs) for the RescUAid+ anti-choking device, built with React Router 7. Every page is pre-rendered to static HTML. The "Add to cart" buttons send shoppers to the live rescuaid.com Shopify cart.

| Route | Concept                              | Traffic                 | Offer                                   |
| ----- | ------------------------------------ | ----------------------- | --------------------------------------- |
| `/v1` | Calm Confidence: clinical, trust-led | Cold search, caregivers | 1 / 2 / 3 kit picker (3rd free)         |
| `/v2` | Every Room, Every Age: family story  | Meta / TikTok           | 1 / 3 / 6 kit cards + add-ons           |
| `/v3` | Offer-First: short, mobile-first     | Retargeting             | Buy 2 Get 1 value stack + free handbook |

`/` is an internal index page that links to all three and lists the claims that are still switched off.

## Getting started

```bash
npm install
npm run dev
```

`npm run build` pre-renders all routes into `build/client`, which you can deploy to any static host.

## Where things live

- `app/data/product.ts`: price, Shopify variant IDs, per-variant offers, FAQs, safety notice and policy terms. Routes never hard-code these.
- `app/data/claims.ts`: regulatory and statistical claims (FDA, Made in USA, ratings, "lives saved", …). All are **off** until the client supplies proof.
- `app/data/reviews.ts`: testimonials from the live site, which the client confirmed are genuine.
- `app/data/image-slots.ts`: every image on the pages, with its generation prompt.
- `app/lib/cart.ts`: builds Shopify cart links. Each order carries `attributes[pdp_variant]` and any UTM parameters, so sales can be split by variant in Shopify.

## Images

Pages use the current rescuaid.com product photos until generated images exist.

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`.
2. Run `npm run images`. Add `-- --only v2` to target one variant, `-- --force` to regenerate, or `-- --model gemini-3-pro-image` to switch model.
3. Review every file in `app/assets/generated/`. Delete any you don't want and that slot falls back to its placeholder.

Each generated image gets a `.json` file next to it holding the prompt and model used.

## Before launch

- Match the refund and shipping policies to the page copy. The live refund policy says 30 days for unused items, while the pages say 90 days. The live shipping policy says shipping is calculated at checkout, while the pages say free over $60.
- Confirm that Buy 2 Get 1 is a Shopify automatic discount that applies more than once per order (the 6-kit bundle expects 2 free kits). If it needs a code instead, set `discountCode` in `product.ts`.
