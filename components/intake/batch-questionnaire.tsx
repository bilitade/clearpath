"use client";

import { cn } from "@/lib/utils";
import { SCALE_LABELS } from "@/lib/intake/instruments";

const SHORT_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
};

interface ScaleRowProps {
  value?: 0 | 1 | 2 | 3;
  onChange: (value: 0 | 1 | 2 | 3) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function ScaleRow({ value, onChange, disabled, compact }: ScaleRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-1 sm:gap-1.5",
        compact && "sm:grid-cols-4",
      )}
      role="group"
    >
      {([0, 1, 2, 3] as const).map((v) => (
        <button
          key={v}
          type="button"
          disabled={disabled}
          title={SCALE_LABELS[v]}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-md border px-1 py-2 text-center text-xs transition-colors sm:py-2.5 sm:text-[0.8125rem]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === v
              ? "border-primary bg-primary-muted font-medium text-primary"
              : "border-border bg-background text-muted hover:border-primary/30 hover:text-foreground",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          <span className="block font-semibold text-foreground">{SHORT_LABELS[v]}</span>
          <span className="mt-0.5 hidden leading-tight sm:block">
            {SCALE_LABELS[v]}
          </span>
        </button>
      ))}
    </div>
  );
}

interface BatchQuestionProps {
  index: number;
  text: string;
  isSafety?: boolean;
  value?: 0 | 1 | 2 | 3;
  suggestedValue?: 0 | 1 | 2 | 3;
  onChange: (value: 0 | 1 | 2 | 3) => void;
  disabled?: boolean;
}

export function BatchQuestion({
  index,
  text,
  isSafety,
  value,
  suggestedValue,
  onChange,
  disabled,
}: BatchQuestionProps) {
  const showSuggestion =
    suggestedValue !== undefined && value === suggestedValue;

  return (
    <div
      className={cn(
        "rounded-lg border border-border p-3 sm:p-4",
        isSafety && "border-warning/40 bg-warning/5",
        showSuggestion && "border-primary/30 bg-primary-muted/20",
      )}
    >
      <div className="flex flex-wrap items-start gap-2">
        <p className="text-sm leading-snug text-foreground flex-1 min-w-0">
          <span className="mr-2 font-medium text-muted">{index + 1}.</span>
          {text}
        </p>
        {suggestedValue !== undefined && (
          <span className="shrink-0 text-[0.65rem] font-medium uppercase tracking-wide text-primary px-1.5 py-0.5 rounded bg-primary/10">
            AI draft: {suggestedValue}
          </span>
        )}
      </div>
      <div className="mt-3">
        <ScaleRow value={value} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}
