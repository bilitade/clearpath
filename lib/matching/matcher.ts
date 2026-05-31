import type {
  Concern,
  FormatPreference,
  MatchResult,
  OnboardingContext,
  Provider,
  ProviderMatchEntry,
  ScoreResult,
} from "@/lib/types";
import providersData from "@/data/providers.json";
import { getZipCluster } from "@/lib/utils";
import { CONCERN_OPTIONS, INSURANCE_OPTIONS } from "@/lib/types";

const providers = providersData as Provider[];

function concernToSpecialty(concern: Concern): string {
  return concern === "unsure" ? "unsure" : concern;
}

function specialtyScore(provider: Provider, concern: Concern): number {
  const target = concernToSpecialty(concern);
  if (provider.specialties.includes(target)) return 3;
  if (concern === "unsure" && provider.specialties.includes("unsure")) return 2;
  if (
    (concern === "stress" && provider.specialties.includes("anxiety")) ||
    (concern === "depression" && provider.specialties.includes("anxiety"))
  ) {
    return 1;
  }
  return 0;
}

function severityBoost(score: ScoreResult): number {
  if (score.careLevel === "psychiatry" || score.careLevel === "urgent") return 2;
  if (score.careLevel === "therapy") return 1;
  return 0;
}

function insuranceMatch(provider: Provider, insurance: string): boolean {
  return (
    provider.insurances.includes(insurance) ||
    (insurance === "self_pay" && provider.insurances.includes("self_pay"))
  );
}

function formatMatch(
  provider: Provider,
  preference: FormatPreference,
): boolean {
  if (preference === "either") return true;
  return provider.format.includes(preference);
}

function labelForInsurance(id: string): string {
  return INSURANCE_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

function labelForConcern(id: Concern): string {
  return CONCERN_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

function buildMatchEntry(
  provider: Provider,
  score: ScoreResult,
  context: OnboardingContext,
  zipCluster: string,
  rawRankScore: number,
  maxRaw: number,
): ProviderMatchEntry {
  const reasons: string[] = [];
  const gaps: string[] = [];

  const spec = specialtyScore(provider, context.concern);
  if (spec >= 3) {
    reasons.push(`Specializes in ${labelForConcern(context.concern).toLowerCase()}`);
  } else if (spec >= 1) {
    reasons.push("Related specialty for your concern");
  }

  if (insuranceMatch(provider, context.insurance)) {
    reasons.push(`Accepts ${labelForInsurance(context.insurance)}`);
  }

  if (provider.zipCluster === zipCluster) {
    reasons.push("Near your area");
  }

  if (provider.format.includes("tele")) {
    reasons.push("Telehealth available");
  }
  if (provider.format.includes("in_person")) {
    reasons.push("In-person visits available");
  }

  if (provider.estWaitDays <= 5) {
    reasons.push(`Short wait (~${provider.estWaitDays} days)`);
  } else if (provider.estWaitDays > 10) {
    gaps.push(`Longer wait (~${provider.estWaitDays} days)`);
  }

  if (
    context.formatPreference === "tele" &&
    !provider.format.includes("tele")
  ) {
    gaps.push("In-person only — not your telehealth preference");
  }
  if (
    context.formatPreference === "in_person" &&
    !provider.format.includes("in_person")
  ) {
    gaps.push("Telehealth only — not your in-person preference");
  }

  if (
    (score.careLevel === "psychiatry" || score.careLevel === "urgent") &&
    provider.credentials?.includes("MD")
  ) {
    reasons.push("Psychiatry-level care available");
  }

  const fitScore = Math.min(
    99,
    Math.max(
      55,
      Math.round(55 + (rawRankScore / Math.max(maxRaw, 1)) * 44),
    ),
  );

  return {
    provider,
    fitScore,
    matchReasons: reasons.slice(0, 4),
    gaps: gaps.length > 0 ? gaps : undefined,
  };
}

function rankScore(
  provider: Provider,
  score: ScoreResult,
  context: OnboardingContext,
  zipCluster: string,
): number {
  let s =
    specialtyScore(provider, context.concern) * 10 +
    (provider.zipCluster === zipCluster ? 5 : 0) +
    severityBoost(score) * (provider.specialties.includes("depression") ? 1 : 0) -
    provider.estWaitDays * 0.1;

  if (formatMatch(provider, context.formatPreference)) s += 3;
  return s;
}

export function matchProviders(
  score: ScoreResult,
  context: OnboardingContext,
): MatchResult {
  const zipCluster = getZipCluster(context.zip);

  let candidates = providers.filter(
    (p) =>
      p.acceptingNew &&
      insuranceMatch(p, context.insurance) &&
      specialtyScore(p, context.concern) > 0 &&
      formatMatch(p, context.formatPreference),
  );

  if (candidates.length === 0) {
    candidates = providers.filter(
      (p) =>
        p.acceptingNew &&
        insuranceMatch(p, context.insurance) &&
        formatMatch(p, context.formatPreference),
    );
  }

  if (candidates.length === 0) {
    candidates = providers.filter(
      (p) => p.acceptingNew && insuranceMatch(p, context.insurance),
    );
  }

  if (candidates.length === 0) {
    return {
      providers: [],
      matches: [],
      rationale:
        "We couldn't find in-network providers matching your criteria in our directory.",
      fallback: "community_resources",
    };
  }

  const scored = candidates.map((p) => ({
    provider: p,
    raw: rankScore(p, score, context, zipCluster),
  }));

  scored.sort((a, b) => b.raw - a.raw);
  const maxRaw = scored[0]?.raw ?? 1;
  const top = scored.slice(0, 3);

  const matches = top.map(({ provider, raw }) =>
    buildMatchEntry(provider, score, context, zipCluster, raw, maxRaw),
  );

  return {
    providers: matches.map((m) => m.provider),
    matches,
    rationale: `Matched on ${labelForConcern(context.concern).toLowerCase()}, your insurance, care format, and estimated wait.`,
  };
}

export function getAllProviders(): Provider[] {
  return providers;
}
