import { describe, expect, it } from "vitest";
import {
  getIntakeBatchState,
  startIntake,
  submitBatchAnswers,
} from "@/lib/intake/intake-flow";

const context = {
  zip: "02139",
  insurance: "aetna",
  concern: "anxiety" as const,
  formatPreference: "either" as const,
};

describe("intake-flow", () => {
  it("starts at batch 0 with PHQ-9 items", () => {
    const step = startIntake("test-session-1", context);
    expect(step.progress.current).toBe(0);
    expect(step.items).toHaveLength(3);
    expect(step.items[0]?.text).toContain("Little interest");
    expect(step.showChapterIntro).toBe(true);
  });

  it("advances on batch submit", () => {
    const sessionId = "test-session-2";
    startIntake(sessionId, context);
    const next = submitBatchAnswers(sessionId, context, [
      { globalIndex: 0, value: 1 },
      { globalIndex: 1, value: 1 },
      { globalIndex: 2, value: 0 },
    ]);
    expect(next.progress.current).toBe(3);
    expect(next.batchIndex).toBe(1);
    expect(next.done).toBe(false);
  });

  it("flags crisis on PHQ-9 item 9 batch", () => {
    const sessionId = "test-session-crisis";
    startIntake(sessionId, context);
    submitBatchAnswers(sessionId, context, [
      { globalIndex: 0, value: 0 },
      { globalIndex: 1, value: 0 },
      { globalIndex: 2, value: 0 },
    ]);
    submitBatchAnswers(sessionId, context, [
      { globalIndex: 3, value: 0 },
      { globalIndex: 4, value: 0 },
      { globalIndex: 5, value: 0 },
    ]);
    submitBatchAnswers(sessionId, context, [
      { globalIndex: 6, value: 0 },
      { globalIndex: 7, value: 0 },
    ]);
    const crisis = submitBatchAnswers(sessionId, context, [
      { globalIndex: 8, value: 2 },
    ]);
    expect(crisis.crisis.crisis).toBe(true);
  });

  it("resumes at correct batch", () => {
    const sessionId = "test-session-resume";
    startIntake(sessionId, context);
    submitBatchAnswers(sessionId, context, [
      { globalIndex: 0, value: 1 },
      { globalIndex: 1, value: 0 },
      { globalIndex: 2, value: 0 },
    ]);
    const resumed = getIntakeBatchState(sessionId, context);
    expect(resumed.batchIndex).toBe(1);
    expect(resumed.progress.current).toBe(3);
  });
});
