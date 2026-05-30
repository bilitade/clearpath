"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Button } from "./button";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { theme, setTheme, resolvedTheme } = useTheme();
  const active = theme === "system" ? resolvedTheme : theme;

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Toggle theme" disabled>
        Theme
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`Switch to ${active === "dark" ? "light" : "dark"} mode`}
      onClick={() => setTheme(active === "dark" ? "light" : "dark")}
    >
      {active === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
