import { describe, expect, it } from "vitest";
import { startIntake, submitAnswer } from "@/lib/intake-flow";

const context = { zip: "02139", insurance: "aetna", concern: "anxiety" as const };

describe("intake-flow", () => {
  it("starts at question 0", () => {
    const step = startIntake("test-session-1", context);
    expect(step.progress.current).toBe(0);
    expect(step.question).toContain("Little interest");
    expect(step.intro).toBeTruthy();
  });

  it("advances deterministically on answer", () => {
    const sessionId = "test-session-2";
    startIntake(sessionId, context);
    const next = submitAnswer(sessionId, context, 1);
    expect(next.progress.current).toBe(1);
    expect(next.question).toContain("Feeling down");
    expect(next.done).toBe(false);
  });

  it("flags crisis on PHQ-9 item 9", () => {
    const sessionId = "test-session-crisis";
    startIntake(sessionId, context);
    for (let i = 0; i < 8; i++) {
      submitAnswer(sessionId, context, 0);
    }
    const crisis = submitAnswer(sessionId, context, 2);
    expect(crisis.crisis.crisis).toBe(true);
  });
});
