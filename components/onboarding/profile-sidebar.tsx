import { cn } from "@/lib/utils";
import {
  CONCERN_OPTIONS,
  FORMAT_OPTIONS,
  INSURANCE_OPTIONS,
  type PatientProfile,
} from "@/lib/types";

interface ProfileSidebarProps {
  profile: Partial<PatientProfile>;
  className?: string;
}

function label(
  options: readonly { id: string; label: string }[],
  id?: string,
) {
  if (!id) return null;
  return options.find((o) => o.id === id)?.label ?? id;
}

export function ProfileSidebar({ profile, className }: ProfileSidebarProps) {
  const rows = [
    { key: "Location", value: profile.zip ? `ZIP ${profile.zip}` : null },
    {
      key: "Coverage",
      value: label(INSURANCE_OPTIONS, profile.insurance),
    },
    {
      key: "Focus",
      value: label(CONCERN_OPTIONS, profile.concern),
    },
    {
      key: "Format",
      value: label(FORMAT_OPTIONS, profile.formatPreference),
    },
  ].filter((r) => r.value);

  return (
    <aside
      className={cn(
        "rounded-xl border border-border bg-surface/80 p-4 sm:p-5",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-foreground">Your profile</h2>
      <p className="mt-1 text-xs text-muted">
        Used to personalize screening and provider matches.
      </p>
      {rows.length === 0 ? (
        <p className="mt-4 text-xs text-muted italic">
          Details will appear as you complete each step.
        </p>
      ) : (
        <dl className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.key}>
              <dt className="text-[0.65rem] font-medium uppercase tracking-wide text-muted">
                {row.key}
              </dt>
              <dd className="mt-0.5 text-sm text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {profile.optionalContext && (
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted line-clamp-3">
          &ldquo;{profile.optionalContext}&rdquo;
        </p>
      )}
    </aside>
  );
}
