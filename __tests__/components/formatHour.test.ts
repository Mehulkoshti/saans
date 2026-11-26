import { describe, expect, it } from "vitest";
import { formatHour } from "@/components/wizard/results/formatHour";

describe("formatHour", () => {
  it("formats an ISO timestamp in the given timezone", () => {
    expect(formatHour("2026-11-26T05:00", "Asia/Kolkata")).toMatch(/5:00\s*AM/);
  });

  it("falls back to the raw ISO string for an invalid timezone", () => {
    expect(formatHour("2026-11-26T05:00", "Not/A_Zone")).toBe("2026-11-26T05:00");
  });
});
