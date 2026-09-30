/**
 * Regulatory and statistical claims that need substantiation before they can
 * appear on a page. Every claim is off until the client supplies proof; when
 * it arrives, set `enabled`, record the `source`, and use only the wording the
 * document supports.
 *
 * Context (2026-09-30): FDA says it has authorized one anti-choking device
 * (LifeVac, De Novo, March 2026) and that registration/listing "does not
 * denote approval, clearance or authorization".
 */

export type Claim = {
  enabled: boolean;
  text: string;
  source: string | null;
  note: string;
};

export const claims = {
  fda: {
    enabled: false,
    text: "",
    source: null,
    note: "Awaiting documents. A registration/listing number supports 'FDA-registered facility' at most; 'FDA-approved/cleared/authorized' needs a PMA, 510(k) or De Novo number.",
  },
  madeInUsa: {
    enabled: false,
    text: "Made in USA",
    source: null,
    note: "FTC Made in USA rule: all or virtually all of the product must be made in the US.",
  },
  aggregateRating: {
    enabled: false,
    text: "Rated 4.7/5 by 10,000+ families",
    source: null,
    note: "Needs a reviews-app export backing the average and count.",
  },
  livesProtected: {
    enabled: false,
    text: "10,000+ families protected",
    source: null,
    note: "Needs order data. 'Lives saved' needs incident-level evidence.",
  },
  speed: {
    enabled: false,
    text: "Works in 15 seconds",
    source: null,
    note: "Needs test data.",
  },
  clinical: {
    enabled: false,
    text: "",
    source: null,
    note: "Live gallery shows '97% effectiveness in clinical trials, surpassing the Heimlich'. Needs a published study on this device.",
  },
  doctorRecommended: {
    enabled: false,
    text: "Doctor recommended",
    source: null,
    note: "Needs named, qualified endorsers (FTC Endorsement Guides).",
  },
  asSeenOn: {
    enabled: false,
    text: "",
    source: null,
    note: "Live page shows CBS / Fox / NBC logos. Needs the actual coverage links.",
  },
} satisfies Record<string, Claim>;

export type ClaimKey = keyof typeof claims;

/** Returns the claim text only when it is enabled and substantiated. */
export function claim(key: ClaimKey): string | null {
  const c: Claim = claims[key];
  return c.enabled && c.source && c.text ? c.text : null;
}
