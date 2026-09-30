import { ArrowRight } from "lucide-react";
import type { Route } from "./+types/home";
import { Logo } from "~/components/pdp/brand";
import { claims } from "~/data/claims";
import { fontHref } from "~/lib/seo";

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: fontHref("family=Inter:wght@400;500;600;700;900"),
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RescUAid PDP variants" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

const VARIANTS = [
  {
    path: "/v1",
    name: "V1 · Calm Confidence",
    swatch: ["#ffffff", "#13306b", "#c8102e"],
    traffic: "Cold search traffic, caregivers, careful researchers",
    hypothesis:
      "Clear, clinical and honest wins trust from people comparing options. Leads with the correct first-aid order.",
    offer: "1 / 2 / 3 kit picker (3rd free), 1 kit selected",
  },
  {
    path: "/v2",
    name: "V2 · Every Room, Every Age",
    swatch: ["#fbf7f1", "#7a3b2e", "#c62828"],
    traffic: "Meta / TikTok: parents and adult children of aging parents",
    hypothesis:
      "An emotional family story plus 'one per room' raises average order value. The bundle picker comes after the story.",
    offer:
      "1 / 3 / 6 kit cards, 3 selected + practice mask and mask set add-ons",
  },
  {
    path: "/v3",
    name: "V3 · Offer-First",
    swatch: ["#ffffff", "#111111", "#e11d2e"],
    traffic: "Retargeting and warm traffic",
    hypothesis:
      "Warm visitors already know the product. A short page with the offer at the top converts fastest.",
    offer: "Buy 2 Get 1 value stack + free handbook, 1-kit fallback",
  },
];

export default function Home() {
  const pending = Object.entries(claims).filter(([, c]) => !c.enabled);
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 font-[Inter,sans-serif] text-[#0f1b2d]">
      <Logo className="h-12" />
      <h1 className="mt-6 text-3xl font-bold">Product page variants</h1>
      <p className="mt-2 text-[#536175]">
        Internal review page. Each variant sends shoppers to the rescuaid.com
        cart tagged with{" "}
        <code className="rounded bg-[#f5f7fa] px-1.5 py-0.5 text-sm">
          pdp_variant
        </code>
        , so orders can be split in Shopify.
      </p>

      <ul className="mt-8 grid gap-4">
        {VARIANTS.map((v) => (
          <li key={v.path}>
            <a
              href={v.path}
              className="group flex gap-5 rounded-xl border border-[#e2e7ee] bg-white p-5 transition hover:border-[#13306b] hover:shadow-md"
            >
              <span
                className="flex shrink-0 flex-col overflow-hidden rounded-lg border border-[#e2e7ee]"
                aria-hidden="true"
              >
                {v.swatch.map((c) => (
                  <span
                    key={c}
                    className="h-6 w-10"
                    style={{ background: c }}
                  />
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-lg font-bold">
                  {v.name}
                  <ArrowRight
                    className="size-4 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block text-[#536175]">
                  {v.hypothesis}
                </span>
                <span className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                  <span>
                    <strong>Traffic:</strong> {v.traffic}
                  </span>
                  <span>
                    <strong>Offer:</strong> {v.offer}
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-xl border border-[#f2c94c] bg-[#fffbeb] p-5 text-sm">
        <h2 className="font-bold">
          Claims switched off until substantiated ({pending.length})
        </h2>
        <ul className="mt-2 grid gap-1.5 text-[#536175]">
          {pending.map(([key, c]) => (
            <li key={key}>
              <code className="font-semibold text-[#0f1b2d]">{key}</code>:{" "}
              {c.note}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[#536175]">
          Turn them on in <code>app/data/claims.ts</code> once the proof
          arrives.
        </p>
      </section>
    </main>
  );
}
