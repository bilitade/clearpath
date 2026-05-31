"use client";

import { Button } from "@/components/ui/button";
import { SCALE_LABELS } from "@/lib/intake/instruments";
import { cn } from "@/lib/utils";

interface ChapterIntroProps {
  title: string;
  subtitle: string;
  body: string;
  onContinue: () => void;
  className?: string;
}

export function ChapterIntro({
  title,
  subtitle,
  body,
  onContinue,
  className,
}: ChapterIntroProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface/60 p-6 sm:p-8 text-center processing-enter",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        {subtitle}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {body}
      </p>
      <div className="mt-6 rounded-lg border border-border bg-background px-4 py-3 text-left text-xs text-muted">
        <p className="mb-2 font-medium text-foreground">
          For each statement, choose:
        </p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {([0, 1, 2, 3] as const).map((v) => (
            <li key={v}>
              <strong>{v}</strong> — {SCALE_LABELS[v]}
            </li>
          ))}
        </ul>
      </div>
      <Button className="mt-6 w-full sm:w-auto" size="md" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
