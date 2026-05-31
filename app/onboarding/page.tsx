"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { nanoid } from "nanoid";
import { PageShell } from "@/components/layout/page-shell";
import { JourneyProgress } from "@/components/journey/journey-progress";
import { ProfileSidebar } from "@/components/onboarding/profile-sidebar";
import { ScreeningDisclaimer } from "@/components/shared/screening-disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { setPatientProfile, setSessionId } from "@/lib/storage/client-storage";
import {
  CONCERN_OPTIONS,
  FORMAT_OPTIONS,
  INSURANCE_OPTIONS,
  type Concern,
  type FormatPreference,
  type PatientProfile,
} from "@/lib/types";

const STEPS = [
  { id: "access", title: "Location & coverage" },
  { id: "concern", title: "What you need help with" },
  { id: "preferences", title: "Care preferences" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [zip, setZip] = useState("");
  const [insurance, setInsurance] = useState("aetna");
  const [concern, setConcern] = useState<Concern>("anxiety");
  const [formatPreference, setFormatPreference] =
    useState<FormatPreference>("either");

  const profile: Partial<PatientProfile> = {
    zip: zip.length === 5 ? zip : undefined,
    insurance,
    concern,
    formatPreference,
  };

  function validateStep(): boolean {
    setError("");
    if (step === 0 && !/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    void handleFinish();
  }

  async function handleFinish() {
    if (!validateStep()) return;
    setLoading(true);
    setError("");

    try {
      const fullProfile: PatientProfile = {
        zip,
        insurance,
        concern,
        formatPreference,
      };

      setSessionId(nanoid());
      setPatientProfile(fullProfile);
      router.push("/intake");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell compact className="max-w-4xl">
      <div className="space-y-6">
        <JourneyProgress current="profile" />

        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium text-primary">
                Step 1 of 4 · Your profile
              </p>
              <h1 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
                {STEPS[step]!.title}
              </h1>
            </div>

            <ScreeningDisclaimer />

            <div className="rounded-xl border border-border bg-surface/60 p-4 sm:p-6">
              {step === 0 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP code</Label>
                    <Input
                      id="zip"
                      inputMode="numeric"
                      placeholder="02139"
                      maxLength={5}
                      value={zip}
                      onChange={(e) =>
                        setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance</Label>
                    <Select
                      id="insurance"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                    >
                      {INSURANCE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <Label htmlFor="concern">Primary concern</Label>
                  <Select
                    id="concern"
                    value={concern}
                    onChange={(e) => setConcern(e.target.value as Concern)}
                  >
                    {CONCERN_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <Label>How would you like to receive care?</Label>
                  <div className="grid gap-2">
                    {FORMAT_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                          formatPreference === opt.id
                            ? "border-primary bg-primary-muted"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={opt.id}
                          checked={formatPreference === opt.id}
                          onChange={() =>
                            setFormatPreference(opt.id as FormatPreference)
                          }
                          className="accent-primary"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className={`flex gap-2 ${step > 0 ? "justify-stretch" : ""}`}>
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="flex-1 sm:flex-none sm:min-w-[6.5rem]"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                className="flex-1 sm:flex-none sm:min-w-[6.5rem]"
                size="md"
                onClick={handleNext}
                disabled={loading}
              >
                {loading
                  ? "Saving…"
                  : step === STEPS.length - 1
                    ? "Continue to your story"
                    : "Continue"}
              </Button>
            </div>
          </div>

          <ProfileSidebar profile={profile} className="hidden lg:block" />
        </div>
      </div>
    </PageShell>
  );
}
