import type { Gad7Band, Phq9Band, ScoreResult } from "@/lib/types";
import { CARE_LEVEL_LABELS } from "./scoring";

const PHQ9_BAND_TEXT: Record<Phq9Band, string> = {
  minimal:
    "minimal depression-related symptoms on this screening (scores 0–4 are minimal)",
  mild: "mild depression-related symptoms (scores 5–9 are mild)",
  moderate: "moderate depression-related symptoms (scores 10–14 are moderate)",
  moderately_severe:
    "moderately severe depression-related symptoms (scores 15–19)",
  severe: "severe depression-related symptoms (scores 20–27)",
};

const GAD7_BAND_TEXT: Record<Gad7Band, string> = {
  minimal:
    "minimal anxiety-related symptoms on this screening (scores 0–4 are minimal)",
  mild: "mild anxiety-related symptoms (scores 5–9 are mild)",
  moderate: "moderate anxiety-related symptoms (scores 10–14 are moderate)",
  severe: "severe anxiety-related symptoms (scores 15–21)",
};

export function getPhq9ScreeningLine(score: ScoreResult): string {
  return `PHQ-9 (wellbeing): You scored ${score.phq9Total} out of 27, indicating ${PHQ9_BAND_TEXT[score.phq9Band]}. This questionnaire asks about mood, energy, sleep, and related symptoms over the past 2 weeks.`;
}

export function getGad7ScreeningLine(score: ScoreResult): string {
  return `GAD-7 (anxiety): You scored ${score.gad7Total} out of 21, indicating ${GAD7_BAND_TEXT[score.gad7Band]}. This questionnaire asks about worry, tension, and restlessness over the past 2 weeks.`;
}

export function getScreeningResultsBullets(score: ScoreResult): string[] {
  return [
    getPhq9ScreeningLine(score),
    getGad7ScreeningLine(score),
    `Based on these validated screening scores, the suggested starting level of care is: ${CARE_LEVEL_LABELS[score.careLevel]}.`,
    "This is a screening result to guide next steps — not a diagnosis.",
  ];
}

export function buildDeterministicSummary(score: ScoreResult): string {
  return getScreeningResultsBullets(score).join(" ");
}

export function buildSummaryContext(score: ScoreResult): string {
  return [
    getPhq9ScreeningLine(score),
    getGad7ScreeningLine(score),
    `Recommended care level: ${CARE_LEVEL_LABELS[score.careLevel]}`,
    score.isUrgent ? "Urgent care flag: yes (high distress, no crisis indicators)." : "",
    score.phq9Item9 >= 1 ? "PHQ-9 item 9 (self-harm thoughts): elevated — crisis pathway." : "",
  ]
    .filter(Boolean)
    .join("\n");
}
