import { describe, expect, it } from "vitest";
import { buildDeterministicPlan } from "@/lib/planner";
import type { AirQualitySnapshot, LifestyleInput } from "@/lib/types";

function makeInput(overrides: Partial<LifestyleInput> = {}): LifestyleInput {
  return {
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
    ...overrides,
  };
}

function makeAirQuality(usAqi: number): AirQualitySnapshot {
  return {
    location: {
      name: "Delhi",
      country: "India",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
    },
    observedAt: "2026-11-25T10:00",
    usAqi,
    pollutants: { pm2_5: 90, pm10: 150, no2: 20, so2: 5, o3: 30, co: 500 },
    hourly: [
      { time: "2026-11-25T10:00", usAqi: usAqi },
      { time: "2026-11-25T11:00", usAqi: usAqi - 20 },
      { time: "2026-11-25T12:00", usAqi: usAqi - 40 },
    ],
  };
}

describe("buildDeterministicPlan", () => {
  it("recommends maintaining routine on Good air quality", () => {
    const plan = buildDeterministicPlan(makeInput(), makeAirQuality(30));
    expect(plan.categoryInfo.category).toBe("good");
    expect(plan.routines.some((r) => r.title.includes("Maintain"))).toBe(true);
  });

  it("escalates to indoor-exercise guidance on Unhealthy air quality", () => {
    const plan = buildDeterministicPlan(makeInput(), makeAirQuality(170));
    expect(plan.categoryInfo.category).toBe("unhealthy");
    expect(
      plan.routines.some((r) => r.title.includes("indoors") && r.priority === "high")
    ).toBe(true);
  });

  it("flags elevated risk for children and respiratory conditions", () => {
    const plan = buildDeterministicPlan(
      makeInput({
        household: {
          adults: 1,
          children: 2,
          elderly: 1,
          hasRespiratoryCondition: true,
          hasPregnantMember: false,
        },
      }),
      makeAirQuality(160)
    );

    const childRisk = plan.riskAssessments.find((r) => r.memberLabel === "Children");
    const respiratoryRisk = plan.riskAssessments.find((r) =>
      r.memberLabel.includes("respiratory")
    );
    expect(childRisk?.riskLevel).not.toBe("low");
    expect(respiratoryRisk?.riskLevel).toBe("severe");
  });

  it("suggests carpool and public transport swaps for solo car commuters", () => {
    const plan = buildDeterministicPlan(
      makeInput({ commute: "car_solo" }),
      makeAirQuality(80)
    );
    const titles = plan.sustainableSwaps.map((s) => s.title);
    expect(titles).toContain("Carpool for your commute");
    expect(titles).toContain("Switch to public transport");
    expect(plan.sustainableSwaps.every((s) => s.co2ReductionKgPerWeek > 0)).toBe(true);
  });

  it("suggests no commute swaps for someone already working from home", () => {
    const plan = buildDeterministicPlan(
      makeInput({ commute: "work_from_home" }),
      makeAirQuality(80)
    );
    expect(plan.sustainableSwaps).toHaveLength(0);
  });

  it("computes an impact estimate with a positive exposure reduction when action is needed", () => {
    const plan = buildDeterministicPlan(
      makeInput({ commute: "car_solo" }),
      makeAirQuality(170)
    );
    expect(plan.impact.exposureReductionPct).toBeGreaterThan(0);
    expect(plan.impact.improvedWeeklyPm25ExposureIndex).toBeLessThanOrEqual(
      plan.impact.currentWeeklyPm25ExposureIndex
    );
  });

  it("selects the three cleanest upcoming hours as best windows", () => {
    const plan = buildDeterministicPlan(makeInput(), makeAirQuality(170));
    expect(plan.bestWindows).toHaveLength(3);
    expect(plan.bestWindows[0].usAqi).toBeLessThanOrEqual(plan.bestWindows[1].usAqi);
  });
});
