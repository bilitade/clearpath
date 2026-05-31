"use client";

import { useState } from "react";
import {
  getProviderAvatarUrl,
  getProviderImageType,
  getProviderInitials,
} from "@/lib/matching/provider-avatar";
import type { Provider } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProviderAvatarProps {
  provider: Provider;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "size-12 text-sm",
  md: "size-16 text-base",
  lg: "size-20 text-lg",
};

export function ProviderAvatar({
  provider,
  size = "md",
  className,
}: ProviderAvatarProps) {
  const [failed, setFailed] = useState(false);
  const type = getProviderImageType(provider);
  const initials = getProviderInitials(provider.name);

  if (!failed) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl border border-border bg-surface",
          sizes[size],
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getProviderAvatarUrl(provider)}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
        <span
          className="absolute bottom-0 right-0 rounded-tl-md bg-background/90 px-1 py-0.5 text-[0.6rem] font-medium uppercase text-muted"
          aria-hidden
        >
          {type === "company" ? "Clinic" : "Provider"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border bg-primary-muted font-semibold text-primary",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
