"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { IntakeStepLayout } from "@/components/intake/intake-step-layout";
import { useOnboardingSession } from "@/lib/hooks/use-session-ready";
import { setScreeningMode } from "@/lib/storage/client-storage";

export default function IntakeChoosePage() {
  const router = useRouter();
  const { ready, profile } = useOnboardingSession();

  if (!ready || !profile) {
    return (
      <PageShell compact>
        <p className="text-sm text-muted">Loading…</p>
      </PageShell>
    );
  }

  function goStory() {
    setScreeningMode("story");
    router.push("/intake/story");
  }

  function goQuestionnaire() {
    setScreeningMode("questionnaire");
    router.push("/intake/questions");
  }

  return (
    <IntakeStepLayout profile={profile}>
      <div>
        <p className="text-xs font-medium text-primary">Step 2 of 4</p>
        <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
          How do you want to complete screening?
        </h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Both paths use PHQ-9 and GAD-7. Final scores always come from answers
          you confirm — not from the story alone.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={goStory}
          className="rounded-xl border border-primary bg-primary-muted/40 p-5 text-left transition-colors hover:bg-primary-muted"
        >
          <p className="text-sm font-semibold text-foreground">
            Share your story
          </p>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Write how you have been feeling. AI drafts screening answers — you
            review before we score.
          </p>
        </button>

        <button
          type="button"
          onClick={goQuestionnaire}
          className="rounded-xl border border-border bg-surface/60 p-5 text-left transition-colors hover:border-primary/40"
        >
          <p className="text-sm font-semibold text-foreground">
            Answer questions directly
          </p>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Complete PHQ-9 and GAD-7 in short sections (~5 minutes).
          </p>
        </button>
      </div>

      <Link
        href="/onboarding"
        className="inline-block text-sm text-muted hover:text-primary"
      >
        ← Back to profile
      </Link>
    </IntakeStepLayout>
  );
}
