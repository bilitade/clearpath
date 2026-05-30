"use client";

import { cn } from "@/lib/utils";
import type { FinalizeStep } from "@/lib/finalize-intake-client";

const STEPS: { id: FinalizeStep; label: string; detail: string }[] = [
  {
    id: "score",
    label: "Analyzing your responses",
    detail: "Calculating PHQ-9 & GAD-7 scores",
  },
  {
    id: "match",
    label: "Matching providers",
    detail: "Finding care options for your needs",
  },
  {
    id: "summary",
    label: "Writing your summary",
    detail: "Generating a plain-language overview",
  },
];

function stepStatus(
  stepId: FinalizeStep,
  activeStep: FinalizeStep,
): "pending" | "active" | "complete" {
  const order: FinalizeStep[] = ["score", "match", "summary", "complete"];
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

interface ProcessingScreenProps {
  activeStep: FinalizeStep;
  error?: string | null;
  onRetry?: () => void;
}

export function ProcessingScreen({
  activeStep,
  error,
  onRetry,
}: ProcessingScreenProps) {
  const isComplete = activeStep === "complete";

  return (
    <div className="processing-enter mx-auto w-full max-w-md">
      <div className="rounded-xl border border-border bg-surface/60 p-6 sm:p-8">
        <div className="mb-8 text-center">
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
                : "Preparing your results"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {error
              ? "We couldn't finish processing your screening."
              : isComplete
                ? "Taking you to your results…"
                : "This usually takes a few seconds."}
          </p>
        </div>

        {!error && (
          <ul className="space-y-4">
            {STEPS.map((step, i) => {
              const status = stepStatus(step.id, activeStep);
              return (
                <li
                  key={step.id}
                  className={cn(
                    "processing-step flex items-start gap-3 rounded-lg px-2 py-1 transition-colors",
                    status === "active" && "bg-primary-muted/50",
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <StepIcon status={status} />
                  <div className="min-w-0 pt-0.5">
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
                    <p
                      className={cn(
                        "text-xs mt-0.5",
                        status === "active" ? "text-muted" : "text-muted/70",
                      )}
                    >
                      {step.detail}
                    </p>
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
