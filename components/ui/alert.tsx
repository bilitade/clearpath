import { cn } from "@/lib/utils";

type AlertVariant = "default" | "warning" | "destructive" | "info";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const variantClasses: Record<AlertVariant, string> = {
  default: "border-border bg-surface text-foreground",
  warning:
    "border-warning/30 bg-warning/10 text-foreground dark:bg-warning/15",
  destructive:
    "border-destructive/30 bg-destructive/10 text-foreground dark:bg-destructive/15",
  info: "border-primary/30 bg-primary-muted text-foreground",
};

export function Alert({
  className,
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
