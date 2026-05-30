import providersData from "@/data/providers.json";
import type {
  Concern,
  MatchResult,
  OnboardingContext,
  Provider,
  ScoreResult,
} from "./types";
import { getZipCluster } from "./utils";

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

export function matchProviders(
  score: ScoreResult,
  context: OnboardingContext,
): MatchResult {
  const zipCluster = getZipCluster(context.zip);

  let candidates = providers.filter(
    (p) =>
      p.acceptingNew &&
      insuranceMatch(p, context.insurance) &&
      specialtyScore(p, context.concern) > 0,
  );

  if (candidates.length === 0) {
    candidates = providers.filter(
      (p) => p.acceptingNew && insuranceMatch(p, context.insurance),
    );
  }

  if (candidates.length === 0) {
    return {
      providers: [],
      rationale:
        "We couldn't find in-network providers matching your criteria in our directory.",
      fallback: "community_resources",
    };
  }

  const ranked = [...candidates].sort((a, b) => {
    const scoreA =
      specialtyScore(a, context.concern) * 10 +
      (a.zipCluster === zipCluster ? 5 : 0) +
      severityBoost(score) * (a.specialties.includes("depression") ? 1 : 0) -
      a.estWaitDays * 0.1;
    const scoreB =
      specialtyScore(b, context.concern) * 10 +
      (b.zipCluster === zipCluster ? 5 : 0) +
      severityBoost(score) * (b.specialties.includes("depression") ? 1 : 0) -
      b.estWaitDays * 0.1;
    return scoreB - scoreA;
  });

  const top = ranked.slice(0, 3);

  return {
    providers: top,
    rationale: `Ranked by specialty fit for ${context.concern}, insurance match, location proximity, and estimated wait time.`,
  };
}

export function getAllProviders(): Provider[] {
  return providers;
}
