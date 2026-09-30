import { useEffect, useState } from "react";
import { Check, Gift, Lock, RotateCcw, Truck } from "lucide-react";
import {
  bundleCompareAt,
  bundlePrice,
  bundleSavings,
  money,
  perKit,
  policy,
  product,
} from "~/data/product";
import { trackAddToCart } from "~/lib/cart";
import type { ResolvedImage } from "~/lib/images";
import type { OfferState } from "~/lib/use-offer";

/** Radio-group of bundles. `list` = compact rows (V1), `cards` = large tiles (V2). */
export function BundleOptions({
  state,
  style,
}: {
  state: OfferState;
  style: "list" | "cards";
}) {
  const { offer, bundle: selected, setBundleId, pdp } = state;
  return (
    <fieldset id="buy-options" className="scroll-mt-6">
      <legend className="mb-3 text-sm font-semibold">How many kits?</legend>
      <div className={style === "cards" ? "grid gap-3" : "grid gap-2"}>
        {offer.bundles.map((b) => {
          const active = b.id === selected.id;
          const savings = bundleSavings(b);
          return (
            <label
              key={b.id}
              className={`relative flex cursor-pointer items-center gap-3 border-2 bg-surface transition ${
                style === "cards"
                  ? "rounded-card p-4"
                  : "rounded-card px-4 py-3"
              } ${active ? "border-brand shadow-sm" : "border-line hover:border-muted/50"}`}
            >
              <input
                type="radio"
                name={`bundle-${pdp}`}
                value={b.id}
                checked={active}
                onChange={() => setBundleId(b.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                  active ? "border-brand bg-brand" : "border-line"
                }`}
              >
                {active && (
                  <span className="size-2 rounded-full bg-brand-ink" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={`font-bold ${style === "cards" ? "text-lg" : ""}`}
                  >
                    {b.label}
                  </span>
                  {b.badge && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-ink">
                      {b.badge}
                    </span>
                  )}
                </span>
                {b.sub && (
                  <span className="block text-sm text-muted">{b.sub}</span>
                )}
                {style === "cards" && b.kits > 1 && (
                  <span className="mt-1 block text-sm font-semibold text-success">
                    {money(perKit(b))} per kit · you save {money(savings)}
                  </span>
                )}
              </span>
              <span className="text-right">
                <span className="block font-bold tabular-nums">
                  {money(bundlePrice(b))}
                </span>
                {savings > 0 && (
                  <s className="block text-sm tabular-nums text-muted">
                    {money(bundleCompareAt(b))}
                  </s>
                )}
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-card ring-brand/40 peer-focus-visible:ring-4" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function AddOnToggles({ state }: { state: OfferState }) {
  const items = state.offer.addOns ?? [];
  if (!items.length) return null;
  return (
    <fieldset className="mt-5">
      <legend className="mb-3 text-sm font-semibold">Complete your kit</legend>
      <div className="grid gap-2">
        {items.map((a) => {
          const on = state.addOnIds.has(a.id);
          return (
            <label
              key={a.id}
              className={`relative flex cursor-pointer items-start gap-3 rounded-card border bg-surface p-3 transition ${
                on ? "border-brand" : "border-line"
              }`}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => state.toggleAddOn(a.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border-2 ${
                  on ? "border-brand bg-brand text-brand-ink" : "border-line"
                }`}
              >
                {on && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="flex-1 text-sm">
                <span className="block font-semibold">
                  {a.title} <span className="font-bold">+{money(a.price)}</span>
                </span>
                <span className="text-muted">{a.blurb}</span>
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-card ring-brand/40 peer-focus-visible:ring-4" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CtaButton({
  state,
  label,
  className = "",
}: {
  state: OfferState;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={state.cartUrl}
      onClick={() => trackAddToCart(state.pdp, state.bundle.id, state.total)}
      className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-btn bg-brand px-6 py-4 text-center text-lg font-bold text-brand-ink shadow-lg shadow-brand/25 transition hover:bg-brand-strong focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand/40 ${className}`}
    >
      {label ?? "Add to cart"}
      <span aria-hidden="true">·</span>
      <span className="tabular-nums">{money(state.total)}</span>
    </a>
  );
}

export function BuyMeta({ state }: { state: OfferState }) {
  const rows = [
    {
      icon: Truck,
      text: state.freeShipping
        ? `Free US shipping · ships in ${policy.dispatch}`
        : `Ships in ${policy.dispatch} · free shipping over $${policy.freeShippingMin}`,
    },
    {
      icon: RotateCcw,
      text: `${policy.guaranteeDays}-day money-back guarantee`,
    },
    { icon: Lock, text: "Secure checkout on rescuaid.com" },
  ];
  return (
    <ul className="mt-4 grid gap-2 text-sm text-muted">
      {rows.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-success" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}

/** V3: the whole offer as one receipt-style value stack. */
export function ValueStack({
  state,
  id,
  thumb,
}: {
  state: OfferState;
  id?: string;
  /** Small product image shown in the header on mobile only. */
  thumb?: ResolvedImage;
}) {
  const { bundle, gift, offer, setBundleId } = state;
  const multi = bundle.kits > 1;
  const alt = offer.bundles.find((b) => b.id !== bundle.id);
  return (
    <div
      id={id}
      className="scroll-mt-6 rounded-card border-2 border-ink bg-surface p-4 shadow-[6px_6px_0_0_var(--ink)] sm:p-5"
    >
      <div className="flex items-center gap-3">
        {thumb && (
          <img src={thumb.src} alt="" className="size-14 shrink-0 rounded-lg bg-surface-2 object-cover md:hidden" />
        )}
        <div>
          <p className="font-display text-2xl font-bold uppercase leading-none tracking-wide">{bundle.label}</p>
          {bundle.sub && <p className="mt-1 text-sm text-muted">{bundle.sub}</p>}
        </div>
      </div>
      <ul className="mt-4 divide-y divide-line border-y border-line text-[15px]">
        <li className="flex justify-between gap-4 py-2 sm:py-2.5">
          <span>
            {bundle.kits}× {product.name} kit{multi ? "s" : ""}
          </span>
          <span className="tabular-nums">{money(bundleCompareAt(bundle))}</span>
        </li>
        {multi && (
          <li className="flex justify-between gap-4 py-2 sm:py-2.5 font-semibold text-success">
            <span>Buy 2, Get 1 Free</span>
            <span className="tabular-nums">
              −{money(bundleSavings(bundle))}
            </span>
          </li>
        )}
        {gift && (
          <li className="flex justify-between gap-4 py-2 sm:py-2.5">
            <span className="flex items-center gap-1.5">
              <Gift className="size-4 text-brand" aria-hidden="true" />
              {gift.title}
            </span>
            <span className="tabular-nums">
              <s className="mr-1.5 text-muted">{money(gift.compareAt ?? 0)}</s>
              <strong>FREE</strong>
            </span>
          </li>
        )}
        <li className="flex justify-between gap-4 py-2 sm:py-2.5">
          <span>{policy.guaranteeDays}-day money-back guarantee</span>
          <strong>Included</strong>
        </li>
      </ul>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold">Today</span>
        <span className="text-right">
          {state.savings > 0 && (
            <s className="mr-2 text-lg tabular-nums text-muted">
              {money(state.compareAt)}
            </s>
          )}
          <span className="font-display text-4xl font-bold tabular-nums">
            {money(state.total)}
          </span>
        </span>
      </div>
      {state.savings > 0 && (
        <p className="mt-2 rounded bg-highlight px-3 py-1.5 text-center text-sm font-bold">
          You save {money(state.savings)} ({money(state.total / bundle.kits)}{" "}
          per kit)
        </p>
      )}
      <CtaButton
        state={state}
        label={multi ? `Get my ${bundle.kits} kits` : "Add 1 kit to cart"}
        className="mt-4 font-display uppercase tracking-wide"
      />
      {alt && (
        <button
          type="button"
          onClick={() => setBundleId(alt.id)}
          className="mt-3 w-full text-center text-sm text-muted underline underline-offset-2 hover:text-ink"
        >
          {alt.kits === 1
            ? `Just want 1 kit? ${money(bundlePrice(alt))}`
            : `Switch to ${alt.label}: ${alt.kits} kits for ${money(bundlePrice(alt))}`}
        </button>
      )}
    </div>
  );
}

/**
 * Mobile purchase bar. Hidden near the top of the page and while the main
 * buy box (#buy-anchor) is on screen. Before the visitor reaches the buy box
 * it jumps to the bundle picker; after it, it goes straight to the cart.
 */
export function StickyBuyBar({ state, label }: { state: OfferState; label: string }) {
  const [anchor, setAnchor] = useState<"hidden" | "below" | "above">("hidden");
  useEffect(() => {
    const target = document.getElementById("buy-anchor");
    if (!target) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
      if (onScreen || window.scrollY < 400) setAnchor("hidden");
      else setAnchor(rect.top >= window.innerHeight ? "below" : "above");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const show = anchor !== "hidden";
  const toCart = anchor === "above";

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{label}</p>
          <p className="text-sm tabular-nums text-muted">
            {money(state.total)}
            {state.savings > 0 && <s className="ml-1.5">{money(state.compareAt)}</s>}
          </p>
        </div>
        <a
          href={toCart ? state.cartUrl : "#buy-options"}
          onClick={toCart ? () => trackAddToCart(state.pdp, state.bundle.id, state.total) : undefined}
          className="shrink-0 rounded-btn bg-brand px-5 py-3 font-bold text-brand-ink"
        >
          {toCart ? "Add to cart" : "Choose kits"}
        </a>
      </div>
    </div>
  );
}
