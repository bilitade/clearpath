import type { IntakeItem, Instrument } from "./types";

export const SCALE_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: "Not at all",
  1: "Several days",
  2: "More than half the days",
  3: "Nearly every day",
};

const SCALE_SUFFIX =
  "Please answer using: Not at all (0), Several days (1), More than half the days (2), or Nearly every day (3).";

const PHQ9_ITEMS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself",
];

const GAD7_ITEMS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritated",
  "Feeling afraid, as if something awful might happen",
];

function buildItems(
  instrument: Instrument,
  items: string[],
  preamble: string,
): IntakeItem[] {
  return items.map((problem, index) => ({
    instrument,
    index,
    text: `${preamble} ${problem}. ${SCALE_SUFFIX}`,
  }));
}

const PHQ9_PREAMBLE =
  "Over the last 2 weeks, how often have you been bothered by the following problem:";

const GAD7_PREAMBLE =
  "Over the last 2 weeks, how often have you been bothered by the following problem:";

export const PHQ9_INTAKE_ITEMS = buildItems("PHQ9", PHQ9_ITEMS, PHQ9_PREAMBLE);
export const GAD7_INTAKE_ITEMS = buildItems("GAD7", GAD7_ITEMS, GAD7_PREAMBLE);

export const INTAKE_ORDER: IntakeItem[] = [
  ...PHQ9_INTAKE_ITEMS,
  ...GAD7_INTAKE_ITEMS,
];

export const TOTAL_INTAKE_ITEMS = INTAKE_ORDER.length;

export function getIntakeItem(index: number): IntakeItem | undefined {
  return INTAKE_ORDER[index];
}

/** Short label shown in the UI — buttons carry the scale, no repeated preamble. */
export function getQuestionDisplayText(index: number): string {
  if (index < 0 || index >= TOTAL_INTAKE_ITEMS) return "";
  if (index < PHQ9_ITEMS.length) return PHQ9_ITEMS[index]!;
  return GAD7_ITEMS[index - PHQ9_ITEMS.length]!;
}

export function getQuestionSection(index: number): "mood" | "anxiety" {
  const item = getIntakeItem(index);
  return item?.instrument === "GAD7" ? "anxiety" : "mood";
}

export const SECTION_LABELS = {
  mood: "Wellbeing (PHQ-9)",
  anxiety: "Anxiety (GAD-7)",
} as const;
