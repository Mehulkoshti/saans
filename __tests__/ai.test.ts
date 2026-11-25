import { afterEach, describe, expect, it, vi } from "vitest";
import { generateNarrative } from "@/lib/ai";
import type { AirQualitySnapshot, DeterministicPlan, LifestyleInput } from "@/lib/types";

const input: LifestyleInput = {
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

const airQuality: Pick<AirQualitySnapshot, "usAqi" | "pollutants" | "observedAt"> & {
  locationName: string;
} = {
  usAqi: 170,
  pollutants: { pm2_5: 90, pm10: 150, no2: 20, so2: 5, o3: 30, co: 500 },
  observedAt: "2026-11-25T10:00",
  locationName: "Delhi, India",
};

const plan = {} as DeterministicPlan;

describe("generateNarrative", () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;

  afterEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns null when no API key is configured", async () => {
    delete process.env.DEEPSEEK_API_KEY;
    const result = await generateNarrative({ input, airQuality, plan });
    expect(result).toBeNull();
  });

  it("returns null when the API responds with a non-ok status", async () => {
    process.env.DEEPSEEK_API_KEY = "test-key";
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    const result = await generateNarrative({ input, airQuality, plan });
    expect(result).toBeNull();
  });

  it("returns the narrative text on a successful response", async () => {
    process.env.DEEPSEEK_API_KEY = "test-key";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "  Your air today is moderate.  " } }],
      }),
    }) as unknown as typeof fetch;

    const result = await generateNarrative({ input, airQuality, plan });
    expect(result).toBe("Your air today is moderate.");
  });

  it("returns null when fetch throws (timeout/network error)", async () => {
    process.env.DEEPSEEK_API_KEY = "test-key";
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await generateNarrative({ input, airQuality, plan });
    expect(result).toBeNull();
  });

  it("returns null when response content is empty", async () => {
    process.env.DEEPSEEK_API_KEY = "test-key";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: "   " } }] }),
    }) as unknown as typeof fetch;

    const result = await generateNarrative({ input, airQuality, plan });
    expect(result).toBeNull();
  });
});
