import { data } from "react-router";
import type { Route } from "./+types/ads.render";
import {
  ImageCreative,
  VideoEndCard,
  VideoOverlay,
} from "~/components/ads/creatives";
import { findImageAd, findVideoAd } from "~/data/ads";
import { AD_FONTS } from "~/lib/ad-assets";
import { fontHref } from "~/lib/seo";

/**
 * Bare, native-size (1080px wide) render of one creative, screenshotted by
 * scripts/export-ads.ts. Not linked from anywhere.
 *   /ads/render/image/ad-backup
 *   /ads/render/overlay/video-backup.a1   (transparent)
 *   /ads/render/end/video-backup
 */
export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: fontHref(AD_FONTS) },
];

export const meta: Route.MetaFunction = () => [
  { name: "robots", content: "noindex, nofollow" },
];

export function loader({ params }: Route.LoaderArgs) {
  const { kind, id } = params;
  if (kind === "image" && findImageAd(id)) return { kind, id };
  if (kind === "end" && findVideoAd(id)) return { kind, id };
  if (kind === "overlay") {
    const [videoId, overlayId] = id.split(".");
    const video = findVideoAd(videoId);
    if (video?.overlays.some((o) => o.id === overlayId)) return { kind, id };
  }
  throw data("Unknown creative", { status: 404 });
}

export default function AdRender({ loaderData }: Route.ComponentProps) {
  const { kind, id } = loaderData;
  let content = null;
  if (kind === "image") content = <ImageCreative ad={findImageAd(id)!} />;
  if (kind === "end") content = <VideoEndCard video={findVideoAd(id)!} />;
  if (kind === "overlay") {
    const [videoId, overlayId] = id.split(".");
    const video = findVideoAd(videoId)!;
    content = (
      <VideoOverlay
        video={video}
        overlay={video.overlays.find((o) => o.id === overlayId)!}
      />
    );
  }
  return (
    <div id="ad" data-ad-render style={{ width: 1080 }}>
      {content}
    </div>
  );
}
