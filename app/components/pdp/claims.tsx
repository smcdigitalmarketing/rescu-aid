import {
  BadgeCheck,
  Flag,
  Stethoscope,
  Timer,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";
import { claim, claimBadge, type ClaimKey } from "~/data/claims";
import { Stars } from "./brand";

/*
 * Claim slots. Each renders nothing unless claim() returns wording, so
 * turning SHOW_UNSOURCED_CLAIMS off in claims.ts hides every unsourced claim.
 */

export function ClaimRating({ className = "" }: { className?: string }) {
  const text = claim("aggregateRating");
  if (!text) return null;
  return (
    <p className={`flex items-center gap-2 text-sm font-semibold ${className}`}>
      <Stars rating={5} />
      {text}
    </p>
  );
}

type Icon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true";
}>;
const SEALS: { key: ClaimKey; icon: Icon }[] = [
  { key: "fda", icon: BadgeCheck },
  { key: "madeInUsa", icon: Flag },
  { key: "doctorRecommended", icon: Stethoscope },
  { key: "livesProtected", icon: UsersRound },
  { key: "speed", icon: Timer },
  { key: "clinical", icon: TrendingUp },
];

/** Seal-style trust badges shown under the buy button. */
export function TrustBadges({ className = "" }: { className?: string }) {
  const visible = SEALS.map((s) => ({ ...s, label: claimBadge(s.key) })).filter(
    (s) => s.label,
  );
  if (!visible.length) return null;
  return (
    <ul
      className={`grid grid-cols-3 gap-2 ${className}`}
      aria-label="Trust badges"
    >
      {visible.map(({ key, icon: Icon, label }) => (
        <li
          key={key}
          className="flex flex-col items-center gap-1.5 rounded-card border border-line bg-surface px-2 py-3 text-center"
        >
          <span className="grid size-10 place-items-center rounded-full border-2 border-accent text-accent">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-[11px] font-bold uppercase leading-tight tracking-wide">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AsSeenOn({ className = "" }: { className?: string }) {
  const text = claim("asSeenOn");
  if (!text) return null;
  const outlets = text.replace(/^as seen on\s*/i, "").split("·");
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-5 ${className}`}
    >
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
        As seen on
      </span>
      {outlets.map((o) => (
        <span
          key={o}
          className="font-serif text-xl font-black tracking-wide text-ink/70"
        >
          {o.trim()}
        </span>
      ))}
    </div>
  );
}
