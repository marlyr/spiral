import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges Tailwind classes with later classes winning", () => {
    expect(cn("px-2", "text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("ignores falsy values while keeping valid class names", () => {
    expect(cn("rounded-md", undefined, false, null, "border")).toBe(
      "rounded-md border",
    );
  });
});
