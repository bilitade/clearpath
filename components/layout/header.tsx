import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
            aria-hidden
          >
            CP
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            ClearPath
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/crisis"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 sm:inline-block"
          >
            Crisis help
          </Link>
          <Link
            href="/crisis"
            className="rounded-md px-2 py-2 text-xs font-medium text-destructive sm:hidden"
          >
            988
          </Link>
          <ThemeToggle />
          <Link
            href="/welcome"
            className="ml-1 hidden h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
