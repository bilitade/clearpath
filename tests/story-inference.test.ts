import { describe, expect, it } from "vitest";
import {
  getAllReviewItems,
  normalizeStorySuggestions,
} from "@/lib/ai/story-inference";

describe("story inference", () => {
  it("lists 16 review items", () => {
    expect(getAllReviewItems()).toHaveLength(16);
    expect(getAllReviewItems()[8]?.isSafety).toBe(true);
  });

  it("normalizes valid suggestion JSON", () => {
    const items = Array.from({ length: 16 }, (_, globalIndex) => ({
      globalIndex,
      value: 1 as const,
    }));
    const map = normalizeStorySuggestions({ items });
    expect(map).not.toBeNull();
    expect(map![0]).toBe(1);
    expect(map![15]).toBe(1);
  });

  it("rejects incomplete suggestions", () => {
    expect(
      normalizeStorySuggestions({
        items: [{ globalIndex: 0, value: 2 }],
      }),
    ).toBeNull();
  });
});
