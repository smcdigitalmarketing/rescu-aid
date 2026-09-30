import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import {
  FORMAT_PX,
  type AdFormat,
  type AdTheme,
  type ImageAd,
  type Overlay,
  type VideoAd,
} from "~/data/ads";
import {
  bundleCompareAt,
  bundlePrice,
  money,
  offers,
  policy,
} from "~/data/product";
import { img } from "~/lib/images";
import type { SlotId } from "~/data/image-slots";
import { Logo } from "~/components/pdp/brand";

/*
 * Every creative is laid out in container-query units (cqw: 1% of the ad's
 * width), so the same markup renders as a small preview on /ads and at exact
 * native size (1080px wide) for export.
 */

function Frame({
  format,
  theme,
  bg,
  transparent = false,
  children,
}: {
  format: AdFormat;
  theme: AdTheme;
  bg?: SlotId;
  transparent?: boolean;
  children: ReactNode;
}) {
  const [w, h] = FORMAT_PX[format];
  const image = bg ? img(bg) : null;
  return (
    <div
      data-theme={theme}
      className={`relative w-full overflow-hidden font-sans text-ink [container-type:inline-size] ${transparent ? "" : "bg-surface-2"}`}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {image && (
        <img
          src={image.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {children}
    </div>
  );
}

function LogoChip({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[1.6cqw] bg-white px-[2.4cqw] py-[1.4cqw] shadow-sm ${className}`}
    >
      <Logo className="h-[5.2cqw]" />
    </span>
  );
}

function CtaPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-[1.4cqw] rounded-btn bg-brand px-[3.6cqw] py-[2cqw] text-[3.4cqw] font-bold text-brand-ink ${className}`}
    >
      {children}
      <ArrowRight className="size-[3.4cqw]" aria-hidden="true" />
    </span>
  );
}

const DISCLAIMER = "Always call 911 and follow standard first aid first.";

const family = offers.v3.bundles[0];

function BackupAd({ ad }: { ad: ImageAd }) {
  return (
    <Frame format={ad.format} theme={ad.theme} bg={ad.bg}>
      <div className="absolute inset-0 flex flex-col p-[6.5cqw]">
        <p className="text-[2.5cqw] font-bold uppercase tracking-[0.16em] text-brand">
          Choking rescue device
        </p>
        <h2 className="mt-[2.4cqw] max-w-[60cqw] font-display text-[8.4cqw] font-semibold leading-[1.05] text-balance">
          The backup plan when back blows aren't enough.
        </h2>
        <p className="mt-[3cqw] text-[3.6cqw] font-semibold text-muted">
          Place · Press · Pull
        </p>
        <p className="mt-[1cqw] text-[3cqw] text-muted">
          Adult + child masks in every kit
        </p>
        <div className="mt-auto flex items-end justify-between gap-[3cqw]">
          <div className="grid gap-[2.4cqw]">
            <LogoChip />
            <CtaPill>Shop RescUAid+</CtaPill>
          </div>
        </div>
        <p className="mt-[3cqw] text-[2.1cqw] text-muted">{DISCLAIMER}</p>
      </div>
    </Frame>
  );
}

function EveryRoomAd({ ad }: { ad: ImageAd }) {
  return (
    <Frame format={ad.format} theme={ad.theme} bg={ad.bg}>
      <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-bg via-bg/85 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center p-[6cqw] text-center">
        <span className="rounded-full bg-highlight px-[3cqw] py-[1.2cqw] text-[2.8cqw] font-bold text-accent">
          Buy 2, get 1 free
        </span>
        <h2 className="mt-[3cqw] font-display text-[9.6cqw] font-semibold leading-[1.02] text-balance">
          Ready in every room they eat in.
        </h2>
        <p className="mt-[2.4cqw] text-[3.4cqw] text-muted">
          Kitchen · Car · Grandma's house
        </p>
        <div className="mt-auto flex w-full items-end justify-between">
          <LogoChip />
          <CtaPill>One for every floor</CtaPill>
        </div>
      </div>
    </Frame>
  );
}

function OfferAd({ ad }: { ad: ImageAd }) {
  return (
    <Frame format={ad.format} theme={ad.theme} bg={ad.bg}>
      <div className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-highlight via-highlight/90 to-transparent" />
      <div className="absolute inset-0 flex flex-col p-[6cqw]">
        <div className="flex items-center justify-between">
          <LogoChip />
          <span className="grid size-[19cqw] rotate-[8deg] place-items-center rounded-full bg-brand text-center font-display font-bold uppercase leading-none text-brand-ink shadow-lg">
            <span>
              <span className="block text-[2.8cqw]">Save</span>
              <span className="block text-[5.8cqw]">{money(bundleCompareAt(family) - bundlePrice(family))}</span>
            </span>
          </span>
        </div>
        <h2 className="mt-[1cqw] font-display text-[12.5cqw] font-bold uppercase leading-[0.9] tracking-tight">
          Buy 2, <span className="text-brand">get 1 free</span>
        </h2>
        <div className="mt-[2.4cqw] flex flex-wrap items-center gap-[2cqw]">
          <span className="rounded-full bg-white px-[3cqw] py-[1.2cqw] font-display text-[5cqw] font-bold shadow-sm">
            3 kits {money(bundlePrice(family))}{" "}
            <s className="text-[3.6cqw] font-semibold text-ink/50">{money(bundleCompareAt(family))}</s>
          </span>
          <span className="rounded-full bg-highlight px-[2.6cqw] py-[1cqw] text-[3.4cqw] font-semibold shadow-sm">
            + free Choking Response Handbook
          </span>
        </div>
      </div>
    </Frame>
  );
}

function AloneAd({ ad }: { ad: ImageAd }) {
  return (
    <Frame format={ad.format} theme={ad.theme} bg={ad.bg}>
      <div className="absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-white via-white/85 to-transparent" />
      <div className="absolute inset-0 flex flex-col p-[6.5cqw]">
        <p className="text-[3cqw] font-semibold text-accent">
          For anyone who lives alone
        </p>
        <h2 className="mt-[2cqw] max-w-[80cqw] font-display text-[8.8cqw] font-semibold leading-[1.04] text-balance">
          Designed to work when no one else is there.
        </h2>
        <ol className="mt-[3cqw] flex gap-[1.6cqw]">
          {["Place", "Press", "Pull"].map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-[1.4cqw] rounded-full bg-white py-[0.9cqw] pl-[0.9cqw] pr-[2.8cqw] text-[3.2cqw] font-bold shadow-sm"
            >
              <span className="grid size-[5cqw] place-items-center rounded-full bg-brand text-[2.8cqw] text-brand-ink">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-auto flex justify-end">
          <LogoChip />
        </div>
      </div>
    </Frame>
  );
}

function GiftAd({ ad }: { ad: ImageAd }) {
  return (
    <Frame format={ad.format} theme={ad.theme} bg={ad.bg}>
      {/* Top 14% and bottom 35% are covered by Stories/Reels UI, so copy sits between them. */}
      <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/55 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 top-[15%] flex flex-col items-center px-[7cqw] text-center text-white">
        <LogoChip />
        <h2 className="mt-[5cqw] font-display text-[11cqw] font-semibold leading-[1.02] text-balance [text-shadow:0_0.4cqw_2cqw_rgba(0,0,0,0.45)]">
          The gift for Grandma's kitchen.
        </h2>
        <p className="mt-[3cqw] text-[4.2cqw] [text-shadow:0_0.3cqw_1.4cqw_rgba(0,0,0,0.5)]">
          The one they'll hope they never use.
        </p>
        <span className="mt-[5cqw] rounded-full bg-highlight px-[4cqw] py-[1.8cqw] text-[3.8cqw] font-bold text-accent">
          Buy 2, get 1 free
        </span>
      </div>
    </Frame>
  );
}

const LAYOUTS: Record<string, (p: { ad: ImageAd }) => ReactNode> = {
  "ad-backup": BackupAd,
  "ad-every-room": EveryRoomAd,
  "ad-offer": OfferAd,
  "ad-alone": AloneAd,
  "ad-gift": GiftAd,
};

export function ImageCreative({ ad }: { ad: ImageAd }) {
  const Layout = LAYOUTS[ad.id];
  return Layout ? <Layout ad={ad} /> : null;
}

/** Transparent 9:16 text layer composited over a Veo clip by scripts/build-videos.ts. */
export function VideoOverlay({
  video,
  overlay,
}: {
  video: VideoAd;
  overlay: Overlay;
}) {
  return (
    <Frame format="9:16" theme={video.theme} transparent>
      <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 top-[15%] px-[8cqw] text-center text-white [text-shadow:0_0.4cqw_2cqw_rgba(0,0,0,0.5)]">
        {overlay.kicker && (
          <p className="mb-[2.4cqw] text-[3.6cqw] font-bold uppercase tracking-[0.14em] text-highlight">
            {overlay.kicker}
          </p>
        )}
        <p
          className={`font-display font-bold leading-[1.02] text-balance ${
            video.theme === "v3"
              ? `${overlay.title.length > 30 ? "text-[8cqw]" : "text-[10cqw]"} uppercase`
              : overlay.title.length > 30
                ? "text-[8cqw]"
                : "text-[9.4cqw]"
          }`}
        >
          {overlay.title}
        </p>
        {overlay.sub && (
          <p className="mt-[2.4cqw] text-[5cqw] font-semibold">{overlay.sub}</p>
        )}
      </div>
    </Frame>
  );
}

/** Opaque 9:16 end card held at the end of each video. */
export function VideoEndCard({ video }: { video: VideoAd }) {
  const kit = img("kit");
  return (
    <Frame format="9:16" theme={video.theme}>
      <div className="absolute inset-0 flex flex-col items-center bg-bg px-[8cqw] pt-[14%] text-center">
        <Logo className="h-[12cqw]" />
        {kit && (
          <img
            src={kit.src}
            alt=""
            className="mt-[4cqw] aspect-square w-[40cqw] rounded-[4cqw] object-cover shadow-xl"
          />
        )}
        <p
          className={`mt-[4cqw] font-display font-bold leading-none ${video.theme === "v3" ? "text-[10cqw] uppercase" : "text-[9cqw]"}`}
        >
          Buy 2, get 1 free
        </p>
        <p className="mt-[2.4cqw] text-[4cqw] text-muted">
          Adult + child masks · {policy.guaranteeDays}-day guarantee
        </p>
        <CtaPill className="mt-[4cqw] !text-[4.4cqw]">Shop now</CtaPill>
        <p className="mt-[3cqw] text-[3cqw] text-muted">{DISCLAIMER}</p>
      </div>
    </Frame>
  );
}
