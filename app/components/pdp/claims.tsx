import {
  BadgeCheck,
  Flag,
  Stethoscope,
  Timer,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ClaimKey } from "~/data/claims";
import { resolveClaim, useClaim, useClaimsMode } from "~/lib/claims-mode";
import { Stars } from "./brand";

/*
 * Claim slots. Each renders nothing unless useClaim() returns wording, so the
 * live pages stay claim-free until sources are added, and the /demo pages
 * show everything the client supplied.
 */

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 bg-[repeating-linear-gradient(135deg,#111_0_14px,#1d1d1d_14px_28px)] px-4 py-2 text-center text-[13px] font-semibold text-[#ffe14d]">
      DEMO · Includes client claims pending verification · Not for publication
    </div>
  );
}

/** Marks a claim as unverified on demo pages. */
function Pending() {
  return useClaimsMode() === "demo" ? (
    <sup
      className="ml-0.5 text-[0.7em] font-bold text-[#b45309]"
      title="Pending verification"
    >
      *
    </sup>
  ) : null;
}

export function ClaimRating({ className = "" }: { className?: string }) {
  const text = useClaim("aggregateRating");
  if (!text) return null;
  return (
    <p className={`flex items-center gap-2 text-sm font-semibold ${className}`}>
      <Stars rating={5} />
      <span>
        {text}
        <Pending />
      </span>
    </p>
  );
}

type Icon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true";
}>;
const BADGES: { key: ClaimKey; icon: Icon }[] = [
  { key: "fda", icon: BadgeCheck },
  { key: "madeInUsa", icon: Flag },
  { key: "doctorRecommended", icon: Stethoscope },
  { key: "speed", icon: Timer },
  { key: "clinical", icon: TrendingUp },
  { key: "livesProtected", icon: UsersRound },
];

export function ClaimBadges({ className = "" }: { className?: string }) {
  const mode = useClaimsMode();
  const visible = BADGES.map((b) => ({ ...b, text: resolveClaim(mode, b.key) })).filter((b) => b.text);
  if (!visible.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Product claims">
      {visible.map(({ key, icon: Icon, text }) => (
        <li
          key={key}
          className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold"
        >
          <Icon className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>
            {text}
            <Pending />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AsSeenOn({ className = "" }: { className?: string }) {
  const text = useClaim("asSeenOn");
  if (!text) return null;
  const outlets = text.replace(/^as seen on\s*/i, "").split("·");
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-5 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
        As seen on
        <Pending />
      </span>
      {outlets.map((o) => (
        <span key={o} className="font-serif text-xl font-black tracking-wide text-ink/70">
          {o.trim()}
        </span>
      ))}
    </div>
  );
}
