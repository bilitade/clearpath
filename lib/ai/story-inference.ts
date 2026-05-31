import {
  getQuestionDisplayText,
  getQuestionSection,
  TOTAL_INTAKE_ITEMS,
} from "@/lib/intake/instruments";

export const STORY_MIN_CHARS = 40;
export const STORY_MAX_CHARS = 2000;

export interface ReviewItemDescriptor {
  globalIndex: number;
  text: string;
  section: "mood" | "anxiety";
  isSafety: boolean;
}

export function getAllReviewItems(): ReviewItemDescriptor[] {
  return Array.from({ length: TOTAL_INTAKE_ITEMS }, (_, globalIndex) => ({
    globalIndex,
    text: getQuestionDisplayText(globalIndex),
    section: getQuestionSection(globalIndex),
    isSafety: globalIndex === 8,
  }));
}

export function buildStoryInferenceCatalog(): string {
  const lines: string[] = [];
  for (let i = 0; i < TOTAL_INTAKE_ITEMS; i++) {
    const instrument = getQuestionSection(i) === "mood" ? "PHQ-9" : "GAD-7";
    lines.push(
      `[${i}] (${instrument}) Over the last 2 weeks: ${getQuestionDisplayText(i)}`,
    );
  }
  return lines.join("\n");
}

export type StorySuggestionMap = Record<number, 0 | 1 | 2 | 3>;

export function normalizeStorySuggestions(
  raw: unknown,
): StorySuggestionMap | null {
  if (!raw || typeof raw !== "object") return null;

  const items = (raw as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length === 0) return null;

  const map: StorySuggestionMap = {};
  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;
    const { globalIndex, value } = entry as {
      globalIndex?: unknown;
      value?: unknown;
    };
    if (
      typeof globalIndex !== "number" ||
      globalIndex < 0 ||
      globalIndex >= TOTAL_INTAKE_ITEMS
    ) {
      continue;
    }
    if (value !== 0 && value !== 1 && value !== 2 && value !== 3) continue;
    map[globalIndex] = value;
  }

  if (Object.keys(map).length < TOTAL_INTAKE_ITEMS) return null;
  return map;
}
