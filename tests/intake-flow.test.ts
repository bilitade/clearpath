import { describe, expect, it } from "vitest";
import {
  ensureStoryReviewSession,
  getIntakeBatchState,
  getReviewState,
  savePatientStory,
  startIntake,
  submitBatchAnswers,
  submitReviewAnswers,
} from "@/lib/intake/intake-flow";
import type { GlobalAnswerInput } from "@/lib/intake/intake-answers";
import { TOTAL_INTAKE_ITEMS } from "@/lib/intake/instruments";
import { deleteSession, getSession } from "@/lib/storage/session";

const context = {
  zip: "02139",
  insurance: "aetna",
  concern: "anxiety" as const,
  formatPreference: "either" as const,
};

const story =
  "Overall I have been doing well with only mild stress before deadlines.";

function allZeroReviewAnswers(): GlobalAnswerInput[] {
  return Array.from({ length: TOTAL_INTAKE_ITEMS }, (_, globalIndex) => ({
    globalIndex,
    value: 0 as const,
  }));
}

function buildSuggestions(value: 0 | 1 | 2 | 3 = 0) {
  const suggestions: Record<number, 0 | 1 | 2 | 3> = {};
  for (let i = 0; i < TOTAL_INTAKE_ITEMS; i++) {
    suggestions[i] = value;
  }
  return suggestions;
}

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

describe("story review session resilience", () => {
  it("savePatientStory creates server session when none exists", () => {
    const sessionId = "story-save-no-prior-session";
    expect(getSession(sessionId)).toBeUndefined();

    savePatientStory(sessionId, context, story, buildSuggestions());

    expect(getReviewState(sessionId)?.hasStory).toBe(true);
    expect(getReviewState(sessionId)?.story).toBe(story);
  });

  it("ensureStoryReviewSession restores story after in-memory session loss", () => {
    const sessionId = "story-restore-after-loss";
    savePatientStory(sessionId, context, story, buildSuggestions());
    deleteSession(sessionId);

    expect(getReviewState(sessionId)).toBeNull();

    const restored = ensureStoryReviewSession(sessionId, {
      ...context,
      optionalContext: story,
    });

    expect(restored).toBe(true);
    expect(getReviewState(sessionId)?.hasStory).toBe(true);
    expect(getReviewState(sessionId)?.story).toBe(story);
  });

  it("ensureStoryReviewSession fails without story text in profile", () => {
    const sessionId = "story-restore-missing-text";
    deleteSession(sessionId);

    expect(
      ensureStoryReviewSession(sessionId, context),
    ).toBe(false);
  });

  it("submitReviewAnswers succeeds after session loss once story is restored", () => {
    const sessionId = "story-submit-after-restore";
    const storyContext = { ...context, optionalContext: story };

    savePatientStory(sessionId, storyContext, story, buildSuggestions());
    deleteSession(sessionId);

    expect(
      ensureStoryReviewSession(sessionId, storyContext),
    ).toBe(true);

    const result = submitReviewAnswers(
      sessionId,
      storyContext,
      allZeroReviewAnswers(),
    );

    expect(result.done).toBe(true);
    expect(result.crisis.crisis).toBe(false);
    expect(getSession(sessionId)?.answers).toHaveLength(TOTAL_INTAKE_ITEMS);
  });

  it("does not require a prior startIntake call before story inference save", () => {
    const sessionId = "story-infer-only-path";
    deleteSession(sessionId);

    savePatientStory(sessionId, { ...context, optionalContext: story }, story, {
      ...buildSuggestions(1),
      8: 0,
    });

    const review = getReviewState(sessionId);
    expect(review?.hasStory).toBe(true);
    expect(review?.suggestions[0]).toBe(1);
    expect(review?.suggestions[8]).toBe(0);
  });
});
