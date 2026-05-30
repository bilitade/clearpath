import type { OnboardingContext } from "@/lib/types";

const SESSION_KEY = "clearpath_session";
const CONTEXT_KEY = "clearpath_context";
const RESULTS_KEY = "clearpath_results";

export interface StoredResults {
  score: import("@/lib/types").ScoreResult;
  match: import("@/lib/types").MatchResult;
  summary: string;
  context: OnboardingContext;
}

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY);
}

export function setSessionId(id: string): void {
  sessionStorage.setItem(SESSION_KEY, id);
}

export function getOnboardingContext(): OnboardingContext | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CONTEXT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingContext;
  } catch {
    return null;
  }
}

export function setOnboardingContext(context: OnboardingContext): void {
  sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
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

export function setStoredResults(results: StoredResults): void {
  sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  resultsSnapshotCache = { raw: sessionStorage.getItem(RESULTS_KEY), data: results };
  notifyResultsListeners();
}

export function clearSessionData(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(CONTEXT_KEY);
  sessionStorage.removeItem(RESULTS_KEY);
  resultsSnapshotCache = null;
  notifyResultsListeners();
}

// Stable snapshot for useSyncExternalStore (must not return new object refs each call)
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
