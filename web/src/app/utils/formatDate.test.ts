import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("should format date according to pt-BR locale (DD/MM/YYYY)", () => {
    // Note: Month is 0-indexed in JS Date: 9 = October
    const date = new Date(2026, 9, 23);
    expect(formatDate(date)).toBe("23/10/2026");
  });

  it("should pad single digit days and months with leading zeros", () => {
    // 5th of January
    const date = new Date(2026, 0, 5);
    expect(formatDate(date)).toBe("05/01/2026");
  });
});
