import { describe, it, expect } from "vitest";
import { currencyStringToNumber } from "./currencyStringToNumber";

describe("currencyStringToNumber", () => {
  it("should return the number directly when given a numeric value", () => {
    expect(currencyStringToNumber(100)).toBe(100);
    expect(currencyStringToNumber(12.5)).toBe(12.5);
    expect(currencyStringToNumber(0)).toBe(0);
  });

  it("should parse an integer string to a number", () => {
    expect(currencyStringToNumber("100")).toBe(100);
    expect(currencyStringToNumber("0")).toBe(0);
  });

  it("should parse Brazilian currency decimal strings with comma", () => {
    expect(currencyStringToNumber("12,50")).toBe(12.5);
    expect(currencyStringToNumber("0,99")).toBe(0.99);
  });

  it("should parse Brazilian currency strings with thousand dots and decimal comma", () => {
    expect(currencyStringToNumber("1.234,56")).toBe(1234.56);
    expect(currencyStringToNumber("1.000.000,50")).toBe(1000000.5);
  });
});
