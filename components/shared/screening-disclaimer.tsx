import { Alert } from "@/components/ui/alert";

export function ScreeningDisclaimer() {
  return (
    <Alert variant="info">
      <strong className="font-medium">Screening, not diagnosis.</strong> This
      tool uses validated questionnaires (PHQ-9 and GAD-7) to help guide care
      options. Results are not a medical diagnosis and do not replace
      evaluation by a licensed professional.
    </Alert>
  );
}
