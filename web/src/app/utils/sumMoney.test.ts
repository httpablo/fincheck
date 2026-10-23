import { describe, it, expect } from "vitest";
import { sumMoney, subtractMoney } from "./sumMoney";

describe("sumMoney", () => {
  it("should sum 0.1 + 0.2 to exact 0.3 without floating point residue", () => {
    // In standard IEEE 754 float: 0.1 + 0.2 = 0.30000000000000004
    expect(sumMoney([0.1, 0.2])).toBe(0.3);
  });

  it("should sum 1520.2 + 0.1 without floating point residue", () => {
    // In standard IEEE 754 float: 1520.2 + 0.1 = 1520.3000000000002
    expect(sumMoney([1520.2, 0.1])).toBe(1520.3);
  });

  it("should return 0 when given an empty list", () => {
    expect(sumMoney([])).toBe(0);
  });

  it("should handle negative values correctly", () => {
    expect(sumMoney([-0.1, -0.2])).toBe(-0.3);
    expect(sumMoney([100, -30.5, -20.25])).toBe(49.25);
    expect(sumMoney([-100, 50])).toBe(-50);
    expect(sumMoney([-50, 50])).toBe(0);
  });

  it("should sum multiple values with cents precision", () => {
    expect(sumMoney([10.25, 20.35, 30.4])).toBe(61);
    expect(sumMoney([0.01, 0.02, 0.03, 0.04])).toBe(0.1);
  });
});

describe("subtractMoney", () => {
  it("should subtract 0.3 - 0.1 to exact 0.2 without floating point residue", () => {
    // In standard IEEE 754 float: 0.3 - 0.1 = 0.19999999999999998
    expect(subtractMoney(0.3, 0.1)).toBe(0.2);
  });

  it("should subtract 1520.3 - 0.1 to exact 1520.2 without floating point residue", () => {
    // In standard IEEE 754 float: 1520.3 - 0.1 = 1520.1999999999998
    expect(subtractMoney(1520.3, 0.1)).toBe(1520.2);
  });

  it("should handle subtraction resulting in zero or negative values", () => {
    expect(subtractMoney(50, 50)).toBe(0);
    expect(subtractMoney(50, 100)).toBe(-50);
    expect(subtractMoney(-10, -5)).toBe(-5);
  });
});
