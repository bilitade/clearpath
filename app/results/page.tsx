"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { JourneyProgress } from "@/components/journey/journey-progress";
import { ScreeningDisclaimer } from "@/components/shared/screening-disclaimer";
import { HowResultsWork } from "@/components/results/how-results-work";
import { ClinicalProfileCard } from "@/components/results/clinical-profile-card";
import { ProviderCard } from "@/components/results/provider-card";
import { SafetySupportCard } from "@/components/shared/safety-support-card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  getStoredResultsSnapshot,
  subscribeToStoredResults,
  type StoredResults,
} from "@/lib/storage/client-storage";
import type { ProviderMatchEntry } from "@/lib/types";
import { CONCERN_OPTIONS } from "@/lib/types";

function useStoredResults(): StoredResults | null {
  return useSyncExternalStore(
    subscribeToStoredResults,
    getStoredResultsSnapshot,
    () => null,
  );
}

function toMatchEntries(
  match: StoredResults["match"],
): ProviderMatchEntry[] {
  if (match.matches?.length) return match.matches;
  return match.providers.map((provider, i) => ({
    provider,
    fitScore: 90 - i * 5,
    matchReasons: [match.rationale],
  }));
}

export default function ResultsPage() {
  const router = useRouter();
  const results = useStoredResults();

  useEffect(() => {
    if (results === null) {
      router.replace("/welcome");
    }
  }, [results, router]);

  if (results === null) {
    return (
      <PageShell compact>
        <p className="text-sm text-muted">Loading your results…</p>
      </PageShell>
    );
  }

  const { score, match, summary, context } = results;
  const matches = toMatchEntries(match);
  const concernLabel =
    CONCERN_OPTIONS.find((c) => c.id === context.concern)?.label ??
    context.concern;

  return (
    <PageShell compact className="max-w-6xl">
      <div className="space-y-5 print:space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3 no-print">
          <div className="space-y-3 min-w-0 flex-1">
            <JourneyProgress current="matches" />
            <div>
              <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                Your care plan
              </h1>
              <p className="text-sm text-muted mt-0.5">
                Profile, screening, and matched providers
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print / Save
          </Button>
        </div>

        <ScreeningDisclaimer />

        {score.isCrisis && <SafetySupportCard variant="results" />}

        <HowResultsWork hasStory={Boolean(context.optionalContext)} />

        {score.isUrgent && (
          <Alert variant="warning">
            Higher distress detected — consider expedited care (not a crisis emergency).
          </Alert>
        )}

        {match.fallback === "community_resources" ? (
          <>
            <ClinicalProfileCard
              profile={context}
              score={score}
              summary={summary}
              compact
            />
            <Alert variant="info">
              <p className="font-medium">No in-network matches found</p>
              <p className="mt-1 text-sm">
                Try{" "}
                <a
                  href="https://www.samhsa.gov/find-help/helplines"
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SAMHSA (1-800-662-4357)
                </a>{" "}
                or your insurer near ZIP {context.zip}.
              </p>
            </Alert>
          </>
        ) : (
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] xl:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
            <ClinicalProfileCard
              profile={context}
              score={score}
              summary={summary}
              compact
              className="min-w-0 w-full"
            />

            <section className="min-w-0 w-full space-y-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Matched providers
                </h2>
                <p className="text-xs text-muted mt-0.5">{match.rationale}</p>
              </div>

              <div className="space-y-3">
                {matches.map((entry, i) => (
                  <ProviderCard
                    key={entry.provider.id}
                    match={entry}
                    rank={i + 1}
                    patientConcern={concernLabel}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 no-print pt-1 w-full max-w-xs">
          <Link
            href="/"
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface"
          >
            Back to home
          </Link>
          <Link
            href="/welcome"
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Start over
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
