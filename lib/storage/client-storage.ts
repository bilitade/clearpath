import {
  SCREENING_MODE_KEY,
  type ScreeningMode,
} from "@/lib/screening/screening-mode";
import { TOTAL_INTAKE_ITEMS } from "@/lib/intake/instruments";
import type { OnboardingContext, PatientProfile } from "@/lib/types";

const SESSION_KEY = "clearpath_session";
const CONTEXT_KEY = "clearpath_context";
const RESULTS_KEY = "clearpath_results";
const CONFIRMED_ANSWERS_KEY = "clearpath_confirmed_answers";
const STORY_REVIEW_KEY = "clearpath_story_review";

export interface LocalStoryReviewState {
  sessionId: string;
  patientStory: string;
  aiSuggestions: Record<number, 0 | 1 | 2 | 3>;
}

function normalizeProfile(raw: unknown): PatientProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.zip !== "string" || typeof o.insurance !== "string") return null;
  if (typeof o.concern !== "string") return null;
  return {
    zip: o.zip,
    insurance: o.insurance,
    concern: o.concern as PatientProfile["concern"],
    formatPreference:
      o.formatPreference === "tele" ||
      o.formatPreference === "in_person" ||
      o.formatPreference === "either"
        ? o.formatPreference
        : "either",
    optionalContext:
      typeof o.optionalContext === "string" ? o.optionalContext : undefined,
  };
}

export interface StoredResults {
  score: import("@/lib/types").ScoreResult;
  match: import("@/lib/types").MatchResult;
  summary: string;
  context: OnboardingContext;
}

export interface LocalConfirmedAnswer {
  globalIndex: number;
  value: 0 | 1 | 2 | 3;
}

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY);
}

export function setSessionId(id: string): void {
  sessionStorage.setItem(SESSION_KEY, id);
  sessionIdSnapshotCache = { raw: id, data: id };
  notifyOnboardingSessionListeners();
}

export function getOnboardingContext(): OnboardingContext | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CONTEXT_KEY);
  if (!raw) return null;
  try {
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function setOnboardingContext(context: OnboardingContext): void {
  const raw = JSON.stringify(context);
  sessionStorage.setItem(CONTEXT_KEY, raw);
  contextSnapshotCache = { raw, data: context };
  notifyOnboardingSessionListeners();
}

export function getPatientProfile(): PatientProfile | null {
  return getOnboardingContext();
}

export function setPatientProfile(profile: PatientProfile): void {
  setOnboardingContext(profile);
}

export function getStoredResults(): StoredResults | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RESULTS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredResults;
  } catch {
    return null;
  }
}

function isScaleValue(value: unknown): value is 0 | 1 | 2 | 3 {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

function normalizeLocalConfirmedAnswers(
  raw: unknown,
): LocalConfirmedAnswer[] | null {
  if (!Array.isArray(raw)) return null;

  const parsed: LocalConfirmedAnswer[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const answer = item as Record<string, unknown>;
    const globalIndex = answer.globalIndex;
    if (typeof globalIndex !== "number" || !Number.isInteger(globalIndex)) {
      return null;
    }
    if (!isScaleValue(answer.value)) return null;
    if (globalIndex < 0 || globalIndex >= TOTAL_INTAKE_ITEMS) {
      return null;
    }
    parsed.push({
      globalIndex,
      value: answer.value,
    });
  }

  return parsed;
}

function sortAndDedupeLocalAnswers(
  answers: LocalConfirmedAnswer[],
): LocalConfirmedAnswer[] {
  const byIndex = new Map<number, 0 | 1 | 2 | 3>();
  for (const answer of answers) {
    byIndex.set(answer.globalIndex, answer.value);
  }
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([globalIndex, value]) => ({ globalIndex, value }));
}

export function getLocalConfirmedAnswers(
  sessionId: string,
): LocalConfirmedAnswer[] {
  if (typeof window === "undefined") return [];

  const raw = sessionStorage.getItem(CONFIRMED_ANSWERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as {
      sessionId?: unknown;
      answers?: unknown;
    };
    if (parsed.sessionId !== sessionId) return [];
    const answers = normalizeLocalConfirmedAnswers(parsed.answers);
    if (!answers) return [];
    return sortAndDedupeLocalAnswers(answers);
  } catch {
    return [];
  }
}

export function mergeLocalConfirmedAnswers(
  sessionId: string,
  partialAnswers: LocalConfirmedAnswer[],
): void {
  if (typeof window === "undefined") return;

  const current = getLocalConfirmedAnswers(sessionId);
  const merged = sortAndDedupeLocalAnswers([...current, ...partialAnswers]);
  sessionStorage.setItem(
    CONFIRMED_ANSWERS_KEY,
    JSON.stringify({ sessionId, answers: merged }),
  );
}

export function setLocalConfirmedAnswers(
  sessionId: string,
  answers: LocalConfirmedAnswer[],
): void {
  if (typeof window === "undefined") return;
  const normalized = sortAndDedupeLocalAnswers(answers);
  sessionStorage.setItem(
    CONFIRMED_ANSWERS_KEY,
    JSON.stringify({ sessionId, answers: normalized }),
  );
}

function normalizeStorySuggestions(
  raw: unknown,
): Record<number, 0 | 1 | 2 | 3> | null {
  if (!raw || typeof raw !== "object") return null;
  const map: Record<number, 0 | 1 | 2 | 3> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const index = Number(k);
    if (!Number.isInteger(index)) return null;
    if (!isScaleValue(v)) return null;
    map[index] = v;
  }
  return map;
}

export function setLocalStoryReview(
  sessionId: string,
  patientStory: string,
  aiSuggestions: Record<number, 0 | 1 | 2 | 3>,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    STORY_REVIEW_KEY,
    JSON.stringify({ sessionId, patientStory, aiSuggestions }),
  );
}

export function getLocalStoryReview(
  sessionId: string,
): LocalStoryReviewState | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(STORY_REVIEW_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      sessionId?: unknown;
      patientStory?: unknown;
      aiSuggestions?: unknown;
    };
    if (parsed.sessionId !== sessionId) return null;
    if (typeof parsed.patientStory !== "string" || !parsed.patientStory.trim()) {
      return null;
    }
    const aiSuggestions = normalizeStorySuggestions(parsed.aiSuggestions);
    if (!aiSuggestions) return null;
    return {
      sessionId,
      patientStory: parsed.patientStory,
      aiSuggestions,
    };
  } catch {
    return null;
  }
}

export function setStoredResults(results: StoredResults): void {
  sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  resultsSnapshotCache = { raw: sessionStorage.getItem(RESULTS_KEY), data: results };
  notifyResultsListeners();
}

export function getScreeningMode(): ScreeningMode | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SCREENING_MODE_KEY);
  return raw === "story" || raw === "questionnaire" ? raw : null;
}

export function setScreeningMode(mode: ScreeningMode): void {
  sessionStorage.setItem(SCREENING_MODE_KEY, mode);
}

export function clearSessionData(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(CONTEXT_KEY);
  sessionStorage.removeItem(RESULTS_KEY);
  sessionStorage.removeItem(SCREENING_MODE_KEY);
  sessionStorage.removeItem(CONFIRMED_ANSWERS_KEY);
  sessionStorage.removeItem(STORY_REVIEW_KEY);
  contextSnapshotCache = null;
  sessionIdSnapshotCache = null;
  resultsSnapshotCache = null;
  notifyOnboardingSessionListeners();
  notifyResultsListeners();
}

let contextSnapshotCache: {
  raw: string | null;
  data: OnboardingContext | null;
} | null = null;

let sessionIdSnapshotCache: {
  raw: string | null;
  data: string | null;
} | null = null;

const onboardingSessionListeners = new Set<() => void>();

function notifyOnboardingSessionListeners() {
  onboardingSessionListeners.forEach((listener) => listener());
}

export function subscribeToOnboardingSession(listener: () => void): () => void {
  onboardingSessionListeners.add(listener);
  return () => onboardingSessionListeners.delete(listener);
}

export function getOnboardingContextSnapshot(): OnboardingContext | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(CONTEXT_KEY);
  if (contextSnapshotCache !== null && raw === contextSnapshotCache.raw) {
    return contextSnapshotCache.data;
  }

  if (!raw) {
    contextSnapshotCache = { raw: null, data: null };
    return null;
  }

  try {
    const data = normalizeProfile(JSON.parse(raw));
    contextSnapshotCache = { raw, data };
    return data;
  } catch {
    contextSnapshotCache = { raw, data: null };
    return null;
  }
}

export function getSessionIdSnapshot(): string | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(SESSION_KEY);
  if (sessionIdSnapshotCache !== null && raw === sessionIdSnapshotCache.raw) {
    return sessionIdSnapshotCache.data;
  }

  sessionIdSnapshotCache = { raw, data: raw };
  return raw;
}

let resultsSnapshotCache: {
  raw: string | null;
  data: StoredResults | null;
} | null = null;

const resultsListeners = new Set<() => void>();

function notifyResultsListeners() {
  resultsListeners.forEach((listener) => listener());
}

export function subscribeToStoredResults(listener: () => void): () => void {
  resultsListeners.add(listener);
  return () => resultsListeners.delete(listener);
}

export function getStoredResultsSnapshot(): StoredResults | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(RESULTS_KEY);
  if (resultsSnapshotCache !== null && raw === resultsSnapshotCache.raw) {
    return resultsSnapshotCache.data;
  }

  if (!raw) {
    resultsSnapshotCache = { raw: null, data: null };
    return null;
  }

  try {
    const data = JSON.parse(raw) as StoredResults;
    resultsSnapshotCache = { raw, data };
    return data;
  } catch {
    resultsSnapshotCache = { raw, data: null };
    return null;
  }
}
