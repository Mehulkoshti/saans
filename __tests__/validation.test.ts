import { describe, expect, it } from "vitest";
import { lifestyleInputSchema } from "@/lib/validation";

const validInput = {
  cityQuery: "Delhi",
  household: {
    adults: 2,
    children: 1,
    elderly: 0,
    hasRespiratoryCondition: false,
    hasPregnantMember: false,
  },
  commute: "car_solo",
  outdoorHoursPerDay: 2,
  hasAirPurifier: false,
  activityLevel: "moderate",
};

describe("lifestyleInputSchema", () => {
  it("accepts a valid payload", () => {
    const result = lifestyleInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects an empty city name", () => {
    const result = lifestyleInputSchema.safeParse({ ...validInput, cityQuery: "D" });
    expect(result.success).toBe(false);
  });

  it("rejects a city name with script-injection-like characters", () => {
    const result = lifestyleInputSchema.safeParse({
      ...validInput,
      cityQuery: "<script>alert(1)</script>",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid commute mode", () => {
    const result = lifestyleInputSchema.safeParse({ ...validInput, commute: "teleport" });
    expect(result.success).toBe(false);
  });

  it("rejects negative household counts", () => {
    const result = lifestyleInputSchema.safeParse({
      ...validInput,
      household: { ...validInput.household, adults: -1 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects outdoor hours above 24", () => {
    const result = lifestyleInputSchema.safeParse({ ...validInput, outdoorHoursPerDay: 30 });
    expect(result.success).toBe(false);
  });
});
