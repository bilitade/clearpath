import { Badge } from "@/components/ui/badge";
import { CARE_LEVEL_LABELS } from "@/lib/screening/scoring";
import type { CareLevel } from "@/lib/types";

interface CareLevelBadgeProps {
  careLevel: CareLevel;
}

const variantMap: Record<
  CareLevel,
  "default" | "primary" | "warning" | "destructive" | "success"
> = {
  self_guided: "success",
  coaching: "primary",
  therapy: "primary",
  psychiatry: "warning",
  urgent: "warning",
  crisis: "destructive",
};

export function CareLevelBadge({ careLevel }: CareLevelBadgeProps) {
  return (
    <Badge variant={variantMap[careLevel]}>
      {CARE_LEVEL_LABELS[careLevel]}
    </Badge>
  );
}
