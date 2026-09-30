import { data } from "react-router";
import type { Route } from "./+types/demo";
import { DemoBanner } from "~/components/pdp/claims";
import { AD_FONTS } from "~/lib/ad-assets";
import { DemoClaims } from "~/lib/claims-mode";
import { fontHref } from "~/lib/seo";
import V1 from "./v1";
import V2 from "./v2";
import V3 from "./v3";

/**
 * Internal proposal view: the same PDPs with every client-supplied claim
 * shown (sources or not) under a "pending verification" banner.
 * /v1–/v3 stay claim-free until each claim has a source in claims.ts.
 */
const PAGES = { v1: V1, v2: V2, v3: V3 } as const;
type Variant = keyof typeof PAGES;

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: fontHref(AD_FONTS) },
];

export const meta: Route.MetaFunction = ({ params }) => [
  {
    title: `DEMO · RescUAid+ ${params.variant?.toUpperCase()} (claims pending verification)`,
  },
  { name: "robots", content: "noindex, nofollow" },
];

export function loader({ params }: Route.LoaderArgs) {
  if (!(params.variant in PAGES))
    throw data("Unknown variant", { status: 404 });
  return { variant: params.variant as Variant };
}

export default function Demo({ loaderData }: Route.ComponentProps) {
  const Page = PAGES[loaderData.variant];
  return (
    <DemoClaims>
      <DemoBanner />
      <Page />
    </DemoClaims>
  );
}
