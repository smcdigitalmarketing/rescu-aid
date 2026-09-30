/**
 * Regulatory and statistical claims.
 *
 * All supplied claims are enabled below using the wording provided by the
 * client. Sources should be added when the supporting documentation is
 * available.
 *
 * Live pages (/v1–/v3) show a claim only once it has a source (claim()).
 * The internal demo pages (/demo/v1–/demo/v3) show every enabled claim that
 * has wording, under a "pending verification" banner (useClaim()).
 *
 * Context (2026-09-30): FDA says it has authorized one anti-choking device
 * (LifeVac, De Novo, March 2026) and that registration/listing
 * "does not denote approval, clearance or authorization".
 */

export type Claim = {
  enabled: boolean;
  text: string;
  source: string | null;
  note: string;
};

export const claims = {
  fda: {
    enabled: true,
    text: "FDA registered",
    source: null,
    note: "Wording from the client's own image badges ('FDA registered'). Their body copy says 'FDA-approved', which FDA's March 2026 update rules out. A registration/listing number supports 'FDA-registered facility' at most; 'approved/cleared/authorized' needs a PMA, 510(k) or De Novo number.",
  },

  madeInUsa: {
    enabled: true,
    text: "Made in USA",
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
    source: null,
    note: "Needs order data. 'Lives saved' needs incident-level evidence.",
  },

  speed: {
    enabled: true,
    text: "Works in 15 seconds",
    source: null,
    note: "Needs test data.",
  },

  clinical: {
    enabled: true,
    text: "97% effectiveness in clinical trials",
    source: null,
    note: "Live gallery says '…surpassing the Heimlich'; that comparison is left out because it contradicts the back-blows-first guidance on every page. Needs a published study on this device.",
  },

  doctorRecommended: {
    enabled: true,
    text: "Doctor recommended",
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

/**
 * Returns the claim text only when it is enabled and has both a source
 * and non-empty text.
 */
export function claim(key: ClaimKey): string | null {
  const c: Claim = claims[key];

  return c.enabled && c.source && c.text ? c.text : null;
}
