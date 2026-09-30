import { useState } from "react";
import { Check, Copy, Download, ExternalLink, Film } from "lucide-react";
import type { Route } from "./+types/ads";
import { Logo } from "~/components/pdp/brand";
import {
  ImageCreative,
  VideoEndCard,
  VideoOverlay,
} from "~/components/ads/creatives";
import {
  FORMAT_LABEL,
  imageAds,
  landingUrl,
  videoAds,
  videoClips,
  videoDuration,
  type AdCopy,
  type VideoAd,
} from "~/data/ads";
import {
  CLIP_SECONDS,
  OBSERVED_IMAGE_COST,
  PRICED_AT,
  VIDEO_PRICES,
  VIDEO_TIERS,
} from "~/data/pricing";
import { adAsset, AD_FONTS } from "~/lib/ad-assets";
import { img } from "~/lib/images";
import { fontHref } from "~/lib/seo";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: fontHref(AD_FONTS) },
];

export const meta: Route.MetaFunction = () => [
  { title: "RescUAid ad creatives" },
  { name: "robots", content: "noindex, nofollow" },
];

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e2e7ee] px-2 py-1 text-xs font-medium text-[#536175] hover:border-[#13306b] hover:text-[#13306b]"
      aria-label="Copy to clipboard"
    >
      {done ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function Field({
  label,
  text,
  limit,
}: {
  label: string;
  text: string;
  limit?: number;
}) {
  const over = limit !== undefined && text.length > limit;
  return (
    <div className="rounded-lg border border-[#e2e7ee] bg-white p-3">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#536175]">
          {label}
          {limit !== undefined && (
            <span
              className={`ml-2 font-normal normal-case ${over ? "text-[#c8102e]" : ""}`}
            >
              {text.length}/{limit}
            </span>
          )}
        </span>
        <CopyButton text={text} />
      </div>
      <p className="whitespace-pre-line text-sm">{text}</p>
    </div>
  );
}

function CopyPanel({
  copy,
  id,
  landing,
}: {
  copy: AdCopy;
  id: string;
  landing: "v1" | "v2" | "v3";
}) {
  return (
    <div className="grid gap-2">
      <Field label="Primary text A" text={copy.primary[0]} />
      <Field label="Primary text B" text={copy.primary[1]} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Headline" text={copy.headline} limit={40} />
        <Field label="Description" text={copy.description} limit={30} />
      </div>
      <Field label="TikTok ad text" text={copy.tiktok} limit={100} />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#536175]">
        <span>
          CTA button: <strong className="text-[#0f1b2d]">{copy.cta}</strong>
        </span>
        <a
          href={landingUrl(landing, id)}
          className="inline-flex items-center gap-1 text-[#13306b] underline underline-offset-2"
        >
          Landing: /{landing}{" "}
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
        <CopyButton text={landingUrl(landing, id)} />
      </div>
    </div>
  );
}

function Storyboard({ video }: { video: VideoAd }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {video.segments.map((seg) => {
        const clip = videoClips.find((c) => c.id === seg.clip)!;
        const frame = img(clip.firstFrame);
        return seg.overlays.map(({ overlay, from, to }) => (
          <figure key={`${seg.clip}-${overlay}`} className="w-40 shrink-0">
            <div
              className="relative overflow-hidden rounded-lg bg-[#e2e7ee]"
              style={{ aspectRatio: "9 / 16" }}
            >
              {frame && (
                <img
                  src={frame.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0">
                <VideoOverlay
                  video={video}
                  overlay={video.overlays.find((o) => o.id === overlay)!}
                />
              </div>
            </div>
            <figcaption className="mt-1 text-xs text-[#536175]">
              Clip {seg.clip} · {(to - from).toFixed(1)}s
            </figcaption>
          </figure>
        ));
      })}
      <figure className="w-40 shrink-0">
        <div className="overflow-hidden rounded-lg">
          <VideoEndCard video={video} />
        </div>
        <figcaption className="mt-1 text-xs text-[#536175]">
          End card · {video.endCard}s
        </figcaption>
      </figure>
    </div>
  );
}

const clipSeconds = videoClips.length * CLIP_SECONDS;
const imageCount = imageAds.length + videoClips.length;
const COST_ROWS = [
  {
    item: `${imageAds.length} ad images + ${videoClips.length} video first frames (Gemini 3 Pro Image)`,
    math: `${imageCount} × ~$${OBSERVED_IMAGE_COST.toFixed(2)}`,
    usd: imageCount * OBSERVED_IMAGE_COST,
  },
  {
    item: "Allowance to redo images",
    math: "~50%",
    usd: imageCount * OBSERVED_IMAGE_COST * 0.5,
  },
  {
    item: "Video drafts (Veo 3.1 Fast, 1080p), 2 rounds",
    math: `${clipSeconds}s × $${VIDEO_PRICES[VIDEO_TIERS.draft]["1080p"]}/s × 2`,
    usd: clipSeconds * VIDEO_PRICES[VIDEO_TIERS.draft]["1080p"] * 2,
  },
  {
    item: "Final videos (Veo 3.1, 1080p)",
    math: `${clipSeconds}s × $${VIDEO_PRICES[VIDEO_TIERS.final]["1080p"]}/s`,
    usd: clipSeconds * VIDEO_PRICES[VIDEO_TIERS.final]["1080p"],
  },
];
const COST_TOTAL = COST_ROWS.reduce((s, r) => s + r.usd, 0);

export default function Ads() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 font-[Inter,sans-serif] text-[#0f1b2d]">
      <Logo className="h-11" />
      <h1 className="mt-6 text-3xl font-bold">Ad creatives</h1>
      <p className="mt-2 max-w-3xl text-[#536175]">
        {imageAds.length} image ads and {videoAds.length} video ads for Meta and
        TikTok, each pointing at one PDP variant with UTMs, so every order is
        tagged with both the creative and the page.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Image ads</h2>
        <div className="mt-6 grid gap-10">
          {imageAds.map((ad, i) => {
            const png = adAsset(`${ad.id}.png`);
            return (
              <article
                key={ad.id}
                className="grid gap-6 border-t border-[#e2e7ee] pt-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-10"
              >
                <div
                  className={
                    ad.format === "9:16"
                      ? "mx-auto w-full max-w-[260px]"
                      : "w-full"
                  }
                >
                  <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5">
                    <ImageCreative ad={ad} />
                  </div>
                  <p className="mt-2 text-xs text-[#536175]">
                    {FORMAT_LABEL[ad.format]}
                  </p>
                  {png ? (
                    <a
                      href={png}
                      download={`rescuaid-${ad.id}.png`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#13306b]"
                    >
                      <Download className="size-4" aria-hidden="true" />{" "}
                      Download PNG
                    </a>
                  ) : (
                    <p className="mt-2 text-xs text-[#536175]">
                      PNG not exported yet (npm run ads:export)
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c8102e]">
                    Image ad {i + 1}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">{ad.name}</h3>
                  <p className="mt-1 text-[#536175]">{ad.angle}</p>
                  <div className="mt-4">
                    <CopyPanel copy={ad.copy} id={ad.id} landing={ad.landing} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold">Video ads</h2>
        <p className="mt-1 text-[#536175]">
          9:16 for Reels, Stories and TikTok. Each video is two 8-second Veo
          clips trimmed and joined, with HTML text overlays and a branded end
          card.
        </p>
        <div className="mt-6 grid gap-10">
          {videoAds.map((video, i) => {
            const mp4 = adAsset(`${video.id}.mp4`);
            const poster = adAsset(`${video.id}.jpg`);
            return (
              <article
                key={video.id}
                className="grid gap-6 border-t border-[#e2e7ee] pt-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-10"
              >
                <div>
                  {mp4 ? (
                    <>
                      <video
                        src={mp4}
                        poster={poster}
                        controls
                        playsInline
                        preload="none"
                        className="mx-auto w-full max-w-[260px] rounded-xl bg-black shadow-lg"
                      />
                      <a
                        href={mp4}
                        download={`rescuaid-${video.id}.mp4`}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#13306b]"
                      >
                        <Download className="size-4" aria-hidden="true" />{" "}
                        Download MP4
                      </a>
                    </>
                  ) : (
                    <div className="grid aspect-[9/16] max-w-[260px] place-items-center rounded-xl border-2 border-dashed border-[#e2e7ee] p-6 text-center text-sm text-[#536175]">
                      <span>
                        <Film
                          className="mx-auto mb-2 size-8"
                          aria-hidden="true"
                        />
                        Video not rendered yet. The storyboard shows the planned
                        shots.
                      </span>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-[#536175]">
                    9:16 · 1080×1920 · ~{videoDuration(video).toFixed(0)}s
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c8102e]">
                    Video ad {i + 1}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">{video.name}</h3>
                  <p className="mt-1 text-[#536175]">{video.angle}</p>
                  <div className="mt-4">
                    <Storyboard video={video} />
                  </div>
                  <div className="mt-4">
                    <CopyPanel
                      copy={video.copy}
                      id={video.id}
                      landing={video.landing}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-[#e2e7ee] bg-[#f5f7fa] p-6">
        <h2 className="text-xl font-bold">Production cost estimate</h2>
        <p className="mt-1 text-sm text-[#536175]">
          Gemini API paid-tier prices as of {PRICED_AT}. Veo only charges for
          videos that generate successfully.
        </p>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[#536175]">
            <tr>
              <th className="py-2 font-semibold">Item</th>
              <th className="py-2 font-semibold">Math</th>
              <th className="py-2 text-right font-semibold">USD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e7ee]">
            {COST_ROWS.map((r) => (
              <tr key={r.item}>
                <td className="py-2 pr-4">{r.item}</td>
                <td className="py-2 pr-4 text-[#536175]">{r.math}</td>
                <td className="py-2 text-right tabular-nums">
                  ${r.usd.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="py-2" colSpan={2}>
                Estimated total
              </td>
              <td className="py-2 text-right tabular-nums">
                ${COST_TOTAL.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <ol className="mt-5 list-decimal space-y-1 pl-5 text-sm text-[#536175]">
          <li>
            <code>npm run images</code>: ad backgrounds and video first frames
          </li>
          <li>
            <code>npm run videos -- --tier draft</code>: Veo clips (
            <code>--dry-run</code> prints the cost first)
          </li>
          <li>
            <code>npm run ads:export</code>: PNGs, video overlays and end cards
            (needs <code>npm run dev</code> running)
          </li>
          <li>
            <code>npm run videos:build</code>: joins clips, overlays and end
            card into the final MP4s
          </li>
        </ol>
      </section>
    </main>
  );
}
