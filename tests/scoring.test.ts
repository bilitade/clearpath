import { describe, expect, it } from "vitest";
import { getGad7Band, getPhq9Band, scoreIntake } from "@/lib/scoring";
import type { IntakeAnswer } from "@/lib/types";

function buildAnswers(
  phq9: Array<0 | 1 | 2 | 3>,
  gad7: Array<0 | 1 | 2 | 3>,
): IntakeAnswer[] {
  const phq9Answers: IntakeAnswer[] = phq9.map((value, index) => ({
    instrument: "PHQ9",
    index,
    value,
    confirmed: true,
  }));
  const gad7Answers: IntakeAnswer[] = gad7.map((value, index) => ({
    instrument: "GAD7",
    index,
    value,
    confirmed: true,
  }));
  return [...phq9Answers, ...gad7Answers];
}

describe("PHQ-9 bands", () => {
  const cases: Array<[number, ReturnType<typeof getPhq9Band>]> = [
    [0, "minimal"],
    [4, "minimal"],
    [5, "mild"],
    [9, "mild"],
    [10, "moderate"],
    [14, "moderate"],
    [15, "moderately_severe"],
    [19, "moderately_severe"],
    [20, "severe"],
    [27, "severe"],
  ];

  it.each(cases)("total %i → %s", (total, band) => {
    expect(getPhq9Band(total)).toBe(band);
  });
});

describe("GAD-7 bands", () => {
  const cases: Array<[number, ReturnType<typeof getGad7Band>]> = [
    [0, "minimal"],
    [4, "minimal"],
    [5, "mild"],
    [9, "mild"],
    [10, "moderate"],
    [14, "moderate"],
    [15, "severe"],
    [21, "severe"],
  ];

  it.each(cases)("total %i → %s", (total, band) => {
    expect(getGad7Band(total)).toBe(band);
  });
});

describe("scoreIntake", () => {
  it("flags crisis when PHQ-9 item 9 >= 1", () => {
    const phq9 = [0, 0, 0, 0, 0, 0, 0, 0, 1] as Array<0 | 1 | 2 | 3>;
    const gad7 = [0, 0, 0, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const result = scoreIntake(buildAnswers(phq9, gad7));
    expect(result.isCrisis).toBe(true);
    expect(result.careLevel).toBe("crisis");
    expect(result.phq9Item9).toBe(1);
  });

  it("marks urgent for severe scores without suicidality", () => {
    const phq9 = [3, 3, 3, 3, 3, 3, 3, 3, 0] as Array<0 | 1 | 2 | 3>;
    const gad7 = [0, 0, 0, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const result = scoreIntake(buildAnswers(phq9, gad7));
    expect(result.isCrisis).toBe(false);
    expect(result.isUrgent).toBe(true);
    expect(result.careLevel).toBe("urgent");
  });

  it("maps mild symptoms to coaching", () => {
    const phq9 = [1, 1, 1, 1, 1, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const gad7 = [1, 1, 1, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const result = scoreIntake(buildAnswers(phq9, gad7));
    expect(result.careLevel).toBe("coaching");
  });

  it("maps minimal symptoms to self_guided", () => {
    const phq9 = [0, 0, 0, 0, 0, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const gad7 = [0, 0, 0, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const result = scoreIntake(buildAnswers(phq9, gad7));
    expect(result.careLevel).toBe("self_guided");
  });

  it("classifier flag triggers crisis", () => {
    const phq9 = [0, 0, 0, 0, 0, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const gad7 = [0, 0, 0, 0, 0, 0, 0] as Array<0 | 1 | 2 | 3>;
    const result = scoreIntake(buildAnswers(phq9, gad7), true);
    expect(result.isCrisis).toBe(true);
    expect(result.careLevel).toBe("crisis");
  });
});
