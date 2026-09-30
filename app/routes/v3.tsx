import { PackageCheck, RotateCcw, Truck, UsersRound } from "lucide-react";
import type { Route } from "./+types/v3";
import { PageShell, Section } from "~/components/pdp/layout";
import { StickyBuyBar, ValueStack } from "~/components/pdp/buy";
import { Picture } from "~/components/pdp/media";
import { AsSeenOn, ClaimBadges, ClaimRating } from "~/components/pdp/claims";
import {
  FaqList,
  Guarantee,
  ReviewCard,
  SafetyNotice,
  Steps,
  TrustBar,
} from "~/components/pdp/content";
import { faqs, offers, policy, product } from "~/data/product";
import { img } from "~/lib/images";
import { useOffer } from "~/lib/use-offer";
import { fontHref, pdpMeta } from "~/lib/seo";

const hero = img("v3Hero");
const bundleImage = img("v3Bundle");

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: fontHref(
      "family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700",
    ),
  },
  ...(hero
    ? [
        {
          rel: "preload",
          as: "image",
          href: hero.src,
          fetchPriority: "high" as const,
        },
      ]
    : []),
];

export const meta: Route.MetaFunction = () =>
  pdpMeta({
    title: "RescUAid+ | Buy 2, Get 1 Free + Free Handbook",
    description:
      "Get 3 RescUAid+ choking rescue kits for the price of 2, plus a free Choking Response Handbook. Adult and child masks in every kit.",
    image: hero?.src,
  });

export default function V3() {
  const state = useOffer(offers.v3, "v3");

  return (
    <PageShell
      theme="v3"
      nav={false}
      announcement={
        <span className="uppercase tracking-widest">
          Buy 2, get 1 free <span aria-hidden="true">+</span> free handbook
        </span>
      }
    >
      <section id="buy" className="scroll-mt-4 px-4 pb-10 pt-6 sm:pt-10">
        {/* Mobile order: headline → offer → image → proof. Desktop: image left, offer right. */}
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 md:grid-rows-[auto_auto_1fr] md:gap-x-12 md:[grid-template-areas:'title_buy'_'image_buy'_'image_extras']">
          <div className="md:[grid-area:title]">
            <h1 className="font-display text-[2.25rem] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
              When back blows <span className="text-brand">aren't enough.</span>
            </h1>
            <ClaimRating className="mt-2" />
            <p className="mt-3 text-[15px] text-muted sm:text-[17px]">
              {product.name}: the place, press, pull backup to recognized
              choking first aid.
              <span className="hidden sm:inline">
                {" "}
                Adult and child masks in every kit.
              </span>
            </p>
          </div>
          <div id="buy-anchor" className="md:[grid-area:buy] md:pt-2">
            <ValueStack
              state={state}
              id="buy-options"
              thumb={img("kit") ?? undefined}
            />
          </div>
          {hero && (
            <div className="aspect-square overflow-hidden rounded-card bg-highlight md:[grid-area:image]">
              <Picture image={hero} priority fit="contain" />
            </div>
          )}
          <div className="md:[grid-area:extras]">
            <ul className="grid gap-1.5 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-success" aria-hidden="true" />
                Ships from the US in {policy.dispatch} · delivery in{" "}
                {policy.delivery}
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="size-4 text-success" aria-hidden="true" />
                Not for you? {policy.guaranteeDays}-day money-back guarantee
              </li>
            </ul>
            <ClaimBadges className="mt-4" />
            <div className="mt-5">
              <ReviewCard id="jessica-k" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="border-y-2 border-ink bg-highlight px-4 py-5">
        <TrustBar
          className="mx-auto max-w-6xl"
          items={[
            { icon: UsersRound, label: "Adult + child masks" },
            { icon: PackageCheck, label: "No batteries, no expiry" },
            { icon: Truck, label: `Ships in ${policy.dispatch}` },
            { icon: RotateCcw, label: `${policy.guaranteeDays}-day guarantee` },
          ]}
        />
      </div>
      <AsSeenOn className="border-b-2 border-ink" />

      <Section
        id="how"
        title={<span className="uppercase">3 steps. Simple under stress.</span>}
      >
        <Steps style="strip" />
        <p className="mt-4 text-sm text-muted">
          Always call 911 and start back blows and abdominal thrusts first.
        </p>
      </Section>

      <Section
        id="reviews"
        tone="alt"
        title={<span className="uppercase">Real families. Real moments.</span>}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ReviewCard id="anthoni-b" compact />
          <ReviewCard id="sarah-m" compact />
        </div>
      </Section>

      <Section>
        <SafetyNotice compact />
      </Section>

      <Section
        id="faq"
        tone="alt"
        title={<span className="uppercase">Quick answers</span>}
      >
        <div className="max-w-3xl">
          <FaqList
            items={[
              faqs.firstAid,
              faqs.ages,
              faqs.self,
              faqs.shipping,
              faqs.guarantee,
            ]}
          />
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="grid gap-8">
            {bundleImage && (
              <div className="aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
                <Picture image={bundleImage} />
              </div>
            )}
            <Guarantee />
          </div>
          <ValueStack state={state} />
        </div>
      </Section>

      <StickyBuyBar
        state={state}
        label={
          state.bundle.kits > 1 ? "3 kits + free handbook" : "1 RescUAid+ kit"
        }
      />
    </PageShell>
  );
}
