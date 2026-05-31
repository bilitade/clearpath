import { cn } from "@/lib/utils";

const STEPS = [
  { id: "profile", label: "Your profile" },
  { id: "screening", label: "Screening" },
  { id: "matches", label: "Matches" },
] as const;

export type JourneyStep = (typeof STEPS)[number]["id"];

interface JourneyProgressProps {
  current: JourneyStep;
  className?: string;
}

export function JourneyProgress({ current, className }: JourneyProgressProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);

  return (
    <nav
      aria-label="Progress"
      className={cn("w-full", className)}
    >
      <ol className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((step, i) => {
          const isComplete = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-1 sm:gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    isComplete && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary-muted text-primary ring-2 ring-primary",
                    !isComplete && !isCurrent && "bg-surface text-muted border border-border",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isComplete ? (
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "hidden truncate text-center text-[0.65rem] font-medium sm:block sm:text-xs",
                    isCurrent ? "text-foreground" : "text-muted",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mb-4 h-0.5 flex-1 rounded-full sm:mb-5",
                    i < currentIdx ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
