import { TOTAL_INTAKE_ITEMS } from "@/lib/intake/instruments";
import {
  buildIntakeAnswers,
  sortGlobalAnswers,
} from "@/lib/intake/intake-answers";
import { CARE_LEVEL_LABELS } from "@/lib/screening/scoring";
import { buildDeterministicSummary } from "@/lib/screening/screening-summary";
import { getLocalConfirmedAnswers } from "@/lib/storage/client-storage";
import type {
  IntakeAnswer,
  MatchResult,
  OnboardingContext,
  ScoreResult,
} from "@/lib/types";

export type FinalizeStep =
  | "personalize"
  | "score"
  | "match"
  | "summary"
  | "complete";

export type ProcessingPreview = {
  phq9Total?: number;
  gad7Total?: number;
  careLevelLabel?: string;
  matchCount?: number;
  hasPersonalStory?: boolean;
};

export type FinalizeResult = {
  kind: "success";
  score: ScoreResult;
  match: MatchResult;
  summary: string;
};

const STEP_MIN_MS = 750;
const UX_PERSONALIZE_MS = 900;
const UX_COMPLETE_MS = 800;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withMinDuration<T>(fn: () => Promise<T>, minMs = STEP_MIN_MS) {
  const start = Date.now();
  const result = await fn();
  const remaining = minMs - (Date.now() - start);
  if (remaining > 0) await sleep(remaining);
  return result;
}

function mergePreview(
  base: ProcessingPreview,
  patch: Partial<ProcessingPreview>,
): ProcessingPreview {
  return { ...base, ...patch };
}

export async function finalizeIntakeClient(
  sessionId: string,
  context: OnboardingContext,
  onStep: (step: FinalizeStep, preview?: ProcessingPreview) => void,
): Promise<FinalizeResult> {
  const hasPersonalStory = Boolean(context.optionalContext?.trim());
  let preview: ProcessingPreview = { hasPersonalStory };

  if (hasPersonalStory) {
    onStep("personalize", preview);
    await sleep(UX_PERSONALIZE_MS);
  }

  onStep("score", preview);

  const { score } = await withMinDuration(async () => {
    let loadedAnswers: IntakeAnswer[] | null = null;
    let classifierCrisisFlag: boolean | undefined;

    const sessionRes = await fetch("/api/intake/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    if (sessionRes.ok) {
      const data = (await sessionRes.json()) as {
        answers: IntakeAnswer[];
        classifierCrisisFlag?: boolean;
      };
      if (data.answers.length === TOTAL_INTAKE_ITEMS) {
        loadedAnswers = data.answers;
        classifierCrisisFlag = data.classifierCrisisFlag;
      }
    }

    if (!loadedAnswers) {
      const fallbackAnswers = getLocalConfirmedAnswers(sessionId);
      if (fallbackAnswers.length === TOTAL_INTAKE_ITEMS) {
        loadedAnswers = buildIntakeAnswers(sortGlobalAnswers(fallbackAnswers));
      } else {
        throw new Error(
          "Could not restore your screening answers. Please continue from intake.",
        );
      }
    }

    const scoreRes = await fetch("/api/intake/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        answers: loadedAnswers,
        classifierCrisisFlag,
      }),
    });
    if (!scoreRes.ok) throw new Error("Scoring failed");

    return { score: (await scoreRes.json()) as ScoreResult };
  });

  preview = mergePreview(preview, {
    phq9Total: score.phq9Total,
    gad7Total: score.gad7Total,
    careLevelLabel: CARE_LEVEL_LABELS[score.careLevel],
  });
  onStep("score", preview);
  onStep("match", preview);

  const match = await withMinDuration(async () => {
    const matchRes = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, context }),
    });
    if (!matchRes.ok) throw new Error("Matching failed");
    return (await matchRes.json()) as MatchResult;
  });

  preview = mergePreview(preview, {
    matchCount: match.matches?.length ?? match.providers.length,
  });
  onStep("match", preview);
  onStep("summary", preview);

  const summary = await withMinDuration(async () => {
    const summaryRes = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, match, context }),
    });
    if (summaryRes.ok) {
      const data = (await summaryRes.json()) as { summary: string };
      return data.summary;
    }
    return buildDeterministicSummary(score);
  }, 900);

  onStep("complete", preview);
  await sleep(UX_COMPLETE_MS);

  return { kind: "success", score, match, summary };
}
