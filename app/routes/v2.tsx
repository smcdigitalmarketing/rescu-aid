import {
  Baby,
  HeartHandshake,
  PackageCheck,
  RotateCcw,
  Truck,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { Route } from "./+types/v2";
import { PageShell, Section } from "~/components/pdp/layout";
import {
  AddOnToggles,
  BundleOptions,
  BuyMeta,
  CtaButton,
  StickyBuyBar,
} from "~/components/pdp/buy";
import { Gallery, Picture } from "~/components/pdp/media";
import {
  FaqList,
  Guarantee,
  ReviewCard,
  SafetyNotice,
  Steps,
  TrustBar,
} from "~/components/pdp/content";
import { RiskGroups, RoomMap, Timeline } from "~/components/pdp/story";
import { AsSeenOn, ClaimBadges, ClaimRating } from "~/components/pdp/claims";
import { faqs, money, offers, perKit, policy, product } from "~/data/product";
import { img, imgs } from "~/lib/images";
import { useOffer } from "~/lib/use-offer";
import { fontHref, pdpMeta } from "~/lib/seo";

const hero = img("v2Hero");

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: fontHref(
      "family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700",
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
    title: "RescUAid+ | Ready in every room they eat in",
    description:
      "Choking rescue kits for the whole family, with adult and child masks. Buy 2, get the 3rd free: one for every floor.",
    image: hero?.src,
  });

export default function V2() {
  const state = useOffer(offers.v2, "v2");
  const familyBundle = offers.v2.bundles.find((b) => b.id === "3")!;

  return (
    <PageShell
      theme="v2"
      announcement="Buy 2, get 1 free · One for every floor of your home"
    >
      {/* Emotional hero */}
      <section className="px-4 pb-12 pt-8 sm:pt-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="order-2 md:order-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-highlight px-3 py-1 text-sm font-semibold text-accent">
              <HeartHandshake className="size-4" aria-hidden="true" />
              For families with little ones and aging parents
            </p>
            <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] text-balance sm:text-6xl">
              Ready in every room they eat in.
            </h1>
            <ClaimRating className="mt-4" />
            <p className="mt-5 text-lg text-muted text-pretty">
              Choking can happen at any age, anywhere there's food.{" "}
              {product.name} is the backup to back blows and abdominal thrusts,
              with an adult and a child mask in every kit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#buy"
                className="rounded-btn bg-brand px-7 py-4 text-center text-lg font-bold text-brand-ink transition hover:bg-brand-strong"
              >
                See family bundles
              </a>
              <span className="text-center text-sm text-muted sm:text-left">
                From {money(perKit(familyBundle))} per kit with Buy 2, Get 1
              </span>
            </div>
          </div>
          {hero && (
            <div className="order-1 aspect-[4/3] overflow-hidden rounded-card bg-surface-2 shadow-xl shadow-accent/10 md:order-2">
              <Picture image={hero} priority />
            </div>
          )}
        </div>
      </section>

      <div className="px-4 pb-4">
        <TrustBar
          className="mx-auto max-w-6xl rounded-card bg-surface p-5 shadow-sm"
          items={[
            { icon: UsersRound, label: "Adult + child masks" },
            { icon: UserRound, label: "Can be self-applied" },
            { icon: PackageCheck, label: "No expiry unless used" },
            { icon: RotateCcw, label: `${policy.guaranteeDays}-day guarantee` },
          ]}
        />
      </div>
      <AsSeenOn />

      <Section
        eyebrow="Why minutes matter"
        title="The gap between the first second and the ambulance"
        center
      >
        <Timeline />
      </Section>

      <Section
        tone="alt"
        eyebrow="Who's most at risk"
        title="The people you'd most want to protect"
      >
        <RiskGroups
          items={[
            {
              icon: Baby,
              title: "Toddlers and young kids",
              body: "Small airways, new foods and everything goes in the mouth. The child mask fits ages 12 months+.",
            },
            {
              icon: HeartHandshake,
              title: "Grandparents",
              body: "Chewing and swallowing can get harder with age. Keep one where they eat.",
            },
            {
              icon: UserRound,
              title: "Anyone living alone",
              body: "Designed so you can place, press and pull on yourself if no one is there.",
            },
          ]}
        />
      </Section>

      <Section
        id="rooms"
        eyebrow="Where to keep one"
        title="Seconds spent searching are seconds lost"
        intro="Keep a kit within reach of wherever your family eats. We recommend starting with three."
      >
        <RoomMap bundle={familyBundle} onChoose={state.setBundleId} />
      </Section>

      {/* Buy section */}
      <section
        id="buy"
        className="scroll-mt-4 bg-surface-2 px-4 py-14 sm:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:gap-16">
          <div className="md:sticky md:top-6 md:self-start">
            <Gallery
              images={imgs(["kit", "demoKitchen", "deviceMasks", "demo"])}
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {product.title}
            </h2>
            <p className="mt-3 text-muted">
              Place, press, pull. Adult and child masks, clear step-by-step
              instructions, no batteries.
            </p>
            <div className="mt-6">
              <BundleOptions state={state} style="cards" />
              <AddOnToggles state={state} />
              <div id="buy-anchor" className="mt-6">
                <CtaButton state={state} />
              </div>
              <BuyMeta state={state} />
              <ClaimBadges className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      <Section
        id="reviews"
        eyebrow="Family stories"
        title="Families who keep one close"
        center
      >
        <div className="grid gap-5 md:grid-cols-3">
          <ReviewCard id="anthoni-b" />
          <ReviewCard id="linda-martinez" />
          <ReviewCard id="mary-thompson" />
        </div>
      </Section>

      <Section tone="alt">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">
              Living alone?
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Designed to work when no one else is there.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Call 911 first if you can, even on speaker. Then place the mask,
              press and pull. The same three steps whether you're helping
              someone else or yourself.
            </p>
          </div>
          <ReviewCard id="sarah-m" />
        </div>
      </Section>

      <Section
        id="how"
        eyebrow="How it works"
        title="Place. Press. Pull."
        center
      >
        <Steps />
      </Section>

      <Section tone="alt">
        <SafetyNotice />
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Questions families ask us" center>
        <div className="mx-auto max-w-3xl">
          <FaqList
            items={[
              faqs.firstAid,
              faqs.howMany,
              faqs.ages,
              faqs.self,
              faqs.expiry,
              faqs.reuse,
              faqs.shipping,
              faqs.guarantee,
            ]}
          />
        </div>
      </Section>

      <Section tone="alt">
        <div className="mx-auto max-w-3xl">
          <Guarantee>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted sm:justify-start">
              <Truck className="size-4" aria-hidden="true" /> Ships from{" "}
              {policy.shipsFrom} in {policy.dispatch}
            </p>
          </Guarantee>
        </div>
      </Section>

      <StickyBuyBar
        state={state}
        label={`${state.bundle.label} · ${state.bundle.sub ?? product.name}`}
      />
    </PageShell>
  );
}
