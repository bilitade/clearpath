"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { IntakeStepLayout } from "@/components/intake/intake-step-layout";
import { BatchQuestion } from "@/components/intake/batch-questionnaire";
import { ChapterIntro } from "@/components/intake/chapter-intro";
import { SafetySupportCard } from "@/components/shared/safety-support-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOnboardingSession } from "@/lib/hooks/use-session-ready";
import {
  getOnboardingContext,
  getSessionId,
  mergeLocalConfirmedAnswers,
  setScreeningMode,
} from "@/lib/storage/client-storage";
import type { IntakeBatchState } from "@/lib/intake/intake-flow";

function intakeBootKey(sessionId: string) {
  return `clearpath_intake_boot_${sessionId}`;
}

export default function IntakeQuestionsPage() {
  const router = useRouter();
  const { ready, profile } = useOnboardingSession();
  const [state, setState] = useState<IntakeBatchState | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [answers, setAnswers] = useState<Record<number, 0 | 1 | 2 | 3>>({});
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);
  const intakeStarted = useRef(false);

  const loadState = useCallback(
    async (resume: boolean) => {
      const sessionId = getSessionId();
      const context = getOnboardingContext();
      if (!sessionId || !context) {
        router.replace("/welcome");
        return;
      }

      try {
        const res = await fetch("/api/intake/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            context,
            resume,
            mode: resume ? undefined : "questionnaire",
          }),
        });
        if (!res.ok) throw new Error("Failed to load screening");
        const data = (await res.json()) as IntakeBatchState;
        setState(data);
        setAnswers({});
        setShowIntro(data.showChapterIntro);
        setSubmitError("");
      } catch {
        setState(null);
      }
    },
    [router],
  );

  useEffect(() => {
    if (!ready || intakeStarted.current) return;
    const sessionId = getSessionId();
    if (!sessionId) return;

    intakeStarted.current = true;
    setScreeningMode("questionnaire");
    const bootKey = intakeBootKey(sessionId);
    const isResume = Boolean(sessionStorage.getItem(bootKey));
    if (!isResume) sessionStorage.setItem(bootKey, "1");
    queueMicrotask(() => void loadState(isResume));
  }, [ready, loadState]);

  async function submitBatch() {
    const sessionId = getSessionId();
    const context = getOnboardingContext();
    if (!sessionId || !context || !state || loading) return;

    const payload = state.items.map((item) => ({
      globalIndex: item.globalIndex,
      value: answers[item.globalIndex],
    }));

    if (payload.some((p) => p.value === undefined)) {
      return;
    }
    const confirmedPayload = payload as Array<{
      globalIndex: number;
      value: 0 | 1 | 2 | 3;
    }>;

    setLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/intake/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, context, answers: payload }),
      });
      if (!res.ok) throw new Error("Failed to save answers");

      const data = (await res.json()) as IntakeBatchState;
      mergeLocalConfirmedAnswers(sessionId, confirmedPayload);

      if (data.crisis?.crisis) {
        setShowSafetyNotice(true);
      }

      if (data.done) {
        router.push("/processing");
        return;
      }

      setState(data);
      setAnswers({});
      setShowIntro(data.showChapterIntro);
    } catch {
      setSubmitError("Could not save your answers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const allAnswered =
    state?.items.every((item) => answers[item.globalIndex] !== undefined) ??
    false;

  useEffect(() => {
    if (state?.done) {
      router.push("/processing");
    }
  }, [state?.done, router]);

  if (!ready || !profile) {
    return (
      <PageShell compact className="max-w-4xl">
        <p className="text-sm text-muted">Loading screening…</p>
      </PageShell>
    );
  }

  if (!state) {
    return (
      <PageShell compact className="max-w-4xl">
        <p className="text-sm text-muted">Loading screening…</p>
      </PageShell>
    );
  }

  if (state.done) {
    return (
      <PageShell compact className="max-w-4xl">
        <p className="text-sm text-muted">Completing screening…</p>
      </PageShell>
    );
  }

  const batchNum = state.batchIndex + 1;

  return (
    <IntakeStepLayout profile={profile}>
      {showSafetyNotice && <SafetySupportCard />}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-primary">
              Step 2 of 4 · Questionnaires
            </p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              Part {batchNum} of {state.totalBatches}
            </p>
          </div>
          <Link
            href="/intake"
            className="text-xs text-muted hover:text-primary"
          >
            Change approach
          </Link>
        </div>
        {state.section && (
          <p className="text-xs text-muted">{state.section}</p>
        )}
        <Progress
          value={state.progress.current}
          max={state.progress.total}
          label={`${state.progress.current} of ${state.progress.total} questions answered`}
        />
      </div>

      {showIntro && state.chapterIntro ? (
        <ChapterIntro
          title={state.chapterIntro.title}
          subtitle={state.chapterIntro.subtitle}
          body={state.chapterIntro.body}
          onContinue={() => setShowIntro(false)}
        />
      ) : (
        <>
          <p className="text-xs text-muted">
            Over the last 2 weeks, how often has each statement applied to you?
          </p>

          <div className="space-y-3">
            {state.items.map((item) => (
              <BatchQuestion
                key={item.globalIndex}
                index={item.globalIndex}
                text={item.text}
                isSafety={item.isSafety}
                value={answers[item.globalIndex]}
                onChange={(v) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [item.globalIndex]: v,
                  }))
                }
                disabled={loading}
              />
            ))}
          </div>

          {submitError && (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}

          <Button
            size="md"
            className="w-full sm:w-auto"
            disabled={!allAnswered || loading}
            onClick={() => void submitBatch()}
          >
            {loading ? "Saving…" : "Continue"}
          </Button>
        </>
      )}
    </IntakeStepLayout>
  );
}
