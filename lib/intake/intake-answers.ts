import { getIntakeItem, TOTAL_INTAKE_ITEMS } from "./instruments";
import type { IntakeAnswer } from "@/lib/types";

export type GlobalAnswerInput = {
  globalIndex: number;
  value: 0 | 1 | 2 | 3;
};

export function buildIntakeAnswers(
  inputs: GlobalAnswerInput[],
  rawPrefix?: string,
): IntakeAnswer[] {
  return inputs.map(({ globalIndex, value }) => {
    const item = getIntakeItem(globalIndex);
    if (!item) {
      throw new Error("Invalid item index");
    }
    return {
      instrument: item.instrument,
      index: item.index,
      value,
      confirmed: true,
      rawText: rawPrefix ? `${rawPrefix}:${value}` : String(value),
    };
  });
}

export function sortGlobalAnswers(
  answers: GlobalAnswerInput[],
): GlobalAnswerInput[] {
  return [...answers].sort((a, b) => a.globalIndex - b.globalIndex);
}

export function assertFullReviewAnswers(sorted: GlobalAnswerInput[]): void {
  if (sorted.length !== TOTAL_INTAKE_ITEMS) {
    throw new Error("Review requires all screening answers");
  }
  for (let i = 0; i < TOTAL_INTAKE_ITEMS; i++) {
    if (sorted[i]?.globalIndex !== i) {
      throw new Error("Invalid review answers");
    }
  }
}
