import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "warning" | "destructive" | "success";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface text-foreground border border-border",
  primary: "bg-primary-muted text-primary border border-primary/20",
  warning: "bg-amber-50 text-warning border border-warning/20 dark:bg-amber-950/30",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/25 dark:bg-destructive/15",
  success: "bg-emerald-50 text-success border border-success/20 dark:bg-emerald-950/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
