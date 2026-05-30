"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProcessingScreen } from "@/components/intake/processing-screen";
import { PageShell } from "@/components/layout/page-shell";
import {
  finalizeIntakeClient,
  type FinalizeStep,
} from "@/lib/finalize-intake-client";
import {
  getOnboardingContext,
  getSessionId,
  setStoredResults,
} from "@/lib/client-storage";

export default function ProcessingPage() {
  const router = useRouter();
  const startedRef = useRef(false);
  const [activeStep, setActiveStep] = useState<FinalizeStep>("score");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    const sessionId = getSessionId();
    const context = getOnboardingContext();

    if (!sessionId || !context) {
      router.replace("/onboarding");
      return;
    }

    setError(null);
    setActiveStep("score");

    try {
      const result = await finalizeIntakeClient(sessionId, context, setActiveStep);

      if (result.kind === "crisis") {
        router.replace("/crisis");
        return;
      }

      setStoredResults({
        score: result.score,
        match: result.match,
        summary: result.summary,
        context,
      });

      router.replace("/results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to prepare your results",
      );
    }
  }, [router]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void run();
  }, [run]);

  return (
    <PageShell compact className="max-w-lg">
      <ProcessingScreen
        activeStep={activeStep}
        error={error}
        onRetry={() => {
          startedRef.current = true;
          void run();
        }}
      />
    </PageShell>
  );
}
