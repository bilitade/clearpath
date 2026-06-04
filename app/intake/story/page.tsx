"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { IntakeStepLayout } from "@/components/intake/intake-step-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useOnboardingSession } from "@/lib/hooks/use-session-ready";
import {
  getSessionId,
  setLocalStoryReview,
  setPatientProfile,
  setScreeningMode,
} from "@/lib/storage/client-storage";
import { STORY_MAX_CHARS, STORY_MIN_CHARS } from "@/lib/ai/story-inference";

export default function IntakeStoryPage() {
  const router = useRouter();
  const { ready, profile } = useOnboardingSession();
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const storyValue = story ?? profile?.optionalContext ?? "";

  useEffect(() => {
    if (!ready) return;
    setScreeningMode("story");
  }, [ready]);

  if (!ready || !profile) {
    return (
      <PageShell compact>
        <p className="text-sm text-muted">Loading…</p>
      </PageShell>
    );
  }

  async function handleSubmit() {
    const trimmed = storyValue.trim();
    if (trimmed.length < STORY_MIN_CHARS) {
      setError(
        `Please write at least ${STORY_MIN_CHARS} characters so we can map your experience to the screening questions.`,
      );
      return;
    }

    const sessionId = getSessionId();
    if (!sessionId || !profile) return;

    setLoading(true);
    setError("");

    try {
      const inferRes = await fetch("/api/intake/infer-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          context: profile,
          story: trimmed,
        }),
      });

      const data = (await inferRes.json()) as {
        error?: string;
        suggestions?: Array<{ globalIndex: number; value: number }>;
      };

      if (!inferRes.ok) {
        throw new Error(data.error ?? "Could not analyze your story");
      }

      const suggestions: Record<number, 0 | 1 | 2 | 3> = {};
      for (const item of data.suggestions ?? []) {
        if (
          item.value === 0 ||
          item.value === 1 ||
          item.value === 2 ||
          item.value === 3
        ) {
          suggestions[item.globalIndex] = item.value;
        }
      }

      setLocalStoryReview(sessionId, trimmed, suggestions);
      setPatientProfile({ ...profile, optionalContext: trimmed });
      router.push("/intake/review");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <IntakeStepLayout profile={profile}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium text-primary">
            Step 2 of 4 · Your story
          </p>
          <Link
            href="/intake/questions"
            className="text-xs text-muted hover:text-primary"
            onClick={() => setScreeningMode("questionnaire")}
          >
            Skip — answer questions instead
          </Link>
        </div>
        <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
          Tell us what you are going through
        </h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          AI maps your words to standard PHQ-9 and GAD-7 items. You review and
          confirm each answer before scores are calculated.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface/60 p-4 sm:p-6 space-y-3">
        <Label htmlFor="story">Your story</Label>
        <textarea
          id="story"
          rows={8}
          maxLength={STORY_MAX_CHARS}
          placeholder="I've been feeling stressed and overwhelmed lately, mostly due to work. It's been affecting my sleep..."
          value={storyValue}
          onChange={(e) => setStory(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted">
          {storyValue.trim().length} / {STORY_MIN_CHARS} min characters · Not a
          diagnosis —{" "}
          <a href="/crisis" className="text-primary underline">
            crisis help
          </a>
        </p>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button
        size="md"
        className="w-full sm:w-auto"
        disabled={loading}
        onClick={() => void handleSubmit()}
      >
        {loading ? "Mapping to screening questions…" : "Continue to review"}
      </Button>
    </IntakeStepLayout>
  );
}
