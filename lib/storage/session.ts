import type { IntakeState } from "@/lib/types";

const sessions = new Map<string, IntakeState>();

export function getSession(sessionId: string): IntakeState | undefined {
  return sessions.get(sessionId);
}

export function createSession(state: IntakeState): IntakeState {
  sessions.set(state.sessionId, state);
  return state;
}

export function updateSession(
  sessionId: string,
  updater: (state: IntakeState) => IntakeState,
): IntakeState | undefined {
  const current = sessions.get(sessionId);
  if (!current) return undefined;
  const updated = updater(current);
  sessions.set(sessionId, updated);
  return updated;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}
