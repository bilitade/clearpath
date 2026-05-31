import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { JourneyProgress } from "@/components/journey/journey-progress";
import { ProfileSidebar } from "@/components/onboarding/profile-sidebar";
import type { PatientProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IntakeStepLayoutProps {
  profile: PatientProfile;
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export function IntakeStepLayout({
  profile,
  children,
  className,
  compact,
}: IntakeStepLayoutProps) {
  return (
    <PageShell compact className={cn("max-w-4xl", className)}>
      <div className="space-y-6">
        <JourneyProgress current="screening" />
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className={cn("space-y-5", compact && "space-y-4")}>
            {children}
          </div>
          <ProfileSidebar profile={profile} className="hidden lg:block" />
        </div>
      </div>
    </PageShell>
  );
}
