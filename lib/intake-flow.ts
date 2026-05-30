import {
  getIntakeItem,
  getQuestionDisplayText,
  getQuestionSection,
  SECTION_LABELS,
  TOTAL_INTAKE_ITEMS,
} from "./instruments";
import { checkItem9Crisis } from "./crisis";
import { createSession, getSession, updateSession } from "./session";
import type { IntakeAnswer, OnboardingContext } from "./types";

export const INTRO_MESSAGE =
  "Over the past 2 weeks, how often did each statement apply to you? Tap one option per question.";

export function getQuestionText(itemIndex: number): string {
  return getQuestionDisplayText(itemIndex);
}

export function getSectionLabel(itemIndex: number): string {
  return SECTION_LABELS[getQuestionSection(itemIndex)];
}

export interface IntakeStepResult {
  intro?: string;
  question: string;
  section?: string;
  progress: { current: number; total: number };
  done: boolean;
  crisis: ReturnType<typeof checkItem9Crisis>;
  captured?: IntakeAnswer;
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
  }
  return session;
}

export function startIntake(
  sessionId: string,
  context: OnboardingContext,
): IntakeStepResult {
  ensureSession(sessionId, context);
  return {
    intro: INTRO_MESSAGE,
    question: getQuestionText(0),
    section: getSectionLabel(0),
    progress: { current: 0, total: TOTAL_INTAKE_ITEMS },
    done: false,
    crisis: { crisis: false, confidence: 0, source: "none" },
  };
}

export function submitAnswer(
  sessionId: string,
  context: OnboardingContext,
  value: 0 | 1 | 2 | 3,
): IntakeStepResult {
  const session = ensureSession(sessionId, context);
  const currentItem = getIntakeItem(session.answers.length);

  if (!currentItem) {
    return {
      question: "",
      progress: { current: TOTAL_INTAKE_ITEMS, total: TOTAL_INTAKE_ITEMS },
      done: true,
      crisis: { crisis: false, confidence: 0, source: "none" },
    };
  }

  const answer: IntakeAnswer = {
    instrument: currentItem.instrument,
    index: currentItem.index,
    value,
    confirmed: true,
    rawText: `${value}`,
  };

  const newAnswers = [...session.answers, answer];
  const crisis = checkItem9Crisis(newAnswers);

  updateSession(sessionId, (s) => ({
    ...s,
    answers: newAnswers,
    itemIndex: newAnswers.length,
    messages: [
      ...s.messages,
      { role: "user", content: `${value}` },
      ...(newAnswers.length < TOTAL_INTAKE_ITEMS
        ? [{ role: "assistant" as const, content: getQuestionText(newAnswers.length) }]
        : []),
    ],
  }));

  if (crisis.crisis) {
    return {
      question: "",
      progress: { current: newAnswers.length, total: TOTAL_INTAKE_ITEMS },
      done: false,
      crisis,
      captured: answer,
    };
  }

  if (newAnswers.length >= TOTAL_INTAKE_ITEMS) {
    return {
      question: "",
      progress: { current: TOTAL_INTAKE_ITEMS, total: TOTAL_INTAKE_ITEMS },
      done: true,
      crisis: { crisis: false, confidence: 0, source: "none" },
      captured: answer,
    };
  }

  return {
    question: getQuestionText(newAnswers.length),
    section: getSectionLabel(newAnswers.length),
    progress: { current: newAnswers.length, total: TOTAL_INTAKE_ITEMS },
    done: false,
    crisis: { crisis: false, confidence: 0, source: "none" },
    captured: answer,
  };
}

export function resumeIntake(sessionId: string, context: OnboardingContext) {
  const session = getSession(sessionId) ?? ensureSession(sessionId, context);
  const index = session.answers.length;

  if (index >= TOTAL_INTAKE_ITEMS) {
    return {
      intro: undefined,
      question: "",
      progress: { current: TOTAL_INTAKE_ITEMS, total: TOTAL_INTAKE_ITEMS },
      done: true,
      crisis: { crisis: false, confidence: 0, source: "none" as const },
    };
  }

  return {
    intro: index === 0 ? INTRO_MESSAGE : undefined,
    question: getQuestionText(index),
    section: getSectionLabel(index),
    progress: { current: index, total: TOTAL_INTAKE_ITEMS },
    done: false,
    crisis: { crisis: false, confidence: 0, source: "none" as const },
  };
}
