"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProcessingScreen } from "@/components/intake/processing-screen";
import { PageShell } from "@/components/layout/page-shell";
import {
  finalizeIntakeClient,
  type FinalizeStep,
  type ProcessingPreview,
} from "@/lib/intake/finalize-intake-client";
import {
  getOnboardingContext,
  getSessionId,
  setStoredResults,
} from "@/lib/storage/client-storage";

export default function ProcessingPage() {
  const router = useRouter();
  const startedRef = useRef(false);
  const [activeStep, setActiveStep] = useState<FinalizeStep>("score");
  const [preview, setPreview] = useState<ProcessingPreview | undefined>();
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    const sessionId = getSessionId();
    const context = getOnboardingContext();

    if (!sessionId || !context) {
      router.replace("/welcome");
      return;
    }

    setError(null);
    setPreview(undefined);
    setActiveStep(
      context.optionalContext?.trim() ? "personalize" : "score",
    );

    try {
      const result = await finalizeIntakeClient(
        sessionId,
        context,
        (step, nextPreview) => {
          setActiveStep(step);
          if (nextPreview) {
            setPreview((prev) => ({ ...prev, ...nextPreview }));
          }
        },
      );

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
    <PageShell compact className="max-w-xl">
      <ProcessingScreen
        activeStep={activeStep}
        preview={preview}
        error={error}
        onRetry={() => {
          startedRef.current = true;
          void run();
        }}
      />
    </PageShell>
  );
}
