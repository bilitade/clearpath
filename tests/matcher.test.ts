import { describe, expect, it } from "vitest";
import { matchProviders } from "@/lib/matching/matcher";
import type { OnboardingContext, ScoreResult } from "@/lib/types";

const baseScore: ScoreResult = {
  phq9Total: 8,
  phq9Band: "mild",
  phq9Item9: 0,
  gad7Total: 7,
  gad7Band: "mild",
  careLevel: "coaching",
  isCrisis: false,
  isUrgent: false,
};

const context: OnboardingContext = {
  zip: "02139",
  insurance: "aetna",
  concern: "anxiety",
  formatPreference: "either",
};

describe("matchProviders", () => {
  it("returns up to 3 providers with match details", () => {
    const result = matchProviders(baseScore, context);
    expect(result.providers.length).toBeLessThanOrEqual(3);
    expect(result.providers.length).toBeGreaterThan(0);
    expect(result.matches.length).toBe(result.providers.length);
    expect(result.matches[0]?.fitScore).toBeGreaterThan(0);
    expect(result.matches[0]?.matchReasons.length).toBeGreaterThan(0);
  });

  it("matches insurance and concern", () => {
    const result = matchProviders(baseScore, context);
    for (const provider of result.providers) {
      expect(provider.insurances).toContain("aetna");
      expect(provider.acceptingNew).toBe(true);
    }
  });

  it("returns fallback when no insurance match", () => {
    const result = matchProviders(baseScore, {
      ...context,
      insurance: "nonexistent_carrier",
    });
    expect(result.fallback).toBe("community_resources");
    expect(result.providers).toHaveLength(0);
  });

  it("prefers same zip cluster", () => {
    const result = matchProviders(baseScore, context);
    const hasLocal = result.providers.some((p) => p.zipCluster === "021");
    expect(hasLocal).toBe(true);
  });
});
