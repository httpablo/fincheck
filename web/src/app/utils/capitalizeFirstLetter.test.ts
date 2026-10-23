import { describe, it, expect } from "vitest";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first character of a lowercase string", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
    expect(capitalizeFirstLetter("fincheck")).toBe("Fincheck");
  });

  it("should keep already capitalized strings intact", () => {
    expect(capitalizeFirstLetter("Hello")).toBe("Hello");
  });

  it("should handle a single lowercase character", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
  });

  it("should handle an empty string", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("should not modify strings starting with numbers or special characters", () => {
    expect(capitalizeFirstLetter("123abc")).toBe("123abc");
    expect(capitalizeFirstLetter("@test")).toBe("@test");
  });
});
