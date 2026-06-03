"use client";

import { ProviderAvatar } from "@/components/results/provider-avatar";
import { Badge } from "@/components/ui/badge";
import { PROVIDER_DATA_LAST_UPDATED } from "@/data/provider-meta";
import type { ProviderMatchEntry } from "@/lib/types";
import { INSURANCE_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatInsuranceList(insuranceIds: string[]): string {
  return insuranceIds
    .map((id) => INSURANCE_OPTIONS.find((o) => o.id === id)?.label ?? id)
    .join(", ");
}

interface ProviderCardProps {
  match: ProviderMatchEntry;
  rank: number;
  patientConcern?: string;
}

export function ProviderCard({ match, rank, patientConcern }: ProviderCardProps) {
  const { provider, fitScore, matchReasons, gaps } = match;
  const tel = provider.phone?.replace(/\D/g, "");
  const isTop = rank === 1;

  const formatLabel = provider.format
    .map((f) => (f === "tele" ? "Telehealth" : "In-person"))
    .join(" · ");

  return (
    <article
      className={cn(
        "rounded-xl border bg-surface/40 p-3 print:break-inside-avoid",
        isTop ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
      )}
    >
      <div className="flex gap-3">
        <ProviderAvatar provider={provider} size="md" />

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={isTop ? "primary" : "default"}>#{rank}</Badge>
            <Badge variant="success">{fitScore}%</Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold leading-snug text-foreground">
              {provider.name}
            </h3>
            {provider.credentials && (
              <p className="text-[0.65rem] text-muted">{provider.credentials}</p>
            )}
          </div>

          <p className="text-[0.65rem] text-muted line-clamp-2 leading-snug">
            {formatLabel} · ~{provider.estWaitDays}d · {provider.costEstimate}
          </p>

          <p className="text-[0.65rem] text-muted line-clamp-2 leading-snug">
            Insurance accepted: {formatInsuranceList(provider.insurances)}
          </p>

          {patientConcern && (
            <p className="text-[0.65rem] text-muted line-clamp-1">
              <span className="text-foreground">{patientConcern}</span>
              <span className="mx-1 text-border">→</span>
              <span className="capitalize">{provider.specialties.slice(0, 2).join(", ")}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {matchReasons.slice(0, 2).map((reason) => (
              <span
                key={reason}
                className="rounded-full bg-primary-muted px-1.5 py-0.5 text-[0.6rem] font-medium text-primary line-clamp-1"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>
      </div>

      {(gaps?.length ?? 0) > 0 && (
        <p className="mt-1.5 text-[0.65rem] text-warning">{gaps![0]}</p>
      )}

      <p className="mt-2 text-[0.6rem] leading-snug text-muted">
        Verify availability, insurance, and credentials before booking. Sample
        data last updated {PROVIDER_DATA_LAST_UPDATED}.
      </p>

      <div className="mt-2.5 flex gap-1.5 no-print">
        {tel && (
          <a
            href={`tel:${tel}`}
            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-primary px-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Call
          </a>
        )}
        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-border px-2 text-xs font-medium hover:bg-surface"
          >
            Website
          </a>
        )}
      </div>
    </article>
  );
}
