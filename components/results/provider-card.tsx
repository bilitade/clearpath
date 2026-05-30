import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Provider } from "@/lib/types";

interface ProviderCardProps {
  provider: Provider;
  rank: number;
}

export function ProviderCard({ provider, rank }: ProviderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{provider.name}</CardTitle>
          <Badge variant="default">#{rank}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium text-foreground">Specialties: </span>
          <span className="text-muted capitalize">
            {provider.specialties.join(", ")}
          </span>
        </p>
        <p>
          <span className="font-medium text-foreground">Insurance: </span>
          <span className="text-muted capitalize">
            {provider.insurances.join(", ")}
          </span>
        </p>
        <p>
          <span className="font-medium text-foreground">Format: </span>
          <span className="text-muted">
            {provider.format
              .map((f) => (f === "tele" ? "Telehealth" : "In-person"))
              .join(", ")}
          </span>
        </p>
        <p>
          <span className="font-medium text-foreground">Est. wait: </span>
          <span className="text-muted">{provider.estWaitDays} days</span>
        </p>
        <p>
          <span className="font-medium text-foreground">Cost: </span>
          <span className="text-muted">{provider.costEstimate}</span>
        </p>
      </CardContent>
    </Card>
  );
}
