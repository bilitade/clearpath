"use client";

import { cn } from "@/lib/utils";
import type {
  FinalizeStep,
  ProcessingPreview,
} from "@/lib/intake/finalize-intake-client";

type StepDef = {
  id: FinalizeStep;
  label: string;
  detail: string;
  badge?: "code" | "ai";
  optional?: boolean;
};

function buildSteps(hasStory: boolean): StepDef[] {
  const steps: StepDef[] = [];
  if (hasStory) {
    steps.push({
      id: "personalize",
      label: "Using your story",
      detail: "Personalizing your summary — scores come from answers you confirmed",
      badge: "ai",
      optional: true,
    });
  }
  steps.push(
    {
      id: "score",
      label: "Calculating screening scores",
      detail: "PHQ-9 & GAD-7 totals from your 16 answers (deterministic code)",
      badge: "code",
    },
    {
      id: "match",
      label: "Matching providers",
      detail: "Ranking by insurance, concern, severity, wait & format",
      badge: "code",
    },
    {
      id: "summary",
      label: "Writing your summary",
      detail: "Plain-language overview using scores + matches (+ your story if provided)",
      badge: "ai",
    },
  );
  return steps;
}

function stepStatus(
  stepId: FinalizeStep,
  activeStep: FinalizeStep,
  steps: StepDef[],
): "pending" | "active" | "complete" {
  const order = [...steps.map((s) => s.id), "complete" as FinalizeStep];
  const activeIdx = order.indexOf(activeStep);
  const stepIdx = order.indexOf(stepId);

  if (stepIdx < activeIdx) return "complete";
  if (stepIdx === activeIdx) return "active";
  return "pending";
}

function StepIcon({ status }: { status: "pending" | "active" | "complete" }) {
  if (status === "complete") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="relative flex size-6 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="relative size-6 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      </span>
    );
  }

  return (
    <span className="size-6 shrink-0 rounded-full border-2 border-border bg-background" />
  );
}

function StepPreview({
  stepId,
  preview,
}: {
  stepId: FinalizeStep;
  preview?: ProcessingPreview;
}) {
  if (!preview) return null;

  if (
    stepId === "score" &&
    preview.phq9Total !== undefined &&
    preview.gad7Total !== undefined
  ) {
    return (
      <div className="mt-2 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-md border border-border bg-background px-2 py-1.5">
          <p className="text-[0.6rem] uppercase text-muted">PHQ-9</p>
          <p className="text-sm font-semibold text-foreground">
            {preview.phq9Total}
            <span className="text-muted font-normal"> / 27</span>
          </p>
        </div>
        <div className="rounded-md border border-border bg-background px-2 py-1.5">
          <p className="text-[0.6rem] uppercase text-muted">GAD-7</p>
          <p className="text-sm font-semibold text-foreground">
            {preview.gad7Total}
            <span className="text-muted font-normal"> / 21</span>
          </p>
        </div>
        {preview.careLevelLabel && (
          <p className="col-span-2 text-[0.65rem] text-muted">
            Suggested care:{" "}
            <span className="text-foreground font-medium">
              {preview.careLevelLabel}
            </span>
          </p>
        )}
      </div>
    );
  }

  if (stepId === "match" && preview.matchCount !== undefined) {
    return (
      <p className="mt-2 text-[0.65rem] text-muted">
        Found{" "}
        <span className="font-medium text-foreground">
          {preview.matchCount} provider{preview.matchCount === 1 ? "" : "s"}
        </span>{" "}
        in our directory for your profile.
      </p>
    );
  }

  return null;
}

interface ProcessingScreenProps {
  activeStep: FinalizeStep;
  preview?: ProcessingPreview;
  error?: string | null;
  onRetry?: () => void;
}

export function ProcessingScreen({
  activeStep,
  preview,
  error,
  onRetry,
}: ProcessingScreenProps) {
  const isComplete = activeStep === "complete";
  const hasStory = preview?.hasPersonalStory ?? false;
  const steps = buildSteps(hasStory);

  return (
    <div className="processing-enter mx-auto w-full max-w-lg">
      <div className="rounded-xl border border-border bg-surface/60 p-6 sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-muted">
            <svg
              viewBox="0 0 24 24"
              className={cn(
                "size-6 text-primary",
                !isComplete && !error && "animate-pulse-soft",
              )}
              fill="none"
              aria-hidden
            >
              <path
                d="M12 3a9 9 0 1 0 9 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 3v4M12 3l2.5 2.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            {error
              ? "Something went wrong"
              : isComplete
                ? "All set!"
                : "Building your care plan"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {error
              ? "We couldn't finish processing your screening."
              : isComplete
                ? "Taking you to scores, matches, and summary…"
                : "Screening is done — here's what we're doing with your answers."}
          </p>
        </div>

        {!error && (
          <ul className="space-y-4">
            {steps.map((step, i) => {
              const status = stepStatus(step.id, activeStep, steps);
              const showPreview =
                status === "complete" ||
                (status === "active" &&
                  (step.id === "score"
                    ? preview?.phq9Total !== undefined
                    : step.id === "match"
                      ? preview?.matchCount !== undefined
                      : false));

              return (
                <li
                  key={step.id}
                  className={cn(
                    "processing-step rounded-lg px-2 py-2 transition-colors",
                    status === "active" && "bg-primary-muted/50",
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <StepIcon status={status} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            status === "pending"
                              ? "text-muted"
                              : "text-foreground",
                          )}
                        >
                          {step.label}
                        </p>
                        {step.badge && (
                          <span
                            className={cn(
                              "text-[0.6rem] uppercase tracking-wide px-1.5 py-0.5 rounded font-medium",
                              step.badge === "ai"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted/30 text-muted",
                            )}
                          >
                            {step.badge === "ai" ? "AI" : "Your answers"}
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-0.5 leading-relaxed",
                          status === "active" ? "text-muted" : "text-muted/70",
                        )}
                      >
                        {step.detail}
                      </p>
                      {showPreview && (
                        <StepPreview stepId={step.id} preview={preview} />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {error && (
          <div className="space-y-4">
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-foreground">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
