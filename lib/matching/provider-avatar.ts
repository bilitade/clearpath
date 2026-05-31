import type { Provider } from "@/lib/types";

const COMPANY_PATTERN =
  /\b(group|health|harbor|path|center|wellness|online|behavioral|therapy group|mental health)\b/i;

export function getProviderImageType(provider: Provider): "person" | "company" {
  if (provider.imageType) return provider.imageType;
  if (provider.name.startsWith("Dr.")) return "person";
  return COMPANY_PATTERN.test(provider.name) ? "company" : "person";
}

export function getProviderAvatarUrl(provider: Provider): string {
  if (provider.imageUrl) return provider.imageUrl;

  const seed = encodeURIComponent(provider.id);
  const type = getProviderImageType(provider);

  if (type === "company") {
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=0d9488,e0f2f1,99f6e4`;
  }

  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=c0f0ea,0d9488,f0fdfa`;
}

export function getProviderInitials(name: string): string {
  const cleaned = name.replace(/^Dr\.\s*/i, "").trim();
  const parts = cleaned.split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}
