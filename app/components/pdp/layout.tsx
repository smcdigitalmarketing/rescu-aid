import type { ReactNode } from "react";
import { STORE_URL, product, usageNotice } from "~/data/product";
import { Logo } from "./brand";

type Theme = "v1" | "v2" | "v3";

export function PageShell({
  theme,
  announcement,
  nav = true,
  children,
}: {
  theme: Theme;
  announcement: ReactNode;
  nav?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      data-theme={theme}
      className="min-h-dvh bg-bg font-sans text-ink antialiased"
    >
      <a
        href="#buy"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to purchase options
      </a>
      <div className="bg-accent px-4 py-2 text-center text-[13px] font-semibold tracking-wide text-accent-ink">
        {announcement}
      </div>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href={STORE_URL} className="text-2xl">
            <Logo />
          </a>
          {nav && (
            <nav
              aria-label="Page sections"
              className="hidden gap-7 text-sm font-medium text-muted md:flex"
            >
              <a href="#how" className="hover:text-ink">
                How it works
              </a>
              <a href="#reviews" className="hover:text-ink">
                Reviews
              </a>
              <a href="#faq" className="hover:text-ink">
                FAQ
              </a>
            </nav>
          )}
          <a
            href="#buy"
            className="rounded-btn bg-brand px-4 py-2 text-sm font-bold text-brand-ink transition hover:bg-brand-strong"
          >
            Shop now
          </a>
        </div>
      </header>
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
    </div>
  );
}

export function Section({
  id,
  tone = "default",
  eyebrow,
  title,
  intro,
  center = false,
  className = "",
  children,
}: {
  id?: string;
  tone?: "default" | "alt" | "accent";
  eyebrow?: ReactNode;
  title?: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const toneClass =
    tone === "alt"
      ? "bg-surface-2"
      : tone === "accent"
        ? "bg-accent text-accent-ink"
        : "";
  return (
    <section
      id={id}
      className={`scroll-mt-4 px-4 py-14 sm:py-20 ${toneClass} ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || intro) && (
          <header
            className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}
          >
            {eyebrow && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <p
                className={`mt-4 text-lg text-pretty ${tone === "accent" ? "opacity-85" : "text-muted"}`}
              >
                {intro}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

function Footer() {
  const policies = [
    ["Shipping policy", "shipping-policy"],
    ["Refund policy", "refund-policy"],
    ["Privacy policy", "privacy-policy"],
    ["Terms of service", "terms-of-service"],
  ];
  return (
    <footer className="border-t border-line bg-surface px-4 py-12 text-sm text-muted">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="text-xl" />
          <p className="mt-3 max-w-sm">{usageNotice.body[1]}</p>
        </div>
        <div>
          <p className="font-semibold text-ink">Questions?</p>
          <p className="mt-2">
            <a
              href={`mailto:${product.support.email}`}
              className="underline underline-offset-2"
            >
              {product.support.email}
            </a>
          </p>
          <p>{product.support.phone}</p>
          <p>{product.support.hours}</p>
        </div>
        <ul className="space-y-1.5">
          {policies.map(([label, slug]) => (
            <li key={slug}>
              <a
                href={`${STORE_URL}/policies/${slug}`}
                className="hover:text-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs">
        © {new Date().getFullYear()} RescUAid. All rights reserved.
      </p>
    </footer>
  );
}
