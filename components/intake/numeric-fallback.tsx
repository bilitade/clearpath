"use client";

import { Button } from "@/components/ui/button";
import { SCALE_LABELS } from "@/lib/instruments";

interface NumericFallbackProps {
  onSelect: (value: 0 | 1 | 2 | 3) => void;
  disabled?: boolean;
}

export function NumericFallback({ onSelect, disabled }: NumericFallbackProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
      <p className="text-sm text-muted">
        Please select how often this applied over the last 2 weeks:
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {([0, 1, 2, 3] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSelect(value)}
            className="justify-start text-left h-auto py-2"
          >
            <span className="font-medium mr-2">{value}</span>
            {SCALE_LABELS[value]}
          </Button>
        ))}
      </div>
    </div>
  );
}
