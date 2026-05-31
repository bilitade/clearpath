"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";

const STEPS = [
  { n: 1, title: "Your profile", detail: "ZIP, insurance, concern, care preferences" },
  {
    n: 2,
    title: "Screening (your choice)",
    detail: "Share a story (AI maps to PHQ-9/GAD-7) or answer the questionnaires directly",
  },
  {
    n: 3,
    title: "Confirm & results",
    detail: "Review AI drafts if you used a story, then scores, matches, and summary",
  },
  {
    n: 4,
    title: "Your care plan",
    detail: "Care pathway, provider shortlist, plain-language summary",
  },
];

export default function WelcomePage() {
  const router = useRouter();

  return (
    <PageShell compact className="max-w-lg">
      <div className="space-y-8 processing-enter">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Your path to care
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            About 10 minutes. After your profile, choose how to complete
            validated screening — story + AI review, or standard questionnaires.
          </p>
        </div>

        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex gap-3 rounded-lg border border-border bg-surface/50 px-4 py-3"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary">
                {s.n}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-xs text-muted mt-0.5">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <Button
          type="button"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => router.push("/onboarding")}
        >
          Get started
        </Button>

        <Link
          href="/crisis"
          className="block text-center text-sm text-muted hover:text-primary"
        >
          Need crisis support now?
        </Link>
      </div>
    </PageShell>
  );
}
