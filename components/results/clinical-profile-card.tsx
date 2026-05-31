import {
  CONCERN_OPTIONS,
  FORMAT_OPTIONS,
  INSURANCE_OPTIONS,
  type PatientProfile,
  type ScoreResult,
} from "@/lib/types";
import { CARE_LEVEL_LABELS } from "@/lib/screening/scoring";
import { getScreeningResultsBullets } from "@/lib/screening/screening-summary";
import { CareLevelBadge } from "@/components/results/care-level-badge";
import { cn } from "@/lib/utils";

interface ClinicalProfileCardProps {
  profile: PatientProfile;
  score: ScoreResult;
  summary?: string;
  compact?: boolean;
  className?: string;
}

function label(
  options: readonly { id: string; label: string }[],
  id: string,
) {
  return options.find((o) => o.id === id)?.label ?? id;
}

export function ClinicalProfileCard({
  profile,
  score,
  summary,
  compact,
  className,
}: ClinicalProfileCardProps) {
  const screeningBullets = getScreeningResultsBullets(score);

  if (compact) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-surface/40 p-4 space-y-4 print:break-inside-avoid",
          className,
        )}
      >
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Clinical profile
          </h2>
          <p className="text-xs text-muted">Screening only — not a diagnosis</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg border border-border bg-background px-2 py-2">
            <p className="text-[0.65rem] uppercase text-muted">PHQ-9</p>
            <p className="text-xl font-semibold">{score.phq9Total}</p>
            <p className="text-[0.65rem] capitalize text-muted">
              / 27 · {score.phq9Band.replace("_", " ")}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-2 py-2">
            <p className="text-[0.65rem] uppercase text-muted">GAD-7</p>
            <p className="text-xl font-semibold">{score.gad7Total}</p>
            <p className="text-[0.65rem] capitalize text-muted">
              / 21 · {score.gad7Band}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted mb-2">
            Screening results
          </p>
          <ul className="space-y-2 text-xs leading-relaxed text-foreground">
            {screeningBullets.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <CareLevelBadge careLevel={score.careLevel} />
          <p className="mt-1.5 text-xs text-muted">
            {CARE_LEVEL_LABELS[score.careLevel]}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs border-t border-border pt-3">
          <div>
            <dt className="text-muted">Focus</dt>
            <dd className="text-foreground">{label(CONCERN_OPTIONS, profile.concern)}</dd>
          </div>
          <div>
            <dt className="text-muted">Insurance</dt>
            <dd className="text-foreground truncate">{label(INSURANCE_OPTIONS, profile.insurance)}</dd>
          </div>
          <div>
            <dt className="text-muted">Format</dt>
            <dd className="text-foreground">{label(FORMAT_OPTIONS, profile.formatPreference)}</dd>
          </div>
          <div>
            <dt className="text-muted">ZIP</dt>
            <dd className="text-foreground">{profile.zip}</dd>
          </div>
        </dl>

        {summary && (
          <div className="border-t border-border pt-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted mb-1.5">
              Personalized note
            </p>
            <p className="text-xs leading-relaxed text-foreground">{summary}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface/40 p-5 space-y-5 print:break-inside-avoid">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Your clinical profile</h2>
        <p className="text-sm text-muted">Screening summary — not a diagnosis</p>
      </div>
      {summary && (
        <p className="text-sm leading-relaxed text-foreground">{summary}</p>
      )}
    </div>
  );
}
