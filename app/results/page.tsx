"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ScreeningDisclaimer } from "@/components/shared/screening-disclaimer";
import { CareLevelBadge } from "@/components/results/care-level-badge";
import { ProviderCard } from "@/components/results/provider-card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getStoredResultsSnapshot,
  subscribeToStoredResults,
  type StoredResults,
} from "@/lib/client-storage";

function useStoredResults(): StoredResults | null {
  return useSyncExternalStore(
    subscribeToStoredResults,
    getStoredResultsSnapshot,
    () => null,
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const results = useStoredResults();

  useEffect(() => {
    if (results === null) {
      router.replace("/onboarding");
    }
  }, [results, router]);

  if (results === null) {
    return (
      <PageShell>
        <p className="text-muted">Redirecting...</p>
      </PageShell>
    );
  }

  const { score, match, summary, context } = results;

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-6 print:max-w-none">
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <h1 className="text-2xl font-semibold text-foreground">Your results</h1>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print / Save PDF
          </Button>
        </div>

        <ScreeningDisclaimer />

        <Card>
          <CardHeader>
            <CardTitle>Recommended care level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CareLevelBadge careLevel={score.careLevel} />
            {score.isUrgent && (
              <Alert variant="warning">
                Your responses suggest a higher level of distress. Consider
                expedited care — this is not the same as a crisis emergency.
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Screening scores</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg bg-surface p-3 border border-border">
              <p className="font-medium text-foreground">PHQ-9</p>
              <p className="text-2xl font-semibold">{score.phq9Total}</p>
              <p className="text-muted capitalize">
                {score.phq9Band.replace("_", " ")}
              </p>
            </div>
            <div className="rounded-lg bg-surface p-3 border border-border">
              <p className="font-medium text-foreground">GAD-7</p>
              <p className="text-2xl font-semibold">{score.gad7Total}</p>
              <p className="text-muted capitalize">{score.gad7Band}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground">{summary}</p>
          </CardContent>
        </Card>

        {match.fallback === "community_resources" ? (
          <Alert variant="info">
            <p className="font-medium">No in-network matches found</p>
            <p className="mt-1">
              We couldn&apos;t find providers matching your insurance and concern
              in our directory. Try{" "}
              <a
                href="https://www.samhsa.gov/find-help/helplines"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                SAMHSA&apos;s helpline (1-800-662-4357)
              </a>{" "}
              or contact your insurance member services for in-network options near{" "}
              {context.zip}.
            </p>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Matched providers
              </h2>
              <p className="text-sm text-muted mt-1">{match.rationale}</p>
            </div>
            {match.providers.map((provider, i) => (
              <ProviderCard key={provider.id} provider={provider} rank={i + 1} />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row no-print">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface"
          >
            Back to home
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Start over
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
