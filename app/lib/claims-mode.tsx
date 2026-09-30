import { createContext, useContext, type ReactNode } from "react";
import { claim, claims, type ClaimKey } from "~/data/claims";

type Mode = "live" | "demo";

const ClaimsMode = createContext<Mode>("live");

/** Wraps a PDP for the internal demo routes, where unverified claims are shown. */
export function DemoClaims({ children }: { children: ReactNode }) {
  return <ClaimsMode.Provider value="demo">{children}</ClaimsMode.Provider>;
}

export function useClaimsMode() {
  return useContext(ClaimsMode);
}

/**
 * Live: only substantiated claims (enabled + source + wording).
 * Demo: every enabled claim that has wording, source or not.
 */
export function resolveClaim(mode: Mode, key: ClaimKey): string | null {
  if (mode === "live") return claim(key);
  const c = claims[key];
  return c.enabled && c.text ? c.text : null;
}

export function useClaim(key: ClaimKey): string | null {
  return resolveClaim(useContext(ClaimsMode), key);
}
