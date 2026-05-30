import { describe, expect, it } from "vitest";
import { deriveCareLevel } from "@/lib/scoring";

describe("deriveCareLevel", () => {
  it("crisis takes precedence over urgent", () => {
    expect(deriveCareLevel("severe", "severe", true, true)).toBe("crisis");
  });

  it("urgent when not crisis", () => {
    expect(deriveCareLevel("severe", "severe", false, true)).toBe("urgent");
  });

  it("psychiatry for severe non-urgent", () => {
    expect(deriveCareLevel("severe", "minimal", false, false)).toBe("psychiatry");
  });

  it("therapy for moderate", () => {
    expect(deriveCareLevel("moderate", "minimal", false, false)).toBe("therapy");
  });
});
