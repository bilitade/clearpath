import { cn } from "@/lib/utils";

type Phase = "profile" | "screening" | "processing" | "results";

const PHASES: { id: Phase; label: string; detail: string }[] = [
  {
    id: "profile",
    label: "Your profile",
    detail: "ZIP, insurance, concern — and optional story (not scored)",
  },
  {
    id: "screening",
    label: "You answer PHQ-9 & GAD-7",
    detail: "Each 0–3 tap is saved — scores come only from these 16 answers",
  },
  {
    id: "processing",
    label: "System + AI",
    detail: "Code calculates totals & care level → matches providers → AI writes summary",
  },
  {
    id: "results",
    label: "Your care plan",
    detail: "Scores, pathway, matches, and plain-language summary",
  },
];

interface ScreeningPipelineHintProps {
  current: Phase;
  hasStory?: boolean;
  className?: string;
  compact?: boolean;
}

export function ScreeningPipelineHint({
  current,
  hasStory,
  className,
  compact,
}: ScreeningPipelineHintProps) {
  const currentIdx = PHASES.findIndex((p) => p.id === current);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface/50 px-4 py-3",
        className,
      )}
      role="note"
    >
      {!compact && (
        <p className="text-xs font-medium text-foreground mb-2">
          What happens in ClearPath
          {hasStory && current !== "profile" ? (
            <span className="font-normal text-muted">
              {" "}
              — your story personalizes the summary only; it does not change
              PHQ-9/GAD-7 scores.
            </span>
          ) : null}
        </p>
      )}
      <ol
        className={cn(
          "flex flex-col gap-2 sm:flex-row sm:gap-0 sm:divide-x sm:divide-border",
          compact && "sm:flex-col sm:divide-x-0 sm:gap-1.5",
        )}
      >
        {PHASES.map((phase, i) => {
          const isCurrent = phase.id === current;
          const isPast = i < currentIdx;
          return (
            <li
              key={phase.id}
              className={cn(
                "sm:flex-1 sm:px-3 first:sm:pl-0 last:sm:pr-0",
                compact && "sm:px-0",
              )}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold",
                    isCurrent && "bg-primary text-primary-foreground",
                    isPast && "bg-success/15 text-success",
                    !isCurrent && !isPast && "bg-muted/30 text-muted",
                  )}
                >
                  {isPast ? "✓" : i + 1}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isCurrent ? "text-foreground" : "text-muted",
                    )}
                  >
                    {phase.label}
                  </p>
                  {(!compact || isCurrent) && (
                    <p className="text-[0.65rem] leading-snug text-muted mt-0.5">
                      {phase.detail}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
