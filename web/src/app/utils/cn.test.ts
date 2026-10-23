import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("should merge simple class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("should handle conditional class names", () => {
    const isVisible = true;
    const isHidden = false;
    expect(cn("px-2", isHidden && "py-1", isVisible && "text-white")).toBe("px-2 text-white");
  });

  it("should resolve conflicting Tailwind utility classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle undefined, null, and empty inputs", () => {
    expect(cn("base-class", undefined, null, false, "")).toBe("base-class");
  });

  it("should support array and object inputs via clsx", () => {
    expect(cn(["p-4", "m-2"], { "bg-red-500": true, "text-hidden": false })).toBe(
      "p-4 m-2 bg-red-500"
    );
  });
});
