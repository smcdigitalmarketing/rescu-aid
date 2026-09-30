import {
  Baby,
  HeartPulse,
  PackageCheck,
  Truck,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { Route } from "./+types/v1";
import { PageShell, Section } from "~/components/pdp/layout";
import {
  BundleOptions,
  BuyMeta,
  CtaButton,
  StickyBuyBar,
} from "~/components/pdp/buy";
import { Gallery, Picture } from "~/components/pdp/media";
import {
  Comparison,
  FaqList,
  FeatureList,
  Guarantee,
  Reviews,
  SOURCES,
  SafetyNotice,
  Sources,
  Steps,
  TrustBar,
  WhatsInBox,
} from "~/components/pdp/content";
import { faqs, offers, policy, product } from "~/data/product";
import { reviewById } from "~/data/reviews";
import { img, imgs } from "~/lib/images";
import { useOffer } from "~/lib/use-offer";
import { fontHref, pdpMeta } from "~/lib/seo";

const hero = img("v1Hero");

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: fontHref(
      "family=Inter:wght@400;500;600;700;900&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700",
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
    title: "RescUAid+ | The backup plan when back blows aren't enough",
    description:
      "A simple place, press, pull choking rescue device with adult and child masks. For use after recognized first-aid steps.",
    image: hero?.src,
  });

const expert = reviewById("jessica-k");

export default function V1() {
  const state = useOffer(offers.v1, "v1");

  return (
    <PageShell
      theme="v1"
      announcement={`Buy 2, get the 3rd kit free · Ships from the US in ${policy.dispatch}`}
    >
      {/* Hero + buy box */}
      <section id="buy" className="scroll-mt-4 px-4 pb-14 pt-8 sm:pt-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:gap-16">
          <Gallery
            images={imgs(["v1Hero", "kit", "demo", "v1Valve", "deviceMasks"])}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
              Choking rescue device · Ages 12 months to adult
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-balance sm:text-5xl">
              The backup plan when back blows aren't enough.
            </h1>
            <p className="mt-4 text-lg text-muted text-pretty">
              Call 911 and start back blows and abdominal thrusts. If the airway
              is still blocked, {product.name} is your next step: place, press,
              pull. Adult and child masks included.
            </p>

            <figure className="mt-6 border-l-4 border-accent/20 pl-4">
              <blockquote className="text-[15px] italic">
                “One of the most practical choking rescue tools I've seen.”
              </blockquote>
              <figcaption className="mt-1 text-sm text-muted">
                {expert.name}, {expert.meta.split(" · ")[0]}
              </figcaption>
            </figure>

            <div className="mt-8">
              <BundleOptions state={state} style="list" />
              <div id="buy-anchor" className="mt-5">
                <CtaButton state={state} />
              </div>
              <BuyMeta state={state} />
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-line bg-surface-2 px-4 py-6">
        <TrustBar
          className="mx-auto max-w-6xl"
          items={[
            { icon: UsersRound, label: "Adult + child masks in every kit" },
            { icon: UserRound, label: "Can be self-applied" },
            {
              icon: PackageCheck,
              label: "No batteries, no expiry unless used",
            },
            { icon: Truck, label: `Ships in ${policy.dispatch}` },
          ]}
        />
      </div>

      <Section
        id="how"
        eyebrow="How it works"
        title="Three steps you can follow under stress"
        intro="Use RescUAid+ after back blows and abdominal thrusts, or when you can't perform them."
      >
        <Steps />
      </Section>

      <Section
        tone="alt"
        eyebrow="What's in the box"
        title="Everything you need, in one kit"
      >
        <WhatsInBox image={img("kit")} />
      </Section>

      <Section
        eyebrow="Design"
        title="Engineered for the worst moment of someone's day"
      >
        <div className="grid items-center gap-10 md:grid-cols-2">
          <FeatureList
            items={[
              {
                title: "One-way valve",
                body: "Pressing pushes air out through the valve, so no air is forced into the airway.",
              },
              {
                title: "Clear chamber",
                body: "The transparent mask and chamber let you see a removed obstruction.",
              },
              {
                title: "Two mask sizes",
                body: `Adult mask, plus a child mask for ages ${product.minAge}+ and ${product.childMaskMin}+.`,
              },
              {
                title: "Grab and go",
                body: "No batteries, no charging, no expiry date unless used. Compact enough for a drawer or glovebox.",
              },
            ]}
          />
          {img("v1Valve") && (
            <div className="aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
              <Picture image={img("v1Valve")!} />
            </div>
          )}
        </div>
      </Section>

      <Section
        tone="alt"
        eyebrow="Why keep one nearby"
        title="For the situations first aid alone can't cover"
        intro="Back blows and abdominal thrusts always come first. RescUAid+ gives you a next step when they aren't enough."
      >
        <Comparison
          withLabel="With RescUAid+ nearby"
          withoutLabel="Without it"
          rows={[
            {
              situation: "Back blows and thrusts aren't working",
              with: "A next step while you wait for help",
              without:
                "Keep going until EMS arrives (median ~7 min, ~13 min rural)",
            },
            {
              situation: "You're alone and choking",
              with: "Designed to be self-applied: place, press, pull",
              without:
                "Self-thrusts against a chair back, if you can manage them",
            },
            {
              situation: "The person is much larger than you",
              with: "A simple press-and-pull motion",
              without: "Abdominal thrusts can be hard to perform effectively",
            },
          ]}
        />
        <Sources items={[SOURCES.ems, SOURCES.fda]} />
      </Section>

      <Section
        eyebrow="Who it's for"
        title="Anyone who shares a table with someone they love"
      >
        <div className="grid items-center gap-10 md:grid-cols-2">
          {img("v1Caregiver") && (
            <div className="aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
              <Picture image={img("v1Caregiver")!} />
            </div>
          )}
          <ul className="grid gap-5">
            {[
              {
                icon: Baby,
                title: "Parents of young children",
                body: "Small airways and new foods. The child mask fits ages 12 months and up.",
              },
              {
                icon: HeartPulse,
                title: "Adult children of aging parents",
                body: "Swallowing can get harder with age. Keep one where they eat.",
              },
              {
                icon: UserRound,
                title: "People who live alone",
                body: "Designed so you can use it on yourself when no one is there to help.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/8 text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-muted">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        id="reviews"
        tone="alt"
        eyebrow="Reviews"
        title="From people who keep one at home"
      >
        <Reviews ids={["jessica-k", "chandra", "sarah-m"]} />
      </Section>

      <Section>
        <SafetyNotice />
      </Section>

      <Section
        id="faq"
        tone="alt"
        eyebrow="FAQ"
        title="Questions, answered plainly"
      >
        <div className="mx-auto max-w-3xl">
          <FaqList
            items={[
              faqs.firstAid,
              faqs.how,
              faqs.ages,
              faqs.self,
              faqs.reuse,
              faqs.expiry,
              faqs.learnFirstAid,
              faqs.shipping,
              faqs.guarantee,
            ]}
          />
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <Guarantee>
            <a
              href="#buy"
              className="mt-5 inline-block rounded-btn bg-brand px-6 py-3 font-bold text-brand-ink hover:bg-brand-strong"
            >
              Choose your kit
            </a>
          </Guarantee>
        </div>
      </Section>

      <StickyBuyBar
        state={state}
        label={`${product.name} · ${state.bundle.label}`}
      />
    </PageShell>
  );
}
