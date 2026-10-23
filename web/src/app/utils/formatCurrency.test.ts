import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("should format positive number as BRL currency", () => {
    const formatted = formatCurrency(1234.56).replace(/\u00a0/g, " ");
    expect(formatted).toBe("R$ 1.234,56");
  });

  it("should format zero correctly", () => {
    const formatted = formatCurrency(0).replace(/\u00a0/g, " ");
    expect(formatted).toBe("R$ 0,00");
  });

  it("should format negative numbers correctly", () => {
    const formatted = formatCurrency(-500.5).replace(/\u00a0/g, " ");
    expect(formatted).toMatch(/-R\$\s*500,50|R\$\s*-500,50/);
  });

  it("should round to 2 decimal places", () => {
    const formatted = formatCurrency(10.556).replace(/\u00a0/g, " ");
    expect(formatted).toBe("R$ 10,56");
  });
});
