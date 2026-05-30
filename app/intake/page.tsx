"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ScaleChoices } from "@/components/intake/scale-choices";
import { Progress } from "@/components/ui/progress";
import {
  getOnboardingContext,
  getSessionId,
} from "@/lib/client-storage";

interface IntakeStep {
  intro?: string;
  question: string;
  section?: string;
  progress: { current: number; total: number };
  done: boolean;
  crisis?: { crisis: boolean };
}

function intakeBootKey(sessionId: string) {
  return `clearpath_intake_boot_${sessionId}`;
}

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<IntakeStep | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStep = useCallback(
    async (resume: boolean) => {
      const sessionId = getSessionId();
      const context = getOnboardingContext();
      if (!sessionId || !context) {
        router.replace("/onboarding");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/intake/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, context, resume }),
        });
        if (!res.ok) throw new Error("Failed to load screening");
        setStep((await res.json()) as IntakeStep);
      } catch (error) {
        setStep({
          question:
            error instanceof Error ? error.message : "Failed to load screening",
          progress: { current: 0, total: 16 },
          done: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      router.replace("/onboarding");
      return;
    }

    const bootKey = intakeBootKey(sessionId);
    const isResume = Boolean(sessionStorage.getItem(bootKey));
    if (!isResume) sessionStorage.setItem(bootKey, "1");

    void loadStep(isResume);
  }, [loadStep, router]);

  async function handleSelect(value: 0 | 1 | 2 | 3) {
    const sessionId = getSessionId();
    const context = getOnboardingContext();
    if (!sessionId || !context || !step || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/intake/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, context, value }),
      });
      if (!res.ok) throw new Error("Failed to save answer");

      const data = (await res.json()) as IntakeStep;

      if (data.crisis?.crisis) {
        router.push("/crisis");
        return;
      }

      if (data.done) {
        router.push("/processing");
        return;
      }

      setStep(data);
    } catch (error) {
      setStep({
        ...step,
        question:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!step) {
    return (
      <PageShell compact className="max-w-lg">
        <p className="text-sm text-muted">Loading…</p>
      </PageShell>
    );
  }

  const qNum = step.progress.current + 1;

  return (
    <PageShell compact className="max-w-lg">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">
              Question {qNum} of {step.progress.total}
            </span>
            {step.section && (
              <span className="text-xs text-muted">{step.section}</span>
            )}
          </div>
          <Progress
            value={step.progress.current}
            max={step.progress.total}
          />
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
          <p className="text-sm leading-snug text-foreground sm:text-[0.9375rem]">
            {step.question}
          </p>
          <ScaleChoices onSelect={handleSelect} disabled={loading} />
        </div>

        {step.progress.current === 0 && step.intro && (
          <p className="text-xs leading-relaxed text-muted">{step.intro}</p>
        )}

        {loading && qNum < step.progress.total && (
          <p className="text-center text-xs text-muted">Saving…</p>
        )}
      </div>
    </PageShell>
  );
}
