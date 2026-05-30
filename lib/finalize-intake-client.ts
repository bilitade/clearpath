import type {
  IntakeAnswer,
  MatchResult,
  OnboardingContext,
  ScoreResult,
} from "@/lib/types";

export type FinalizeStep = "score" | "match" | "summary" | "complete";

export type FinalizeResult =
  | { kind: "success"; score: ScoreResult; match: MatchResult; summary: string }
  | { kind: "crisis" };

const STEP_MIN_MS = 750;

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

export async function finalizeIntakeClient(
  sessionId: string,
  context: OnboardingContext,
  onStep: (step: FinalizeStep) => void,
): Promise<FinalizeResult> {
  onStep("score");

  const { score } = await withMinDuration(async () => {
    const sessionRes = await fetch("/api/intake/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    if (!sessionRes.ok) throw new Error("Could not retrieve session answers");

    const { answers: loadedAnswers } = (await sessionRes.json()) as {
      answers: IntakeAnswer[];
    };
    if (loadedAnswers.length !== 16) throw new Error("Intake incomplete");

    const scoreRes = await fetch("/api/intake/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answers: loadedAnswers }),
    });
    if (!scoreRes.ok) throw new Error("Scoring failed");

    return {
      answers: loadedAnswers,
      score: (await scoreRes.json()) as ScoreResult,
    };
  });

  if (score.isCrisis) {
    return { kind: "crisis" };
  }

  onStep("match");

  const match = await withMinDuration(async () => {
    const matchRes = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, context }),
    });
    if (!matchRes.ok) throw new Error("Matching failed");
    return (await matchRes.json()) as MatchResult;
  });

  onStep("summary");

  const summary = await withMinDuration(async () => {
    const summaryRes = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, match }),
    });
    if (summaryRes.ok) {
      const data = (await summaryRes.json()) as { summary: string };
      return data.summary;
    }
    return "Based on your responses, consider discussing these results with a licensed professional. This is a screening, not a diagnosis.";
  }, 900);

  onStep("complete");
  await sleep(500);

  return { kind: "success", score, match, summary };
}
