"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { nanoid } from "nanoid";
import { PageShell } from "@/components/layout/page-shell";
import { ScreeningDisclaimer } from "@/components/shared/screening-disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  setOnboardingContext,
  setSessionId,
} from "@/lib/client-storage";
import {
  CONCERN_OPTIONS,
  INSURANCE_OPTIONS,
  type Concern,
  type OnboardingContext,
} from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [insurance, setInsurance] = useState("aetna");
  const [concern, setConcern] = useState<Concern>("anxiety");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    const context: OnboardingContext = { zip, insurance, concern };
    const sessionId = nanoid();
    setSessionId(sessionId);
    setOnboardingContext(context);
    router.push("/intake");
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Tell us a bit about you
          </h1>
          <p className="text-sm text-muted">
            Three quick fields help us match providers. Nothing is stored beyond
            this session.
          </p>
        </div>

        <ScreeningDisclaimer />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP code</Label>
            <Input
              id="zip"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              placeholder="02139"
              value={zip}
              onChange={(e) => {
                setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
                setError("");
              }}
              required
              aria-invalid={Boolean(error)}
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

          <div className="space-y-2">
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

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full">
            Start screening
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
