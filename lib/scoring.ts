import type {
  Gad7Band,
  IntakeAnswer,
  Phq9Band,
  ScoreResult,
  CareLevel,
} from "./types";

export function getPhq9Band(total: number): Phq9Band {
  if (total <= 4) return "minimal";
  if (total <= 9) return "mild";
  if (total <= 14) return "moderate";
  if (total <= 19) return "moderately_severe";
  return "severe";
}

export function getGad7Band(total: number): Gad7Band {
  if (total <= 4) return "minimal";
  if (total <= 9) return "mild";
  if (total <= 14) return "moderate";
  return "severe";
}

function sumInstrument(answers: IntakeAnswer[], instrument: "PHQ9" | "GAD7"): number {
  return answers
    .filter((a) => a.instrument === instrument && a.confirmed)
    .reduce((sum, a) => sum + a.value, 0);
}

function getPhq9Item9(answers: IntakeAnswer[]): 0 | 1 | 2 | 3 {
  const item9 = answers.find((a) => a.instrument === "PHQ9" && a.index === 8);
  return (item9?.value ?? 0) as 0 | 1 | 2 | 3;
}

export function deriveCareLevel(
  phq9Band: Phq9Band,
  gad7Band: Gad7Band,
  isCrisis: boolean,
  isUrgent: boolean,
): CareLevel {
  if (isCrisis) return "crisis";
  if (isUrgent) return "urgent";

  const severityRank: Record<Phq9Band | Gad7Band, number> = {
    minimal: 0,
    mild: 1,
    moderate: 2,
    moderately_severe: 3,
    severe: 4,
  };

  const maxRank = Math.max(severityRank[phq9Band], severityRank[gad7Band]);

  if (maxRank >= 4) return "psychiatry";
  if (maxRank >= 2) return "therapy";
  if (maxRank >= 1) return "coaching";
  return "self_guided";
}

export function scoreIntake(
  answers: IntakeAnswer[],
  classifierCrisisFlag = false,
): ScoreResult {
  const phq9Total = sumInstrument(answers, "PHQ9");
  const gad7Total = sumInstrument(answers, "GAD7");
  const phq9Item9 = getPhq9Item9(answers);
  const phq9Band = getPhq9Band(phq9Total);
  const gad7Band = getGad7Band(gad7Total);

  const isCrisis = phq9Item9 >= 1 || classifierCrisisFlag;
  const isUrgent =
    !isCrisis && (gad7Total >= 15 || phq9Total >= 20);

  const careLevel = deriveCareLevel(phq9Band, gad7Band, isCrisis, isUrgent);

  return {
    phq9Total,
    phq9Band,
    phq9Item9,
    gad7Total,
    gad7Band,
    careLevel,
    isCrisis,
    isUrgent,
  };
}

export const CARE_LEVEL_LABELS: Record<CareLevel, string> = {
  self_guided: "Self-guided resources",
  coaching: "Coaching or brief support",
  therapy: "Outpatient therapy",
  psychiatry: "Psychiatry or specialized care",
  urgent: "Urgent care — expedited support",
  crisis: "Crisis support",
};
