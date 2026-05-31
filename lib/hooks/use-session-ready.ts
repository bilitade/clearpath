"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  getOnboardingContextSnapshot,
  getSessionIdSnapshot,
  subscribeToOnboardingSession,
} from "@/lib/storage/client-storage";
import type { OnboardingContext } from "@/lib/types";

export interface OnboardingSession {
  ready: boolean;
  profile: OnboardingContext | null;
  sessionId: string | null;
}

export function useOnboardingSession(
  redirectTo = "/welcome",
): OnboardingSession {
  const router = useRouter();
  const profile = useSyncExternalStore(
    subscribeToOnboardingSession,
    getOnboardingContextSnapshot,
    () => null,
  );
  const sessionId = useSyncExternalStore(
    subscribeToOnboardingSession,
    getSessionIdSnapshot,
    () => null,
  );

  const ready = profile !== null && sessionId !== null;

  useEffect(() => {
    if (profile === null || sessionId === null) {
      router.replace(redirectTo);
    }
  }, [profile, sessionId, router, redirectTo]);

  return { ready, profile, sessionId };
}
