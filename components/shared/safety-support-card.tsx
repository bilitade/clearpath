import Link from "next/link";
import { cn } from "@/lib/utils";

interface SafetySupportCardProps {
  className?: string;
  variant?: "inline" | "results";
}

function LifeRingIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
      <path d="M12 2a10 10 0 0 1 8 4M12 22a10 10 0 0 1-8-4" />
    </svg>
  );
}

const actionPrimary =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const actionOutline =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SafetySupportCard({
  className,
  variant = "inline",
}: SafetySupportCardProps) {
  const isResults = variant === "results";

  return (
    <section
      role="alert"
      aria-labelledby="safety-support-heading"
      className={cn(
        "rounded-xl border border-border bg-surface shadow-sm overflow-hidden",
        className,
      )}
    >
      <div className="border-l-4 border-l-destructive">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            aria-hidden
          >
            <LifeRingIcon className="size-6" />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <h2
                id="safety-support-heading"
                className="text-sm font-semibold text-foreground sm:text-base"
              >
                {isResults
                  ? "Immediate support is available"
                  : "You may want support soon"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {isResults ? (
                  <>
                    Your answers included thoughts of self-harm. ClearPath cannot
                    provide emergency care — if you need help now, use a crisis
                    line below. You can still review your care plan when you are
                    ready.
                  </>
                ) : (
                  <>
                    What you shared may mean talking to someone soon. You can
                    finish screening — we will show these options again on your
                    results.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a href="tel:988" className={actionPrimary}>
                Call or text 988
              </a>
              <a href="sms:741741&body=HOME" className={actionOutline}>
                Text HOME to 741741
              </a>
              <a href="tel:911" className={actionOutline}>
                Call 911
              </a>
              <Link href="/crisis" className={actionOutline}>
                More crisis resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
