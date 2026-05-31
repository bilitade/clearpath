"use client";

import { useState } from "react";

export function HowResultsWork({ hasStory }: { hasStory?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface/40 no-print">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-foreground"
        aria-expanded={open}
      >
        How your results were made
        <span className="text-muted text-xs">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3 space-y-3 text-xs text-muted leading-relaxed">
          <p>
            <strong className="text-foreground">PHQ-9 and GAD-7 scores</strong>{" "}
            are calculated in code from the 16 answers you confirmed on the
            review screen (0–3 per item). AI may have drafted those answers from
            your story — you had the final say.
          </p>
          <p>
            <strong className="text-foreground">Care level and provider ranking</strong>{" "}
            use those scores plus your profile (insurance, concern, location,
            format).
          </p>
          {hasStory ? (
            <p>
              <strong className="text-foreground">Your story</strong> is only used
              to personalize the plain-language summary and crisis checks — not
              for instrument totals.
            </p>
          ) : null}
          <p>
            This is a screening tool, not a diagnosis. A licensed clinician
            should interpret results in context.
          </p>
        </div>
      )}
    </div>
  );
}
