import { cn } from "@/lib/utils";

type AlertVariant = "default" | "warning" | "destructive" | "info";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const variantClasses: Record<AlertVariant, string> = {
  default: "border-border bg-surface text-foreground",
  warning: "border-warning/30 bg-amber-50 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100",
  destructive: "border-destructive/30 bg-rose-50 text-rose-900 dark:bg-rose-950/20 dark:text-rose-100",
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
