"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function subscribeMounted() {
  return () => {};
}

function getMountedSnapshot() {
  return true;
}

function getMountedServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Toggle color theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors",
        "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {!mounted || !isDark ? (
        <MoonIcon className="size-5" />
      ) : (
        <SunIcon className="size-5" />
      )}
    </button>
  );
}
