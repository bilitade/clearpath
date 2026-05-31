import { cn } from "@/lib/utils";
import { Footer } from "./footer";
import { Header } from "./header";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
  compact?: boolean;
}

export function PageShell({ children, className, flush, compact }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className={cn(
          "mx-auto w-full max-w-5xl flex-1",
          flush
            ? "px-0 py-0"
            : compact
              ? "px-4 py-6 sm:px-6"
              : "px-4 py-8 sm:px-6 sm:py-10",
          className,
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
