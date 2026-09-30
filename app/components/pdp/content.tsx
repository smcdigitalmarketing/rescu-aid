import type { ComponentType, ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Minus,
  Quote,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  boxContents,
  policy,
  steps,
  usageNotice,
  type Faq,
} from "~/data/product";
import { reviewById } from "~/data/reviews";
import { img, type ResolvedImage } from "~/lib/images";
import { Stars } from "./brand";
import { Picture } from "./media";

type Icon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true";
}>;

export function TrustBar({
  items,
  className = "",
}: {
  items: { icon: Icon; label: string }[];
  className?: string;
}) {
  return (
    <ul
      className={`grid grid-cols-2 gap-3 text-sm font-medium sm:grid-cols-4 ${className}`}
    >
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
            <Icon className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="leading-snug">{label}</span>
        </li>
      ))}
    </ul>
  );
}

const stepImages = [img("stepPlace"), img("stepPress"), img("stepPull")];

/** Place · Press · Pull. Uses generated step photos when present, numbers otherwise. */
export function Steps({ style = "cards" }: { style?: "cards" | "strip" }) {
  if (style === "strip") {
    return (
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="flex items-start gap-4 rounded-card border-2 border-ink bg-surface p-4 motion-safe:animate-[step-cycle_4.5s_infinite]"
            style={{ animationDelay: `${i * 1.5 - 4.5}s` }}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand font-display text-xl font-bold text-brand-ink">
              {i + 1}
            </span>
            <span>
              <span className="block font-display text-xl font-bold uppercase tracking-wide">
                {s.title}
              </span>
              <span className="text-sm text-muted">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="grid gap-6 md:grid-cols-3">
      {steps.map((s, i) => {
        const image = stepImages[i];
        return (
          <li
            key={s.title}
            className="overflow-hidden rounded-card border border-line bg-surface"
          >
            {image ? (
              <div className="aspect-[4/3] bg-surface-2">
                <Picture image={image} />
              </div>
            ) : (
              <div className="px-5 pt-5">
                <span className="grid size-14 place-items-center rounded-full bg-brand/10 font-display text-3xl font-semibold text-brand">
                  {i + 1}
                </span>
              </div>
            )}
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-muted">{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function WhatsInBox({ image }: { image: ResolvedImage | null }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      {image && (
        <div className="aspect-square overflow-hidden rounded-card bg-surface-2">
          <Picture image={image} />
        </div>
      )}
      <ul className="grid gap-4">
        {boxContents.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-card border border-line bg-surface p-4"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-success/12 text-success">
              <Check className="size-4" strokeWidth={3} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">{item.title}</span>
              <span className="text-sm text-muted">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeatureList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <dl className="grid gap-6 sm:grid-cols-2">
      {items.map((f) => (
        <div key={f.title} className="border-t-2 border-brand pt-4">
          <dt className="font-semibold">{f.title}</dt>
          <dd className="mt-1 text-muted">{f.body}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Comparison({
  rows,
  withLabel,
  withoutLabel,
}: {
  rows: { situation: string; with: string; without: string }[];
  withLabel: string;
  withoutLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <table className="w-full text-left text-sm sm:text-base">
        <caption className="sr-only">
          {withLabel} compared with {withoutLabel}
        </caption>
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="hidden p-4 font-semibold sm:table-cell">
              If…
            </th>
            <th scope="col" className="p-4 font-semibold text-brand">
              {withLabel}
            </th>
            <th scope="col" className="p-4 font-semibold">
              {withoutLabel}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.situation} className="align-top">
              <th
                scope="row"
                className="hidden p-4 font-semibold sm:table-cell"
              >
                {r.situation}
              </th>
              <td className="p-4">
                <span className="mb-1 block text-xs font-semibold text-muted sm:hidden">
                  {r.situation}
                </span>
                <span className="flex gap-2">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-success"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {r.with}
                </span>
              </td>
              <td className="p-4 text-muted">
                <span
                  className="mb-1 block text-xs font-semibold opacity-0 sm:hidden"
                  aria-hidden="true"
                >
                  {r.situation}
                </span>
                <span className="flex gap-2">
                  <Minus
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {r.without}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReviewCard({
  id,
  compact = false,
}: {
  id: string;
  compact?: boolean;
}) {
  const r = reviewById(id);
  return (
    <figure className="flex h-full flex-col rounded-card border border-line bg-surface p-6">
      {r.rating ? (
        <Stars rating={r.rating} />
      ) : (
        <Quote className="size-6 text-brand" aria-hidden="true" />
      )}
      <blockquote
        className={`mt-4 flex-1 text-pretty ${compact ? "text-[15px]" : "text-base leading-relaxed"}`}
      >
        “{r.quote}”
      </blockquote>
      <figcaption className="mt-5 border-t border-line pt-4 text-sm">
        <span className="block font-semibold">{r.name}</span>
        <span className="text-muted">{r.meta}</span>
      </figcaption>
    </figure>
  );
}

export function Reviews({
  ids,
  columns = 3,
}: {
  ids: string[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-5 ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
    >
      {ids.map((id) => (
        <ReviewCard key={id} id={id} />
      ))}
    </div>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-surface">
      {items.map((f) => (
        <details key={f.q} className="group px-5">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-semibold">
            {f.q}
            <ChevronDown
              className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="-mt-1 pb-5 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function SafetyNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      aria-labelledby="safety-title"
      className={`rounded-card border-2 border-accent/25 bg-surface ${compact ? "p-5" : "p-6 sm:p-8"}`}
    >
      <p id="safety-title" className="flex items-center gap-2 font-bold">
        <TriangleAlert className="size-5 text-brand" aria-hidden="true" />
        {usageNotice.title}
      </p>
      <ul className="mt-3 grid gap-2 text-[15px] text-muted">
        {usageNotice.body.map((line) => (
          <li key={line} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted"
            />
            {line}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Guarantee({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
      <div className="grid size-28 shrink-0 place-items-center rounded-full border-4 border-brand text-brand">
        <div className="text-center leading-none">
          <ShieldCheck className="mx-auto mb-1 size-6" aria-hidden="true" />
          <span className="block font-display text-3xl font-bold">
            {policy.guaranteeDays}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest">
            day
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold">
          {policy.guaranteeDays}-day money-back guarantee
        </h3>
        <p className="mt-2 max-w-xl text-muted">
          Keep it in your kitchen for {policy.guaranteeDays} days. If you decide
          it isn't for you, contact us and we'll make it right.
        </p>
        {children}
      </div>
    </div>
  );
}

export function Sources({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <p className="mt-6 text-xs text-muted">
      Sources:{" "}
      {items.map((s, i) => (
        <span key={s.href}>
          {i > 0 && " · "}
          <a
            href={s.href}
            className="underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            {s.label}
          </a>
        </span>
      ))}
    </p>
  );
}

/** Research citations used by the timeline sections. */
export const SOURCES = {
  ems: {
    label: "Mell et al., JAMA Surgery (2017): EMS response times",
    href: "https://jamanetwork.com/journals/jamasurgery/fullarticle/2643992",
  },
  hypoxia: {
    label: "MedlinePlus (NIH): Cerebral hypoxia",
    href: "https://medlineplus.gov/ency/article/001435.htm",
  },
  fda: {
    label: "FDA: Follow established choking rescue protocols",
    href: "https://www.fda.gov/medical-devices/safety-communications/update-fda-encourages-public-follow-established-choking-rescue-protocols-fda-safety-communication",
  },
};
