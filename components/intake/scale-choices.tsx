"use client";

import { cn } from "@/lib/utils";
import { SCALE_LABELS } from "@/lib/instruments";

interface ScaleChoicesProps {
  onSelect: (value: 0 | 1 | 2 | 3) => void;
  disabled?: boolean;
}

export function ScaleChoices({ onSelect, disabled }: ScaleChoicesProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {([0, 1, 2, 3] as const).map((value) => (
        <button
          key={value}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(value)}
          className={cn(
            "rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm",
            "transition-colors hover:border-primary/40 hover:bg-primary-muted/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {SCALE_LABELS[value]}
        </button>
      ))}
    </div>
  );
}
