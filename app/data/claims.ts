/**
 * Regulatory and statistical claims, using the wording supplied by the client.
 *
 * This build is a demo proposal, so SHOW_UNSOURCED_CLAIMS shows every enabled
 * claim even without a source. Set it to false before any live traffic; each
 * claim then needs a `source` to appear.
 *
 * Context (2026-09-30): FDA says it has authorized one anti-choking device
 * (LifeVac, De Novo, March 2026) and that registration/listing
 * "does not denote approval, clearance or authorization".
 */

export const SHOW_UNSOURCED_CLAIMS = true;

export type Claim = {
  enabled: boolean;
  text: string;
  /** Short label for the trust-badge grid; falls back to `text`. */
  badge?: string;
  source: string | null;
  note: string;
};

export const claims = {
  fda: {
    enabled: true,
    text: "FDA registered",
    badge: "FDA Registered",
    source: null,
    note: "Wording from the client's own image badges ('FDA registered'). Their body copy says 'FDA-approved', which FDA's March 2026 update rules out. A registration/listing number supports 'FDA-registered facility' at most; 'approved/cleared/authorized' needs a PMA, 510(k) or De Novo number.",
  },

  madeInUsa: {
    enabled: true,
    text: "Made in USA",
    badge: "Made in USA",
    source: null,
    note: "FTC Made in USA rule: all or virtually all of the product must be made in the US.",
  },

  aggregateRating: {
    enabled: true,
    text: "Rated 4.7/5 by 10,000+ families",
    source: null,
    note: "Needs a reviews-app export backing the average and count.",
  },

  livesProtected: {
    enabled: true,
    text: "10,000+ families protected",
    badge: "10,000+ Families Protected",
    source: null,
    note: "Needs order data. 'Lives saved' needs incident-level evidence.",
  },

  speed: {
    enabled: true,
    text: "Works in 15 seconds",
    badge: "Works in 15 Seconds",
    source: null,
    note: "Needs test data.",
  },

  clinical: {
    enabled: true,
    text: "97% effectiveness in clinical trials",
    badge: "97% Effective in Clinical Trials",
    source: null,
    note: "Live gallery says '…surpassing the Heimlich'; that comparison is left out because it contradicts the back-blows-first guidance on every page. Needs a published study on this device.",
  },

  doctorRecommended: {
    enabled: true,
    text: "Doctor recommended",
    badge: "Doctor Recommended",
    source: null,
    note: "Needs named, qualified endorsers (FTC Endorsement Guides).",
  },

  asSeenOn: {
    enabled: true,
    text: "As seen on CBS · FOX · NBC",
    source: null,
    note: "Live page shows CBS / Fox / NBC logos. Needs the actual coverage links.",
  },
} satisfies Record<string, Claim>;

export type ClaimKey = keyof typeof claims;

/** The claim's wording if it is enabled and either sourced or demo mode is on. */
export function claim(key: ClaimKey): string | null {
  const c: Claim = claims[key];
  return c.enabled && c.text && (c.source || SHOW_UNSOURCED_CLAIMS) ? c.text : null;
}

export function claimBadge(key: ClaimKey): string | null {
  const c: Claim = claims[key];
  return claim(key) ? (c.badge ?? c.text) : null;
}
