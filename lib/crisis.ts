import type { CrisisCheck, IntakeAnswer } from "./types";

const CRISIS_PHRASES = [
  "kill myself",
  "end my life",
  "want to die",
  "suicide",
  "hurt myself",
  "self harm",
  "self-harm",
  "better off dead",
  "no reason to live",
  "can't go on",
  "cannot go on",
];

export function checkItem9Crisis(answers: IntakeAnswer[]): CrisisCheck {
  const item9 = answers.find((a) => a.instrument === "PHQ9" && a.index === 8);
  if (item9 && item9.value >= 1) {
    return { crisis: true, confidence: 1, source: "item9" };
  }
  return { crisis: false, confidence: 0, source: "none" };
}

export function checkKeywordCrisis(message: string): CrisisCheck {
  const normalized = message.toLowerCase();
  const matched = CRISIS_PHRASES.some((phrase) => normalized.includes(phrase));
  if (matched) {
    return { crisis: true, confidence: 0.85, source: "classifier" };
  }
  return { crisis: false, confidence: 0, source: "none" };
}

export async function classifyCrisisMessage(
  message: string,
  classifyFn?: (msg: string) => Promise<{ crisis: boolean; confidence: number }>,
): Promise<CrisisCheck> {
  const keyword = checkKeywordCrisis(message);
  if (keyword.crisis) return keyword;

  if (!classifyFn) {
    return { crisis: false, confidence: 0, source: "none" };
  }

  try {
    const result = await classifyFn(message);
    if (result.crisis && result.confidence >= 0.5) {
      return {
        crisis: true,
        confidence: result.confidence,
        source: "classifier",
      };
    }
  } catch {
    // Conservative: keyword layer already ran; fail open to non-crisis for API errors
  }

  return { crisis: false, confidence: 0, source: "none" };
}

export function mergeCrisisChecks(...checks: CrisisCheck[]): CrisisCheck {
  const crisis = checks.find((c) => c.crisis);
  return crisis ?? { crisis: false, confidence: 0, source: "none" };
}
