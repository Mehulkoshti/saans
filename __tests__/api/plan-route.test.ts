import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/aqi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/aqi")>();
  return {
    ...actual,
    geocodeCity: vi.fn(),
    fetchAirQuality: vi.fn(),
  };
});
vi.mock("@/lib/ai", () => ({
  generateNarrative: vi.fn(),
}));

import { geocodeCity, fetchAirQuality } from "@/lib/aqi";
import { generateNarrative } from "@/lib/ai";
import { POST } from "@/app/api/plan/route";
import type { AirQualitySnapshot, GeocodeResult } from "@/lib/types";

const VALID_BODY = {
  cityQuery: "Delhi",
  household: {
    adults: 2,
    children: 0,
    elderly: 0,
    hasRespiratoryCondition: false,
    hasPregnantMember: false,
  },
  commute: "car_solo",
  outdoorHoursPerDay: 2,
  hasAirPurifier: false,
  activityLevel: "moderate",
};

const LOCATION: GeocodeResult = {
  name: "Delhi",
  admin1: "Delhi",
  country: "India",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
};

const SNAPSHOT: AirQualitySnapshot = {
  location: LOCATION,
  observedAt: "2026-11-26T10:00",
  usAqi: 180,
  pollutants: { pm2_5: 90, pm10: 100, no2: 20, so2: 10, o3: 30, co: 400 },
  hourly: [{ time: "2026-11-26T10:00", usAqi: 180 }],
};

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/plan", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/plan", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an oversized request body before parsing it", async () => {
    const request = new NextRequest("http://localhost/api/plan", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": "999999",
        "x-forwarded-for": `0.0.0.${Date.now() % 255}`,
      },
      body: JSON.stringify(VALID_BODY),
    });

    const response = await POST(request);
    expect(response.status).toBe(413);
  });

  it("rejects an invalid JSON body", async () => {
    const request = new NextRequest("http://localhost/api/plan", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `1.1.1.${Date.now() % 255}`,
      },
      body: "not json",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/invalid json/i);
  });

  it("rejects a body that fails schema validation", async () => {
    const request = makeRequest(
      { cityQuery: "D" },
      { "x-forwarded-for": `2.2.2.${Date.now() % 255}` }
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid input.");
    expect(data.issues).toBeDefined();
  });

  it("returns 404 when the city cannot be geocoded", async () => {
    vi.mocked(geocodeCity).mockResolvedValue(null);
    const request = makeRequest(VALID_BODY, {
      "x-forwarded-for": `3.3.3.${Date.now() % 255}`,
    });

    const response = await POST(request);
    expect(response.status).toBe(404);
  });

  it("returns 502 when air quality data is unavailable", async () => {
    vi.mocked(geocodeCity).mockResolvedValue(LOCATION);
    vi.mocked(fetchAirQuality).mockResolvedValue(null);
    const request = makeRequest(VALID_BODY, {
      "x-forwarded-for": `4.4.4.${Date.now() % 255}`,
    });

    const response = await POST(request);
    expect(response.status).toBe(502);
  });

  it("returns a full plan with aiEnhanced true when the narrative succeeds", async () => {
    vi.mocked(geocodeCity).mockResolvedValue(LOCATION);
    vi.mocked(fetchAirQuality).mockResolvedValue(SNAPSHOT);
    vi.mocked(generateNarrative).mockResolvedValue("Here is your personalized plan.");

    const request = makeRequest(VALID_BODY, {
      "x-forwarded-for": `5.5.5.${Date.now() % 255}`,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.aiEnhanced).toBe(true);
    expect(data.aiNarrative).toBe("Here is your personalized plan.");
    expect(data.plan.categoryInfo.category).toBe("unhealthy");
    expect(data.airQuality.usAqi).toBe(180);
  });

  it("returns aiEnhanced false without failing when the narrative provider fails", async () => {
    vi.mocked(geocodeCity).mockResolvedValue(LOCATION);
    vi.mocked(fetchAirQuality).mockResolvedValue(SNAPSHOT);
    vi.mocked(generateNarrative).mockResolvedValue(null);

    const request = makeRequest(VALID_BODY, {
      "x-forwarded-for": `6.6.6.${Date.now() % 255}`,
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.aiEnhanced).toBe(false);
    expect(data.aiNarrative).toBeNull();
    expect(data.plan.routines.length).toBeGreaterThan(0);
  });

  it("rate-limits a client after too many requests in one window", async () => {
    vi.mocked(geocodeCity).mockResolvedValue(LOCATION);
    vi.mocked(fetchAirQuality).mockResolvedValue(SNAPSHOT);
    vi.mocked(generateNarrative).mockResolvedValue(null);

    const ip = `7.7.7.${Date.now() % 255}`;
    let lastStatus = 200;
    for (let i = 0; i < 25; i++) {
      const response = await POST(makeRequest(VALID_BODY, { "x-forwarded-for": ip }));
      lastStatus = response.status;
    }

    expect(lastStatus).toBe(429);
  });
});
