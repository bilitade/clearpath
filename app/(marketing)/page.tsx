import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

const features = [
  {
    title: "Validated screening",
    description:
      "PHQ-9 and GAD-7 delivered one question at a time — clinically standard, easy to complete.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Safe triage",
    description:
      "Deterministic scoring, care-level guidance, and crisis detection built into every step.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Matched providers",
    description:
      "Ranked shortlist by specialty, insurance, format, wait time, and estimated cost.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: "01",
    title: "Share basics",
    description: "ZIP, insurance, and what you'd like help with — three fields, under a minute.",
  },
  {
    step: "02",
    title: "Complete screening",
    description: "16 guided questions about the last two weeks. Tap your answer — no typing required.",
  },
  {
    step: "03",
    title: "Get your shortlist",
    description: "See your care level, screening summary, and up to three matched providers.",
  },
];

export default function LandingPage() {
  return (
    <PageShell flush className="max-w-none">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-muted/80 via-background to-background dark:from-primary-muted/20"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
            <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary-muted/60 px-3 py-1 text-xs font-medium text-primary dark:text-primary">
              Mental health navigation
            </p>
            <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              From &ldquo;I need help&rdquo; to the right providers in minutes
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              ClearPath guides you through validated PHQ-9 and GAD-7 screening,
              recommends an appropriate level of care, and surfaces a ranked
              shortlist matched to your insurance and concern.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/onboarding"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
              >
                Start free screening
              </Link>
              <Link
                href="/crisis"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background/80 px-8 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-surface"
              >
                I need crisis help
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted sm:text-sm">
              ~5 min · No account · Screening, not diagnosis
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-primary/30 hover:bg-surface sm:p-7"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-muted text-primary">
                {feature.icon}
              </div>
              <h2 className="mt-4 text-base font-semibold text-foreground sm:text-lg">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-border bg-surface/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Three steps from intake to a actionable provider shortlist.
            </p>
          </div>

          <ol className="mx-auto mt-10 grid max-w-4xl gap-8 sm:mt-12 lg:grid-cols-3 lg:gap-6">
            {steps.map((item, index) => (
              <li key={item.step} className="relative flex flex-col">
                {index < steps.length - 1 && (
                  <span
                    className="absolute left-[1.125rem] top-10 hidden h-px w-[calc(100%+1.5rem)] bg-border lg:block"
                    aria-hidden
                  />
                )}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary-muted text-xs font-bold text-primary">
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-muted/80 to-surface px-6 py-10 text-center sm:px-10 sm:py-12 dark:from-primary-muted/30 dark:to-surface">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Ready to find the right care?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Start with a short, guided screening. We&apos;ll help you understand
            your options and connect you with providers that fit.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:h-12 sm:text-base"
          >
            Begin screening
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
