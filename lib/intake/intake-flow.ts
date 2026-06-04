import {
  batchIndexFromAnswerCount,
  CHAPTER_INTROS,
  getQuestionDisplayText,
  getQuestionSection,
  INTAKE_BATCHES,
  isChapterStart,
  isSafetyBatch,
  SECTION_LABELS,
  TOTAL_BATCHES,
  TOTAL_INTAKE_ITEMS,
} from "./instruments";
import {
  assertFullReviewAnswers,
  buildIntakeAnswers,
  sortGlobalAnswers,
  type GlobalAnswerInput,
} from "./intake-answers";
import { checkItem9Crisis } from "@/lib/screening/crisis";
import { createSession, getSession, updateSession } from "@/lib/storage/session";
import type { CrisisCheck, OnboardingContext } from "@/lib/types";

export interface IntakeBatchItem {
  globalIndex: number;
  text: string;
  isSafety: boolean;
}

export interface IntakeBatchState {
  batchIndex: number;
  totalBatches: number;
  showChapterIntro: boolean;
  chapter?: "mood" | "anxiety" | "safety";
  chapterIntro?: (typeof CHAPTER_INTROS)[keyof typeof CHAPTER_INTROS];
  section?: string;
  items: IntakeBatchItem[];
  progress: { current: number; total: number };
  done: boolean;
  crisis: CrisisCheck;
}

function ensureSession(sessionId: string, context: OnboardingContext) {
  let session = getSession(sessionId);
  if (!session) {
    session = createSession({
      sessionId,
      itemIndex: 0,
      answers: [],
      context,
      messages: [],
      classifierCrisisFlag: false,
    });
  } else {
    updateSession(sessionId, (s) => ({ ...s, context }));
  }
  return session;
}

function chapterForBatch(batchIndex: number): "mood" | "anxiety" | "safety" {
  if (isSafetyBatch(batchIndex)) return "safety";
  const first = INTAKE_BATCHES[batchIndex]?.[0] ?? 0;
  return getQuestionSection(first) === "anxiety" ? "anxiety" : "mood";
}

function buildBatchState(
  answerCount: number,
  crisis: CrisisCheck,
  done: boolean,
): IntakeBatchState {
  const batchIndex = batchIndexFromAnswerCount(answerCount);
  const chapter = chapterForBatch(Math.min(batchIndex, TOTAL_BATCHES - 1));

  if (done || batchIndex >= TOTAL_BATCHES) {
    return {
      batchIndex: TOTAL_BATCHES,
      totalBatches: TOTAL_BATCHES,
      showChapterIntro: false,
      items: [],
      progress: { current: TOTAL_INTAKE_ITEMS, total: TOTAL_INTAKE_ITEMS },
      done: true,
      crisis,
    };
  }

  const indices = INTAKE_BATCHES[batchIndex]!;
  const items: IntakeBatchItem[] = indices.map((globalIndex) => ({
    globalIndex,
    text: getQuestionDisplayText(globalIndex),
    isSafety: globalIndex === 8,
  }));

  const showChapterIntro = isChapterStart(batchIndex);
  let chapterIntro: IntakeBatchState["chapterIntro"];
  if (showChapterIntro) {
    chapterIntro = isSafetyBatch(batchIndex)
      ? CHAPTER_INTROS.safety
      : chapter === "anxiety"
        ? CHAPTER_INTROS.anxiety
        : CHAPTER_INTROS.mood;
  } else if (isSafetyBatch(batchIndex)) {
    return {
      batchIndex,
      totalBatches: TOTAL_BATCHES,
      showChapterIntro: true,
      chapter: "safety",
      chapterIntro: CHAPTER_INTROS.safety,
      section: SECTION_LABELS.mood,
      items,
      progress: { current: answerCount, total: TOTAL_INTAKE_ITEMS },
      done: false,
      crisis,
    };
  }

  const firstIndex = indices[0]!;
  return {
    batchIndex,
    totalBatches: TOTAL_BATCHES,
    showChapterIntro,
    chapter,
    chapterIntro: showChapterIntro ? chapterIntro : undefined,
    section: SECTION_LABELS[getQuestionSection(firstIndex)],
    items,
    progress: { current: answerCount, total: TOTAL_INTAKE_ITEMS },
    done: false,
    crisis,
  };
}

export function getIntakeBatchState(
  sessionId: string,
  context: OnboardingContext,
): IntakeBatchState {
  const session = ensureSession(sessionId, context);
  const count = session.answers.length;

  if (count >= TOTAL_INTAKE_ITEMS) {
    return buildBatchState(count, checkItem9Crisis(session.answers), true);
  }

  return buildBatchState(count, { crisis: false, confidence: 0, source: "none" }, false);
}

export function submitBatchAnswers(
  sessionId: string,
  context: OnboardingContext,
  answers: GlobalAnswerInput[],
): IntakeBatchState {
  const session = ensureSession(sessionId, context);
  const expectedBatch = INTAKE_BATCHES[batchIndexFromAnswerCount(session.answers.length)];

  if (!expectedBatch) {
    return buildBatchState(
      session.answers.length,
      checkItem9Crisis(session.answers),
      session.answers.length >= TOTAL_INTAKE_ITEMS,
    );
  }

  const sorted = sortGlobalAnswers(answers);
  if (
    sorted.length !== expectedBatch.length ||
    sorted.some((a, i) => a.globalIndex !== expectedBatch[i])
  ) {
    throw new Error("Invalid batch answers");
  }

  const newAnswers = buildIntakeAnswers(sorted);
  const allAnswers = [...session.answers, ...newAnswers];
  const crisis = checkItem9Crisis(allAnswers);

  updateSession(sessionId, (s) => ({
    ...s,
    answers: allAnswers,
    itemIndex: allAnswers.length,
  }));

  const done = allAnswers.length >= TOTAL_INTAKE_ITEMS;
  return buildBatchState(allAnswers.length, crisis, done);
}

export function startIntake(
  sessionId: string,
  context: OnboardingContext,
): IntakeBatchState {
  ensureSession(sessionId, context);
  return getIntakeBatchState(sessionId, context);
}

export function startQuestionnaireIntake(
  sessionId: string,
  context: OnboardingContext,
): IntakeBatchState {
  const profile = { ...context, optionalContext: undefined };
  let session = getSession(sessionId);
  if (!session) {
    session = createSession({
      sessionId,
      itemIndex: 0,
      answers: [],
      context: profile,
      messages: [],
      classifierCrisisFlag: false,
    });
  } else {
    updateSession(sessionId, (s) => ({
      ...s,
      context: profile,
      patientStory: undefined,
      aiSuggestions: undefined,
      answers: [],
      itemIndex: 0,
    }));
  }
  return getIntakeBatchState(sessionId, profile);
}

export function resumeIntake(
  sessionId: string,
  context: OnboardingContext,
): IntakeBatchState {
  ensureSession(sessionId, context);
  return getIntakeBatchState(sessionId, context);
}

export function savePatientStory(
  sessionId: string,
  context: OnboardingContext,
  story: string,
  aiSuggestions: Record<number, 0 | 1 | 2 | 3>,
): void {
  const profile = { ...context, optionalContext: story };
  ensureSession(sessionId, profile);
  updateSession(sessionId, (s) => ({
    ...s,
    context: profile,
    patientStory: story,
    aiSuggestions,
    answers: [],
    itemIndex: 0,
  }));
}

/** Restore story-path session when in-memory server state was lost. */
export function ensureStoryReviewSession(
  sessionId: string,
  context: OnboardingContext,
  aiSuggestions?: Partial<Record<number, 0 | 1 | 2 | 3>>,
): boolean {
  if (getReviewState(sessionId)?.hasStory) return true;

  const story = context.optionalContext?.trim();
  if (!story) return false;

  const profile = { ...context, optionalContext: story };
  ensureSession(sessionId, profile);
  updateSession(sessionId, (s) => ({
    ...s,
    context: profile,
    patientStory: story,
    aiSuggestions: aiSuggestions ?? s.aiSuggestions ?? {},
    answers: [],
    itemIndex: 0,
  }));

  return Boolean(getReviewState(sessionId)?.hasStory);
}

export function getReviewState(sessionId: string): {
  story?: string;
  suggestions: Partial<Record<number, 0 | 1 | 2 | 3>>;
  hasStory: boolean;
} | null {
  const session = getSession(sessionId);
  if (!session?.patientStory) return null;
  return {
    story: session.patientStory,
    suggestions: session.aiSuggestions ?? {},
    hasStory: true,
  };
}

export function submitReviewAnswers(
  sessionId: string,
  context: OnboardingContext,
  answers: GlobalAnswerInput[],
): { crisis: CrisisCheck; done: boolean } {
  const sorted = sortGlobalAnswers(answers);
  assertFullReviewAnswers(sorted);

  const newAnswers = buildIntakeAnswers(sorted, "review");
  const crisis = checkItem9Crisis(newAnswers);

  updateSession(sessionId, (s) => ({
    ...s,
    context,
    answers: newAnswers,
    itemIndex: TOTAL_INTAKE_ITEMS,
  }));

  return { crisis, done: true };
}

export function setClassifierCrisisFlag(sessionId: string, flag: boolean) {
  updateSession(sessionId, (s) => ({ ...s, classifierCrisisFlag: flag }));
}
