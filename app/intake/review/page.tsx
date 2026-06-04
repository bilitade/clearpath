"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { IntakeStepLayout } from "@/components/intake/intake-step-layout";
import { BatchQuestion } from "@/components/intake/batch-questionnaire";
import { SafetySupportCard } from "@/components/shared/safety-support-card";
import { Button } from "@/components/ui/button";
import { useOnboardingSession } from "@/lib/hooks/use-session-ready";
import {
  getLocalStoryReview,
  getOnboardingContext,
  getSessionId,
  setLocalConfirmedAnswers,
} from "@/lib/storage/client-storage";
import {
  SCALE_LABELS,
  SECTION_LABELS,
  TOTAL_INTAKE_ITEMS,
} from "@/lib/intake/instruments";
import {
  getAllReviewItems,
  type ReviewItemDescriptor,
} from "@/lib/ai/story-inference";

const REVIEW_ITEMS = getAllReviewItems();

export default function IntakeReviewPage() {
  const router = useRouter();
  const { ready, profile } = useOnboardingSession();
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");
  const [showSafetyNotice, setShowSafetyNotice] = useState(false);
  const [story, setStory] = useState("");
  const [suggestions, setSuggestions] = useState<
    Record<number, 0 | 1 | 2 | 3>
  >({});
  const [answers, setAnswers] = useState<Record<number, 0 | 1 | 2 | 3>>({});

  const loadSuggestions = useCallback(async () => {
    const sessionId = getSessionId();
    const context = getOnboardingContext();
    if (!sessionId || !context) {
      router.replace("/welcome");
      return;
    }

    try {
      const res = await fetch("/api/intake/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      let patientStory: string | undefined;
      let suggestionSource: Record<string, number> | undefined;

      if (res.ok) {
        const data = (await res.json()) as {
          patientStory?: string;
          aiSuggestions?: Record<string, number>;
        };
        patientStory = data.patientStory;
        suggestionSource = data.aiSuggestions;
      }

      const local = getLocalStoryReview(sessionId);
      if (!patientStory && local) {
        patientStory = local.patientStory;
        suggestionSource = Object.fromEntries(
          Object.entries(local.aiSuggestions).map(([k, v]) => [k, v]),
        );
      }

      if (!patientStory) {
        router.replace("/intake/story");
        return;
      }

      const map: Record<number, 0 | 1 | 2 | 3> = {};
      for (const [k, v] of Object.entries(suggestionSource ?? {})) {
        if (v === 0 || v === 1 || v === 2 || v === 3) {
          map[Number(k)] = v;
        }
      }

      if (Object.keys(map).length < TOTAL_INTAKE_ITEMS && local) {
        for (const [k, v] of Object.entries(local.aiSuggestions)) {
          map[Number(k)] = v;
        }
      }

      if (Object.keys(map).length < TOTAL_INTAKE_ITEMS) {
        router.replace("/intake/story");
        return;
      }

      setStory(patientStory);
      setSuggestions(map);
      setAnswers({ ...map });
      if ((map[8] ?? 0) >= 1) {
        setShowSafetyNotice(true);
      }
    } finally {
      setBooting(false);
    }
  }, [router]);

  useEffect(() => {
    if (!ready || !profile) return;
    void loadSuggestions();
  }, [ready, profile, loadSuggestions]);

  async function handleSubmit() {
    const sessionId = getSessionId();
    if (!sessionId || !profile || loading) return;

    const payload = REVIEW_ITEMS.map((item) => ({
      globalIndex: item.globalIndex,
      value: answers[item.globalIndex],
    }));

    if (payload.some((p) => p.value === undefined)) {
      setError("Please confirm every question (tap 0–3 for each).");
      return;
    }
    const confirmedPayload = payload as Array<{
      globalIndex: number;
      value: 0 | 1 | 2 | 3;
    }>;

    setLoading(true);
    setError("");

    try {
      const reviewContext = profile.optionalContext?.trim()
        ? profile
        : { ...profile, optionalContext: story.trim() || undefined };

      const res = await fetch("/api/intake/review-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          context: reviewContext,
          answers: confirmedPayload,
        }),
      });

      const data = (await res.json()) as { crisis?: boolean; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to submit");
      }

      const item9 = payload.find((p) => p.globalIndex === 8)?.value;
      if (data.crisis || (item9 !== undefined && item9 >= 1)) {
        setShowSafetyNotice(true);
      }

      setLocalConfirmedAnswers(sessionId, confirmedPayload);
      router.push("/processing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setLoading(false);
    }
  }

  const allAnswered = REVIEW_ITEMS.every(
    (item) => answers[item.globalIndex] !== undefined,
  );

  function renderSection(
    section: "mood" | "anxiety",
    items: ReviewItemDescriptor[],
  ) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {SECTION_LABELS[section]}
        </h2>
        {items.map((item) => (
          <BatchQuestion
            key={item.globalIndex}
            index={item.globalIndex}
            text={item.text}
            isSafety={item.isSafety}
            value={answers[item.globalIndex]}
            suggestedValue={suggestions[item.globalIndex]}
            onChange={(v) =>
              setAnswers((prev) => ({ ...prev, [item.globalIndex]: v }))
            }
            disabled={loading}
          />
        ))}
      </div>
    );
  }

  if (!ready || booting || !profile) {
    return (
      <PageShell compact className="max-w-4xl">
        <p className="text-sm text-muted">Loading your review…</p>
      </PageShell>
    );
  }

  const moodItems = REVIEW_ITEMS.filter((i) => i.section === "mood");
  const anxietyItems = REVIEW_ITEMS.filter((i) => i.section === "anxiety");

  return (
    <IntakeStepLayout profile={profile}>
      <div>
        <p className="text-xs font-medium text-primary">
          Step 3 of 4 · Review AI mapping
        </p>
        <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
          Review screening answers
        </h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Adjust any draft answer. Final scores use what you confirm here, not
          the story alone.
        </p>
      </div>

      {showSafetyNotice && <SafetySupportCard />}

      {story && (
        <blockquote className="rounded-lg border border-border bg-surface/40 px-4 py-3 text-xs text-muted italic line-clamp-3">
          &ldquo;{story}&rdquo;
        </blockquote>
      )}

      <div className="rounded-lg border border-primary/30 bg-primary-muted/30 px-3 py-2 text-xs text-muted">
        Scale:{" "}
        {Object.entries(SCALE_LABELS)
          .map(([k, v]) => `${k}=${v}`)
          .join(" · ")}
      </div>

      <div className="space-y-6 max-h-[min(60vh,520px)] overflow-y-auto pr-1">
        {renderSection("mood", moodItems)}
        {renderSection("anxiety", anxietyItems)}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        size="md"
        className="w-full sm:w-auto"
        disabled={!allAnswered || loading}
        onClick={() => void handleSubmit()}
      >
        {loading ? "Submitting…" : "Confirm & get my care plan"}
      </Button>
    </IntakeStepLayout>
  );
}
