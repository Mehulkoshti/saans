import { describe, expect, it, vi, afterEach } from "vitest";
import { categorizeAqi, categoryRank, fetchAirQuality, geocodeCity } from "@/lib/aqi";
import type { GeocodeResult } from "@/lib/types";

describe("categorizeAqi", () => {
  it("categorizes Good air quality", () => {
    expect(categorizeAqi(25).category).toBe("good");
  });

  it("categorizes Moderate air quality at the boundary", () => {
    expect(categorizeAqi(51).category).toBe("moderate");
    expect(categorizeAqi(100).category).toBe("moderate");
  });

  it("categorizes Unhealthy for Sensitive Groups", () => {
    expect(categorizeAqi(120).category).toBe("unhealthy_sensitive");
  });

  it("categorizes Hazardous for extreme values", () => {
    expect(categorizeAqi(450).category).toBe("hazardous");
  });
});

describe("categoryRank", () => {
  it("ranks good as lowest and hazardous as highest", () => {
    expect(categoryRank("good")).toBeLessThan(categoryRank("hazardous"));
  });
});

describe("geocodeCity", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns null when no results are found", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    }) as unknown as typeof fetch;

    const result = await geocodeCity("Nowhereville");
    expect(result).toBeNull();
  });

  it("returns null on a non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    const result = await geocodeCity("Delhi");
    expect(result).toBeNull();
  });

  it("parses a successful geocode response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            name: "Delhi",
            admin1: "Delhi",
            country: "India",
            latitude: 28.6139,
            longitude: 77.209,
            timezone: "Asia/Kolkata",
          },
        ],
      }),
    }) as unknown as typeof fetch;

    const result = await geocodeCity("Delhi");
    expect(result).toEqual({
      name: "Delhi",
      admin1: "Delhi",
      country: "India",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
    });
  });
});

describe("fetchAirQuality", () => {
  const originalFetch = global.fetch;
  const location: GeocodeResult = {
    name: "Delhi",
    country: "India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
  };

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns null when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    const result = await fetchAirQuality(location);
    expect(result).toBeNull();
  });

  it("returns null when current.us_aqi is missing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ current: {} }),
    }) as unknown as typeof fetch;
    const result = await fetchAirQuality(location);
    expect(result).toBeNull();
  });

  it("parses a valid air quality response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: "2026-11-25T10:00",
          us_aqi: 162.4,
          pm2_5: 88.2,
          pm10: 140.1,
          nitrogen_dioxide: 20.1,
          sulphur_dioxide: 5.3,
          ozone: 30.2,
          carbon_monoxide: 500.5,
        },
        hourly: {
          time: ["2026-11-25T09:00", "2026-11-25T10:00", "2026-11-25T11:00"],
          us_aqi: [170, 162, 155],
        },
      }),
    }) as unknown as typeof fetch;

    const result = await fetchAirQuality(location);
    expect(result).not.toBeNull();
    expect(result?.usAqi).toBe(162);
    expect(result?.pollutants.pm2_5).toBe(88.2);
    expect(result?.hourly.length).toBe(2);
    expect(result?.hourly[0]).toEqual({ time: "2026-11-25T10:00", usAqi: 162 });
  });

  it("anchors the hourly window to the current hour even when current.time has minutes", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: "2026-11-25T12:30",
          us_aqi: 178,
          pm2_5: 80.3,
          pm10: 83.6,
          nitrogen_dioxide: 21.5,
          sulphur_dioxide: 42.3,
          ozone: 162,
          carbon_monoxide: 1033,
        },
        hourly: {
          time: ["2026-11-25T11:00", "2026-11-25T12:00", "2026-11-25T13:00"],
          us_aqi: [176, 178, 179],
        },
      }),
    }) as unknown as typeof fetch;

    const result = await fetchAirQuality(location);
    expect(result?.hourly[0]).toEqual({ time: "2026-11-25T12:00", usAqi: 178 });
    expect(result?.hourly.length).toBe(2);
  });
});
